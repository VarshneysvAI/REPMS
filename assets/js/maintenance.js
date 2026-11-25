// Dev 3 (Shatakshi): Maintenance & Work Orders (reads db.json via REPMS_STORE)
(function () {
  const { byId, esc, shortMoney, modal, toast } = window.repms;
  const filterPanel = document.querySelector('.page-maintenance .filter-panel');
  const searchInput = filterPanel?.querySelector('input');
  const selects = filterPanel?.querySelectorAll('select') || [];
  const tableBody = document.querySelector('.page-maintenance table tbody');
  const cards = document.querySelectorAll('.page-maintenance .cards .card h2');
  const normalizeStatus = (s) => s === 'Resolved' ? 'Completed' : (s || 'Open');

  function syncPropertySelects(allOrders) {
    const props = REPMS_STORE.properties.getAll();
    const woProp = byId('woProperty');
    if (woProp && props.length) {
      const prev = woProp.value;
      woProp.innerHTML = props.map(p => `<option value="${esc(p.name)}">${esc(p.name)}</option>`).join('');
      if (prev) woProp.value = prev;
    }
    if (selects[0]) {
      const cur = selects[0].value || 'All Properties';
      const names = [...new Set([...props.map(p => p.name), ...allOrders.map(w => w.property)].filter(Boolean))];
      selects[0].innerHTML = ['All Properties', ...names].map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('');
      selects[0].value = names.includes(cur) ? cur : 'All Properties';
    }
  }

  function render() {
    const all = REPMS_STORE.maintenance.getWorkOrders();
    syncPropertySelects(all);

    const q = (searchInput?.value || '').trim().toLowerCase();
    const [prop, prio, stat] = [selects[0]?.value || 'All Properties', selects[1]?.value || 'All Priorities', selects[2]?.value || 'All Statuses'];
    const orders = all.filter(o =>
      (!q || `${o.id} ${o.property} ${o.unit} ${o.issue} ${o.assignedTo || ''}`.toLowerCase().includes(q)) &&
      (prop === 'All Properties' || o.property === prop) &&
      (prio === 'All Priorities' || o.priority === prio) &&
      (stat === 'All Statuses' || normalizeStatus(o.status) === stat)
    );

    const cls = { Open: 'open-status', 'In Progress': 'progress-status', Completed: 'completed-status' };
    if (tableBody) {
      tableBody.innerHTML = orders.map(o => {
        const st = normalizeStatus(o.status);
        return `<tr data-order-id="${esc(o.id)}">
          <td><strong>#${esc(o.id)}</strong><small>${esc(o.createdAt || 'Today')}</small></td>
          <td>${esc(o.property)}<small>${esc(o.unit || 'Main Unit')}</small></td>
          <td>${esc(o.issue)}</td>
          <td><span class="priority ${esc(String(o.priority || 'Low').toLowerCase())}">${esc(o.priority || 'Low')}</span></td>
          <td>${esc(o.assignedTo || 'Unassigned')}</td>
          <td><span class="status ${cls[st] || 'open-status'}">${esc(st)}</span></td>
          <td><button type="button" class="action-btn" title="Advance work order status">•••</button></td>
        </tr>`;
      }).join('') || '<tr><td colspan="7" class="text-center py-4">No work orders match the selected filters.</td></tr>';
    }

    const countBy = (st) => all.filter(w => normalizeStatus(w.status) === st).length;
    const cost = all.reduce((s, w) => s + Number(w.cost || (w.priority === 'Critical' ? 18500 : w.priority === 'High' ? 9200 : 4500)), 0);
    if (cards[0]) cards[0].textContent = countBy('Open');
    if (cards[1]) cards[1].textContent = countBy('In Progress');
    if (cards[2]) cards[2].textContent = countBy('Completed');
    if (cards[3]) cards[3].textContent = shortMoney(cost);

    const summary = document.querySelectorAll('.page-maintenance .summary-row strong');
    if (summary.length === 3) {
      const cats = all.reduce((acc, w) => {
        const c = w.category || (String(w.issue).toLowerCase().includes('inspection') ? 'Preventive' : String(w.priority).toLowerCase() === 'critical' ? 'Emergency' : 'General');
        acc[c] = (acc[c] || 0) + 1;
        return acc;
      }, {});
      const pct = (k, def) => all.length ? Math.round((cats[k] || 0) / all.length * 100) : def;
      summary[0].textContent = `${pct('Preventive', 42)}%`;
      summary[1].textContent = `${pct('Emergency', 24)}%`;
      summary[2].textContent = `${pct('General', 34)}%`;
    }
  }

  searchInput?.addEventListener('input', render);
  selects.forEach(s => s.addEventListener('change', render));
  document.querySelector('.page-maintenance .view-btn')?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    selects.forEach(s => { s.selectedIndex = 0; });
    render();
  });

  tableBody?.addEventListener('click', (e) => {
    const id = e.target.closest('.action-btn')?.closest('tr')?.dataset.orderId;
    const db = id && REPMS_STORE.read();
    const order = db?.workOrders.find(w => w.id === id);
    if (!order) return;
    const cur = normalizeStatus(order.status);
    order.status = cur === 'Open' ? 'In Progress' : cur === 'In Progress' ? 'Resolved' : 'Open';
    REPMS_STORE.save(db, { property: order.property, icon: 'bi-tools text-primary', event: `${order.issue} advanced`, status: normalizeStatus(order.status), badge: 'info', time: 'Just now' });
    toast(`Work order marked ${normalizeStatus(order.status)}.`);
  });

  document.querySelector('.page-maintenance .add-btn')?.addEventListener('click', () => modal('createWorkOrderModal', true));
  byId('createWorkOrderForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    REPMS_STORE.maintenance.addWorkOrder({
      property: d.property, unit: d.unit, issue: d.issue, priority: d.priority,
      assignedTo: d.assignedTo || 'Unassigned', category: d.priority === 'Critical' ? 'Emergency' : 'General'
    });
    modal('createWorkOrderModal', false);
    e.currentTarget.reset();
    toast('Work order created!');
  });

  render();
  window.addEventListener('repms:change', render);
})();
