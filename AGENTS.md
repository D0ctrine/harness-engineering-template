# AGENTS.md

## Repo map
- .codex/config.toml: Codex model, approval, sandbox, and network settings
- .devcontainer/: Node 22 Codespaces/devcontainer setup and post-create install
- .github/workflows/ci.yml: CI install and verification workflow
- docs/: architecture, plans, and review guides for this harness
- scripts/verify.sh: canonical verification entrypoint
- package.json and package-lock.json: npm project metadata and lockfile
- src/, app/, tests/: not present yet; add only when application code or tests exist

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
