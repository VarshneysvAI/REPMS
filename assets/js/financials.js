// Dev 3 (Shatakshi): Financial Overview
(function () {
  const { esc, money, toast } = window.repms;
  const cards = document.querySelectorAll('.page-financial .cards .card h2');
  const tableBody = document.querySelector('.page-financial .table-panel tbody');
  const chartSelect = document.querySelector('.page-financial .panel-header select');
  const viewBtn = document.querySelector('.page-financial .view-btn');
  let unpaidOnly = false;

  function formatDueDate(raw) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw || '')) {
      return new Date(raw + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    }
    return raw || 'Sep 01, 2026';
  }

  function render() {
    const roll = REPMS_STORE.financials.getRentRoll();
    const monthlyRevenue = REPMS_STORE.properties.getDashboardSummary().monthlyRev;
    const paid = roll.filter(r => r.status === 'Paid');
    const paidTotal = paid.reduce((sum, r) => sum + Number(r.totalDue || r.rent || 0), 0);
    const overdue = roll.filter(r => r.status === 'Overdue').reduce((sum, r) => sum + Number(r.totalDue || r.rent || 0), 0);
    const totalDue = roll.reduce((sum, r) => sum + Number(r.totalDue || r.rent || 0), 0);
    const collection = totalDue ? (paidTotal / totalDue) * 100 : 100;
    const expenses = 382000;

    if (cards[0]) cards[0].textContent = money(monthlyRevenue);
    if (cards[1]) cards[1].textContent = money(expenses);
    if (cards[2]) cards[2].textContent = money(Math.max(0, monthlyRevenue - expenses));
    if (cards[3]) cards[3].textContent = `${collection.toFixed(1)}%`;

    const shown = unpaidOnly ? roll.filter(r => r.status !== 'Paid') : roll;
    if (viewBtn) viewBtn.textContent = unpaidOnly ? 'View All →' : 'Unpaid Only →';

    if (tableBody) {
      tableBody.innerHTML = shown.map(r => {
        const status = r.status || 'Pending';
        const statusClass = status.toLowerCase();
        const rent = Number(r.totalDue || r.rent || 0);
        return `<tr data-invoice-id="${esc(r.invoiceId)}">
          <td>${esc(r.property)}</td>
          <td>${esc(r.tenant)}</td>
          <td>${money(rent)}</td>
          <td>${esc(formatDueDate(r.dueDate))}</td>
          <td><span class="status ${statusClass}" ${status !== 'Paid' ? 'role="button" tabindex="0" title="Click to mark paid"' : ''}>${esc(status)}</span></td>
        </tr>`;
      }).join('') || '<tr><td colspan="5" class="text-center py-4 text-muted">All invoices are settled!</td></tr>';
    }

    const overdueText = document.querySelector('.page-financial .cards .card:nth-child(4) p');
    if (overdueText) overdueText.textContent = overdue ? `${money(overdue)} overdue` : 'No overdue balance';
  }

  function renderChart(months) {
    const monthlyRevenue = REPMS_STORE.properties.getDashboardSummary().monthlyRev;
    const factor = monthlyRevenue / 1200000;
    const datasets = {
      6: [[182000, 'Apr'], [205000, 'May'], [198000, 'Jun'], [224000, 'Jul'], [211000, 'Aug'], [242000, 'Sep']],
      12: [[146000, 'Oct'], [152000, 'Nov'], [168000, 'Dec'], [173000, 'Jan'], [166000, 'Feb'], [179000, 'Mar'], [182000, 'Apr'], [205000, 'May'], [198000, 'Jun'], [224000, 'Jul'], [211000, 'Aug'], [242000, 'Sep']]
    };
    const data = datasets[months];
    const max = Math.max(...data.map(d => d[0]));
    document.querySelector('.page-financial .bars')?.replaceChildren(...data.map(([value, label]) => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.height = `${Math.round((value * factor / max) * 90)}%`;
      bar.innerHTML = `<span>${money(Math.round(value * factor))}</span>`;
      bar.title = label;
      return bar;
    }));
    document.querySelector('.page-financial .months')?.replaceChildren(...data.map(([, label]) => {
      const span = document.createElement('span');
      span.textContent = label;
      return span;
    }));
  }

  chartSelect?.addEventListener('change', () => renderChart(chartSelect.selectedIndex === 0 ? 6 : 12));
  viewBtn?.addEventListener('click', () => { unpaidOnly = !unpaidOnly; render(); });
  renderChart(6);

  tableBody?.addEventListener('click', (event) => {
    const pill = event.target.closest('.status.pending, .status.overdue');
    if (!pill) return;
    const row = pill.closest('tr');
    const invoiceId = row?.dataset.invoiceId;
    const db = REPMS_STORE.read();
    const invoice = db.rentRoll.find(r => r.invoiceId === invoiceId);
    if (!invoice) return;
    invoice.status = 'Paid';
    REPMS_STORE.save(db, { property: invoice.property, icon: 'bi-cash-stack text-success', event: `Payment reconciled: ${invoice.tenant}`, status: 'Paid', badge: 'success', time: 'Just now' });
    toast('Payment reconciled!');
  });

  document.querySelector('.page-financial .export-btn')?.addEventListener('click', () => {
    const roll = REPMS_STORE.financials.getRentRoll();
    const rows = [['Property', 'Tenant', 'Rent', 'Due Date', 'Status'], ...roll.map(r => [
      r.property, r.tenant, r.totalDue || r.rent || 0, r.dueDate || '', r.status || 'Pending'
    ])];
    const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = Object.assign(document.createElement('a'), { href: url, download: 'repms-rent-collection.csv' });
    link.click();
    URL.revokeObjectURL(url);
    toast('Financial report exported!');
  });

  render();
  window.addEventListener('repms:change', render);
})();
