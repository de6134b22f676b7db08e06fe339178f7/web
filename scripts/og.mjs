// Open Graph images (DESIGN.md v4 §7.4), 1200x630, white "Plates":
// pure white ground, a column ruler (12-column ticks on an Ink rule at the top and a hairline at the foot; no
// linework ever runs behind text), the title in Host Grotesk 600 Ink with one accent word in Flag, the mark as a
// Fig. 1 construction drawing on the right (45° guide, pole, baseline, pennant, R 5.5 tip, the 66-unit square),
// and "websport.com.au" as the real wordmark paths bottom left. The case study swaps the figure for its home
// capture in a light browser frame.
//
//   npm run og
//
// Writes public/og.png (= home, the site-wide default in lib/site.ts) and public/og/{home,work,lang-lang,studio,contact}.png.
// Pages opt in with `openGraph: og(path, "/og/<name>.png", alt)`.
//
// Text is converted to paths (opentype.js) so librsvg never needs the fonts installed. The OFL TTFs (Host
// Grotesk 600, Martian Mono 400) are fetched once from Google Fonts (the css2 API serves TTF to a legacy user
// agent) and cached in the OS temp dir. The wordmark comes from src/components/wordmark.generated.ts (Sora 800
// outlines), imported directly (Node 22 strips the types).
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import opentype from "opentype.js";
import { WM } from "../src/components/wordmark.generated.ts";

const W = 1200, H = 630, X = 80;
const C = {
  paper: "#FFFFFF", surface: "#F5F6F8", ink: "#0F1729", ink2: "#2A3346", muted: "#5B6475",
  flag: "#E8442B", flagText: "#C8361F", line: "rgba(15,23,41,0.09)", line2: "rgba(15,23,41,0.16)", guide: "rgba(15,23,41,0.22)",
};

/* ---------- fonts ---------- */
const CACHE = path.join(os.tmpdir(), "websport-og-fonts");
const CSS_URL = "https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@600&family=Martian+Mono:wdth,wght@87.5,400";
const UA = "Mozilla/4.0";

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function loadFonts() {
  await mkdir(CACHE, { recursive: true });
  const want = { sans: ["Host Grotesk", "normal"], mono: ["Martian Mono", "normal"] };
  const files = { sans: path.join(CACHE, "host-grotesk-600.ttf"), mono: path.join(CACHE, "martian-mono-400.ttf") };
  const missing = [];
  for (const k of Object.keys(files)) if (!(await exists(files[k]))) missing.push(k);
  if (missing.length) {
    const css = await (await fetch(CSS_URL, { headers: { "User-Agent": UA } })).text();
    const blocks = [...css.matchAll(/@font-face\s*{([^}]*)}/g)].map((m) => {
      const b = m[1];
      return {
        family: /font-family:\s*'([^']+)'/.exec(b)?.[1],
        style: /font-style:\s*(\w+)/.exec(b)?.[1],
        src: /src:\s*url\(([^)]+\.ttf)\)/.exec(b)?.[1],
        range: /unicode-range:\s*([^;]+)/.exec(b)?.[1] ?? "",
      };
    });
    for (const k of missing) {
      const [family, style] = want[k];
      const cands = blocks.filter((b) => b.family === family && b.style === style && b.src);
      const pick = cands.find((b) => b.range.includes("U+0000-00FF")) ?? cands.at(-1);
      if (!pick) throw new Error(`No TTF for ${family} ${style}`);
      await writeFile(files[k], Buffer.from(await (await fetch(pick.src)).arrayBuffer()));
    }
  }
  const out = {};
  for (const [k, f] of Object.entries(files)) {
    const b = await readFile(f);
    out[k] = opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
  }
  return out;
}

const F = await loadFonts();

