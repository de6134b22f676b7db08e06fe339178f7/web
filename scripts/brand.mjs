// Websport brand generator (DESIGN.md §2). Deterministic: same inputs, byte-identical outputs. Commit the outputs.
//
//   node scripts/brand.mjs
//
// Mark: a heavy W on a 120 × 100 grid (baseline y = 100) whose middle peak is an arc concentric with the ball,
// so the W "catches" it. Wordmark: "ebsport" in Geist 700, outlined with opentype.js (scripts/assets/Geist-700.ttf),
// so no logo ever waits on a font. The mark is the capital W of "Websport", scaled to Geist's cap height.
//
// Writes:
//   public/brand/{logo,logo-white,logo-mono,mark,icon}.svg
//   src/app/icon.svg, src/app/apple-icon.png (180), public/brand/icon-32.png, src/app/favicon.ico (32)
//   src/components/brand.generated.ts  (path data for the inline <Logo />)
// Exports the geometry for scripts/og.mjs.
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const opentype = require("opentype.js");
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const BLUE = "#0062FF", NIGHT = "#00153D", WHITE = "#FFFFFF";
const r = (n) => Math.round(n * 100) / 100;

/* ---------- mark geometry ---------- */
const MARK = { H: 100, W: 120, hw: 13, x0: 13, x1: 38, xm: 60, apex: 30, ballCy: 44, ballGap: 6 };

/** Offset of the infinite line through p->q by d along its left normal. */
function off(p, q, d) {
  const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
  const nx = -dy / L, ny = dx / L;
  return [[p[0] + nx * d, p[1] + ny * d], [q[0] + nx * d, q[1] + ny * d]];
}
const atY = ([p, q], y) => [p[0] + ((y - p[1]) * (q[0] - p[0])) / (q[1] - p[1]), y];
function cross([p1, p2], [p3, p4]) {
  const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]);
  const a = p1[0] * p2[1] - p1[1] * p2[0], b = p3[0] * p4[1] - p3[1] * p4[0];
  return [(a * (p3[0] - p4[0]) - (p1[0] - p2[0]) * b) / d, (a * (p3[1] - p4[1]) - (p1[1] - p2[1]) * b) / d];
}

/** The W with the cradle: the arc passes exactly through the two inner notches; ball r = arc r − gap. */
function mark() {
  const { H, W, hw, x0, x1, xm, apex, ballCy, ballGap } = MARK;
  const s1 = [[x0, 0], [x1, H]]; // outer down-stroke centreline
  const s2 = [[x1, H], [xm, apex]]; // inner up-stroke centreline
  const s1L = off(...s1, hw), s1R = off(...s1, -hw);
  const s2A = off(...s2, hw), s2B = off(...s2, -hw);
  const outer1 = atY(s1L, 50)[0] < atY(s1R, 50)[0] ? s1L : s1R;
  const inner1 = outer1 === s1L ? s1R : s1L;
  const upper2 = atY(s2A, 70)[0] < atY(s2B, 70)[0] ? s2A : s2B;
  const lower2 = upper2 === s2A ? s2B : s2A;
  const A = atY(outer1, 0), B = atY(inner1, 0);
  const C = cross(inner1, upper2); // inner notch
  const Mb = atY(lower2, H), Ab = atY(outer1, H);
  const mirror = ([x, y]) => [W - x, y];
  const midY = (() => {
    const [p, q] = lower2;
    const t = (W / 2 - p[0]) / (q[0] - p[0]);
    return p[1] + t * (q[1] - p[1]);
  })();
  const Kc = [W / 2, midY];
  const R = Math.hypot(C[0] - W / 2, C[1] - ballCy);
  const ball = { cx: W / 2, cy: ballCy, r: r(R - ballGap) };
  const L = (p) => `${r(p[0])} ${r(p[1])}`;
  const d = "M" + [A, B, C].map(L).join("L") + `A${r(R)} ${r(R)} 0 0 0 ${L(mirror(C))}` + "L" + [mirror(B), mirror(A), mirror(Ab), mirror(Mb), Kc, Mb, Ab].map(L).join("L") + "Z";
  return { d, ball, W, H };
}

