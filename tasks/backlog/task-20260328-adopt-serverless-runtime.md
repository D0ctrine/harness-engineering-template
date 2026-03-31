# Task: Adopt Pure Serverless Runtime

## Summary

Adopt a pure serverless runtime model for the backend and remove any runtime assumption based on Express or Express adapters.

## Background

The project is targeting a cheap-by-default MVP deployment model.
The backend must be prepared for direct serverless execution and must align with Cloudflare Workers style deployment.
The current architecture direction must be fixed before feature implementation expands.

## Goals

- remove Express as a runtime assumption
- remove Express adapter as an architecture option
- establish a handler-first API structure
- prepare `apps/api` for direct serverless deployment
- enforce stateless runtime assumptions
- align backend delivery with Cloudflare Workers style deployment

## Non-Goals

- full feature implementation
- provider-specific CI/CD setup
- final production observability stack
- scripture source finalization beyond the documented strategy

## Deliverables

- `apps/api` runtime direction fixed as handler-first serverless API
- runtime assumptions documented as stateless
- architecture documents aligned with pure serverless delivery
- deployment target aligned to Cloudflare Workers
- implementation path free from Express runtime and Express adapter dependency

## Acceptance Criteria

- no Express runtime is required by the backend architecture
- no Express adapter is part of the target backend design
- handler-first API structure is the documented backend standard
- `apps/api` is prepared for direct serverless deployment
- runtime assumptions explicitly match a stateless serverless model
- deployment direction matches Cloudflare Workers style execution

## Validation Commands

- Confirm the local development entrypoint works with handler-based API execution
- Confirm a sample endpoint responds through the serverless-style runtime path
- Confirm there is no Express dependency on the runtime path
- Confirm the build and deploy target matches serverless expectations

## Notes for docs/ADR updates

- Update `docs/architecture/overview.md`
- Update `docs/architecture/monorepo-architecture.md`
- Update `docs/decisions/ADR-0003-serverless-function-first-api.md`
