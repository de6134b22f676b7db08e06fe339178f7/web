/**
 * Illustrative SAMPLE DATA for every sample club screen and the PlayHQ scoreboard (DESIGN.md §5, §7). Fictional
 * clubs and people only; every surface that shows it carries a visible "Sample data" tag. Never mix with Lang Lang
 * or any real club. No invented Websport facts.
 */
export type Club = { id: string; name: string; short: string };

/** The only sample names allowed. "Your club" is Northside Comets. */
export const CLUBS = [
  { id: "nc", name: "Northside Comets", short: "Comets" },
  { id: "rb", name: "Riverbend", short: "Riverbend" },
  { id: "eo", name: "Eastvale Owls", short: "Owls" },
  { id: "bb", name: "Banksia Bay", short: "Banksia" },
  { id: "ib", name: "Ironbark", short: "Ironbark" },
  { id: "wg", name: "Westgate", short: "Westgate" },
] as const satisfies readonly Club[];

export type ClubId = (typeof CLUBS)[number]["id"];
export const clubName = (id: ClubId) => CLUBS.find((c) => c.id === id)!.name;
export const clubShort = (id: ClubId) => CLUBS.find((c) => c.id === id)!.short;

export const SAMPLE_CLUB = { name: "Northside Comets", domain: "northsidecomets.club", season: "2026 season" };

/** Panel heading. */
export const ROUND = "Round 7 · Senior grades";

export type Fixture = {
  id: string;
  home: ClubId;
  away: ClubId;
  when: string;
  venue: string;
  grade: string;
  /** In play: the score as the panel first shows it, and the final score the "round updates" moment counts to. */
  live?: { home: string; away: string; finalHome: string };
  /** Played: the final score. */
  result?: { home: string; away: string };
};
/** This round: one live, two to come. */
export const FIXTURES: Fixture[] = [
  { id: "f1", home: "nc", away: "rb", when: "Sat 1:40 pm", venue: "Ground 2", grade: "A Grade", live: { home: "64", away: "58", finalHome: "71" } },
  { id: "f2", home: "eo", away: "bb", when: "Sat 2:15 pm", venue: "Eastvale Park", grade: "A Grade" },
  { id: "f3", home: "wg", away: "ib", when: "Sun 10:30 am", venue: "Westgate Oval", grade: "A Grade" },
];
/** B Grade, same round: the scoreboard panel lists the senior grades together. */
export const FIXTURES_B: Fixture[] = [
  { id: "b1", home: "rb", away: "nc", when: "Sat 11:40 am", venue: "Riverbend Reserve", grade: "B Grade" },
  { id: "b2", home: "bb", away: "eo", when: "Sat 12:15 pm", venue: "Banksia Bay Oval", grade: "B Grade" },
];
/** Last round, for the results list. */
export const RESULTS: Fixture[] = [
  { id: "r1", home: "nc", away: "ib", when: "Round 6", venue: "Ground 2", grade: "A Grade", result: { home: "82", away: "61" } },
  { id: "r2", home: "nc", away: "wg", when: "Round 6", venue: "Westgate Oval", grade: "B Grade", result: { home: "44", away: "49" } },
  { id: "r3", home: "nc", away: "eo", when: "Round 6", venue: "Ground 1", grade: "Under 16", result: { home: "58", away: "40" } },
];

/** The live match, quarter by quarter (home–away), and where it is now. */
export const QUARTERS = [
  { q: "Q1", score: "18–14" },
  { q: "Q2", score: "34–30" },
  { q: "Q3", score: "50–44" },
  { q: "Q4", score: "Live" },
] as const;

/** The live match's leading scorers (club voice, fictional) and the Comets' next game: the desk live card's last row. */
export const LIVE_SCORERS = [
  { name: "P. Raman", pts: 18 },
  { name: "M. Okafor", pts: 12 },
] as const;
export const NEXT_GAME = { label: "Next · Round 8", line: "v Eastvale Owls · Sat 1:40 pm" };