export const m = mark();

/* ---------- wordmark ---------- */
const font = opentype.parse(readFileSync(path.join(ROOT, "scripts/assets/Geist-700.ttf")).buffer);
const UPM = font.unitsPerEm, XH = font.tables.os2.sxHeight, CAP = font.tables.os2.sCapHeight;

/** Outline a string so its x-height is `xh` units; baseline at y = 0. */
function word(text, xh, track = -0.02) {
  const size = (xh * UPM) / XH;
  let x = 0, d = "";
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const glyphs = font.stringToGlyphs(text);
  glyphs.forEach((g, i) => {
    const p = g.getPath(x, 0, size);
    p.commands.forEach((c) => {
      for (const k of ["x", "y", "x1", "y1", "x2", "y2"]) if (c[k] != null) c[k] = r(c[k]);
    });
    d += p.toPathData(2);
    const b = p.getBoundingBox();
    minX = Math.min(minX, b.x1); maxX = Math.max(maxX, b.x2); minY = Math.min(minY, b.y1); maxY = Math.max(maxY, b.y2);
    let adv = (g.advanceWidth * size) / UPM;
    if (i < glyphs.length - 1) adv += (font.getKerningValue(g, glyphs[i + 1]) * size) / UPM;
    x += adv + track * size;
  });
  return { d, minX, maxX, minY, maxY, size };
}

/* ---------- lockup: the mark is the capital W of "Websport" ---------- */
const XH_UNITS = 60;
const capH = (XH_UNITS * CAP) / XH;
const S = capH / 100; // mark height == cap height
const w = word("ebsport", XH_UNITS);
const WX = m.W * S + capH * 0.06 - w.minX; // W→e gap = 0.06 cap height
const MARK_TY = 100 - 100 * S;
const P = 4; // hairline artboard padding (clear space is a usage rule, not baked in)
const top = Math.min(MARK_TY, 100 + w.minY), bottom = 100 + w.maxY, width = WX + w.maxX;
export const LOCKUP = {
  viewBox: [-P, top - P, width + 2 * P, bottom - top + 2 * P].map(r),
  markTransform: `translate(0 ${r(MARK_TY)}) scale(${r(S * 10000) / 10000})`,
  wordTransform: `translate(${r(WX)} 100)`,
  wordD: w.d,
  /** Mark scale inside the lockup (user units per mark unit). */
  markScale: r(S * 10000) / 10000,
};
export const MARK_VIEWBOX = [-2, -2, m.W + 4, 104];

const ballEl = (fill) => `<circle fill="${fill}" cx="${r(m.ball.cx)}" cy="${r(m.ball.cy)}" r="${m.ball.r}"/>`;
const markBody = (ink, ball, transform) => `<g transform="${transform}"><path fill="${ink}" d="${m.d}"/>${ballEl(ball)}</g>`;
/** Lockup body (no <svg> wrapper), for embedding (og.mjs). */
export const lockupBody = (ink, ball) =>
  markBody(ink, ball, LOCKUP.markTransform) + `<path fill="${ink}" transform="${LOCKUP.wordTransform}" d="${LOCKUP.wordD}"/>`;
/** Mark body on its 120 × 100 grid. */
export const markOnlyBody = (ink, ball) => markBody(ink, ball, "translate(0 0) scale(1)");

const svg = (vb, body, label = "Websport") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map(r).join(" ")}" role="img" aria-label="${label}"><title>${label}</title>${body}</svg>\n`;

/** Icon: blue tile (rx 48/256), white W at 72% of the tile, Night ball (stays separate at 16px). */
function icon() {
  const T = 256, s = (T * 0.72) / m.W, h = 100 * s;
  const tx = (T - m.W * s) / 2, ty = (T - h) / 2;
  return svg(
    [0, 0, T, T],
    `<rect width="${T}" height="${T}" rx="48" fill="${BLUE}"/><g transform="translate(${r(tx)} ${r(ty)}) scale(${r(s * 10000) / 10000})"><path fill="${WHITE}" d="${m.d}"/><circle fill="${NIGHT}" cx="${r(m.ball.cx)}" cy="${r(m.ball.cy)}" r="${r(m.ball.r)}"/></g>`,
  );
}

