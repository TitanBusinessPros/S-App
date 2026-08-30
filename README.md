# Survival Day

An offline-first wilderness survival guide app.

## Session Status (as of 2026-08-29 21:40 CDT)

This section exists so a new session (human or Claude Code) can pick up exactly where the last one left off. It intentionally contains **no credentials or secrets** — see "On credentials" below for why.

### What's built and deployed
- **Foundation**: Google-only sign-in (no email/password), dark UI shell, free/premium tier scaffold (Stripe not wired up yet — deliberately last on the list)
- **Compass**: magnetic heading (phone only) + star-compass (Polaris) guidance
- **Water & Terrain Map**: adjustable-radius water search via OpenStreetMap/Overpass, through a Cloud Function
- **7-Day Weather**: client-side, via Open-Meteo (no Cloud Function needed)
- **Field Guides**: First Aid, Shelter Building, Finding Water, Snares & Traps — general reference content, deliberately not tied to fabricated per-location claims
- **Plants, Wildlife & Wood**: a small hand-curated starter dataset (~24 Oklahoma species), cross-checked against real GBIF occurrence data and filtered by real season windows, via a Cloud Function
- Everything above has Jest/Vitest tests and is enforced by CI (100% Cloud Function test coverage is a hard gate — see `testing/functions/check-coverage.js`)
- Deployed live: **https://survival-day-app.web.app** (Firebase Hosting + Cloud Functions + Firestore, project `survival-day-app`, Blaze plan)

### Current blocker (unresolved)
The deployed Cloud Functions (`getWaterFeatures`, `getSpeciesNearby`, `healthCheck`) are returning `403 Forbidden` / "request was not authenticated" — the underlying Cloud Run services aren't allowing public invocation, even after adding an explicit `invoker: "public"` option in code and redeploying. This looks like a Google Cloud project-level policy blocking public IAM grants, not a code bug. **Next step**: check console.cloud.google.com/run?project=survival-day-app → each service → Permissions → try adding `allUsers` as `Cloud Run Invoker`, and see whether it saves or hits a policy error.

### Also open
- **Weather accuracy complaint**: user reported the 7-day forecast looked "off" — code review found no obvious bug; needs specific numbers (what the app showed vs. actual forecast) to investigate further, since this is a client-side-only feature I can't inspect via server logs.
- **Crowd-sourced wildlife sightings**: not built yet. This is the real substitute for "live satellite of predators nearby," which isn't a feasible product (no satellite service can detect animals in real time) — the plan is user-reported sightings shown on the map instead.
- **Gemini in Firebase / GCA (Gemini Cloud Assist)**: not integrated. GCA is a console-embedded assistant (not callable from this session); could be used by the user directly in GCP console for troubleshooting. Gemini-in-Firebase could later power a conversational "ask the guide" layer, but should not be the source of truth for safety-critical content (edibility/danger).
- **Stripe**: explicitly deferred by the user until everything else is working.

### Known past bugs (fixed, documented so they aren't reintroduced)
- `firebase.json`'s functions `ignore` list used to include `"lib"`, which silently stripped compiled output out of every deploy (`lib/index.js does not exist` build failures). Removed — the ignore list should only ever contain `node_modules`, `.git`, and debug logs.
- `firebase-admin`/`firebase-functions` used to get installed as separate copies at the repo root vs. `functions/`, which silently broke Jest mocks (tests mocked one copy, real code used another). Fixed by converting to npm workspaces + pinning a shared `firebase-admin` version at the root.
- Hosting can upload files successfully but never "release" (activate) them if the overall `firebase deploy` command errors out afterward (e.g. on the Artifact Registry cleanup-policy nag) — check for "release complete" in the deploy log, not just "file upload complete."

### On credentials — deliberately not listed here
This file will never contain actual tokens, API keys, or passwords, even in a private repo — that would contradict this project's own first rule (Stripe/secrets go in GitHub Actions secrets, never committed) and would be a real exposure risk once this repo has any collaborator or ever goes public. What's true as of this session, without exposing anything:
- **GitHub**: CLI (`gh`) authenticated as `TitanBusinessPros`; repo is `github.com/TitanBusinessPros/S-App`; branch protection on `main` requires a PR + all 3 CI checks (even for admins)
- **Firebase**: CLI authenticated to the same Google account; project `survival-day-app` is on the **Blaze** plan; Google is the only enabled sign-in provider
- A future session re-authenticates the same way this one did (`gh auth login`, `firebase login`) — those credentials live in this machine's own OS-level credential store, not in this repo, and aren't something any file can hand off.

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
