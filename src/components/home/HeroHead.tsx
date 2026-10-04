"use client";
/**
 * Hero H1 + sport roller (M2, M3, §5.2). The visible H1 is aria-hidden; a sibling .sr reads
 * "Websites and apps for clubs that play every sport." The three `.h-line`s are painted at first paint under
 * the loader (LCP, opacity 1) and rise on --intro (CSS). The roller is a grid stack of eight words, so its slot
 * is the widest word from the first paint (no CLS); characters exit up first (420ms hand, 12ms
 * stagger) and then enter from below (800ms expo from 320ms, 22ms stagger), every 2.3s. Only the shown and the
 * outgoing word are split into per-character spans (the rest are plain text that only holds the slot width).
 * It pauses offscreen, on hover/focus of the H1, while the tab is hidden, when the user presses Pause (2.2.2)
 * and while a kit sport is chosen (it locks to that sport).
 * Reduced motion: static "anything.".
 */
import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/motion/useMotion";
import { ROLLER } from "./data";
import { useHero, useKit } from "./SportContext";

const STEP = 2300;

export function HeroHead() {
  const { reduced } = useMotion();
  const { sport, bump } = useKit();
  const { setShown } = useHero();
  const [st, setSt] = useState({ cur: 0, prev: -1, n: 0 });
  const [userPaused, setUserPaused] = useState(false);
  const h1 = useRef<HTMLHeadingElement>(null);
  const hold = useRef({ visible: true, hover: false, ready: false });
  const locked = bump > 0 && sport !== "any";

  // Lock to the chosen kit sport (or rejoin the cycle on "Any"): derived during render, no effect.
  const [seenBump, setSeenBump] = useState(bump);
  if (seenBump !== bump) {
    setSeenBump(bump);
    const i = ROLLER.findIndex((r) => r.id === sport);
    if (i >= 0 && i !== st.cur) setSt({ cur: i, prev: st.cur, n: st.n + 1 });
  }

  useEffect(() => {
    setShown(ROLLER[st.cur].id);
  }, [st.cur, setShown]);

  // Visibility + hover/focus holds.
  useEffect(() => {
    const el = h1.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (hold.current.visible = e.isIntersecting));
    io.observe(el);
    const on = () => (hold.current.hover = true);
    const off = () => (hold.current.hover = false);
    el.addEventListener("pointerenter", on);
    el.addEventListener("pointerleave", off);
    // Wait for the intro (loader lift + H1 rise) before the first roll.
    const intro = document.documentElement.classList.contains("no-intro") || document.documentElement.classList.contains("navigated") ? 700 : 2300;
    const t = window.setTimeout(() => (hold.current.ready = true), intro);
    return () => {
      io.disconnect();
      el.removeEventListener("pointerenter", on);
      el.removeEventListener("pointerleave", off);
      window.clearTimeout(t);
    };
  }, []);

  const running = !reduced && !userPaused && !locked;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const h = hold.current;
      if (!h.ready || !h.visible || h.hover || document.hidden) return;
      setSt((s) => {
        const next = (s.cur + 1) % ROLLER.length;
        return { cur: next, prev: s.cur, n: s.n + 1 };
      });
    }, STEP);
    return () => window.clearInterval(id);
  }, [running]);

  const shownIdx = reduced && !locked ? 0 : st.cur;
  const n = String(shownIdx + 1).padStart(2, "0");

  return (
    <div className="hero-head">
      <h1 ref={h1} id="hero-h" className="t-hero hero-h">
        <span className="sr">Websites and apps for clubs that play every sport.</span>
        <span aria-hidden="true">
          <span className="h-line" style={{ "--i": 0 } as React.CSSProperties}>
            For clubs
          </span>
          <span className="h-line" style={{ "--i": 1 } as React.CSSProperties}>
            that play
          </span>
          <span className="h-line" style={{ "--i": 2 } as React.CSSProperties}>
            <span className="roller">
              {ROLLER.map((r, i) => {
                const cls = i === shownIdx ? (st.n === 0 || reduced ? "is-on" : "is-on is-in") : i === st.prev && !reduced ? "is-out" : "";
                return (
                  <span key={r.id} className={`rw ${cls}`.trim()}>
                    {i === shownIdx || i === st.prev
                      ? Array.from(r.word).map((c, k) => (
                          <span key={k} className="c" style={{ "--k": k } as React.CSSProperties}>
                            {c}
                          </span>
                        ))
                      : r.word}
                  </span>
                );
              })}
            </span>
          </span>
        </span>
      </h1>
      <div className="hero-roll mono h-fade" style={{ "--i": 3 } as React.CSSProperties}>
        <span className="hero-count" aria-hidden="true">
          <span key={n} className="hero-count-n">
            {n}
          </span>
          <span className="muted">&nbsp;/ 08</span>
        </span>
        <button type="button" className="hero-pause" onClick={() => setUserPaused((p) => !p)}>
          <span className="hero-pause-ico" aria-hidden="true" data-on={userPaused ? "" : undefined} />
          {userPaused ? "Play" : "Pause"}
          <span className="sr"> sport names</span>
        </button>
      </div>
    </div>
  );
}
