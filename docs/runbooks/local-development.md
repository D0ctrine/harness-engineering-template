# Local Development Runbook

## Setup
1. `cp .env.sample .env`
2. Fill required secrets and URLs.
3. `npm run setup`

## Start stack
- `npm run dev`

## Validation
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run check`

## Troubleshooting
- Port conflicts: update `API_PORT` and `NEXT_PUBLIC_API_BASE_URL` together.
- Missing env vars: verify `.env` values against `.env.sample`.
