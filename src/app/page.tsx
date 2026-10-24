import type { Metadata } from "next";
import { og, SITE, CODES } from "@/lib/site";
import { INTRO } from "@/lib/intro";
import { ArrowLink, Button } from "@/components/Button";
import { InlineScript } from "@/components/InlineScript";
import { Lines } from "@/components/Lines";
import { Loader } from "@/components/Loader";
import { Marquee } from "@/components/Marquee";
import { PlayHQPanel } from "@/components/PlayHQPanel";
import { Rail } from "@/components/Rail";
import { Rise } from "@/components/motion/Rise";
import { Device } from "@/components/sample/Device";
import { AdminScreen, ClubHome, EventScreen, FixturesScreen, LadderScreen, MatchCentre, PlayerScreen } from "@/components/sample/Screens";
import { HeroScene } from "@/components/home/Hero";
import { Scenes, type Scene } from "@/components/home/Scenes";
import { FIXTURES, FIXTURES_B, LADDER, ROUND, SAMPLE_CLUB, clubName, clubShort } from "@/content/sample";
import "./home.css";

export const metadata: Metadata = {
  title: { absolute: `${SITE.name}: ${SITE.tagline}` },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: og("/", "/og/home.png", "Websport: Club websites that keep up with the season."),
};

/** The codes marquee: the seven codes and "Any code". No codes are added (DESIGN.md §8). */
const MARQUEE = [...CODES, "Any code"];

/**
 * 03 How it works. Step 02's "shown to the committee before it is built" is a process claim the founder has not
 * confirmed, so the fallback line ships (BRIEF §4.5).
 */
const STEPS = [
  ["A call about your club.", "Your teams, your season and what the committee needs the site to do."],
  ["Design, in your colours.", "Your crest and colours become a home page, a match page and a system for the rest."],
  ["Build and launch.", "We build it, connect PlayHQ, and hand the committee the keys."],
] as const;

const SCENES: Scene[] = [
  {
    title: "Fixtures and results, from PlayHQ.",
    body: "Every team, every round, every result, pulled from PlayHQ and matched to the right club.",
    kind: "desk",
    screen: (
      <Device kind="desk" tag="Sample data">
        <FixturesScreen />
      </Device>
    ),
  },
  {
    title: "The ladder, live.",
    body: "Updated when a result is posted, with your club's row marked. Every grade, every season.",
    kind: "desk",
    screen: (
      <Device kind="desk" tag="Sample data">
        <LadderScreen />
      </Device>
    ),
  },
  {
    title: "Events people say yes to.",
    body: "Presentation nights, working bees, registration days. Members RSVP and pay on the page; the committee sees the headcount.",
    kind: "phone",
    screen: (
      <Device kind="phone" tag="Sample data">
        <EventScreen />
      </Device>
    ),
  },
  {
    title: "A page for every player.",
    body: "Current squads and the people who came before them: seasons, teams and career numbers.",
    kind: "phone",
    screen: (
      <Device kind="phone" tag="Sample data">
        <PlayerScreen />
      </Device>
    ),
  },
  {
    title: "Run by the committee.",
    body: "Announcements, events, players and pages, updated by the club without calling us.",
    kind: "desk",
    screen: (
      <Device kind="desk" tag="Sample data">
        <AdminScreen />
      </Device>
    ),
  },
];

