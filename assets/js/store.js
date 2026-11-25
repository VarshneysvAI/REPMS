// REPMS Data Store: fetches db.json, persists mutations in localStorage, exposes window.REPMS_STORE & window.repms.
const DB_KEY = 'REPMS_DATABASE_V1';
const USER_KEY = 'REPMS_USER';
const BASE_PATH = /\/(pages|dev3)\//.test(location.pathname) ? '../' : './';

const emptyDB = () => ({
  properties: [], recentActivity: [], escalations: [], tenants: [], leases: [],
  rentRoll: [], financialConfig: {}, workOrders: [], vacancies: [], leads: [], esg: {}
});

function readDB() {
  const saved = localStorage.getItem(DB_KEY);
  return saved ? JSON.parse(saved) : emptyDB();
}

function saveDB(db, activity) {
  if (activity) db.recentActivity = [activity, ...db.recentActivity].slice(0, 8);
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  window.dispatchEvent(new CustomEvent('repms:change', { detail: db }));
}

function pushItem(key, item, property, event, status, badge, icon) {
  const db = readDB();
  db[key].unshift(item);
  saveDB(db, { property, icon, event, status, badge, time: 'Just now' });
  return item;
}

async function fetchDatabase() {
  try {
    const res = await fetch(BASE_PATH + 'db.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const remote = await res.json();
    const saved = localStorage.getItem(DB_KEY);
    localStorage.setItem(DB_KEY, JSON.stringify(saved ? { ...remote, ...JSON.parse(saved) } : remote));
  } catch (err) {
    console.error('Failed to fetch db.json:', err);
    if (location.protocol === 'file:') window.repms?.toast('Open via Live Server or Vercel for db.json fetch.', 'warning');
  }
  window.dispatchEvent(new CustomEvent('repms:change', { detail: readDB() }));
}

window.repms = {
  byId: (id) => document.getElementById(id),
  esc: (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
  money: (n) => '$' + Number(n || 0).toLocaleString('en-US'),
  shortMoney: (n) => n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : `$${Math.round(n / 1e3)}K`,
  modal: (id, open = true) => bootstrap.Modal.getOrCreateInstance(document.getElementById(id))[open ? 'show' : 'hide'](),
  csv(filename, rows) {
    const text = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  },
  toast(message, type = 'success') {
    let box = document.getElementById('repmsToastBox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'repmsToastBox';
      box.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      box.style.zIndex = '1090';
      document.body.appendChild(box);
    }
    const el = document.createElement('div');
    el.className = `toast align-items-center text-bg-${type} border-0`;
    el.innerHTML = '<div class="d-flex"><div class="toast-body fw-medium"></div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>';
    el.querySelector('.toast-body').textContent = message;
    box.appendChild(el);
    el.addEventListener('hidden.bs.toast', () => el.remove());
    new bootstrap.Toast(el, { delay: 2500 }).show();
  }
};

window.REPMS_STORE = {
  ready: null,
  read: readDB,
  save: saveDB,
  async reset() { localStorage.removeItem(DB_KEY); await fetchDatabase(); },
  properties: {
    getAll: (type = 'all') => readDB().properties.filter(p => type === 'all' || p.assetClass === type),
    getById: (id) => readDB().properties.find(p => p.id === id),
    getUnitStack(id = 'PROP-001') {
      const list = readDB().properties;
      return list.find(p => p.id === id) || list.find(p => p.floors?.length) || list[0];
    },
    add: (prop) => pushItem('properties', { id: 'PROP-' + String(readDB().properties.length + 1).padStart(3, '0'), floors: [], ...prop }, prop.name, 'New Property Onboarded', 'Active', 'success', 'bi-building text-primary'),
    update(id, patch) {
      const db = readDB();
      const prop = db.properties.find(p => p.id === id);
      if (prop) { Object.assign(prop, patch); saveDB(db); }
      return prop;
    },
    updateUnit(propId, unitNum, patch) {
      const db = readDB();
      const prop = db.properties.find(p => p.id === propId);
      const units = prop?.floors.flatMap(f => f.units) || [];
      const unit = units.find(u => u.unit === unitNum);
      if (!unit) return null;
      Object.assign(unit, patch);
      if (units.length) prop.occupancyRate = Number(((units.filter(u => u.status === 'occupied').length / units.length) * 100).toFixed(1));
      saveDB(db, { property: prop.name, icon: 'bi-building text-info', event: `Suite ${unitNum} marked ${unit.status}`, status: 'Updated', badge: 'primary', time: 'Just now' });
      return unit;
    },
    getDashboardSummary() {
      const db = readDB();
      const props = db.properties;
      const sum = (k) => props.reduce((acc, p) => acc + Number(p[k] || 0), 0);
      const monthlyRev = sum('monthlyRevenue');
      const open = db.workOrders.filter(w => w.status !== 'Resolved');
      return {
        totalValue: sum('valuation'), monthlyRev, noiYtd: monthlyRev * 7, totalUnits: sum('totalUnits'),
        propertyCount: props.length, avgOccupancy: props.length ? Number((sum('occupancyRate') / props.length).toFixed(1)) : 0,
        openIssuesCount: open.length, criticalCount: open.filter(w => w.priority === 'Critical').length,
        recentActivity: db.recentActivity, escalations: db.escalations
      };
    },
    addActivity: (property, event, status = 'Logged', badge = 'info') => saveDB(readDB(), { property, icon: 'bi-lightning-charge text-primary', event, status, badge, time: 'Just now' })
  },
  tenants: {
    getAll: (q = '') => readDB().tenants.filter(t => !q || (t.name + t.unit + t.property).toLowerCase().includes(q.toLowerCase())),
    add: (t) => pushItem('tenants', { id: 'TEN-' + (101 + readDB().tenants.length), paymentStatus: 'Active', ...t }, t.property, `New Tenant: ${t.name}`, 'Onboarded', 'success', 'bi-person-plus text-info')
  },
  leases: { getAll: (stage = 'all') => readDB().leases.filter(l => stage === 'all' || l.stage === stage) },
  financials: {
    getRentRoll: () => readDB().rentRoll,
    addPayment: (p) => pushItem('rentRoll', { invoiceId: 'INV-' + Date.now().toString().slice(-4), status: 'Paid', dueDate: 'Today', ...p }, p.property, `Payment Logged: ${p.tenant}`, 'Paid', 'success', 'bi-cash-stack text-success')
  },
  maintenance: {
    getWorkOrders: () => readDB().workOrders,
    addWorkOrder: (o) => pushItem('workOrders', { id: 'WO-' + Math.floor(1000 + Math.random() * 9000), status: 'Open', ...o }, o.property, `${o.issue} (${o.unit})`, o.priority, o.priority === 'Critical' ? 'danger' : 'warning', 'bi-tools text-danger')
  },
  leasing: {
    getVacancies: (cat = 'all') => readDB().vacancies.filter(v => cat === 'all' || v.category === cat),
    getLeads: () => readDB().leads
  },
  analytics: { getESG: () => readDB().esg },
  auth: {
    getUser: () => JSON.parse(localStorage.getItem(USER_KEY) || 'null') || { name: 'Sarah Jenkins', email: 'sarah.jenkins@repms.io', role: 'Senior Asset Director' },
    login: (user) => { localStorage.setItem(USER_KEY, JSON.stringify(user)); sessionStorage.removeItem('REPMS_SIGNED_OUT'); },
    logout: () => { localStorage.removeItem(USER_KEY); sessionStorage.setItem('REPMS_SIGNED_OUT', '1'); },
    isSignedOut: () => sessionStorage.getItem('REPMS_SIGNED_OUT') === '1'
  }
};

window.REPMS_STORE.ready = fetchDatabase();
