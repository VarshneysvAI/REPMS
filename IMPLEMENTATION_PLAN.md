# REPMS (Real Estate Property Management System)
## 4-Member Master UI Architecture & Implementation Plan

> **Project Goal:** Build a state-of-the-art, high-density enterprise UI prototype for a **Real Estate Property Management System (REPMS)** covering all major asset classes (Residential Multi-Family, Commercial Class-A Office Towers, Retail Strip Malls, Industrial Logistics Parks, Mixed-Use, and Land Leases).
> 
> **Tech Stack:** HTML5 & CSS3 strictly (Zero backend required, zero Node build step). Accelerated with **Bootstrap 5.3 CDN** (responsive grid, flex utilities, modals, offcanvas drawers) + **REPMS Custom Token Design System** (BEM methodology, Google Fonts: *Plus Jakarta Sans*, *Inter*, *JetBrains Mono*).

---

## 1. Domain Architecture & Theme Standards

### 1.1 Aesthetic Theme: *"Obsidian Executive & Emerald Yield"*
Informed by `.skills/ui-ux-pro-max`, `frontend-design`, and `brandkit`:
- **Canvas Base:** Deep Obsidian (`#0B0F17`)
- **Sidebars & Topbars:** Midnight Slate (`#111827`) with backdrop blur (`rgba(17, 24, 39, 0.85)`)
- **Cards & Surfaces:** Elevated Slate (`#1E293B`) with subtle border (`1px solid rgba(255, 255, 255, 0.08)`)
- **Brand Primary:** Cobalt Azure (`#2563EB` / `#1D4ED8`)
- **Financial Yield / Occupied Status:** Emerald Green (`#10B981` / `#059669`)
- **Under Renovation / Maintenance Triage:** Warm Amber (`#F59E0B`)
- **Overdue / Delinquency / Urgent Alerts:** Crimson Rose (`#EF4444`)
- **Typography:**
  - Headings (`h1`-`h4`): `'Plus Jakarta Sans'`, sans-serif
  - Body & UI Controls: `'Inter'`, -apple-system, sans-serif
  - Financial, Unit Numbers, SQFT, Cap Rates: `'JetBrains Mono'`, monospace

### 1.2 Mandatory CSS Layer Order
```
1. Bootstrap 5.3 CDN & Bootstrap Icons CDN
2. assets/css/tokens/primitives.css    <-- Raw CSS Variables wrapped in :root
3. assets/css/tokens/semantic.css      <-- Semantic Intent Variables wrapped in :root
4. assets/css/base/reset.css           <-- CSS Normalization
5. assets/css/base/layout.css          <-- Core App Shell Grid (Sidebar, Topbar, Main)
6. assets/css/components/*.css         <-- Shared BEM Components (Buttons, Cards, Tables, etc.)
7. assets/css/pages/*.css              <-- Scoped Page Styles (.page-[name])
8. assets/css/main.css                 <-- Entry Aggregator (@import all layers)
```

---

## 2. 4-Developer Work Breakdown Structure (WBS)

