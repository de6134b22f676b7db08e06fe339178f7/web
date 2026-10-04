"use client";
/**
 * 404 mark (M38). The drop-in is CSS (globals.css "404": rotate −40° -> −14°, 900ms expo, off --intro), so it lands
 * with the H1 and works before hydration. This island adds the pointer sway (±6° around the resting tilt,
 * quickTo .8s) on fine pointers with motion allowed. Reduced motion and touch: static at −14°.
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/motion/gsap";
import { MQ } from "@/motion/tokens";
import { Mark } from "@/components/Mark";

export function SwayMark() {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.motion} and ${MQ.fine}`, () => {
        const inner = el.firstElementChild as HTMLElement | null;
        if (!inner) return;
        gsap.set(inner, { transformOrigin: "22% 92%" });
        const qr = gsap.quickTo(inner, "rotation", { duration: 0.8, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const nx = (e.clientX - (r.left + r.width / 2)) / Math.max(window.innerWidth / 2, 1);
          qr(Math.max(-1, Math.min(1, nx)) * 6);
        };
        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
      });
    },
    { scope: ref },
  );
  return (
    <span ref={ref} className="nf-mark" aria-hidden="true">
      <span className="nf-mark-in">
        <Mark className="nf-svg" />
      </span>
    </span>
  );
}
