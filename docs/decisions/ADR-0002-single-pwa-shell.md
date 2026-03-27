# ADR-0002: Single PWA shell for web and app delivery

- **Status:** Accepted
- **Date:** 2026-03-27

## Context
The template needs to support both browser-first access and app-like installation without immediately creating a separate mobile application codebase.

## Decision
Use a single Next.js web app as the delivery surface and split responsibilities between the browser landing route (`/`) and the installable app shell route (`/app`). Keep feature code in `src/features/*` and isolate browser platform behavior in `src/platform/pwa/*`.

## Consequences
- Web and installed app experiences share the same contracts, components, and deployment path.
- Future wrappers such as Capacitor can be added later without restructuring the feature layer.
- Service worker, manifest, and install-state behavior become first-class template concerns that must be documented and tested.
