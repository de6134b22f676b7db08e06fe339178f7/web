"use client";
/**
 * Contact mark, "Fig. 2" (M28). The mark built from its construction: guides (artwork box, cap line, baseline,
 * W/S seam, S bar rows, the cursor) with mono annotations.
 * mode "scrub" (home): guides draw (pathLength=1 dashes), the W fills with a diagonal clip wipe, then the S wipes
 * on from its left edge (clip-path inset), scrubbed from "top 80%" to "center" (scrub .6); on phones/touch from
 * "top 100%" to "top 40%". The W and S never overlap, so no frame needs a cut-out.
 * mode "static": complete. Both: with a fine pointer the S leans with pointer speed (skewX, anchored on the
 * baseline) and settles straight (the drawing never rests crooked). The caption sits under the drawing, in the
 * Fig. 1 pattern. Reduced motion: static. SSR markup is the complete mark (no-JS correct).
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/motion/gsap";
import { MQ } from "@/motion/tokens";
import { FIG_NOTES, FIG_VIEWBOX, MARK_GUIDES, MARK_S, MARK_W } from "./Mark";

export function ContactMark({
  mode = "scrub",
  className = "",
}: {
  mode?: "scrub" | "static";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      if (mode === "scrub") {
        mm.add(MQ.motion, () => {
          // Phones / touch: the scrub starts as soon as the figure enters (top 100%) and is complete by the time
          // it reaches 40%, so it never sits on screen as an empty box of faint guides.
          const small = window.matchMedia(
            "(max-width: 760px), (pointer: coarse)",
          ).matches;
          gsap
            .timeline({
              scrollTrigger: {
                trigger: root,
                start: small ? "top 100%" : "top 80%",
                end: small ? "top 40%" : "center center",
                scrub: 0.6,
              },
            })
            .fromTo(
              q(".cm-guide"),
              { strokeDashoffset: 1 },
              {
                strokeDashoffset: 0,
                ease: "none",
                stagger: 0.06,
                duration: 0.5,
              },
            )
            .fromTo(
              q(".cm-note"),
              { opacity: 0 },
              { opacity: 1, ease: "none", duration: 0.2 },
              0.35,
            )
            .fromTo(
              q(".mk-pole"),
              { clipPath: "polygon(0% 0%, 0% 0%, 0% 0%)" },
              {
                clipPath: "polygon(0% 0%, 200% 0%, 0% 200%)",
                ease: "none",
                duration: 0.4,
              },
              0.45,
            )
            .fromTo(
              q(".mk-pennant"),
              { clipPath: "inset(0% 100% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 0.25 },
              0.8,
            );
        });
      }
      // Fine pointer: the S leans with pointer speed (skewX, .6s) and settles straight when the pointer stops, so
      // the drawing always rests on its exact construction; the W, guides and notes never move.
      mm.add(`${MQ.motion} and ${MQ.fine}`, () => {
        const s = q(".mk-pennant")[0];
        gsap.set(s, { transformOrigin: "0% 100%" });
        const qs = gsap.quickTo(s, "skewX", {
          duration: 0.6,
          ease: "power3.out",
        });
        let lastX = -1;
        let t = 0;
        const move = (e: PointerEvent) => {
          const dx = lastX < 0 ? 0 : e.clientX - lastX;
          lastX = e.clientX;
          qs(Math.max(-7, Math.min(7, -dx * 0.35)));
          window.clearTimeout(t);
          t = window.setTimeout(() => qs(0), 120);
        };
        window.addEventListener("pointermove", move, { passive: true });
        return () => {
          window.removeEventListener("pointermove", move);
          window.clearTimeout(t);
        };
      });
    },
    { scope: ref, dependencies: [mode] },
  );
  return (
    <div ref={ref} className={`cmark ${className}`.trim()} aria-hidden="true">
      <div className="cmark-art">
        <svg viewBox={FIG_VIEWBOX}>
          {MARK_GUIDES.map((d, i) => (
            <path key={i} className="cm-guide" d={d} pathLength={1} strokeDasharray="1" />
          ))}
          <path className="mk-pole" d={MARK_W} fill="var(--ink)" />
          <path className="mk-pennant" d={MARK_S} fill="var(--flag)" />
          {FIG_NOTES.map(([t, x, y, a]) => (
            <text key={t} className="cm-note" x={x} y={y} textAnchor={a}>
              {t}
            </text>
          ))}
        </svg>
      </div>
      <p className="cm-cap">
        <span className="mono fig-k">Fig. 2 · Built from its construction</span>
        Two letters, one cursor, one line from cap to base.
      </p>
    </div>
  );
}
