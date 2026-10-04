"use client";
/**
 * Cursor system (DESIGN.md v4 §4.5). Only on (hover:hover) and (pointer:fine) without reduced motion
 * (CSS shows it under html.has-cursor, set by MotionProvider). aria-hidden; the system cursor always stays.
 * - Dot: 8px Ink (white inside `.is-ink`), quickTo .18s power3.out.
 * - Over links, buttons, [role=tab|radio|switch|button|checkbox], inputs, .btn, and a magnetic button's +24px zone
 *   (the button slides under a still pointer): the dot becomes a 28px ring and
 *   the tag hides. Press: ring scales to .85 for 120ms.
 * - Over `[data-cursor="Label"]` regions (not on a control): a flag-shaped tag at +16,+18 from the pointer; if that
 *   box would cover text or a control it flips to the top-left of the pointer, else it hides (W5)
 *   (.35s power3.out), scale .6 -> 1 + rotate -8deg -> 0 over .45s expo.
 * - Over giant type (`.sport-name, .kit-t, .cta-h, [data-cursor-hide]`): the dot hides; the tag still shows
 *   if an ancestor carries data-cursor (it sits offset, so it never covers letters).
 */
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/motion/gsap";
import { useMotion } from "@/motion/useMotion";
import { E } from "@/motion/tokens";

const CONTROL = ".magnetic, a[href], button, [role=tab], [role=radio], [role=switch], [role=button], [role=checkbox], input, select, textarea, label, .btn, summary";
const GIANT = ".sport-name, .kit-t, .cta-h, [data-cursor-hide]";

export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const tagPos = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLSpanElement>(null);
  const { reduced, fine } = useMotion();
  const pathname = usePathname();
  const recheck = useRef<() => void>(() => {});

  // A click navigation swaps the DOM under a still pointer: re-resolve against the new page.
  useEffect(() => {
    recheck.current();
  }, [pathname]);

  useEffect(() => {
    if (reduced || !fine) return;
    const el = root.current!;
    const o = { duration: 0.18, ease: E.soft };
    const t = { duration: 0.35, ease: E.soft };
    const dx = gsap.quickTo(dot.current, "x", o);
    const dy = gsap.quickTo(dot.current, "y", o);
    const tx = gsap.quickTo(tagPos.current, "x", t);
    const ty = gsap.quickTo(tagPos.current, "y", t);
    let shown = false;
    let pressT = 0;
    let lastTarget: Element | null = null;
    let lastX = -1;
    let lastY = -1;
    let raf = 0;
    let fitRaf = 0;
    let tagW = 0;

    // W5: the tag never covers type. Hit-test its default box (+16,+18) and, if it would sit on text or a
    // control, flip it to the top-left of the pointer; if that is covered too, hide it (the dot stays).
    const covers = (x0: number, y0: number) => {
      const pts: [number, number][] = [[x0 + 4, y0 + 11], [x0 + tagW / 2, y0 + 11], [x0 + tagW - 4, y0 + 11], [x0 + tagW / 2, y0 + 2], [x0 + tagW / 2, y0 + 20]];
      return pts.some(([x, y]) => {
        const hit = document.elementFromPoint(x, y);
        if (!hit) return false;
        if (hit.closest(CONTROL)) return true;
        for (const n of hit.childNodes) if (n.nodeType === 3 && n.textContent!.trim()) return true;
        return false;
      });
    };
    const fit = () => {
      fitRaf = 0;
      if (!el.classList.contains("has-tag") || lastX < 0) return;
      if (!tagW) tagW = tag.current?.offsetWidth ?? 0;
      const flip = covers(lastX + 16, lastY + 18);
      const off = flip && covers(lastX - 16 - tagW, lastY - 40);
      el.classList.toggle("tag-flip", flip && !off);
      el.classList.toggle("tag-off", off);
    };
    const scheduleFit = () => {
      if (!fitRaf) fitRaf = requestAnimationFrame(fit);
    };

    const resolve = (target: Element | null) => {
      if (target === lastTarget) return;
      lastTarget = target;
      // Giant type wins over its wrapping control (sport/kit rows are buttons): the ring must never sit on letters.
      const giant = target?.closest(GIANT);
      const control = !giant && target?.closest(CONTROL);
      const region = target?.closest<HTMLElement>("[data-cursor]");
      el.dataset.mode = control ? "ring" : giant ? "hide" : "dot";
      el.classList.toggle("on-ink", !!target?.closest(".is-ink"));
      const label = !control && region ? region.dataset.cursor : "";
      if (label) {
        if (tag.current && tag.current.textContent !== label) {
          tag.current.textContent = label;
          tagW = 0;
        }
        el.classList.add("has-tag");
      } else el.classList.remove("has-tag", "tag-flip", "tag-off");
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      if (!shown) {
        gsap.set([dot.current, tagPos.current], { x: e.clientX, y: e.clientY });
        shown = true;
      }
      el.classList.remove("is-out");
      dx(e.clientX);
      dy(e.clientY);
      tx(e.clientX);
      ty(e.clientY);
      lastX = e.clientX;
      lastY = e.clientY;
      resolve(e.target as Element | null);
      scheduleFit();
    };
    // Wheel-scrolling with a still pointer moves content under it without a pointermove: re-hit-test.
    const again = () => {
      if (!shown || lastX < 0) return;
      lastTarget = null;
      resolve(document.elementFromPoint(lastX, lastY));
      scheduleFit();
    };
    const scroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        again();
      });
    };
    recheck.current = () => requestAnimationFrame(again);
    const down = () => {
      el.classList.add("is-press");
      window.clearTimeout(pressT);
      pressT = window.setTimeout(() => el.classList.remove("is-press"), 120);
    };
    const leave = () => el.classList.add("is-out");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("scroll", scroll);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(fitRaf);
      recheck.current = () => {};
      document.documentElement.removeEventListener("pointerleave", leave);
      window.clearTimeout(pressT);
    };
  }, [reduced, fine]);

  return (
    <div ref={root} className="cursor is-out" data-mode="dot" aria-hidden="true">
      <div ref={tagPos} className="cur-pos">
        <span ref={tag} className="cur-tag" />
      </div>
      <div ref={dot} className="cur-pos">
        <div className="cur-dot" />
      </div>
    </div>
  );
}
