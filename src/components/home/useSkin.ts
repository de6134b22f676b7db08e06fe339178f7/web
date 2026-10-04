"use client";
/**
 * Plate-wide re-skin crossfade when the global sport changes (M24): opacity .4 → 1 with a 6px lift,
 * 450ms expo, 40ms stagger across plates (`index`). WAAPI on the plate cell; skipped under reduced motion.
 */
import { useEffect, useRef, type RefObject } from "react";

export function useSkin(ref: RefObject<HTMLElement | null>, bump: number, index = 0) {
  const first = useRef(bump);
  useEffect(() => {
    if (bump === first.current) return;
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.animate([{ opacity: 0.4, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], {
      duration: 450,
      easing: "cubic-bezier(.16,1,.3,1)",
      delay: index * 40,
      fill: "backwards",
    });
  }, [bump, ref, index]);
}

export const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
