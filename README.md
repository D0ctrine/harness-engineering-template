# Harness Engineering Template

Enterprise-grade reusable harness for **agent-driven web projects**.

## Why this repository exists
This repository is not a single-product scaffold. It is a template and operating system that helps agents reliably:
- plan and execute work in small increments,
- preserve architecture boundaries,
- run repeatable quality checks,
- and document decisions for future teams.

## Monorepo layout

```text
apps/
  web/        # Next.js frontend
  api/        # Express backend (controller/service/repository)
packages/
  shared/     # Shared config, client, and types
docs/
  product/
  architecture/
  runbooks/
  decisions/
  tasks/
scripts/      # setup/dev/lint/test/build wrappers
templates/    # reusable templates for tasks/modules
tasks/        # task backlog/in-progress/done
```

## Quick start
1. Copy env file:
   ```bash
   cp .env.sample .env
   ```
2. Install:
   ```bash
   npm run setup
   ```
3. Start both apps:
   ```bash
   npm run dev
   ```

## Standard validation loop
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run check` (runs all)

## Visual capture workflow
- Start web app (`npm run dev`)
- Capture screenshot (`npm run capture`)
- Store outputs under `artifacts/screenshots/` for PR evidence

## Template-first operating model
- Use `tasks/` + `templates/` to define small, reviewable increments.
- Keep architecture decisions in `docs/decisions`.
- Keep operational guidance in `docs/runbooks`.

## Example vertical slice included
A small "Health" module demonstrates:
- frontend service + hook + UI composition,
- backend controller + service + repository,
- shared API client and environment config.