/* ---------- text to paths ---------- */
const n = (v) => (Math.round(v * 100) / 100).toString();
function pathData(p) {
  // opentype's toPathData() emits NaN for some coordinates; format commands ourselves.
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

/** Per-glyph layout with kerning and tracking (em). Returns path data and advance width. */
function layout(font, text, x, y, size, tracking = 0) {
  const scale = size / font.unitsPerEm;
  const glyphs = [...text].map((ch) => font.charToGlyph(ch));
  let cx = x;
  const parts = [];
  for (let i = 0; i < glyphs.length; i++) {
    const g = glyphs[i];
    parts.push(pathData(g.getPath(cx, y, size)));
    const kern = i + 1 < glyphs.length ? font.getKerningValue(g, glyphs[i + 1]) || 0 : 0;
    cx += ((g.advanceWidth || 0) + kern) * scale + tracking * size;
  }
  return { d: parts.join(" "), width: cx - x - tracking * size };
}

const TRACK = -0.045;
/** A title line is a list of segments: { t, accent? }. */
const lineWidth = (segs, size) => segs.reduce((w, s) => w + layout(F.sans, s.t, 0, 0, size, TRACK).width + TRACK * size, 0) - TRACK * size;
function lineSvg(segs, x, y, size) {
  let cx = x;
  return segs
    .map((s) => {
      const r = layout(F.sans, s.t, cx, y, size, TRACK);
      cx += r.width + TRACK * size;
      return `<path d="${r.d}" fill="${s.accent ? C.flag : C.ink}"/>`;
    })
    .join("");
}
const mono = (text, x, y, size, fill, anchor = "start") => {
  const r = layout(F.mono, text.toUpperCase(), 0, 0, size, 0.06);
  const dx = anchor === "end" ? x - r.width : anchor === "middle" ? x - r.width / 2 : x;
  return `<path transform="translate(${n(dx)} ${n(y)})" d="${r.d}" fill="${fill}"/>`;
};

/* ---------- pieces ---------- */
const MARK_PATH = "M20 16 L72.38 68.38 A5.5 5.5 0 0 1 64.61 76.16 L43.83 55.38 L20 68 Z";
const MARK_PENNANT = "20,31.56 20,68 43.83,55.38";
const markAt = (x, y, size, pole = C.ink, pennant = C.flag) =>
  `<g transform="translate(${x} ${y}) scale(${size / 66}) translate(-14 -13)"><path d="${MARK_PATH}" fill="${pole}"/><polygon points="${MARK_PENNANT}" fill="${pennant}"/></g>`;

/** Fig. 1: the mark over its construction guides. (x, y) = top left of the 66-unit square, `size` its side. */
function figure(x, y, size) {
  const s = size / 66, sw = 1.25 / s;
  const g = `fill="none" stroke="${C.guide}" stroke-width="${n(sw)}"`;
  // Notes are laid out in page pixels (so the mono stays a crisp 13px), placed at user-space anchors.
  const at = (ux, uy) => [x + (ux - 14) * s, y + (uy - 13) * s];
  const note = (t, ux, uy, anchor) => {
    const [px, py] = at(ux, uy);
    return mono(t, px, py, 12.5, C.muted, anchor);
  };
  const [cx0, cy0] = at(14, 13);
  return `<g transform="translate(${x} ${y}) scale(${s}) translate(-14 -13)">
    <rect x="14" y="13" width="66" height="66" ${g}/>
    <line x1="8" y1="2" x2="88" y2="82" ${g}/>
    <line x1="20" y1="6" x2="20" y2="86" ${g}/>
    <line x1="6" y1="68" x2="58" y2="68" ${g}/>
    <polygon points="${MARK_PENNANT}" ${g}/>
    <circle cx="68.5" cy="72.27" r="5.5" ${g}/>
    <path d="${MARK_PATH}" fill="${C.ink}"/>
    <polygon points="${MARK_PENNANT}" fill="${C.flag}"/>
  </g>
  ${note("45°", 54, 40)}${note("Pole", 22, 10.5)}${note("Pennant", 21, 74.8)}${note("R 5.5", 68.5, 84, "middle")}
  ${mono("Fig. 1", cx0, cy0 + size + 50, 12.5, C.flagText)}${mono("The mark, constructed", cx0 + 70, cy0 + size + 50, 12.5, C.muted)}`;
}

/** The real wordmark (Sora 800 outlines): "websport" Ink + ".com.au" Flag. `h` = cap-to-descender box height. */
function wordmark(x, baseline, h) {
  const s = h / WM.height;
  const word = WM.word.glyphs.map((g) => g.d).join("");
  const tld = WM.tld.glyphs.map((g) => g.d).join("");
  return {
    svg: `<g transform="translate(${n(x - WM.word.x0 * s)} ${n(baseline)}) scale(${n(s)})"><path d="${word}" fill="${C.ink}"/><path d="${tld}" fill="${C.flag}"/></g>`,
    width: (WM.tld.x1 - WM.word.x0) * s,
  };
}

/** Column ruler: the Ink rule with 12-column ticks (top) and a hairline with ticks (foot). */
function ruler(y, colour, tick, up) {
  const cols = 12, w = W - 2 * X;
  const ticks = Array.from({ length: cols + 1 }, (_, i) => {
    const tx = X + (w * i) / cols;
    return `<rect x="${n(tx - 0.5)}" y="${up ? y - tick : y}" width="1" height="${tick}" fill="${colour}"/>`;
  }).join("");
  return `<rect x="${X}" y="${y}" width="${w}" height="1" fill="${colour}"/>${ticks}`;
}

/* ---------- routes ---------- */
const r = (t) => ({ t });
const a = (t) => ({ t, accent: true });
const PAGES = [
  { name: "home", label: "Specialists in club sport", lines: [[r("Every club plants")], [r("its "), a("flag"), r(" online.")]] },
  { name: "work", label: "Work", lines: [[r("Our first club.")], [r("Built "), a("properly.")]] },
  { name: "lang-lang", label: "Case study", lines: [[r("Lang Lang Cricket Club:")], [r("a club that "), a("lives")], [r("on its website.")]], capture: "public/work/lang-lang/home-1440.jpg", url: "langlangcricketclub.com" },
  { name: "studio", label: "Studio", lines: [[r("Club sport is")], [r("our speciality.")], [a("Craft"), r(" is our trade.")]] },
  { name: "contact", label: "Contact", lines: [[r("Plant your")], [a("flag.")]] },
];

const DEFS = `<defs><filter id="elev" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur stdDeviation="18"/></filter></defs>`;

async function render(page) {
  // Title: fit the widest line into the left column, then centre the block between the rules.
  const maxW = page.capture ? 490 : 640;
  let size = page.lines.length > 2 ? 78 : 96;
  while (size > 40 && Math.max(...page.lines.map((l) => lineWidth(l, size))) > maxW) size -= 2;
  const lh = size * 0.98;
  const cap = size * 0.72;
  const top = 150, bottom = 500;
  const blockH = lh * (page.lines.length - 1) + cap;
  const baseY = Math.round(top + (bottom - top - blockH) / 2 + cap);
  const title = page.lines.map((l, i) => lineSvg(l, X, baseY + i * lh, size)).join("");

  let right = "";
  const composites = [];
  if (page.capture) {
    const fw = 480, bar = 32, fh = Math.round((fw * 10) / 16), fx = W - X - fw, fy = Math.round(top + (bottom - top - fh - bar) / 2) + 6;
    right = `<rect x="${fx + 20}" y="${fy + 40}" width="${fw - 40}" height="${fh + bar - 30}" rx="6" fill="rgba(15,23,41,0.28)" filter="url(#elev)"/>
      <rect x="${fx}" y="${fy}" width="${fw}" height="${fh + bar}" rx="5" fill="${C.surface}"/>
      <rect x="${fx + 0.5}" y="${fy + 0.5}" width="${fw - 1}" height="${fh + bar - 1}" rx="5" fill="none" stroke="${C.line2}"/>
      ${[0, 1, 2].map((i) => `<circle cx="${fx + 18 + i * 14}" cy="${fy + bar / 2}" r="4" fill="#D9DADD"/>`).join("")}
      ${mono(page.url, fx + 70, fy + bar / 2 + 4.5, 11.5, C.muted)}`;
    const img = await sharp(path.resolve(page.capture)).resize(fw - 2, fh, { fit: "cover", position: "top" }).toBuffer();
    const mask = Buffer.from(`<svg width="${fw - 2}" height="${fh}"><rect width="${fw - 2}" height="${fh}" rx="4" fill="#fff"/><rect width="${fw - 2}" height="8" fill="#fff"/></svg>`);
    const rounded = await sharp(img).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
    composites.push({ input: rounded, left: fx + 1, top: fy + bar });
  } else {
    const size = 268;
    right = figure(W - X - size - 26, Math.round(top + (bottom - top - size) / 2) - 8, size);
  }

  const wm = wordmark(X, H - 52, 30);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${DEFS}
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  ${markAt(X, 40, 30)}
  ${mono("websport.com.au", W - X, 60, 12.5, C.muted, "end")}
  ${ruler(92, C.ink, 7, false)}
  ${mono(page.label, X, 124, 13, C.flagText)}
  ${right}
  ${title}
  ${ruler(H - 104, C.line2, 7, true)}
  ${wm.svg}
  ${mono("Websites & apps for community sports clubs", W - X, H - 58, 12.5, C.muted, "end")}
</svg>`;
  return sharp(Buffer.from(svg)).composite(composites).png({ compressionLevel: 9 }).toBuffer();
}

await mkdir(path.resolve("public/og"), { recursive: true });
for (const p of PAGES) {
  const buf = await render(p);
  await writeFile(path.resolve(`public/og/${p.name}.png`), buf);
  if (p.name === "home") await writeFile(path.resolve("public/og.png"), buf);
  console.log(`og/${p.name}.png`);
}
console.log("og.png = og/home.png");
