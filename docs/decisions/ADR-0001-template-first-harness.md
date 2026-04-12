# ADR-0001: Adopt a template-first delivery harness

## Status

Accepted

## Date

2026-03-26

## Context

Internal projects repeatedly spend time rebuilding the same delivery setup, folder boundaries, workflow rules, and documentation patterns.
The repository needs a stable baseline that can be reused across multiple products without redefining the engineering process each time.

## Decision

The repository adopts a template-first harness model.

Core rules:
- use a reusable monorepo as the project baseline
- keep architecture boundaries explicit in folders and docs
- define work through small task documents
- keep decisions in ADRs
- make validation and documentation part of normal delivery

## Consequences

- new projects can start from an opinionated and reusable baseline
- teams get consistent task, architecture, and documentation structure
- architectural drift becomes easier to detect
- the repository carries some upfront maintenance cost in exchange for faster project startup
