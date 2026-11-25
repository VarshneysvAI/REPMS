// Dev 3 (Shatakshi): Financial Overview (reads db.json via REPMS_STORE)
(function () {
  const { esc, money, csv, toast } = window.repms;
  const cards = document.querySelectorAll('.page-financial .cards .card h2');
  const tableBody = document.querySelector('.page-financial .table-panel tbody');
  const chartSelect = document.querySelector('.page-financial .panel-header select');
  const viewBtn = document.querySelector('.page-financial .view-btn');
  let unpaidOnly = false;

  const formatDate = (raw) => /^\d{4}-\d{2}-\d{2}$/.test(raw || '')
    ? new Date(raw + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    : (raw || 'Sep 01, 2026');

  function renderChart(months) {
    const cfg = REPMS_STORE.read().financialConfig || {};
    const data = (months === 12 ? cfg.revenueHistory12m : cfg.revenueHistory6m) || [];
    if (!data.length) return;
    const rev = REPMS_STORE.properties.getDashboardSummary().monthlyRev;
    const factor = rev ? rev / 1200000 : 1;
    const max = Math.max(...data.map(d => d.value));

    document.querySelector('.page-financial .bars')?.replaceChildren(...data.map(({ value, label }) => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.height = `${Math.round((value / max) * 90)}%`;
      bar.innerHTML = `<span>${money(Math.round(value * factor))}</span>`;
      bar.title = label;
      return bar;
    }));
    document.querySelector('.page-financial .months')?.replaceChildren(...data.map(({ label }) => {
      const span = document.createElement('span');
      span.textContent = label;
      return span;
    }));
  }

  function render() {
    const db = REPMS_STORE.read();
    const roll = REPMS_STORE.financials.getRentRoll();
    const rev = REPMS_STORE.properties.getDashboardSummary().monthlyRev;
    const amt = (r) => Number(r.totalDue || r.rent || 0);
    const paidTotal = roll.filter(r => r.status === 'Paid').reduce((s, r) => s + amt(r), 0);
    const overdue = roll.filter(r => r.status === 'Overdue').reduce((s, r) => s + amt(r), 0);
    const totalDue = roll.reduce((s, r) => s + amt(r), 0);
    const expenses = Number(db.financialConfig?.monthlyExpenses || 0);

    if (cards[0]) cards[0].textContent = money(rev);
    if (cards[1]) cards[1].textContent = money(expenses);
    if (cards[2]) cards[2].textContent = money(Math.max(0, rev - expenses));
    if (cards[3]) cards[3].textContent = `${(totalDue ? (paidTotal / totalDue) * 100 : 100).toFixed(1)}%`;

    const shown = unpaidOnly ? roll.filter(r => r.status !== 'Paid') : roll;
    if (viewBtn) viewBtn.textContent = unpaidOnly ? 'View All →' : 'Unpaid Only →';
    if (tableBody) {
      tableBody.innerHTML = shown.map(r => {
        const status = r.status || 'Pending';
        return `<tr data-invoice-id="${esc(r.invoiceId)}">
          <td>${esc(r.property)}</td><td>${esc(r.tenant)}</td><td>${money(amt(r))}</td><td>${esc(formatDate(r.dueDate))}</td>
          <td><span class="status ${status.toLowerCase()}" ${status !== 'Paid' ? 'role="button" tabindex="0" title="Click to mark paid"' : ''}>${esc(status)}</span></td>
        </tr>`;
      }).join('') || '<tr><td colspan="5" class="text-center py-4 text-muted">All invoices are settled!</td></tr>';
    }

    const overdueEl = document.querySelector('.page-financial .cards .card:nth-child(4) p');
    if (overdueEl) overdueEl.textContent = overdue ? `${money(overdue)} overdue` : 'No overdue balance';
    renderChart(chartSelect?.selectedIndex === 1 ? 12 : 6);
  }

  chartSelect?.addEventListener('change', () => renderChart(chartSelect.selectedIndex === 1 ? 12 : 6));
  viewBtn?.addEventListener('click', () => { unpaidOnly = !unpaidOnly; render(); });

  tableBody?.addEventListener('click', (e) => {
    const pill = e.target.closest('.status.pending, .status.overdue');
    const db = pill && REPMS_STORE.read();
    const inv = db?.rentRoll.find(r => r.invoiceId === pill.closest('tr')?.dataset.invoiceId);
    if (!inv) return;
    inv.status = 'Paid';
    REPMS_STORE.save(db, { property: inv.property, icon: 'bi-cash-stack text-success', event: `Payment reconciled: ${inv.tenant}`, status: 'Paid', badge: 'success', time: 'Just now' });
    toast('Payment reconciled!');
  });

  document.querySelector('.page-financial .export-btn')?.addEventListener('click', () => {
    csv('repms-rent-collection.csv', [['Property', 'Tenant', 'Rent', 'Due Date', 'Status'],
      ...REPMS_STORE.financials.getRentRoll().map(r => [r.property, r.tenant, r.totalDue || r.rent || 0, r.dueDate || '', r.status || 'Pending'])]);
    toast('Financial report exported!');
  });

  render();
  window.addEventListener('repms:change', render);
})();
