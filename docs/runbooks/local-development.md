# Local Development Runbook

## Setup

1. `cp .env.sample .env`
2. Fill required secrets and URLs.
3. `npm run setup`

## Runtime Targets

- frontend on Cloudflare Pages
- API on Cloudflare Workers
- pure serverless runtime
- no Express runtime
- no Express adapter

Local API development uses a thin Node bridge that calls the same handler-first Worker entrypoint used for deployment.
The deployed backend target remains Cloudflare Workers.

## Start Stack

- `npm run dev --workspace @harness/web`
- `npm run dev --workspace @harness/api`
- `npm run dev`

Notes:
- `npm run dev` starts both web and API together
- root `.env` is loaded for local API execution
- web development uses `apps/web/.next-dev` so it does not collide with production build artifacts in `apps/web/.next`
- the API health endpoint is `http://localhost:4000/api/health`
- scripture lookup uses `SCRIPTURE_ASSET_BASE_URL` in local development and Cloudflare `ASSETS` binding in the deployed Worker

## Validation

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run check`
- `npm run capture:ui`
- `npm run capture`
- `curl http://localhost:4000/api/health`
- `curl http://localhost:4000/api/reading/home`
- `curl http://localhost:4000/api/notes/workspace`
- `curl http://localhost:4000/api/reflection/home`
- `curl http://localhost:4000/api/community/preview`
- `curl http://localhost:4000/api/me -i`
- `curl -X POST http://localhost:4000/api/meditation -H 'Content-Type: application/json' -d '{"content":"local check","date":"2026-04-14"}' -i`
- `curl -X OPTIONS http://localhost:4000/api/health -H 'Origin: http://localhost:3000' -i`
- `npx wrangler deploy --config apps/api/wrangler.jsonc --dry-run --outdir .wrangler-dryrun`

## API Validation

1. Start the API with `npm run dev --workspace @harness/api`.
2. Confirm `GET /api/health` returns `200` with a JSON status payload.
3. Confirm `GET /api/reading/home` returns the preloaded reading home payload.
4. Confirm `GET /api/notes/workspace` returns the note workspace payload.
5. Confirm `GET /api/reflection/home` returns the reflection payload.
6. Confirm `GET /api/community/preview` returns the group preview payload.
7. Confirm `GET /api/me` returns an anonymous auth payload when no session cookie exists.
8. Confirm unauthenticated `POST /api/meditation` returns `401`.
9. Confirm `OPTIONS /api/health` returns `204` with CORS headers.
10. Confirm `GET /health` returns `404` because the API prefix is `/api`.
11. Confirm the runtime path does not require Express.

## PWA Validation

1. Open `http://localhost:3000/` and verify the browser landing route loads.
2. Open `http://localhost:3000/app` and verify the app shell renders.
3. In browser DevTools, confirm the manifest is detected and `start_url` points to `/app`.
4. Use the Application tab to inspect the registered service worker and installed icons.
5. Run install and offline checks against `next start`, not `next dev`.
6. Confirm the offline fallback page is served for uncached navigation in the production-style web runtime.

## UI Capture

1. Start the API runtime.
2. Start the web runtime with `PORT=3001 npm run start --workspace @harness/web`.
3. Run `npm run capture:ui`.
4. Run `CAPTURE_URL=http://localhost:3001 npm run capture` when a single PR evidence screenshot is needed.
5. Review the generated screenshots under `artifacts/ui-captures` and `artifacts/screenshots`.

## Service Worker Reset

- In browser DevTools Application tab, unregister the service worker.
- Clear the `harness-static-v1` and `harness-pages-v1` caches before retesting shell updates.
- Hard refresh after updating `public/sw.js` to confirm the new worker activates.
- If you see `__webpack_modules__[moduleId] is not a function` while using `next dev`, reload once after the localhost worker unregisters or manually clear Application storage.

## Troubleshooting

- Port conflicts: update `API_PORT` and `NEXT_PUBLIC_API_BASE_URL` together.
- Missing env vars: verify root `.env` values against `.env.sample`.
- CORS mismatch: verify `CORS_ORIGIN` matches the web origin used in development.
- Missing install prompt: Chromium exposes it only when the manifest and service worker are both valid and the app meets installability checks.
- `Cannot find module './<id>.js'` or `__webpack_modules__[moduleId] is not a function`: stop the web server, restart `npm run dev`, and ensure old localhost site data is cleared.
- Worker dry run errors: re-run `npx wrangler deploy --config apps/api/wrangler.jsonc --dry-run --outdir .wrangler-dryrun` and inspect the bundle failure before changing runtime code.
