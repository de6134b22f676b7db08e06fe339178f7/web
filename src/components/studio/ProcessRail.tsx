"use client";
/**
 * Process rail (§6.4 ST2). Four steps on a hairline rail; a 2px Flag line scales along it on a scroll scrub
 * (top 72% -> bottom 62%, scrub .6) and each step lights as the line reaches it (thresholds at i/4).
 * Horizontal at > 760, vertical (left rail) at ≤ 760: the same --p drives scaleX or scaleY in CSS.
 * SSR / no JS / reduced motion: the end state (fully drawn, every step lit). Only `.is-live` (motion allowed,
 * hydrated) introduces the unlit state, so nothing is ever hidden without the animation to reveal it.
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/motion/gsap";
import { MQ } from "@/motion/tokens";

export type Step = { title: string; text: string };

export function ProcessRail({ steps }: { steps: readonly Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(".pr-step"));
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const n = items.length;
        const set = (p: number) => {
          root.style.setProperty("--p", p.toFixed(4));
          items.forEach((el, i) => el.classList.toggle("is-on", p >= (i / n) * 0.92 + 0.03));
        };
        const proxy = { p: 0 };
        root.classList.add("is-live");
        set(0);
        const tl = gsap.to(proxy, {
          p: 1,
          ease: "none",
          onUpdate: () => set(proxy.p),
          scrollTrigger: { trigger: root, start: "top 72%", end: "bottom 62%", scrub: 0.6 },
        });
        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          root.classList.remove("is-live");
          root.style.removeProperty("--p");
          items.forEach((el) => el.classList.remove("is-on"));
        };
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="pr">
      <span className="pr-track" aria-hidden="true">
        <span className="pr-fill" />
      </span>
      <ol className="pr-list">
      {steps.map((s, i) => (
        <li key={s.title} className="pr-step">
          <span className="pr-node" aria-hidden="true" />
          <span className="pr-n mono">Step {String(i + 1).padStart(2, "0")}</span>
          <h3 className="pr-t t-h3">{s.title}</h3>
          <p className="pr-x">{s.text}</p>
        </li>
      ))}
      </ol>
    </div>
  );
}
