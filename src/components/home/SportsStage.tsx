"use client";
/**
 * 02 The sports: SportsIndex + GroundStage (M14, M15, W1a, W14). The active row is the one crossing the viewport
 * centre (IntersectionObserver on a zero-height centre band); hover or focus overrides it while held.
 * Active row: a Flag wedge sweeps the row (slanted leading edge, 700ms hand), the name shifts .18em and glides
 * 600 → 760, the data line rises. The stage (aria-hidden) un-draws the old ground (450ms hand) and draws the new
 * one (1000ms expo, 40ms stagger), dots pop, the corner flag glides to the new corner (900ms hand), and the
 * mono caption rolls. Linework lives only in the stage column; it never runs behind text.
 * Each row is a button: "Use {Sport} in the kit" sets the global sport and scrolls to #build.
 * 761–1023: the stage is a sticky strip above the list. Phones (≤760): no stage (a figure above the list would swap
 * off-screen); each row carries its own small ground, drawn when the row becomes active. The data pairs wrap on a
 * gap, never on a dangling middot.
 * Active row (all widths): a --surface slab on the column edge with a thin Flag band riding its slanted leading
 * edge (red stays a signal, §1.3); the name glides in weight only, its x never moves.
 */
import { useEffect, useRef, useState } from "react";
import { MARK_PATH, MARK_PENNANT } from "@/components/Mark";
import { useMotion } from "@/motion/useMotion";
import type { SportId } from "@/content/sample";
import { SPORT_ROWS } from "./data";
import { GROUNDS } from "./grounds";
import { useKit } from "./SportContext";

export function SportsStage() {
  const [scrollActive, setScrollActive] = useState<SportId>("afl");
  const [held, setHeld] = useState<SportId | null>(null);
  const list = useRef<HTMLOListElement>(null);
  const { setSport } = useKit();
  const { scrollTo } = useMotion();
  const active = held ?? scrollActive;
  const row = SPORT_ROWS.find((r) => r.id === active) ?? SPORT_ROWS[0];
  const ground = GROUNDS.find((g) => g.id === active) ?? GROUNDS[0];

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setScrollActive((e.target as HTMLElement).dataset.id as SportId);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    el.querySelectorAll("li").forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, []);

  const use = (id: SportId) => {
    setSport(id);
    scrollTo("#build", { focus: false });
  };

  return (
    <div className="sports">
      <div className="gs" aria-hidden="true">
        <div className="gs-frame">
          <svg className="gs-svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid meet" focusable="false">
            {GROUNDS.map((g) => (
              <g key={g.id} className={`gs-g${g.id === active ? " is-on" : ""}`}>
                {[g.b, ...g.lines].map((d, k) => (
                  <path key={k} className="gs-ln" d={d} pathLength={1} style={{ "--k": k } as React.CSSProperties} />
                ))}
                {g.red.map((d, k) => (
                  <path key={`r${k}`} className="gs-ln gs-red" d={d} pathLength={1} style={{ "--k": g.lines.length + k } as React.CSSProperties} />
                ))}
                {g.dots.map(([x, y], k) => (
                  <circle key={`d${k}`} className="gs-dot" cx={x} cy={y} r={5} style={{ "--k": k } as React.CSSProperties} />
                ))}
              </g>
            ))}
            <g className="gs-flag" style={{ transform: `translate(${ground.flag[0]}px, ${ground.flag[1]}px) rotate(${ground.flag[2]}deg)` }}>
              <svg x={-12} y={-6} width={110} height={110} viewBox="14 13 66 66" overflow="visible">
                <path d={MARK_PATH} fill="var(--ink)" />
                <polygon className="gs-pen" points={MARK_PENNANT} fill="var(--flag)" />
              </svg>
            </g>
          </svg>
        </div>
        <p className="gs-cap mono">
          <span key={row.caption} className="gs-cap-t">
            {row.caption}
          </span>
        </p>
      </div>
      <ol ref={list} className="sport-list" onPointerLeave={() => setHeld(null)}>
        {SPORT_ROWS.map((r, i) => (
          <li
            key={r.id}
            data-id={r.id}
            className={`sport${r.id === active ? " is-active" : ""}${r.id === "any" ? " sport-more" : ""}`}
            data-cursor="Pick"
            onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(r.id)}
          >
            <button
              type="button"
              className="sport-btn"
              onFocus={() => setHeld(r.id)}
              onBlur={() => setHeld(null)}
              onClick={() => use(r.id)}
            >
              <span className="sport-n mono" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="sport-name t-row wglide">{r.name}</span>
              <span className="sport-d mono">
                <span className="sport-data">{dataPairs(r.data)}</span>
                <span className="sport-use">
                  Use in kit<span aria-hidden="true"> →</span>
                </span>
              </span>
              <Thumb id={r.id} on={r.id === active} />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Phones (≤760) only: the row's own ground, drawn in the row when it becomes active (the stage is hidden there). */
function Thumb({ id, on }: { id: SportId; on: boolean }) {
  const g = GROUNDS.find((x) => x.id === id);
  if (!g) return null;
  return (
    <span className="sport-th" aria-hidden="true">
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid meet" focusable="false">
        <g className={`gs-g${on ? " is-on" : ""}`}>
          {[g.b, ...g.lines].map((d, k) => (
            <path key={k} className="gs-ln" d={d} pathLength={1} style={{ "--k": k } as React.CSSProperties} />
          ))}
          {g.red.map((d, k) => (
            <path key={`r${k}`} className="gs-ln gs-red" d={d} pathLength={1} style={{ "--k": g.lines.length + k } as React.CSSProperties} />
          ))}
        </g>
      </svg>
    </span>
  );
}

/** "A · B · C · D" → two unbreakable pairs, so a narrow row breaks between pairs, never before the last item. */
function dataPairs(data: string) {
  const parts = data.split(" · ");
  if (parts.length < 4) return <span className="nw">{data}</span>;
  return (
    <>
      <span className="nw">{parts.slice(0, 2).join(" · ")}</span>
      <span className="sd-sep"> · </span>
      <span className="nw">{parts.slice(2).join(" · ")}</span>
    </>
  );
}
