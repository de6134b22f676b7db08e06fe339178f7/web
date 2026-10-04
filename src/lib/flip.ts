/**
 * Hand-rolled FLIP with WAAPI (DESIGN.md v4 §4.1; no GSAP Flip).
 *   const before = measure(list, "[data-flip]");   // in the event handler, before the state change
 *   setState(...);
 *   useLayoutEffect(() => { if (before) play(list, "[data-flip]", before); }, [state]);
 * Elements are matched by their `data-flip` value. Longer moves get +120ms (§4.6 M17).
 */
export type Rects = Map<string, DOMRect>;

export function measure(root: HTMLElement, sel = "[data-flip]"): Rects {
  const m: Rects = new Map();
  root.querySelectorAll<HTMLElement>(sel).forEach((el) => m.set(el.dataset.flip ?? "", el.getBoundingClientRect()));
  return m;
}

export type FlipOpts = { duration?: number; easing?: string; stagger?: number; longBonus?: number; onMoved?: (el: HTMLElement, dy: number) => void };

export function play(root: HTMLElement, sel: string, before: Rects, opts: FlipOpts = {}): Animation[] {
  const { duration = 760, easing = "cubic-bezier(.65,0,.35,1)", stagger = 0, longBonus = 120, onMoved } = opts;
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return [];
  const anims: Animation[] = [];
  let i = 0;
  root.querySelectorAll<HTMLElement>(sel).forEach((el) => {
    const a = before.get(el.dataset.flip ?? "");
    if (!a) return;
    const b = el.getBoundingClientRect();
    const dx = a.left - b.left;
    const dy = a.top - b.top;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
    onMoved?.(el, dy);
    const long = Math.abs(dy) > b.height * 1.5 ? longBonus : 0;
    anims.push(
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], {
        duration: duration + long,
        easing,
        delay: stagger * i++,
        fill: "backwards",
      }),
    );
  });
  return anims;
}
