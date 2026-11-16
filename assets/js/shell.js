// Dev 1 (Shourya): App Shell — Theme, Auth, Ctrl+K Search, and Alerts
(function () {
  const { byId, esc, toast } = window.repms;
  const BASE = /\/(pages|dev3)\//.test(location.pathname) ? '../' : './';

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

  // Login Page
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

  // Auth Guard & User Label
  if (REPMS_STORE.auth.isSignedOut() && !location.pathname.endsWith('login.html')) {
    location.href = BASE + 'login.html';
    return;
  }

  const user = REPMS_STORE.auth.getUser();
  document.querySelectorAll('.user-name-label').forEach(el => el.textContent = user.name);
  document.querySelectorAll('.user-role-label').forEach(el => el.textContent = user.role);
  document.querySelectorAll('.signout-btn').forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    REPMS_STORE.auth.logout();
    location.href = BASE + 'login.html';
  }));

  // Global Search (Ctrl + K)
  const searchInput = document.querySelector('.search-wrapper input');
  if (searchInput) {
    const wrap = searchInput.closest('.search-wrapper');
    wrap.style.position = 'relative';
    const menu = Object.assign(document.createElement('div'), { className: 'dropdown-menu w-100 shadow-sm mt-1' });
    menu.style.top = '100%';
    wrap.appendChild(menu);

    const pages = [
      ['Executive Dashboard', 'Page', 'index.html'], ['Portfolio & Stacker', 'Page', 'pages/portfolio.html'],
      ['Tenant Directory', 'Page', 'pages/tenants.html'], ['Lease Lifecycle', 'Page', 'pages/leases.html'],
      ['Financials', 'Page', 'dev3/financial.html'], ['Maintenance', 'Page', 'dev3/maintenance.html'],
      ['Leasing CRM', 'Page', 'pages/leasing.html'], ['ESG Analytics', 'Page', 'pages/analytics.html']
    ].map(([label, sub, path]) => ({ label, sub, url: BASE + path }));

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); searchInput.focus(); }
    });

    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      if (q.length < 2) return menu.classList.remove('show');
      const hits = [
        ...pages.filter(p => p.label.toLowerCase().includes(q)),
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

  // Notification Bell
  function renderAlerts() {
    const menu = byId('notifMenu'), badge = byId('notifBadge');
    if (!menu) return;
    const alerts = [
      ...REPMS_STORE.maintenance.getWorkOrders().filter(w => w.status !== 'Resolved').map(w => ({ t: w.issue, m: `${w.property} • ${w.unit}`, u: BASE + 'dev3/maintenance.html' })),
      ...REPMS_STORE.properties.getDashboardSummary().escalations.map(e => ({ t: e.title, m: e.location, u: BASE + 'pages/portfolio.html' }))
    ];
    if (badge) badge.textContent = alerts.length;
    menu.innerHTML = `<li class="dropdown-header fw-bold">Active Alerts (${alerts.length})</li>` +
      alerts.slice(0, 5).map(a => `<li><a class="dropdown-item small py-2" href="${a.u}"><div class="fw-semibold">${esc(a.t)}</div><div class="text-muted">${esc(a.m)}</div></a></li>`).join('');
  }

  renderAlerts();
  window.addEventListener('repms:change', renderAlerts);
})();
