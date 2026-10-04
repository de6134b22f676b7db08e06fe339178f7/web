"use client";
/**
 * P2 Ladder (M17), on the Ink stage. Six sample clubs; Northside Comets ("ours") carry a Flag pennant.
 * Columns follow the kit sport (§5.3 table). "Play next round" plays random sample results: rows FLIP to their new
 * places (WAAPI, 760ms hand, +120ms for long moves), points roll as odometers, ▲/▼ markers fade in, movers get a
 * 1.2s white flash, and a polite live region announces our club's move. Column headers are buttons that sort
 * (aria-sort). Names use the short form at ≤ 480. Sample data.
 */
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import { club, sport as sportOf, type SportId } from "@/content/sample";
import { Crest } from "@/components/Crest";
import { Plate } from "@/components/Plate";
import { Button } from "@/components/Button";
import { Odometer } from "@/components/Odometer";
import { measure, play, type Rects } from "@/lib/flip";
import { PER_GAME, colText, colValue, hasDraws, ladderBase, ladderSort, ord, type Team } from "./data";
import { useKit } from "./SportContext";
import { useSkin } from "./useSkin";

type Sort = { key: string; dir: "desc" | "asc" };
const COL_NAME: Record<string, string> = { P: "Played", W: "Won", L: "Lost", D: "Drawn", "%": "Percentage", GD: "Goal difference", PCT: "Win percentage", Pts: "Points" };

function playRound(id: SportId, teams: Team[]): Team[] {
  const next = teams.map((t) => ({ ...t }));
  const order = [...next].sort(() => Math.random() - 0.5);
  const s = PER_GAME[id];
  const draws = hasDraws(id);
  for (let i = 0; i + 1 < order.length; i += 2) {
    const A = order[i];
    const B = order[i + 1];
    A.p++;
    B.p++;
    const r = Math.random();
    const base = Math.max(1, Math.round(s * (0.8 + Math.random() * 0.4)));
    if (draws && r < 0.08) {
      A.d++;
      B.d++;
      A.f += base;
      A.a += base;
      B.f += base;
      B.a += base;
      continue;
    }
    const [W, L] = r < 0.54 ? [A, B] : [B, A];
    const margin = Math.max(1, Math.round(s * (0.05 + Math.random() * 0.35)));
    W.w++;
    L.l++;
    W.f += base + margin;
    W.a += base;
    L.f += base;
    L.a += base + margin;
  }
  return next;
}

