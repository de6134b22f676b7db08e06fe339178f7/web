"use client";
/** Component wrappers for the reveal hooks (src/motion/useReveal.ts). Markup is identical on server and client. */
import { useRef, type ElementType, type ReactNode } from "react";
import { useClipReveal, useRise, useSplitReveal, type ClipRevealOpts, type RiseOpts, type SplitRevealOpts } from "@/motion/useReveal";

type Base = { as?: ElementType; className?: string; id?: string; children: ReactNode };

/**
 * M12 split-line heading. `<SplitHeading as="h2" className="t-h2">Specialists in club sport. <em>Designers…</em></SplitHeading>`
 * Lines rise from 108% inside masks, 1.05s expo, 80ms per line, once at 15% in view. Static children only.
 * The element gets aria-label = its text; the generated lines are aria-hidden.
 */
export function SplitHeading({ as: Tag = "h2", className, id, children, threshold }: Base & SplitRevealOpts) {
  const ref = useRef<HTMLElement>(null);
  useSplitReveal(ref, { threshold });
  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}

/** Frame clip-up reveal. Put `data-reveal-inner` on the element that should de-scale (defaults to the first img). */
export function ClipReveal({ as: Tag = "div", className, id, children, ...opts }: Base & ClipRevealOpts) {
  const ref = useRef<HTMLElement>(null);
  useClipReveal(ref, opts);
  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}

/** Upward group rise of direct children (or `selector`). */
export function Rise({ as: Tag = "div", className, id, children, ...opts }: Base & RiseOpts) {
  const ref = useRef<HTMLElement>(null);
  useRise(ref, opts);
  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