const lockupSvg = (ink, ball) => svg(LOCKUP.viewBox, lockupBody(ink, ball));

/* ---------- write ---------- */
async function main() {
  const sharp = (await import("sharp")).default;
  const brand = path.join(ROOT, "public/brand");
  mkdirSync(brand, { recursive: true });
  const files = {
    "logo.svg": lockupSvg(NIGHT, BLUE),
    "logo-white.svg": lockupSvg(WHITE, WHITE),
    "logo-mono.svg": lockupSvg(NIGHT, NIGHT),
    "mark.svg": svg(MARK_VIEWBOX, markOnlyBody(NIGHT, BLUE)),
    "icon.svg": icon(),
  };
  for (const [n, c] of Object.entries(files)) writeFileSync(path.join(brand, n), c);
  writeFileSync(path.join(ROOT, "src/app/icon.svg"), files["icon.svg"]);
  const ico = Buffer.from(files["icon.svg"]);
  await sharp(ico, { density: 288 }).resize(180, 180).png({ compressionLevel: 9 }).toFile(path.join(ROOT, "src/app/apple-icon.png"));
  const png32 = await sharp(ico, { density: 72 }).resize(32, 32).png({ compressionLevel: 9 }).toBuffer();
  writeFileSync(path.join(brand, "icon-32.png"), png32);
  // favicon.ico (§2.2) = the 32px PNG in an ICO wrapper: ICONDIR (6 bytes) + one ICONDIRENTRY (16) + PNG bytes.
  const head = Buffer.alloc(22);
  head.writeUInt16LE(0, 0); // reserved
  head.writeUInt16LE(1, 2); // type: icon
  head.writeUInt16LE(1, 4); // count
  head.writeUInt8(32, 6); // width
  head.writeUInt8(32, 7); // height
  head.writeUInt8(0, 8); // palette
  head.writeUInt8(0, 9); // reserved
  head.writeUInt16LE(1, 10); // planes
  head.writeUInt16LE(32, 12); // bpp
  head.writeUInt32LE(png32.length, 14); // size
  head.writeUInt32LE(22, 18); // offset
  writeFileSync(path.join(ROOT, "src/app/favicon.ico"), Buffer.concat([head, png32]));

  const ts = `// GENERATED by scripts/brand.mjs. Do not edit; run \`node scripts/brand.mjs\`.
/** Path data for the inline <Logo /> (DESIGN.md §2). Lockup: the mark is the capital W of "Websport". */
export const BRAND = {
  mark: {
    d: ${JSON.stringify(m.d)},
    ball: { cx: ${r(m.ball.cx)}, cy: ${r(m.ball.cy)}, r: ${m.ball.r} },
    viewBox: ${JSON.stringify(MARK_VIEWBOX.map(r).join(" "))},
    /** Rendered height of the viewBox, in user units. */
    height: ${MARK_VIEWBOX[3]},
  },
  lockup: {
    viewBox: ${JSON.stringify(LOCKUP.viewBox.join(" "))},
    height: ${LOCKUP.viewBox[3]},
    width: ${LOCKUP.viewBox[2]},
    markTransform: ${JSON.stringify(LOCKUP.markTransform)},
    markScale: ${LOCKUP.markScale},
    wordTransform: ${JSON.stringify(LOCKUP.wordTransform)},
    wordD: ${JSON.stringify(LOCKUP.wordD)},
  },
} as const;
`;
  writeFileSync(path.join(ROOT, "src/components/brand.generated.ts"), ts);
  console.log("brand: public/brand/*, src/app/icon.svg, src/app/apple-icon.png, src/components/brand.generated.ts");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
