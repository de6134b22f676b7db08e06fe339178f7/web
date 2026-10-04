"use client";
/**
 * Case hero frame (DESIGN.md v4 §5.5, §6.3 CS0). A browser frame (--surface chrome, three --line-2 dots, mono URL)
 * holding the live home capture (the LCP image: always painted at full opacity, `priority`).
 * - First paint (CSS, `h-frame`): the frame rises with the page head on `--intro` (translate only, never opacity).
 * - >= 1024 with motion (on the `.cs-hero__scale` wrapper, so GSAP never reads the CSS `translate` rise): from scroll 0 until the frame's top meets the header, it scales .92 -> 1 (origin top
 *   centre) while the capture inside de-scales 1.08 -> 1, like a lens settling. CSS starts it at .92, so
 *   hydration never jumps. Reduced motion / < 1024: static at full size.
 */
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/motion/gsap";
import { MQ } from "@/motion/tokens";

export function CaseHero({
  domain,
  path = "/",
  caption,
  children,
}: {
  domain: string;
  path?: string;
  caption: ReactNode;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const sec = root.current;
      if (!sec) return;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.motion} and ${MQ.desk}`, () => {
        const fr = sec.querySelector<HTMLElement>(".cs-hero__scale")!;
        const pic = sec.querySelector<HTMLElement>(".cs-hero__pic")!;
        const st = {
          trigger: fr,
          start: 0,
          end: "top 96px",
          scrub: 0.6,
          invalidateOnRefresh: true,
        };
        gsap.fromTo(
          fr,
          { scale: 0.92 },
          { scale: 1, ease: "none", scrollTrigger: st },
        );
        gsap.fromTo(
          pic,
          { scale: 1.08 },
          { scale: 1, ease: "none", scrollTrigger: { ...st } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="cs-hero" aria-label="The live site">
      <div className="wrap">
        {/* The caption scales with the frame, so it stays flush with the frame's left edge at every step. */}
        <figure className="cs-hero__fig cs-hero__scale">
          <div>
            <div className="cs-hero__frame wk-frame">
              <div className="wk-frame__bar" aria-hidden="true">
                <span className="wk-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="wk-frame__url mono">
                  <b>{domain}</b>
                  {path}
                </span>
              </div>
              <div className="cs-hero__body">
                <div className="cs-hero__pic">{children}</div>
              </div>
            </div>
          </div>
          <figcaption className="cs-hero__cap mono">{caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
