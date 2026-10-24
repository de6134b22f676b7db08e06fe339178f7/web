"use client";
/**
 * Studio "Fig. 1" (§6.4 ST0): the mark drawn over its construction guides (artwork box, cap line, baseline, the
 * W/S seam, the S bar rows, the cursor) with mono annotations.
 * - First paint: complete (SSR markup is the finished figure; no-JS and reduced motion stay static).
 * - With motion allowed, the guides draw once with the hero and the S wipes on (CSS keyframes off --intro, studio.css).
 * - Fine pointer: the whole figure tilts ±4° toward the pointer (quickTo .8s); hover leans the S (M13).
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/motion/gsap";
import { MQ } from "@/motion/tokens";
import { FIG_NOTES, FIG_VIEWBOX, MARK_GUIDES, MARK_S, MARK_W } from "@/components/Mark";

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
      <svg viewBox={FIG_VIEWBOX} aria-hidden="true" focusable="false">
        {MARK_GUIDES.map((d, i) => (
          <path key={i} className="sf-g" style={{ "--k": i } as React.CSSProperties} d={d} pathLength={1} />
        ))}
        <path className="mk-pole" d={MARK_W} fill="var(--ink)" />
        <path className="mk-pennant" d={MARK_S} fill="var(--flag)" />
        <g className="sf-notes">
          {FIG_NOTES.map(([t, x, y, a]) => (
            <text key={t} x={x} y={y} textAnchor={a}>
              {t}
            </text>
          ))}
        </g>
      </svg>
      <figcaption className="mono sf-cap">
        <span>Fig. 1</span>
        <span>The mark, constructed: two letters, one cursor</span>
      </figcaption>
    </figure>
  );
}
