# ARCHITECTURE

## Runtime and purpose
- This repo is a Codex harness template, not an application runtime yet.
- The configured runtime is Node.js 22 through the devcontainer and CI.
- npm is the current package manager because `package-lock.json` is present.
- There are no production dependencies and no application entrypoint yet.

## Key directories
- `.codex/config.toml`: Codex defaults for model, approvals, workspace-write sandboxing, and disabled network access inside the sandbox.
- `.devcontainer/`: Codespaces/devcontainer setup using the Node 22 image. `post-create.sh` installs `bubblewrap` and the Codex CLI.
- `.github/workflows/ci.yml`: CI workflow for pull requests and pushes to `main` or `master`; installs dependencies and runs `bash ./scripts/verify.sh`.
- `docs/`: Architecture, planning, and review guidance for future work.
- `scripts/verify.sh`: Canonical local and CI verification entrypoint.
- `package.json` and `package-lock.json`: npm metadata and lockfile.

## Current source layout
- `src/`, `app/`, and `tests/` are not present in the current template.
- Add source and tests only when the repo gains application behavior.
- When behavior is added, document the new runtime entrypoints and boundaries here.

## Verification flow
- CI enables Corepack, installs with the existing lockfile/package manager, then calls `bash ./scripts/verify.sh`.
- `scripts/verify.sh` detects npm, pnpm, or yarn from lockfiles and runs available `lint`, `typecheck`, `test`, and `build` scripts.
- Missing scripts are skipped; scripts that exist must pass.
