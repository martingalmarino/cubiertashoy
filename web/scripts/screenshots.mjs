import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const label = process.argv[2];

if (!label || !/^(antes|despues)(-04[cd]|-05a)?$/.test(label)) {
  console.error(
    "Uso: node scripts/screenshots.mjs <antes|despues|antes-05a|despues-05a|...>"
  );
  process.exit(1);
}

const baseUrl = process.env.SCREENSHOT_BASE_URL ?? "http://127.0.0.1:3000";
const outDir = path.join(root, "screenshots", label);
const scrollFirst = true; // prompt 05a: scrollear antes de capturar

const pages = label.includes("05a")
  ? [
      { name: "home", path: "/" },
      { name: "medida", path: "/medida/165-70-r13" },
    ]
  : label === "despues-04d"
    ? [
        { name: "home", path: "/" },
        { name: "medida", path: "/medida/165-70-r13" },
      ]
    : [
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

async function shot(browser, pageDef, vp) {
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

  const scrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth
  );
  console.log(
    `scrollWidth ${pageDef.name}@${vp.name}: ${scrollWidth} (vp ${vp.width})`
  );

  const file = path.join(outDir, `${pageDef.name}-${vp.name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log("ok", path.relative(root, file));
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
