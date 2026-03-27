# Local Development Runbook

## Setup
1. `cp .env.sample .env`
2. Fill required secrets and URLs.
3. `npm run setup`

## Start stack
- `npm run dev`
- Web development uses `apps/web/.next-dev` so it does not collide with production build artifacts in `apps/web/.next`.

## Validation
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run check`

## PWA validation
1. Open `http://localhost:3000/` and verify the browser landing route loads.
2. Open `http://localhost:3000/app` and verify the app shell renders with the health card.
3. In browser DevTools, confirm the manifest is detected and `start_url` points to `/app`.
4. Use the Application tab to inspect the registered service worker and installed icons.
5. Switch DevTools to offline mode, reload a route, and confirm the offline fallback page is served for uncached navigation.
6. Run service worker install/offline checks against `next start`, not `next dev`; the local development server now unregisters PWA workers on purpose to avoid stale `_next` chunk runtime errors.

## Service worker reset
- In browser DevTools Application tab, unregister the service worker.
- Clear the `harness-static-v1` and `harness-pages-v1` caches before retesting shell updates.
- Hard refresh after updating `public/sw.js` to confirm the new worker activates.
- If you see `__webpack_modules__[moduleId] is not a function` while using `next dev`, reload once after the localhost worker unregisters or manually clear Application storage.

## Troubleshooting
- Port conflicts: update `API_PORT` and `NEXT_PUBLIC_API_BASE_URL` together.
- Missing env vars: verify `.env` values against `.env.sample`.
- Missing install prompt: Chromium exposes it only when the manifest and service worker are both valid and the app meets installability checks.
- `Cannot find module './<id>.js'` or `__webpack_modules__[moduleId] is not a function`: stop the web server, restart `npm run dev`, and ensure old localhost site data is cleared. Dev and production builds now use separate Next output folders to avoid chunk collisions.
