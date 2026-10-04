/**
 * Home plate data (DESIGN.md v4 §5.3, §6.1). ILLUSTRATIVE SAMPLE DATA ONLY: fictional clubs (content/sample.ts),
 * fictional people, fictional numbers. Every surface that renders this carries a "Sample data" tag.
 * No client work, no real clubs, no invented Websport facts.
 */
import { sport, type SportId } from "@/content/sample";

/* ---------- sports (hero roller, sports index, kit switch) ---------- */
/** Roller cycle (M3): anything → AFL → soccer → basketball → baseball → netball → cricket → hockey. */
export const ROLLER: { id: SportId; word: string }[] = [
  { id: "any", word: "anything." },
  { id: "afl", word: "AFL." },
  { id: "soccer", word: "soccer." },
  { id: "basketball", word: "basketball." },
  { id: "baseball", word: "baseball." },
  { id: "netball", word: "netball." },
  { id: "cricket", word: "cricket." },
  { id: "hockey", word: "hockey." },
];

/** Sports index rows (§6.1 H2) in order; row 08 is "And the rest" (the generic kit + the grid ground). */
export const SPORT_ROWS: { id: SportId; name: string; data: string; caption: string }[] = [
  { id: "afl", name: "AFL", data: "Fixtures · Ladders · Results · Players", caption: "Ground 01 · AFL oval" },
  { id: "soccer", name: "Soccer", data: "Fixtures · Ladders · Results · Players", caption: "Ground 02 · Soccer pitch, 105 × 68 m" },
  { id: "basketball", name: "Basketball", data: "Fixtures · Ladders · Results · Players", caption: "Ground 03 · Basketball court, 28 × 15 m" },
  { id: "baseball", name: "Baseball", data: "Fixtures · Ladders · Results · Players", caption: "Ground 04 · Baseball diamond" },
  { id: "netball", name: "Netball", data: "Fixtures · Ladders · Results · Players", caption: "Ground 05 · Netball court, 30.5 × 15.25 m" },
  { id: "cricket", name: "Cricket", data: "Fixtures · Ladders · Results · Players", caption: "Ground 06 · Cricket oval" },
  { id: "hockey", name: "Hockey", data: "Fixtures · Ladders · Results · Players", caption: "Ground 07 · Hockey pitch, 91.4 × 55 m" },
  { id: "any", name: "And the rest", data: "If it’s on PlayHQ, ask us", caption: "Ground 08 · Any field: a grid" },
];

/** Kit chips (M24): AFL · Soccer · … · Any. */
export const KIT_CHIPS: { value: SportId; label: string }[] = [
  ...(["afl", "soccer", "basketball", "baseball", "netball", "cricket", "hockey"] as const).map((id) => ({ value: id, label: sport(id).label })),
  { value: "any", label: "Any" },
];

export const sportName = (id: SportId) => (id === "any" ? "any sport" : id === "afl" ? "AFL" : id);

/* ---------- scores ---------- */
type Raw = number | [number, number];
/** Winner/loser score pairs per sport, six games (index = game). AFL [goals, behinds]; cricket [wickets, runs]. */
const RESULT_SCORES: Record<SportId, [Raw, Raw][]> = {
  any: [[3, 1], [2, 0], [4, 3], [2, 1], [3, 2], [1, 0]],
  afl: [[[12, 9], [8, 7]], [[10, 12], [9, 6]], [[14, 8], [11, 10]], [[9, 11], [7, 5]], [[13, 6], [12, 9]], [[8, 14], [7, 9]]],
  soccer: [[2, 1], [3, 0], [1, 0], [4, 2], [2, 1], [3, 1]],
  basketball: [[68, 61], [74, 59], [81, 77], [66, 52], [71, 70], [58, 49]],
  baseball: [[5, 3], [7, 2], [4, 3], [6, 1], [3, 2], [8, 5]],
  netball: [[42, 38], [51, 36], [47, 45], [39, 30], [44, 43], [55, 41]],
  cricket: [[[6, 182], [9, 170]], [[4, 201], [10, 155]], [[7, 164], [10, 160]], [[3, 146], [8, 145]], [[5, 190], [9, 188]], [[2, 120], [10, 118]]],
  hockey: [[3, 2], [4, 1], [2, 0], [3, 1], [1, 0], [5, 2]],
};

