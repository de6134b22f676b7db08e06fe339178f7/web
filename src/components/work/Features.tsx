"use client";
/**
 * What we built (DESIGN.md 4.19). Both islands render in the static HTML from the same data; CSS shows
 * FeatureFrame at >= 1024 with motion and FeatureIndex otherwise (so no-JS and reduced motion are complete).
 *
 * FeatureFrame (M31): feature articles (cols 1-4) beside a sticky browser frame (cols 5-12, top 14vh, 72vh).
 * Entering an article (top 55%) makes it active: the capture swaps with a directional clip wipe + 1.12 -> 1
 * zoom, the URL path and caption roll (out, then in), the progress bar fills to n/5. The only NN / 05 is the
 * article's own (left column). Inside each article the full-page capture
 * scrolls from scroll[0] to scroll[1] (fractions of its height, clamped so the window never passes the bottom).
 *
 * FeatureIndex (M32): accordion, one open at a time, first open by default; each panel shows a 4:3 window at
 * the top of the capture (scroll[0]) and a big NN/05 counter that rolls to the open row.
 */
import { useRef, useState, type CSSProperties } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/motion/gsap";
import { E, MQ } from "@/motion/tokens";
import { Picture } from "@/components/Picture";
import type { Shot } from "@/content/work";
import { useMotion } from "@/motion/useMotion";
import { RollText } from "./RollText";

/** Fixed header height + air (matches the anchor offset). */
const HEADER_CLEAR = 96;

export type FeatureView = { no: string; title: string; body: string; shot: Shot; path: string; scroll: [number, number]; indexAt?: number; caption: string };

type Props = { slug: string; domain: string; features: FeatureView[] };

