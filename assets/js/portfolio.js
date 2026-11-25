// Dev 1 (Shourya): Portfolio Directory & Interactive Unit Stacker (pages/portfolio.html)
(function () {
  const { byId, esc, money, shortMoney, modal, toast } = window.repms;
  const BADGE = { commercial: 'bg-primary', residential: 'bg-info', retail: 'bg-warning text-dark', industrial: 'bg-secondary' };
  let filter = 'all', stackPropId = 'PROP-001', tooltips = [];

  const fillForm = (form, data) => Object.entries(data).forEach(([k, v]) => { if (form[k]) form[k].value = v; });

  function renderStacker() {
    tooltips.forEach(t => t.dispose());
    tooltips = [];
    const prop = REPMS_STORE.properties.getUnitStack(stackPropId);
    if (!prop?.floors) return;

    const units = prop.floors.flatMap(f => f.units);
    byId('stackerTitle').textContent = `Building Unit Stacker — ${prop.name}`;
    byId('stackerSubtitle').textContent = `${prop.assetClass.toUpperCase()} • ${prop.floors.length} Floors • ${units.length} Suites • ${prop.occupancyRate}% Leased`;

    const counts = { legOccupied: 'occupied', legVacant: 'vacant', legRenovating: 'renovating', legDelinquent: 'delinquent' };
    Object.entries(counts).forEach(([id, status]) => { byId(id).textContent = units.filter(u => u.status === status).length; });

    const grid = byId('unitStackerGrid');
    grid.innerHTML = prop.floors.map(f => `
      <div class="rep-stacker__floor">
        <div class="rep-stacker__floor-label font-mono">${esc(f.floor)}</div>
        <div class="rep-stacker__units">
          ${f.units.map(u => `<div class="rep-unit rep-unit--${esc(u.status)}" style="flex:${u.flex || 1}" data-bs-toggle="tooltip"
            title="${esc(`Ste ${u.unit}: ${u.tenant} | ${u.sqft.toLocaleString()} sqft | ${money(u.rent)}/mo`)}"
            data-unit="${esc(u.unit)}" data-floor="${esc(f.floor)}">${esc(u.label || u.unit)}</div>`).join('')}
        </div>
      </div>`).join('');
    tooltips = [...grid.querySelectorAll('[data-bs-toggle="tooltip"]')].map(el => new bootstrap.Tooltip(el));
  }

  function render() {
    const all = REPMS_STORE.properties.getAll();
    document.querySelectorAll('#portfolioFilters [data-filter]').forEach(btn => {
      const f = btn.dataset.filter;
      const count = f === 'all' ? all.length : all.filter(p => p.assetClass === f).length;
      btn.textContent = `${f[0].toUpperCase() + f.slice(1)} (${count})`;
      btn.classList.toggle('active', f === filter);
    });

    const shown = REPMS_STORE.properties.getAll(filter);
    byId('propertyGrid').innerHTML = shown.length ? shown.map(p => {
      const bar = p.occupancyRate >= 90 ? 'success' : 'warning';
      return `<div class="col-xl-3 col-lg-4 col-md-6">
        <div class="rep-card h-100 d-flex flex-column p-0">
          <div class="position-relative">
            <img src="${esc(p.image)}" class="card-img-top object-fit-cover" alt="${esc(p.name)}" style="height:180px">
            <span class="position-absolute top-0 end-0 m-3 badge ${BADGE[p.assetClass] || 'bg-primary'}">${esc(p.assetClass[0].toUpperCase() + p.assetClass.slice(1))}</span>
          </div>
          <div class="p-4 flex-grow-1 d-flex flex-column">
            <h5 class="fw-bold mb-1" style="color:var(--color-text-heading)">${esc(p.name)}</h5>
            <p class="text-muted small mb-3"><i class="bi bi-geo-alt"></i> ${esc(p.address)}</p>
            <div class="d-flex justify-content-between mb-2 small fw-medium"><span class="text-muted">Occupancy</span><span class="font-mono text-${bar}">${p.occupancyRate}%</span></div>
            <div class="progress mb-4" style="height:6px;background:var(--color-bg-surface-hover)"><div class="progress-bar bg-${bar}" style="width:${p.occupancyRate}%"></div></div>
            <div class="mt-auto d-grid"><button class="btn btn-outline-secondary manage-asset-btn" data-prop-id="${esc(p.id)}">Manage Asset</button></div>
          </div>
        </div>
      </div>`;
    }).join('') : '<div class="col-12 text-center text-muted py-5">No properties in this asset class yet.</div>';

    byId('stackerPropertySelect').innerHTML = all.filter(p => p.floors?.length)
      .map(p => `<option value="${esc(p.id)}" ${p.id === stackPropId ? 'selected' : ''}>${esc(p.name)}</option>`).join('');
    renderStacker();
  }

  byId('portfolioFilters')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (btn) { filter = btn.dataset.filter; render(); }
  });
  byId('stackerPropertySelect')?.addEventListener('change', (e) => { stackPropId = e.target.value; renderStacker(); });

  byId('unitStackerGrid')?.addEventListener('click', (e) => {
    const tile = e.target.closest('[data-unit]');
    const prop = tile && REPMS_STORE.properties.getUnitStack(stackPropId);
    const unit = prop?.floors.flatMap(f => f.units).find(x => x.unit === tile.dataset.unit);
    if (!unit) return;
    byId('unitModalTitle').textContent = `${prop.name} — Suite ${unit.unit} (${tile.dataset.floor})`;
    byId('editUnitSqft').textContent = `${unit.sqft.toLocaleString()} sqft`;
    fillForm(byId('unitDetailForm'), unit);
    modal('unitDetailModal', true);
  });

  byId('unitDetailForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    REPMS_STORE.properties.updateUnit(stackPropId, d.unit, { tenant: d.tenant.trim() || 'VACANT AVAILABLE', rent: Number(d.rent) || 0, status: d.status });
    modal('unitDetailModal', false);
    toast(`Suite ${d.unit} updated!`);
  });

  byId('propertyGrid')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.manage-asset-btn');
    const p = btn && REPMS_STORE.properties.getById(btn.dataset.propId);
    if (!p) return;
    byId('assetModalTitle').textContent = p.name;
    byId('assetModalAddress').textContent = p.address;
    byId('assetModalVal').textContent = shortMoney(p.valuation);
    byId('assetModalCap').textContent = `${p.capRate}%`;
    fillForm(byId('assetDetailForm'), p);
    modal('assetDetailModal', true);
  });

  byId('assetDetailForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    REPMS_STORE.properties.update(d.id, { occupancyRate: Math.min(100, Math.max(0, Number(d.occupancyRate) || 0)), monthlyRevenue: Number(d.monthlyRevenue) || 0 });
    modal('assetDetailModal', false);
    toast('Property telemetry updated!');
  });

  byId('addPropertyForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    REPMS_STORE.properties.add({
      name: d.name.trim(), assetClass: d.assetClass, address: d.address.trim(),
      totalUnits: Number(d.totalUnits) || 10, occupancyRate: Number(d.occupancyRate) || 90,
      valuation: (Number(d.valuationM) || 10) * 1e6, monthlyRevenue: (Number(d.revK) || 100) * 1e3,
      capRate: 6.0, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop'
    });
    e.target.reset();
    modal('addPropertyModal', false);
    toast('New property added!');
  });

  render();
  window.addEventListener('repms:change', render);
})();
