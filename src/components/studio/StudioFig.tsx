"use client";
/**
 * Studio "Fig. 1" (§6.4 ST0): the mark drawn over its construction guides (45° axis, pole line, baseline,
 * blade, the 100-unit square) with mono annotations.
 * - First paint: complete (SSR markup is the finished figure; no-JS and reduced motion stay static).
 * - With motion allowed, the guides draw once with the hero (CSS keyframes off --intro, studio.css).
 * - Fine pointer: the whole figure tilts ±4° toward the pointer (quickTo .8s); hover skews the pennant (M13).
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/motion/gsap";
import { MQ } from "@/motion/tokens";
import { MARK_GUIDES, MARK_PATH, MARK_PENNANT } from "@/components/Mark";

export function StudioFig({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.motion} and ${MQ.fine}`, () => {
        const svg = root.querySelector("svg");
        if (!svg) return;
        gsap.set(svg, { transformOrigin: "30% 80%" });
        const qr = gsap.quickTo(svg, "rotation", { duration: 0.8, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = root.getBoundingClientRect();
          const nx = (e.clientX - (r.left + r.width / 2)) / Math.max(window.innerWidth / 2, 1);
          qr(Math.max(-1, Math.min(1, nx)) * 4);
        };
        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
      });
    },
    { scope: ref },
  );
  return (
    <figure ref={ref} className={`sfig ${className}`.trim()} data-cursor="Look">
      <svg viewBox="-6 -4 112 108" aria-hidden="true" focusable="false">
        {MARK_GUIDES.map((d, i) => (
          <path key={i} className="sf-g" style={{ "--k": i } as React.CSSProperties} d={d} pathLength={1} />
        ))}
        <polygon className="sf-g" style={{ "--k": MARK_GUIDES.length } as React.CSSProperties} points={MARK_PENNANT} pathLength={1} />
        <path className="mk-pole" d={MARK_PATH} fill="var(--ink)" />
        <polygon className="mk-pennant" points={MARK_PENNANT} fill="var(--flag)" />
        <g className="sf-notes">
          <text x="100" y="4" textAnchor="end">Cap</text>
          <text x="100" y="99" textAnchor="end">Base</text>
          <text x="-4" y="50">Blade</text>
        </g>
      </svg>
      <figcaption className="mono sf-cap">
        <span>Fig. 1</span>
        <span>The mark, constructed: two letters and one blade</span>
      </figcaption>
    </figure>
  );
}
