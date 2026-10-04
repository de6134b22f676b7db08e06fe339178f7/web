import type { CaseStudy, Shot } from "./types";
import { captures, type CaptureFile } from "./captures.generated";

type File = CaptureFile<"lang-lang">;
const dims = captures["lang-lang"];

/** A capture with its real dimensions from the generated file (prebuild). */
const shot = (file: File, alt: string, caption?: string): Shot => ({ file, alt, ...dims[file], caption });

const fixturesFull = shot(
  "fixtures-full",
  "Lang Lang fixtures page, full page: next round matches by team, opponent, time, venue and grade from PlayHQ, then every side in the Our teams grid with its ladder position",
);
const home = shot(
  "home",
  "Lang Lang Cricket Club home page with an announcement bar and the club’s headline over the Caldermeade pavilion",
);

/**
 * Lang Lang Cricket Club (DESIGN.md 5.3). Primary features are fixed in founder order:
 * 1 PlayHQ fixtures/results/ladders, 2 club logos, 3 events RSVP + payments, 4 announcements, 5 players present and past.
 * `scroll` windows are first estimates; re-check by eye at 1280/1440/1920 (never end on a footer).
 */
export const langLang: CaseStudy = {
  slug: "lang-lang",
  client: "Lang Lang Cricket Club",
  kind: "Website & club platform",
  tags: ["PlayHQ", "Club logos", "Events & payments", "Announcements", "Player profiles"],
  headline: "A club that lives on its website.",
  intro:
    "Lang Lang Cricket Club had a 2019 Wix site and a Facebook page doing all the talking. We rebuilt it as the centre of the club: fixtures from PlayHQ with every team matched to its club logo, events people can RSVP and pay for, notices in one place, a profile for every player, past and present, and a home for the stories that make Lang Lang what it is.",
  live: { href: "https://langlangcricketclub.com", label: "langlangcricketclub.com" },
  stack: ["Next.js App Router", "Postgres + Drizzle", "Vercel Blob", "PlayHQ API", "Admin CMS"],
  summary:
    "How Websport rebuilt Lang Lang Cricket Club’s website as the centre of the club: PlayHQ fixtures and ladders, club logos matched from PlayHQ, events with RSVP and payments, announcements and player profiles, present and past.",
  hero: home,
  og: home,
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
    label: "The club",
    heading: "It’s not all stats and titles.",
    paragraphs: [
      "The committee didn’t want a brochure. They wanted the club itself to revolve around the website: the place you check before Saturday, RSVP for the presentation night, and come back to years later to find your name.",
      "So the brief became a community platform. Keep the fixtures honest by pulling them from PlayHQ. Make events something you can act on. And give every player, past and present, a digital footprint, including the stories that never make a scorecard.",
    ],
  },
  built: {
    heading: "Everything the club does, in one place.",
    note: "In the order the club cares about most.",
    primary: [
      {
        no: "01",
        title: "Fixtures, live from PlayHQ.",
        body: "Every Lang Lang side, the next round, results and ladders come straight from the PlayHQ API, season by season. No one retypes a fixture list again.",
        shots: [fixturesFull],
        path: "/fixtures",
        scroll: [0, 0.3],
        caption: "Fixtures page: next round and every side’s ladder position, from PlayHQ",
      },
      {
        no: "02",
        title: "Every team matched to its club.",
        body: "Every Lang Lang side and every opponent in the PlayHQ data is matched to the right club, and to that club’s logo, so fixtures, ladders and match pages name the right club without anyone hunting for images or retyping names.",
        // No public page renders opponent logos (DESIGN 6.6; re-checked 2026-10-04 on /, /fixtures, a team page and
        // a match page: only the Lang Lang crest renders). So the claim is what the capture proves: one side's team
        // page, where every opponent in its PlayHQ ladder and fixtures is resolved to its club by name. The logo
        // matching is stated in the body, never shown with mock crests.
        shots: [shot("team-full", "Lang Lang B Grade team page: the season’s PlayHQ ladder with every opponent club, then the side’s upcoming fixtures by opponent, time and venue")],
        path: "/fixtures?team=9ad1241c…",
        // Both rest points sit on clean edges: the white band under the season picker, then the gap above LADDER.
        scroll: [0.209, 0.278],
        indexAt: 0.209,
        caption: "B Grade team page: the PlayHQ ladder and fixtures, every opponent named by club",
      },
      {
        no: "03",
        title: "Events you can RSVP and pay for.",
        body: "Training nights, launch nights and presentation dinners each get a page with a live headcount. Members RSVP in a tap, pre-book meals and pay through the event’s payment link, and can add their photos afterwards.",
        shots: [
          shot(
            "event-rsvp-full",
            "Lang Lang event page for the Legends Launch Night, full page: date, venue and details, the attendance list, and the RSVP panel",
          ),
        ],
        path: "/events/16",
        scroll: [0, 0.45],
        caption: "Legends Launch Night: details, attendance and the RSVP panel",
      },
      {
        no: "04",
        title: "Every notice, in one place.",
        body: "Change of time, working bees, game week. Announcements post once and surface across the site, from the banner on the home page to the Clubhouse archive.",
        shots: [shot("announcements-full", "Lang Lang Clubhouse announcements page, full page: dated club notices in a single list")],
        path: "/announcements",
        // Stops on the second post, before the capture's footer.
        scroll: [0, 0.22],
        caption: "The Clubhouse announcements archive",
      },
      {
        no: "05",
        title: "Players, present and past.",
        body: "Current squads and the players who came before them each have a profile with their seasons, teams and career batting and bowling, built from PlayHQ data.",
        shots: [
          shot(
            "player-full",
            "A Lang Lang player profile, full page: games, runs and wickets, then season-by-season batting and bowling tables",
          ),
        ],
        path: "/players/alexander-giacco",
        // Starts just below the club's nav bar (73 of 1967 css px), so no nav label is sliced by the frame chrome;
        // stops at the summary stats and the head of the batting table (W21), before the tables dominate.
        scroll: [0.038, 0.095],
        caption: "A player profile: seasons, teams and career stats from PlayHQ",
      },
    ],
    supporting: [
      {
        title: "Stories by the club, for the club.",
        body: "Anyone can write about a match, a season or what the club means to them, add a photo, and submit it. Drafts save to a private link, and a committee member reviews every story before it joins the club’s history.",
        shot: shot(
          "story-full",
          "A published Lang Lang club story titled More Than Cricket: Finding Home at Lang Lang, with a photo of the team walking out and the story text",
        ),
        href: "https://langlangcricketclub.com/history/more-than-cricket-finding-home-at-lang-lang",
      },
      {
        title: "Run by the committee, not a developer.",
        body: "Behind a password, the committee manages events, announcements, stories, players, the committee page, documents, the gallery and sponsors, and syncs from PlayHQ when they need to.",
        // Eight managed areas (numbers[1] counts these); the PlayHQ resync is an action, shown apart from the list.
        chips: ["Events", "Announcements", "Stories", "Players", "Committee", "Documents", "Gallery", "Sponsors"],
        action: "Resync from PlayHQ",
        note: "Admin not shown: it’s behind the committee’s password.",
      },
    ],
  },
  numbers: [
    { value: "7", label: "Lang Lang sides synced from PlayHQ" },
    { value: "8", label: "Areas the committee runs without a developer" },
  ],
  excerpt: {
    quote: "When I arrived in Australia in 2024, I was a fresh migrant trying to figure out where I fitted in.",
    href: "https://langlangcricketclub.com/history/more-than-cricket-finding-home-at-lang-lang",
    caption:
      "From “More Than Cricket: Finding Home at Lang Lang”, a member story on the club site, written by Websport’s founder as a club member and reviewed by the committee like every story.",
  },
  mobile: {
    heading: "Built for the sideline, not the desk.",
    shots: [
      { label: "Home", shot: shot("mobile-home", "Lang Lang home page on a phone: announcement bar, club headline, next match card") },
      { label: "Events", shot: shot("mobile-events", "Events list on a phone: upcoming club events with dates, venues and RSVP counts") },
      { label: "Player profile", shot: shot("mobile-player", "Player profile on a phone: name, teams, games, runs and wickets, then the season batting table") },
      {
        label: "Play: the Clubhouse notices",
        play: true,
        shot: shot("mobile-announcements-full", "Lang Lang Clubhouse announcements on a phone, full page: dated club notices in a single list"),
      },
    ],
  },
};
