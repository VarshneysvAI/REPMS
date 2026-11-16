// REPMS Client-Side Data Store (localStorage) & Shared UI Helpers
const DB_KEY = 'REPMS_DATABASE_V1';
const USER_KEY = 'REPMS_USER';

const SEED_DATA = {
  properties: [
    {
      id: 'PROP-001', name: 'Skyline Executive Tower', assetClass: 'commercial', address: '100 Financial Dist, NY',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
      totalUnits: 48, occupancyRate: 95.8, capRate: 6.2, valuation: 52000000, monthlyRevenue: 480000,
      floors: [
        { floor: 'FL 12', units: [
          { unit: '1201', tenant: 'Apex Global', sqft: 3200, rent: 14500, status: 'occupied' },
          { unit: '1202', tenant: 'Horizon Legal', sqft: 2800, rent: 12800, status: 'occupied' },
          { unit: '1203', tenant: 'VACANT AVAILABLE', sqft: 3100, rent: 14000, status: 'vacant' },
          { unit: '1204', tenant: 'Quantum Labs', sqft: 3500, rent: 16000, status: 'occupied' }
        ]},
        { floor: 'FL 11', units: [
          { unit: '1101', tenant: 'Omega Partners', sqft: 3200, rent: 14200, status: 'occupied' },
          { unit: '1102', tenant: 'Turnaround (Expected Jun 1)', sqft: 2900, rent: 0, status: 'renovating' },
          { unit: '1103', tenant: 'Stellar Media', sqft: 3100, rent: 13500, status: 'occupied' },
          { unit: '1104', tenant: 'Nexus Corp', sqft: 3500, rent: 15500, status: 'occupied' }
        ]},
        { floor: 'FL 10', units: [
          { unit: '1001', label: '1001 (Full Half-Floor)', tenant: 'Cloud Systems', sqft: 6000, rent: 25000, status: 'occupied', flex: 2 },
          { unit: '1003', tenant: 'Vector AI', sqft: 3100, rent: 13000, status: 'occupied' },
          { unit: '1004', tenant: 'Delinquent - 60 Days Overdue', sqft: 3100, rent: 13200, status: 'delinquent' }
        ]},
        { floor: 'FL 09', units: [
          { unit: '901', label: '901 (Full Floor Tenant)', tenant: 'BlueOcean', sqft: 12600, rent: 52000, status: 'occupied' }
        ]},
        { floor: 'FL 08', units: [
          { unit: '801', tenant: 'VACANT AVAILABLE', sqft: 6000, rent: 24000, status: 'vacant', flex: 2 },
          { unit: '803', tenant: 'Vertex Capital', sqft: 3100, rent: 12500, status: 'occupied' },
          { unit: '804', tenant: 'Vertex Capital', sqft: 3500, rent: 14000, status: 'occupied' }
        ]}
      ]
    },
    {
      id: 'PROP-002', name: 'Oakwood Luxury Res', assetClass: 'residential', address: '400 Park Ave, NY',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop',
      totalUnits: 120, occupancyRate: 98.2, capRate: 5.4, valuation: 38400000, monthlyRevenue: 340000,
      floors: [
        { floor: 'FL 04', units: [
          { unit: '401', tenant: 'Sophia Chen', sqft: 1850, rent: 7200, status: 'occupied' },
          { unit: '402', tenant: 'Daniel Carter', sqft: 1650, rent: 5200, status: 'renovating' },
          { unit: '403', tenant: 'VACANT AVAILABLE', sqft: 1900, rent: 7400, status: 'vacant' }
        ]},
        { floor: 'FL 03', units: [
          { unit: '301', tenant: 'Elena Rostova', sqft: 1400, rent: 3850, status: 'occupied' },
          { unit: '302', tenant: 'Liam Vance', sqft: 1600, rent: 5100, status: 'occupied' }
        ]}
      ]
    },
    {
      id: 'PROP-003', name: 'Metro Central Galleria', assetClass: 'retail', address: '800 Broadway, NY',
      image: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=600&h=400&fit=crop',
      totalUnits: 42, occupancyRate: 88.0, capRate: 7.1, valuation: 24200000, monthlyRevenue: 210000, floors: []
    },
    {
      id: 'PROP-004', name: 'Logistics Park North', assetClass: 'industrial', address: '1000 Industrial Pkwy, NJ',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8ed745333c?w=600&h=400&fit=crop',
      totalUnits: 16, occupancyRate: 100.0, capRate: 6.8, valuation: 28200000, monthlyRevenue: 170000, floors: []
    }
  ],
  recentActivity: [
    { property: 'Skyline Tower', icon: 'bi-building text-primary', event: 'Lease Renewal: Apex Global', status: 'Completed', badge: 'success', time: '10m ago' },
    { property: 'Oakwood Res', icon: 'bi-house text-info', event: 'HVAC Failure (Unit 402)', status: 'Urgent', badge: 'danger', time: '1h ago' },
    { property: 'Metro Retail', icon: 'bi-shop text-warning', event: 'Rent Payment Overdue', status: 'Pending', badge: 'warning', time: '3h ago' }
  ],
  escalations: [
    { title: 'Water Leak (Major)', location: 'Oakwood Res - Tower B', level: 'danger', icon: 'bi-water' },
    { title: '2 Major Leases Expiring', location: 'Skyline Tower - Next 30 Days', level: 'warning', icon: 'bi-file-earmark-text' }
  ],
  tenants: [
    { id: 'TEN-101', name: 'Apex Capital LLC', property: 'Skyline Executive Tower', unit: 'Ste 1201', monthlyRent: 14500, paymentStatus: 'Active' },
    { id: 'TEN-102', name: 'Elena Rostova', property: 'Oakwood Luxury Res', unit: 'Unit 301', monthlyRent: 3850, paymentStatus: 'Active' },
    { id: 'TEN-103', name: 'Urban Goods Ltd.', property: 'Metro Central Galleria', unit: 'Bay 104', monthlyRent: 8600, paymentStatus: 'Delinquent' }
  ],
  leases: [
    { id: 'LSE-001', tenantName: 'Apex Capital LLC', unit: 'Ste 1201', stage: 'active', monthlyRent: 14500, endDate: '2028-12-31' },
    { id: 'LSE-002', tenantName: 'Horizon Legal', unit: 'Ste 1202', stage: 'renewal', monthlyRent: 12800, endDate: '2026-12-15' }
  ],
  rentRoll: [
    { invoiceId: 'INV-1001', property: 'Skyline Tower', tenant: 'Apex Capital LLC', totalDue: 14500, status: 'Paid' },
    { invoiceId: 'INV-1002', property: 'Metro Retail', tenant: 'Urban Goods Ltd.', totalDue: 8600, status: 'Overdue' }
  ],
  workOrders: [
    { id: 'WO-1048', property: 'Skyline Tower', unit: 'Unit 1204', issue: 'HVAC Failure', priority: 'Critical', status: 'In Progress' },
    { id: 'WO-1047', property: 'Oakwood Residences', unit: 'Unit 402', issue: 'Water Leak', priority: 'High', status: 'Open' },
    { id: 'WO-1046', property: 'Metro Galleria', unit: 'Unit 108', issue: 'Panel Breaker Fault', priority: 'Critical', status: 'Open' }
  ],
  vacancies: [{ id: 'VAC-1203', property: 'Skyline Executive Tower', unit: 'Ste 1203', category: 'commercial', sqft: 3100, monthlyRent: 14000 }],
  leads: [],
  esg: { energyStarScore: 92, solarGenerationKwh: 342000, gridConsumptionKwh: 618000, carbonOffsetTons: 1840 }
};

