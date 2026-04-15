#!/usr/bin/env bash
set -euxo pipefail

sudo apt-get update
sudo apt-get install -y bubblewrap

npm i -g @openai/codex@latest

node -v
npm -v
codex --version
