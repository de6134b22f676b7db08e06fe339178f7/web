import type { CaseStudy, Shot } from "./types";
import { captures, type CaptureFile } from "./captures.generated";

type File = CaptureFile<"lang-lang">;
const dims = captures["lang-lang"];

/** A capture with its real dimensions from the generated file (prebuild). */
const shot = (file: File, alt: string, caption?: string): Shot => ({ file, alt, ...dims[file], caption });

const fixturesFull = shot(
  "fixtures-full",
  "Lang Lang fixtures page: the next round's matches by team, opponent, time, venue and grade, from PlayHQ",
);
const home = shot(
  "home",
  "Lang Lang Cricket Club home page with an announcement bar and the club’s headline over the Caldermeade pavilion",
);

/**
 * Lang Lang Cricket Club (BRIEF 5.2). Primary features are fixed in the club's order:
 * 1 PlayHQ fixtures, 2 every side matched to its club, 3 events with RSVP, 4 announcements, 5 players present and past.
 * `at`/`to` windows: `at` is the top of the window (the reduced-motion frame), `to` is where the window's bottom
 * edge rests after the pan. Both frames are checked by eye at 1440 (scratchpad/windows); neither may show an empty
 * state, a footer or an all-zero ladder.
 */
export const langLang: CaseStudy = {
  slug: "lang-lang",
  client: "Lang Lang Cricket Club",
  kind: "Website & club platform",
  tags: ["PlayHQ", "Club logos", "Events & RSVP", "Announcements", "Player profiles"],
  headline: "A club that lives|on its website",
  outcome: "Fixtures from PlayHQ, events with RSVP, notices in one place and a profile for every player, run by the committee.",
  intro:
    "Lang Lang Cricket Club had a 2019 Wix site and a Facebook page doing all the talking. We rebuilt it as the centre of the club: fixtures from PlayHQ, events people can RSVP to, notices in one place and a profile for every player, past and present.",
  live: { href: "https://langlangcricketclub.com", label: "langlangcricketclub.com" },
  stack: ["Next.js App Router", "Postgres + Drizzle", "Vercel Blob", "PlayHQ API", "Admin CMS"],
  got: ["Fixtures from PlayHQ", "Events & RSVP", "Announcements", "Player profiles", "An admin the committee runs"],
  summary:
    "How Websport rebuilt Lang Lang Cricket Club’s website as the centre of the club: PlayHQ fixtures, results and ladders, events with RSVP, announcements and a profile for every player, present and past, run by the committee.",
  hero: home,
  // The full capture ends on the club site's "Proudly supported by" heading with its logos cut off; stop at the
  // bottom of the hero photo above it.
  heroRatio: "2880 / 1672",
  before: {
    heading: "From a brochure to a clubhouse.",
    old: {
      label: "Before · 2019 Wix site",
      body: "Five static pages, a crest and a long paragraph. For anything current, the site pointed people to Facebook.",
      shot: shot("before", "The previous Lang Lang Cricket Club Wix website: a crest, five menu links and a long block of italic text"),
    },
    now: {
      label: "Now · langlangcricketclub.com",
      body: "The club’s front door: what’s on this week, the next match, and who to talk to.",
      shot: home,
    },
  },
  vision: {
    heading: "It’s not all stats and titles.",
    paragraphs: [
      "The committee didn’t want a brochure. They wanted the club itself to revolve around the website: the place you check before Saturday, RSVP for the presentation night, and come back to years later to find your name.",
      "So the brief became a community platform. Keep the fixtures honest by pulling them from PlayHQ. Make events something you can act on. And give every player, past and present, a digital footprint, including the stories that never make a scorecard.",
    ],
  },
  built: {
    heading: "Everything the club does, in one place.",
    note: "In the order the club cares about most",
    primary: [
      {
        no: "01",
        title: "Fixtures, live from PlayHQ.",
        body: "Every Lang Lang side and the next round come straight from the PlayHQ API, season by season. No one retypes a fixture list again.",
        shots: [fixturesFull],
        // Pans from the page head down to the end of the next-round list (the window rests above "Latest results",
        // which is empty before round one).
        at: 0,
        to: 0.48,
        zoomX: 0.1,
        caption: "Fixtures page: the next round for every side, from PlayHQ",
      },
      {
        no: "02",
        title: "Every side, every opponent.",
        body: "Every Lang Lang side and every opponent in the PlayHQ data is matched to the right club, so fixtures, ladders and match pages name the club correctly without anyone retyping.",
        // Captured on the last completed season (Summer 2025/26), so the ladder carries a full season of numbers.
        shots: [shot("team-full", "Lang Lang B Grade team page: the season’s PlayHQ ladder, eight clubs with played, won, lost and points, Lang Lang’s row marked")],
        // A 2:1 window: from the season picker to the bottom of the eight-row ladder (above the fixtures block,
        // which is empty once the season is over).
        at: 0.15,
        to: 0.445,
        ratio: "2 / 1",
        zoomX: 0.1,
        caption: "B Grade team page: the season’s ladder, every opponent named by club",
      },
      {
        no: "03",
        title: "Events people say yes to.",
        body: "Training nights, launch nights and presentation dinners each get a page with a live headcount. Members RSVP in a tap and can add their photos afterwards.",
        shots: [
          shot(
            "event-rsvp-full",
            "Lang Lang event page for the Legends Launch Night: date and time, the event poster and the event details",
          ),
        ],
        // Rests on the poster, the details and the RSVP panel (above the photo strip).
        at: 0,
        to: 0.525,
        zoomX: 0.1,
        caption: "Legends Launch Night: details, attendance and the RSVP panel",
      },
      {
        no: "04",
        title: "Every notice, in one place.",
        body: "Change of time, working bees, game week. Announcements post once and surface across the site, from the banner on the home page to the Clubhouse archive.",
        shots: [shot("announcements-full", "Lang Lang Clubhouse announcements page: dated club notices in a single list")],
        // Rests on the second post, above the capture's footer.
        at: 0,
        to: 0.7,
        caption: "The Clubhouse announcements archive",
        phone: "Play: the Clubhouse notices",
      },
      {
        no: "05",
        title: "Players, present and past.",
        body: "Current squads and the players who came before them each have a profile with their seasons, teams and career batting and bowling, built from PlayHQ data.",
        shots: [
          shot(
            "player-full",
            "A Lang Lang player profile: the season-by-season batting and fielding table and career totals from PlayHQ",
          ),
        ],
        // Privacy (BRIEF 5.2): the window starts below the player's name block, on the summary tiles and the
        // batting table, and rests at the bottom of the bowling table. No name is inside either frame.
        at: 0.21,
        to: 0.7,
        zoomX: 0.1,
        caption: "A player profile: the season batting table from PlayHQ",
      },
    ],
  },
  close: {
    heading: "The committee runs it.",
    note: "No developer in the loop",
    body: "A notice goes up before training. A presentation night gets its page and its RSVP list the day it is decided. A new player’s profile is there by the first round. The committee does all of it from the site’s own admin, in their colours, on their domain.",
    outcome: "Fixtures, events, notices and players in one place, on the club’s own domain.",
  },
  mobile: {
    shots: [
      { label: "Home", shot: shot("mobile-home", "Lang Lang home page on a phone: announcement bar, club headline, next match card") },
      {
        label: "Play: the Clubhouse notices",
        shot: shot("mobile-announcements-full", "Lang Lang Clubhouse announcements on a phone: dated club notices in a single list"),
      },
    ],
  },
};
