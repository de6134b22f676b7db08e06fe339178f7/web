"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, reduced, fine } from "@/lib/motion";

/**
 * Lenis smooth scroll (DESIGN.md §6.1): fine pointers only, never under reduced motion; native on touch. Synced to
 * ScrollTrigger through gsap's ticker. Also refreshes ScrollTrigger once fonts are in, since every set piece measures.
 */
export function Smooth() {
  useEffect(() => {
    document.documentElement.classList.add("hydrated");
    if (reduced()) return;
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    if (!fine()) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
