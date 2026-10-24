"use client";
/**
 * PlayHQ panel, "the round updates" (DESIGN.md §5, §6.6): SAMPLE DATA only (fictional clubs from
 * src/content/sample.ts), the tag visible from the first frame. One panel, two columns at >= 900px: this round's
 * fixtures left, the ladder right.
 *
 * Scrubbed as the panel crosses the viewport: the rows slide in, the live match's score counts to its final score
 * and the row goes `data-state="final"` (the dot becomes a ring, LIVE becomes FT), then the ladder re-orders:
 * Northside Comets climb from 2nd to 1st as their points count up, Eastvale drop a row. The DOM order is the final
 * state (what reduced motion and no JS show); rows start from offset transforms (CSS under html.js:not(.reduce)) and
 * resolve to none.
 */
import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/motion";

export type PanelFixture = {
  id: string;
  home: string;
  away: string;
  grade: string;
  when: string;
  venue: string;
  live?: { home: string; away: string; finalHome: string };
};
export type PanelLadder = { pos: number; club: string; short: string; p: number; w: number; l: number; pts: number; ours?: boolean; from?: { pos: number; pts: number } };

export function PlayHQPanel({ round, fixtures, ladder }: { round: string; fixtures: PanelFixture[]; ladder: PanelLadder[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || reduced()) return;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top 88%", end: "bottom 45%", scrub: 0.4, id: "phq" },
      });
      // 1. Rows arrive. The two columns stagger in parallel so the ladder never lags behind the fixtures beside it;
      // both are in by ~0.35, before the score count (0.42) and the re-order (0.72).
      for (const sel of [".fx-row", ".ladder tbody tr"]) {
        const rows = gsap.utils.toArray<HTMLElement>(sel, el);
        tl.fromTo(rows, { x: -32, opacity: 0 }, { x: 0, opacity: 1, duration: 0.18, stagger: 0.03, ease: "power2.out" }, 0.02);
      }
      // 2. The live match finishes: the score counts up, LIVE -> FT.
      gsap.utils.toArray<HTMLElement>(".count", el).forEach((n) => {
        const from = Number(n.dataset.from);
        const to = Number(n.dataset.to);
        const at = Number(n.dataset.at ?? 0.4);
        const o = { v: from };
        n.textContent = String(from);
        tl.to(o, { v: to, duration: 0.2, onUpdate: () => (n.textContent = String(Math.round(o.v))) }, at);
      });
      const liveRow = el.querySelector<HTMLElement>(".fx-row[data-live]");
      if (liveRow) {
        liveRow.dataset.state = "live";
        tl.call(() => (liveRow.dataset.state = "final"), [], 0.62);
        tl.call(() => (liveRow.dataset.state = "live"), [], 0.619);
      }
      // 3. The ladder re-orders: rows that moved slide to their new places.
      gsap.utils.toArray<HTMLElement>(".l-move", el).forEach((row) => {
        const by = Number(row.dataset.by); // rows moved: +1 = started one row lower
        // y: 0 too, so GSAP ignores the CSS start transform it would otherwise read as a px offset.
        tl.fromTo(row, { y: 0, yPercent: by * 100 }, { y: 0, yPercent: 0, duration: 0.22, ease: "power2.inOut", immediateRender: true }, 0.72);
      });
      return () => tl.kill();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="panel">
      <div className="panel-top">
        <p className="panel-round">{round}</p>
        <span className="tag">Sample data</span>
      </div>
      <div className="panel-cols">
        <div className="panel-col">
          <h3 className="panel-h">Fixtures</h3>
          <ul className="fx">
            {fixtures.map((f) => (
              <li key={f.id} className="fx-row" data-live={f.live ? "1" : undefined} data-state={f.live ? "final" : undefined}>
                <span className="fx-main">
                  <span className="fx-grade">{f.grade}</span>
                  <span className="fx-teams">
                    {f.home} <span className="fx-v">v</span> {f.away}
                  </span>
                </span>
                {f.live ? (
                  <span className="fx-live tnum">
                    <span className="live">
                      <span className="live-dot" aria-hidden="true" />
                      <span className="live-words">
                        <span className="live-word">Live</span>
                        <span className="final-word">FT</span>
                      </span>
                    </span>
                    <span className="fx-score">
                      <span className="count" data-from={f.live.home} data-to={f.live.finalHome} data-at="0.42">
                        {f.live.finalHome}
                      </span>
                      –{f.live.away}
                    </span>
                  </span>
                ) : (
                  <span className="fx-when">
                    <span>{f.when}</span>
                    <span>{f.venue}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="panel-col">
          <h3 className="panel-h">Ladder</h3>
          <table className="ladder tnum">
            <thead>
              <tr>
                <th scope="col" className="l-pos">
                  <abbr title="Position">#</abbr>
                </th>
                <th scope="col" className="l-club">
                  Club
                </th>
                <th scope="col">
                  <abbr title="Played">P</abbr>
                </th>
                <th scope="col">
                  <abbr title="Won">W</abbr>
                </th>
                <th scope="col">
                  <abbr title="Lost">L</abbr>
                </th>
                <th scope="col">
                  <abbr title="Points">Pts</abbr>
                </th>
              </tr>
            </thead>
            <tbody>
              {ladder.map((r) => {
                const by = r.from ? r.from.pos - r.pos : 0;
                return (
                  <tr key={r.club} className={[r.ours ? "ours" : "", by ? "l-move" : ""].join(" ").trim()} data-by={by || undefined}>
                    <td className="l-pos">
                      {r.from && r.from.pos !== r.pos ? (
                        <span className="count" data-from={r.from.pos} data-to={r.pos} data-at="0.74">
                          {r.pos}
                        </span>
                      ) : (
                        r.pos
                      )}
                    </td>
                    <th scope="row" className="l-club">
                      <span className="l-long">{r.club}</span>
                      <span className="l-short" aria-hidden="true">
                        {r.short}
                      </span>
                      {r.ours ? <span className="sr-only"> (your club)</span> : null}
                    </th>
                    <td>{r.p}</td>
                    <td>{r.w}</td>
                    <td>{r.l}</td>
                    <td>
                      {r.from && r.from.pts !== r.pts ? (
                        <span className="count" data-from={r.from.pts} data-to={r.pts} data-at="0.66">
                          {r.pts}
                        </span>
                      ) : (
                        r.pts
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
