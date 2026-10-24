"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, useGSAP, reduced } from "@/lib/motion";

/**
 * Walk frame (BRIEF 5.2): a window of `ratio` onto a tall capture. The picture inside pans as the frame crosses the
 * viewport (scrub, no pin): the window's top starts at `from` of the capture height and its bottom edge rests at
 * `to`. When `to - from` is no taller than the window itself, nothing moves (the frame simply shows `from`). Under
 * reduced motion / no JS it sits at `from` (CSS --at). Children: one <Picture>.
 * `data-from` / `data-to` are exposed for the window-check script.
 */
export function Pan({ children, ratio = "16 / 10", from = 0, to = 0.8, className = "" }: { children: ReactNode; ratio?: string; from?: number; to?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const frame = ref.current;
      if (!frame || reduced()) return;
      const pic = frame.querySelector("picture");
      if (!pic) return;
      gsap.fromTo(
        pic,
        { yPercent: -100 * from },
        {
          // Extra travel (px) beyond `from` so that the capture's `to` line ends on the frame's bottom edge.
          y: () => -Math.max(0, pic.getBoundingClientRect().height * (to - from) - frame.getBoundingClientRect().height),
          yPercent: -100 * from,
          ease: "none",
          scrollTrigger: { trigger: frame, start: "top 85%", end: "bottom 15%", scrub: 0.3, invalidateOnRefresh: true },
        },
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={`walk pan ${className}`.trim()} data-from={from} data-to={to} style={{ "--ratio": ratio, "--at": from } as CSSProperties}>
      {children}
    </div>
  );
}