export function fmtScore(id: SportId, s: Raw): string {
  if (Array.isArray(s)) {
    if (id === "afl") return `${s[0]}.${s[1]} (${s[0] * 6 + s[1]})`;
    return s[0] >= 10 ? `${s[1]}` : `${s[0]}/${s[1]}`;
  }
  return String(s);
}

/* ---------- P1 fixtures & results ---------- */
export type Grade = "all" | "sen" | "jun";
export type Fixture = { id: string; round: string; date: string; grade: Exclude<Grade, "all">; home: string; away: string; time: string; venue: string };
export type Result = { id: string; round: string; date: string; grade: Exclude<Grade, "all">; home: string; away: string; win: boolean };

export const UPCOMING: Fixture[] = [
  { id: "u1", round: "R9", date: "Sat 11", grade: "sen", home: "nc", away: "sw", time: "1:40 pm", venue: "Ground 2" },
  { id: "u2", round: "R9", date: "Sat 11", grade: "jun", home: "hc", away: "nc", time: "9:00 am", venue: "Hillcrest Reserve" },
  { id: "u3", round: "R10", date: "Sat 18", grade: "sen", home: "gh", away: "nc", time: "2:15 pm", venue: "Granite Hill Park" },
  { id: "u4", round: "R10", date: "Sat 18", grade: "jun", home: "nc", away: "ls", time: "10:30 am", venue: "Ground 1" },
  { id: "u5", round: "R11", date: "Sat 25", grade: "sen", home: "nc", away: "rf", time: "1:40 pm", venue: "Ground 2" },
  { id: "u6", round: "R11", date: "Sun 26", grade: "jun", home: "eo", away: "nc", time: "8:30 am", venue: "Eastvale Park" },
];

// Season 2026 (matches the sync log and the player span): R6 Sat 21 Mar … R11 Sat 25 / Sun 26 Apr.
export const RESULTS: Result[] = [
  { id: "r1", round: "R8", date: "Sat 4", grade: "sen", home: "nc", away: "rb", win: true },
  { id: "r2", round: "R8", date: "Sat 4", grade: "jun", home: "eo", away: "nc", win: false },
  { id: "r3", round: "R7", date: "Sat 28", grade: "sen", home: "bb", away: "nc", win: true },
  { id: "r4", round: "R7", date: "Sun 29", grade: "jun", home: "nc", away: "ib", win: true },
  { id: "r5", round: "R6", date: "Sat 21", grade: "sen", home: "nc", away: "wg", win: false },
  { id: "r6", round: "R6", date: "Sat 21", grade: "jun", home: "kp", away: "nc", win: true },
];

/** Home/away score strings for result `i` in `id`'s format (our club = nc; `win` is from our side). */
export function resultScore(id: SportId, i: number, r: Result): [string, string] {
  const [w, l] = RESULT_SCORES[id][i % 6];
  const homeIsUs = r.home === "nc";
  const homeWins = homeIsUs === r.win;
  const [h, a] = homeWins ? [w, l] : [l, w];
  return [fmtScore(id, h), fmtScore(id, a)];
}

/** The Next up card (hero) and logos "Next match" strip: Northside Comets v Saltwater, last meeting score. */
export const NEXT_UP = { home: "nc", away: "sw", meta: "Sat 1:40 pm · Ground 2 · Seniors" };
export function nextUpScore(id: SportId): [string, string] {
  const [h, a] = sport(id).score;
  return [h, a];
}

/* ---------- P2 ladder ---------- */
export type Team = { c: string; p: number; w: number; l: number; d: number; f: number; a: number };
const LADDER_BASE: { c: string; w: number; l: number; d: number; fr: number; ar: number }[] = [
  { c: "rb", w: 6, l: 2, d: 0, fr: 1.18, ar: 0.88 },
  { c: "nc", w: 5, l: 3, d: 0, fr: 1.1, ar: 0.95 },
  { c: "eo", w: 5, l: 2, d: 1, fr: 1.06, ar: 0.94 },
  { c: "bb", w: 4, l: 4, d: 0, fr: 1, ar: 1.02 },
  { c: "ib", w: 2, l: 5, d: 1, fr: 0.9, ar: 1.1 },
  { c: "wg", w: 1, l: 7, d: 0, fr: 0.82, ar: 1.16 },
];
/** Average score per team per game, used to scale for/against into each sport's range. */
export const PER_GAME: Record<SportId, number> = { any: 3, afl: 80, soccer: 1.8, basketball: 66, baseball: 5, netball: 45, cricket: 160, hockey: 2.5 };
export const hasDraws = (id: SportId) => sport(id).cols.includes("D");