/** Home (BRIEF §4). Hero, codes marquee, 01 the five screens (pinned), 02 PlayHQ scoreboard, 03 how it works, footer. */
export default function Home() {
  return (
    <>
      <section id="hero" className="hero on-night" aria-labelledby="hero-h">
        <div className="wrap hero-wrap">
          <p className="kicker hero-kicker hero-in" style={{ "--i": 0 } as React.CSSProperties}>
            For community sports clubs
          </p>
          <h1 id="hero-h" className="display hero-h">
            <Lines text="Club websites|that keep up|with the season" accent="." />
          </h1>
          <div className="hero-side split hero-in" style={{ "--i": 2 } as React.CSSProperties}>
            <p className="lede">
              A site that knows the score. Fixtures, results and ladders arrive from PlayHQ on their own; the committee runs everything
              else from one place, in the club&rsquo;s colours.
            </p>
            <div className="actions">
              <Button href="/contact">Start a project</Button>
              <ArrowLink href="/work">See the work</ArrowLink>
            </div>
          </div>
        </div>
        <div className="hero-stage">
          <div className="wrap">
            <HeroScene
              desk={
                <Device kind="desk" tag="Sample data" label={`Sample club website for ${SAMPLE_CLUB.name}: next match, live score, ladder, fixtures and events`}>
                  <ClubHome />
                </Device>
              }
              phone={
                <Device kind="phone" tag="Sample data" label={`Sample club website for ${SAMPLE_CLUB.name} on a phone: live score, ladder and next fixtures`}>
                  <MatchCentre />
                </Device>
              }
            />
            <p className="label hero-cap">
              <b>{SAMPLE_CLUB.name}</b> · Sample club site
            </p>
          </div>
        </div>
      </section>
      <Loader />
      <InlineScript html={INTRO} />

      <Marquee items={MARQUEE} label={`Codes we build for: ${MARQUEE.join(", ")}`} />

      {/* 01. What a club site should do: the five screens, rail and heading inside the pinned frame. */}
      <Scenes scenes={SCENES} />

      {/* 02. PlayHQ, wired in: the scoreboard updates as it crosses the viewport. */}
      <section id="playhq" className="sec on-night phq" aria-labelledby="phq-h">
        <div className="wrap">
          <Rail index="02" name="PlayHQ, wired in" note="Fixtures · Results · Ladders" />
          <Rise className="sec-head">
            <h2 id="phq-h" className="h2 rise">
              The round changes. So does the site<span className="accent">.</span>
            </h2>
            <p className="lede rise">
              Fixtures, results and ladders come from the PlayHQ API, matched to every team and opponent. Nobody on the committee retypes
              a thing.
            </p>
          </Rise>
          <PlayHQPanel
            round={ROUND}
            fixtures={[...FIXTURES, ...FIXTURES_B].map((f) => ({ id: f.id, home: clubName(f.home), away: clubName(f.away), grade: f.grade, when: f.when, venue: f.venue, live: f.live }))}
            ladder={LADDER.map((r) => ({ ...r, club: clubName(r.club), short: clubShort(r.club) }))}
          />
        </div>
      </section>

      {/* 03. How it works. */}
      <section className="sec how" aria-labelledby="how-h">
        <div className="wrap">
          <Rail index="03" name="How it works" note="One team, first call to launch" />
          <Rise className="sec-head">
            <h2 id="how-h" className="h2 rise">
              From a call to launch<span className="accent">.</span>
            </h2>
            <div className="stack rise">
              <p className="lede">The people who design your site build it. One team from the first call to launch.</p>
              <ArrowLink href="/studio">About the studio</ArrowLink>
            </div>
          </Rise>
          <Rise>
            <ol className="cells steps" style={{ "--n": 3 } as React.CSSProperties}>
              {STEPS.map(([t, b], i) => (
                <li key={t} className="cell step rise">
                  <div className="art" aria-hidden="true">
                    {i === 0 ? (
                      <div className="art-chips">
                        <span>AFL</span>
                        <span>Netball</span>
                        <span>Cricket</span>
                      </div>
                    ) : i === 1 ? (
                      <div className="art-crest">
                        <i className="art-disc" />
                        <span className="art-sw">
                          <i style={{ background: "#0f3d2e" }} />
                          <i style={{ background: "#ffb020" }} />
                          <i style={{ background: "#fff" }} />
                        </span>
                        <span className="art-hex">#0F3D2E</span>
                      </div>
                    ) : (
                      <div className="art-launch">
                        <span className="art-pill">
                          <i />
                          PlayHQ connected
                        </span>
                        <span className="art-dom">{SAMPLE_CLUB.domain}</span>
                      </div>
                    )}
                  </div>
                  <span className="index step-i">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="h3 step-t">
                    <span className="sr-only">{i + 1}. </span>
                    {t}
                  </h3>
                  <p className="step-b">{b}</p>
                </li>
              ))}
            </ol>
          </Rise>
        </div>
      </section>
    </>
  );
}
