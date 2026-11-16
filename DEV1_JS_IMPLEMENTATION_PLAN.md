# DEV 1 IMPLEMENTATION PLAN — Pure JavaScript Data Layer, Shell & Portfolio
## Real Estate Property Management System (REPMS)

> **Developer:** Shourya (Dev 1 — Lead Architect & Shell Lead)  
> **Branch:** `Feature/Shourya` (updated from `Dev`)  
> **Pages Owned:** `login.html`, `index.html`, `pages/portfolio.html`  
> **Tech Stack:** Pure Vanilla JavaScript (ES6+), Browser `localStorage`, Bootstrap 5.3 Bundle (Zero Node.js)

---

## 1. Purpose & Architecture Overview

Dev 1 builds the shared `localStorage` data engine and wires all interactive features for **Authentication (`login.html`)**, the **Executive Command Center (`index.html`)**, and the **Multi-Asset Portfolio & Interactive Unit Stacker (`pages/portfolio.html`)**.

Instead of a Node.js backend, state lives in `localStorage` (`REPMS_DATABASE_V1`) inside `assets/js/store.js` and is exposed through `window.REPMS_STORE` and `window.repms`.

```
assets/js/store.js  ──▶ localStorage ('REPMS_DATABASE_V1') + window.REPMS_STORE + window.repms
         │
         ├──▶ assets/js/shell.js      (Theme, Login/Signout, Ctrl+K Search, Notification Bell)
         ├──▶ assets/js/dashboard.js  (index.html: KPIs, Occupancy Bars, Activity, CSV, Quick Actions)
         └──▶ assets/js/portfolio.js  (pages/portfolio.html: Filters, Property Grid, Unit Stacker + Modals)
```

---

## 2. Files Owned & Implemented by Dev 1

| File | Lines | Responsibility |
| :--- | :---: | :--- |
| `assets/js/store.js` | ~231 | Seed data (`SEED_DATA`), `localStorage` persistence, `window.REPMS_STORE` API, dynamic KPI & unit occupancy calculations, and `window.repms` helpers (`byId`, `esc`, `money`, `shortMoney`, `toast`). |
| `assets/js/shell.js` | ~102 | Light/Dark theme persistence, login submit, session guard, `Ctrl+K` live search across pages/properties/tenants, and notification bell alerts. |
| `assets/js/dashboard.js` | ~90 | Hydrates 5 KPI cards, occupancy bars, critical activity table, escalations, CSV export, and Quick Actions drawer form. |
| `assets/js/portfolio.js` | ~132 | Asset filter pills with live counts, property cards grid, Manage Asset modal, Add Property modal, and interactive Unit Stacker + Unit Editor modal using `FormData`. |

---

## 3. Logic Breakdown (How Each Feature Works)

### A. Data Store & Helpers (`assets/js/store.js`)
- **First-Visit Seeding:** `readDB()` loads `REPMS_DATABASE_V1` from `localStorage`, or seeds `SEED_DATA` on first launch.
- **Auto-Sync (`saveDB`):** Persists mutations to `localStorage`, prepends recent activity logs (capped at 8 items), and dispatches `repms:change` so open UI panels refresh automatically.
- **Unit Occupancy Recalculation (`updateUnit`):** Updating any suite in the stacker recalculates `prop.occupancyRate` from live occupied suites and records an activity log.
- **Live Dashboard Rollup (`getDashboardSummary`):** Computes total portfolio value, average occupancy, monthly revenue, YTD NOI, and open/critical work order counts directly from stored properties and work orders.

### B. App Shell & Auth (`assets/js/shell.js`)
- **Theme Persistence:** Reads/writes `localStorage.getItem('theme')`, sets `data-bs-theme` on `<html>`, and toggles `.theme-icon` classes.
- **Login & Sign Out:** Validates `#loginForm` email/password, stores `REPMS_USER` in `localStorage`, and sets `REPMS_SIGNED_OUT` in `sessionStorage` on Sign Out so returning requires login.
- **Global Search (`Ctrl+K`):** Binds `Ctrl+K`/`Cmd+K` to focus the search input and filters across all 8 pages, stored properties, and tenants.
- **Notification Bell:** Merges open work orders and urgent escalations into `#notifMenu` and updates `#notifBadge`.

### C. Executive Command Center (`assets/js/dashboard.js` on `index.html`)
- **KPI & Occupancy Rendering:** Populates all 5 KPI cards, computes average occupancy per asset class (`residential`, `commercial`, `retail`, `industrial`), and renders the Critical Activity table and Escalations list.
- **CSV Export:** Builds a CSV Blob from `getDashboardSummary()` and downloads `repms-executive-report.csv`.
- **Quick Actions Drawer (`#quickActionDrawer`):** Uses a compact `ACTIONS` lookup object so one shared form handles **Create Work Order**, **Log Manual Payment**, **Add New Tenant**, and **Generate Notice**.

### D. Portfolio & Unit Stacker (`assets/js/portfolio.js` on `pages/portfolio.html`)
- **Asset Filter Pills:** Dynamically prints live asset counts (`All`, `Residential`, `Commercial`, `Retail`, `Industrial`) and filters `#propertyGrid`.
- **Interactive Unit Stacker:** Renders floors and `.rep-unit` tiles (`occupied`, `vacant`, `renovating`, `delinquent`), updates legend counts, initializes Bootstrap tooltips cleanly (disposing previous instances on re-render), and opens `#unitDetailModal` on click.
- **Modal Forms via Native `FormData`:** `#unitDetailForm`, `#assetDetailForm`, and `#addPropertyForm` read all inputs cleanly using `Object.fromEntries(new FormData(form))` and persist updates straight to `localStorage`.

---

## 4. Script Inclusion Order (Dev 1 Pages)

- **`login.html`:** `bootstrap.bundle.min.js` → `./assets/js/store.js` → `./assets/js/shell.js`
- **`index.html`:** `bootstrap.bundle.min.js` → `./assets/js/store.js` → `./assets/js/shell.js` → `./assets/js/dashboard.js`
- **`pages/portfolio.html`:** `bootstrap.bundle.min.js` → `../assets/js/store.js` → `../assets/js/shell.js` → `../assets/js/portfolio.js`

---

## 5. Teacher Demo Walkthrough Checklist

1. **Login Flow (`login.html`):** Toggle Dark/Light mode, enter any work email & password (min 4 chars), and sign in to verify your name appears in the navbar.
2. **Dashboard Live Telemetry (`index.html`):** Press `Ctrl+K` to search `"Skyline"` or `"Tenants"`, open the Notification bell, click **Export Report** to download the CSV, and submit **Action -> Create Work Order** to watch **Open Issues** and **Recent Critical Activity** update immediately.
3. **Interactive Unit Stacker (`pages/portfolio.html`):** Hover any unit tile for tooltip specs, click Suite `1203` (Vacant) -> switch status to `Occupied` -> save and watch occupancy % and legend counts recalculate live.
4. **Property CRUD & Persistence:** Click **+ Add Property**, add a `$15M` property, reload the browser (confirming `localStorage` persistence), and navigate back to **Dashboard** to show **Portfolio Value** increased by `$15M`.
