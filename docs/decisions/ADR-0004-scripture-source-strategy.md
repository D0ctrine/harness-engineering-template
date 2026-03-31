# ADR-0004: Prefer low-cost scripture source strategy for MVP

## Status

Accepted

## Context

QT reading depends on reliable scripture retrieval.
The MVP is built on a low-cost serverless architecture, so scripture access must remain predictable, cheap-by-default, and safe for stateless execution.
Source choice affects latency, runtime simplicity, operational complexity, and future feature expansion.

## Decision

Candidate options were evaluated in this order:
1. preloaded scripture dataset with serverless-safe retrieval
2. lightweight managed store with predictable read pattern
3. external API only if licensing, latency, and reliability are acceptable

For the MVP, scripture retrieval uses a preloaded dataset with edge-friendly retrieval.
The runtime path must remain stateless, cheap-by-default, and safe for Cloudflare Workers execution.
The final source of truth is fixed for the initial reading feature so scripture-heavy expansion can proceed without reopening the runtime decision.

## Consequences

- scripture retrieval is optimized for read-heavy serverless access
- infrastructure remains aligned with Cloudflare Workers style runtime constraints
- low fixed cost is preserved during MVP
- initial reading features can be built without waiting for database provisioning
- future expansion must revisit the source only when dataset volume, licensing, or update frequency requires it

## Notes

- scripture retrieval remains edge/serverless friendly
- the dataset should be organized for predictable read patterns and clear replacement later
- search, broad annotation, and multi-version expansion may require a later storage decision
