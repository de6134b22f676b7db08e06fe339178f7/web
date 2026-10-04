"use client";
/**
 * Work row (DESIGN.md v4 §6.2, M37) as a feature row: the whole row is one link.
 * Desktop (>= 1024, 12 columns): number in column 1; name, kind, tags and "Case study →" in columns 2–6; a
 * framed 16:10 capture (browser chrome, mono URL) in columns 7–12. The list head uses the same tracks.
 * - Hover / focus (CSS): the name shifts and glides weight 600 -> 720, a pennant is planted before it, a 2px Flag
 *   rule draws along the row's foot (hand), the arrow turns -45deg to Flag, the capture settles from 1.06 to 1.02.
 * - Fine pointer + motion + >= 1024: the capture drifts against the pointer (±12px across, 0 to −9px up, .8s power3), so the
 *   frame reads as a window onto the page.
 * - Touch / reduced motion: static capture, full width under the text below 1024.
 */
import Link from "@/components/IntentLink";
import { useRef } from "react";
import { gsap, useGSAP } from "@/motion/gsap";
import { E, MQ } from "@/motion/tokens";
import { Picture } from "@/components/Picture";
import { DotList } from "@/components/DotList";
import type { Shot } from "@/content/work";

export type WorkRowProps = {
  no: string;
  href: string;
  name: string;
  kind: string;
  meta?: string[];
  slug: string;
  shot: Shot;
  /** Browser-chrome URL text above the capture. */
  domain: string;
  /** First row: its capture is the desktop LCP, so it loads eagerly (no preload: on phones it is below the fold). */
  eager?: boolean;
};

export function WorkRow({ no, href, name, kind, meta, slug, shot, domain, eager = false }: WorkRowProps) {
  const root = useRef<HTMLLIElement>(null);

  useGSAP(
    () => {
      const row = root.current;
      if (!row) return;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.motion} and ${MQ.fine} and ${MQ.desk}`, () => {
        const link = row.querySelector<HTMLAnchorElement>(".wk-row__a")!;
        const frame = row.querySelector<HTMLElement>(".wk-row__shot")!;
        const img = row.querySelector<HTMLElement>(".wk-row__pic")!;
        const qx = gsap.quickTo(img, "x", { duration: 0.8, ease: E.soft });
        const qy = gsap.quickTo(img, "y", { duration: 0.8, ease: E.soft });
        const move = (e: PointerEvent) => {
          if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
          const b = frame.getBoundingClientRect();
          const rx = gsap.utils.clamp(-1, 1, ((e.clientX - b.left) / b.width) * 2 - 1);
          const ry = gsap.utils.clamp(-1, 1, ((e.clientY - b.top) / b.height) * 2 - 1);
          qx(rx * -12);
          // Upward only (0 to -9px): the top edge has no slack.
          qy((ry + 1) * -4.5);
        };
        const leave = () => {
          qx(0);
          qy(0);
        };
        link.addEventListener("pointermove", move, { passive: true });
        link.addEventListener("pointerleave", leave);
        return () => {
          link.removeEventListener("pointermove", move);
          link.removeEventListener("pointerleave", leave);
          gsap.killTweensOf(img);
          gsap.set(img, { clearProps: "x,y" });
        };
      });
    },
    { scope: root },
  );

  return (
    <li ref={root} className="wk-row">
      <Link href={href} className="wk-row__a">
        <span className="wk-row__no mono">{no}</span>
        <span className="wk-row__main">
          <span className="wk-row__name t-h2">
            <span className="wk-row__pen" aria-hidden="true" />
            <span className="wk-row__nt">{name}</span>
          </span>
          <span className="wk-row__kind mono">{kind}</span>
          {meta?.length ? <DotList items={meta} className="wk-row__meta mono" /> : null}
          <span className="wk-row__go">
            <span className="wk-row__cta mono">Case study</span>
            <svg className="wk-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </span>
        </span>
        <span className="wk-row__shot wk-frame">
          <span className="wk-frame__bar" aria-hidden="true">
            <span className="wk-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="wk-frame__url mono">{domain}</span>
          </span>
          <span className="wk-row__body">
            <span className="wk-row__pic">
              <Picture slug={slug} shot={shot} sizes="workFeature" eager={eager} />
            </span>
          </span>
        </span>
        <span className="wk-row__rule" aria-hidden="true" />
      </Link>
    </li>
  );
}
