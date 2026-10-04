"use client";

import { GROUNDS } from "./grounds";
import { useHero } from "./SportContext";
import { NextUpCard } from "./NextUpCard";

/** The existing ground geometry and fixture demo, presented as one connected product preview. */
export function HeroVisual() {
  const { shown } = useHero();
  const ground = GROUNDS.find((g) => g.id === shown && g.id !== "any") ?? GROUNDS[0];
  return (
    <div className="hero-visual h-fade" style={{ "--i": 2 } as React.CSSProperties}>
      <div className="hero-visual-top"><span className="hero-status">Connected to your club</span><span aria-hidden="true">↗</span></div>
      <div className="hero-ground" aria-hidden="true">
        <svg viewBox="0 0 1600 1000" fill="none" stroke="currentColor" strokeWidth="5">
          <path d={ground.b} />
          {ground.lines.map((d, k) => <path key={k} d={d} />)}
          {ground.red.map((d, k) => <path key={k} d={d} stroke="var(--flag)" />)}
          {ground.dots.map(([x,y], k) => <circle key={k} cx={x} cy={y} r="7" fill="currentColor" stroke="none" />)}
        </svg>
      </div>
      <div className="hero-preview-card"><NextUpCard /></div>
      <p className="hero-visual-caption">Less admin. More game.</p>
    </div>
  );
}