export type Form = "W" | "L";
/** Last five results per club, oldest first. */
export const FORM: Record<ClubId, readonly Form[]> = {
  nc: ["W", "W", "L", "W", "W"],
  eo: ["W", "L", "W", "W", "W"],
  rb: ["L", "W", "W", "L", "W"],
  ib: ["W", "L", "L", "W", "L"],
  bb: ["L", "L", "W", "L", "L"],
  wg: ["L", "L", "L", "W", "L"],
};

export type LadderRow = {
  pos: number;
  club: ClubId;
  p: number;
  w: number;
  l: number;
  pts: number;
  ours?: boolean;
  /** Before the round updates: the points and position the row animates from. */
  from?: { pos: number; pts: number };
};
/** The ladder AFTER the live match finishes (the DOM order; what reduced motion and no-JS show). */
export const LADDER: LadderRow[] = [
  { pos: 1, club: "nc", p: 7, w: 5, l: 2, pts: 20, ours: true, from: { pos: 2, pts: 16 } },
  { pos: 2, club: "eo", p: 7, w: 5, l: 2, pts: 20, from: { pos: 1, pts: 20 } },
  { pos: 3, club: "rb", p: 7, w: 4, l: 3, pts: 16 },
  { pos: 4, club: "ib", p: 7, w: 3, l: 4, pts: 12 },
  { pos: 5, club: "bb", p: 7, w: 2, l: 5, pts: 8 },
  { pos: 6, club: "wg", p: 7, w: 1, l: 6, pts: 4 },
];

export const EVENTS = [
  { id: "e1", name: "Presentation night", when: "Sat 19 Sep · 7:00 pm", where: "Clubrooms", going: 86, spots: 120, price: "$45" },
  { id: "e2", name: "Working bee", when: "Sun 27 Sep · 9:00 am", where: "Ground 2", going: 23, spots: 40, price: "Free" },
  { id: "e3", name: "Junior registration day", when: "Sat 10 Oct · 10:00 am", where: "Clubrooms", going: 41, spots: 200, price: "Free" },
] as const;

/** Who's going to EVENTS[0]: fictional members. */
export const ATTENDEES = [
  { name: "Mia Okafor", note: "Table 4 · 2 seats" },
  { name: "Tom Haddad", note: "Table 4 · 1 seat" },
  { name: "Lena Vukovic", note: "Table 9 · 4 seats" },
  { name: "Sam Pryor", note: "Table 2 · 2 seats" },
] as const;
export const ATTENDEES_MORE = 82;

export const PLAYER = {
  name: "Priya Raman",
  initials: "PR",
  team: "A Grade · #7",
  since: "Comets since 2019",
  stats: [
    ["Games", "112"],
    ["Season", "7"],
    ["Points", "248"],
    ["Best", "31"],
  ],
  career: [
    { season: "2026", team: "A Grade", games: 7, points: 248, best: 31 },
    { season: "2025", team: "A Grade", games: 18, points: 512, best: 38 },
    { season: "2024", team: "B Grade", games: 16, points: 390, best: 29 },
    { season: "2023", team: "Under 18", games: 14, points: 301, best: 27 },
  ],
} as const;

export const NOTICES = [
  { title: "Round 7 moved to Ground 2", by: "Secretary", when: "Today", status: "Published" },
  { title: "Presentation night: book your table", by: "Social committee", when: "Yesterday", status: "Published" },
  { title: "Finals ticketing", by: "President", when: "Draft", status: "Draft" },
] as const;

/** The club home's "From the Clubhouse" strip: a figure, a mono label and a title. */
export const POSTS = [
  { fig: "82–61", label: "Match report · R6", title: "Three wins from three on a wet Saturday", meta: "2 days ago" },
  { fig: "120", label: "Events · Tables open", title: "Presentation night tables now open", meta: "4 days ago" },
  { fig: "U16", label: "Club news", title: "Meet the new Under 16 coaching group", meta: "Last week" },
] as const;

/** Admin "This week" summary chips. */
export const ADMIN_SUMMARY = [
  ["3", "notices published"],
  ["150", "RSVPs"],
  ["84", "player pages"],
] as const;
