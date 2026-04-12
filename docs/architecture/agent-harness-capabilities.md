# Agent Harness Capabilities

## Core capabilities
- Structured monorepo architecture for web + API + shared contracts.
- Task-driven execution model for small, reviewable increments.
- Standard validation loop (lint/test/build) and CI enforcement.
- Screenshot capture pipeline for visual verification.

## Why screenshot capture matters
Visual proof lowers ambiguity in agent-delivered UI changes and reduces review cycles.

## Capability extension model
When adding a new capability:
1. Add scripts under `scripts/`.
2. Add docs under `docs/runbooks/` and architecture impact under `docs/architecture/`.
3. Add task template/checklist updates.
4. Add CI hooks if non-optional.
