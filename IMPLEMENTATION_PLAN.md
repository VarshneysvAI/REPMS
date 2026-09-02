# REPMS (Real Estate Property Management System)
## 4-Member UI Implementation Plan & Architectural Blueprint

> **Project Goal:** Build a state-of-the-art, high-fidelity UI prototype for a **Real Estate Property Management System (REPMS)** covering all major real estate asset classes (Residential, Multi-Family, Commercial Office, Retail Malls, Industrial Warehouses, Mixed-Use, Vacant Land).
> 
> **Tech Stack:** HTML5 & CSS3 strictly (Design Tokens, Custom Properties, BEM Methodology, CSS Grid & Flexbox). Pure CSS interactive states (`:hover`, `:focus-within`, `:checked` CSS drawer/modal patterns). Prepared for future JavaScript hydration & React migration.

---

## 1. Domain Research & Modern Real Estate Scenario Analysis

In current real estate operations, property management platforms must serve multiple stakeholders: **Property Managers**, **Asset Owners**, **Tenants/Lessees**, and **Maintenance Vendors**. A modern REPMS requires an intuitive, high-density yet visually stunning web application.

### Key Scenarios Covered across Asset Types:
1. **Multi-Asset Portfolio Visualizer:**
   - Single dashboard tracking diverse portfolios (e.g., Luxury Residential Apartments, Class-A Office Towers, Retail Strip Malls, Industrial Logistics Parks).
   - Occupancy rate breakdown per property, unit stacking visualizer, asset health/ESG rating.
2. **Tenant & Lease Lifecycle Hub:**
   - Active, expiring, and upcoming lease agreements.
   - Escalation clauses, rent collection schedules, security deposit escrows, and tenant communication history.
3. **Financial Operations & Revenue Tracking:**
   - Net Operating Income (NOI) calculation views, Rent Roll tracking, Overdue Payments alerts, invoice generation views.
4. **Maintenance & Dispatch Operations:**
   - Priority-based Work Order pipeline (Emergency, High, Medium, Low).
   - Dispatch tracking, vendor assignment, SLA countdowns, and maintenance cost metrics.
5. **Leasing CRM & Prospect Onboarding:**
   - Vacancy listings gallery, prospective tenant application pipeline, scheduling tours, lease offer previews.
6. **Executive ESG & Analytics:**
   - Energy consumption metrics, carbon offset ratings, property yield analysis, customizable reporting cards.

---

## 2. System Design & Conflict-Free CSS Architecture

To allow **4 developers** to build simultaneously without CSS collisions or git merge conflicts, we enforce strict **Architectural Layering**, **BEM Class Naming**, and **Page-Scoped Namespaces**.

### 2.1 CSS Layer Hierarchy

```
assets/css/tokens/primitives.css  -->  assets/css/tokens/semantic.css
                                              |
                                              v
                              assets/css/base/reset.css & layout.css
                                              |
                                              v
                              assets/css/components/*.css (Shared BEM)
                                              |
                                              v
                              assets/css/pages/*.css (Scoped per dev)
                                              |
                                              v
                              assets/css/main.css (Master import)
```

### 2.2 Directory & File Layout

```
Mini project 2 REPMS/
├── index.html                      # Executive Dashboard (Dev 1)
├── pages/
│   ├── portfolio.html              # Property & Unit Stack Directory (Dev 1)
│   ├── tenants.html                # Tenant Directory (Dev 2)
│   ├── leases.html                 # Lease Agreements & Terms (Dev 2)
│   ├── financials.html             # Financial Operations & Rent Roll (Dev 3)
│   ├── maintenance.html            # Work Orders & Vendor Portal (Dev 3)
│   ├── leasing.html                # Vacancies & Prospect CRM (Dev 4)
│   └── analytics.html              # Executive Analytics & ESG Reports (Dev 4)
└── assets/
    ├── css/
    │   ├── main.css                # Master CSS bundle (@import aggregator)
    │   ├── tokens/
    │   │   ├── primitives.css      # Primitive values (Colors, Font Sizes, Shadows)
    │   │   └── semantic.css        # Semantic intents (--color-brand-primary, --color-surface)
    │   ├── base/
    │   │   ├── reset.css           # Modern CSS normalization
    │   │   └── layout.css          # Core App Shell Grid (Sidebar, Header, Main, Footer)
    │   ├── components/
    │   │   ├── buttons.css         # Button variants & states (Shared)
    │   │   ├── cards.css           # Metric & content card styling (Dev 3)
    │   │   ├── tables.css          # High-density data tables & pagination (Dev 2)
    │   │   ├── badges.css          # Status, priority & property type pills (Dev 2)
    │   │   ├── forms.css           # Input fields, filters, search bars (Dev 2)
    │   │   ├── modals.css          # CSS-pure drawer & modal overlays (Dev 3)
    │   │   ├── progress.css        # Progress bars, capacity meters, ESG gauges (Dev 4)
    │   │   └── charts.css          # Pure CSS bar/donut/line visual charts (Dev 3)
    │   └── pages/
    │       ├── dashboard.css       # Scope: .page-dashboard (Dev 1)
    │       ├── portfolio.css       # Scope: .page-portfolio (Dev 1)
    │       ├── tenants.css         # Scope: .page-tenants (Dev 2)
    │       ├── leases.css          # Scope: .page-leases (Dev 2)
    │       ├── financials.css      # Scope: .page-financials (Dev 3)
    │       ├── maintenance.css     # Scope: .page-maintenance (Dev 3)
    │       ├── leasing.css         # Scope: .page-leasing (Dev 4)
    │       └── analytics.css       # Scope: .page-analytics (Dev 4)
    └── images/                     # Structured media assets & floorplans
```

