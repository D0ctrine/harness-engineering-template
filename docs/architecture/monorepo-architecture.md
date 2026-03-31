# Monorepo Architecture

## Structure

- `apps/web` — PWA frontend application
- `apps/api` — serverless API handlers
- `packages/domain` — domain entities and domain rules
- `packages/application` — use-cases, services, and orchestration logic
- `packages/infrastructure` — persistence, storage, provider integrations, and runtime adapters that do not introduce Express
- `packages/shared` — shared types, config utilities, and cross-package helpers

## Dependency Direction

- `apps/web` may depend on `packages/shared`
- `apps/api` may depend on `packages/domain`, `packages/application`, `packages/infrastructure`, and `packages/shared`
- `packages/application` may depend on `packages/domain`
- `packages/infrastructure` may depend on `packages/domain`, `packages/application`, and `packages/shared`
- `packages/shared` depends on no app package

## Deployment Model

- `apps/web` is deployed on Cloudflare Pages
- `apps/api` is deployed on Cloudflare Workers
- `packages/*` are shared internal libraries

## Architecture Notes

- `apps/api` must not depend on Express
- `apps/api` should expose handler-based endpoints for a serverless runtime
- `apps/web` owns the PWA frontend experience and consumes serverless API endpoints
- repo structure is designed to keep cost low and module boundaries clear
- business logic should be implemented in `packages/application`, not inside handlers
- infrastructure code should remain compatible with stateless execution and edge/serverless deployment
