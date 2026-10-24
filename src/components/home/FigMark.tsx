"use client";
/**
 * Fig. 1, "The mark" (M13). The mark's construction: artwork box, cap line, baseline, the W/S seam, the S bar
 * rows and the cursor left in the negative space, with mono annotations.
 * At 30% in view (once) the guides draw (dashoffset 1 → 0, 1.6s hand, 100ms stagger), then the notes fade in.
 * Hover: the S leans forward (skewX −6°, anchored on the baseline, 900ms expo). Touch: tap toggles it.
 * No JS / reduced motion: drawn and static.
 * Labels keep a knock-out zone: none sits on a guide (see FIG_NOTES).
 */
import { useEffect, useRef, useState } from "react";
import { FIG_NOTES, FIG_VIEWBOX, MARK_GUIDES, MARK_S, MARK_W } from "@/components/Mark";

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
      <svg className="fig-svg" viewBox={FIG_VIEWBOX} aria-hidden="true" focusable="false">
        {MARK_GUIDES.map((d, i) => (
          <path key={i} className="fig-g" d={d} pathLength={1} style={{ "--k": i } as React.CSSProperties} />
        ))}
        <path className="fig-pole" d={MARK_W} />
        <path className="fig-pennant" d={MARK_S} />
        <g className="fig-notes">
          {FIG_NOTES.map(([t, x, y, a]) => (
            <text key={t} x={x} y={y} textAnchor={a}>
              {t}
            </text>
          ))}
        </g>
      </svg>
      <figcaption className="fig-cap">
        <span className="mono fig-k">Fig. 1 · The mark</span>
        Two letters, one cursor. The pointer lives in the space between them.
      </figcaption>
    </figure>
  );
}
