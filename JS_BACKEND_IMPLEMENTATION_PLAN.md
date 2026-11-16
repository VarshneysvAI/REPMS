# REPMS (Real Estate Property Management System)
## 4-Developer Pure JavaScript Data Layer & Frontend Implementation Plan

> **Academic Section:** Section AB — **Project Group:** Group 15  
> **Team Members:** Shourya (Dev 1), Shikhar (Dev 2), Shatakshi (Dev 3), Shakti Dubey (Dev 4)  
> **Tech Stack:** **Pure Client-Side JavaScript (ES6+ Vanilla JS)** + Bootstrap 5.3 Bundle + `localStorage` *(Zero Node.js runtime, zero npm build steps)*.  
> **Current Status:** **Dev 1 Core & Modules Complete** (`assets/js/store.js`, `shell.js`, `dashboard.js`, `portfolio.js`). Devs 2, 3, and 4 wire their pages directly onto this shared base.

---

## 📋 Table of Contents
1. [Architecture Overview (Ponytail Flat Layout)](#1-architecture-overview-ponytail-flat-layout)
2. [Shared Data Engine & Utilities (Already Live in `store.js` & `shell.js`)](#2-shared-data-engine--utilities-already-live-in-storejs--shelljs)
3. [Developer 1 Status (Completed): Shell, Dashboard & Portfolio](#3-developer-1-status-completed-shell-dashboard--portfolio)
4. [Developer 2 Blueprint (Shikhar): Tenants & Leases](#4-developer-2-blueprint-shikhar-tenants--leases)
5. [Developer 3 Blueprint (Shatakshi): Financials & Maintenance](#5-developer-3-blueprint-shatakshi-financials--maintenance)
6. [Developer 4 Blueprint (Shakti Dubey): Leasing CRM & ESG Analytics](#6-developer-4-blueprint-shakti-dubey-leasing-crm--esg-analytics)
7. [Script Inclusion & Zero-Collision Checklist](#7-script-inclusion--zero-collision-checklist)

---

## 1. Architecture Overview (Ponytail Flat Layout)

Instead of a heavy Node.js backend or deeply nested JS folders, all 4 developers share a minimal, flat JavaScript layer in `assets/js/`:

```
Mini project 2 REPMS/
├── index.html                    # Dev 1 (Dashboard)           [Wired]
├── login.html                    # Dev 1 (Auth)                [Wired]
├── pages/
│   ├── portfolio.html            # Dev 1 (Portfolio & Stacker) [Wired]
│   ├── tenants.html              # Dev 2 (Tenant Directory)    [Add tenants.js]
│   ├── leases.html               # Dev 2 (Lease Lifecycle)     [Add leases.js]
│   ├── leasing.html              # Dev 4 (Leasing CRM)         [Add leasing.js]
│   └── analytics.html            # Dev 4 (ESG & Yields)        [Add analytics.js]
├── dev3/
│   ├── financial.html            # Dev 3 (Financials)          [Add financials.js]
│   └── maintenance.html          # Dev 3 (Maintenance)         [Add maintenance.js]
└── assets/js/
    ├── store.js                  # Shared DB (localStorage) + window.repms helpers  [Done by Dev 1]
    ├── shell.js                  # Shared Theme, Auth, Ctrl+K Search, Alerts        [Done by Dev 1]
    ├── dashboard.js              # Dev 1 Dashboard logic                            [Done by Dev 1]
    ├── portfolio.js              # Dev 1 Portfolio & Unit Stacker                   [Done by Dev 1]
    ├── tenants.js                # Dev 2 Tenant Directory logic                     [To Build]
    ├── leases.js                 # Dev 2 Lease Lifecycle logic                      [To Build]
    ├── financials.js             # Dev 3 Financial Overview & Rent Collection       [To Build]
    ├── maintenance.js            # Dev 3 Work Orders & Summary logic                [To Build]
    ├── leasing.js                # Dev 4 Vacancy Filter, Tours & CRM Pipeline       [To Build]
    └── analytics.js              # Dev 4 ESG Scorecards, Yields & CSV Export        [To Build]
```

### Design Principles (For All 4 Devs)
1. **Do NOT modify `store.js` or `shell.js` unless strictly needed** — use `REPMS_STORE.read()` and `REPMS_STORE.save(db, activity)` inside your own file (`tenants.js`, `leases.js`, etc.) to guarantee **zero git merge conflicts**.
2. **Use `window.repms` helpers** instead of rewriting DOM/format helpers (`byId`, `esc`, `money`, `shortMoney`, `toast`).
3. **Remove your page's inline `// Theme Management` `<script>`** once you include `shell.js` — `shell.js` already handles Light/Dark toggle, login session guard, `Ctrl+K` search, and notification alerts across all pages.
4. **Use native `Object.fromEntries(new FormData(form))`** on modal forms instead of reading 10 inputs one by one.

---

## 2. Shared Data Engine & Utilities (Already Live in `store.js` & `shell.js`)

### 2.1 How Data is Stored & Seeded
- **Storage Key:** `localStorage` under `'REPMS_DATABASE_V1'`.
- **Auto-Seeding:** On first visit, `store.js` clones `SEED_DATA` into `localStorage`.
- **Live Sync Event:** Calling `REPMS_STORE.save(db, optionalActivity)` saves to `localStorage`, caps `recentActivity` at 8 entries (visible on Dashboard!), and fires `window.dispatchEvent(new CustomEvent('repms:change', { detail: db }))`.

### 2.2 Global APIs Available on Every Page

#### `window.repms` (UI & Formatting Utilities)
```javascript
const { byId, esc, money, shortMoney, toast } = window.repms;
// byId('myId')              -> document.getElementById('myId')
// esc(str)                  -> Escapes &, <, >, ", ' before template literal HTML injection
// money(14500)              -> "$14,500"
// shortMoney(142800000)     -> "$142.8M" (or "$480K" for thousands)
// toast('Saved!', 'success')-> Displays a Bootstrap 5 bottom-right toast
```

#### `window.REPMS_STORE` (Data Accessors)
- **`REPMS_STORE.read()`** — Returns the full parsed database object (`{ properties, recentActivity, escalations, tenants, leases, rentRoll, workOrders, vacancies, leads, esg }`).
- **`REPMS_STORE.save(db, activity?)`** — Persists updated `db` to `localStorage`, optionally prepends an activity item `{ property, icon, event, status, badge, time: 'Just now' }`, and triggers `repms:change`.
- **Built-in Domain Methods:**
  - `properties`: `getAll(type)`, `getById(id)`, `getUnitStack(id)`, `add(prop)`, `update(id, patch)`, `updateUnit(propId, unitNum, patch)`, `getDashboardSummary()`, `addActivity(prop, event, status, badge)`
  - `tenants`: `getAll(query)`, `add(tenant)`
  - `leases`: `getAll(stage)`
  - `financials`: `getRentRoll()`, `addPayment(payment)`
  - `maintenance`: `getWorkOrders()`, `addWorkOrder(order)`
  - `leasing`: `getVacancies(category)`, `getLeads()`
  - `analytics`: `getESG()`
  - `auth`: `getUser()`, `login(user)`, `logout()`, `isSignedOut()`

---

## 3. Developer 1 Status (Completed): Shell, Dashboard & Portfolio

> **Owner:** Shourya (Dev 1) — **Status:** ✅ Implemented & Verified on `Feature/Shourya`

- **`assets/js/store.js`**: Multi-asset seed data (`Skyline Executive Tower`, `Oakwood Luxury Res`, `Metro Central Galleria`, `Logistics Park North`), `localStorage` read/save, dynamic KPI rollups, and `window.repms` helpers.
- **`assets/js/shell.js`**: Light/Dark theme persistence, `login.html` validation & sign-out flow, `Ctrl+K` live search across all 8 pages/properties/tenants, and notification bell alert feed.
- **`assets/js/dashboard.js` (`index.html`)**: Live 5-KPI strip (`$142.8M`, occupancy, monthly revenue, NOI, open issues), asset-class occupancy bars, critical activity table, escalations, CSV export, and shared 4-in-1 Quick Action drawer form.
- **`assets/js/portfolio.js` (`pages/portfolio.html`)**: Filter pills with live counts, dynamic property grid, Manage Asset & Add Property modals (`FormData`), building selector, Bootstrap tooltips, and click-to-edit Unit Stacker updating occupancy live.

---

## 4. Developer 2 Blueprint (Shikhar): Tenants & Leases

> **Owner:** Shikhar (Dev 2)  
> **HTML Pages:** `pages/tenants.html`, `pages/leases.html`  
> **JS Files to Create:** `assets/js/tenants.js`, `assets/js/leases.js`

### 4.1 `pages/tenants.html` → `assets/js/tenants.js`
Inspecting `pages/tenants.html` shows these existing UI elements to wire up:
- **4 KPI Cards** (Total Active Tenants, Delinquency Rate, Leases Expiring in 60 Days, Avg. Tenure)
- **Filter Bar**: Search input (`placeholder="Search by tenant, company, or unit..."`), Property `<select>`, Status `<select>` (`Active`, `Grace Period`, `30+ Days Delinquent`, `Expiring Soon`), Asset Class `<select>`, and `Reset Filters` button
- **Tenant Table** + **`#tenantProfileDrawer`** offcanvas + **`#addTenantModal`** modal

**Implementation Logic (`assets/js/tenants.js`):**
1. **Seed Enrichment:** On load, if `db.tenants.length <= 3`, optionally ensure full tenant fields (`email`, `phone`, `leaseStart`, `leaseEnd`, `escrowBalance`, `emergencyContact`, `paymentHistory`) are initialized once in `db.tenants` via `REPMS_STORE.save(db)`.
2. **Render KPIs & Table (`render()`):**
   - Compute active count, delinquent %, and expiring count from `REPMS_STORE.read().tenants`.
   - Apply all 4 filter controls (`search`, `property`, `status`, `assetClass`) together in one `.filter(...)` chain and render `<tbody>` rows using `esc()` and `money()`.
3. **Reset Filters:** Clicking `Reset Filters` clears the search input and resets all 3 `<select>` elements to index `0`, then calls `render()`.
4. **Profile Offcanvas (`#tenantProfileDrawer`):** Use event delegation on `<tbody>` for clicks on `[data-bs-target="#tenantProfileDrawer"]`, find the tenant by `dataset.tenantId`, populate contact info, escrow balance, emergency contact, and payment ledger rows inside the drawer.
5. **Add Tenant Modal (`#addTenantModal`):** Add `name="..."` attributes to inputs in `#addTenantModal`'s `<form>`, intercept `submit`, read via `Object.fromEntries(new FormData(form))`, call `REPMS_STORE.tenants.add(data)`, hide modal, and call `toast('Tenant added!')`.

### 4.2 `pages/leases.html` → `assets/js/leases.js`
Inspecting `pages/leases.html` shows:
- **Lease Tables** (Active/Pipeline Lease Directory + Escalation Schedule)
- **Modals:** `#leaseDocumentModal` (document viewer) and `#createLeaseModal` (create lease form)

**Implementation Logic (`assets/js/leases.js`):**
1. **Stage Tabs / Filter Bar:** Filter `REPMS_STORE.leases.getAll(stage)` (`all`, `draft`, `active`, `renewal`, `expired`) and update pipeline counts dynamically.
2. **Escalation Schedule Calculation:** For each lease with an escalation date, compute dollar bump (`newRent - baseRent`) and days remaining (`Math.ceil((new Date(endDate) - Date.now()) / 86400000)`).
3. **Lease Document Modal (`#leaseDocumentModal`):** On clicking any row's View button, inject the selected lease's tenant, suite, start/end dates, monthly rent, and security deposit into `#leaseDocumentModal` before Bootstrap opens it.
4. **Create Lease Modal (`#createLeaseModal`):** Intercept form submit with `FormData`, push new lease into `db.leases`, call `REPMS_STORE.save(db, { property, icon: 'bi-file-earmark-text text-primary', event: 'New Lease Drafted: ' + tenant, status: 'Draft', badge: 'info', time: 'Just now' })`, and re-render.

---

## 5. Developer 3 Blueprint (Shatakshi): Financials & Maintenance

> **Owner:** Shatakshi (Dev 3)  
> **HTML Pages:** `dev3/financial.html`, `dev3/maintenance.html`  
> **JS Files to Create:** `assets/js/financials.js`, `assets/js/maintenance.js`

### 5.1 `dev3/financial.html` → `assets/js/financials.js`
Inspecting `dev3/financial.html` shows these actual page elements:
- **4 Metric Cards**: `TOTAL REVENUE` (`$1.24M`), `TOTAL EXPENSES` (`$382K`), `NET OPERATING INCOME` (`$858K`), `RENT COLLECTION` (`96.8%`)
- **Revenue Overview Panel**: `<select>` (`Last 6 Months` / `Last 12 Months`) + `.bars` flex chart
- **Expense Breakdown Panel**: 4 category progress rows (`Property Maintenance`, `Utilities`, `Insurance`, `Management`)
- **Rent Collection Table**: columns `PROPERTY`, `TENANT`, `RENT`, `DUE DATE`, `STATUS` (`Paid`, `Pending`, `Overdue`) + `.export-btn` (`Export Report`) + `.view-btn` (`View All ->`)

**Implementation Logic (`assets/js/financials.js`):**
1. **Dynamic Metric Calculations:** Read `db.rentRoll` and `db.properties` via `REPMS_STORE.read()`. Compute total collected, overdue balance, NOI (`revenue - expenses`), and collection `%`, updating the 4 cards.
2. **6M / 12M Chart Toggle:** Listen to `change` on the Revenue Overview `<select>` and switch `.bars` + `.months` between 6-month and 12-month datasets cleanly.
3. **Rent Collection Table & Quick Status Toggle:**
   - Render rows from `REPMS_STORE.financials.getRentRoll()`.
   - Clicking a `Pending` or `Overdue` status pill (or a "Mark Paid" action) updates `row.status = 'Paid'` in `db.rentRoll`, saves via `REPMS_STORE.save(db, ...)`, updates the Collection % card, and shows `toast('Payment reconciled!')`.
4. **CSV Export (`.export-btn`):** Generate a CSV Blob from `db.rentRoll` (`Property,Tenant,Rent,Due Date,Status`) and trigger download (`repms-rent-collection.csv`) + `toast('Financial report exported!')`.

### 5.2 `dev3/maintenance.html` → `assets/js/maintenance.js`
Inspecting `dev3/maintenance.html` shows these actual page elements:
- **Header Button:** `.add-btn` (`+ Create Work Order`)
- **4 Summary Cards:** `OPEN WORK ORDERS`, `IN PROGRESS`, `COMPLETED THIS MONTH`, `MAINTENANCE COST`
- **Filter Panel:** Search input (`Search work orders, property or unit...`), Property `<select>`, Priority `<select>` (`Critical`, `High`, `Medium`, `Low`), Status `<select>` (`Open`, `In Progress`, `Completed`)
- **Work Orders Table:** `WORK ORDER` (`#WO-1048`), `PROPERTY & UNIT`, `ISSUE`, `PRIORITY`, `ASSIGNED TO`, `STATUS`, `ACTIONS` (`.action-btn`)
- **Bottom Panels:** `Upcoming Maintenance` schedule + `Maintenance Summary` (`Preventive`, `Emergency`, `General` % breakdown)

**Implementation Logic (`assets/js/maintenance.js`):**
1. **Work Order Filtering & Table Render (`render()`):**
   - Read `REPMS_STORE.maintenance.getWorkOrders()`.
   - Filter simultaneously by search text, property, priority, and status dropdowns.
   - Update the 4 summary cards (`Open`, `In Progress`, `Completed`) dynamically—note that creating a work order on `index.html`'s Quick Action drawer or here immediately syncs across both pages!
2. **Inline Status Progression (`.action-btn`):** Clicking `.action-btn` on any row cycles or opens a tiny dropdown/prompt to advance status (`Open` → `In Progress` → `Resolved`/`Completed`) and update `assignedTo` vendor, persisting via `REPMS_STORE.save(db, ...)`.
3. **Create Work Order Modal:** Add a clean Bootstrap 5 modal (`#createWorkOrderModal`) triggered by `.add-btn`; on submit (`FormData`), call `REPMS_STORE.maintenance.addWorkOrder(...)`, close modal, and call `toast('Work order created!')`.
4. **Summary Percentages:** Compute `% Preventive`, `% Emergency`, `% General` dynamically from `db.workOrders` counts.

---

## 6. Developer 4 Blueprint (Shakti Dubey): Leasing CRM & ESG Analytics

> **Owner:** Shakti Dubey (Dev 4)  
> **HTML Pages:** `pages/leasing.html`, `pages/analytics.html`  
> **JS Files to Create:** `assets/js/leasing.js`, `assets/js/analytics.js`

### 6.1 `pages/leasing.html` → `assets/js/leasing.js`
Inspecting `pages/leasing.html` shows these existing elements (currently using inline `<script>` + `alert()` stubs):
- **Category Filter Buttons:** `.rep-filter-btn` (`All Types`, `Office`, `Residential`, `Industrial`, `Retail`) + `#vacancyGrid`
- **Modals:** `#scheduleTourModal` (`#tourForm`, `#tourUnitInput`) and `#addLeadModal`
- **5-Column CRM Pipeline (`.crm-kanban-wrapper`):** `1. New Inquiry`, `2. Tour Booked`, `3. Application`, `4. Credit Check`, `5. Lease Sent`

**Implementation Logic (`assets/js/leasing.js`):**
1. **Migrate Inline Scripts:** Move `filterUnits()`, `setTourUnit()`, `handleTourSubmit()`, and `handleAddLeadSubmit()` out of `leasing.html` into `assets/js/leasing.js`, replacing `alert(...)` with `window.repms.toast(...)`.
2. **Persist Tour Bookings (`#tourForm`):** On submit, read prospect details + `#tourUnitInput` via `FormData`, push a new lead (`stage: 'tour_booked'`) into `db.leads`, call `REPMS_STORE.save(db, ...)`, and re-render the CRM Kanban so the tour appears in **Column 2 (Tour Booked)** and updates its column badge count.
3. **Persist New Leads (`#addLeadModal`):** On submit, add new lead (`stage: 'inquiry'`) into `db.leads`, save to `localStorage`, and re-render Column 1.
4. **Interactive Stage Progression:** Render `.crm-card` items from `db.leads` (seeded from existing cards on first run if `db.leads` is empty) with a subtle `Advance →` button that moves a lead to the next stage (`inquiry` → `tour_booked` → `application` → `credit_check` → `lease_sent`) and saves to `localStorage`.

### 6.2 `pages/analytics.html` → `assets/js/analytics.js`
Inspecting `pages/analytics.html` shows these existing elements:
- **Action Buttons:** `Sync Benchmarks` and `Audit Compliance` (currently `onclick="alert(...)"`), plus `Download CSV`
- **4 KPI Cards:** `Portfolio Cap Rate` (`6.85%`), `Avg. Yield / SqFt` (`$42.50`), `ESG Energy Star Score` (`88 / 100`), `Carbon Reduction` (`-340 MT`)
- **Asset Class Cap Rate Bars:** `.yield-row` (`Class-A Office`, `Logistics Parks`, `Retail Strip Centers`, `Multi-Family Resi`)
- **Solar vs. Grid Energy Mix:** progress bars (`Rooftop Solar Array`, `Municipal Electric Grid`, `EV Charging Draw`)
- **3 Executive ESG Property Scorecards:** `.esg-property-card` with `.rep-gauge-ring` SVG circles (`stroke-dashoffset`)
- **Net-Zero Carbon 2025–2030 Roadmap:** `.rep-timeline-item` items

**Implementation Logic (`assets/js/analytics.js`):**
1. **Replace `alert()` Stubs:**
   - **Sync Benchmarks:** Recalculates Cap Rate & Yield from `REPMS_STORE.properties.getAll()` + `db.esg`, updates the KPI strip & `.yield-row` widths, and triggers `toast('Benchmarks synced with live portfolio!')`.
   - **Audit Compliance:** Checks which properties meet Energy Star >= 85, logs an audit entry via `REPMS_STORE.properties.addActivity(...)`, and triggers `toast('LEED Compliance Audit verified!')`.
   - **Download CSV:** Exports a real CSV file (`repms-esg-telemetry.csv`) containing property yields, Energy Star scores, and solar offsets.
2. **SVG Gauge Ring Animation:** Animate `.meter-circle` `stroke-dashoffset` smoothly on page load (`circumference = 2 * Math.PI * 40 ≈ 251.3`, `offset = 251.3 * (1 - score / 100)`).
3. **Interactive Roadmap Filter/Toggle:** Clicking any `.rep-timeline-item` toggles/logs milestone verification state in `localStorage`.

---

## 7. Script Inclusion & Zero-Collision Checklist

### 7.1 Exact `<script>` Order per Page
Replace each page's inline theme `<script>` at the bottom of `<body>` with:

| Page | Owner | Script Tags (before `</body>`) |
| :--- | :---: | :--- |
| `login.html` | Dev 1 ✅ | `bootstrap.bundle.min.js` → `./assets/js/store.js` → `./assets/js/shell.js` |
| `index.html` | Dev 1 ✅ | `bootstrap.bundle.min.js` → `./assets/js/store.js` → `./assets/js/shell.js` → `./assets/js/dashboard.js` |
| `pages/portfolio.html` | Dev 1 ✅ | `bootstrap.bundle.min.js` → `../assets/js/store.js` → `../assets/js/shell.js` → `../assets/js/portfolio.js` |
| `pages/tenants.html` | Dev 2 | `bootstrap.bundle.min.js` → `../assets/js/store.js` → `../assets/js/shell.js` → `../assets/js/tenants.js` |
| `pages/leases.html` | Dev 2 | `bootstrap.bundle.min.js` → `../assets/js/store.js` → `../assets/js/shell.js` → `../assets/js/leases.js` |
| `dev3/financial.html` | Dev 3 | `bootstrap.bundle.min.js` → `../assets/js/store.js` → `../assets/js/shell.js` → `../assets/js/financials.js` |
| `dev3/maintenance.html` | Dev 3 | `bootstrap.bundle.min.js` → `../assets/js/store.js` → `../assets/js/shell.js` → `../assets/js/maintenance.js` |
| `pages/leasing.html` | Dev 4 | `bootstrap.bundle.min.js` → `../assets/js/store.js` → `../assets/js/shell.js` → `../assets/js/leasing.js` |
| `pages/analytics.html` | Dev 4 | `bootstrap.bundle.min.js` → `../assets/js/store.js` → `../assets/js/shell.js` → `../assets/js/analytics.js` |

*(Optional UX Enhancement for Devs 2–4: if you want user dropdown names & notification alerts to hydrate cleanly on your pages too, add `.user-name-label`, `.user-role-label`, `.signout-btn`, `#notifBadge`, and `#notifMenu` in your navbar matching `index.html` — `shell.js` checks safely for them with `if (!menu) return` so nothing breaks even before adding them!)*

### 7.2 Team Git Workflow
1. **Dev 1 merges `Feature/Shourya` → `Dev`** so `assets/js/store.js` and `assets/js/shell.js` are available to all teammates.
2. **Devs 2, 3, and 4 pull `Dev`** into their branches (`Feature/Shikhar`, `feature/shatakshi`, `Feature/Shakti-From-GLA`).
3. **Zero Collisions:** Each dev only edits their own HTML pages + creates their own 2 JS files in `assets/js/`. All shared state goes through `REPMS_STORE.read()` / `REPMS_STORE.save()`.
4. **Verify Before PR:** Run `node --check assets/js/[yourfile].js` (syntax check only) and verify data persists across browser refresh in `localStorage`.

---
*REPMS Project Group 15 — Section AB — Pure Vanilla JS Implementation Plan*
