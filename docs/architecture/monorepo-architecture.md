# Monorepo Architecture

## Structure
- `apps/web`: Next.js app with browser landing route, installed app shell route, feature modules, and PWA platform layer.
- `apps/api`: Express app with route -> controller -> service -> repository -> model.
- `packages/shared`: runtime config, API client, and cross-app types.

## Dependency direction
- `apps/*` may depend on `packages/shared`.
- `packages/shared` depends on no app package.

## Boundary enforcement principles
- Controllers never perform persistence operations directly.
- UI components never perform remote requests directly.
- Shared types represent contracts between frontend and backend.

## Web application responsibilities
- `/` is the browser-first landing route for onboarding, product framing, and install entry.
- `/app` is the PWA start URL and renders the standalone workspace shell.
- `src/features/*` owns business modules and preserves component -> hook -> service flow.
- `src/platform/pwa/*` owns manifest, install prompts, standalone detection, and service worker registration.
