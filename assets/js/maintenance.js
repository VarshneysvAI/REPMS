// Dev 3 (Shatakshi): Maintenance and Work Orders
(function () {
  const { esc, shortMoney, toast } = window.repms;
  const filterPanel = document.querySelector('.page-maintenance .filter-panel');
  const searchInput = filterPanel?.querySelector('input');
  const selects = filterPanel?.querySelectorAll('select') || [];
  const tableBody = document.querySelector('.page-maintenance table tbody');
  const cards = document.querySelectorAll('.page-maintenance .cards .card h2');

  function normalizeStatus(status) {
    if (status === 'Resolved') return 'Completed';
    return status || 'Open';
  }

  function syncPropertyFilter(allOrders) {
    if (!selects[0]) return;
    const current = selects[0].value || 'All Properties';
    const names = [...new Set([
      ...REPMS_STORE.properties.getAll().map(p => p.name),
      ...allOrders.map(w => w.property)
    ].filter(Boolean))];
    selects[0].innerHTML = ['All Properties', ...names].map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('');
    selects[0].value = names.includes(current) ? current : 'All Properties';
  }

  function render() {
    const all = REPMS_STORE.maintenance.getWorkOrders();
    syncPropertyFilter(all);

    const search = (searchInput?.value || '').trim().toLowerCase();
    const property = selects[0]?.value || 'All Properties';
    const priority = selects[1]?.value || 'All Priorities';
    const status = selects[2]?.value || 'All Statuses';

    const orders = all.filter(order => {
      const text = `${order.id} ${order.property} ${order.unit} ${order.issue} ${order.assignedTo || ''}`.toLowerCase();
      return (!search || text.includes(search))
        && (property === 'All Properties' || order.property === property)
        && (priority === 'All Priorities' || order.priority === priority)
        && (status === 'All Statuses' || normalizeStatus(order.status) === status);
    });

    if (tableBody) {
      tableBody.innerHTML = orders.map(order => {
        const displayStatus = normalizeStatus(order.status);
        const statusClass = displayStatus === 'In Progress' ? 'progress-status' : displayStatus === 'Completed' ? 'completed-status' : 'open-status';
        const priorityClass = String(order.priority || 'Low').toLowerCase();
        return `<tr data-order-id="${esc(order.id)}">
          <td><strong>#${esc(order.id)}</strong><small>${esc(order.createdAt || 'Today')}</small></td>
          <td>${esc(order.property)}<small>${esc(order.unit || 'Main Unit')}</small></td>
          <td>${esc(order.issue)}</td>
          <td><span class="priority ${esc(priorityClass)}">${esc(order.priority || 'Low')}</span></td>
          <td>${esc(order.assignedTo || 'Unassigned')}</td>
          <td><span class="status ${statusClass}">${esc(displayStatus)}</span></td>
          <td><button type="button" class="action-btn" title="Advance work order status">•••</button></td>
        </tr>`;
      }).join('') || '<tr><td colspan="7" class="text-center py-4">No work orders match the selected filters.</td></tr>';
    }

    const openCount = all.filter(w => normalizeStatus(w.status) === 'Open').length;
    const progressCount = all.filter(w => normalizeStatus(w.status) === 'In Progress').length;
    const completedCount = all.filter(w => normalizeStatus(w.status) === 'Completed').length;
    const estCost = all.reduce((sum, w) => sum + Number(w.cost || (w.priority === 'Critical' ? 18500 : w.priority === 'High' ? 9200 : 4500)), 0);
    if (cards[0]) cards[0].textContent = openCount;
    if (cards[1]) cards[1].textContent = progressCount;
    if (cards[2]) cards[2].textContent = completedCount;
    if (cards[3]) cards[3].textContent = shortMoney(estCost);

    const summary = document.querySelectorAll('.page-maintenance .summary-row strong');
    if (summary.length === 3) {
      const categories = all.length ? all.reduce((acc, w) => {
        const category = w.category || (String(w.issue).toLowerCase().includes('inspection') ? 'Preventive' : String(w.priority).toLowerCase() === 'critical' ? 'Emergency' : 'General');
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {}) : { Preventive: 42, Emergency: 24, General: 34 };
      const pct = key => all.length ? Math.round((categories[key] || 0) / all.length * 100) : categories[key];
      summary[0].textContent = `${pct('Preventive')}%`;
      summary[1].textContent = `${pct('Emergency')}%`;
      summary[2].textContent = `${pct('General')}%`;
    }
  }

  searchInput?.addEventListener('input', render);
  selects.forEach(select => select.addEventListener('change', render));
  document.querySelector('.page-maintenance .view-btn')?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    selects.forEach(s => { s.selectedIndex = 0; });
    render();
  });

  tableBody?.addEventListener('click', (event) => {
    const button = event.target.closest('.action-btn');
    if (!button) return;
    const row = button.closest('tr');
    const id = row?.dataset.orderId;
    if (!id) return;
    const db = REPMS_STORE.read();
    const order = db.workOrders.find(w => w.id === id);
    if (!order) return;
    order.status = normalizeStatus(order.status) === 'Open' ? 'In Progress' : normalizeStatus(order.status) === 'In Progress' ? 'Resolved' : 'Open';
    REPMS_STORE.save(db, { property: order.property, icon: 'bi-tools text-primary', event: `${order.issue} advanced`, status: normalizeStatus(order.status), badge: 'info', time: 'Just now' });
    toast(`Work order marked ${normalizeStatus(order.status)}.`);
  });

  const propertySelect = document.getElementById('woProperty');
  if (propertySelect) {
    propertySelect.innerHTML = REPMS_STORE.properties.getAll().map(p => `<option value="${esc(p.name)}">${esc(p.name)}</option>`).join('');
  }

  document.querySelector('.page-maintenance .add-btn')?.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('createWorkOrderModal'));
    modal.show();
  });

  document.getElementById('createWorkOrderForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    REPMS_STORE.maintenance.addWorkOrder({
      property: data.property,
      unit: data.unit,
      issue: data.issue,
      priority: data.priority,
      assignedTo: data.assignedTo || 'Unassigned',
      category: data.priority === 'Critical' ? 'Emergency' : 'General'
    });
    bootstrap.Modal.getInstance(document.getElementById('createWorkOrderModal'))?.hide();
    event.currentTarget.reset();
    toast('Work order created!');
  });

  render();
  window.addEventListener('repms:change', render);
})();
