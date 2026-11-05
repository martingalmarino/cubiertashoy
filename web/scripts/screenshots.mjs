import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const label = process.argv[2];

if (!label || !/^(antes|despues)(-04c)?$/.test(label)) {
  console.error(
    "Uso: node scripts/screenshots.mjs <antes|despues|antes-04c|despues-04c>"
  );
  process.exit(1);
}

const baseUrl = process.env.SCREENSHOT_BASE_URL ?? "http://127.0.0.1:3000";
const outDir = path.join(root, "screenshots", label);
const scrollFirst = label.startsWith("despues");

const pages = [
  { name: "home", path: "/" },
  { name: "medida", path: "/medida/175-65-r14" },
];

const viewports = [
  { name: "1440", width: 1440, height: 900, isMobile: false },
  {
    name: "390",
    width: 390,
    height: 844,
    isMobile: true,
    deviceScaleFactor: 2,
    hasTouch: true,
  },
];

async function scrollPage(page) {
  for (let i = 0; i < 12; i++) {
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
}

async function shot(browser, pageDef, vp, suffix = "") {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.deviceScaleFactor ?? 1,
    isMobile: vp.isMobile,
    hasTouch: vp.hasTouch ?? false,
    ...(vp.isMobile ? devices["iPhone 13"] : {}),
    ...(vp.isMobile
      ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }
      : {}),
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}${pageDef.path}`, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });
  await page.waitForTimeout(400);
  if (scrollFirst) await scrollPage(page);

  const file = path.join(
    outDir,
    `${pageDef.name}-${vp.name}${suffix}.png`
  );
  await page.screenshot({ path: file, fullPage: true });
  console.log("ok", path.relative(root, file));

  if (label.startsWith("despues") && pageDef.name === "home" && vp.name === "1440") {
    const hero = await page.locator("h1").first().boundingBox();
    if (hero) {
      await page.screenshot({
        path: path.join(outDir, "crop-hero-1440.png"),
        clip: {
          x: 0,
          y: Math.max(0, hero.y - 80),
          width: vp.width,
          height: Math.min(520, vp.height),
        },
      });
      console.log("ok", "screenshots/" + label + "/crop-hero-1440.png");
    }
  }

  await context.close();
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const pageDef of pages) {
    for (const vp of viewports) {
      await shot(browser, pageDef, vp);
    }
  }
  await writeFile(
    path.join(outDir, "README.txt"),
    `Capturas ${label} — ${new Date().toISOString()}\n`,
    "utf8"
  );
} finally {
  await browser.close();
}
