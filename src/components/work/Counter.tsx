"use client";
/**
 * Counter (DESIGN.md 4.20, M33). The <dd> carries the final number as visually-hidden text; the digit reel is
 * aria-hidden and server-rendered parked on the final value, so no-JS and reduced motion show it as is.
 * With motion, each 0-9 column rolls up from 0 to its digit when the counter enters the viewport (1.4s ws.out).
 */
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/motion/gsap";
import { E, MQ } from "@/motion/tokens";

const DIGITS = Array.from({ length: 10 }, (_, i) => i);

export function Counter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const cols = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".cs-reel__col"));
        gsap.set(cols, { clearProps: "transform" });
        gsap.fromTo(
          cols,
          { yPercent: 0 },
          { yPercent: (i: number) => -Number(cols[i].dataset.d) * 10, duration: 1.4, ease: E.out, stagger: 0.08, scrollTrigger: { trigger: el, start: "top 85%", once: true } },
        );
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="cs-num">
      <dt>{label}</dt>
      <dd>
        <span className="visually-hidden">{String(Number(value))}</span>
        <span className="cs-reel" aria-hidden="true">
          {Array.from(value).map((ch, i) => (
            <span key={i} className="cs-reel__d">
              <span className="cs-reel__col" data-d={ch} style={{ transform: `translateY(${-Number(ch) * 10}%)` } as CSSProperties}>
                {DIGITS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </span>
          ))}
        </span>
      </dd>
    </div>
  );
}
