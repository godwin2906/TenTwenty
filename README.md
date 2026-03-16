# ticktock — Timesheet Management App

A timesheet management web application built with React, TypeScript, Vite, and Tailwind CSS.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

**Demo credentials:**
- Email: `john@example.com`
- Password: `password123`

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run all tests (vitest) |
| `npm run test:watch` | Run tests in watch mode |

---

## Architecture Notes

### API Layer
All data access goes through `src/api/`. Components never import mock data directly.
Swapping mocks for real fetch calls requires changes only in the api/ folder.

### Authentication
Uses `window.sessionStorage` — session is cleared when the tab closes.
Every API call validates the session token before proceeding.

Note on next-auth: next-auth is Next.js-specific and cannot run in a Vite SPA.
The pattern here mirrors next-auth's session model (token + user, validated per-request).

### Status Logic
- missing = 0 hours
- incomplete = 1–39 hours
- completed = 40+ hours
Status is recomputed in the API layer after every mutation.

### Date Range Filter
A week is included if any part of it overlaps the selected range.
Selecting Jan 1–10 returns Week 1 (Jan 1–5) AND Week 2 (Jan 8–12).
