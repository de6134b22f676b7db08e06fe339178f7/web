/**
 * Ground linework (DESIGN.md v4 §2.9.1), ported from proto4-pitch-lines (ground data). Canvas 1600 × 1000.
 * Every set: `b` boundary, `lines` markings, `red` (Flag accents: posts, rings, home plate), `dots`, and `flag`
 * (where the corner flag is planted: x, y, rotation). Decorative only (aria-hidden); the caption is visible text.
 */
import type { SportId } from "@/content/sample";

const R = (x: number, y: number, w: number, h: number) => `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
const E = (cx: number, cy: number, rx: number, ry: number) => `M${cx - rx} ${cy}A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}Z`;
const C = (cx: number, cy: number, r: number) => E(cx, cy, r, r);
const L = (x1: number, y1: number, x2: number, y2: number) => `M${x1} ${y1}L${x2} ${y2}`;
const A = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 1 : 0} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};
const DIA = (x: number, y: number, s: number) => `M${x} ${y - s}L${x + s} ${y}L${x} ${y + s}L${x - s} ${y}Z`;

export type Ground = { id: SportId; b: string; lines: string[]; red: string[]; dots: [number, number][]; flag: [number, number, number] };

export const GROUNDS: Ground[] = [
  {
    id: "afl",
    b: E(800, 500, 640, 400),
    lines: [R(700, 400, 200, 200), C(800, 500, 50), C(800, 500, 16), L(750, 500, 850, 500), A(160, 500, 330, -57, 57), A(1440, 500, 330, 123, 237), R(160, 475, 44, 50), R(1396, 475, 44, 50), L(160, 440, 160, 560), L(1440, 440, 1440, 560)],
    red: [L(1440, 475, 1440, 525), L(160, 475, 160, 525)],
    dots: [[800, 500]],
    flag: [1440, 440, 0],
  },
  {
    id: "soccer",
    b: R(150, 80, 1300, 840),
    lines: [L(800, 80, 800, 920), C(800, 500, 113), R(150, 250.5, 204, 499), R(150, 386.5, 68, 227), A(286, 500, 113, -53, 53), R(1246, 250.5, 204, 499), R(1382, 386.5, 68, 227), A(1314, 500, 113, 127, 233), A(150, 80, 14, 0, 90), A(1450, 80, 14, 90, 180), A(150, 920, 14, -90, 0), A(1450, 920, 14, 180, 270), R(128, 463, 22, 74), R(1450, 463, 22, 74)],
    red: [],
    dots: [[800, 500], [286, 500], [1314, 500]],
    flag: [1450, 80, 0],
  },
  {
    id: "basketball",
    b: R(150, 152, 1300, 696),
    lines: [L(800, 152, 800, 848), C(800, 500, 84), R(150, 386.5, 269, 227), R(1181, 386.5, 269, 227), C(419, 500, 84), C(1181, 500, 84), "M150 194H289A313 313 0 0 1 289 806H150", "M1450 194H1311A313 313 0 0 0 1311 806H1450", L(193, 465, 193, 535), L(1407, 465, 1407, 535)],
    red: [C(223, 500, 10), C(1377, 500, 10)],
    dots: [],
    flag: [1450, 152, 0],
  },
  {
    id: "baseball",
    b: "M800 930L190 320A862 862 0 0 1 1410 320Z",
    lines: [DIA(800, 761, 169), A(800, 769, 253, -158, -22), C(800, 769, 24), DIA(969, 761, 9), DIA(800, 592, 9), DIA(631, 761, 9), R(758, 905, 26, 44), R(816, 905, 26, 44)],
    red: [DIA(800, 930, 9)],
    dots: [[800, 769]],
    flag: [1410, 320, 0],
  },
  {
    id: "netball",
    b: R(150, 175, 1300, 650),
    lines: [L(583, 175, 583, 825), L(1017, 175, 1017, 825), C(800, 500, 19), "M150 291A209 209 0 0 1 150 709", "M1450 291A209 209 0 0 0 1450 709"],
    red: [C(162, 500, 7), C(1438, 500, 7)],
    dots: [[800, 500]],
    flag: [1450, 175, 0],
  },
  {
    id: "cricket",
    b: E(800, 500, 620, 440),
    lines: [E(800, 500, 330, 262), R(690, 484, 220, 32), L(718, 466, 718, 534), L(882, 466, 882, 534), L(700, 466, 700, 534), L(900, 466, 900, 534)],
    red: [],
    dots: [[706, 494], [706, 500], [706, 506], [894, 494], [894, 500], [894, 506]],
    flag: [1238, 189, 0],
  },
  {
    id: "hockey",
    b: R(150, 109, 1300, 782),
    lines: [L(800, 109, 800, 891), L(477, 109, 477, 891), L(1123, 109, 1123, 891), "M150 266A208 208 0 0 1 358 474V526A208 208 0 0 1 150 734", "M1450 266A208 208 0 0 0 1242 474V526A208 208 0 0 0 1450 734", R(130, 474, 20, 52), R(1450, 474, 20, 52)],
    red: [],
    dots: [[800, 500], [241, 500], [1359, 500]],
    flag: [1450, 109, 0],
  },
  {
    id: "any",
    b: "M220 120H1380A20 20 0 0 1 1400 140V860A20 20 0 0 1 1380 880H220A20 20 0 0 1 200 860V140A20 20 0 0 1 220 120Z",
    lines: [L(200, 182, 1400, 182), ...Array.from({ length: 11 }, (_, i) => L(300 + i * 100, 212, 300 + i * 100, 850)), C(800, 530, 250), L(200, 182, 898, 880), R(550, 280, 500, 500), L(200, 530, 1400, 530)],
    red: [],
    dots: [[232, 151], [256, 151], [280, 151]],
    flag: [1400, 120, 0],
  },
];
