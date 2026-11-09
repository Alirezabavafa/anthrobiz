# AnthroBiz public website and business workspace

A public marketing homepage, open directory of 120+ tools, anonymous issue matching, an implementation-expert marketplace prototype, and a private business workspace.

## Routes
- `/`: homepage explaining the roundtable and sample-testing space.
- `/discover`: public search, task-based general suggestions, alternatives and possible tool combinations.
- `/proof-lab`: fictional salon workflow demo; not a commercial product benchmark.
- `/experts`: browse illustrative implementation-specialist profiles, create a private project brief, or apply to be listed.
- `/onboarding`: public five-step profile setup and confirmation.
- `/dashboard`: browser-local profile, next steps, saved tools and trial progress.

## Public workspace and storage
Public visitors can create a browser-local AnthroBiz workspace without a ChatGPT account or password. Profiles, saved tools, KPI updates and trial notes stay in that browser's local storage and do not follow the visitor to another device. Existing Sites-authenticated workspaces remain supported: their API operations require verified platform identity, and D1 queries are scoped by that identity, never an ID supplied by the browser. Cross-origin writes are rejected and submitted data is bounded and normalized. D1 schema is in drizzle/0000_workspaces.sql.

## GitHub Pages
The repository includes a Pages workflow in `.github/workflows/pages.yml`. After pushing to `main`, enable **Settings → Pages → Source: GitHub Actions**. The workflow validates the prototype, builds `pages-dist`, adjusts links for either a user site or project site, and deploys it. GitHub Pages runs the public browser-local workspace; it does not run the Worker or D1 API.

Revenue is an optional range with a Prefer not to say choice. Anonymous issue matching runs locally, without an external AI request. A submitted issue is carried in tab sessionStorage only when the visitor chooses signup, then reviewed before profile creation. Previously local-only prototype profiles are not silently imported or uploaded.

## Source and build
- web/: authored static interface and all real provider logo PNGs.
- worker/index.js: request handling, access checks and persistence.
- scripts/build-worker.mjs: builds the Worker and embeds static files; no dependencies required.
- dist/server/index.js: generated deployment entry point; do not hand edit.
- web/catalog.json and web/catalog.js: same sourced 120+ tool dataset; source links and original logo provenance retained.

Run npm run build, then publish through Sites using the existing project ID. Runtime binding is DB. A new deployment applies the versioned schema migration.

## Local development and validation
npm run dev serves port 4173 using an in-memory SQLite fixture. The preview supports the same browser-local public workspace as production. npm run check validates JavaScript and tests anonymous routes, unauthorized access, cross-user isolation, same-origin writes, field validation, persistence and public workspace routes.

Browser checks cover anonymous issue matching, suggested combinations, profile question flow, issue carryover, confirmation, saving, reload persistence and logout. Actual hosted identity is supplied by Sites; local tests use the explicit fixture.

## Honest prototype boundaries
The roundtable uses prepared advisor perspectives. Issue matching uses curated task phrases and catalog records, not live AI reasoning or integration testing. Sample tests execute predefined local workflows. Suggestions are general and labeled as such. Catalog prices are a November 8, 2026 research snapshot. General score measures getting-started accessibility, not product quality. 100 records have scores; five are unscored. Reviews are private account notes, not published ratings. No business software is connected and no customer messages or purchases are automated.

## Guided roundtable update
Intake accepts optional public-page links (stored, never fetched). Saving a profile opens the issue-specific roundtable. Up to three optional questions precede a report; skipping is supported. Answers and report state persist per account and invalidate when the issue changes. Catalog ranking examines all current catalog entries using explicit topic and keyword rules; this is not live AI analysis. The bakery Maps/COGS regression covers multiple issues, saved answers, and honest no-match behavior. Google Business Profile setup is linked as a process-first action, outside the catalog.