---

## 3. 4-Member Work Breakdown Structure (WBS)

### Developer 1: Lead Architect & Dashboard / Portfolio Specialist
* **Responsibilities:**
  - Standardize App Shell (`base/reset.css`, `base/layout.css`, `assets/css/main.css`).
  - Maintain top navigation header (Search, Notifications, Profile) and main sidebar navigation menu.
  - Build **`index.html`** (Executive Master Dashboard):
    - Multi-asset KPI Summary Cards (Total Properties, Overall Occupancy Rate, Monthly Revenue, Pending Maintenance).
    - Quick Action Drawer (Add Property, Log Payment, Issue Work Order).
    - Recent Activity Stream & Occupancy Visual Overview.
  - Build **`pages/portfolio.html`** (Portfolio & Unit Stack):
    - Filterable Asset Grid (Residential, Commercial Office, Retail, Industrial, Mixed-Use).
    - Property Detail Modal / View with Building Unit Stacking visualization.

### Developer 2: Tenant & Lease Lifecycle Specialist
* **Responsibilities:**
  - Build shared components: `components/tables.css`, `components/badges.css`, `components/forms.css`.
  - Build **`pages/tenants.html`** (Tenant Directory):
    - Multi-tenant directory table with advanced filtering (Active, Lease Expiring, Outstanding Balance).
    - Tenant profile drawer showing contact info, assigned unit, payment history status, security deposit status.
  - Build **`pages/leases.html`** (Lease Management Hub):
    - Lease agreement pipeline view (Draft, Active, Renewal Review, Expired).
    - Escalation schedule view, security deposit ledger, legal document links preview.

### Developer 3: Financial Operations & Maintenance Specialist
* **Responsibilities:**
  - Build shared components: `components/cards.css`, `components/modals.css`, `components/charts.css`.
  - Build **`pages/financials.html`** (Financials & Rent Roll):
    - Rent Roll statement table with payment status indicators (Paid, Partial, Overdue, Late Fee).
    - Income vs. Expense summary cards & Net Operating Income (NOI) tracker.
    - Interactive Invoice Generator Modal layout (Pure CSS target selector).
  - Build **`pages/maintenance.html`** (Work Orders & Vendor Hub):
    - Work order board (Kanban style / List view) categorized by status (Open, In Progress, Pending Vendor, Resolved).
    - Dispatch modal & Vendor rating list.

### Developer 4: Leasing CRM & Analytics / ESG Specialist
* **Responsibilities:**
  - Build shared components: `components/progress.css`, `components/timeline.css`, `components/filters.css`.
  - Build **`pages/leasing.html`** (Vacancies & Prospect CRM Pipeline):
    - Vacant unit showcase grid with key specs (SqFt, Rent/Mo, Available Date, Amenities).
    - Prospect lead management funnel (Inquiry -> Tour Scheduled -> Application Submitted -> Approved).
  - Build **`pages/analytics.html`** (Analytics & ESG Sustainability Hub):
    - Asset Yield & NOI comparative charts (Pure CSS styled bar & donut charts).
    - Energy & Sustainability ESG Scorecards (Green Building rating, Energy Star index, Solar generation).

---

## 4. Strict Code Quality & Zero-Conflict Guidelines

1. **Class Namespacing:**
   - Every page container must have a unique scope class: e.g., `<main class="app-main page-financials">`.
   - Page-specific styles in `assets/css/pages/financials.css` must strictly target `.page-financials .element`.
2. **Component Isolation:**
   - Shared components rely ONLY on CSS variables defined in `primitives.css` and `semantic.css`.
   - Never use element tag selectors directly (e.g., use `.rep-btn` instead of `button`).
3. **Pure CSS Interactivity:**
   - Modals and drawers utilize the CSS `:checked` checkbox hack or `:target` pseudo-class for open/close states without JS required.
4. **Git Branching Strategy:**
   - `main` branch: Stable production prototype.
   - Developer branches:
     - `feature/shell-and-dashboard` (Dev 1)
     - `feature/tenants-and-leases` (Dev 2)
     - `feature/financials-and-maintenance` (Dev 3)
     - `feature/leasing-and-analytics` (Dev 4)

---

## 5. Development Timeline (4-Day Sprint Roadmap)

| Day | Milestone | Tasks |
|:---|:---|:---|
| **Day 1** | Architecture & Base Tokens | Token validation, Global reset, App shell grid setup, shared components framework. |
| **Day 2** | Core Pages & Mock Data | `index.html` (Dashboard), `tenants.html`, `financials.html`, `leasing.html` layouts built. |
| **Day 3** | Secondary Pages & Components | `portfolio.html`, `leases.html`, `maintenance.html`, `analytics.html` layouts + modals. |
| **Day 4** | Visual Polish & Review | Pure CSS interactive states, responsiveness tuning, cross-browser check & final push to GitHub. |
