"use client";
/**
 * PlayHQ sync line (M23, W1b). A 2px Flag line draws PlayHQ → Sync → Site on a scroll scrub (start top 70%,
 * end bottom 60%, scrub .6): horizontal, a 45° drop, horizontal. Line and node columns share one grid (home.css
 * "05 PLAYHQ"): each node dot sits on its column's left edge, the four stations (Fixtures · Results · Ladders ·
 * Club logos) sit between node 2 and node 3 and the line ends at node 3. Nodes and stations light as the line
 * reaches them (station thresholds are measured from the layout on every ScrollTrigger refresh). Under 760 the path is vertical with
 * labels in flow. No JS / reduced motion: fully drawn, all lit (`--p: 1` is the CSS default).
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/motion/gsap";
import { MQ } from "@/motion/tokens";
import { SYNC_NODES, SYNC_STATIONS } from "./data";

/** Progress map (mirrors home.css): upper run 0–.32, drop .32–.42, lower run .42–1. */
const NODE_AT = [0.01, 0.42, 0.995];
const LOW = 0.42;

export function SyncLine() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const nodes = Array.from(el.querySelectorAll<HTMLElement>(".sl-node"));
      const stations = Array.from(el.querySelectorAll<HTMLElement>(".sl-st"));
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const lower = el.querySelector<HTMLElement>(".sl-b");
        let stAt = [0.54, 0.65, 0.77, 0.88];
        const measure = () => {
          if (!lower) return;
          const prev = lower.style.transform;
          lower.style.transform = "none";
          const b = lower.getBoundingClientRect();
          lower.style.transform = prev;
          if (b.width < 1) return;
          stAt = stations.map((s) => {
            const d = s.querySelector<HTMLElement>(".sl-dot")?.getBoundingClientRect();
            if (!d) return 1;
            const rel = (d.left + d.width / 2 - b.left) / b.width;
            return LOW + (1 - LOW) * Math.min(1, Math.max(0, rel));
          });
        };
        const light = (p: number) => {
          nodes.forEach((n, i) => n.classList.toggle("is-lit", p >= NODE_AT[i]));
          stations.forEach((s, i) => s.classList.toggle("is-lit", p >= stAt[i]));
        };
        const o = { p: 0 };
        el.style.setProperty("--p", "0");
        measure();
        light(0);
        gsap.to(o, {
          p: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 60%", scrub: 0.6, onRefresh: measure },
          onUpdate: () => {
            el.style.setProperty("--p", o.p.toFixed(4));
            light(o.p);
          },
        });
        return () => {
          el.style.removeProperty("--p");
          nodes.concat(stations).forEach((n) => n.classList.add("is-lit"));
        };
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="sl" data-cursor="Sync">
      <div className="sl-line" aria-hidden="true">
        <i className="sl-a" />
        <svg className="sl-d" viewBox="0 0 48 48" focusable="false">
          <path className="sl-d-bg" d="M0 1L47 48" />
          <path className="sl-d-fg" d="M0 1L47 48" pathLength={1} />
        </svg>
        <i className="sl-b" />
      </div>
      {SYNC_NODES.map((n, i) => (
        <div key={n.t} className={`sl-node sl-node-${i} is-lit`}>
          <p className="mono sl-k">{n.k}</p>
          <h3 className="sl-t t-h3">{n.t}</h3>
          <p className="sl-p">{n.d}</p>
        </div>
      ))}
      <ul className="sl-sts" aria-label="Synced from PlayHQ">
        {SYNC_STATIONS.map((s) => (
          <li key={s} className="sl-st is-lit">
            <span className="sl-dot" aria-hidden="true" />
            <span className="mono">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
