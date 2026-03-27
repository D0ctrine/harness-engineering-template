# task-20260327-bootstrap-pwa-shell

## Goal
Bootstrap a single PWA shell so the template supports both browser landing and installable app experiences from one `apps/web` application.

## Scope and exclusions
- In scope: app router shell structure, manifest, service worker, install guidance, and supporting documentation.
- Out of scope: offline API data sync, native mobile wrapper projects, and backend contract changes.

## Acceptance criteria
- [ ] `apps/web` exposes `/` for browser landing and `/app` for the standalone shell.
- [ ] Feature modules live under `src/features/*` and the health example still follows component -> hook -> service boundaries.
- [ ] PWA browser APIs live under `src/platform/pwa/*`.
- [ ] Manifest, icons, service worker, and offline fallback page are present.
- [ ] Architecture docs, runbook, and ADR are updated for the single-PWA decision.

## Validation commands
- `npm run lint`
- `npm run test`
- `npm run build`

## Notes for docs/ADR updates
- Record the single-PWA decision in a new ADR.
- Update local development guidance with installation and offline verification steps.
