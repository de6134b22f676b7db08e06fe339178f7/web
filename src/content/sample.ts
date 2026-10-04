/**
 * Illustrative SAMPLE DATA (DESIGN.md v4 §2.9.2, §5.3). Fictional clubs and formats only: every surface that
 * shows them carries a "Sample data" tag. No real clubs, no Lang Lang, no invented Websport facts.
 * Plate-specific data (fixtures, ladder, notices, players, sync log, themes) is added by the home build.
 */
export type CrestShape = 0 | 1 | 2 | 3 | 4;
export type CrestPattern = "stripe" | "half" | "chev" | "band";
export type Club = { id: string; name: string; short: string; initials: string; colours: [string, string]; shape: CrestShape; pattern: CrestPattern };

/** The only sample names allowed (§5.3). Our club in the ladder is Northside Comets. */
export const CLUBS: Club[] = [
  { id: "nc", name: "Northside Comets", short: "Northside", initials: "NC", colours: ["#1D3A8A", "#F2C14E"], shape: 0, pattern: "stripe" },
  { id: "rb", name: "Riverbend", short: "Riverbend", initials: "RB", colours: ["#0F6B4F", "#FFFFFF"], shape: 1, pattern: "half" },
  { id: "eo", name: "Eastvale Owls", short: "Eastvale", initials: "EO", colours: ["#5B2A86", "#F2C14E"], shape: 2, pattern: "chev" },
  { id: "bb", name: "Banksia Bay", short: "Banksia", initials: "BB", colours: ["#0E7490", "#F97316"], shape: 3, pattern: "band" },
  { id: "ib", name: "Ironbark", short: "Ironbark", initials: "IB", colours: ["#111827", "#E5E7EB"], shape: 0, pattern: "half" },
  { id: "wg", name: "Westgate", short: "Westgate", initials: "WG", colours: ["#7F1D1D", "#93C5FD"], shape: 1, pattern: "stripe" },
  { id: "kp", name: "Kestrel Park", short: "Kestrel", initials: "KP", colours: ["#B45309", "#1F2937"], shape: 4, pattern: "chev" },
  { id: "sw", name: "Saltwater", short: "Saltwater", initials: "SW", colours: ["#1E40AF", "#FFFFFF"], shape: 2, pattern: "band" },
  { id: "hc", name: "Hillcrest", short: "Hillcrest", initials: "HC", colours: ["#166534", "#FACC15"], shape: 3, pattern: "stripe" },
  { id: "gh", name: "Granite Hill", short: "Granite", initials: "GH", colours: ["#374151", "#F87171"], shape: 4, pattern: "half" },
  { id: "ls", name: "Lakeside", short: "Lakeside", initials: "LS", colours: ["#0369A1", "#FDE68A"], shape: 0, pattern: "chev" },
  { id: "rf", name: "Redgum Flat", short: "Redgum", initials: "RF", colours: ["#9F1239", "#FFFFFF"], shape: 1, pattern: "band" },
];

export const club = (id: string) => CLUBS.find((c) => c.id === id) ?? CLUBS[0];

/** Crest shields on a 48×48 canvas: shield, roundel, hexagon, pennant shield, diamond. */
export const CREST_SHAPES: Record<CrestShape, string> = {
  0: "M4 4h40v18c0 13-9 20-20 24C13 42 4 35 4 22z",
  1: "M24 2a22 22 0 1 0 0.01 0z",
  2: "M24 2l20 11v22L24 46 4 35V13z",
  3: "M6 4h36v30l-18 12L6 34z",
  4: "M24 2l22 22-22 22L2 24z",
};

export type SportId = "any" | "afl" | "soccer" | "basketball" | "baseball" | "netball" | "cricket" | "hockey";
export type SportFormat = {
  id: SportId;
  label: string;
  /** Example score line, home – away. */
  score: [string, string];
  /** Ladder columns after the club name. */
  cols: string[];
  /** Points per win; null = no points column (baseball). */
  ptsWin: number | null;
  stat3: string;
};

/** Per-sport formats (§5.3 table). "any" is the default generic format. */
export const SPORTS: SportFormat[] = [
  { id: "any", label: "Any", score: ["3", "2"], cols: ["P", "W", "L", "Pts"], ptsWin: 2, stat3: "Points" },
  { id: "afl", label: "AFL", score: ["8.11 (59)", "6.9 (45)"], cols: ["P", "W", "L", "D", "%", "Pts"], ptsWin: 4, stat3: "Goals" },
  { id: "soccer", label: "Soccer", score: ["2", "1"], cols: ["P", "W", "D", "L", "GD", "Pts"], ptsWin: 3, stat3: "Goals" },
  { id: "basketball", label: "Basketball", score: ["68", "61"], cols: ["P", "W", "L", "PCT", "Pts"], ptsWin: 2, stat3: "Points" },
  { id: "baseball", label: "Baseball", score: ["5", "3"], cols: ["P", "W", "L", "PCT"], ptsWin: null, stat3: "Hits" },
  { id: "netball", label: "Netball", score: ["42", "38"], cols: ["P", "W", "D", "L", "%", "Pts"], ptsWin: 4, stat3: "Goals" },
  { id: "cricket", label: "Cricket", score: ["6/182", "9/170"], cols: ["P", "W", "L", "%", "Pts"], ptsWin: 6, stat3: "Runs" },
  { id: "hockey", label: "Hockey", score: ["3", "2"], cols: ["P", "W", "D", "L", "GD", "Pts"], ptsWin: 3, stat3: "Goals" },
];

export const sport = (id: SportId) => SPORTS.find((s) => s.id === id) ?? SPORTS[0];
