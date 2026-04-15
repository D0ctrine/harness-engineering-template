# PLANS

Use this template for multi-step work in this Codex harness repo.

## Goal
What should change?

## Context
Which files, docs, errors, or examples matter?

Current repo facts to check before planning:
- No `src/`, `app/`, or `tests/` directory exists unless a later change adds one.
- npm is the configured package manager while `package-lock.json` is present.
- `bash ./scripts/verify.sh` is the canonical local and CI validation command.
- Codex settings live in `.codex/config.toml`; devcontainer setup lives in `.devcontainer/`.

## Constraints
What must not change? What standards apply?

Default constraints:
- Do not add production dependencies unless explicitly asked.
- Preserve the existing package manager and lockfile unless the task explicitly changes them.
- Keep diffs small and reviewable.
- Update docs when repo structure, workflow, or architecture changes.

## Steps
1.
2.
3.

## Validation
Which commands prove the task is done?

Default validation:
- `bash ./scripts/verify.sh`

## Risks
What could still break?

Common risks:
- Docs drifting from the actual repo structure.
- A package script exists but fails under `scripts/verify.sh`.
- CI and local verification using different package-manager behavior.
- Hidden assumptions about source or tests that do not exist yet.