export function ladderBase(id: SportId): Team[] {
  const s = PER_GAME[id];
  const draws = hasDraws(id);
  return LADDER_BASE.map((t) => {
    const d = draws ? t.d : 0;
    const l = draws ? t.l : t.l + t.d;
    const p = t.w + l + d;
    return { c: t.c, p, w: t.w, l, d, f: Math.round(p * s * t.fr), a: Math.round(p * s * t.ar) };
  });
}

export type ColKey = "P" | "W" | "L" | "D" | "%" | "GD" | "PCT" | "Pts";
export function pts(id: SportId, t: Team) {
  const pw = sport(id).ptsWin ?? 0;
  return t.w * pw + t.d * (pw / 2);
}
export function colValue(id: SportId, t: Team, k: string): number {
  switch (k) {
    case "P": return t.p;
    case "W": return t.w;
    case "L": return t.l;
    case "D": return t.d;
    case "%": return t.a ? (t.f / t.a) * 100 : 0;
    case "GD": return t.f - t.a;
    case "PCT": return t.p ? t.w / t.p : 0;
    default: return pts(id, t);
  }
}
export function colText(id: SportId, t: Team, k: string): string {
  const v = colValue(id, t, k);
  if (k === "%") return v.toFixed(1);
  if (k === "GD") return v > 0 ? `+${v}` : String(v);
  if (k === "PCT") return v.toFixed(3).replace(/^0/, "");
  return String(v);
}
/** Ladder order: points (PCT for baseball), then percentage / goal difference. */
export function ladderSort(id: SportId, teams: Team[]): Team[] {
  const primary = sport(id).ptsWin === null ? "PCT" : "Pts";
  const second = sport(id).cols.includes("GD") ? "GD" : "%";
  return [...teams].sort((x, y) => colValue(id, y, primary) - colValue(id, x, primary) || colValue(id, y, second) - colValue(id, x, second));
}

/* ---------- P4 events ---------- */
export const EVENT_NAME: Record<SportId, string> = {
  any: "Season launch night",
  afl: "Footy season launch",
  soccer: "Season kick-off night",
  basketball: "Tip-off night",
  baseball: "Opening day dinner",
  netball: "Season launch night",
  cricket: "Pre-season dinner",
  hockey: "Season launch night",
};
export const AVATARS: [string, string][] = [["MK", "#1D3A8A"], ["JT", "#0F6B4F"], ["AL", "#5B2A86"], ["RP", "#B45309"], ["DS", "#0E7490"]];

/* ---------- P5 notices ---------- */
export type Notice = { id: string; tag: string; text: string; time: string; fresh?: boolean };
export const PINNED = "Junior registrations are open on PlayHQ.";
export const NOTICES: Notice[] = [
  { id: "n1", tag: "Game day", text: "Canteen roster for Saturday is up.", time: "2d" },
  { id: "n2", tag: "Training", text: "Thursday training moves to Ground 2.", time: "3d" },
  { id: "n3", tag: "Club", text: "Committee meeting minutes are in Documents.", time: "5d" },
  { id: "n4", tag: "Events", text: "Presentation night tickets go on sale Monday.", time: "1w" },
];
export const NOTICE_QUEUE: Omit<Notice, "id" | "time">[] = [
  { tag: "Working bee", text: "Working bee Saturday 8 am. Bacon rolls after." },
  { tag: "Events", text: "Season launch RSVPs close Friday." },
  { tag: "Training", text: "Wet weather: tonight’s session is cancelled." },
  { tag: "Club", text: "New sponsor signage goes up this week." },
  { tag: "Game day", text: "Umpires and referees needed for the under 12s." },
];
export const ARCHIVE_BASE = 23;

/* ---------- P6 player ---------- */
export const PLAYERS = {
  // gps: games per season across the player's own span (sums to g).
  now: { n: 7, name: "Sam Okafor", era: "Current squad · Seniors", g: 48, s: 4, a: 2, yrs: [2023, 2026] as [number, number], gps: [10, 12, 12, 14] },
  past: {
    n: 14,
    name: "Jo Whitfield",
    era: "1998–2009 · Past player",
    g: 212,
    s: 12,
    a: 9,
    yrs: [1998, 2009] as [number, number],
    gps: [8, 12, 16, 19, 20, 21, 22, 21, 20, 19, 18, 16],
  },
};
export const STAT3: Record<SportId, [number, number]> = {
  any: [96, 840],
  afl: [31, 268],
  soccer: [12, 87],
  basketball: [412, 3104],
  baseball: [38, 402],
  netball: [286, 2210],
  cricket: [640, 5120],
  hockey: [14, 121],
};

