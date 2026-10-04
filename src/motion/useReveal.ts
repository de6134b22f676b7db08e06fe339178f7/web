"use client";
/**
 * Scroll reveals (DESIGN.md v4 §4.3, §4.6 M12). One direction site-wide: upward. All once.
 * - useSplitReveal: our split() into `.ln > span`; CSS does the rise (globals.css "Split-line reveal"), keyed by
 *   `.is-in`. The hidden state exists only under html.hydrated + motion allowed, so no-JS / reduced motion show
 *   the static heading. Already in view at hydration => `.is-now.is-in` (no animation). Re-splits on width change
 *   (ResizeObserver, 150ms debounce; never height-only) and once after document.fonts.ready.
 * - useRise / useClipReveal: GSAP, inside useGSAP + matchMedia(motion), auto-reverted on unmount.
 */
import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import { split } from "@/lib/split";
import { D, E, MQ, STAGGER, stagger as cap } from "./tokens";

export type SplitRevealOpts = { threshold?: number };

export function useSplitReveal(ref: RefObject<HTMLElement | null>, { threshold = 0.15 }: SplitRevealOpts = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("split");
    let res = split(el, "lines");
    let width = el.getBoundingClientRect().width;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in", "is-now");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold },
    );
    if (!el.classList.contains("is-in")) io.observe(el);
    let t = 0;
    const resplit = () => {
      res.revert();
      res = split(el, "lines");
    };
    const ro = new ResizeObserver(() => {
      const w = el.getBoundingClientRect().width;
      if (Math.abs(w - width) < 1) return;
      width = w;
      window.clearTimeout(t);
      t = window.setTimeout(resplit, 150);
    });
    ro.observe(el);
    let alive = true;
    document.fonts?.ready.then(() => alive && resplit()).catch(() => {});
    return () => {
      alive = false;
      io.disconnect();
      ro.disconnect();
      window.clearTimeout(t);
      res.revert();
      el.classList.remove("split", "is-in", "is-now");
    };
  }, [ref, threshold]);
}

export type RiseOpts = { selector?: string; start?: string; delay?: number; stagger?: number; y?: number };

/** Group rise: children (or `selector` matches) y 22 -> 0 + fade in, 1.05s expo, 45ms stagger, once. */
export function useRise(ref: RefObject<HTMLElement | null>, opts: RiseOpts = {}) {
  const { selector = ":scope > *", start = "top 88%", delay = 0, stagger = STAGGER.row, y = 22 } = opts;
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const items = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(selector));
        if (!items.length) return;
        gsap.from(items, {
          y,
          opacity: 0,
          duration: D.reveal,
          ease: E.out,
          delay,
          stagger: cap(items.length, stagger),
          scrollTrigger: { trigger: el, start, once: true },
          clearProps: "transform,opacity",
        });
      });
    },
    { scope: ref, dependencies: [selector, start, delay, stagger, y], revertOnUpdate: true },
  );
}

export type ClipRevealOpts = { start?: string; radius?: number; delay?: number };

/** Frame clip from the bottom edge up; inner `[data-reveal-inner]` (or first img) scales 1.12 -> 1. */
export function useClipReveal(ref: RefObject<HTMLElement | null>, opts: ClipRevealOpts = {}) {
  const { start = "top 88%", radius = 4, delay = 0 } = opts;
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const inner = el.querySelector("[data-reveal-inner]") ?? el.querySelector("img");
        const st = { trigger: el, start, once: true };
        gsap.fromTo(
          el,
          { clipPath: `inset(100% 0% 0% 0% round ${radius}px)` },
          { clipPath: `inset(0% 0% 0% 0% round ${radius}px)`, duration: 1.2, ease: E.out, delay, scrollTrigger: st, clearProps: "clipPath" },
        );
        if (inner) gsap.fromTo(inner, { scale: 1.12 }, { scale: 1, duration: 1.4, ease: E.out, delay, scrollTrigger: st, clearProps: "scale" });
      });
    },
    { scope: ref, dependencies: [start, radius, delay], revertOnUpdate: true },
  );
}

export { ScrollTrigger };
