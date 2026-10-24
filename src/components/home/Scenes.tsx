"use client";
import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, reduced } from "@/lib/motion";
import { Rail } from "@/components/Rail";

export type Scene = { title: string; body: string; kind: "desk" | "phone"; screen: ReactNode };

/**
 * 01 "Everything the season needs" (DESIGN.md §4.3). The rail and the h2 live inside the pinned frame. At >= 900px
 * wide and >= 720px tall the section pins for 300% (5 x 60vh): the list of five sits left, one device stays right and
 * its screen changes as the scroll moves through the five; the active row's body opens (grid-template-rows 0fr -> 1fr).
 * Otherwise (narrow, short, reduced motion, no JS) every item simply shows its own screen under its copy
 * (`.scene-own`), and the stage is hidden. Both renderings exist in the DOM; the stage is aria-hidden.
 */
const PIN = "(min-width: 900px) and (min-height: 720px)";

export function Scenes({ scenes }: { scenes: Scene[] }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced()) return;
      const mm = gsap.matchMedia();
      mm.add(PIN, () => {
        const items = gsap.utils.toArray<HTMLElement>(".scene-item", el);
        const shots = gsap.utils.toArray<HTMLElement>(".scene-shot", el);
        const n = items.length;
        const set = (i: number) => {
          items.forEach((it, k) => it.setAttribute("data-on", k === i ? "1" : "0"));
          shots.forEach((s, k) => s.setAttribute("data-on", k === i ? "1" : "0"));
        };
        set(0);
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "+=300%",
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => set(Math.min(n - 1, Math.floor(self.progress * n))),
        });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <section ref={ref} className="scenes" aria-labelledby="do-h">
      <div className="wrap scenes-wrap">
        <Rail index="01" name="What a club site should do" note="Five screens · one platform" />
        <h2 id="do-h" className="h2 scenes-h">
          Everything the season needs<span className="accent">.</span>
        </h2>
        <div className="scenes-in">
          <ol className="scene-list">
            {scenes.map((s, i) => (
              <li key={s.title} className="scene-item" data-on={i === 0 ? "1" : "0"}>
                <div className="scene-row">
                  <span className="index scene-i">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="h3 scene-t">{s.title}</h3>
                </div>
                <div className="scene-bw">
                  <div className="scene-bi">
                    <p className="scene-b">{s.body}</p>
                  </div>
                </div>
                <div className={`scene-own scene-${s.kind}`} aria-hidden="true">
                  {s.screen}
                </div>
              </li>
            ))}
          </ol>
          <div className="scene-stage" aria-hidden="true">
            {scenes.map((s, i) => (
              <div key={s.title} className={`scene-shot scene-${s.kind}`} data-on={i === 0 ? "1" : "0"}>
                {s.screen}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
