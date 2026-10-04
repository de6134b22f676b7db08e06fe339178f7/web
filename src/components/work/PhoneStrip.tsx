"use client";
/**
 * Phone strip (DESIGN.md 4.22, M35, M26). A native horizontal scroll-snap track (works for touch, keyboard,
 * trackpads and reduced motion) enhanced on fine pointers with motion: pointer drag with inertia
 * (velocity x 0.93 per frame) that snaps to the nearest phone (0.6s ws.out), and in-phone parallax.
 * ←/→ buttons, a progress bar, and the "Play" phone: pressing Play scrolls the whole
 * capture inside the phone over 7s. Any wheel, touch, pointer or key input inside the phone stops the tween, and
 * the phone scrolls natively, chaining to the page at its ends. In reduced motion the Play phone is simply scrollable.
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/motion/gsap";
import { E, MQ } from "@/motion/tokens";
import { Picture } from "@/components/Picture";
import { useMotion } from "@/motion/useMotion";
import type { Shot } from "@/content/work";

export function PhoneStrip({ slug, client, phones }: { slug: string; client: string; phones: { shot: Shot; label: string; play?: boolean }[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const playScr = useRef<HTMLDivElement>(null);
  const playTween = useRef<gsap.core.Tween | null>(null);
  const [edge, setEdge] = useState<"none" | "start" | "mid" | "end">("start");
  const [playing, setPlaying] = useState(false);
  // The Play phone only earns its button when its capture actually overflows the screen.
  const [canPlay, setCanPlay] = useState(true);
  const { reduced } = useMotion();

  // Progress + edge state from the native scroll position (all modes).
  useEffect(() => {
    const t = track.current;
    const r = root.current;
    if (!t || !r) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = t.scrollWidth - t.clientWidth;
      const p = max > 0 ? t.scrollLeft / max : 1;
      const vis = t.clientWidth / t.scrollWidth;
      r.style.setProperty("--p", String(vis + (1 - vis) * p));
      // No overflow: nothing to scroll, so no arrows, progress or drag cursor.
      setEdge(max <= 2 ? "none" : t.scrollLeft <= 2 ? "start" : t.scrollLeft >= max - 2 ? "end" : "mid");
      const s = playScr.current;
      setCanPlay(!s || s.scrollHeight - s.clientHeight > 2);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    t.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      t.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  const items = () => Array.from(track.current?.querySelectorAll<HTMLElement>(".cs-strip__item") ?? []);
  const targetOf = (el: HTMLElement) => {
    const t = track.current!;
    return Math.min(t.scrollWidth - t.clientWidth, Math.max(0, el.offsetLeft - parseFloat(getComputedStyle(t).scrollPaddingLeft || "0")));
  };
  const nearest = () => {
    const t = track.current!;
    let best = 0;
    let d = Infinity;
    items().forEach((el, i) => {
      const dd = Math.abs(targetOf(el) - t.scrollLeft);
      if (dd < d) {
        d = dd;
        best = i;
      }
    });
    return best;
  };
  const goTo = useCallback(
    (i: number) => {
      const t = track.current;
      const list = items();
      if (!t || !list.length) return;
      const el = list[Math.max(0, Math.min(list.length - 1, i))];
      const x = targetOf(el);
      if (reduced) {
        t.scrollLeft = x;
        return;
      }
      t.setAttribute("data-dragging", "");
      gsap.to(t, { scrollLeft: x, duration: 0.6, ease: E.out, overwrite: true, onComplete: () => t.removeAttribute("data-dragging") });
    },
    [reduced],
  );

  const stopPlay = useCallback(() => {
    playTween.current?.pause();
    setPlaying(false);
  }, []);
  const startPlay = useCallback(() => {
    const s = playScr.current;
    if (!s) return;
    const max = s.scrollHeight - s.clientHeight;
    if (max <= 2) return;
    if (reduced) {
      s.focus();
      return;
    }
    if (s.scrollTop >= max - 2) s.scrollTop = 0;
    playTween.current?.kill();
    const remaining = 1 - s.scrollTop / Math.max(1, max);
    playTween.current = gsap.to(s, { scrollTop: max, duration: 7 * remaining, ease: "none", onComplete: () => setPlaying(false) });
    setPlaying(true);
  }, [reduced]);

  // Drag with inertia + snap; parallax (fine pointer + motion).
  useGSAP(
    () => {
      const t = track.current;
      const r = root.current;
      if (!t || !r) return;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.motion} and ${MQ.fine}`, () => {
        let down = false;
        let startX = 0;
        let startL = 0;
        let lastX = 0;
        let lastT = 0;
        let v = 0;
        let raf = 0;
        let moved = false;
        const snap = () => {
          const i = nearest();
          gsap.to(t, { scrollLeft: targetOf(items()[i]), duration: 0.6, ease: E.out, overwrite: true, onComplete: () => t.removeAttribute("data-dragging") });
        };
        const glide = () => {
          v *= 0.93;
          t.scrollLeft -= v;
          if (Math.abs(v) > 0.4) raf = requestAnimationFrame(glide);
          else snap();
        };
        const pd = (e: PointerEvent) => {
          if (e.pointerType !== "mouse" || e.button !== 0) return;
          if ((e.target as Element).closest(".cs-phone__scr--play")) return; // let the Play phone scroll itself
          down = true;
          moved = false;
          cancelAnimationFrame(raf);
          gsap.killTweensOf(t);
          startX = lastX = e.clientX;
          startL = t.scrollLeft;
          lastT = performance.now();
          v = 0;
        };
        const pm = (e: PointerEvent) => {
          if (!down) return;
          const dx = e.clientX - startX;
          if (!moved && Math.abs(dx) > 4) {
            moved = true;
            t.setAttribute("data-dragging", "");
            t.setPointerCapture(e.pointerId);
          }
          if (!moved) return;
          const now = performance.now();
          const dt = Math.max(8, now - lastT);
          v = ((e.clientX - lastX) / dt) * 16;
          lastX = e.clientX;
          lastT = now;
          t.scrollLeft = startL - dx;
        };
        const pu = (e: PointerEvent) => {
          if (!down) return;
          down = false;
          if (t.hasPointerCapture(e.pointerId)) t.releasePointerCapture(e.pointerId);
          if (moved) raf = requestAnimationFrame(glide);
        };
        t.addEventListener("pointerdown", pd);
        t.addEventListener("pointermove", pm);
        t.addEventListener("pointerup", pu);
        t.addEventListener("pointercancel", pu);

        // M26: phone screens drift inside their frames as the strip passes through the viewport.
        gsap.utils.toArray<HTMLElement>(r.querySelectorAll(".cs-phone__par")).forEach((p) => {
          gsap.fromTo(p, { yPercent: 0 }, { yPercent: -4, ease: "none", scrollTrigger: { trigger: r, start: "top bottom", end: "bottom top", scrub: true } });
        });
        return () => {
          cancelAnimationFrame(raf);
          // snap()/goTo() tweens start from rAF/pointer callbacks, outside the context: kill any in flight.
          gsap.killTweensOf(t);
          t.removeEventListener("pointerdown", pd);
          t.removeEventListener("pointermove", pm);
          t.removeEventListener("pointerup", pu);
          t.removeEventListener("pointercancel", pu);
          t.removeAttribute("data-dragging");
        };
      });
    },
    { scope: root },
  );

  useEffect(() => {
    const t = track.current;
    return () => {
      playTween.current?.kill();
      if (t) gsap.killTweensOf(t);
    };
  }, []);

  // The visitor's own input inside the Play phone always wins over the autoplay tween.
  useEffect(() => {
    const s = playScr.current;
    if (!s) return;
    const stop = () => {
      if (!playTween.current?.isActive()) return;
      playTween.current.kill();
      playTween.current = null;
      setPlaying(false);
    };
    const evs = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    evs.forEach((t) => s.addEventListener(t, stop, { passive: true }));
    return () => evs.forEach((t) => s.removeEventListener(t, stop));
  }, []);

  const playIndex = phones.findIndex((p) => p.play);
  return (
    <div ref={root} className="cs-strip" style={{ "--p": 0.25 } as CSSProperties}>
      <div
        ref={track}
        id="cs-strip-track"
        className="cs-strip__track"
        role="region"
        aria-label={`${client} on a phone`}
        tabIndex={edge === "none" ? undefined : 0}
        data-cursor={edge === "none" ? undefined : "Drag"}
      >
        {phones.map((p, i) => (
          <figure
            key={p.shot.file}
            className="cs-strip__item"
          >
            <div className="cs-phone">
              {p.play ? (
                <div ref={playScr} className="cs-phone__scr cs-phone__scr--play" tabIndex={0} aria-label={`${p.label}, scrollable`} role="group" data-lenis-prevent="">
                  <Picture slug={slug} shot={p.shot} sizes="phone" />
                </div>
              ) : (
                <div className="cs-phone__scr">
                  <div className="cs-phone__par">
                    <Picture slug={slug} shot={p.shot} sizes="phone" />
                  </div>
                </div>
              )}
            </div>
            <figcaption className="cs-strip__lbl mono">
              <span>
                <b>{String(i + 1).padStart(2, "0")}</b> {p.label}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="cs-strip__ctrl" data-edge={edge}>
        <button type="button" className="cs-strip__btn" aria-controls="cs-strip-track" aria-label="Previous phone" disabled={edge === "start"} onClick={() => goTo(nearest() - 1)}>
          ←
        </button>
        <button type="button" className="cs-strip__btn" aria-controls="cs-strip-track" aria-label="Next phone" disabled={edge === "end"} onClick={() => goTo(nearest() + 1)}>
          →
        </button>
        <span className="cs-strip__prog" aria-hidden="true">
          <i />
        </span>
        {playIndex >= 0 && canPlay ? (
          <button
            type="button"
            className="cs-strip__play"
            onClick={() => {
              if (playing) return stopPlay();
              goTo(playIndex);
              startPlay();
            }}
          >
            <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
            {playing ? "Pause" : "Play"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
