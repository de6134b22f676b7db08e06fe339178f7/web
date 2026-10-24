"use client";
/**
 * Fig. 1, "The mark" (M13). The mark's construction: the 100-unit square, cap line, baseline, W/S seam and
 * the blade, with mono annotations.
 * At 30% in view (once) the guides draw (dashoffset 1 → 0, 1.6s hand, 100ms stagger), then the notes fade in.
 * Hover: the pennant skews −6° and stretches 1.08 on X (900ms expo). Touch: tap toggles it.
 * No JS / reduced motion: drawn and static.
 * Labels keep a knock-out zone: none sits on a guide (Pennant left of the square, Pointer inside its right edge).
 */
import { useEffect, useRef, useState } from "react";
import { MARK_GUIDES, MARK_PATH, MARK_PENNANT } from "@/components/Mark";

const GUIDES = [...MARK_GUIDES, `M${MARK_PENNANT.replace(/ /g, "L")}Z`];

export function FigMark() {
  const ref = useRef<HTMLElement>(null);
  const [tapped, setTapped] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("is-armed");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <figure ref={ref} className={`fig${tapped ? " is-tapped" : ""}`} data-cursor="Look" onClick={() => setTapped((t) => !t)}>
      <svg className="fig-svg" viewBox="-6 -4 112 108" aria-hidden="true" focusable="false">
        {GUIDES.map((d, i) => (
          <path key={i} className="fig-g" d={d} pathLength={1} style={{ "--k": i } as React.CSSProperties} />
        ))}
        <path className="fig-pole" d={MARK_PATH} />
        <polygon className="fig-pennant" points={MARK_PENNANT} />
        <g className="fig-notes">
          <text x="100" y="4" textAnchor="end">Cap</text>
          <text x="100" y="99" textAnchor="end">Base</text>
          <text x="-4" y="50" textAnchor="start">Blade</text>
          <text x="52.5" y="104">100 × 100</text>
        </g>
      </svg>
      <figcaption className="fig-cap">
        <span className="mono fig-k">Fig. 1 · The mark</span>
        Two letters. One blade. One mark.
      </figcaption>
    </figure>
  );
}
