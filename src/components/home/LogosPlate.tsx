"use client";
/**
 * P3 Club logos (M18, W8). SSR state: twelve neutral "Unmatched" monogram shields. Matching runs once on its own
 * at 50% visibility; the button then reads "Run again". A red scan line sweeps the grid (1.1s hand); tiles
 * resolve row by row (300ms per row, 70ms per tile): the crest scales .6 → 1 and turns −8° → 0 (700ms expo)
 * while the placeholder scales up and fades. The count rolls; the final count is announced. Then the
 * "Next match" strip shows two matched crests. Tiles are focusable and show the club name on hover/focus/tap.
 */
import { useEffect, useRef, useState } from "react";
import { CLUBS, club } from "@/content/sample";
import { Crest } from "@/components/Crest";
import { Plate } from "@/components/Plate";
import { Button } from "@/components/Button";
import { Odometer } from "@/components/Odometer";
import { NEXT_UP } from "./data";
import { useKit } from "./SportContext";
import { prefersReduced, useSkin } from "./useSkin";

export function LogosPlate() {
  const { bump } = useKit();
  const cell = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLUListElement>(null);
  useSkin(cell, bump, 2);
  const [count, setCount] = useState(0);
  const [run, setRun] = useState(0);
  const [live, setLive] = useState("");
  const timers = useRef<number[]>([]);
  const ran = useRef(false);

  const start = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    ran.current = true;
    setCount(0);
    setRun((r) => r + 1);
    setLive("");
    const rm = prefersReduced();
    CLUBS.forEach((_, i) => {
      const at = rm ? 0 : 260 + Math.floor(i / 4) * 300 + (i % 4) * 70;
      timers.current.push(window.setTimeout(() => setCount((c) => Math.max(c, i + 1)), at));
    });
    timers.current.push(window.setTimeout(() => setLive("12 of 12 logos matched"), rm ? 0 : 1400));
  };

  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !ran.current) {
          start();
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    // start() replaces timers.current: read it at cleanup time, not at mount.
    const tm = timers;
    return () => {
      io.disconnect();
      tm.current.forEach(clearTimeout);
    };
  }, []);

  const done = count === CLUBS.length;
  const home = club(NEXT_UP.home);
  const away = club(NEXT_UP.away);

  return (
    <div ref={cell} className="pl-cell pl-logo">
      <Plate n={3} id="p-logo" title="Club logos" cursor="Match" decision="Every club, matched to its own badge.">
        <ul ref={grid} className={`lg-grid${run ? ` scan s${run % 2}` : ""}`}>
          {CLUBS.map((c, i) => {
            const on = i < count;
            return (
              <li key={c.id} className={`lg${on ? " on" : ""}`}>
                <span className="sr">{`${c.name}, logo ${on ? "matched" : "not matched yet"}`}</span>
                <span className="lg-ph" aria-hidden="true">
                  <Crest club={null} initials={c.initials} size={40} />
                </span>
                <span className="lg-real" aria-hidden="true">
                  <Crest club={c} size={40} />
                </span>
                <span className="lg-nm mono" aria-hidden="true">
                  {c.short}
                </span>
              </li>
            );
          })}
        </ul>
        <div className={`lg-next card${done ? " is-done" : ""}`}>
          <span className="mono muted">Next match</span>
          <span className="lg-next-m">
            <span className="lg-next-c">
              {done ? <Crest club={home} size={30} /> : <Crest club={null} initials={home.initials} size={30} />}
              <span>{home.short}</span>
            </span>
            <span className="mono muted">v</span>
            <span className="lg-next-c">
              {done ? <Crest club={away} size={30} /> : <Crest club={null} initials={away.initials} size={30} />}
              <span>{away.short}</span>
            </span>
          </span>
          <span className="num lg-next-t">Sat 1:40 pm</span>
        </div>
        <div className="plate-act lg-act">
          <Button variant="ghost" size="sm" onClick={start}>
            {run ? "Run again" : "Match logos"}
          </Button>
          <span className="mono muted lg-count" aria-hidden="true">
            <Odometer value={count} /> of 12 matched
          </span>
        </div>
        <p className="sr" aria-live="polite">
          {live}
        </p>
      </Plate>
    </div>
  );
}
