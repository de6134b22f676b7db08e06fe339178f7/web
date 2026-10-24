"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, reduced } from "@/lib/motion";

/**
 * Hero device scene (DESIGN.md §6.3): the desktop sits tilted back in perspective at the top of the page and stands
 * up as you scroll (rotateX 12 -> 0, y 0 -> -40); the phone rises a little faster (y 48 -> -32). Scrubbed, so it
 * follows the thumb. Built inside `matchMedia("(min-width: 600px)")` and the CSS start states sit under the same
 * query (home.css): the phone-first layout under 600px has no 3D at all. Without JS the scene is flat and final.
 */
export function HeroScene({ desk, phone }: { desk: ReactNode; phone: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 600px)", () => {
        const d = el.querySelector(".hero-desk");
        const p = el.querySelector(".hero-phone");
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top bottom", end: "top 20%", scrub: 0.6 }, defaults: { ease: "none" } });
        tl.fromTo(d, { rotateX: 12, y: 0 }, { rotateX: 0, y: -40 }, 0);
        if (p) tl.fromTo(p, { y: 48 }, { y: -32 }, 0);
        return () => tl.kill();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="hero-scene">
      <div className="hero-desk">{desk}</div>
      <div className="hero-phone">{phone}</div>
    </div>
  );
}
