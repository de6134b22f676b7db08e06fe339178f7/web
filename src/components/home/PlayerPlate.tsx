"use client";
/**
 * P6 Player profiles (M21, W15). Present/Past (tablist). The identity fades and swaps (260ms out, 600ms expo in,
 * 2D only, no tilt), stats roll as odometers (stat 3 follows the kit sport), and a games-per-season chart over the
 * player's own seasons (4 or 12 bars, each with its count) animates height (700ms expo, 18ms per bar): red for the
 * current era, Ink for the past one. The chart grows to fill the plate (W3). Live region announces the era.
 * Sample data.
 */
import { DotList } from "@/components/DotList";
import { useEffect, useRef, useState } from "react";
import { sport as sportOf } from "@/content/sample";
import { Plate } from "@/components/Plate";
import { Segmented } from "@/components/Segmented";
import { Odometer } from "@/components/Odometer";
import { PLAYERS, STAT3 } from "./data";
import { useKit } from "./SportContext";
import { prefersReduced, useSkin } from "./useSkin";

type Era = "now" | "past";
const ERAS = [
  { value: "now", label: "Present" },
  { value: "past", label: "Past" },
] as const;

export function PlayerPlate() {
  const { sport, bump } = useKit();
  const cell = useRef<HTMLDivElement>(null);
  useSkin(cell, bump, 5);
  const [era, setEra] = useState<Era>("now");
  const [idEra, setIdEra] = useState<Era>("now");
  const [swap, setSwap] = useState(false);
  const [live, setLive] = useState("");
  const t = useRef(0);
  useEffect(() => () => window.clearTimeout(t.current), []);

  const change = (e: Era) => {
    setEra(e);
    setLive(e === "now" ? "Showing a current player: Sam Okafor." : "Showing a past player: Jo Whitfield, 1998 to 2009.");
    window.clearTimeout(t.current);
    if (prefersReduced()) return setIdEra(e);
    setSwap(true);
    t.current = window.setTimeout(() => {
      setIdEra(e);
      setSwap(false);
    }, 260);
  };

  const p = PLAYERS[era];
  const id = PLAYERS[idEra];
  const stat3 = STAT3[sport][era === "now" ? 0 : 1];
  return (
    <div ref={cell} className="pl-cell pl-pl">
      <Plate n={6} id="p-pl" title="Player profiles" cursor="Flip" decision="Past players keep their page. Come back in twenty years and your name is still on the club’s site.">
        <Segmented options={ERAS} value={era} onChange={change} label="Player era" idBase="pl" controls="pl-panel" />
        <div id="pl-panel" role="tabpanel" aria-labelledby={`pl-${era}`} className={`pl-card card${swap ? " is-swap" : ""}`}>
          <div className="pl-top">
            <span className="pl-num" aria-hidden="true">
              {id.n}
            </span>
            <div>
              <p className="pl-name">
                <span className="sr">Number {id.n}, </span>
                {id.name}
              </p>
              <p className="pl-era mono">
                <DotList items={id.era} />
              </p>
            </div>
          </div>
          <dl className="pl-stats">
            <div>
              <dt className="mono">Games</dt>
              <dd className="num">
                <Odometer value={p.g} />
              </dd>
            </div>
            <div>
              <dt className="mono">Seasons</dt>
              <dd className="num">
                <Odometer value={p.s} />
              </dd>
            </div>
            <div>
              <dt className="mono">{sportOf(sport).stat3}</dt>
              <dd className="num">
                <Odometer value={stat3} />
              </dd>
            </div>
            <div>
              <dt className="mono">Club awards</dt>
              <dd className="num">
                <Odometer value={p.a} />
              </dd>
            </div>
          </dl>
          <div className="pl-tl-wrap">
            <div className="pl-tl" aria-hidden="true">
              {p.gps.map((g, i) => (
                <span key={`${era}-${i}`} className={`pl-bar${era === "now" && i === p.gps.length - 1 ? " cur" : ""}`} style={{ "--i": i, "--h": g / Math.max(...p.gps) } as React.CSSProperties}>
                  <b className="mono">{g}</b>
                  <i />
                </span>
              ))}
            </div>
            <p className="pl-tl-k mono muted">
              <span>{p.yrs[0]}</span>
              <span className="sr"> to </span>
              <span>Games per season</span>
              <span>{p.yrs[1]}</span>
            </p>
          </div>
        </div>
        <p className="sr" aria-live="polite">
          {live}
        </p>
      </Plate>
    </div>
  );
}
