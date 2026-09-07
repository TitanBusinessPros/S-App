# Survival Day

An offline-first wilderness survival guide app.

## Session Status (as of 2026-09-07 CDT)

This section exists so a new session (human or Claude Code) can pick up exactly where the last one left off. It intentionally contains **no credentials or secrets** — see "On credentials" below for why.

### What's built and deployed
- **Foundation**: Google-only sign-in (no email/password), dark UI shell, tiered access (`trial` → `free`/`premium`/`gold`) computed client-side via `web/src/lib/entitlement.ts`. Once the 3-day trial ends (and absent a `premium`/`gold` tier), every feature locks except **Compass** and **First Aid**, which stay free permanently: `components/PaidFeatureRoute.tsx` redirects a locked route straight to `/app/upgrade` (so direct URLs/bookmarks can't bypass it either), and `Dashboard.tsx` shades locked feature cards and points their links at the same pricing page instead of the feature. The two Cloud-Function-backed paid features (`getWaterFeatures`, `getSpeciesNearby`) also enforce this server-side via `functions/src/entitlement.ts`'s `requirePaidAccess` — re-reading the caller's own Firestore tier and rejecting with `permission-denied` — so calling those functions directly, bypassing the UI entirely, can't return real data to a locked account either. The remaining locked pages (Shelter, Finding Water, Snares, Fire Starting, Water Purification, Waypoints, Recipes) are still UI-gated only, since their content is static data bundled into the client either way, not fetched per-request from anything that could check a tier.
- **Billing**: Stripe is fully wired up — $12/year via a Stripe Payment Link (`web/src/lib/stripe.ts` builds the checkout URL), `stripeWebhook` Cloud Function keeps each user's Firestore tier in sync with their subscription, `grantGoldMembership`/`backfillTrialTiers` are admin-only callables for manual grants and one-time migrations. New sign-ins get a 3-day trial (`TRIAL_DURATION_MS` in `functions/src/constants.ts`)
- **Compass**: magnetic heading (phone only) + star-compass (Polaris) guidance
- **Waypoints & Trail**: drop a pin, record a GPS breadcrumb trail back to it, all local (device GPS + local storage, no backend). The "You" marker tracks your live position continuously — during recording (fed by the same GPS watch) and after you stop (a separate watch takes over automatically) — plus a "📏 Off trail" readout (distance to the nearest point on the recorded path, not just to the start pin) and a trail-map frame that only grows, never rescales on every GPS tick, so movement reads as real motion instead of looking frozen. The trail's start point also self-corrects if a much more accurate GPS fix arrives within the first few seconds. A 3-step "how to use this" guide sits at the top of the page.
- **Water & Terrain Map**: adjustable-radius water search via USGS's 3D Hydrography Program (3DHP), through a Cloud Function; the map's "street" basemap is OpenFreeMap vector tiles (via the MapLibre GL Leaflet binding, `MapWater.tsx`'s `OpenFreeMapLayer`) — verified against OpenFreeMap's own ToS (Feb 2025) before adopting, no non-commercial restriction — and the "topo" basemap is USGS's public-domain USGSTopo raster tiles. Lookups are manual and rate-limited: a "Scan for Water" button next to "Re-center on me" is the only way to trigger a search (nothing auto-fetches on load, location change, or radius change anymore), and each press costs 1 of `DAILY_WATER_SCAN_LIMIT` (3) credits per rolling 24h window — enforced server-side in `getWaterFeatures` itself (`functions/src/waterScanCredits.ts`), not just hidden client-side, so it can't be bypassed. Credits are tracked per-user in `waterScanCredits/{uid}`, readable by that user only. The page itself is lazy-loaded (`React.lazy` in `App.tsx`) since Leaflet + MapLibre GL together are too large for the PWA's 2 MiB per-file precache limit if bundled into the main chunk.
- **Field Guides** — First Aid, Shelter Building, Finding Water, and Snares & Traps were each rebuilt around much larger structured reference content (see "Major content overhaul" below); Fire Starting and Water Purification (25 improvised filters) are unchanged. All are general reference content, deliberately not tied to fabricated per-location claims.
- **Plants, Wildlife & Wood**: a small hand-curated starter dataset (~24 Oklahoma species), cross-checked against real GBIF occurrence data and filtered by real season windows, via a Cloud Function
- **Legal/site polish**: Terms of Service (18+ eligibility, trapping/hunting/fishing regulatory language), Privacy Policy (18+ age requirement), shared footer, real app icon as favicon
- Section/card headers are centered consistently app-wide (deliberately excluding repeated per-item list cards like recipe/species cards, and the Terms/Privacy numbered legal sections — see the `center-section-headers` PR for the reasoning)
- Everything above has Jest/Vitest tests and is enforced by CI (100% Cloud Function test coverage is a hard gate — see `testing/functions/check-coverage.js`)
- Deployed live: **https://survival-day-app.web.app** (Firebase Hosting + Cloud Functions + Firestore, project `survival-day-app`, Blaze plan)

### Major content overhaul (2026-09-06)
Four Field Guide pages were rebuilt from short hand-picked sections into much larger structured references, each provided directly by the user and each following the same pattern: content lives in a `web/src/lib/*Data.ts` file (not inline in the component) with its own data-integrity test (sequential numbering, no gaps/duplicates, every field non-empty), and the page just maps over it.

- **First Aid** (`firstAidData.ts`): a 7-point "Universal Response" checklist + 100 problem→action rows across 4 categories, rendered as a responsive table.
- **Shelter Building** (`shelterData.ts`): a 5-part "Universal Shelter Rules" checklist + all 15 shelter designs (full build steps, key details) + a "things I would not recommend" list.
- **Finding Water** (`findingWaterData.ts`): "First Priorities" + 50 numbered methods across 3 categories, a dedicated "how to dig a seep hole" procedure, a "methods to avoid" table, and a treatment-methods comparison table (boiling/filter/chemical/UV/settling).
- **Snares & Traps** (`trapDesignsData.ts`): kept the pre-existing wire-loop/noose snare designs (Squirrel Pole, Rabbit Run Snare, Twitch-Up Spring Snare — genuinely not covered by the new material) and added 100 primitive trap/live-capture/aquatic-trap designs across 4 categories, each a collapsed-by-default `<details>` card (100 always-open cards would be unusable on a phone).

Each rebuild included an explicit **duplicate/contradiction check** against the page it replaced, not just an addition — e.g. Finding Water's old "Solar Still" how-to and "animal trails are a water indicator" claim were both *removed*, not kept alongside, because the new source material explicitly lists them as failure-prone/methods to avoid.

Shared UI patterns that came out of doing this 3-4 times: `.guide-table`/`.guide-nav`/`.guide-subheading` in `web/src/components/GuidePage.css` (promoted there after First Aid, Shelter, and Snares each needed the same responsive table/nav/subheading pattern, rather than copy-pasting a 4th time).

### Recently resolved (documented so it isn't re-investigated from scratch)
- The `403 Forbidden` / "request was not authenticated" issue on `getWaterFeatures`/`getSpeciesNearby`/`healthCheck` is fixed — every callable/HTTP function now deploys with `invoker: "public"` and its Cloud Run IAM policy correctly grants `allUsers` → `roles/run.invoker`. Verified directly via `gcloud run services get-iam-policy <fn> --region=us-central1 --project=survival-day-app`.
- The breadcrumb trail's "You" marker used to be a one-time location snapshot (only updated on page load or a manual refresh tap) instead of a live position — a user report ("the yellow dot doesn't follow me") led to fixing this, then a follow-up report ("still doesn't visibly move while recording") found the *real* underlying cause: the trail map's SVG viewBox was rescaling to fit the exact live position on every GPS tick, which visually masked real movement while the trail was actively growing. Both are fixed — see "Waypoints & Trail" above.

### Also open
- **Crowd-sourced wildlife sightings**: not built yet. This is the real substitute for "live satellite of predators nearby," which isn't a feasible product (no satellite service can detect animals in real time) — the plan is user-reported sightings shown on the map instead.
- **Gemini in Firebase / GCA (Gemini Cloud Assist)**: not integrated. GCA is a console-embedded assistant (not callable from this session); could be used by the user directly in GCP console for troubleshooting. Gemini-in-Firebase could later power a conversational "ask the guide" layer, but should not be the source of truth for safety-critical content (edibility/danger).
- **CI auto-deploy on merge to `main`**: proposed and declined — merging a PR only updates the GitHub repo, not the live site (deploys are manual, `firebase deploy`). Setting up auto-deploy would need a new GCP service account for GitHub Actions to authenticate with, which the user opted not to grant; deploys stay a deliberate, asked-before-each-time step (see "On credentials" and the workflow note below).
- **Nominatim usage risk at real scale**: a 2026-09-07 cost review (prompted by "what would this cost at 10,000 daily users") found the Water & Terrain Map's basemap tiles (`tile.openstreetmap.org`) and the reverse-geocoding call in `getLocationName` (`nominatim.openstreetmap.org`) both ran on OSM Foundation's free public infrastructure, whose usage policy explicitly warns commercial/heavy use may be blocked without notice. The tile half is now resolved — the basemap moved to OpenFreeMap (see "Water & Terrain Map" above), whose ToS carries no such restriction. **Nominatim is still open**: `getLocationName` (also used by Plants, Wildlife & Wood for its location label) still hits `nominatim.openstreetmap.org` directly, and OSM's usage policy specifically discourages Nominatim's exact use pattern here. At meaningful scale this is a real availability risk, not just a cost line — geocoding could go dark with no warning. Rough estimate at 10k DAU: ~$45–90/mo for a paid geocoder, if/when it's ever forced. Not urgent at current traffic; worth revisiting before any real growth push.

### Removed features (documented so they aren't blindly re-added)
- **7-Day Weather** (2026-09-07): removed entirely — page, nav entry, route, `web/src/lib/weather.ts` (the Open-Meteo client), and the corresponding Privacy Policy language. Open-Meteo's own terms restrict the free API tier to non-commercial use ("websites or apps that have subscriptions" are explicitly commercial), and this app already sells a paid subscription — so the free tier was never actually compliant to build on. Re-adding this feature needs a paid Open-Meteo plan (or an equivalent commercially-licensed weather API) lined up first; see `web/src/pages/Weather.tsx` in git history (this commit) for the working implementation to restore from. Note: `getLocationName` (`functions/src/location.ts`, reverse geocoding via Nominatim) was Weather's *other* dependency but is **not** removed — Plants, Wildlife & Wood also calls it for its location label, so it's still live and still deployed.

### Known past bugs (fixed, documented so they aren't reintroduced)
- `firebase.json`'s functions `ignore` list used to include `"lib"`, which silently stripped compiled output out of every deploy (`lib/index.js does not exist` build failures). Removed — the ignore list should only ever contain `node_modules`, `.git`, and debug logs.
- `firebase-admin`/`firebase-functions` used to get installed as separate copies at the repo root vs. `functions/`, which silently broke Jest mocks (tests mocked one copy, real code used another). Fixed by converting to npm workspaces + pinning a shared `firebase-admin` version at the root.
- Hosting can upload files successfully but never "release" (activate) them if the overall `firebase deploy` command errors out afterward (e.g. on the Artifact Registry cleanup-policy nag) — check for "release complete" in the deploy log, not just "file upload complete."
- Styling a `<summary>` element with `display: flex` (or anything other than its default `list-item`) silently removes its native disclosure triangle in most browsers, even if `::marker` is separately styled — the marker box generation is tied to `display: list-item`. This made the Snares & Traps page's 100 collapsible trap-design cards look like plain, non-interactive text with no hint they could be tapped to reveal content. Fix: suppress the native marker explicitly (`list-style: none` plus `::-webkit-details-marker { display: none }` for Safari) and render your own toggle icon as part of the `<summary>` content instead of relying on browser marker behavior.

### On credentials — deliberately not listed here
This file will never contain actual tokens, API keys, or passwords, even in a private repo — that would contradict this project's own first rule (Stripe/secrets go in GitHub Actions secrets, never committed) and would be a real exposure risk once this repo has any collaborator or ever goes public. What's true as of this session, without exposing anything:
- **GitHub**: CLI (`gh`) authenticated as `TitanBusinessPros`; repo is `github.com/TitanBusinessPros/S-App`; branch protection on `main` requires a PR + all 3 CI checks (even for admins)
- **Firebase**: CLI authenticated to the same Google account; project `survival-day-app` is on the **Blaze** plan; Google is the only enabled sign-in provider
- **Google Cloud**: `gcloud` CLI is also authenticated (as `titanbusinesspros@gmail.com`), which is what let this session inspect and confirm Cloud Run IAM policy directly instead of only through the Firebase CLI or console
- A future session re-authenticates the same way this one did (`gh auth login`, `firebase login`, `gcloud auth login`) — those credentials live in this machine's own OS-level credential store, not in this repo, and aren't something any file can hand off.

## Structure

This is an npm workspaces monorepo — one `npm install` at the root installs everything into a single deduped `node_modules` tree (this matters: `functions/` and `web/` used to get their own separate copies of shared packages, which silently broke Jest mocks in tests since the mock and the real code were different physical module instances).

- `web/` — React + TypeScript PWA (Vite), installable and fully usable offline via service worker precaching.
- `functions/` — Firebase Cloud Functions (TypeScript).
- `testing/functions/` — Tests for every Cloud Function, plus `check-coverage.js`, which CI runs on every PR to fail the build if any deployed function lacks a matching test.
- `firebase.json`, `.firebaserc`, `firestore.rules`, `storage.rules` — Firebase project config (project: `survival-day-app`).

## Workflow

All changes go through a branch → PR → CI (green) → merge. Nothing is pushed directly to `main`.

Every new Cloud Function added to `functions/src/` must have a corresponding test in `testing/functions/` referencing it by name, or CI will fail the `function-test-coverage` check.

Merging to `main` does **not** deploy — CI has no deploy step (see "Also open" above). A Claude Code session working on this repo commits/pushes/merges without asking for confirmation at each step once CI is green, but always asks before actually running `firebase deploy`, since that's the one step in the pipeline that's immediately outward-facing to real users.

Stripe and other secrets are stored in GitHub Actions secrets — never committed to this repo.

## Local development

```bash
npm install                        # once, from the repo root — installs everything

npm run dev --workspace web        # web app dev server
npm run build --workspace functions && npm run test:functions   # functions build + test
```
