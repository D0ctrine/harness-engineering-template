# ADR-0002: Use a single PWA shell for web and app delivery

## Status

Accepted

## Context

The project needs one frontend delivery surface that works in both browser-first usage and installable app-like usage.
The MVP should stay simple, low-cost, and easy to operate without creating a separate native app codebase.

## Decision

Use a single Next.js PWA as the frontend delivery surface.

Core rules:
- `apps/web` owns both browser-first and installed-app experiences
- `/` is the browser entry route
- `/app` is the installable app-shell route
- feature logic stays in `src/features/*`
- PWA runtime behavior stays in `src/platform/pwa/*`

## Consequences

- web and installed app experiences share one deployment path
- product delivery stays simpler than maintaining separate frontend codebases
- service worker, manifest, and install behavior become first-class frontend concerns
- the PWA shell remains compatible with the project’s pure serverless backend direction
