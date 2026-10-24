"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, reduced } from "@/lib/motion";

/**
 * Before/Now wipe (BRIEF 5.2): two captures of the same window stacked; the "now" layer is clipped from the left
 * and the clip scrubs from 100% (all Before) to 45% as the pair crosses the viewport, a 2px edge travelling with it,
 * so the pair rests as a split with both screens visible: Before on the left, Now on the right. Under reduced
 * motion the two sit side by side (CSS). Labels are real text, one under each half.
 */
export function Compare({ before, now, labels }: { before: ReactNode; now: ReactNode; labels: [string, string] }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced()) return;
      const nowEl = el.querySelector<HTMLElement>(".cmp-now")!;
      const edge = el.querySelector<HTMLElement>(".cmp-edge")!;
      const o = { p: 100 };
      gsap.to(o, {
        p: 45,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 80%", end: "center 45%", scrub: 0.3 },
        onUpdate: () => {
          nowEl.style.clipPath = `inset(0 0 0 ${o.p}%)`;
          edge.style.left = `${o.p}%`;
        },
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="cmp">
      <div className="cmp-stage">
        <div className="cmp-before">{before}</div>
        <div className="cmp-now">{now}</div>
        <span className="cmp-edge" aria-hidden="true" />
      </div>
      <div className="cmp-labels">
        <span className="cmp-l cmp-was">{labels[0]}</span>
        <span className="cmp-l cmp-is">{labels[1]}</span>
      </div>
    </div>
  );
}
