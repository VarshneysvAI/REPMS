# DEV 1 IMPLEMENTATION PLAN — `db.json` Fetch API, Shell & Portfolio
## Real Estate Property Management System (REPMS)

> **Developer:** Shourya (Dev 1 — Lead Architect & Shell Lead)  
> **Branch:** `Dev`  
> **Pages Owned:** `index.html`, `pages/portfolio.html`, `login.html`  
> **Tech Stack:** Pure Vanilla JavaScript (`fetch()` API + `localStorage`), `db.json` Database, Bootstrap 5.3 (Zero Node.js)

---

## 1. How the Architecture Works (For Viva Explanation)

All application data lives inside a single JSON database file at the project root: **`db.json`**.

1. **API Fetch (`assets/js/store.js`):** On every page load, `fetchDatabase()` calls `await fetch('./db.json')` (or `../db.json` inside `pages/` and `dev3/`).
2. **State Persistence (`localStorage`):** When `db.json` arrives, `store.js` stores it under `localStorage` (`REPMS_DATABASE_V1`) if empty—or backfills missing keys without erasing user edits.
3. **Reactive UI Sync (`repms:change`):** Whenever any page mutates data via `saveDB(db, activity)`, `store.js` writes back to `localStorage` and fires `repms:change` so all components refresh automatically.
4. **No Login Barrier:** Visiting the site root (`index.html`) loads the Executive Dashboard immediately using the default profile (`Sarah Jenkins`). `login.html` only runs if the user clicks **Sign Out** or opens `login.html` directly.

```
db.json ──(fetch() API call)──▶ store.js ──▶ localStorage ('REPMS_DATABASE_V1')
                                   │
          ┌────────────────────────┼────────────────────────┐
          ▼                        ▼                        ▼
      shell.js               dashboard.js             portfolio.js
(Theme, Search, Alerts)  (KPIs, Activity, CSV)   (Filters, Stacker, Modals)
```

---

## 2. Files Owned by Dev 1

| File | Responsibility |
| :--- | :--- |
| `db.json` | Single JSON database for properties, floors/units, activity logs, escalations, tenants, leases, rent roll, financial config, work orders, vacancies, and ESG metrics. |
| `vercel.json` | Static Vercel deployment header config (`Cache-Control: no-cache` on `/db.json`). |
| `assets/js/store.js` | Loads `db.json` via `fetch()`, manages `localStorage` CRUD (`REPMS_STORE`), calculates live KPIs & unit occupancy %, and provides `window.repms` helpers (`byId`, `esc`, `money`, `shortMoney`, `toast`). |
| `assets/js/shell.js` | Light/Dark theme persistence, optional login/sign-out session, `Ctrl+K` live search across pages/properties/tenants, and notification bell alerts. |
| `assets/js/dashboard.js` | Hydrates 5 KPI cards, asset class occupancy bars, critical activity table, escalations, CSV export, and Quick Actions drawer form. |
| `assets/js/portfolio.js` | Asset filter pills with live counts, dynamic property grid, Manage Asset & Add Property modals (`FormData`), and interactive Building Unit Stacker + Unit Editor modal. |

---

## 3. Deploying on Vercel (Step-by-Step)

1. Push the latest `Dev` branch to GitHub (`git push origin Dev`).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import `VarshneysvAI/REPMS`.
3. Under **Configure Project**:
   - **Framework Preset:** `Other`
   - **Build Command:** *(leave empty)*
   - **Output Directory:** `.` *(or leave empty)*
4. After deploying (or before first deploy in **Project Settings → Git**), set **Production Branch** to **`Dev`** (or merge `Dev` into `main`), because `Dev` holds the complete HTML/CSS/JS + `db.json`.
5. Open your `https://<project>.vercel.app` URL — it lands directly on `index.html` (Dashboard), fetches `/db.json` (`200 OK` in DevTools Network tab), and all pages (`pages/*`, `dev3/*`, `login.html`) work immediately.

> **Local Testing Note:** Open via **VS Code Live Server** or `python -m http.server` rather than double-clicking `file://`, because browsers block `fetch('db.json')` on `file://` URLs.

---

## 4. Viva Demo Checklist

1. **Show `db.json` & Network Tab:** Open DevTools → **Network** → reload `index.html` to show `GET db.json` (`200 OK`) loading all initial portfolio records via JS `fetch()`.
2. **Direct Dashboard Access + Login Flow:** Show that opening `/` lands directly on `index.html`, then click **Sign Out** → sign in on `login.html` with your email → navbar displays your name.
3. **Interactive Unit Stacker (`pages/portfolio.html`):** Click Suite `1203` (Vacant) → set status to `Occupied` → save → show occupancy % recalculating live and updating `index.html` KPIs.
4. **Cross-Module Sync:** Add a property in `portfolio.html` or log a work order from `index.html` Quick Actions → verify **Portfolio Value** / **Open Issues** / `dev3/maintenance.html` update automatically and survive browser refresh.
