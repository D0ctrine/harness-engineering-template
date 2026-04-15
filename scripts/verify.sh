#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

if [ ! -f package.json ]; then
  echo "package.json not found"
  exit 1
fi

PM="npm"
if [ -f pnpm-lock.yaml ] && command -v pnpm >/dev/null 2>&1; then
  PM="pnpm"
elif [ -f yarn.lock ] && command -v yarn >/dev/null 2>&1; then
  PM="yarn"
fi

has_script() {
  node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts['$1'] ? 0 : 1)"
}

run_script() {
  local name="$1"
  if has_script "$name"; then
    echo "==> running: ${PM} ${name}"
    if [ "$PM" = "yarn" ]; then
      yarn "$name"
    else
      "$PM" run "$name"
    fi
  else
    echo "==> skip: no '$name' script"
  fi
}

run_script lint
run_script typecheck
run_script test
run_script build
