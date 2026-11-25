// Dev 1 (Shourya): Shared Navbar/Footer Shell, Theme Toggle, Optional Login, Ctrl+K Search, and Alerts
(function () {
  const { byId, esc, toast } = window.repms;
  const BASE = /\/(pages|dev3)\//.test(location.pathname) ? '../' : './';
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', href: 'index.html' },
    { id: 'portfolio', label: 'Portfolio', icon: 'bi-building', href: 'pages/portfolio.html' },
    { id: 'tenants', label: 'Tenants', icon: 'bi-people', href: 'pages/tenants.html' },
    { id: 'leases', label: 'Leases', icon: 'bi-file-earmark-text', href: 'pages/leases.html' },
    { id: 'financials', label: 'Financials', icon: 'bi-cash-coin', href: 'dev3/financial.html' },
    { id: 'maintenance', label: 'Maintenance', icon: 'bi-tools', href: 'dev3/maintenance.html' },
    { id: 'leasing', label: 'Leasing', icon: 'bi-key', href: 'pages/leasing.html' },
    { id: 'analytics', label: 'Analytics', icon: 'bi-graph-up-arrow', href: 'pages/analytics.html' }
  ];

  // 1. Render shared navbar & footer once instead of duplicating 90 lines per HTML file
  const navHost = byId('appNav');
  if (navHost) {
    const active = navHost.dataset.page;
    const actionBtn = navHost.dataset.action ? '<button class="btn btn-primary btn-sm ms-lg-2 mt-2 mt-lg-0" data-bs-toggle="offcanvas" data-bs-target="#quickActionDrawer"><i class="bi bi-plus-lg"></i> Action</button>' : '';
    navHost.innerHTML = `<div class="container-fluid px-4">
      <a class="navbar-brand d-flex align-items-center gap-2 fw-bold" href="${BASE}index.html"><i class="bi bi-buildings-fill text-primary"></i> REPMS</a>
      <div class="d-flex align-items-center gap-3 d-lg-none">
        <button class="btn btn-link text-muted p-0 border-0 theme-toggle-btn" aria-label="Toggle theme"><i class="bi bi-moon-fill fs-5 theme-icon"></i></button>
        <button class="navbar-toggler border-0 p-0 text-muted" type="button" data-bs-toggle="collapse" data-bs-target="#topNavbar"><i class="bi bi-list fs-2"></i></button>
      </div>
      <div class="collapse navbar-collapse" id="topNavbar">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-1 mt-3 mt-lg-0">
          ${NAV_ITEMS.map(n => `<li class="nav-item"><a class="nav-link ${active === n.id ? 'active' : ''}" href="${BASE + n.href}"><i class="bi ${n.icon} me-1 d-none d-lg-inline"></i> ${n.label}</a></li>`).join('')}
        </ul>
        <div class="d-flex flex-column flex-lg-row align-items-lg-center gap-3 mt-3 mt-lg-0">
          <div class="d-flex align-items-center rounded px-3 py-1 search-wrapper">
            <i class="bi bi-search text-muted me-2"></i>
            <input type="text" class="bg-transparent border-0 w-100" placeholder="Search..." style="outline:none;font-size:.875rem;color:var(--color-text-main)">
            <kbd class="d-none d-md-block search-kbd">Ctrl K</kbd>
          </div>
          <div class="d-none d-lg-flex align-items-center gap-3">
            <button class="btn btn-link text-muted p-0 border-0 theme-toggle-btn" aria-label="Toggle theme"><i class="bi bi-moon-fill fs-5 theme-icon"></i></button>
            <div class="dropdown">
              <button class="btn btn-link text-muted p-0 border-0 position-relative" type="button" data-bs-toggle="dropdown" aria-label="Notifications">
                <i class="bi bi-bell fs-5"></i><span id="notifBadge" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size:.55rem">0</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow-sm border mt-2" id="notifMenu" style="min-width:260px"></ul>
            </div>
          </div>
          <div class="dropdown">
            <button class="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-2 w-100" type="button" data-bs-toggle="dropdown">
              <img src="https://i.pravatar.cc/32?img=47" alt="User" class="rounded-circle" width="32" height="32">
              <div class="text-start d-lg-none"><div class="fw-bold lh-1 user-name-label" style="font-size:.9rem;color:var(--color-text-heading)"></div><div class="text-muted user-role-label" style="font-size:.75rem"></div></div>
            </button>
            <ul class="dropdown-menu dropdown-menu-lg-end shadow-sm border mt-2 mt-lg-3" style="border-color:var(--color-border-card)!important;background:var(--color-bg-surface)">
              <li><div class="dropdown-item-text fw-bold d-none d-lg-block user-name-label"></div></li>
              <li><div class="dropdown-item-text text-muted small d-none d-lg-block mb-2 user-role-label"></div></li>
              <li><a class="dropdown-item" href="${BASE}index.html">Executive Dashboard</a></li>
              <li><hr class="dropdown-divider border-secondary"></li>
              <li><a class="dropdown-item text-danger signout-btn" href="${BASE}login.html">Sign Out</a></li>
            </ul>
          </div>
          ${actionBtn}
        </div>
      </div>
    </div>`;
  }
  const footerHost = byId('appFooter');
  if (footerHost) footerHost.innerHTML = '&copy; 2026 REPMS Enterprise. All rights reserved. Version 2.6.0.';

  // 2. Theme persistence
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    document.querySelectorAll('.theme-icon').forEach(i => {
      i.classList.toggle('bi-sun-fill', theme === 'dark');
      i.classList.toggle('bi-moon-fill', theme !== 'dark');
    });
  }
  applyTheme(localStorage.getItem('theme') || 'light');
  document.querySelectorAll('.theme-toggle-btn').forEach(btn =>
    btn.addEventListener('click', () => applyTheme(document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark'))
  );

  // 3. Login form & direct Dashboard entry (Sign Out redirects until Sign In)
  const loginForm = byId('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = byId('loginEmail').value.trim();
      const pass = byId('loginPassword').value;
      if (!email.includes('@') || pass.length < 4) return toast('Enter a valid email and password (min 4 chars).', 'danger');
      const name = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      REPMS_STORE.auth.login({ name, email, role: 'Senior Asset Director' });
      location.href = 'index.html';
    });
    return;
  }

  if (REPMS_STORE.auth.isSignedOut() && !location.pathname.endsWith('login.html')) { location.href = BASE + 'login.html'; return; }
  const user = REPMS_STORE.auth.getUser();
  document.querySelectorAll('.user-name-label').forEach(el => { el.textContent = user.name; });
  document.querySelectorAll('.user-role-label').forEach(el => { el.textContent = user.role; });
  document.querySelectorAll('.signout-btn').forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    REPMS_STORE.auth.logout();
    location.href = BASE + 'login.html';
  }));

  // 4. Global Search (Ctrl+K)
  const searchInput = document.querySelector('.search-wrapper input');
  if (searchInput) {
    const wrap = searchInput.closest('.search-wrapper');
    wrap.style.position = 'relative';
    const menu = Object.assign(document.createElement('div'), { className: 'dropdown-menu w-100 shadow-sm mt-1' });
    menu.style.top = '100%';
    wrap.appendChild(menu);

    document.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); searchInput.focus(); } });
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      if (q.length < 2) return menu.classList.remove('show');
      const hits = [
        ...NAV_ITEMS.filter(n => n.label.toLowerCase().includes(q)).map(n => ({ label: n.label, sub: 'Page', url: BASE + n.href })),
        ...REPMS_STORE.properties.getAll().filter(p => p.name.toLowerCase().includes(q)).map(p => ({ label: p.name, sub: p.assetClass, url: BASE + 'pages/portfolio.html' })),
        ...REPMS_STORE.tenants.getAll(q).map(t => ({ label: t.name, sub: t.unit, url: BASE + 'pages/tenants.html' }))
      ].slice(0, 6);
      menu.innerHTML = hits.length
        ? hits.map(h => `<a class="dropdown-item d-flex justify-content-between" href="${h.url}"><span>${esc(h.label)}</span><small class="text-muted">${esc(h.sub)}</small></a>`).join('')
        : '<span class="dropdown-item-text text-muted small">No matches found</span>';
      menu.classList.add('show');
    });
    document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) menu.classList.remove('show'); });
  }

  // 5. Notification Bell
  function renderAlerts() {
    const menu = byId('notifMenu'), badge = byId('notifBadge');
    if (!menu) return;
    const alerts = [
      ...REPMS_STORE.maintenance.getWorkOrders().filter(w => w.status !== 'Resolved').map(w => ({ title: w.issue, meta: `${w.property} • ${w.unit}`, url: BASE + 'dev3/maintenance.html' })),
      ...REPMS_STORE.properties.getDashboardSummary().escalations.map(e => ({ title: e.title, meta: e.location, url: BASE + 'pages/portfolio.html' }))
    ];
    if (badge) badge.textContent = alerts.length;
    menu.innerHTML = `<li class="dropdown-header fw-bold">Active Alerts (${alerts.length})</li>` +
      alerts.slice(0, 5).map(a => `<li><a class="dropdown-item small py-2" href="${a.url}"><div class="fw-semibold">${esc(a.title)}</div><div class="text-muted">${esc(a.meta)}</div></a></li>`).join('');
  }
  renderAlerts();
  window.addEventListener('repms:change', renderAlerts);
})();
