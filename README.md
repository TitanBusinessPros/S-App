# Survival Day

An offline-first wilderness survival guide app.

## Structure

This is an npm workspaces monorepo — one `npm install` at the root installs everything into a single deduped `node_modules` tree (this matters: `functions/` and `web/` used to get their own separate copies of shared packages, which silently broke Jest mocks in tests since the mock and the real code were different physical module instances).

- `web/` — React + TypeScript PWA (Vite), installable and fully usable offline via service worker precaching.
- `functions/` — Firebase Cloud Functions (TypeScript).
- `testing/functions/` — Tests for every Cloud Function, plus `check-coverage.js`, which CI runs on every PR to fail the build if any deployed function lacks a matching test.
- `firebase.json`, `.firebaserc`, `firestore.rules`, `storage.rules` — Firebase project config (project: `survival-day-app`).

## Workflow

All changes go through a branch → PR → CI (green) → merge. Nothing is pushed directly to `main`.

Every new Cloud Function added to `functions/src/` must have a corresponding test in `testing/functions/` referencing it by name, or CI will fail the `function-test-coverage` check.

Stripe and other secrets are stored in GitHub Actions secrets — never committed to this repo.

## Local development

```bash
npm install                        # once, from the repo root — installs everything

npm run dev --workspace web        # web app dev server
npm run build --workspace functions && npm run test:functions   # functions build + test
```
