// Dev 1 (Shourya): Executive Dashboard (index.html)
(function () {
  const { byId, esc, shortMoney, csv, toast } = window.repms;
  const CLASSES = [
    { key: 'residential', label: 'Residential', color: 'bg-primary' },
    { key: 'commercial', label: 'Commercial', color: 'bg-success' },
    { key: 'retail', label: 'Retail', color: 'bg-warning' },
    { key: 'industrial', label: 'Industrial', color: 'bg-info' }
  ];

  function render() {
    const s = REPMS_STORE.properties.getDashboardSummary();
    const props = REPMS_STORE.properties.getAll();

    Object.entries({
      dashSubtitle: `Real-time telemetry across ${s.propertyCount} flagship properties and ${s.totalUnits} units`,
      kpiPortfolioValue: shortMoney(s.totalValue),
      kpiOccupancy: `${s.avgOccupancy}%`,
      kpiMonthlyRev: shortMoney(s.monthlyRev),
      kpiNoi: shortMoney(s.noiYtd),
      kpiOpenIssues: s.openIssuesCount,
      kpiOpenIssuesTrend: `${s.criticalCount} Critical`
    }).forEach(([id, text]) => { byId(id).textContent = text; });

    byId('assetOccupancyList').innerHTML = CLASSES.map(c => {
      const list = props.filter(p => p.assetClass === c.key);
      if (!list.length) return '';
      const avg = Math.round(list.reduce((sum, p) => sum + Number(p.occupancyRate), 0) / list.length);
      return `<div>
        <div class="d-flex justify-content-between small mb-1">
          <span class="fw-medium">${c.label} (${list.length} ${list.length === 1 ? 'Property' : 'Properties'})</span>
          <span class="font-mono text-muted">${avg}%</span>
        </div>
        <div class="progress" style="height:6px;background:var(--color-bg-surface-hover)"><div class="progress-bar ${c.color}" style="width:${avg}%"></div></div>
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

    const propSelect = byId('qaPropertySelect');
    if (propSelect && props.length) {
      const prev = propSelect.value;
      propSelect.innerHTML = props.map(p => `<option value="${esc(p.name)}">${esc(p.name)}</option>`).join('');
      if (prev) propSelect.value = prev;
    }
  }

  byId('exportReportBtn')?.addEventListener('click', () => {
    const s = REPMS_STORE.properties.getDashboardSummary();
    csv('repms-executive-report.csv', [
      ['Metric', 'Value'], ['Portfolio Value', shortMoney(s.totalValue)], ['Occupancy', `${s.avgOccupancy}%`],
      ['Monthly Rev', shortMoney(s.monthlyRev)], ['NOI YTD', shortMoney(s.noiYtd)], ['Open Issues', s.openIssuesCount]
    ]);
    toast('Executive summary CSV exported!');
  });

  const ACTIONS = {
    workOrder: { title: 'Create Work Order', label: 'Issue & Unit (e.g. HVAC - Unit 402)', btn: 'Submit Ticket', run: (p, v) => REPMS_STORE.maintenance.addWorkOrder({ property: p, unit: 'Main Unit', issue: v, priority: 'Critical' }) },
    payment:   { title: 'Log Manual Payment', label: 'Tenant & Amount (e.g. Apex Capital)', btn: 'Record Payment', run: (p, v) => REPMS_STORE.financials.addPayment({ property: p, tenant: v, totalDue: 5000 }) },
    tenant:    { title: 'Add New Tenant', label: 'Company / Tenant Name', btn: 'Onboard Tenant', run: (p, v) => REPMS_STORE.tenants.add({ name: v, property: p, unit: 'Assigned', monthlyRent: 12000 }) },
    notice:    { title: 'Generate Notice', label: 'Notice Subject', btn: 'Dispatch Notice', run: (p, v) => REPMS_STORE.properties.addActivity(p, `Notice Sent: ${v}`, 'Dispatched', 'info') }
  };

  let currentAction = null;
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
    ACTIONS[currentAction].run(byId('qaPropertySelect').value, val);
    byId('quickActionFormBox').classList.add('d-none');
    bootstrap.Offcanvas.getInstance(byId('quickActionDrawer'))?.hide();
    toast(`${ACTIONS[currentAction].title} saved!`);
  });

  render();
  window.addEventListener('repms:change', render);
})();
