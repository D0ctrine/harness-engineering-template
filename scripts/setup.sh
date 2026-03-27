#!/usr/bin/env bash
set -euo pipefail

cp -n .env.sample .env || true
npm run setup
