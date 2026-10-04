"use client";
/**
 * Footer giant wordmark (C9, M27). Outlined paths at width:100% of .wrap (cannot overflow at any width, W9).
 * - Rises into view: translateY 40% -> 0, scrubbed.
 * - Fine pointer: each glyph lifts by a Gaussian of its distance to the pointer x (sigma 1.2 glyph widths,
 *   max -10% of cap height, quickTo .5s expo); the pennant full stop slides under the nearest glyph (.6s expo).
 * - Touch: a once-only lift wave across the glyphs when it enters view (60ms stagger, 700ms expo).
 * - Reduced motion: static.
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/motion/gsap";
import { E, MQ } from "@/motion/tokens";
import { Wordmark } from "./Wordmark";

export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const svg = root.querySelector("svg");
      const dot = root.querySelector<HTMLElement>(".ftr-dot");
      const glyphs = Array.from(root.querySelectorAll<SVGGElement>(".wm-g"));
      if (!svg || !glyphs.length) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(svg, { yPercent: 40 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom bottom", scrub: 0.6 } });
      });
      mm.add(`${MQ.motion} and ${MQ.fine}`, () => {
        const qs = glyphs.map((g) => gsap.quickTo(g, "yPercent", { duration: 0.5, ease: E.out }));
        let centers: number[] = [];
        let gw = 1;
        const measure = () => {
          const rr = root.getBoundingClientRect();
          centers = glyphs.map((g) => {
            const r = g.getBoundingClientRect();
            return r.left - rr.left + r.width / 2;
          });
          gw = rr.width / glyphs.length;
        };
        const move = (e: PointerEvent) => {
          if (!centers.length) measure();
          const x = e.clientX - root.getBoundingClientRect().left;
          const s = 1.2 * gw;
          let best = 0;
          centers.forEach((c, i) => {
            const d = x - c;
            // yPercent of the glyph's own box: ~ -10% of cap height.
            qs[i](-13 * Math.exp(-(d * d) / (2 * s * s)));
            if (Math.abs(d) < Math.abs(x - centers[best])) best = i;
          });
          if (dot) {
            dot.style.setProperty("--dx", `${centers[best] - dot.offsetWidth / 2}px`);
            root.classList.add("has-dot");
          }
        };
        const leave = () => {
          qs.forEach((q) => q(0));
          root.classList.remove("has-dot");
        };
        const ro = new ResizeObserver(measure);
        ro.observe(root);
        root.addEventListener("pointermove", move);
        root.addEventListener("pointerleave", leave);
        return () => {
          ro.disconnect();
          root.removeEventListener("pointermove", move);
          root.removeEventListener("pointerleave", leave);
        };
      });
      mm.add(`${MQ.motion} and (hover: none)`, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root, start: "top 85%", once: true } })
          .to(glyphs, { yPercent: -12, duration: 0.35, ease: E.out, stagger: 0.06 })
          .to(glyphs, { yPercent: 0, duration: 0.7, ease: E.out, stagger: 0.06 }, 0.3);
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="ftr-giant" aria-hidden="true">
      <Wordmark part="word" glyphs decorative />
      <span className="ftr-dot" />
    </div>
  );
}
