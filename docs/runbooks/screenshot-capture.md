# Screenshot Capture Runbook

## Purpose
Standardize visual capture evidence for UI changes so agents can provide deterministic review artifacts.

## Prerequisites
1. Install dependencies: `npm run setup`
2. Ensure web app is running: `npm run dev`

## Default capture
```bash
npm run capture
```

## Custom capture
```bash
node scripts/capture-page.mjs \
  --url=http://localhost:3000 \
  --out=artifacts/screenshots/dashboard.png \
  --width=1920 \
  --height=1080 \
  --wait-ms=1500
```

## Output policy
- Store captures under `artifacts/screenshots/`.
- Use predictable names (`<page>-<state>.png`).
- Reference image paths in PR descriptions.
