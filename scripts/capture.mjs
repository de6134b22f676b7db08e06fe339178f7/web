// Full-page captures of langlangcricketclub.com for the Walk (DESIGN.md 3.4).
// Playwright (devDependency), 1440x900 @2x (phone: 390x844 @2x), fullPage,
// after one scroll through the page so lazy content loads, then cropped to the
// height cap (desktop 1.875 x width, phone 6.5 x width) and written as
// public/work/lang-lang/<name>-full.jpg. Run when the club site changes;
// output is committed. `npm run capture` (then `node scripts/optimize-images.mjs`).
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const ORIGIN = "https://langlangcricketclub.com";
const OUT = path.resolve("public/work/lang-lang");
const DPR = 2;
const DESKTOP = { width: 1440, height: 900 };
const PHONE = { width: 390, height: 844 };
const CAP = { desktop: 1.875, phone: 6.5 }; // max height / width, after DPR (phones: tall enough for the Play scroll)

/** @type {{ name: string; url: string; phone?: boolean }[]} */
// home-full / mobile-home-full are no longer rendered anywhere (sources parked in src/content/work/originals/),
// so they are not captured; the viewport home shots (home.jpg, mobile-home.jpg) are separate.
const PAGES = [
  { name: "fixtures", url: "/fixtures" },
  // Feature 02: one side's team page (B Grade), its PlayHQ ladder with every opponent by club, then its fixtures.
  { name: "team", url: "/fixtures?season=Summer%202026%2F27&team=9ad1241c-0f78-418e-b9f6-e0e74bff69a0" },
  { name: "announcements", url: "/announcements" },
  { name: "event-rsvp", url: "/events/16" }, // Legends Launch Night
  { name: "player", url: "/players/alexander-giacco" },
  { name: "story", url: "/history/more-than-cricket-finding-home-at-lang-lang" },
  { name: "mobile-announcements", url: "/announcements", phone: true },
];

const only = process.argv.slice(2);
// The club site's footer carries a developer credit line; it is hidden before the shot so the
// captures show only the club (BRIEF.md: the work is presented as Websport's; nothing else is altered).
const FREEZE_CSS =
  "*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important;caret-color:transparent!important}" +
  'a[href*="sherlabs.com"]{display:none!important}';

async function settle(page) {
  // Eager-load everything, walk the document once so lazy content mounts, return to top.
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    for (const img of document.querySelectorAll("img")) {
      img.loading = "eager";
      img.decoding = "sync";
    }
    let y = 0;
    let last = -1;
    while (y < document.documentElement.scrollHeight && y !== last) {
      last = y;
      window.scrollTo(0, y);
      await sleep(120);
      y = Math.min(y + window.innerHeight, document.documentElement.scrollHeight);
      if (y === last) break;
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await sleep(300);
    window.scrollTo(0, 0);
    await sleep(300);
    await document.fonts.ready;
    await Promise.allSettled([...document.images].map((i) => i.decode()));
  });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
}

async function capture(browser, { name, url, phone }) {
  const viewport = phone ? PHONE : DESKTOP;
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: DPR,
    isMobile: !!phone,
    hasTouch: !!phone,
    locale: "en-AU",
    timezoneId: "Australia/Melbourne",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.addInitScript((css) => {
    document.addEventListener("DOMContentLoaded", () => {
      const s = document.createElement("style");
      s.textContent = css;
      document.head.appendChild(s);
    });
  }, FREEZE_CSS);
  await page.goto(ORIGIN + url, { waitUntil: "load", timeout: 60_000 });
  await page.addStyleTag({ content: FREEZE_CSS });
  await settle(page);

  const png = await page.screenshot({ fullPage: true, type: "png", animations: "disabled", caret: "hide" });
  await context.close();

  const meta = await sharp(png).metadata();
  const w = meta.width;
  const h = meta.height;
  const cap = Math.round(w * (phone ? CAP.phone : CAP.desktop));
  const outH = Math.min(h, cap);
  const file = path.join(OUT, `${name}-full.jpg`);
  let img = sharp(png);
  if (outH < h) img = img.extract({ left: 0, top: 0, width: w, height: outH });
  await writeFile(file, await img.jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: "4:4:4" }).toBuffer());
  console.log(`${name}-full.jpg  ${url}  measured ${w}x${h}  shipped ${w}x${outH}${outH < h ? " (capped)" : ""}`);
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
try {
  for (const p of PAGES) {
    if (only.length && !only.includes(p.name)) continue;
    await capture(browser, p);
  }
} finally {
  await browser.close();
}
