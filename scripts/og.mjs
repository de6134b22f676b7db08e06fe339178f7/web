// Open Graph images (DESIGN.md §7.7), 1200×630, one per route:
// white ground, the page title in Geist 600 Night with the blue ball as its full stop, a 1px Night ground rule,
// and the primary lockup (logo.svg geometry from scripts/brand.mjs) bottom-left.
//
//   npm run og
//
// Writes public/og.png (= home, the site-wide default in lib/site.ts) and public/og/{home,work,lang-lang,studio,contact}.png.
// Text is converted to paths (opentype.js), so librsvg never needs fonts installed. Font: scripts/assets/Geist-600.ttf.
import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import opentype from "opentype.js";
import { lockupBody, LOCKUP, BLUE, NIGHT } from "./brand.mjs";

const W = 1200, H = 630, X = 80;
const INK3 = "#6B7488";

/* ---------- font ---------- */
// Geist 600 static TTF (OFL), committed next to Geist-700.ttf so OG output is deterministic and offline.
const FONT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "assets/Geist-600.ttf");

function loadFont() {
  const b = readFileSync(FONT);
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
}

const font = loadFont();

/* ---------- text to paths ---------- */
const n = (v) => (Math.round(v * 100) / 100).toString();
function pathData(p) {
  return p.commands
    .map((c) => {
      switch (c.type) {
        case "M": return `M${n(c.x)} ${n(c.y)}`;
        case "L": return `L${n(c.x)} ${n(c.y)}`;
        case "Q": return `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
        case "C": return `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
        default: return "Z";
      }
    })
    .join("");
}

/** Per-glyph layout with kerning and tracking (em). Returns path data and the advance width. */
function layout(text, x, y, size, tracking) {
  const scale = size / font.unitsPerEm;
  const glyphs = [...text].map((ch) => font.charToGlyph(ch));
  let cx = x;
  const parts = [];
  glyphs.forEach((g, i) => {
    parts.push(pathData(g.getPath(cx, y, size)));
    const kern = i + 1 < glyphs.length ? font.getKerningValue(g, glyphs[i + 1]) || 0 : 0;
    cx += ((g.advanceWidth || 0) + kern) * scale + tracking * size;
  });
  return { d: parts.join(""), width: cx - x };
}

const TRACK = -0.045; // display tracking (§3.2)
const width = (t, size) => layout(t, 0, 0, size, TRACK).width;

/** Greedy wrap; the last line keeps room for the ball. */
function wrap(text, size, maxW) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (line && width(next, size) > maxW) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  lines.push(line);
  return lines;
}

/** Title without its "." + the blue ball centred in the period's advance, resting just above the baseline. */
function title(text, top, maxW, maxLines) {
  const bare = text.replace(/\.$/, "");
  let size = 104, lines;
  for (;;) {
    lines = wrap(bare, size, maxW - size * 0.3);
    if ((lines.length <= maxLines && lines.every((l) => width(l, size) <= maxW - size * 0.3)) || size <= 48) break;
    size -= 2;
  }
  const lh = size * 0.96;
  const cap = size * 0.71;
  let svg = "";
  lines.forEach((l, i) => {
    const y = top + cap + i * lh;
    const t = layout(l, X, y, size, TRACK);
    svg += `<path fill="${NIGHT}" d="${t.d}"/>`;
    if (i === lines.length - 1) {
      const dot = font.charToGlyph(".");
      const adv = (dot.advanceWidth * size) / font.unitsPerEm;
      const r = size * 0.1;
      svg += `<circle fill="${BLUE}" cx="${n(X + t.width + adv / 2)}" cy="${n(y - size * 0.02 - r)}" r="${n(r)}"/>`;
    }
  });
  return svg;
}

function small(text, x, y, size, fill, anchor = "start") {
  const t = layout(text, 0, 0, size, 0);
  const x0 = anchor === "end" ? x - t.width : x;
  return `<path fill="${fill}" d="${layout(text, x0, y, size, 0).d}"/>`;
}

/* ---------- routes ---------- */
const PAGES = [
  { name: "home", title: "Club websites that keep up with the season." },
  { name: "work", title: "Work." },
  { name: "lang-lang", kicker: "Lang Lang Cricket Club", title: "A club that lives on its website." },
  { name: "studio", title: "A small studio for club sport." },
  { name: "contact", title: "Tell us about your club." },
];

const RULE_Y = H - 150;

function render(page) {
  const top = page.kicker ? 132 : 96;
  const vb = LOCKUP.viewBox;
  const logoH = 40, s = logoH / vb[3];
  const logoY = RULE_Y + (H - RULE_Y - logoH) / 2;
  const logo = `<g transform="translate(${n(X - vb[0] * s)} ${n(logoY - vb[1] * s)}) scale(${n(s * 10000) / 10000})">${lockupBody(NIGHT, BLUE)}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#FFFFFF"/>
  ${page.kicker ? small(page.kicker, X, 100, 24, INK3) : ""}
  ${title(page.title, top, W - 2 * X, 3)}
  <rect x="${X}" y="${RULE_Y}" width="${W - 2 * X}" height="1" fill="${NIGHT}"/>
  ${logo}
  ${small("Websites and apps for sports clubs.", W - X, logoY + logoH * 0.72, 20, INK3, "end")}
</svg>`;
}

await mkdir(path.resolve("public/og"), { recursive: true });
for (const p of PAGES) {
  const buf = await sharp(Buffer.from(render(p))).png({ compressionLevel: 9 }).toBuffer();
  await writeFile(path.resolve(`public/og/${p.name}.png`), buf);
  if (p.name === "home") await writeFile(path.resolve("public/og.png"), buf);
  console.log(`og/${p.name}.png`);
}
console.log("og.png = og/home.png");
