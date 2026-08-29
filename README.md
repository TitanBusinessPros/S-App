# Survival Day

An offline-first wilderness survival guide app.

## Structure

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
# Web app
cd web && npm install && npm run dev

# Functions — build + test
npm install               # root: installs jest/ts-jest test tooling
cd functions && npm install && npm run build && cd ..
npm run test:functions
```
