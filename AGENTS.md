# AGENTS.md

## Repo map
- src/: application source when present
- app/: application source when present
- tests/: automated tests when present
- docs/: architecture, plans, and review guides
- scripts/verify.sh: canonical verification entrypoint

## Commands
- install: use the package manager already configured in this repo
- verify: bash ./scripts/verify.sh

## Engineering rules
- Prefer existing project patterns before introducing new abstractions.
- Keep diffs small and reviewable.
- Do not add production dependencies unless explicitly asked.
- Add or update tests when behavior changes.
- Update docs when architecture or workflow changes.

## Done when
- Relevant checks in bash ./scripts/verify.sh pass.
- Behavior changes are covered by tests or called out explicitly.
- Risks and follow-up items are summarized at the end.

## Review checklist
- Broken imports, type errors, async error handling
- Input validation, auth, and secret handling
- Missing tests, migration risk, backwards compatibility
