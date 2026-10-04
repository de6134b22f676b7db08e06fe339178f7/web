"use client";
/**
 * Contact mark, "Fig. 2" (M28). The mark built from its construction: guides (45° pole axis, pole line,
 * pennant triangle, the 5.5 tip radius, the 66-unit square) with mono annotations.
 * mode "scrub" (home): guides draw (pathLength=1 dashes), the pole fills with a 45° clip wipe, then the pennant
 * unfurls (scaleX 0 -> 1), scrubbed from "top 80%" to "center" (scrub .6); on phones/touch from "top 100%" to
 * "top 40%".
 * mode "static": complete. Both: with a fine pointer the pennant flutters with pointer speed and settles straight
 * (the drawing never rests crooked). The caption sits under the drawing, in the Fig. 1 pattern. Reduced motion: static.
 * SSR markup is the complete mark (no-JS correct).
 */
import { useId, useRef } from "react";
import { gsap, useGSAP } from "@/motion/gsap";
import { MQ } from "@/motion/tokens";
import { MARK_PATH, MARK_PENNANT } from "./Mark";

export function ContactMark({
  mode = "scrub",
  className = "",
}: {
  mode?: "scrub" | "static";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cutId = `cm-cut-${useId().replace(/:/g, "")}`;
  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      if (mode === "scrub") {
        mm.add(MQ.motion, () => {
          // Phones / touch: the scrub starts as soon as the figure enters (top 100%) and is complete by the time
          // it reaches 40%, so it never sits on screen as an empty square of faint guides.
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
                stagger: 0.08,
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
              { scaleX: 0, transformOrigin: "0% 50%" },
              { scaleX: 1, ease: "none", duration: 0.25 },
              0.8,
            )
            // The pole path includes the pennant's area: until the pennant has fully unfurled, that triangle is
            // masked out of the pole, so no frame shows Ink where the Flag belongs (DESIGN 2.1). At the end the
            // cut goes, and the finished state is the exact mark (no seam on the hypotenuse).
            .fromTo(
              q(".cm-cut"),
              { opacity: 1 },
              { opacity: 1, duration: 0.001, immediateRender: true },
              0,
            )
            .set(q(".cm-cut"), { opacity: 0 }, 1.05);
        });
      }
      // Fine pointer: the pennant flutters with pointer speed (skew, .6s) and settles straight when the pointer
      // stops, so the drawing always rests on its exact construction; the pole, guides and notes never move.
      mm.add(`${MQ.motion} and ${MQ.fine}`, () => {
        const pen = q(".mk-pennant")[0];
        gsap.set(pen, { transformOrigin: "0% 50%" });
        const qs = gsap.quickTo(pen, "skewY", {
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
        <svg viewBox="4 3 86 86">
          <rect
            className="cm-guide"
            x="14"
            y="13"
            width="66"
            height="66"
            pathLength={1}
            strokeDasharray="1"
          />
          <line
            className="cm-guide"
            x1="10"
            y1="6"
            x2="86"
            y2="82"
            pathLength={1}
            strokeDasharray="1"
          />
          <line
            className="cm-guide"
            x1="20"
            y1="8"
            x2="20"
            y2="84"
            pathLength={1}
            strokeDasharray="1"
          />
          <line
            className="cm-guide"
            x1="8"
            y1="68"
            x2="56"
            y2="68"
            pathLength={1}
            strokeDasharray="1"
          />
          <polygon
            className="cm-guide"
            points={MARK_PENNANT}
            pathLength={1}
            strokeDasharray="1"
          />
          <circle
            className="cm-guide"
            cx="68.5"
            cy="72.27"
            r="5.5"
            pathLength={1}
            strokeDasharray="1"
          />
          <mask
            id={cutId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="100"
            height="100"
          >
            <rect x="0" y="0" width="100" height="100" fill="#fff" />
            <polygon
              className="cm-cut"
              points={MARK_PENNANT}
              fill="#000"
              opacity={0}
            />
          </mask>
          <path
            className="mk-pole"
            d={MARK_PATH}
            fill="var(--ink)"
            mask={`url(#${cutId})`}
          />
          <polygon
            className="mk-pennant"
            points={MARK_PENNANT}
            fill="var(--flag)"
          />
          <text className="cm-note" x="52" y="40">
            45°
          </text>
          <text className="cm-note" x="22" y="10.5">
            Pole
          </text>
          <text className="cm-note" x="21" y="74.8">
            Pennant
          </text>
          <text className="cm-note" x="68.5" y="84" textAnchor="middle">
            R 5.5
          </text>
        </svg>
      </div>
      <p className="cm-cap">
        <span className="mono fig-k">Fig. 2 · Built from its construction</span>
        One square, one 45° axis, one radius.
      </p>
    </div>
  );
}
