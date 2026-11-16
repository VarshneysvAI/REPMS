// Dev 1 (Shourya): Executive Dashboard (index.html)
(function () {
  const { byId, esc, shortMoney, toast } = window.repms;
  const CLASSES = [['residential', 'Residential', 'bg-primary'], ['commercial', 'Commercial', 'bg-success'], ['retail', 'Retail', 'bg-warning'], ['industrial', 'Industrial', 'bg-info']];

  function render() {
    const s = REPMS_STORE.properties.getDashboardSummary();
    const props = REPMS_STORE.properties.getAll();

    byId('dashSubtitle').textContent = `Real-time telemetry across ${s.propertyCount} flagship properties and ${s.totalUnits} units`;
    byId('kpiPortfolioValue').textContent = shortMoney(s.totalValue);
    byId('kpiOccupancy').textContent = `${s.avgOccupancy}%`;
    byId('kpiMonthlyRev').textContent = shortMoney(s.monthlyRev);
    byId('kpiNoi').textContent = shortMoney(s.noiYtd);
    byId('kpiOpenIssues').textContent = s.openIssuesCount;
    byId('kpiOpenIssuesTrend').textContent = `${s.criticalCount} Critical`;

    byId('assetOccupancyList').innerHTML = CLASSES.map(([key, label, color]) => {
      const list = props.filter(p => p.assetClass === key);
      if (!list.length) return '';
      const avg = Math.round(list.reduce((sum, p) => sum + Number(p.occupancyRate), 0) / list.length);
      return `<div>
        <div class="d-flex justify-content-between small mb-1">
          <span class="fw-medium">${label} (${list.length} ${list.length === 1 ? 'Property' : 'Properties'})</span>
          <span class="font-mono text-muted">${avg}%</span>
        </div>
        <div class="progress" style="height:6px;background:var(--color-bg-surface-hover)">
          <div class="progress-bar ${color}" style="width:${avg}%"></div>
        </div>
      </div>`;
    }).join('');

    byId('recentActivityBody').innerHTML = s.recentActivity.map(a => `
      <tr>
        <td class="px-4"><i class="bi ${esc(a.icon)} me-2"></i><span class="fw-medium">${esc(a.property)}</span></td>
        <td>${esc(a.event)}</td>
        <td><span class="badge bg-${esc(a.badge)}-subtle text-${esc(a.badge)} border border-${esc(a.badge)}">${esc(a.status)}</span></td>
        <td class="text-end text-muted small px-4">${esc(a.time)}</td>
      </tr>`).join('');

    const bg = { danger: 'var(--status-delinquent-bg)', warning: 'var(--status-renovating-bg)' };
    byId('urgentEscalationsList').innerHTML = s.escalations.map(e => `
      <div class="d-flex gap-3 align-items-start p-3 rounded" style="background:${bg[e.level] || bg.warning}">
        <div class="text-${esc(e.level)} mt-1"><i class="bi ${esc(e.icon)} fs-5"></i></div>
        <div><div class="fw-bold text-${esc(e.level)} mb-1">${esc(e.title)}</div><div class="text-muted small">${esc(e.location)}</div></div>
      </div>`).join('');
  }

  byId('exportReportBtn')?.addEventListener('click', () => {
    const s = REPMS_STORE.properties.getDashboardSummary();
    const csv = `Metric,Value\nPortfolio Value,${shortMoney(s.totalValue)}\nOccupancy,${s.avgOccupancy}%\nMonthly Rev,${shortMoney(s.monthlyRev)}\nNOI YTD,${shortMoney(s.noiYtd)}\nOpen Issues,${s.openIssuesCount}`;
    Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: 'repms-executive-report.csv' }).click();
    toast('Executive summary CSV exported!');
  });

  // Quick Action Drawer (1 handler map drives all 4 actions)
  const ACTIONS = {
    workOrder: { title: 'Create Work Order', label: 'Issue & Unit (e.g. HVAC - Unit 402)', btn: 'Submit Ticket', run: (p, v) => REPMS_STORE.maintenance.addWorkOrder({ property: p, unit: 'Main Unit', issue: v, priority: 'Critical' }) },
    payment:   { title: 'Log Manual Payment', label: 'Tenant & Amount (e.g. Apex Capital)', btn: 'Record Payment', run: (p, v) => REPMS_STORE.financials.addPayment({ property: p, tenant: v, totalDue: 5000 }) },
    tenant:    { title: 'Add New Tenant', label: 'Company / Tenant Name', btn: 'Onboard Tenant', run: (p, v) => REPMS_STORE.tenants.add({ name: v, property: p, unit: 'Assigned', monthlyRent: 12000 }) },
    notice:    { title: 'Generate Notice', label: 'Notice Subject', btn: 'Dispatch Notice', run: (p, v) => REPMS_STORE.properties.addActivity(p, `Notice Sent: ${v}`, 'Dispatched', 'info') }
  };

  let currentAction = null;
  const propSelect = byId('qaPropertySelect');
  if (propSelect) propSelect.innerHTML = REPMS_STORE.properties.getAll().map(p => `<option value="${esc(p.name)}">${esc(p.name)}</option>`).join('');

  document.querySelectorAll('[data-quick-action]').forEach(btn => btn.addEventListener('click', () => {
    currentAction = btn.dataset.quickAction;
    const cfg = ACTIONS[currentAction];
    byId('qaFormTitle').textContent = cfg.title;
    byId('qaInputLabel').textContent = cfg.label;
    byId('qaSubmitBtn').textContent = cfg.btn;
    byId('qaInputValue').value = '';
    byId('quickActionFormBox').classList.remove('d-none');
  }));

  byId('quickActionForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = byId('qaInputValue').value.trim();
    if (!val || !currentAction) return;
    ACTIONS[currentAction].run(propSelect.value, val);
    byId('quickActionFormBox').classList.add('d-none');
    bootstrap.Offcanvas.getInstance(byId('quickActionDrawer'))?.hide();
    toast(`${ACTIONS[currentAction].title} saved!`);
  });

  render();
  window.addEventListener('repms:change', render);
})();
