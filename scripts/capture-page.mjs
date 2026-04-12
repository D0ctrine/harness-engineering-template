#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

const getArg = (name, fallback) => {
  const hit = args.find((arg) => arg.startsWith(`${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : fallback;
};

const url = getArg("--url", process.env.CAPTURE_URL ?? "http://localhost:3000");
const output = getArg("--out", "artifacts/screenshots/home.png");
const width = Number(getArg("--width", "1440"));
const height = Number(getArg("--height", "900"));
const waitMs = Number(getArg("--wait-ms", "1000"));

const run = async () => {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error("Missing dependency: playwright. Run `npm install` before capture.");
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width, height } });

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
    if (waitMs > 0) {
      await page.waitForTimeout(waitMs);
    }

    const absoluteOut = path.resolve(output);
    fs.mkdirSync(path.dirname(absoluteOut), { recursive: true });
    await page.screenshot({ path: absoluteOut, fullPage: true });

    console.log(`Captured screenshot: ${absoluteOut}`);
  } finally {
    await browser.close();
  }
};

void run();
