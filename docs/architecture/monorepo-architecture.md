# Monorepo Architecture

## Structure
- `apps/web`: Next.js app with component -> hook -> service -> API client flow.
- `apps/api`: Express app with route -> controller -> service -> repository -> model.
- `packages/shared`: runtime config, API client, and cross-app types.

## Dependency direction
- `apps/*` may depend on `packages/shared`.
- `packages/shared` depends on no app package.

## Boundary enforcement principles
- Controllers never perform persistence operations directly.
- UI components never perform remote requests directly.
- Shared types represent contracts between frontend and backend.
