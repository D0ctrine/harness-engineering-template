# AGENTS Operating System

## Repository purpose
This repository is a reusable enterprise harness for agent-driven web delivery. Build patterns and automation that scale to future internal projects; avoid one-off implementation choices.

## Coding rules
- Prefer clear, modular TypeScript with explicit interfaces at boundaries.
- Keep every change small, testable, and documented.
- Write code for agent readability first (stable naming, predictable folders, low indirection).
- Add or update docs for any architectural or workflow change.
- For UI-visible changes, capture and attach screenshots from `artifacts/screenshots/` when tooling is available.

## Layer boundaries
- `apps/web` UI layer may call only web services/hooks, not remote APIs directly.
- `apps/api/controllers` handles HTTP concerns only.
- `apps/api/services` holds business rules and orchestration.
- `apps/api/repositories` handles persistence I/O.
- Controllers must never import `db` directly.
- Shared cross-app utilities live in `packages/shared`.

## Directory responsibilities
- `apps/`: runnable applications.
- `packages/`: reusable libraries.
- `docs/product`: product scope and goals.
- `docs/architecture`: architectural diagrams and standards.
- `docs/runbooks`: operation and incident procedures.
- `docs/decisions`: ADRs and decision logs.
- `docs/tasks`: task planning standards.
- `scripts/`: automation for setup/quality/release.
- `templates/`: reusable task/module/file templates.
- `tasks/`: active and historical agent work increments.

## Definition of done
A task is done when:
1. Acceptance criteria in `tasks/` item are met.
2. Layer boundaries are preserved.
3. Lint/test/build checks pass.
4. Docs and decision records are updated.
5. Change is small enough for focused review.

## Naming conventions
- Files/folders: kebab-case unless framework requires otherwise.
- Types/interfaces/classes: PascalCase.
- Variables/functions: camelCase.
- Task files: `task-YYYYMMDD-<slug>.md`.
- ADR files: `ADR-XXXX-<title>.md`.

## PR/change size policy
- Target < 400 changed lines per PR when possible.
- Separate refactors from feature delivery.
- Include summary, risks, validation commands, and rollback notes.

## Forbidden patterns
- Direct DB access from controllers.
- UI components calling `fetch`/axios to backend directly.
- Silent catch-and-ignore error handling.
- Hidden global state without documented ownership.
- Undocumented architecture changes.

## Agent workflow: plan, execute, validate, document
1. Plan: read relevant `tasks/`, propose incremental steps, identify touched layers.
2. Execute: implement one vertical slice at a time with clear commits.
3. Validate: run setup/lint/test/build and record outputs.
4. Document: update docs and task status; capture decisions in ADRs when needed.
5. Evidence: for UI changes run capture workflow and include screenshot paths in the PR.
