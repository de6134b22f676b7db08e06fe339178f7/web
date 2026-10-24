import "./sample.css";
import {
  ADMIN_SUMMARY,
  ATTENDEES,
  ATTENDEES_MORE,
  CLUBS,
  EVENTS,
  FIXTURES,
  FORM,
  LADDER,
  LIVE_SCORERS,
  NEXT_GAME,
  NOTICES,
  PLAYER,
  POSTS,
  QUARTERS,
  RESULTS,
  SAMPLE_CLUB,
  clubName,
  clubShort,
  type ClubId,
} from "@/content/sample";

/**
 * Sample club screens (DESIGN.md §5): real DOM, fictional club, styled as a client site in its own colours
 * (sample.css `.club`). Each one is a product surface Websport builds: the club home, fixtures and results, the
 * ladder, an event with RSVP, a player profile, the committee admin. Every surface carrying them shows a "Sample data"
 * tag. The fill rule (§4.7): desk screens are laid out at exactly 1280x800, phones at 390x844; every root is
 * nav / main / foot (`auto 1fr auto`) so the foot sits on the frame's bottom edge and nothing is cut.
 */
const short = clubShort;

function Nav({ on }: { on: string }) {
  return (
    <div className="club-nav">
      <span className="club-crest">
        <i aria-hidden="true" />
        {SAMPLE_CLUB.name}
      </span>
      <span className="club-links">
        {["Fixtures", "Ladder", "Teams", "Events", "Players", "Clubhouse"].map((l) => (l === on ? <b key={l}>{l}</b> : <span key={l}>{l}</span>))}
      </span>
      <span className="club-btn">Join the club</span>
    </div>
  );
}

function Foot() {
  return (
    <div className="club-foot">
      <span>
        <b>{SAMPLE_CLUB.name}</b> · {SAMPLE_CLUB.season}
      </span>
      <span>Fixtures, results and ladders from PlayHQ</span>
      <span>{SAMPLE_CLUB.domain}</span>
    </div>
  );
}

function FormDots({ club }: { club: ClubId }) {
  return (
    <span className="form">
      {FORM[club].map((r, i) => (
        <i key={i} className={r === "W" ? "w" : "l"} aria-hidden="true" />
      ))}
    </span>
  );
}