/* ---------- 04 kit ---------- */
export const KIT: { n: string; t: string; d: string }[] = [
  { n: "07", t: "Stories", d: "Members write about a match, a season or what the club means to them. A committee member reviews every story before it goes up." },
  { n: "08", t: "Committee admin", d: "A password-protected admin where officials manage events, notices, players, documents and sponsors, and resync PlayHQ when they need to." },
  { n: "09", t: "Sponsors", d: "Sponsor tiers with logos and links that the committee can update when a deal is signed, not when a developer is free." },
  { n: "10", t: "Documents", d: "Constitution, policies, codes of conduct and AGM minutes in one place, current version on top." },
  { n: "11", t: "Gallery", d: "Photos from game day and presentation night, grouped by event and season." },
  { n: "12", t: "Committee & contacts", d: "Who to talk to about registrations, coaching, the canteen or a lost jumper, with the right email for each." },
];

/* ---------- 05 PlayHQ ---------- */
export const SYNC_NODES = [
  { k: "Source", t: "PlayHQ", d: "Competitions, grades, fixtures, results, ladders, players and club details." },
  { k: "Websport sync", t: "Matched & cached", d: "Season by season, grade by grade. Teams and opponents matched to the right logos. The committee can resync any time." },
  { k: "Your site", t: "Club pages", d: "Next match on the home page, fixtures and results, ladders, and a profile for every player." },
];
export const SYNC_STATIONS = ["Fixtures", "Results", "Ladders", "Club logos"];
/** Seconds between sync log stamps; the final "Done in" is derived from it, so the two never disagree. */
export const SYNC_STEP_S = 0.6;
const SYNC_STEPS = ["Connecting to PlayHQ", "Season 2026 · 9 grades", "142 fixtures · 38 results", "9 ladders updated", "24 clubs · 24 logos matched", "312 player profiles"];
export const SYNC_LOG = [...SYNC_STEPS, `Done in ${(SYNC_STEPS.length * SYNC_STEP_S).toFixed(1)} s`];

/* ---------- 06 any domain ---------- */
export type ThemeId = "clinic" | "studio" | "cellar";
export const THEMES: Record<ThemeId, { label: string; dur: string; who: string; note: string; book: string; confirm: string; priceK: string; t1: string; t2: string; edK: string; ed: string; edM: string; perks: [string, string, string]; tokens: { font: string; radius: number; accent: string; weight: number } }> = {
  clinic: {
    label: "Clinic", dur: "First visit · 45 min", who: "Any practitioner", note: "Cancel or pause any time.", book: "Book an appointment", confirm: "Confirm", priceK: "Membership", t1: "Essential", t2: "Complete", edK: "Journal", ed: "What a good first visit feels like", edM: "4 min read", perks: ["Priority booking", "Visit notes after every session", "Pause any month"],
    tokens: { font: "Host Grotesk", radius: 18, accent: "#0F766E", weight: 500 },
  },
  studio: {
    label: "Studio", dur: "Half day · 4 hours", who: "Studio A, natural light", note: "Unused hours roll over a month.", book: "Book a studio session", confirm: "Request", priceK: "Plans", t1: "Solo", t2: "Team", edK: "Notes", ed: "Notes on making things slowly", edM: "6 min read", perks: ["Lights and backdrops included", "Locker and storage", "Two guest passes a month"],
    tokens: { font: "Martian Mono", radius: 0, accent: "#0A0A0A", weight: 300 },
  },
  cellar: {
    label: "Cellar door", dur: "Tasting flight · 60 min", who: "Up to six guests", note: "Members taste new releases first.", book: "Reserve a tasting", confirm: "Reserve", priceK: "Wine club", t1: "Cellar", t2: "Reserve", edK: "From the vineyard", ed: "A vintage worth waiting for", edM: "3 min read", perks: ["Two shipments a year", "Members-only releases", "Free tastings for two"],
    tokens: { font: "Georgia", radius: 6, accent: "#7A1530", weight: 400 },
  },
};
export const PRICES = { m: [29, 59], y: [290, 590] } as const;
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
export const SLOTS = ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "1:00", "1:30", "2:30", "3:00", "3:30", "4:30"];
export const slotTaken = (day: number, i: number) => (i * 7 + day * 3) % 5 === 0;

export const ord = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