export function FeatureFrame({ slug, domain, features }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const total = String(features.length).padStart(2, "0");

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.motion} and ${MQ.desk}`, () => {
        el.setAttribute("data-ready", "");
        const arts = Array.from(el.querySelectorAll<HTMLElement>(".cs-ff__art"));
        const layers = Array.from(el.querySelectorAll<HTMLElement>(".cs-frame__layer"));
        const body = el.querySelector<HTMLElement>(".cs-frame__body")!;
        let cur = 0;
        arts.forEach((a, k) => (k === 0 ? a.setAttribute("data-on", "") : a.removeAttribute("data-on")));

        const activate = (i: number, dir: number) => {
          if (i === cur) return;
          const prev = cur;
          cur = i;
          setActive(i);
          arts.forEach((a, k) => (k === i ? a.setAttribute("data-on", "") : a.removeAttribute("data-on")));
          const layer = layers[i];
          layers.forEach((l, k) => (l.style.zIndex = k === i ? "3" : k === prev ? "2" : "1"));
          layer.setAttribute("data-on", "");
          // Interrupt any running wipe on this layer, then start fresh (no context bookkeeping: the cleanup below
          // kills tweens on every layer and clears their props, so nothing accumulates across toggles).
          gsap.killTweensOf([layer, layer.firstElementChild]);
          gsap.fromTo(
            layer,
            { clipPath: dir > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.9,
              ease: E.hand,
              onComplete: () => layers.forEach((l, k) => k !== cur && l.removeAttribute("data-on")),
            },
          );
          gsap.fromTo(layer.firstElementChild, { scale: 1.12 }, { scale: 1, duration: 0.9, ease: E.hand });
        };

        arts.forEach((art, i) => {
          ScrollTrigger.create({
            trigger: art,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && activate(i, self.direction),
          });
          // Scrubbed scroll of the capture inside the frame, clamped so the window never passes the bottom.
          const sc = layers[i].querySelector<HTMLElement>(".cs-frame__scroll");
          if (!sc) return;
          const [a, b] = features[i].scroll;
          const px = (f: number) => -Math.min(f * sc.offsetHeight, Math.max(0, sc.offsetHeight - body.clientHeight));
          gsap.fromTo(
            sc,
            { y: () => px(a) },
            { y: () => px(b), ease: "none", scrollTrigger: { trigger: art, start: "top 55%", end: "bottom 45%", scrub: 0.8, invalidateOnRefresh: true } },
          );
        });
        return () => {
          el.removeAttribute("data-ready");
          setActive(0);
          gsap.killTweensOf([...layers, ...layers.map((l) => l.firstElementChild)]);
          layers.forEach((l) => {
            gsap.set(l, { clearProps: "clipPath" });
            if (l.firstElementChild) gsap.set(l.firstElementChild, { clearProps: "scale,transform" });
          });
          arts.forEach((a, k) => (k === 0 ? a.setAttribute("data-on", "") : a.removeAttribute("data-on")));
          layers.forEach((l, k) => {
            l.style.zIndex = k === 0 ? "3" : "1";
            if (k === 0) l.setAttribute("data-on", "");
            else l.removeAttribute("data-on");
          });
        };
      });
    },
    { scope: root, dependencies: [features] },
  );

  const f = features[active];
  return (
    <div ref={root} className="cs-ff">
      <div className="cs-ff__list">
        {features.map((ft, i) => (
          <article key={ft.no} className="cs-ff__art" data-on={i === 0 ? "" : undefined} aria-labelledby={`ff-${ft.no}`}>
            <p className="cs-ff__no">
              {ft.no} <span>/ {total}</span>
            </p>
            <h3 id={`ff-${ft.no}`} className="cs-ff__title t-h3">
              {ft.title}
            </h3>
            <p className="cs-ff__body">{ft.body}</p>
          </article>
        ))}
      </div>
      <div className="cs-ff__side">
        <div className="cs-ff__sticky">
          <div className="cs-frame">
            <div className="cs-frame__bar" aria-hidden="true">
              <span className="cs-frame__dots">
                <i />
                <i />
                <i />
              </span>
              <span className="cs-frame__url">
                <b>{domain}</b>
                <RollText value={f.path} />
              </span>
              <span className="cs-frame__prog" style={{ "--p": (active + 1) / features.length } as CSSProperties} />
            </div>
            <div className="cs-frame__body">
              {features.map((ft, i) => (
                <div key={ft.no} className="cs-frame__layer" data-on={i === 0 ? "" : undefined} style={{ zIndex: i === 0 ? 3 : 1 }}>
                  <div className="cs-frame__zoom">
                    <div className="cs-frame__scroll">
                      <Picture slug={slug} shot={ft.shot} sizes="featureFrame" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="cs-ff__cap mono" aria-hidden="true">
            <RollText value={f.caption} />
          </p>
        </div>
      </div>
    </div>
  );
}

/** object-position Y (%) that puts the top of a 4:3 cover window at fraction `s` of the capture height. */
function windowY(shot: Shot, s: number) {
  const r = shot.height / shot.width;
  const box = 0.75;
  if (r <= box || s <= 0) return 0;
  return Math.min(100, ((s * r) / (r - box)) * 100);
}

export function FeatureIndex({ slug, features }: Omit<Props, "domain">) {
  const [open, setOpen] = useState<number | null>(0);
  const [shown, setShown] = useState(0);
  const { scrollTo } = useMotion();
  const list = useRef<HTMLUListElement>(null);

  /** Opening a row below the open one collapses that panel; keep the tapped row's header in view. */
  const toggle = (i: number, on: boolean) => {
    const items = list.current?.children;
    if (!on && items && open !== null && open < i) {
      const above = items[open].querySelector<HTMLElement>(".cs-fi__inner");
      const h = above?.offsetHeight ?? 0;
      const top = items[i].getBoundingClientRect().top + window.scrollY - h;
      if (top - window.scrollY < HEADER_CLEAR) scrollTo(Math.max(0, top - HEADER_CLEAR));
    }
    setOpen(on ? null : i);
    if (!on) setShown(i);
  };
  const total = String(features.length).padStart(2, "0");
  return (
    <div className="cs-fi">
      <div className="cs-fi__top" aria-hidden="true">
        <span className="cs-fi__big">
          <RollText value={features[shown].no} />
          <small>/ {total}</small>
        </span>
      </div>
      <ul ref={list} className="cs-fi__list">
        {features.map((ft, i) => {
          const on = open === i;
          return (
            <li key={ft.no} className="cs-fi__item" data-open={on ? "" : undefined}>
              <h3>
                <button
                  type="button"
                  className="cs-fi__btn"
                  aria-expanded={on}
                  aria-controls={`fi-${ft.no}`}
                  id={`fi-b-${ft.no}`}
                  onClick={() => toggle(i, on)}
                >
                  <span className="cs-fi__no">{ft.no}</span>
                  <span className="cs-fi__t">{ft.title}</span>
                  <span className="cs-fi__pm" aria-hidden="true" />
                </button>
              </h3>
              <div className="cs-fi__panel" id={`fi-${ft.no}`} role="region" aria-labelledby={`fi-b-${ft.no}`}>
                <div className="cs-fi__inner">
                  <p className="cs-fi__body">{ft.body}</p>
                  <div className="cs-fi__shot" style={{ "--op": `${windowY(ft.shot, ft.indexAt ?? ft.scroll[0]).toFixed(2)}%` } as CSSProperties}>
                    <Picture slug={slug} shot={ft.shot} sizes="featureFrame" />
                  </div>
                  <p className="cs-fi__cap">{ft.caption}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