function Ladder({ rows = 6, compact = false }: { rows?: number; compact?: boolean }) {
  return (
    <table className="club-tbl">
      <thead>
        <tr>
          <th className="pos">#</th>
          <th className="l">Club</th>
          <th>P</th>
          <th>W</th>
          <th>L</th>
          <th>Pts</th>
        </tr>
      </thead>
      <tbody>
        {LADDER.slice(0, rows).map((r) => (
          <tr key={r.club} className={r.ours ? "ours" : undefined}>
            <td className="pos">{r.pos}</td>
            <td className="l">{compact ? short(r.club) : clubName(r.club)}</td>
            <td>{r.p}</td>
            <td>{r.w}</td>
            <td>{r.l}</td>
            <td>{r.pts}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** The live match card: pill + venue, teams and score, the quarter line, then ground, time and form. */
function LiveMatch({ compact = false, quarters = true }: { compact?: boolean; quarters?: boolean }) {
  const f = FIXTURES[0];
  return (
    <div className="club-card club-live">
      <div className="club-card-h">
        <span className="live-pill">
          <span className="live-dot" aria-hidden="true" />
          Live · {f.grade}
        </span>
        <span>Round 7</span>
      </div>
      <div className="match">
        <div className="match-team">
          {compact ? short(f.home) : clubName(f.home)}
          <small>Home</small>
        </div>
        <div className="match-score">
          {f.live!.home}
          <span>v</span>
          {f.live!.away}
        </div>
        <div className="match-team">
          {compact ? short(f.away) : clubName(f.away)}
          <small>Away</small>
        </div>
      </div>
      {quarters ? (
        <div className="quarters">
          {QUARTERS.map((q) => (
            <span key={q.q} className={q.score === "Live" ? "on" : undefined}>
              <small>{q.q}</small>
              {q.score}
            </span>
          ))}
        </div>
      ) : null}
      {!compact ? (
        <div className="match-line">
          <span>
            <small>Top scorers</small>
            {LIVE_SCORERS.map((s) => `${s.name} ${s.pts}`).join(" · ")}
          </span>
          <span>
            <small>{NEXT_GAME.label}</small>
            {NEXT_GAME.line}
          </span>
        </div>
      ) : null}
      <div className="match-meta">
        <span>
          {f.venue} · {f.when.replace("Sat ", "")}
        </span>
        <span>
          Last five <FormDots club="nc" />
        </span>
      </div>
    </div>
  );
}

function FixtureList({ items, grade, when, home = true }: { items: typeof FIXTURES; grade?: string; when?: string; home?: boolean }) {
  return (
    <ul className="fx-list">
      {items.map((f) => (
        <li key={f.id}>
          <b>
            {short(home ? f.home : f.away)} <i>v</i> {short(home ? f.away : f.home)}
          </b>
          <span className="r">{f.live ? <span className="live-pill">Live</span> : (when ?? f.when)}</span>
          <small>
            {grade ?? f.grade} · {f.venue}
          </small>
        </li>
      ))}
    </ul>
  );
}

function ResultsList({ versus = false }: { versus?: boolean }) {
  return (
    <ul className="fx-list">
      {RESULTS.map((f) => {
        const won = Number(f.result!.home) > Number(f.result!.away);
        return (
          <li key={f.id}>
            <b>
              {versus ? (
                <>
                  <i>v</i> {clubName(f.away)}
                </>
              ) : (
                <>
                  {short(f.home)} <i>v</i> {short(f.away)}
                </>
              )}
            </b>
            <span className={`r ${won ? "won" : "lost"}`}>
              {f.result!.home}–{f.result!.away}
            </span>
            <small>
              {f.grade} · {won ? "Win" : "Loss"} · {f.venue}
            </small>
          </li>
        );
      })}
    </ul>
  );
}

/** Desktop: the club home. */
export function ClubHome() {
  const e = EVENTS[0];
  return (
    <div className="club">
      <Nav on="Clubhouse" />
      <div className="club-main">
        <div className="club-hero">
          <div className="club-hero-copy">
            <p className="club-kicker">Round 7 · Saturday</p>
            <h3 className="club-h">Round 7 is on. Ground 2, from 1:40.</h3>
            <p className="club-sub">Seniors at home, juniors at Ground 1 from 9.</p>
            <div className="club-actions">
              <span className="club-btn">This week’s fixtures</span>
              <span className="club-btn ghost">Get directions</span>
            </div>
          </div>
          <LiveMatch />
        </div>
        <div className="club-grid">
          <div className="club-card">
            <div className="club-card-h">
              <span>Ladder · A Grade</span>
              <span>After R6</span>
            </div>
            <Ladder rows={4} compact />
          </div>
          <div className="club-card">
            <div className="club-card-h">
              <span>Next up</span>
              <span>All teams</span>
            </div>
            <FixtureList items={FIXTURES} />
          </div>
          <div className="club-card club-ev">
            <div className="club-card-h">
              <span>Events</span>
              <span>RSVP open</span>
            </div>
            <p className="club-ev-when">{e.when}</p>
            <b>{e.name}</b>
            <small>{e.where} · Dinner, awards and the year in review.</small>
            <div className="club-ev-meter" aria-hidden="true">
              <i style={{ width: `${Math.round((e.going / e.spots) * 100)}%` }} />
            </div>
            <small>
              <b>{e.going}</b> going · {e.spots - e.going} spots left
            </small>
            <span className="club-btn">RSVP · {e.price}</span>
          </div>
        </div>
        <div className="club-strip">
          <h5>
            From the Clubhouse
            <small>News, notices and match reports.</small>
          </h5>
          {POSTS.map((p) => (
            <div key={p.title} className="club-post">
              <small className="club-post-l">{p.label}</small>
              <span className="club-post-f">{p.fig}</span>
              <b>{p.title}</b>
              <small>{p.meta}</small>
            </div>
          ))}
        </div>
      </div>
      <Foot />
    </div>
  );
}

/** Desktop: fixtures and results. */
export function FixturesScreen() {
  return (
    <div className="club">
      <Nav on="Fixtures" />
      <div className="club-main">
        <div className="club-hero club-hero-2">
          <div className="club-hero-copy">
            <p className="club-kicker">Season 2026 · Round 7</p>
            <h3 className="club-h">Fixtures &amp; results</h3>
            <p className="club-sub">Round 7. Seniors Saturday, juniors Sunday from 9. Results post as the final siren goes.</p>
            <div className="club-chips">
              {["All teams", "A Grade", "B Grade", "Under 16", "Under 14"].map((c, i) => (
                <span key={c} className={i === 0 ? "on" : undefined}>
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="club-card">
            <div className="club-card-h">
              <span>This round</span>
              <span>Round 7 · A Grade</span>
            </div>
            <FixtureList items={FIXTURES} />
          </div>
        </div>
        <div className="club-grid">
          <div className="club-card">
            <div className="club-card-h">
              <span>Last round</span>
              <span>Results</span>
            </div>
            <ResultsList />
          </div>
          <div className="club-card">
            <div className="club-card-h">
              <span>B Grade</span>
              <span>Next up</span>
            </div>
            <FixtureList items={FIXTURES} grade="B Grade" home={false} />
          </div>
          <div className="club-card">
            <div className="club-card-h">
              <span>Under 16</span>
              <span>Next up</span>
            </div>
            <FixtureList items={FIXTURES} grade="Under 16" when="Sun 9:00 am" />
          </div>
        </div>
      </div>
      <Foot />
    </div>
  );
}

/** Desktop: the ladder. */
export function LadderScreen() {
  return (
    <div className="club">
      <Nav on="Ladder" />
      <div className="club-main club-main-2">
        <div className="club-hero club-hero-3">
          <div className="club-hero-copy">
            <p className="club-kicker">After round 6</p>
            <h3 className="club-h">A Grade ladder</h3>
            <p className="club-sub">Updated when PlayHQ posts a result. The Comets’ row is always marked.</p>
            <div className="club-chips">
              {["A Grade", "B Grade", "Under 16", "Under 14"].map((c, i) => (
                <span key={c} className={i === 0 ? "on" : undefined}>
                  {c}
                </span>
              ))}
            </div>
            <LiveMatch compact quarters={false} />
            <div className="club-card club-card-tight">
              <div className="club-card-h">
                <span>Last round · Comets</span>
                <span>Round 6</span>
              </div>
              <ResultsList />
            </div>
          </div>
          <div className="club-card">
            <div className="club-card-h">
              <span>Ladder · A Grade</span>
              <span>6 clubs · Round 7 in play</span>
            </div>
            <Ladder />
          </div>
        </div>
        <div className="club-form">
          <h5>
            Form
            <small>Last five, oldest first.</small>
          </h5>
          {CLUBS.map((c) => (
            <div key={c.id} className={c.id === "nc" ? "ours" : undefined}>
              <b>{c.short}</b>
              <FormDots club={c.id} />
            </div>
          ))}
        </div>
      </div>
      <Foot />
    </div>
  );
}

/** Desktop: committee admin. */
export function AdminScreen() {
  return (
    <div className="club admin">
      <div className="admin-side">
        <span className="club-crest">
          <i aria-hidden="true" />
          Comets admin
        </span>
        <div className="admin-nav">
          {["Announcements", "Events", "Players", "Teams", "Pages", "Sponsors", "Settings"].map((l, i) => (
            <span key={l} className={i === 0 ? "on" : undefined}>
              {l}
            </span>
          ))}
        </div>
        <div className="admin-user">
          <i aria-hidden="true">JS</i>
          <span>
            Signed in<b>Secretary</b>
          </span>
        </div>
      </div>
      <div className="admin-main">
        <div className="admin-top">
          <h4>This week</h4>
          <span>Mon 14 Sep – Sun 20 Sep</span>
        </div>
        <div className="admin-sum">
          {ADMIN_SUMMARY.map(([n, l]) => (
            <span key={l}>
              <b>{n}</b>
              {l}
            </span>
          ))}
        </div>
        <div className="admin-sec">
          <div className="admin-h">
            <h4>Announcements</h4>
            <span className="club-btn">New announcement</span>
          </div>
          {NOTICES.map((n) => (
            <div key={n.title} className="admin-row">
              <div>
                <b>{n.title}</b>
                <small>
                  {n.by} · {n.when}
                </small>
              </div>
              <span className={n.status === "Draft" ? "chip draft" : "chip"}>{n.status}</span>
              <small>Edit</small>
            </div>
          ))}
        </div>
        <div className="admin-sec">
          <div className="admin-h">
            <h4>Events</h4>
            <span className="chip">RSVP open</span>
          </div>
          {EVENTS.map((e) => (
            <div key={e.id} className="admin-row">
              <div>
                <b>{e.name}</b>
                <small>
                  {e.when} · {e.where}
                </small>
              </div>
              <span className="chip">
                {e.going} / {e.spots} going
              </span>
              <small>Export</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Phones (390x844): status strip, top bar, main, tab bar. ---------- */
function PhoneTop({ title, on }: { title: string; on: string }) {
  return (
    <div className="scr-head">
      <div className="scr-status" aria-hidden="true">
        <span>1:42</span>
        <span>{SAMPLE_CLUB.name.split(" ")[1]}</span>
        <span className="scr-sig">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="scr-top">
        <span className="club-crest">
          <i aria-hidden="true" />
          {title}
        </span>
        <span className="scr-top-r">{on}</span>
      </div>
    </div>
  );
}

function TabBar({ on }: { on: string }) {
  return (
    <div className="scr-tabs" aria-hidden="true">
      {["Home", "Fixtures", "Events", "Players"].map((t) => (
        <span key={t} className={t === on ? "on" : undefined}>
          <i />
          {t}
        </span>
      ))}
    </div>
  );
}

/** Phone: match centre. */
export function MatchCentre() {
  return (
    <div className="club scr">
      <PhoneTop title="Comets" on="Round 7" />
      <div className="scr-main">
        <div className="scr-sec">
          <p className="scr-meta">Live now</p>
          <LiveMatch compact />
        </div>
        <div className="scr-sec">
          <p className="scr-meta">Ladder · A Grade</p>
          <div className="club-card">
            <Ladder rows={5} compact />
          </div>
        </div>
        <div className="scr-sec">
          <p className="scr-meta">Next up</p>
          <div className="club-card">
            <FixtureList items={FIXTURES.slice(1)} />
          </div>
        </div>
      </div>
      <TabBar on="Home" />
    </div>
  );
}

/** Phone: an event with RSVP. */
export function EventScreen() {
  const e = EVENTS[0];
  return (
    <div className="club scr">
      <PhoneTop title="Comets" on="Events" />
      <div className="scr-main">
        <div className="scr-sec">
          <p className="scr-meta">{e.when}</p>
          <h3 className="scr-h">{e.name}</h3>
          <p className="club-sub">{e.where}. Dinner, awards and the year in review. Tables of ten.</p>
          <div className="club-card">
            <div className="rsvp">
              <span>
                Going <b>{e.going}</b>
              </span>
              <span>
                Spots <b>{e.spots - e.going}</b>
              </span>
              <span>
                Ticket <b>{e.price}</b>
              </span>
            </div>
            <div className="avatars" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
              <small>+{ATTENDEES_MORE}</small>
            </div>
            <span className="club-btn">RSVP and pay</span>
          </div>
        </div>
        <div className="scr-sec">
          <p className="scr-meta">Who’s going</p>
          <div className="club-card club-people">
            {ATTENDEES.map((a) => (
              <div key={a.name}>
                <i aria-hidden="true">
                  {a.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </i>
                <b>{a.name}</b>
                <small>{a.note}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="scr-sec">
          <p className="scr-meta">Also on</p>
          <div className="club-card">
            <ul className="fx-list fx-one">
              {[EVENTS[1], EVENTS[2]].map((x) => (
                <li key={x.id}>
                  <b>{x.name}</b>
                  <span className="r">{x.when.split(" · ")[0]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <TabBar on="Events" />
    </div>
  );
}

/** Phone: a player profile. */
export function PlayerScreen() {
  return (
    <div className="club scr">
      <PhoneTop title="Comets" on="Players" />
      <div className="scr-main">
        <div className="scr-sec">
          <div className="player">
            <i>{PLAYER.initials}</i>
            <div>
              <b>{PLAYER.name}</b>
              <small>
                {PLAYER.team} · {PLAYER.since}
              </small>
            </div>
          </div>
          <div className="stats">
            {PLAYER.stats.map(([k, v]) => (
              <span key={k}>
                {k}
                <b>{v}</b>
              </span>
            ))}
          </div>
        </div>
        <div className="scr-sec">
          <p className="scr-meta">This season</p>
          <div className="club-card">
            <ResultsList versus />
          </div>
        </div>
        <div className="scr-sec">
          <p className="scr-meta">Career</p>
          <div className="club-card">
            <table className="club-tbl career">
              <thead>
                <tr>
                  <th className="l">Season</th>
                  <th className="l">Team</th>
                  <th>G</th>
                  <th>Pts</th>
                  <th>Best</th>
                </tr>
              </thead>
              <tbody>
                {PLAYER.career.map((c) => (
                  <tr key={c.season}>
                    <td className="l">{c.season}</td>
                    <td className="l">{c.team}</td>
                    <td>{c.games}</td>
                    <td>{c.points}</td>
                    <td>{c.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <TabBar on="Players" />
    </div>
  );
}
