"use client";
/**
 * Studio "Fig. 1" (§6.4 ST0): the mark drawn over its construction guides (45° axis, pole line, baseline,
 * pennant triangle, the R 5.5 tip, the 66-unit square) with mono annotations.
 * - First paint: complete (SSR markup is the finished figure; no-JS and reduced motion stay static).
 * - With motion allowed, the guides draw once with the hero (CSS keyframes off --intro, studio.css).
 * - Fine pointer: the whole figure tilts ±4° toward the pointer (quickTo .8s); hover skews the pennant (M13).
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/motion/gsap";
import { MQ } from "@/motion/tokens";
import { MARK_PATH, MARK_PENNANT } from "@/components/Mark";

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
      <svg viewBox="4 3 86 86" aria-hidden="true" focusable="false">
        <rect className="sf-g" style={{ "--k": 0 } as React.CSSProperties} x="14" y="13" width="66" height="66" pathLength={1} />
        <line className="sf-g" style={{ "--k": 1 } as React.CSSProperties} x1="10" y1="6" x2="86" y2="82" pathLength={1} />
        <line className="sf-g" style={{ "--k": 2 } as React.CSSProperties} x1="20" y1="8" x2="20" y2="84" pathLength={1} />
        <line className="sf-g" style={{ "--k": 3 } as React.CSSProperties} x1="8" y1="68" x2="56" y2="68" pathLength={1} />
        <polygon className="sf-g" style={{ "--k": 4 } as React.CSSProperties} points={MARK_PENNANT} pathLength={1} />
        <circle className="sf-g" style={{ "--k": 5 } as React.CSSProperties} cx="68.5" cy="72.27" r="5.5" pathLength={1} />
        <path className="mk-pole" d={MARK_PATH} fill="var(--ink)" />
        <polygon className="mk-pennant" points={MARK_PENNANT} fill="var(--flag)" />
        <g className="sf-notes">
          <text x="52" y="40">45°</text>
          <text x="22" y="10.5">Pole</text>
          <text x="21" y="74.5">Pennant</text>
          <text x="75.5" y="70">R 5.5</text>
        </g>
      </svg>
      <figcaption className="mono sf-cap">
        <span>Fig. 1</span>
        <span>The mark, constructed: one 45° line and a pennant</span>
      </figcaption>
    </figure>
  );
}
