# NutriLogistics

## Cursor Cloud specific instructions

### Overview

NutriLogistics is a React + TypeScript single-page application for fitness food subscriptions. The app uses Vite for bundling, Tailwind CSS v4 for styling, Zustand for state management (persisted to localStorage), and optionally connects to Supabase for backend services.

**Important:** The `main` branch is empty (placeholder README only). All application code lives on feature branches (e.g. `cursor/nutrilogistics-webapp-a11c`). Check out a feature branch before running any commands.

### Running the app

Standard commands from `package.json`:

- `npm run dev` — starts Vite dev server on port 5173
- `npm run build` — runs `tsc -b && vite build`
- `npm run lint` — runs ESLint
- `npm run preview` — serves the production build

### Demo mode

The app runs fully in **demo mode** with hardcoded mock data (14 fitness products in `src/lib/mockData.ts`) when Supabase environment variables are not set. No `.env` file is needed for local development. Supabase integration is optional and requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`.

### Gotchas

- The dev server binds to localhost by default. Use `npm run dev -- --host 0.0.0.0` to expose on all interfaces if testing from another machine or the Desktop pane.
- No automated test suite (unit/integration tests) exists in this codebase. Verification is done via `npm run lint` and `npm run build` (which includes TypeScript type checking).
- State is persisted in localStorage via Zustand — clear localStorage or use incognito mode to reset cart/subscription state during testing.