export function LadderPlate() {
  const { sport, bump } = useKit();
  const cell = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLTableSectionElement>(null);
  const before = useRef<Rects | null>(null);
  useSkin(cell, bump, 1);
  const [st, setSt] = useState(() => ({ sport, teams: ladderBase(sport), round: 8, moves: {} as Record<string, number>, flash: 0 }));
  const [sort, setSort] = useState<Sort>({ key: "#", dir: "asc" });
  const [live, setLive] = useState("");
  if (st.sport !== sport) setSt({ sport, teams: ladderBase(sport), round: 8, moves: {}, flash: 0 });

  const fmt = sportOf(sport);
  const ranked = ladderSort(sport, st.teams);
  const rank = new Map(ranked.map((t, i) => [t.c, i + 1]));
  const rows =
    sort.key === "#"
      ? sort.dir === "asc"
        ? ranked
        : [...ranked].reverse()
      : [...ranked].sort((a, b) => (colValue(sport, b, sort.key) - colValue(sport, a, sort.key)) * (sort.dir === "desc" ? 1 : -1));

  useLayoutEffect(() => {
    if (!before.current || !body.current) return;
    play(body.current, "[data-flip]", before.current, { duration: 760 });
    before.current = null;
  }, [st.round, st.flash, sort]);

  const snap = () => {
    if (body.current) before.current = measure(body.current, "[data-flip]");
  };

  const next = () => {
    snap();
    const teams = playRound(sport, st.teams);
    const after = ladderSort(sport, teams);
    const moves: Record<string, number> = {};
    after.forEach((t, i) => (moves[t.c] = (rank.get(t.c) ?? i + 1) - (i + 1)));
    const round = st.round + 1;
    setSt({ sport, teams, round, moves, flash: st.flash + 1 });
    const pos = after.findIndex((t) => t.c === "nc") + 1;
    const mv = moves.nc ?? 0;
    setLive(`Round ${round} played. Northside Comets ${mv > 0 ? `move up to ${ord(pos)}` : mv < 0 ? `drop to ${ord(pos)}` : `stay ${ord(pos)}`}.`);
  };

  const sortBy = (key: string) => {
    snap();
    setSort((s) => (s.key === key ? { key, dir: s.dir === "desc" ? "asc" : "desc" } : { key, dir: key === "#" ? "asc" : "desc" }));
  };
  const ariaSort = (key: string) => (sort.key === key ? (sort.dir === "desc" ? "descending" : "ascending") : undefined);
  const head = (key: string, label: string, full: string) => (
    <th scope="col" aria-sort={ariaSort(key)} className={key === "#" ? "lad-pos" : `lad-num${key === "%" || key === "PCT" ? " lad-w" : ""}`}>
      <button type="button" className={`lad-sort${sort.key === key ? " is-on" : ""}`} onClick={() => sortBy(key)}>
        <span aria-hidden="true">{label}</span>
        <span className="sr">Sort by {full}</span>
      </button>
    </th>
  );

  return (
    <div ref={cell} className="pl-cell pl-lad">
      <Plate n={2} id="p-lad" title="Ladder" ink cursor="Sort" decision="A live ladder that moves with the season.">
        <div className="lad-wrap" tabIndex={0} role="region" aria-label="Club ladder; scroll horizontally if needed">
          <table className="lad">
            <caption className="sr">Sample ladder after round {st.round}</caption>
            <thead>
              <tr>
                {head("#", "#", "ladder position")}
                <th scope="col" className="lad-club-h mono">
                  Club
                </th>
                {fmt.cols.map((k) => (
                  <Fragment key={k}>{head(k, k, COL_NAME[k] ?? k)}</Fragment>
                ))}
              </tr>
            </thead>
            <tbody ref={body}>
              {rows.map((t) => {
                const c = club(t.c);
                const mv = st.moves[t.c] ?? 0;
                return (
                  <tr key={t.c} data-flip={t.c} className={`lad-row${t.c === "nc" ? " ours" : ""}${mv ? ` moved f${st.flash % 2}` : ""}`}>
                    <td className="lad-pos num">
                      <span className={`lad-mv${mv > 0 ? " up" : mv < 0 ? " dn" : ""}`} aria-hidden="true">
                        {mv > 0 ? "▲" : mv < 0 ? "▼" : ""}
                      </span>
                      {rank.get(t.c)}
                    </td>
                    <th scope="row" className="lad-club">
                      <Crest club={c} size={22} keyline />
                      <span className="nm-long">{c.name}</span>
                      <span className="nm-short">{c.short}</span>
                      {t.c === "nc" ? <span className="pen lad-pen" aria-label="our club" role="img" /> : null}
                    </th>
                    {fmt.cols.map((k) => (
                      <td key={k} className={`lad-num num${k === "%" || k === "PCT" ? " lad-w" : ""}${k === "Pts" || (k === "PCT" && fmt.ptsWin === null) ? " lad-pts" : ""}`}>
                        {k === "Pts" ? <Odometer value={colText(sport, t, k)} /> : colText(sport, t, k)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="plate-act lad-act">
          <Button variant="flag" size="sm" onClick={next}>
            Play next round
          </Button>
          <span className="mono lad-rd">After round {st.round}</span>
        </div>
        <p className="sr" aria-live="polite">
          {live}
        </p>
      </Plate>
    </div>
  );
}
