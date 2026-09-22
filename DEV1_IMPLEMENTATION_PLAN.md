# DEV 1 IMPLEMENTATION PLAN — Lead Architect & Core Shell
## Real Estate Property Management System (REPMS)

> **Owner:** Dev 1 (Lead Architect / Shourya)  
> **Focus:** Design System Foundation, App Shell, `index.html` (Executive Dashboard), and `pages/portfolio.html` (Portfolio & Interactive Unit Stacker).  
> **Tech Stack:** HTML5, CSS3, Bootstrap 5.3 CDN, Bootstrap Icons CDN, Google Fonts (Plus Jakarta Sans, Inter, JetBrains Mono).  
> **Scope:** Strictly frontend UI prototype (No backend, zero node build step required).

---

## 📋 Table of Contents
1. [Design Direction & Theme Tokens](#1-design-direction--theme-tokens)
2. [Files Owned by Dev 1](#2-files-owned-by-dev-1)
3. [Step 1: Fix CSS Tokens & Setup Environment](#step-1-fix-css-tokens--setup-environment)
4. [Step 2: Build Base Reset & App Shell Layout](#step-2-build-base-reset--app-shell-layout)
5. [Step 3: Master CSS Aggregator (`main.css`)](#step-3-master-css-aggregator-maincss)
6. [Step 4: Build `index.html` (Executive Dashboard)](#step-4-build-indexhtml-executive-dashboard)
7. [Step 5: Build `pages/portfolio.html` & Unit Stacker](#step-5-build-pagesportfoliohtml--unit-stacker)
8. [Step 6: Reusable Shell Boilerplate for Devs 2, 3, 4](#step-6-reusable-shell-boilerplate-for-devs-2-3-4)
9. [Step-by-Step Execution Checklist](#step-by-step-execution-checklist)

---

## 1. Design Direction & Theme Tokens

### Visual Theme: *"Obsidian Executive & Emerald Yield"*
Derived from `.skills/ui-ux-pro-max`, `frontend-design`, and modern high-density financial platforms:
- **Base Canvas:** Deep Obsidian (`#0B0F17`)
- **App Shell & Sidebars:** Midnight Slate (`#111827`)
- **Surfaces & Cards:** Elevated Slate (`#1E293B`) with subtle border (`1px solid rgba(255, 255, 255, 0.08)`)
- **Primary Brand / Authority:** Azure Blue (`#2563EB`)
- **Financial Health / Positive Yield / Occupied:** Emerald Green (`#10B981`)
- **Attention / Maintenance / Under Renovation:** Warm Amber (`#F59E0B`)
- **Delinquent / Overdue / Urgent Alert:** Crimson Rose (`#EF4444`)
- **Vacant Available:** Electric Mint (`#06B6D4` or `#34D399`)

### Typography Hierarchy:
```html
<!-- Google Fonts CDN -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
```
- **Display Headings (`h1`, `h2`, `h3`):** `'Plus Jakarta Sans'`, sans-serif
- **Interface & Body Text:** `'Inter'`, -apple-system, sans-serif
- **Financial Metrics, SQFT, NOI, Unit Numbers:** `'JetBrains Mono'`, monospace

### CDN Dependencies:
```html
<!-- Bootstrap 5.3.3 CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<!-- Bootstrap Icons 1.11.3 -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
<!-- Bootstrap 5.3.3 JS Bundle (placed before </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

---

## 2. Files Owned by Dev 1

```
Mini project 2 REPMS/
├── index.html                           # Executive Master Dashboard
├── pages/
│   └── portfolio.html                   # Multi-Asset Directory & Interactive Unit Stacker
└── assets/
    └── css/
        ├── main.css                     # Master stylesheet aggregator
        ├── tokens/
        │   ├── primitives.css           # Fix :root wrapping & add dark obsidian values
        │   └── semantic.css             # Fix :root wrapping & map enterprise theme
        ├── base/
        │   ├── reset.css                # CSS Reset & base styles
        │   └── layout.css               # App Shell (Sidebar, Topbar, Main Content Area)
        └── pages/
            ├── dashboard.css            # Scoped to .page-dashboard
            └── portfolio.css            # Scoped to .page-portfolio
```

---

## Step 1: Fix CSS Tokens & Setup Environment

### A. Fix `assets/css/tokens/primitives.css`
Wrap all primitive values in `:root { ... }` so they function across browsers. Include the Obsidian and font families:
```css
:root {
  /* Obsidian Dark Surfaces */
  --color-obsidian-950: #06090E;
  --color-obsidian-900: #0B0F17;
  --color-obsidian-850: #111827;
  --color-obsidian-800: #1E293B;
  --color-obsidian-700: #334155;
  --color-border-subtle: rgba(255, 255, 255, 0.08);
  --color-border-focus:  rgba(37, 99, 235, 0.5);

  /* Fonts */
  --font-heading: 'Plus Jakarta Sans', -apple-system, sans-serif;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', Consolas, monospace;

  /* Color Scales (Blue, Green, Amber, Red, Neutral - keep existing values inside :root) */
  --color-blue-500: #3B82F6;
  --color-blue-600: #2563EB;
  --color-emerald-500: #10B981;
  --color-amber-500: #F59E0B;
  --color-rose-500: #EF4444;
  --color-cyan-500: #06B6D4;

  /* Layout dimensions */
  --sidebar-width: 260px;
  --sidebar-collapsed-width: 76px;
  --topbar-height: 68px;
}
```

### B. Fix `assets/css/tokens/semantic.css`
Wrap semantic aliases inside `:root { ... }`:
```css
@import './primitives.css';

:root {
  /* Dark Enterprise Surfaces */
  --color-bg-canvas: var(--color-obsidian-900);
  --color-bg-sidebar: var(--color-obsidian-850);
  --color-bg-surface: var(--color-obsidian-800);
  --color-bg-surface-hover: #26354A;
  --color-border-card: var(--color-border-subtle);

  /* Text colors */
  --color-text-main: #F8FAFC;
  --color-text-muted: #94A3B8;
  --color-text-inverse: #0B0F17;

  /* Status Colors */
  --status-occupied: var(--color-blue-600);
  --status-occupied-bg: rgba(37, 99, 235, 0.15);
  --status-vacant: var(--color-emerald-500);
  --status-vacant-bg: rgba(16, 185, 129, 0.15);
  --status-renovating: var(--color-amber-500);
  --status-renovating-bg: rgba(245, 158, 11, 0.15);
  --status-delinquent: var(--color-rose-500);
  --status-delinquent-bg: rgba(239, 68, 68, 0.15);
}
```

---

## Step 2: Build Base Reset & App Shell Layout

### A. `assets/css/base/reset.css`
Standard normalize reset:
- `box-sizing: border-box` on all elements.
- Body background set to `var(--color-bg-canvas)` and text color `var(--color-text-main)`.
- Smooth scroll and responsive image behavior.

### B. `assets/css/base/layout.css`
Defines the modern grid and flex app shell:
- `.rep-app-shell`: Flex container containing `.rep-sidebar` and `.rep-main-wrapper`.
- `.rep-sidebar`:
  - Fixed/sticky left navigation (`width: var(--sidebar-width)`, `height: 100vh`, `background: var(--color-bg-sidebar)`).
  - Brand header (`.rep-sidebar__brand`) with logo icon and title.
  - Navigation menu list (`.rep-nav`) with items and links (`.rep-nav__link`).
  - Active state `.rep-nav__link.active`: Accent left-border indicator, subtle background tint, bright text.
  - Sidebar bottom card: Logged-in property manager widget (Avatar, "Sarah Jenkins", "Senior Asset Director", status indicator).
- `.rep-main-wrapper`:
  - `flex: 1`, `margin-left: var(--sidebar-width)`, minimum width 0.
- `.rep-topbar`:
  - Sticky top header (`height: var(--topbar-height)`, `background: rgba(17, 24, 39, 0.8)`, `backdrop-filter: blur(12px)`).
  - Left: Breadcrumb / Page Title + Mobile hamburger toggle (`d-lg-none`).
  - Middle: Search input bar with keyboard badge `<kbd class="rep-kbd">Ctrl K</kbd>`.
  - Right: Quick Asset Dropdown ("All Assets - 42 Properties"), Notifications Bell with badge count, and "Quick Action" button.
- `.app-main`:
  - Main scrollable content body with standard padding (`padding: 1.75rem`).
- Responsive behavior:
  - Below `992px` (Bootstrap `lg` breakpoint), the sidebar translates off-screen (`transform: translateX(-100%)`) or becomes an offcanvas drawer, while hamburger button becomes visible.

---

## Step 3: Master CSS Aggregator (`main.css`)

Create `assets/css/main.css` to import all sub-stylesheets in strict order:
```css
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

/* Layer 1: Tokens */
@import './tokens/primitives.css';
@import './tokens/semantic.css';

/* Layer 2: Base */
@import './base/reset.css';
@import './base/layout.css';

/* Layer 3: Shared Components */
@import './components/buttons.css';
@import './components/cards.css';
@import './components/badges.css';

/* Layer 4: Scoped Page Styles */
@import './pages/dashboard.css';
@import './pages/portfolio.css';
```

---

## Step 4: Build `index.html` (Executive Dashboard)

### DOM Structure & Features:
```html
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>REPMS — Executive Master Dashboard</title>
  <!-- Bootstrap 5.3 & Icons CDN -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  <!-- Custom CSS -->
  <link rel="stylesheet" href="./assets/css/main.css">
</head>
<body class="rep-body">
  <div class="rep-app-shell">
    
    <!-- SIDEBAR -->
    <aside class="rep-sidebar"> ... </aside>
    
    <!-- MAIN WRAPPER -->
    <div class="rep-main-wrapper">
      
      <!-- TOPBAR -->
      <header class="rep-topbar"> ... </header>
      
      <!-- MAIN PAGE CONTENT -->
      <main class="app-main page-dashboard container-fluid">
        
        <!-- 1. Executive Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="rep-page-title">Executive Command Center</h1>
            <p class="rep-page-subtitle">Real-time telemetry across 42 properties and 1,420 units</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-light btn-sm"><i class="bi bi-download me-1"></i> Export Report</button>
            <button class="btn btn-primary btn-sm" data-bs-toggle="offcanvas" data-bs-target="#quickActionDrawer">
              <i class="bi bi-plus-lg me-1"></i> Quick Action
            </button>
          </div>
        </div>

        <!-- 2. KPI Metric Cards Strip (5 Cards) -->
        <div class="row g-3 mb-4">
          <!-- Card 1: Total Portfolio Value -->
          <div class="col-xl col-md-4 col-sm-6">
            <div class="rep-card rep-card--kpi">
              <div class="rep-kpi__header">
                <span class="rep-kpi__label">Portfolio Value</span>
                <span class="rep-kpi__icon text-primary"><i class="bi bi-buildings"></i></span>
              </div>
              <div class="rep-kpi__value font-mono">$142.8M</div>
              <div class="rep-kpi__trend text-success"><i class="bi bi-arrow-up-right"></i> +4.2% YoY</div>
            </div>
          </div>
          <!-- Card 2: Occupancy Rate -->
          <!-- Card 3: Monthly Net Revenue -->
          <!-- Card 4: Net Operating Income (NOI) -->
          <!-- Card 5: Open Work Orders -->
        </div>

        <!-- 3. Primary Operations Row (Split 8 / 4) -->
        <div class="row g-4 mb-4">
          <!-- Left 8 Cols: Asset Class Distribution & Revenue Stream -->
          <div class="col-lg-8">
            <div class="rep-card p-4 mb-4">
              <h3 class="rep-card__title">Asset Class Performance & Occupancy</h3>
              <!-- Distribution bars for Residential, Commercial, Retail, Industrial, Mixed-Use -->
            </div>
            <div class="rep-card p-4">
              <h3 class="rep-card__title">Recent Critical Activity & Alerts</h3>
              <!-- High-priority activity stream table -->
            </div>
          </div>

          <!-- Right 4 Cols: Urgent Actions & Quick Access -->
          <div class="col-lg-4">
            <div class="rep-card p-4 mb-4">
              <h3 class="rep-card__title">Urgent Escalations</h3>
              <!-- Critical items: 1 Water leak in Tower B, 2 Expiring major leases -->
            </div>
            <div class="rep-card p-4">
              <h3 class="rep-card__title">Quick Navigators</h3>
              <!-- Direct deep links to Leases, Rent Roll, and Work Orders -->
            </div>
          </div>
        </div>

      </main>
      
      <!-- FOOTER -->
      <footer class="rep-footer"> ... </footer>
    </div>
  </div>

  <!-- OFFCANVAS QUICK ACTION DRAWER -->
  <div class="offcanvas offcanvas-end rep-offcanvas" id="quickActionDrawer" tabindex="-1">
    <!-- Quick Work Order / Payment Log Form -->
  </div>

  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

### Styling `assets/css/pages/dashboard.css`:
- `.page-dashboard .rep-card--kpi`:
  - Background: `var(--color-bg-surface)`
  - Border: `1px solid var(--color-border-card)`
  - Border-radius: `12px`
  - Padding: `1.25rem`
  - Hover effect: `transform: translateY(-2px); border-color: rgba(59, 130, 246, 0.4); box-shadow: 0 10px 20px rgba(0,0,0,0.3)`
  - Transition: `all 0.2s ease`
- `.font-mono`: Apply `'JetBrains Mono', monospace` with bold weights.

---

## Step 5: Build `pages/portfolio.html` & Unit Stacker

This is the **signature showcase feature** of the platform that proves high real-estate domain competence.

### DOM Structure & Features:
```html
<main class="app-main page-portfolio container-fluid">

  <!-- 1. Portfolio Header & Filter Pills -->
  <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
    <div>
      <h1 class="rep-page-title">Portfolio & Unit Stack</h1>
      <p class="rep-page-subtitle">Multi-asset catalog and floor-by-floor occupancy visualizer</p>
    </div>
    <!-- Filter Tabs -->
    <div class="rep-filter-group btn-group" role="group">
      <button type="button" class="btn btn-outline-light active">All (42)</button>
      <button type="button" class="btn btn-outline-light">Residential (18)</button>
      <button type="button" class="btn btn-outline-light">Commercial (10)</button>
      <button type="button" class="btn btn-outline-light">Retail (6)</button>
      <button type="button" class="btn btn-outline-light">Industrial (5)</button>
      <button type="button" class="btn btn-outline-light">Land (3)</button>
    </div>
  </div>

  <!-- 2. Signature Component: Interactive Building Unit Stacker -->
  <div class="rep-card p-4 mb-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h3 class="rep-card__title mb-1">Building Unit Stacker — Skyline Executive Tower</h3>
        <p class="text-muted small mb-0">Class-A Commercial • 12 Floors • 96 Total Suites • 95.8% Leased</p>
      </div>
      <!-- Status Legend -->
      <div class="d-flex gap-3 small">
        <span><span class="rep-legend-dot bg-primary"></span> Occupied (88)</span>
        <span><span class="rep-legend-dot bg-success"></span> Vacant Ready (4)</span>
        <span><span class="rep-legend-dot bg-warning"></span> Turnaround / Renovation (2)</span>
        <span><span class="rep-legend-dot bg-danger"></span> Delinquent Notice (2)</span>
      </div>
    </div>

    <!-- Multi-Story Stacker Grid -->
    <div class="rep-stacker">
      <!-- Floor 12 (Penthouse / Executive) -->
      <div class="rep-stacker__floor">
        <div class="rep-stacker__floor-label font-mono">FL 12</div>
        <div class="rep-stacker__units">
          <div class="rep-unit rep-unit--occupied" data-bs-toggle="tooltip" title="Ste 1201: Apex Global | 3,200 sqft | $14,500/mo">1201</div>
          <div class="rep-unit rep-unit--occupied" data-bs-toggle="tooltip" title="Ste 1202: Horizon Legal | 2,800 sqft | $12,800/mo">1202</div>
          <div class="rep-unit rep-unit--vacant" data-bs-toggle="tooltip" title="Ste 1203: VACANT AVAILABLE | 3,100 sqft | $14,000/mo">1203</div>
          <div class="rep-unit rep-unit--occupied" data-bs-toggle="tooltip" title="Ste 1204: Quantum Labs | 3,500 sqft | $16,000/mo">1204</div>
        </div>
      </div>
      <!-- Repeat Floors 11 down to 1 ... -->
    </div>
  </div>

  <!-- 3. Asset Cards Grid (Multi-Asset Class) -->
  <div class="row g-4">
    <!-- Property Card 1: Skyline Executive Tower -->
    <!-- Property Card 2: Oakwood Luxury Residences -->
    <!-- Property Card 3: Metro Central Retail Galleria -->
    <!-- Property Card 4: Logistics Park North -->
  </div>

</main>
```

### Styling `assets/css/pages/portfolio.css`:
```css
/* Scoped to .page-portfolio */
.page-portfolio .rep-stacker {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--color-obsidian-950);
  padding: 1.25rem;
  border-radius: 10px;
  border: 1px solid var(--color-border-card);
}

.page-portfolio .rep-stacker__floor {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-portfolio .rep-stacker__floor-label {
  width: 56px;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 600;
}

.page-portfolio .rep-stacker__units {
  display: flex;
  flex: 1;
  gap: 8px;
}

.page-portfolio .rep-unit {
  flex: 1;
  padding: 10px 6px;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;
}

.page-portfolio .rep-unit:hover {
  transform: scale(1.04);
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  z-index: 2;
}

.page-portfolio .rep-unit--occupied {
  background: rgba(37, 99, 235, 0.2);
  color: #93C5FD;
  border-color: rgba(37, 99, 235, 0.4);
}

.page-portfolio .rep-unit--vacant {
  background: rgba(16, 185, 129, 0.2);
  color: #6EE7B7;
  border-color: rgba(16, 185, 129, 0.4);
}

.page-portfolio .rep-unit--renovating {
  background: rgba(245, 158, 11, 0.2);
  color: #FCD34D;
  border-color: rgba(245, 158, 11, 0.4);
}

.page-portfolio .rep-unit--delinquent {
  background: rgba(239, 68, 68, 0.2);
  color: #FCA5A5;
  border-color: rgba(239, 68, 68, 0.4);
}
```

---

## Step 6: Reusable Shell Boilerplate for Devs 2, 3, 4

When Dev 2, 3, or 4 builds their page (e.g. `pages/tenants.html`), they will copy this exact structure, changing only the `<main class="app-main page-[name]">` container and setting the active link in `.rep-nav`:

```html
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>REPMS — [Page Title]</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/main.css">
</head>
<body class="rep-body">
  <div class="rep-app-shell">
    <aside class="rep-sidebar"><!-- Same master sidebar --></aside>
    <div class="rep-main-wrapper">
      <header class="rep-topbar"><!-- Same master topbar --></header>
      <main class="app-main page-[name] container-fluid">
        <!-- Developer's module content goes here -->
      </main>
      <footer class="rep-footer"><!-- Same master footer --></footer>
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

---

## Step-by-Step Execution Checklist

Use this checklist to track your progress as you build Dev 1:

- [ ] **Task 1:** Edit `assets/css/tokens/primitives.css` & `semantic.css` to enclose all variables within `:root { ... }`.
- [ ] **Task 2:** Create `assets/css/base/reset.css` with CSS normalization rules.
- [ ] **Task 3:** Create `assets/css/base/layout.css` implementing the sidebar, topbar, and main container.
- [ ] **Task 4:** Create `assets/css/components/cards.css` with dark elevation and border styling.
- [ ] **Task 5:** Create `assets/css/main.css` importing Google Fonts, tokens, base, and component styles.
- [ ] **Task 6:** Create `index.html` with the App Shell, KPI strip, occupancy overview, and quick-action offcanvas.
- [ ] **Task 7:** Create `assets/css/pages/dashboard.css` with scoped styles for `.page-dashboard`.
- [ ] **Task 8:** Create `pages/portfolio.html` with filter tabs, asset grid, and interactive Building Unit Stacker.
- [ ] **Task 9:** Create `assets/css/pages/portfolio.css` with scoped styles for `.page-portfolio` and `.rep-stacker`.
- [ ] **Task 10:** Open `index.html` and `pages/portfolio.html` in browser to test responsiveness and tooltips.
