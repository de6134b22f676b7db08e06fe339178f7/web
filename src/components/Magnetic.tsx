"use client";
/**
 * Magnetic wrapper (M7). Active within the child's box + 24px (the wrapper's padding is the hit zone).
 * The child follows the pointer offset x 0.28 / y 0.4, its `[data-magnetic-inner]` label x 0.1 / y 0.14
 * (quickTo .6s expo); release springs back with elastic.out(1,.45) over .9s.
 * Fine pointer + motion + > 760px only; disabled (`aria-disabled`) children never move. Otherwise inert markup.
 */
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/motion/gsap";
import { E, MQ } from "@/motion/tokens";

export type MagneticProps = { children: ReactNode; className?: string; strength?: [number, number]; inner?: [number, number] };

export function Magnetic({ children, className = "", strength = [0.28, 0.4], inner = [0.1, 0.14] }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [sx, sy] = strength;
  const [ix, iy] = inner;
  useGSAP(
    () => {
      const zone = ref.current;
      const el = zone?.firstElementChild as HTMLElement | null;
      if (!zone || !el) return;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.motion} and ${MQ.fine} and ${MQ.md}`, () => {
        const inn = el.querySelector<HTMLElement>("[data-magnetic-inner]");
        const o = { duration: 0.6, ease: E.out };
        const qx = gsap.quickTo(el, "x", o);
        const qy = gsap.quickTo(el, "y", o);
        const qix = inn ? gsap.quickTo(inn, "x", o) : null;
        const qiy = inn ? gsap.quickTo(inn, "y", o) : null;
        const move = (e: PointerEvent) => {
          if (el.getAttribute("aria-disabled") === "true") return;
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          qx(dx * sx);
          qy(dy * sy);
          qix?.(dx * ix);
          qiy?.(dy * iy);
        };
        const leave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: E.spring, overwrite: true });
          if (inn) gsap.to(inn, { x: 0, y: 0, duration: 0.9, ease: E.spring, overwrite: true });
        };
        zone.addEventListener("pointermove", move);
        zone.addEventListener("pointerleave", leave);
        return () => {
          zone.removeEventListener("pointermove", move);
          zone.removeEventListener("pointerleave", leave);
          gsap.set([el, inn].filter(Boolean), { clearProps: "transform" });
        };
      });
    },
    { scope: ref, dependencies: [sx, sy, ix, iy] },
  );
  return (
    <span ref={ref} className={`magnetic ${className}`}>
      {children}
    </span>
  );
}
