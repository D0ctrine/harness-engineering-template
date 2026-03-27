import fs from "node:fs";
import path from "node:path";

const mode = process.argv[2];

if (!mode || !["dev", "build"].includes(mode)) {
  throw new Error("Usage: node scripts/prepare-next-dist.mjs <dev|build>");
}

const repoRoot = process.cwd();
const distDir = mode === "dev" ? ".next-dev" : ".next";
const targetPath = path.join(repoRoot, "apps/web", distDir);

fs.rmSync(targetPath, { recursive: true, force: true });
