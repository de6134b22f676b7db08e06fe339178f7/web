"use client";
/**
 * Registers GSAP + ScrollTrigger and the three brand eases once (DESIGN.md v4 §4.2). Import gsap only from here.
 * The eases are plain cubic-bezier functions registered by name (no CustomEase download). No SplitText/Flip/
 * DrawSVG: splitting is src/lib/split.ts, FLIP is src/lib/flip.ts, line draws use pathLength="1" dashes.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/** CSS cubic-bezier(x1, y1, x2, y2) as an ease function (Newton-Raphson on x, bisection fallback). */
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x;
      if (Math.abs(e) < 1e-6) return sy(t);
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    let lo = 0, hi = 1;
    t = x;
    for (let i = 0; i < 30; i++) {
      const v = sx(t);
      if (Math.abs(v - x) < 1e-6) break;
      if (v < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return sy(t);
  };
}

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.registerEase("ws.out", bezier(0.16, 1, 0.3, 1));
  gsap.registerEase("ws.hand", bezier(0.65, 0, 0.35, 1));
  gsap.registerEase("ws.lift", bezier(0.76, 0, 0.24, 1));
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, useGSAP };
