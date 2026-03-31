import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const outputDirectory = path.resolve(repositoryRoot, "artifacts/ui-captures");
const baseUrl = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3001";

const desktopViewport = { width: 1440, height: 1600 };
const mobileDevice = devices["iPhone 14"];

const screenshotJobs = [
  {
    name: "landing-desktop.png",
    path: "/",
    viewport: desktopViewport,
    waitFor: ".landing-page",
    fullPage: true
  },
  {
    name: "app-desktop.png",
    path: "/app",
    viewport: desktopViewport,
    waitFor: "#today-reading",
    fullPage: true
  }
];

const sectionSelectors = [
  { selector: "#today-reading", name: "app-reading-section.png" },
  { selector: "#note-workspace", name: "app-note-section.png" },
  { selector: "#reflection-step", name: "app-reflection-section.png" },
  { selector: "#community-preview", name: "app-community-section.png" }
];

const logCapture = (name, absolutePath) => {
  console.log(`captured ${name}: ${absolutePath}`);
};

const captureDesktopScreens = async (browser) => {
  const context = await browser.newContext({ viewport: desktopViewport });
  const page = await context.newPage();

  for (const job of screenshotJobs) {
    await page.goto(`${baseUrl}${job.path}`, { waitUntil: "networkidle" });
    await page.waitForSelector(job.waitFor);

    const screenshotPath = path.resolve(outputDirectory, job.name);
    await page.screenshot({ path: screenshotPath, fullPage: job.fullPage });
    logCapture(job.name, screenshotPath);
  }

  await page.goto(`${baseUrl}/app`, { waitUntil: "networkidle" });
  await page.waitForSelector("#today-reading");

  for (const section of sectionSelectors) {
    const locator = page.locator(section.selector);
    await locator.scrollIntoViewIfNeeded();

    const screenshotPath = path.resolve(outputDirectory, section.name);
    await locator.screenshot({ path: screenshotPath });
    logCapture(section.name, screenshotPath);
  }

  await context.close();
};

const captureMobileScreen = async (browser) => {
  const context = await browser.newContext({
    ...mobileDevice,
    locale: "ko-KR",
    viewport: mobileDevice.viewport
  });
  const page = await context.newPage();

  await page.goto(`${baseUrl}/app`, { waitUntil: "networkidle" });
  await page.waitForSelector("#today-reading");

  const screenshotPath = path.resolve(outputDirectory, "app-mobile.png");
  await page.screenshot({ path: screenshotPath, fullPage: true });
  logCapture("app-mobile.png", screenshotPath);

  await context.close();
};

const main = async () => {
  await mkdir(outputDirectory, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  try {
    await captureDesktopScreens(browser);
    await captureMobileScreen(browser);
  } finally {
    await browser.close();
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