| Role | Branch | Pages Owned | CSS Files Owned | Key Deliverables |
| :--- | :--- | :--- | :--- | :--- |
| **Dev 1 (Lead Architect)** | `main` / `Feature/Shourya` | • `index.html`<br>• `pages/portfolio.html` | • `tokens/*.css`<br>• `base/*.css`<br>• `main.css`<br>• `pages/dashboard.css`<br>• `pages/portfolio.css` | App Shell foundation, Executive Command Dashboard, Multi-Asset Grid, and Interactive Building Unit Stacker. *(See [DEV1_IMPLEMENTATION_PLAN.md](file:///d:/c-files/my-project/Mini%20project%202%20REPMS/DEV1_IMPLEMENTATION_PLAN.md) for step-by-step instructions)* |
| **Dev 2 (Tenant & Lease Lead)** | `feature/tenants-and-leases` | • `pages/tenants.html`<br>• `pages/leases.html` | • `components/tables.css`<br>• `components/badges.css`<br>• `components/forms.css`<br>• `pages/tenants.css`<br>• `pages/leases.css` | High-density Tenant Directory with quick-view drawer, Lease Lifecycle pipeline, and Rent Escalation schedule. |
| **Dev 3 (Finance & Operations)** | `feature/financials-and-maintenance` | • `pages/financials.html`<br>• `pages/maintenance.html` | • `components/cards.css`<br>• `components/modals.css`<br>• `components/charts.css`<br>• `pages/financials.css`<br>• `pages/maintenance.css` | Monthly Rent Roll statement table, NOI Tracker, Printable Invoice Generator Modal, Work Order Kanban board, and Vendor Dispatch SLA tracker. |
| **Dev 4 (Leasing CRM & ESG Analytics)** | `feature/leasing-and-analytics` | • `pages/leasing.html`<br>• `pages/analytics.html` | • `components/progress.css`<br>• `components/timeline.css`<br>• `components/filters.css`<br>• `pages/leasing.css`<br>• `pages/analytics.css` | Vacancy Showcase with floorplan previews, Prospective Tenant CRM Funnel, Asset Yield comparison charts, and ESG Sustainability Scorecard. |

---

## 3. Developer Detailed Implementation Blueprints

---

### 🏢 DEVELOPER 1: Lead Architect & Core Shell
> **Full standalone guide with code snippets:** Refer to [DEV1_IMPLEMENTATION_PLAN.md](file:///d:/c-files/my-project/Mini%20project%202%20REPMS/DEV1_IMPLEMENTATION_PLAN.md)

1. **Tokens & App Shell:**
   - Enclose `primitives.css` and `semantic.css` in `:root { ... }`.
   - Build `base/layout.css` providing the master `.rep-app-shell`, sticky `.rep-sidebar`, `.rep-topbar`, and `.app-main`.
2. **`index.html` (Executive Master Dashboard):**
   - KPI metric strip (Portfolio Value, Occupancy, Net Revenue, NOI, Open Work Orders).
   - Occupancy distribution breakdown across Residential, Commercial, Retail, Industrial.
   - Recent critical activity stream & urgent escalations.
   - Quick-action offcanvas drawer for emergency logging.
3. **`pages/portfolio.html` (Portfolio & Interactive Unit Stacker):**
   - Multi-asset filter pills: All, Residential, Commercial, Retail, Industrial, Land.
   - Asset grid cards with property specs, occupancy bars, and cap rates.
   - **Interactive Building Unit Stacker:** Multi-floor elevation visualizer (Floors 12 to 1) with color-coded unit tiles, tooltips on hover (tenant, sqft, rent), and unit details modal.

---

### 👥 DEVELOPER 2: Tenant & Lease Lifecycle Specialist
* **Target Files:**
  - `pages/tenants.html` (Scope: `<main class="app-main page-tenants">`)
  - `pages/leases.html` (Scope: `<main class="app-main page-leases">`)
  - `assets/css/components/tables.css`
  - `assets/css/components/badges.css`
  - `assets/css/components/forms.css`
  - `assets/css/pages/tenants.css`
  - `assets/css/pages/leases.css`

#### Key Features & Requirements for Dev 2:
1. **Shared Components to Build:**
   - `.rep-table`: High-density dark table (`table table-hover align-middle`) with sticky header, muted column titles, monospace amounts, and hover state (`background: var(--color-bg-surface-hover)`).
   - `.rep-badge`: Status pills (`.rep-badge--active`, `.rep-badge--expiring`, `.rep-badge--overdue`, `.rep-badge--vacant`).
   - `.rep-form-control`: Dark styled inputs with focus borders and floating labels.
2. **`pages/tenants.html`:**
   - Filter bar: Search by Tenant Name / Company, Property dropdown, Lease Status filter (Active, Delinquent, Expiring 30 Days).
   - Tenant Table: Avatar + Name, Assigned Unit, Property, Monthly Rent, Lease End Date, Payment Status Badge, Actions (`View Profile`, `Message`, `Create Notice`).
   - Tenant Profile Offcanvas / Modal (`#tenantProfileDrawer`): Complete tenant contact card, emergency contact, active lease term, security deposit escrow status, and recent payment ledger history.
3. **`pages/leases.html`:**
   - Lease Pipeline Stages: Draft (4), Active Leases (1,340), Renewal Review (24), Expired (12).
   - Escalation Schedule Table: Scheduled rent bump dates, CPI adjustments, and renewal options.
   - Pure HTML/CSS Lease Agreement Document Viewer Modal mock.

---

### 💰 DEVELOPER 3: Financial Operations & Maintenance Specialist
* **Target Files:**
  - `pages/financials.html` (Scope: `<main class="app-main page-financials">`)
  - `pages/maintenance.html` (Scope: `<main class="app-main page-maintenance">`)
  - `assets/css/components/cards.css`
  - `assets/css/components/modals.css`
  - `assets/css/components/charts.css`
  - `assets/css/pages/financials.css`
  - `assets/css/pages/maintenance.css`

#### Key Features & Requirements for Dev 3:
1. **Shared Components to Build:**
   - `.rep-card`: Standardized card elevation with glassmorphic border and padding variants.
   - `.rep-modal`: Styled modal overlays using Bootstrap 5.3 modal system with custom dark theme colors.
   - `.rep-bar-chart`: Pure CSS flex-based horizontal and vertical comparison bar charts.
2. **`pages/financials.html`:**
   - Financial Metric Strip: Gross Potential Rent ($2.1M), Collected ($1.85M), Delinquencies ($48K), Operating Expenses ($420K).
   - Monthly Rent Roll Statement: Unit #, Tenant, Base Rent, Utility Cam Fees, Late Charges, Total Due, Paid Date, Payment Method.
   - **Printable Invoice Modal (`#invoiceModal`):** Clean invoice layout with property logo, itemized breakdown, tax details, remit address, and printable CSS style (`@media print`).
3. **`pages/maintenance.html`:**
   - Work Order Kanban Board (or dual-view Kanban + Table):
     - Column 1: *Reported / Triage* (Urgent water leaks, HVAC issues)
     - Column 2: *Dispatched to Contractor*
     - Column 3: *In Progress / Parts Ordered*
     - Column 4: *Resolved & Inspected*
   - Priority badges: `Emergency` (flashing red), `High`, `Normal`, `Low`.
   - Dispatch Modal (`#dispatchModal`): Assign vendor (Plumbing, Electrical, HVAC), enter SLA timer, and set estimated cost cap.

---

### 🔑 DEVELOPER 4: Leasing CRM & Analytics / ESG Specialist
* **Target Files:**
  - `pages/leasing.html` (Scope: `<main class="app-main page-leasing">`)
  - `pages/analytics.html` (Scope: `<main class="app-main page-analytics">`)
  - `assets/css/components/progress.css`
  - `assets/css/components/timeline.css`
  - `assets/css/components/filters.css`
  - `assets/css/pages/leasing.css`
  - `assets/css/pages/analytics.css`

#### Key Features & Requirements for Dev 4:
1. **Shared Components to Build:**
   - `.rep-progress`: Gradient capacity meters and circular progress rings.
   - `.rep-timeline`: Vertical milestone progress tracker.
   - `.rep-filter-group`: Multi-button segmented controllers.
2. **`pages/leasing.html`:**
   - Available Units Showcase: Grid of vacant units with SqFt, Floorplan type (1B/1B, 2B/2B, Penthouse, Open Office), Price/SqFt, Available Date, and "Schedule Tour" button.
   - Prospect Application CRM Pipeline:
     - Stages: *New Inquiry &rarr; Tour Scheduled &rarr; Application Submitted &rarr; Credit/Background Check &rarr; Lease Sent*.
     - Prospect cards showing applicant name, target unit, income-to-rent ratio, and lead source.
3. **`pages/analytics.html`:**
   - Property Yield & Cap Rate comparative analysis.
   - **Executive ESG (Environmental, Social, Governance) Scorecard:**
     - Energy Star rating gauges per property.
     - Solar generation vs. Grid consumption metrics.
     - Carbon offset index and LEED Platinum/Gold status cards.

---

## 4. Zero-Collision Architecture Guidelines

To guarantee seamless git collaboration without merge conflicts or CSS style leaks:

1. **Strict Page Namespacing:**
   - Every page's `<main>` must use its assigned scope class:
     - `index.html` &rarr; `<main class="app-main page-dashboard">`
     - `pages/portfolio.html` &rarr; `<main class="app-main page-portfolio">`
     - `pages/tenants.html` &rarr; `<main class="app-main page-tenants">`
     - `pages/leases.html` &rarr; `<main class="app-main page-leases">`
     - `pages/financials.html` &rarr; `<main class="app-main page-financials">`
     - `pages/maintenance.html` &rarr; `<main class="app-main page-maintenance">`
     - `pages/leasing.html` &rarr; `<main class="app-main page-leasing">`
     - `pages/analytics.html` &rarr; `<main class="app-main page-analytics">`

2. **Scoped Page CSS Rule:**
   - Code inside `assets/css/pages/[module].css` **must always start with `.page-[module]`**:
     ```css
     /* Correct */
     .page-tenants .rep-tenant-avatar { width: 44px; height: 44px; }
     
     /* FORBIDDEN: will cause collisions across pages */
     .avatar { width: 44px; height: 44px; }
     ```

3. **Shared Components Isolation:**
   - Only edit components assigned to your developer role.
   - Shared components must use the `.rep-[block]` BEM naming convention and rely strictly on CSS variables from `primitives.css` and `semantic.css`.

4. **Git Branching Policy:**
   - All feature branches branch off `main` and are merged via clean Pull Requests:
     - `Feature/Shourya` (Dev 1)
     - `feature/tenants-and-leases` (Dev 2)
     - `feature/financials-and-maintenance` (Dev 3)
     - `feature/leasing-and-analytics` (Dev 4)

---

## 5. Development Milestones & Verification

| Milestone | Target | Description |
| :--- | :--- | :--- |
| **Phase 1** | Foundation & App Shell | Fix `:root` tokens, establish `layout.css` and `main.css`. *(Dev 1)* |
| **Phase 2** | Core Dashboard & Portfolio | Build `index.html` and `pages/portfolio.html` with the Building Unit Stacker. *(Dev 1)* |
| **Phase 3** | Tenant & Lease Hub | Build `pages/tenants.html` and `pages/leases.html`. *(Dev 2)* |
| **Phase 4** | Financials & Maintenance | Build `pages/financials.html` and `pages/maintenance.html`. *(Dev 3)* |
| **Phase 5** | Leasing CRM & ESG Analytics | Build `pages/leasing.html` and `pages/analytics.html`. *(Dev 4)* |
| **Phase 6** | Polish & Responsive Audit | Verify all 8 pages on desktop (1440px), tablet (768px), and mobile (375px). |
