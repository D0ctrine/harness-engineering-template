# CODE REVIEW

## Check for
- correctness regressions
- missing tests
- type and lint issues
- auth, validation, and secret handling
- breaking changes in API or config
- unnecessary dependency additions
- docs that no longer match the actual repo structure
- package manager or lockfile drift
- CI behavior that differs from `bash ./scripts/verify.sh`
- Codex sandbox, approval, or network assumptions that conflict with `.codex/config.toml`
- devcontainer changes that make setup non-repeatable

## Review output
- changed files
- verification command and result
- key risks
- follow-up items

## Harness-specific notes
- This repo currently has no application source tree or test suite.
- Do not require `src/`, `app/`, or `tests/` unless the change introduces application behavior.
- If a package script is present, it is part of the verification surface and must pass.
