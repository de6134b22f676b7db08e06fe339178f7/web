/** Motion tokens (DESIGN.md v4 §4.2). No DOM access: safe to import anywhere. Mirrored as CSS vars in globals.css. */

/** GSAP ease names. `ws.out` / `ws.hand` / `ws.lift` are cubic-bezier eases registered by name in ./gsap.ts. */
export const E = {
  /** Arrivals, hovers-in, reveals. CSS: var(--expo) = cubic-bezier(.16,1,.3,1) */
  out: "ws.out",
  /** State hand-offs: tabs, re-sorts, slides, wedge sweeps. CSS: var(--hand) = cubic-bezier(.65,0,.35,1) */
  hand: "ws.hand",
  /** Surfaces: loader sheet, menu, page wipe, header hide. CSS: var(--lift) = cubic-bezier(.76,0,.24,1) */
  lift: "ws.lift",
  /** Followers only (cursor, hover preview). */
  soft: "power3.out",
  /** Magnetic release only. */
  spring: "elastic.out(1,0.45)",
  /** Scrubs, line draws and fades. */
  linear: "none",
} as const;

/** Durations in seconds (§4.2). */
export const D = {
  press: 0.12,
  hover: 0.45,
  swap: 0.55,
  reveal: 1.05,
  heroLine: 0.95,
  sheet: 0.54,
  menu: 0.7,
  route: 0.7,
  odo: 0.8,
} as const;

/** Per-item stagger in seconds (§4.2). Cap any group at STAGGER.max. */
export const STAGGER = { char: 0.016, roller: 0.026, row: 0.045, hero: 0.07, line: 0.08, max: 0.6 } as const;

/** Stagger that never lets a group of `n` items exceed STAGGER.max. */
export function stagger(n: number, each: number = STAGGER.row) {
  return n > 1 ? Math.min(each, STAGGER.max / (n - 1)) : 0;
}

/** Media queries used across islands (gsap.matchMedia conditions). */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  fine: "(hover: hover) and (pointer: fine)",
  coarse: "(pointer: coarse)",
  sm: "(min-width: 481px)",
  md: "(min-width: 761px)",
  desk: "(min-width: 1024px)",
  wide: "(min-width: 1100px)",
} as const;

/** In-page anchor offset = html `scroll-padding-top` (96px). Lenis subtracts scroll-padding itself; native path uses this. */
export const ANCHOR_OFFSET = -96;

export const clamp = (min: number, max: number, v: number) => Math.min(max, Math.max(min, v));
