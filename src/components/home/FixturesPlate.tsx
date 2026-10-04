"use client";
/**
 * P1 Fixtures & results (M16). Segmented Upcoming/Results (tablist, arrow keys) + grade chips. On change the rows
 * exit (opacity, −6px, 200ms) and re-enter (10px → 0, 600ms expo, 45ms stagger). Scores follow the kit sport's
 * format. Under 760 rows are two lines (home over away, time/score right, venue hidden). Live region announces
 * the view ("Showing results, seniors"). Sample data.
 */
import { useEffect, useRef, useState } from "react";
import { club, type Club } from "@/content/sample";
import { Crest } from "@/components/Crest";
import { Plate } from "@/components/Plate";
import { Segmented } from "@/components/Segmented";
import { Chips } from "@/components/Chips";
import { RESULTS, UPCOMING, resultScore, type Grade } from "./data";
import { useKit } from "./SportContext";
import { prefersReduced, useSkin } from "./useSkin";

type View = "up" | "res";
const VIEWS = [
  { value: "up", label: "Upcoming" },
  { value: "res", label: "Results" },
] as const;
const GRADES = [
  { value: "all", label: "All" },
  { value: "sen", label: "Seniors" },
  { value: "jun", label: "Juniors" },
] as const;
const GRADE_NAME: Record<Grade, string> = { all: "all grades", sen: "seniors", jun: "juniors" };

function Team({ c, side }: { c: Club; side: "home" | "away" }) {
  return (
    <span className={`fx-t fx-${side}`}>
      <Crest club={c} size={24} />
      <span className="fx-nm">
        <span className="nm-long">{c.name}</span>
        <span className="nm-short">{c.short}</span>
      </span>
    </span>
  );
}

export function FixturesPlate() {
  const { sport, bump } = useKit();
  const cell = useRef<HTMLDivElement>(null);
  useSkin(cell, bump, 0);
  const [want, setWant] = useState<{ view: View; grade: Grade }>({ view: "up", grade: "all" });
  const [shown, setShown] = useState(want);
  const [out, setOut] = useState(false);
  const [n, setN] = useState(0);
  const [live, setLive] = useState("");
  const t = useRef(0);
  useEffect(() => () => window.clearTimeout(t.current), []);

  const change = (next: { view: View; grade: Grade }) => {
    setWant(next);
    setLive(`Showing ${next.view === "up" ? "upcoming fixtures" : "results"}, ${GRADE_NAME[next.grade]}`);
    window.clearTimeout(t.current);
    if (prefersReduced()) {
      setShown(next);
      return;
    }
    setOut(true);
    t.current = window.setTimeout(() => {
      setShown(next);
      setN((x) => x + 1);
      setOut(false);
    }, 200);
  };

  const rows =
    shown.view === "up"
      ? UPCOMING.filter((r) => shown.grade === "all" || r.grade === shown.grade).map((r) => (
          <li key={`${n}-${r.id}`} className="fx">
            <span className="fx-r">
              <span className="mono">{r.round}</span>
              <b>{r.date}</b>
            </span>
            <Team c={club(r.home)} side="home" />
            <span className="fx-mid num">{r.time}</span>
            <Team c={club(r.away)} side="away" />
            <span className="fx-v">
              {r.venue}
              <span className="mono">{r.grade === "sen" ? "Seniors" : "Juniors"}</span>
            </span>
          </li>
        ))
      : RESULTS.map((r, i) => ({ r, i }))
          .filter(({ r }) => shown.grade === "all" || r.grade === shown.grade)
          .map(({ r, i }) => {
            const [h, a] = resultScore(sport, i, r);
            return (
              <li key={`${n}-${r.id}`} className="fx">
                <span className="fx-r">
                  <span className="mono">{r.round}</span>
                  <b>{r.date}</b>
                </span>
                <Team c={club(r.home)} side="home" />
                <span className="fx-mid fx-score num">
                  <span>{h}</span>
                  <span className="fx-dash" aria-hidden="true">
                    –
                  </span>
                  <span className="sr"> to </span>
                  <span>{a}</span>
                </span>
                <Team c={club(r.away)} side="away" />
                <span className="fx-v">
                  <span className={`fx-res ${r.win ? "w" : "l"}`}>
                    <span aria-hidden="true">{r.win ? "W" : "L"}</span>
                    <span className="sr">{r.win ? "Northside Comets won" : "Northside Comets lost"}</span>
                  </span>
                  <span className="mono">{r.grade === "sen" ? "Seniors" : "Juniors"}</span>
                </span>
              </li>
            );
          });

  return (
    <div ref={cell} className="pl-cell pl-fix">
      <Plate n={1} id="p-fix" title="Fixtures & results" cursor="Play" decision="Pulled from PlayHQ, season by season, grade by grade. Nobody retypes a fixture list again.">
        <div className="fx-bar">
          <Segmented options={VIEWS} value={want.view} onChange={(v) => change({ ...want, view: v })} label="Fixtures view" idBase="fx" controls="fx-panel" />
          <Chips options={GRADES} value={[want.grade]} onChange={(v) => change({ ...want, grade: v[0] ?? "all" })} label="Grade" />
        </div>
        <div id="fx-panel" role="tabpanel" aria-labelledby={`fx-${want.view}`} className="card fx-card">
          <ul className={`fx-list${out ? " is-out" : ""}${n ? " is-anim" : ""}`}>
            {rows.length ? rows : <li className="fx-empty muted">No {GRADE_NAME[shown.grade]} fixtures this round.</li>}
          </ul>
        </div>
        <p className="sr" aria-live="polite">
          {live}
        </p>
      </Plate>
    </div>
  );
}
