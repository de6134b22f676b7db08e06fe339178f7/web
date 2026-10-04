"use client";
/**
 * Fig. 1, "The mark" (M13). The mark's construction: the 66-unit square, the 45° axis, the pole edge, the
 * pennant triangle, the tip radius and the pennant base line, with mono annotations.
 * At 30% in view (once) the guides draw (dashoffset 1 → 0, 1.6s hand, 100ms stagger), then the notes fade in.
 * Hover: the pennant skews −6° and stretches 1.08 on X (900ms expo). Touch: tap toggles it.
 * No JS / reduced motion: drawn and static.
 * Labels keep a knock-out zone: none sits on a guide (Pennant left of the square, Pointer inside its right edge).
 */
import { useEffect, useRef, useState } from "react";
import { MARK_PATH, MARK_PENNANT } from "@/components/Mark";

const GUIDES = [
  "M14 13H80V79H14Z",
  "M12 8L82 78",
  "M20 9V75",
  "M20 31.56L20 68L43.83 55.38Z",
  "M74 72.27A5.5 5.5 0 1 1 62.99 72.27A5.5 5.5 0 1 1 74 72.27",
  "M10 68H50",
  "M20 16H70",
];

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
      <svg className="fig-svg" viewBox="0 2 92 90" aria-hidden="true" focusable="false">
        {GUIDES.map((d, i) => (
          <path key={i} className="fig-g" d={d} pathLength={1} style={{ "--k": i } as React.CSSProperties} />
        ))}
        <path className="fig-pole" d={MARK_PATH} />
        <polygon className="fig-pennant" points={MARK_PENNANT} />
        <g className="fig-notes">
          <text x="62" y="10">45°</text>
          <text x="77" y="86" textAnchor="end">R 5.5</text>
          <text x="14" y="86">66 × 66</text>
          <text x="12.4" y="50" textAnchor="end">Pennant</text>
          <text x="78.6" y="57" textAnchor="end">Pointer</text>
        </g>
      </svg>
      <figcaption className="fig-cap">
        <span className="mono fig-k">Fig. 1 · The mark</span>
        A club pennant. A web pointer. One mark.
      </figcaption>
    </figure>
  );
}
