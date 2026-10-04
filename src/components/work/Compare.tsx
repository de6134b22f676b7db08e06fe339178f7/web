"use client";
/**
 * Before / now compare (DESIGN.md 4.18, M30). A real <input type="range"> (0-100) sets --pos: the 2019 site sits
 * on the left of the handle, the new site on the right (clip `inset(0 0 0 var(--pos))`). The range value is the
 * handle position, so aria-valuetext reports what is actually visible: `${100 - pos}% new site`.
 * First time >= 60% in view (motion only): one sweep 50 -> 78 -> 30 -> 50. Drag, click or arrow keys always work.
 * Coarse pointers: the range ignores touch (CSS), so a vertical page swipe over the frame never moves the handle.
 * The frame takes over with a horizontal-intent gate: drag only once |dx| > 8 and |dx| > |dy|; a tap jumps there.
 * The range stays for keyboard and screen readers.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP } from "@/motion/gsap";
import { E, MQ } from "@/motion/tokens";

export function Compare({ before, now, labels }: { before: ReactNode; now: ReactNode; labels: [string, string] }) {
  const root = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const touched = useRef(false);
  const stopSweep = useRef<() => void>(() => {});

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const frame = el.querySelector<HTMLElement>(".cs-cmp__frame")!;
        const proxy = { v: 50 };
        // React owns --pos (inline style from `pos`); the sweep only drives state, so a stop mid-sweep leaves
        // the visual, the range value and aria-valuetext in agreement.
        const apply = () => {
          if (touched.current) return;
          setPos(Math.round(proxy.v));
        };
        const tl = gsap.timeline({
          paused: true,
          defaults: { duration: 0.9, ease: E.hand, onUpdate: apply },
        });
        tl.to(proxy, { v: 78 }).to(proxy, { v: 30 }).to(proxy, { v: 50 });
        const io = new IntersectionObserver(
          ([e]) => {
            if (e.isIntersecting && e.intersectionRatio >= 0.6) {
              io.disconnect();
              if (!touched.current) tl.play();
            }
          },
          { threshold: [0.6] },
        );
        io.observe(frame);
        const stop = () => {
          touched.current = true;
          tl.kill();
        };
        stopSweep.current = stop;
        // Touch: a scroll swipe starting on the frame must not cancel the sweep; the touch gate calls stop on a real drag.
        const down = (e: PointerEvent) => e.pointerType === "mouse" && stop();
        frame.addEventListener("pointerdown", down);
        frame.addEventListener("keydown", stop, { once: true });
        return () => {
          io.disconnect();
          stopSweep.current = () => {};
          frame.removeEventListener("pointerdown", down);
          frame.removeEventListener("keydown", stop);
        };
      });
    },
    { scope: root },
  );

  // Coarse-pointer drag with a horizontal-intent gate (see header).
  useEffect(() => {
    const frame = root.current?.querySelector<HTMLElement>(".cs-cmp__frame");
    if (!frame) return;
    const coarse = window.matchMedia("(pointer: coarse)");
    let id = -1;
    let x0 = 0;
    let y0 = 0;
    let drag = false;
    let dead = false;
    const at = (x: number) => {
      const r = frame.getBoundingClientRect();
      touched.current = true;
      stopSweep.current();
      setPos(Math.round(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100))));
    };
    const pd = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || !coarse.matches) return;
      id = e.pointerId;
      x0 = e.clientX;
      y0 = e.clientY;
      drag = false;
      dead = false;
    };
    const pm = (e: PointerEvent) => {
      if (e.pointerId !== id || dead) return;
      const dx = Math.abs(e.clientX - x0);
      const dy = Math.abs(e.clientY - y0);
      if (!drag) {
        if (dy > 8 && dy >= dx) {
          dead = true; // vertical wins: the page scrolls
          return;
        }
        if (dx > 8 && dx > dy) {
          drag = true;
          frame.setPointerCapture(e.pointerId);
        } else return;
      }
      at(e.clientX);
    };
    const pu = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      if (!drag && !dead && e.type === "pointerup") at(e.clientX);
      if (frame.hasPointerCapture(e.pointerId)) frame.releasePointerCapture(e.pointerId);
      id = -1;
    };
    frame.addEventListener("pointerdown", pd);
    frame.addEventListener("pointermove", pm);
    frame.addEventListener("pointerup", pu);
    frame.addEventListener("pointercancel", pu);
    return () => {
      frame.removeEventListener("pointerdown", pd);
      frame.removeEventListener("pointermove", pm);
      frame.removeEventListener("pointerup", pu);
      frame.removeEventListener("pointercancel", pu);
    };
  }, []);

  const beforeOn = pos > 50;
  return (
    <div ref={root} className="cs-cmp">
      <div className="cs-cmp__frame" data-cursor="Drag" style={{ "--pos": `${pos}%`, "--pn": pos } as React.CSSProperties}>
        {before}
        <div className="cs-cmp__now">{now}</div>
        {/* One set of labels: short chips on the frame (the side in view is Ink); the full labels are the captions below. */}
        <span className="cs-cmp__chip cs-cmp__chip--l mono" data-on={beforeOn ? "" : undefined} aria-hidden="true">
          {short(labels[0])}
        </span>
        <span className="cs-cmp__chip cs-cmp__chip--r mono" data-on={!beforeOn ? "" : undefined} aria-hidden="true">
          {short(labels[1])}
        </span>
        <div className="cs-cmp__handle" aria-hidden="true">
          <span className="cs-cmp__knob">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 7 L4 12 L9 17 Z M15 7 L20 12 L15 17 Z" fill="currentColor" />
            </svg>
          </span>
        </div>
        <input
          className="cs-cmp__range"
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          data-cursor="Drag"
          aria-label="Compare the 2019 site with the new site"
          aria-valuetext={`${100 - pos}% new site`}
          onChange={(e) => {
            touched.current = true;
            setPos(Number(e.currentTarget.value));
          }}
        />
      </div>
    </div>
  );
}

/** "Before · 2019 Wix site" -> "Before". */
function short(text: string) {
  const i = text.indexOf(" · ");
  return i < 0 ? text : text.slice(0, i);
}