function readDB() {
  const saved = localStorage.getItem(DB_KEY);
  if (saved) return JSON.parse(saved);
  localStorage.setItem(DB_KEY, JSON.stringify(SEED_DATA));
  return JSON.parse(JSON.stringify(SEED_DATA));
}

function saveDB(db, activity) {
  if (activity) db.recentActivity = [activity, ...db.recentActivity].slice(0, 8);
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  window.dispatchEvent(new CustomEvent('repms:change', { detail: db }));
}

// Shared UI utilities
window.repms = {
  byId: (id) => document.getElementById(id),
  esc: (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
  money: (n) => '$' + Number(n || 0).toLocaleString('en-US'),
  shortMoney: (n) => n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : `$${Math.round(n / 1e3)}K`,
  toast(message, type = 'success') {
    let box = document.getElementById('repmsToastBox');
    if (!box) {
      box = Object.assign(document.createElement('div'), { id: 'repmsToastBox', className: 'toast-container position-fixed bottom-0 end-0 p-3' });
      box.style.zIndex = '1090';
      document.body.appendChild(box);
    }
    const el = Object.assign(document.createElement('div'), {
      className: `toast align-items-center text-bg-${type} border-0`,
      innerHTML: '<div class="d-flex"><div class="toast-body fw-medium"></div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>'
    });
    el.querySelector('.toast-body').textContent = message;
    box.appendChild(el);
    el.addEventListener('hidden.bs.toast', () => el.remove());
    new bootstrap.Toast(el, { delay: 2500 }).show();
  }
};

// Public repository API for all 4 developers
window.REPMS_STORE = {
  properties: {
    getAll: (type = 'all') => readDB().properties.filter(p => type === 'all' || p.assetClass === type),
    getById: (id) => readDB().properties.find(p => p.id === id),
    getUnitStack: (id = 'PROP-001') => {
      const list = readDB().properties;
      return list.find(p => p.id === id) || list.find(p => p.floors.length) || list[0];
    },
    add(prop) {
      const db = readDB();
      const item = { id: 'PROP-' + String(db.properties.length + 1).padStart(3, '0'), floors: [], ...prop };
      db.properties.unshift(item);
      saveDB(db, { property: item.name, icon: 'bi-building text-primary', event: 'New Property Onboarded', status: 'Active', badge: 'success', time: 'Just now' });
      return item;
    },
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
        totalValue: sum('valuation'),
        monthlyRev,
        noiYtd: monthlyRev * 7,
        totalUnits: sum('totalUnits'),
        propertyCount: props.length,
        avgOccupancy: props.length ? Number((sum('occupancyRate') / props.length).toFixed(1)) : 0,
        openIssuesCount: open.length,
        criticalCount: open.filter(w => w.priority === 'Critical').length,
        recentActivity: db.recentActivity,
        escalations: db.escalations
      };
    },
    addActivity(property, event, status = 'Logged', badge = 'info') {
      saveDB(readDB(), { property, icon: 'bi-lightning-charge text-primary', event, status, badge, time: 'Just now' });
    }
  },
  tenants: {
    getAll: (q = '') => readDB().tenants.filter(t => !q || (t.name + t.unit + t.property).toLowerCase().includes(q.toLowerCase())),
    add(tenant) {
      const db = readDB();
      const item = { id: 'TEN-' + (101 + db.tenants.length), paymentStatus: 'Active', ...tenant };
      db.tenants.unshift(item);
      saveDB(db, { property: item.property, icon: 'bi-person-plus text-info', event: `New Tenant: ${item.name}`, status: 'Onboarded', badge: 'success', time: 'Just now' });
      return item;
    }
  },
  leases: { getAll: (stage = 'all') => readDB().leases.filter(l => stage === 'all' || l.stage === stage) },
  financials: {
    getRentRoll: () => readDB().rentRoll,
    addPayment(payment) {
      const db = readDB();
      db.rentRoll.unshift({ invoiceId: 'INV-' + Date.now().toString().slice(-4), status: 'Paid', ...payment });
      saveDB(db, { property: payment.property, icon: 'bi-cash-stack text-success', event: `Payment Logged: ${payment.tenant}`, status: 'Paid', badge: 'success', time: 'Just now' });
    }
  },
  maintenance: {
    getWorkOrders: () => readDB().workOrders,
    addWorkOrder(order) {
      const db = readDB();
      const item = { id: 'WO-' + Math.floor(1000 + Math.random() * 9000), status: 'Open', ...order };
      db.workOrders.unshift(item);
      saveDB(db, { property: item.property, icon: 'bi-tools text-danger', event: `${item.issue} (${item.unit})`, status: item.priority, badge: item.priority === 'Critical' ? 'danger' : 'warning', time: 'Just now' });
      return item;
    }
  },
  leasing: {
    getVacancies: (cat = 'all') => readDB().vacancies.filter(v => cat === 'all' || v.category === cat),
    getLeads: () => readDB().leads
  },
  analytics: { getESG: () => readDB().esg },
  read: readDB,
  save: saveDB,
  auth: {
    getUser: () => JSON.parse(localStorage.getItem(USER_KEY) || 'null') || { name: 'Sarah Jenkins', email: 'sarah.jenkins@repms.io', role: 'Senior Asset Director' },
    login: (user) => { localStorage.setItem(USER_KEY, JSON.stringify(user)); sessionStorage.removeItem('REPMS_SIGNED_OUT'); },
    logout: () => { localStorage.removeItem(USER_KEY); sessionStorage.setItem('REPMS_SIGNED_OUT', '1'); },
    isSignedOut: () => sessionStorage.getItem('REPMS_SIGNED_OUT') === '1'
  }
};
