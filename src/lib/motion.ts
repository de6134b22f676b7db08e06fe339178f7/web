"use client";
/**
 * One GSAP registration for every client leaf (DESIGN.md §6). Import `gsap` and `ScrollTrigger` from here.
 * `reduced()` and `fine()` read the classes the head script set (lib/gate.ts) so CSS and JS agree.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

export const reduced = () => typeof document !== "undefined" && document.documentElement.classList.contains("reduce");
export const fine = () => typeof document !== "undefined" && document.documentElement.classList.contains("fine");
/** Set pieces pin only at >= 900px (DESIGN.md §6.1). */
export const wide = () => typeof window !== "undefined" && window.innerWidth >= 900;

export const EASE_OUT = "expo.out";
