# Ledger — ERP Dashboard

A React + Tailwind CSS dashboard for financial reporting and inventory management, built to
talk to a backend at `http://localhost:8080` using HTTP Basic Authentication.

## Stack

- **React 18** + **Vite** (fast dev server, no framework lock-in — swap for Next.js App Router
  if you prefer, the components don't use any Vite-specific APIs)
- **Tailwind CSS** for styling, with a small set of shadcn-style primitives in
  `src/components/ui/` (Button, Input, Card, Modal, Toast) instead of pulling in the full
  shadcn/ui CLI, to keep the project dependency-light
- **lucide-react** for icons
- **Axios**, configured in `src/lib/api.js`, with HTTP Basic Auth attached automatically

## Getting started

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173` and expects the ERP API to be reachable at
`http://localhost:8080` (see `BASE_URL` in `src/lib/api.js` if it lives elsewhere).

## How authentication works

1. The login screen (`src/components/Login.jsx`) collects a username and password.
2. `setAuthCredentials()` in `src/lib/api.js` base64-encodes them and attaches
   `Authorization: Basic <token>` to every subsequent Axios request via
   `client.defaults.headers.common`.
3. Credentials are verified by calling `GET /req/reports/daily` for today's date — if that
   401s, the login form shows an error.
4. Credentials are kept in `sessionStorage` (not `localStorage`) so a page refresh doesn't force
   a re-login, but nothing survives closing the tab/browser.

## Project structure

```
src/
  lib/
    api.js            # Axios instance + all endpoint calls + error formatting
    format.js          # currency/date formatting helpers
  components/
    ui/                # Button, Input, Card, Modal, Toast — shared primitives
    Login.jsx
    Sidebar.jsx
    ReportsDashboard.jsx      # Tab 1: KPI cards + date filters
    InventoryManagement.jsx   # Tab 2: quick-action cards + activity log
    modals/
      CreateOrderModal.jsx
      AddProductModal.jsx
      RestockModal.jsx
  App.jsx              # auth gating + tab routing
  main.jsx
```

## Endpoints wired up

| Method | Path | Used by |
|---|---|---|
| GET | `/req/reports/daily?date=YYYY-MM-DD` | Reports tab (Day filter) |
| GET | `/req/reports/monthly?month=MM&year=YYYY` | Reports tab (Month filter) |
| GET | `/req/reports/yearly?year=YYYY` | Reports tab (Year filter) |
| POST | `/req/inventory/order` | "Create new order" modal |
| PUT | `/req/inventory/add_stock?prodId={id}&quantity={qty}` | "Restock product" modal |
| POST | `/req/inventory/Adder` | "Add new product" modal |

## Notes / things to wire up next

- There's no "list products" endpoint in the spec, so product IDs are entered manually in the
  order and restock forms. If/when a `GET /req/inventory/products` (or similar) endpoint exists,
  swap the plain Product ID input for a searchable select and drop the info banner in
  `InventoryManagement.jsx`.
- The "Recent activity" list in the Inventory tab is session-only client state (it resets on
  refresh) since there's no orders-list endpoint yet to hydrate it from.
- All error handling flows through `getErrorMessage()` in `api.js`, which special-cases 401s and
  network failures so toasts stay readable.
