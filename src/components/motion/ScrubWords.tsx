"use client";
import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/motion";

/**
 * Scrubbed word reveal (DESIGN.md §6.3; Studio, the case-study brief): each word goes from 45% to 100% opacity in
 * sequence as the block crosses the viewport (top 85% -> centre 55%). Only at >= 900px: on phones the words are at
 * full opacity. Screen readers get the plain paragraphs; the word spans are aria-hidden.
 */
export function ScrubWords({
  paragraphs,
  className = "",
  size = "lede",
}: {
  paragraphs: string[];
  className?: string;
  /** "statement": display-scale paragraphs (globals.css .statement). */
  size?: "lede" | "statement";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", () => {
        const words = gsap.utils.toArray<HTMLElement>(".sw", el);
        gsap.fromTo(
          words,
          { opacity: 0.45 },
          { opacity: 1, ease: "none", stagger: 0.02, scrollTrigger: { trigger: el, start: "top 85%", end: "center 55%", scrub: 0.3 } },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={`scrub-words ${className}`.trim()}>
      <div className="sr-only">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 20)}>{p}</p>
        ))}
      </div>
      {paragraphs.map((p) => (
        <p key={p.slice(0, 20)} aria-hidden="true" className={size}>
          {p.split(" ").map((w, i) => (
            <span key={i} className="sw">
              {w}{" "}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
