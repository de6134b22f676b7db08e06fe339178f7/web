"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, reduced } from "@/lib/motion";

/**
 * Entry reveal (DESIGN.md §6.1): children marked `.rise` (or the wrapper itself when none) rise 32px and fade in once
 * as they enter (trigger `top 88%`), 1s expo.out, 80ms stagger within the group. Headings, ledgers, cells; body copy
 * never animates in. CSS gives `.rise` the same start state under
 * `html.js:not(.reduce)`, so there is no snap when the chunk arrives. Under reduced motion, nothing moves.
 */
export function Rise({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced()) return;
      const items = el.querySelectorAll<HTMLElement>(".rise");
      const targets = items.length ? Array.from(items) : [el];
      gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        overwrite: "auto",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={`rise-group ${className}`.trim()}>
      {children}
    </div>
  );
}
