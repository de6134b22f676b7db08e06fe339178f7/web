# Current visual direction — modern minimal

The latest user direction supersedes the sporting editorial refresh below: no paper/poster treatment, much less promotional text, sentence-case Host Grotesk, calm cool surfaces, rounded controls and large visual previews. Work is a screenshot-led gallery. Home pairs the existing ground geometry and fixture demo in a spacious product preview. Keep existing functional demos, diagrams and animation behavior. Preserve sample-data disclosure and truthful client claims.

# Visual refresh — October 2026

The current implementation updates the visual direction below at the founder’s request. These visual choices supersede the v4 layout and type specifications; the existing animation systems, diagrams, sample-data honesty rules, light theme and flag identity remain in place.

- **Direction:** sporting editorial. A condensed poster headline alongside a quiet introduction and live fixture preview.
- **Type:** self-hosted Barlow Condensed 600 for page display headings and the closing invitation; Host Grotesk for body and section headings; Martian Mono for data and small labels. The SVG wordmark stays unchanged.
- **Hierarchy:** the opening and closing have the largest type. Section headings are smaller, with a separate left-hand index on wide screens, and calmer supporting copy.
- **Layout:** wider page gutters, an asymmetric hero, a shared bottom navigation strip, and a light-grey club-kit section containing white interactive panels.
- **Controls:** compact rectangular primary actions, plain sample-data labels, and the existing animated tabs, buttons and keyboard interactions.
- **Responsive details:** single-column mobile hero, compact sports rows with their ground drawings, separate score and result metadata rows, a keyboard-scrollable ladder, and wrapping RSVP attendee details.

The detailed v4 document follows as the record of the underlying content, behaviour and motion system.

---

# websport.com.au: Design Specification v4, "PLATES"

White mode. An editorial specimen book for club software, set on a pure white Swiss grid.

- **Status:** this replaces v3 "Under Lights", which the founder rejected (dark, floodlights, grain, Instrument Serif/Geist). Nothing in v3's look carries over.
- **Visual reference:** the winning prototype, `scratchpad/proto4-editorial-white/` (index.html, css/site.css, js/site.js). When this spec is silent, match the prototype. When the two disagree, this spec wins.
- **Grafts from the other prototypes:** `proto4-pitch-lines/` (ground linework, a scrubbed moment, the flag cursor tag) and `proto4-live-components/` (sport switcher, tactile demos, outlined wordmark, loader mask geometry).
- **Inputs:** BRIEF.md, v4-research.md, the three judge verdicts and the founder's direction for this round.

**Hard rules (founder)**
1. The site is light: white ground, Ink text, Flag red accent. No dark mode and no dark hero.
2. The signature loader: the flag appears, slides left, and `websport.com.au` grows out from behind it. Done in 2.2 s or less, pure CSS, from first paint.
3. **There is no Lang Lang on the home page.** No visuals, no section, no screenshots, no "featured work". The only links to Work are the nav, the menu and the footer.
4. The home page proves capability through craft and interactive component demos, all labelled **Sample data**.
5. Motion is award-grade, with reduced-motion and touch versions.
6. Lighthouse mobile ≥ 90 (aim for 95+) and Accessibility 100.

**Honesty rules**
- No invented clients, stats, awards, testimonials, client logos or quotes.
- No city, launch year, availability or reply time.
- The member-story line appears only on `/work/lang-lang`, labelled as a story.
- "PlayHQ is a trademark of its owner. Websport is an independent studio." appears wherever PlayHQ is featured.

---

## 0. Judge weaknesses → fix → section

Every weakness that any of the three judges raised against editorial-white, plus the gaps they noted in the other two prototypes that we are grafting from.

| # | Weakness (judge) | Fix in v4 | Section |
|---|---|---|---|
| W1 | Static scroll journey: no pinned or scrubbed set piece (all 3 judges) | Four scroll-driven moments: **(a)** 02 Sports, where a sticky "ground stage" draws each sport's real playing ground in Ink linework as its row crosses the viewport centre, with the flag planted at each ground's corner. **(b)** 05 PlayHQ, a scrubbed "sync line" that runs PlayHQ → Sync → Site and lights four stations. **(c)** 07 Contact, where the mark constructs itself on a scrub (guides, then pole, then pennant). **(d)** Header progress and section counter, plus the footer wordmark rise | 4.6 (M20–M23), 6.1 |
| W2 | No imagery, risks reading as austere (all 3) | Three in-code illustration systems, all drawn from the mark's geometry: the **ground linework** (7 grounds plus a design grid), the **generated crest family** (12 geometric sample crests), and **Fig. 1 construction drawings**. There are now four Ink masses per page: the Ladder stage, the PlayHQ log, the contact mark and the footer wordmark. No stock photos | 2.9, 5.4, 6.1 |
| W3 | Plate pairs (Logos/RSVP, Announcements/Player) leave dead space under the shorter plate (judges 1 and 2) | Each pair shares a fixed desktop body height. Plates are laid out as top content, a purposeful filler, then the action bar pinned to the bottom. Fillers: the Logos plate gets a "Next match" strip using two matched crests; the Player plate's season timeline grows to fill the space | 5.3 (P1–P6) |
| W4 | Loader frame at 750 ms showed "rt.com.au" / a detached ".au": `.com.au` faded in before "websport" was out of its mask (judges 1 and 2) | `.com.au` is now a **sibling outside the mask**. It starts at **1100 ms**, when "websport" is about 99% revealed (hand curve at 540/600), and wipes on with a clip-path from its left edge, so it can never appear detached. The mask's left edge stays pinned to the flag's right edge (live-components geometry) | 3.2, 3.3 |
| W5 | The 72 px cursor disc sat on top of the hovered sport name and hid letters (judge 2). Cursor labels garbled "Play next round" (all prototypes) | The cursor becomes an **8 px dot plus a flag-shaped tag offset to the bottom right** of the pointer (+16, +18 px). The tag never shows over elements that have their own text label (links, buttons, tabs, inputs); there the dot becomes a 28 px ring. It never covers type | 4.5 |
| W6 | Large empty bands under the hero, between sections, and above "Same craft. Any brand." (judges 2 and 3) | The hero foot gains the **Next up live card** (fixed size). Section padding drops from `clamp(96,13vw,200)` to `clamp(88px,10vw,160px)`. Every section head now sits on an Ink rule with content starting ≤ 72 px below it. The Any-domain bar is merged into its section head | 5.2, 6.1 |
| W7 | Red curtain floods a big diagonal of the screen at 1.8–1.9 s, which reads less white (judges 2 and 3; same issue in live-components) | **No curtain.** A fixed-thickness red band `clamp(10px,1.4vw,20px)` rides the slanted bottom edge of the white sheet. It is part of the same element, with no lag, so it can never widen into a flood. At most about 1.5% of the viewport is red at any frame | 3.2 |
| W8 | Shield grid shows "?" placeholders until it is triggered (judge 3) | The server-rendered initial state is **neutral monogram shields** (Ink 9% fill, initials in Martian Mono, dashed `--ui-line` outline) labelled "Unmatched". Matching runs automatically once at 50% visibility, and the button then becomes "Run again" | 5.3 P3 |
| W9 | Giant footer "websport" bleeds off the right edge at 390 (judge 3) | The wordmark is outlined SVG paths in a `viewBox` sized to the glyphs, set to `width:100%` of the content box, so it can never overflow at any width | 5.1 C9 |
| W10 | No visual proof above the fold; the hero is all type (judge 3) | **Next up card** in the hero foot: a live sample fixture that follows the sport roller, showing each sport's real score format, with crests. Tapping it opens the kit in that sport. It has fixed dimensions, so LCP stays the headline and there is no shift | 5.2 C11, 6.1 H0 |
| W11 | Process and Any-domain sections are generic (judges 1 and 2) | Process moves **off the home page** (Studio owns it, as a scrubbed rail). Any-domain becomes "One system, three brands": the live theme switch adds a visible **token readout** (font, radius, accent, weight) that rolls as you switch, so the decision is legible, not just the result | 6.1 H6, 6.4 |
| W12 | Creativity: "Swiss specimen" is a well-worn award look; "Plates" is craft rather than a big idea (all 3) | The concept is sharpened to "**Every club plants its flag online**", made literal. The flag's 45° line and pennant are the system: the loader, the sheet edge, the page-transition wipe, plate corner tabs, the cursor tag, the corner flag planted on every ground, and the contact mark built from its construction. The sports stage plus the global sport switcher make one idea that runs through the whole page: pick your sport and the entire kit becomes yours | 1, 4.6 |
| W13 | Simulated mobile LCP was about 2.6–2.9 s because of the font chain (prototype self-report) | `next/font` self-hosting, latin subset, preload for the roman face only, `adjustFontFallback`, a single CSS file, outlined wordmark paths (no wordmark font), and no render-blocking JS (`defer-hydration.mjs`). The headline is painted under the loader at full opacity | 2.3, 3.6, 7.3 |
| W14 | Live-components: the floating dock covered content. Live-components and pitch-lines: linework ran through text, with translucent white patches | No floating chrome other than the header (which hides on scroll down). Ground linework appears only on the Sports stage, in its own column. **It never runs behind text**, and there are no white patches anywhere | 6.1 H2 |
| W15 | Live-components: a mirror image halfway through the crest flip, and text blur on the tilted card | Crests resolve by **scale and rotate in 2D** (no rotateY). The player card's Present/Past switch is a 2D crossfade plus a stat roll, with no 3D tilt, so text stays sharp | 5.3 P3, P6 |
| W16 | Mobile: truncated ladder names, overlapping labels (live-components and pitch-lines) | Every demo has a defined 390 layout (5.3). Club names use a short form at ≤ 480 (`short` field). There is no absolutely-positioned text in diagrams on mobile (the sync line turns vertical, with labels in flow) | 5.3, 7.1 |
| W17 | Pitch-lines loader felt flat (white lifting off white) | The white sheet's slanted edge plus the thin red band gives the lift a visible leading edge. The lockup rises 22vh and fades on the same curve | 3.2 |

---

## 1. Concept

### 1.1 Name and line
- **Concept:** "Plates". Every capability is a numbered plate in a specimen book, built in code, labelled Sample data, and something you can touch.
- **Brand line:** "Every club plants its flag online."
- **Tagline:** "Websites & apps for community sports clubs."

### 1.2 Positioning (both halves always present)
1. **Specialists in community club sport, across every code on PlayHQ.** AFL, soccer, basketball, baseball, netball, cricket, hockey and the rest. We build websites and apps with PlayHQ integration (fixtures, results, ladders, club logos), events with RSVP and payments, announcements, and player profiles present and past, all run by the committee.
2. **Designers for any domain.** The same craft, proven on this site, goes into any brand.

### 1.3 Principles
1. **White, structured by Ink.** Pure white ground, hairline construction, and one heavy Ink mass per screen (the ladder stage, the sync log, the contact mark, the footer wordmark). Red is a signal, never a wash.
2. **The flag is the grid.** Its 45° line and pennant triangle recur as structure: the sheet edges, the wedge sweeps, corner tabs, tag bullets, the cursor tag, focus-corner details and the page wipe.
3. **Show, don't claim.** Every capability is a working component on sample data. No adjectives where a demo can do the job.
4. **Two eases, one rhythm.** Arrivals use expo-out. Hand-offs use one of two in-outs (4.2). Nothing bounces except the magnetic release.
5. **Win where winners lose.** Accessibility 100, keyboard parity for every demo, live-region announcements, reduced-motion parity, touch alternatives, and Lighthouse mobile 95+.

### 1.4 What we refuse
- Dark grounds, grain, floodlights and serif display (v3).
- Cream, beige or chalk tints.
- Floating docks.
- Linework behind text.
- Full-screen colour floods.
- Number counters while loading.
- A blank white frame at any time.
- Cookie banners (we set no cookies).
- Invented proof of any kind.

---

## 2. Tokens

### 2.1 The mark (exact, never redrawn)
```svg
<svg viewBox="14 13 66 66"><path d="M20 16 L72.38 68.38 A5.5 5.5 0 0 1 64.61 76.16 L43.83 55.38 L20 68 Z" fill="#0F1729"/><polygon points="20,31.56 20,68 43.83,55.38" fill="#E8442B"/></svg>
```
- The pole/pointer path is Ink and the pennant is Flag.
- **On the Ink stage:** the path turns white and the pennant stays Flag.
- **On Flag:** the path is Ink and the pennant is white.
- `Mark.tsx` takes `size`, `tone: "ink" | "white"`, and `parts` (to expose `.mk-pole` and `.mk-pennant` for animation).

### 2.2 Wordmark: outlined paths, never a font
- **Source font:** Sora 800, as the brief specifies.
- **Generator:** a new script, `scripts/wordmark.mjs`, reuses the TTF fetch and `layout()`/`pathData()` helpers from `scripts/og.mjs`. It fetches the Sora 800 TTF through the same Google Fonts CSS request (old user agent), parses it with opentype.js, which is already a devDependency, and writes `src/components/wordmark.generated.ts`.
- **Output:** for each of `websport` and `.com.au`, an array of per-glyph `{ d, x, advance }` plus the total width and the cap and x heights.
- **Tracking:** −0.045em for `websport`. `.com.au` is drawn at 0.62× scale, tracked −0.03em, baseline-aligned, with a 0.02em gap.
- **Why paths:** the loader, header and footer never wait for a font, which removes the base64 Sora subset the prototype used.
- **Component:** `Wordmark.tsx` renders `<svg role="img" aria-label="websport.com.au">` (or `aria-hidden` when it sits next to visible text).
- **Props:** `part?: "full" | "word" | "tld"` (default `"full"`, which renders `websport.com.au`; the loader uses `word` and `tld` separately), `glyphs?: boolean` (wraps each glyph in `<g class="wm-g">` for the footer effect, M27), and `className`.
- **Colours:** `websport` uses `currentColor` and `.com.au` uses `var(--flag)`.
- **Build check:** commit the generated file. Re-run the script only if the spelling changes.

### 2.3 Colour (contrast verified by script: `scratchpad/contrast-v4.mjs`, WCAG 2.x relative luminance)

| Token | Value | Use | Verified ratio |
|---|---|---|---|
| `--paper` | `#FFFFFF` | Page ground | — |
| `--surface` | `#F5F6F8` | Plates, panels, segmented tracks | Ink 16.53, muted 5.51 |
| `--surface-2` | `#EDEFF3` | Inactive bars, timeline rest state | Ink 15.53, muted 5.18 |
| `--line` | `rgba(15,23,41,.09)` (≈ #E9EAEC) | Decorative hairlines only | 1.20 (decorative) |
| `--line-2` | `rgba(15,23,41,.16)` (≈ #D9DADD) | Decorative row rules only | 1.40 (decorative) |
| `--ui-line` | `rgba(15,23,41,.50)` (≈ #878B94) | **Boundaries of controls**: ghost buttons, chips, steppers, tags, inputs, the unmatched-crest dashed outline | **3.41** on paper, 3.33 on surface (passes 1.4.11) |
| `--ink` | `#0F1729` | Text, Ink stage, primary buttons, focus ring | 17.87 on paper |
| `--ink-2` | `#2A3346` | Secondary body copy on paper | 12.65 |
| `--muted` | `#5B6475` | Captions, ledes, labels | 5.96 paper / 5.51 surface |
| `--flag` | `#E8442B` | The mark, fills, display type ≥ 24 px (or ≥ 18.66 px bold), the red band, wedges | 3.97 on paper (large text and UI only) |
| `--flag-text` | `#C8361F` | Red text under 24 px: section numbers, "Interact ↗", new-item times | 5.25 paper / 4.85 surface / 4.61 on flag-tint |
| `--flag-tint` | `#FDEDE9` | Tag/pill fills behind `--flag-text` | Ink 15.72 |
| `--on-ink-muted` | `#A9B0BF` | Muted text on the Ink stage | 8.21 on Ink |
| `--on-ink-flag` | `#FF8A73` | Red text on Ink (movement down, "Interact") | 7.78 on Ink |
| `--up` / `--up-on-ink` | `#137A4B` / `#7BE0A6` | Movement up, win, paid | 5.37 paper / 11.11 Ink |

**Pairing rules**
- Flag buttons always get **Ink labels** (4.51). Never put white on Flag (3.97).
- Ink buttons have white labels (17.87). On hover they fill with Flag and the label turns Ink.
- Never use `--flag` for text under 24 px; use `--flag-text`.
- `::selection` is Flag with Ink text.
- **Focus ring:** `outline: 2px solid var(--ink); outline-offset: 2px` everywhere. Inside `.is-ink`, the ring is `#fff` (17.87). Focusable plates add a 6 px Flag pennant notch at the top right while focused (M32). It is decoration; the ring is what carries focus.
- **Forced colours:** outlines become `CanvasText`, the Ink stage keeps its `1px solid CanvasText` border, and crests keep their outline.

### 2.4 Typefaces (`next/font/google`, all OFL; `src/app/fonts.ts`, replacing Instrument Serif/Geist)
```ts
import { Host_Grotesk, Martian_Mono } from "next/font/google";
export const sans = Host_Grotesk({ subsets: ["latin"], style: "normal", variable: "--font-sans", display: "swap", adjustFontFallback: true, preload: true }); // variable wght 300–800
export const sansItalic = Host_Grotesk({ subsets: ["latin"], style: "italic", variable: "--font-sans-italic", display: "swap", adjustFontFallback: true, preload: false }); // below the fold only
export const mono = Martian_Mono({ subsets: ["latin"], axes: ["wdth"], variable: "--font-mono", display: "swap", adjustFontFallback: false, fallback: ["ui-monospace","SFMono-Regular","Menlo","monospace"], preload: true });
```

**Host Grotesk** (variable wght 300–800)
- Used for display and body.
- Display is 600, tracked −0.045 to −0.055em.
- Body is 400 at 18 px (17 px under 760), line-height 1.55. Never use weights under 400 for body on white.
- Italic is used only in `em` within display lines (`.pos-h em`, Studio), via `font-family: var(--font-sans-italic)`.

**Martian Mono** (variable wdth 75–112.5, wght 100–800)
- Labels use `font-stretch: 87.5%`, 11 px, 400, uppercase, tracked .06em.
- Data numerals (fixture times, ladder figures) use `font-stretch: 75%`, 500, `tabular-nums`.
- **Minimum mono size is 10 px.** This fixes the prototype's 9.5 px tags. Tags become 10 px.

**Signature axis**
- Host Grotesk has only a weight axis, so the hover signature is a **weight glide**.
- Sport names go 600 → 760, kit titles 600 → 720, and menu links 600 → 780, over 700 ms expo, with `font-variation-settings` and tracking compensated by −0.005em.
- Nothing after the name shares its line, so the glide causes no reflow.
- We deliberately do not add Mona Sans: a third family costs about 60 KB and an extra request.

**Wordmark:** Sora 800 as paths only (2.2).

`html` gets `className={`${sans.variable} ${sansItalic.variable} ${mono.variable}`}`, and `body { font-family: var(--font-sans) }`.

### 2.5 Fluid type scale (CSS custom properties in `globals.css`)

| Token | Value | Weight / tracking / leading | Use |
|---|---|---|---|
| `--t-hero` | `clamp(48px, 11.8vw, 184px)` (≤ 760: `clamp(44px, 14.6vw, 80px)`) | 600 / −0.05em / .9 | H1 home |
| `--t-display` | `clamp(48px, 9vw, 152px)` | 600 / −0.05em / .9 | H1 other pages |
| `--t-cta` | `clamp(64px, 13vw, 220px)` | 600 / −0.055em / .88 | "Plant your flag." |
| `--t-h2` | `clamp(40px, 6.4vw, 104px)` | 600 / −0.045em / .94 | Section heads |
| `--t-row` | `clamp(40px, 6vw, 104px)` (≤ 760: `clamp(36px, 11vw, 60px)`) | 600 / −0.05em / 1 | Sports rows |
| `--t-h3` | `clamp(24px, 2.4vw, 36px)` | 600 / −0.035em / 1.05 | Step, feature, node titles |
| `--t-kit` | `clamp(28px, 3.4vw, 52px)` | 600 / −0.04em / 1 | Kit rows |
| `--t-lead` | `clamp(18px, 1.4vw, 21px)` | 400 / −0.005em / 1.5 | Ledes, hero sub |
| `--t-body` | `18px` (≤ 760: `17px`) | 400 / 0 / 1.55 | Body |
| `--t-small` | `14.5px` | 400–500 / 0 / 1.45 | Demo rows, plate footers |
| `--t-mono` | `11px` (min 10px) | 400 mono 87.5% / .06em / 1.4 | Labels, tags, eyebrows |
| `--t-mail` | `clamp(26px, 3.6vw, 56px)` | 500 / −0.035em / 1.1 | Email link |

- Measure: body ≤ 64ch and ledes ≤ 44ch.
- Every number in data uses `font-variant-numeric: tabular-nums`.

### 2.6 Spacing
- The base is 4 px. Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 72, 96.
- **Section rhythm:** `--sec-pad: clamp(88px, 10vw, 160px)` on top. Bottom padding is 0, because the next section's Ink rule closes the space.
- **Section head:** an Ink rule 1 px on top, `padding-top: 18px`, and content `margin-top: clamp(32px, 4.5vw, 64px)`. This is a hard maximum of 72 px from the rule to the first content block.
- **Inside plates:** a head of 18/22 px, a body of 22 px, a footer of 16/22 px. On mobile, 14/16 px.

### 2.7 Grid
- **Desktop:** 12 columns with 24 px gutters. Side margin `--g: clamp(20px, 3.2vw, 48px)`. `.wrap` is `max-width: 1600px`.
- **≤ 760:** 4 columns with 16 px gutters and a 20 px margin (the 16 px minimum side gutter is met).
- Full-bleed rows (sports, kit) put the rule edge to edge, with inner content in `.wrap`.

### 2.8 Radii, borders, elevation
- **Radii:** plates and panels 4 px; inner cards 3 px; buttons, segmented controls and chips 999 px; tags 999 px; crests are shape-defined. No other radii.
- **Borders:** decorative hairlines use `--line` or `--line-2`. Control boundaries use `--ui-line` (inset box-shadow 1 px).
- **Elevation:** one elevation only, for floating items (hover preview, menu, lifted crest): `0 0 0 1px var(--line-2), 0 30px 60px -30px rgba(15,23,41,.35)`. Nothing else casts a shadow. Inner cards on plates use `0 0 0 1px var(--line)` (a white card on surface, so the edge is visible).

### 2.9 Illustration systems (all in code, all `aria-hidden` unless stated)
1. **Ground linework** (`src/content/grounds.ts`): eight precomputed SVG path sets on a `0 0 1200 800` canvas. Each set has `boundary`, `markings[]`, `dots[]` and `flag: {x, y, rot}` (where the corner flag is planted).
   - AFL oval: an ellipse boundary, centre square, centre circles, 50 m arcs, goal squares and 4 posts each end.
   - Soccer pitch: 105×68 to scale. Halfway line, centre circle, both penalty and goal areas, arcs and spots.
   - Basketball court: 28×15. Keys, three-point lines, centre circle.
   - Baseball diamond: foul lines, infield arc, bases, mound, home plate.
   - Netball court: 30.5×15.25. Thirds, centre circle, goal circles.
   - Cricket oval: boundary ellipse, 30 m inner circle, pitch rectangle, creases.
   - Hockey pitch: 91.4×55. 23 m lines, shooting circles, centre line.
   - And the rest: a 12-column design grid with a 45° diagonal, the "any domain" state.

   Paths are hand-authored or exported from the pitch-lines prototype (`proto4-pitch-lines/js/site.js`, ground data). Strokes are `vector-effect: non-scaling-stroke`, 1.25 px, `stroke: var(--ink)`, with `stroke-opacity` .38 at rest and .55 for the active ground (stroke45 #93979F works out to 2.93:1; the strokes are decorative). Precompute `pathLength="1"` on every path, so dash animation needs no measuring and no DrawSVG.
2. **Crest family** (`src/content/sample.ts` + `Crest.tsx`): 12 sample clubs. Five shield shapes, four patterns (stripe, half, chevron, band) and two-colour pairs, ported from the prototype's `CLUBS`/`SHAPES` (proto js §7). Each club has `name`, `short`, `initials`, `colours` and `shape`. Crests are SVG with a `useId()` clipPath id. They are fictional, geometric, and never resemble real clubs.
3. **Fig. drawings:** the mark's construction (Fig. 1, home 01; Fig. 2 at contact, built on a scrub), with guides at Ink 22% and mono annotations in `--muted`.

---

## 3. Loader (signature intro)

### 3.1 Goals and guarantees
- **Looks:** the flag appears in the centre, then slides left while `websport` grows out from behind its right edge. `.com.au` follows in red. A brief hold, then the white sheet lifts on a slanted edge with a thin red band, revealing the hero, which rises.
- **Timing:** it finishes visually by **2.10 s** and is **hidden by CSS at 2.20 s**, with or without JS.
- **Starts at first paint:** it runs from CSS keyframes in the server-rendered HTML and needs no JS to start or finish. Hydration is deferred until after first contentful paint by `scripts/defer-hydration.mjs`, so React is never involved in the loader.
- **Never traps the user:** `animation-fill-mode: forwards` ends at `visibility:hidden; pointer-events:none`.
- **Once per session:** on a repeat visit the inline head script adds `html.no-intro` before the body paints.
- **Skippable** with a click or key once the inline script runs. That is at parse time, not hydration, so skipping works from the first frame.
- **Reduced motion:** a static lockup, then a 300 ms fade.
- **LCP-safe:** the hero H1 is painted **underneath** the loader from the first frame, at full opacity with no mask, so it is the LCP element. Overlays that cover the full viewport are ignored by LCP, and an element painted under an overlay still counts.
- **CLS-safe:** the loader is `position:fixed` and nothing it does moves layout.

### 3.2 Timeline (ms from first paint; CSS `animation-delay` values)

| t (ms) | Element | Animation | Duration | Easing |
|---|---|---|---|---|
| 0 | `.ld` (sheet) | White sheet covers the viewport; the H1 is already painted beneath it | — | — |
| 120 | `.ld-flag` | opacity 0→1, `translateY(18%)→0`, `scale(.72)→1` (origin 50% 60%) | 400 | expo `cubic-bezier(.16,1,.3,1)` |
| 220 | `.ld-pennant` | `scaleX(0)→1`, origin at the pole (`transform-box: fill-box; transform-origin: 0 50%`) | 460 | expo |
| 500 | `.ld-skip` (only `html.js`) | opacity 0→1: "Click or press any key to skip" | 300 | linear |
| 560 | `.ld-lockup` | `translateX(var(--from))` → `translateX(-50%)`. `--from` = −(flag width ÷ 2), so at the start the flag sits centred | 600 | hand `cubic-bezier(.65,0,.35,1)` |
| 560 | `.ld-word` (inside `.ld-mask`) | `translateX(-101%)→0`: "websport" slides out from behind the flag's right edge | 600 | hand (same curve and same start as the lockup, so the seam stays locked) |
| 1100 | `.ld-tld` (sibling **after** the mask) | `clip-path: inset(0 100% 0 0)` → `inset(0)` plus `translateX(-.18em)→0` | 380 | expo |
| 1160–1560 | — | Hold. The full lockup reads complete from about 1.25 s | — | — |
| 1560 | `.ld-sheet` | `translateY(0)→translateY(-101%)`. The sheet is `height: calc(100% + 9vw + var(--band))`, its bottom edge slanted 9vw at the flag angle, with a red band of `--band: clamp(10px,1.4vw,20px)` along that edge | 540 | lift `cubic-bezier(.76,0,.24,1)` |
| 1560 | `.ld-out` (lockup wrapper) | `translateY(0)→-22vh`, opacity 1→0 | 540 | lift |
| 1560 | `.ld-skip` | opacity →0 | 200 | linear |
| 1640 + i·70 | `.h-line` (the 3 H1 lines) | `translateY(.42em)→0`. **Opacity stays 1 throughout** | 950 | expo |
| 1900 + i·70 | `.h-fade` (meta, sub, CTAs, Next up card, scroll cue) | opacity 0→1, `translateY(18px)→0` | 800 | expo |
| 2100 | — | Sheet fully above the viewport | — | — |
| 2200 | `.ld` | `visibility:hidden; pointer-events:none` (0 s keyframe, `forwards`) | 0 | — |

The hero entrance is all CSS, keyed to `--intro: 1.56s`. On `html.no-intro`, `--intro: 0s`, and the lines still rise once (950 ms) as the page appears.

### 3.3 DOM and CSS (`src/components/Loader.tsx`, a server component rendered in `layout.tsx` before `<Header>`)

```tsx
<div className="ld" aria-hidden="true">
  <div className="ld-sheet">            {/* red background = the band; translates on lift */}
    <div className="ld-white">          {/* white, clip-path polygon(0 0,100% 0,100% calc(100% - 9vw - var(--band)),0 calc(100% - var(--band))) */}
      <div className="ld-out">
        <div className="ld-lockup">
          <Mark className="ld-flag" parts />                 {/* .mk-pennant gets ld-pen */}
          <span className="ld-mask"><Wordmark part="word" className="ld-word" /></span>
          <Wordmark part="tld" className="ld-tld" />
        </div>
      </div>
      <span className="ld-skip">Click or press any key to skip</span>
    </div>
  </div>
</div>
```

```css
.ld{position:fixed;inset:0;z-index:100;animation:ld-done 0s linear 2.2s forwards}
html.no-intro .ld{display:none}
.ld-sheet{position:absolute;inset:0 0 auto 0;height:calc(100% + 9vw + var(--band));background:var(--flag);
  clip-path:polygon(0 0,100% 0,100% calc(100% - 9vw),0 100%);animation:ld-lift .54s var(--lift) 1.56s forwards}
.ld-white{position:absolute;inset:0;background:var(--paper);clip-path:polygon(0 0,100% 0,100% calc(100% - 9vw - var(--band)),0 calc(100% - var(--band)))}
.ld-out{position:absolute;inset:0 0 calc(9vw + var(--band)) 0;animation:ld-out .54s var(--lift) 1.56s forwards}
.ld-lockup{--h:clamp(34px,5.6vw,80px);position:absolute;left:50%;top:50%;display:flex;align-items:center;gap:calc(var(--h)*.16);
  height:var(--h);transform:translate(calc(var(--h)*-.53),-50%);animation:ld-slide .6s var(--hand) .56s forwards}
.ld-flag{width:calc(var(--h)*1.06);height:calc(var(--h)*1.06);flex:none;position:relative;z-index:2;opacity:0;
  transform:translateY(18%) scale(.72);transform-origin:50% 60%;animation:ld-flag .4s var(--expo) .12s forwards}
.ld-flag .mk-pennant{transform-box:fill-box;transform-origin:0 50%;transform:scaleX(0);animation:ld-pen .46s var(--expo) .22s forwards}
.ld-mask{display:block;overflow:hidden;height:var(--h);padding-right:.02em} /* left edge = flag's right edge (flex sibling) */
.ld-word{display:block;height:100%;width:auto;transform:translateX(-101%);animation:ld-word .6s var(--hand) .56s forwards}
.ld-tld{height:calc(var(--h)*.62);align-self:flex-end;margin-bottom:calc(var(--h)*.02);clip-path:inset(0 100% 0 0);
  transform:translateX(-.18em);animation:ld-tld .38s var(--expo) 1.1s forwards}
.ld-skip{/* mono 11px muted, bottom: calc(9vw + var(--band) + 28px), centred */display:none;opacity:0}
html.js .ld-skip{display:block;animation:ld-fade .3s linear .5s forwards, ld-unfade .2s linear 1.56s forwards}
@keyframes ld-flag{to{opacity:1;transform:none}} @keyframes ld-pen{to{transform:none}}
@keyframes ld-slide{to{transform:translate(-50%,-50%)}} @keyframes ld-word{to{transform:none}}
@keyframes ld-tld{to{clip-path:inset(0);transform:none}} @keyframes ld-lift{to{transform:translateY(-101%)}}
@keyframes ld-out{to{transform:translateY(-22vh);opacity:0}} @keyframes ld-fade{to{opacity:1}} @keyframes ld-unfade{to{opacity:0}}
@keyframes ld-done{to{visibility:hidden;pointer-events:none}}
.h-line{display:block;animation:h-rise .95s var(--expo) calc(var(--intro) + .08s + var(--i)*.07s) both}
.h-fade{animation:h-fade .8s var(--expo) calc(var(--intro) + .34s + var(--i)*.07s) both}
@keyframes h-rise{from{transform:translateY(.42em)}} @keyframes h-fade{from{opacity:0;transform:translateY(18px)}}
```

**Seam rules (W4)**
- The flag and the mask are flex siblings, so the mask's left edge **is** the flag's right edge.
- The flag has `z-index:2`, so the word slides out from behind it.
- The lockup and the word share one curve and one start.
- `.ld-tld` sits outside the mask and starts only at 1100 ms, when "websport" is about 99% out. (At 1060 ms a 2–6 px gap could show for a frame or two; if the filmstrip still shows daylight before the ".", move the start to 1120 ms. It still ends inside the hold.) Its clip grows from its own left edge, which is the word's final right edge, so no "rt.com.au" or detached ".au" frame is possible.
- **Verify:** a filmstrip of seeked frames every 50 ms from 600 to 1300 ms. Every frame must read as flag + growing word, or flag + word + growing TLD.

**Band rule (W7):** the red band is the `.ld-sheet` background showing beneath `.ld-white`'s shorter polygon. It moves with the sheet, with no second animation and no lag, so its thickness is constant at `--band`.

### 3.4 Inline head script: replaces `src/lib/gate.ts` (`GATE`), rendered by `InlineScript` in `<head>`
```js
(function(d){d.classList.add('js');var on=false;try{
  if(location.search.indexOf('intro')>-1)sessionStorage.removeItem('ws-intro');
  if(sessionStorage.getItem('ws-intro'))d.classList.add('no-intro');
  else{sessionStorage.setItem('ws-intro','1');on=true}
}catch(e){on=true}
if(!on)return;
function skip(){try{document.getAnimations().forEach(function(a){var n=a.animationName||'';
  if((n.indexOf('ld-')===0||n.indexOf('h-')===0)&&a.currentTime!==null&&a.currentTime<1560)a.currentTime=1560})}catch(e){}off()}
function off(){removeEventListener('pointerdown',skip,true);removeEventListener('keydown',skip,true)}
addEventListener('pointerdown',skip,{capture:true,passive:true});addEventListener('keydown',skip,true);
setTimeout(off,2200)})(document.documentElement)
```

**Script rules**
- It runs before `<body>` parses, so `no-intro` applies before first paint (there is no loader flash on repeat visits).
- If sessionStorage throws (private mode, blocked storage), the intro plays. That is safe, because CSS ends it.
- Skipping seeks only `ld-*` and `h-*` CSS animations, to the lift start (1560 ms). The lift, the band and the hero then play out over about 600 ms, so a skip is never a hard cut. The `h-line` animations sit at their delay start, so the hero still rises after the sheet.
- Skip never calls `preventDefault`: Tab still moves focus and a click on a link still works once the loader is gone.
- **Delete** v3's `motion`/`intro`/`intro-skip`/`motion-ready`/3 s-failsafe machinery. Nothing in v4 depends on hydration for visibility.

### 3.5 Every route can be the entry
- The loader lives in the root layout, so it plays on whichever route loads first in a session (home, /work, /work/lang-lang, /studio, /contact, 404).
- **Every page's H1** uses the same `.h-line` spans (painted under the loader, `--i` index), and its first-screen secondary items use `.h-fade`.
- **Two separate flags. Do not merge them:**
  - `html.no-intro` (head script, repeat visit): `--intro: 0s`, loader `display:none`.
  - `html.navigated` (MotionProvider, set on the first client-side pathname change and never removed): `--intro: .38s` (timed to the page wipe, 4.4) and loader `display:none`. Reuse the v3 pathname-change effect that cleared `--d`.
  - **Precedence:** `html.navigated` wins. Declare it after `no-intro` in `globals.css` with equal specificity (`html.navigated{--intro:.38s}` after `html.no-intro{--intro:0s}`), so the cascade order settles it.
- The layout never remounts, so the finished loader never replays.

### 3.6 Reduced motion
```css
@media (prefers-reduced-motion: reduce){
  .ld-lockup{transform:translate(-50%,-50%);animation:none}
  .ld-flag,.ld-flag .mk-pennant,.ld-word,.ld-tld{animation:none;opacity:1;transform:none;clip-path:none}
  .ld-sheet,.ld-out{animation:none}
  .ld{animation:ld-rm .3s linear .6s forwards}            /* static lockup 0.6s, fade 0.3s, gone at 0.9s */
  html.js .ld-skip{animation:none;display:none}
  .h-line{animation:none}
  .h-fade{animation:h-fade-rm .3s linear .7s both}
  html.no-intro .h-fade{animation:none}
}
@keyframes ld-rm{to{opacity:0;visibility:hidden;pointer-events:none}}
@keyframes h-fade-rm{from{opacity:0}}
```

### 3.7 LCP and CLS safeguards (verify each)
1. The H1 is server-rendered, painted at first paint under `.ld`, at opacity 1, with no `overflow:hidden` mask and no clip. Lighthouse must name an `.h-line` as the LCP element, and the observed LCP must be ≤ FCP + 100 ms.
2. The loader uses no images and no fonts (the wordmark is paths), so it adds no requests.
3. The loader CSS is in the single `globals.css` (render-blocking anyway). The loader and hero CSS must not be split into lazily loaded CSS.
4. Hero layout is final at first paint: the Next up card has a fixed `height`, the roller has its slot width reserved by a grid stack, and the meta row is a fixed single line. CLS during the intro must be 0.
5. Font swap: Host Grotesk is preloaded and `adjustFontFallback` sizes the fallback to match it. The H1 line breaks are explicit (`<br class="m">` for mobile), so a swap cannot rewrap.
6. **No-JS check:** Playwright with JavaScript disabled, screenshot at 3 s. The hero must be fully visible and the loader hidden.

---

## 4. Motion system

### 4.1 Libraries
- Keep `gsap` (core + ScrollTrigger), `@gsap/react` and `lenis`.
- **Add nothing.** No SplitText (the split is our own `split()` util), no MorphSVG, no DrawSVG (we use `pathLength="1"` dashes), no Flip (we use a hand-rolled FLIP with WAAPI).
- GSAP loads only in client islands, after hydration. All first-paint motion is CSS.

### 4.2 Tokens (`src/motion/tokens.ts` mirrored as CSS vars)
```
--expo: cubic-bezier(.16,1,.3,1)   GSAP "ws.out"   arrivals, hovers-in, reveals
--hand: cubic-bezier(.65,0,.35,1)  GSAP "ws.hand"  state hand-offs: tabs, re-sorts, slides, wedge sweeps
--lift: cubic-bezier(.76,0,.24,1)  GSAP "ws.lift"  surfaces: loader sheet, menu, page wipe, header hide
linear                                            line-draws (scrubbed) and fades only
elastic.out(1,.45)                                magnetic release only
```
- **Change in `gsap.ts`:** register `ws.hand` = bezier(.65,0,.35,1) and `ws.lift` = bezier(.76,0,.24,1), and **delete** `ws.io` (.87,0,.13,1). Update every `E.io` call site to `E.hand` or `E.lift`.
- The Lenis easing function becomes expo-out (`t => 1 - Math.pow(2, -10 * t)`), with `duration: 1.1`.
- **Durations (s):** `press .12`, `hover .45`, `swap .55`, `reveal 1.05`, `heroLine .95`, `sheet .54`, `menu .7`, `route .7`, `odo .8`.
- **Stagger:** `16ms` per character, `26ms` per roller character, `45ms` per row, `70ms` per hero item, `80ms` per line. Cap any group at 600 ms total.

### 4.3 Next.js App Router integration (static export)
- **`MotionProvider`** (kept, re-themed) is mounted once in the layout. It owns:
  - Lenis, driven by `gsap.ticker`, with `lagSmoothing(0)`. Off under reduced motion and when `pointer: coarse`.
  - `ScrollTrigger.refresh()` after route change and after `document.fonts.ready`.
  - In-page anchor scrolling with a 96 px offset.
  - Adding `no-intro` on the first client navigation (3.5).
  - The flags `has-cursor` (fine pointer, no reduced motion) and `is-scrolled` / `hdr-hidden`.
  - The context `{ reduced, fine, lenis }`.
- **Islands** use `useGSAP(() => {...}, { scope: ref, dependencies: [...] })`, so every tween and ScrollTrigger is reverted on unmount. Inside, they use `gsap.matchMedia()` with `MQ.motion` and `MQ.fine`, so switching reduced motion reverts cleanly.
- No module-scope DOM access. All `window` and `document` access happens in effects.
- **Interactions before hydration:** demos are server-rendered in their initial sample state with reserved heights (5.3), so a pre-hydration screen is complete. Buttons are real `<button>`s that do nothing until hydrated. Under deferred hydration that window is typically under 300 ms after FCP.
- **Splitting:**
  - `split(el, "lines" | "chars")` is a 30-line util. It measures lines with a Range over word spans, wraps each line in `.ln > span`, and keeps the original text as `aria-label` on the parent, with the splits `aria-hidden`.
  - It re-splits on width change (ResizeObserver, debounced 150 ms) and never on height-only changes (mobile URL bar).
  - Headings are fully visible without JS (`html.js` gates the hidden state, and `js` comes from the head script), but the reveal itself needs hydration. So the hidden state applies only under `html.hydrated` (set by MotionProvider). Headings already in view at hydration time are revealed immediately, without animating.

### 4.4 Page transitions (React `ViewTransition`, existing `PageTransition.tsx`)
- **Exit** (`::view-transition-old(.ws-page-out)`): the old page moves `translateY(-4vh)` and its opacity goes 1 → .6 over .5 s lift.
- **Enter:** the new page wipes up from the bottom. Its leading top edge is slanted at the flag angle (9vw), with the same **thin red band** as the loader riding that edge.
  - Implementation: keep `PageTransition`'s React props `enter="ws-page-in"` / `exit="ws-page-out"`. In `globals.css`, `::view-transition-new(.ws-page-in)` animates `clip-path: polygon(0 calc(100% + 9vw), 100% 100%, 100% 100%, 0 calc(100% + 9vw))` → `polygon(0 0, 100% -9vw, 100% 100%, 0 100%)` over .7 s lift.
  - The band is the existing `.vt-edge` element (fixed, `view-transition-name: ws-edge`). It is a red parallelogram of thickness `--band`, animated `translateY(100vh)→translateY(-12vw)` on the same curve and duration.
- **Then:** the new H1 lines rise (`--intro: .38s`).
- **Reduced motion:** a .2 s crossfade only, with no band.
- If view transitions are unsupported, navigation is instant.
- Keep `IntentLink` (prefetch on intent).

### 4.5 Cursor system (`Cursor.tsx`, rewritten)
Applies only on `(hover:hover) and (pointer:fine)` without reduced motion. The cursor is `aria-hidden`, and the system cursor stays visible over form fields.

- **Dot:** 8 px Ink, following through `gsap.quickTo` (x/y, .18 s, power3.out). It turns white over `.is-ink`.
- **Tag:** a flag-shaped label (a rectangle whose right end is cut at the flag angle; `clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 50%, 100% 100%, 0 100%)`).
  - Style: Flag fill, Ink mono 10 px label (4.51:1), height 22 px, 0 8 px padding.
  - Position: offset **+16 px, +18 px** from the pointer, following at .35 s power3.out.
  - It appears over `[data-cursor="Label"]` regions: scale .6 → 1 and rotate −8° → 0 over .45 s expo. It leaves with scale → .6 and opacity 0 over .2 s.
- **Over links, buttons, `[role=tab|radio|switch]`, inputs and `.btn`:** the tag hides, and the dot grows into a 28 px ring (1.5 px Ink border, transparent fill) over .45 s expo. On press the ring scales to .85 for .12 s.
- **Over giant type (`.sport-name`, `.kit-t`, `.cta-h`):** the dot hides. The tag shows only if the row carries `data-cursor`, at the offset position, so it never covers letters (W5).
- **Labels:** Look (Fig.), Pick (sport rows), Play (fixtures plate background), Sort (ladder), Match (logos), RSVP, Post, Flip (player), Read (kit/editorial), Sync (PlayHQ), Switch (any-domain stage), Copy (copy button region), Drag (compare, case study), View (case thumbnails).

### 4.6 Microinteraction catalogue
All entries obey 4.2. "RM" is the reduced-motion behaviour; "Touch" is the coarse-pointer behaviour. Each entry is built in the component named.

| # | Element (component) | Trigger | Animation | Timing / easing | RM | Touch |
|---|---|---|---|---|---|---|
| M1 | Loader (`Loader`) | First paint | §3 | ≤ 2.2 s | Static + 300 ms fade | Same; tap skips |
| M2 | Hero H1 lines (`Hero`) | `--intro` | rise .42em → 0, opacity 1 | 950 ms expo, 70 ms stagger | Static | Same |
| M3 | Sport roller in H1 (`Roller`) | Every 2.3 s while in view and the tab is visible | Characters exit up (−110%, 550 ms hand) then enter from below (800 ms expo), 26 ms per character. A mono "0X / 08" counter rolls with it. Cycle: anything → AFL → soccer → basketball → baseball → netball → cricket → hockey | Pauses offscreen, on hover or focus of the H1, and while a sport is chosen | Static "anything." | Same |
| M4 | Next up card (`NextUpCard`) | Follows the roller's sport; locks to the chosen sport (M24) | Content swaps: the fixture line crossfades and lifts (260 ms out, 600 ms expo in). Crests settle (scale .8 → 1, rotate −6° → 0, 600 ms expo). The score format changes. Press: scale .98 | Tied to M3 | Instant swap | Tap opens the kit in that sport |
| M5 | Char-roll labels (`Roll`) | Hover or focus of the parent link/button | Each letter is replaced by a duplicate from below | 500 ms expo, 16 ms per letter | None (underline only) | None |
| M6 | Nav and footer underline | Hover or focus | 1 px line scales in from the left, out to the right | 500 ms expo | Instant | n/a |
| M7 | Magnetic CTAs (`Magnetic`) | Pointer within the button box + 24 px | The button follows at 0.28×/0.4× and its label at 0.1×/0.14× (quickTo .6 s expo). Release: elastic.out(1,.45) .9 s | — | Off | Off |
| M8 | Ink button fill (`Button`) | Hover or focus | A Flag circle grows from the cursor point (`--mx/--my`; centre on focus). The label turns Ink | 600 ms expo | Instant colour | Press state only |
| M9 | Button press | `:active` | scale .97 | 120 ms | Same | Same |
| M10 | Header (`Header`) | Scroll | Hides on scroll down after 120 px (`translateY(-100%)`, 600 ms lift), returns on scroll up. A red progress hairline scales on X. Home only: the section counter "0X/07 Name" swaps (characters lift in, 550 ms expo) | — | Never hides; progress still updates | Same |
| M11 | Menu (`MenuOverlay`) | Menu button | Full-screen white sheet wipes down with a slanted bottom edge (clip-path, 700 ms lift). Links rise from masks (800 ms expo, 50 ms stagger). The icon morphs to an X (500 ms expo). Link hover: weight glide 600 → 780 plus Flag number | — | Instant show, no rise | Same, no weight glide |
| M12 | Split-line headings (`SplitHeading`) | 15% in view (once) | Lines rise from 108% inside masks | 1050 ms expo, 80 ms per line | Static | Same |
| M13 | Fig. 1 construction (`FigMark`) | 30% in view (once) | Guides draw (dashoffset 1 → 0, 1.6 s hand, 100 ms stagger), then annotations fade (800 ms linear, +1 s). Hover: the pennant skews (−6°) and scales on X 1.08 (900 ms expo) | — | Static drawn | Tap toggles the skew |
| M14 | Sports row wedge (`SportsIndex`) | Hover, focus, or being the scroll-active row | A `--surface` slab sweeps across the row's left 7 columns from the column edge with a slanted leading edge (clip-path, 700 ms hand); a 5 px Flag band lands on that edge (300 ms, after the sweep), so red stays a signal (§1.3). The name glides weight 600 → 760 (700 ms expo) without moving on x. The data line rises (400/600 ms expo). Phones (≤760): no stage; the active row draws its own 72 × 45 ground thumbnail | — | Instant fill, no shift | The active row from scroll gets the slab; the data line is always visible |
| M15 | Ground stage (`GroundStage`) | Active row changes (scroll centre, hover or focus) | The old ground un-draws (dashoffset 0 → 1, 450 ms hand, 12 ms stagger). The new ground draws outward from the centre (1000 ms expo, 40 ms stagger). Dots pop in (scale 0 → 1, 500 ms expo). The corner flag (a 28 px Mark) glides to the new `flag` point and rotation (900 ms hand). The ground caption rolls ("Ground 03 · Basketball court, 28 × 15 m") | Throttled: only the latest target animates | Instant swap | Sticky strip above the list; follows scroll and tap |
| M16 | Fixtures plate (`FixturesPlate`) | Tab or grade chip | The segmented indicator slides (550 ms expo). Rows exit (opacity/−6 px, 200 ms), then enter (10 px → 0, 600 ms expo, 45 ms stagger). Arrow keys move between tabs | — | Instant | Same |
| M17 | Ladder re-sort (`LadderPlate`) | "Play next round" | Random sample results. Rows FLIP to their new positions (WAAPI, 760 ms hand, longer moves +120 ms). Points roll as an odometer (800 ms expo, 40 ms per digit). ▲/▼ markers fade in. Movers get a 1.2 s white 6% flash. aria-live: "Round 9 played. Northside Comets move up to 2nd." | — | Instant reorder + announcement | Same |
| M18 | Club logos (`LogosPlate`) | Auto once at 50% visible, then "Run again" | A red scan line sweeps the grid (1.1 s hand). Placeholders resolve row by row (300 ms per row, 70 ms per tile): the real crest goes scale .6 → 1 and rotate −8° → 0 (700 ms expo) while the placeholder scales up 1.2 and fades. The count "n of 12 matched" rolls. Then the "Next match" strip fades in with two matched crests. Tile hover/focus: lift 3 px and show the name | — | Instant matched, count announced | Tap shows the name |
| M19 | RSVP (`RsvpPlate`) | Segmented choice, meal chips, stepper | Headcount odometer (800 ms expo). A "You" avatar pops in (scale 0 → 1, 600 ms expo). The pay row appears (fx-in 600 ms expo). The amount rolls. Stepper press scales to .9. aria-live: "You're going. 47 going." | — | Instant | Same |
| M20 | Announcements (`NoticesPlate`) | "Post a notice", Pin | A new item drops in from the top (−100% → 0, 700 ms expo) while the others FLIP down (650 ms hand). Pin moves the item into the Ink banner with a 250 ms crossfade, and the pin icon rotates 45° (500 ms expo) | — | Instant | Swipe left past 96 px dismisses the item, with a spring back below that threshold and an Undo toast 4 s. A "Dismiss" button exists for keyboard users |
| M21 | Player profile (`PlayerPlate`) | Present/Past | The identity fades and swaps (260 ms out, 600 ms expo in). Stats roll as odometers. The 1998–2026 timeline bars animate height (700 ms expo, 18 ms per bar): red for the current era, Ink for the past one | — | Instant | Same |
| M22 | Kit index accordion (`KitIndex`) | Click / Enter on a row (every width) | One row open at a time (the first starts open). The panel opens inline (grid rows 0fr → 1fr, 500 ms expo): description under the title, beside it (below under 1024) a small working mock-up with labelled sample text. Fine pointer hover: the title glides 600 → 720 and nudges 12 px, other closed titles dim to `--muted`, the + turns. Nothing floats over the list (W5/W14) | — | Instant open/close | Rows are accordions (`aria-expanded`); closed panels are `inert` + visibility:hidden |
| M23 | PlayHQ sync line (`SyncLine`) | Scroll scrub (start: top 70%, end: bottom 60%, scrub .6) | A 2 px Flag line draws along the path PlayHQ → Sync → Site: horizontal, a 45° drop, horizontal. Four stations (Fixtures, Results, Ladders, Club logos) fill Flag and their labels lift in as the line passes them | Linear (scrub) | Fully drawn, all lit | Vertical path, labels in flow, same scrub |
| M24 | Global sport switch (`SportSwitch`) | Click/Enter on a sport row ("Use AFL in the kit"), or a chip in the sticky control above the plates | Every plate re-skins: the score format, ladder columns (AFL %, soccer/hockey GD, basketball/baseball PCT, netball %, cricket %), stat labels, event name and grade names. A plate-wide crossfade (opacity .4 → 1 with a 6 px lift, 450 ms expo, 40 ms stagger across plates). The chip indicator slides (550 ms hand). The Next up card follows. aria-live: "Kit now showing netball" | — | Instant | The chip row scrolls horizontally |
| M25 | Run a sync (`SyncLog`) | Button | Sample log lines stream in, 380 ms per line (fx-in 500 ms expo). The final line is shown in `--flag-text` | — | All lines at once | Same |
| M26 | Any-domain theme switch (`AnyDomain`) | Segmented control (Clinic / Studio / Cellar door) | The stage background, radius, typeface, heading weight, accent and copy change over 700 ms hand, with a text crossfade (250 ms). The token readout rolls each value ("Radius 18 → 0"). The editorial card art morphs its shapes (900 ms expo) | — | Instant | Same |
| M27 | Footer wordmark (`FooterWordmark`) | Rises into view (scrub, translateY 40% → 0). Pointer proximity (fine pointer) | Each glyph lifts by a Gaussian falloff from the pointer's x (σ = 1.2 glyph widths, maximum −10% of cap height, quickTo .5 s expo). The pennant-shaped full stop under the nearest glyph slides to it (600 ms expo) | — | Static at rest | A once-only lift wave across the glyphs (60 ms stagger, 700 ms expo) when the wordmark enters view |
| M28 | Contact mark build (`ContactMark`) | Scroll scrub (start top 80%, end centre, scrub .6) | Fig. 2 guides draw, the pole fills (clip-path wipe along 45°), then the pennant unfurls (scaleX 0 → 1). After that the mark tilts −4° on pointer movement (±4°, quickTo .8 s) | Linear (scrub) | Static complete mark | Same scrub, no tilt |
| M29 | Copy email (`CopyEmail`) | Click | The label lifts out and "Copied ✓" rolls in (450 ms expo), reverting after 2.2 s. `role="status"` announces "Email address copied". If the clipboard fails: "Press Ctrl+C" with the address selected | — | Instant | Same |
| M30 | Plate corner tab | Plate hover or focus-within | A Flag pennant tab (18 px) unfolds at the top-right corner (clip-path, 600 ms expo). "Interact ↗" nudges 2 px | — | Static tab on focus | Tab visible on the active plate |
| M31 | Brand mark | Header brand hover | The mark tilts −8° and rises 1 px (700 ms expo) | — | None | None |
| M32 | Focus notch | Any plate or card `:focus-visible` | The 2 px Ink ring, plus a 6 px Flag pennant notch at the top right (`::after`) | Instant | Same | Same |
| M33 | Hero scroll cue | Idle | A hairline loops (2.4 s hand, infinite). Stops when the page is scrolled > 40 px | — | Static | Hidden |
| M34 | Case study frame scrub (`Features`, kept) | Scroll | The full-page capture scrolls inside the browser frame through the feature's `scroll` window | Scrub .6 | Static top of capture + index | Accordion with a 4:3 window |
| M35 | Compare slider (`Compare`, kept) | Drag, arrow keys | The divider follows (quickTo .3 s). Labels swap emphasis at 50% | — | Same, no easing | Drag, plus buttons |
| M36 | Phone strip (`PhoneStrip`, kept) | Buttons, swipe | Snap scroll; the progress bar scales | 600 ms hand | Instant | Native scroll-snap |
| M37 | Work row preview (`WorkRow`) | Hover, focus | A framed `home-720` preview follows the cursor (.6 s power3), and its clip-path opens on the flag slant (600 ms expo) | — | Inline thumbnail | Inline thumbnail |
| M38 | 404 mark | Load, pointer | The mark drops in tilted (rotate −14°, 900 ms expo) and sways with the pointer (±6°) | — | Static | Static |

**Global reduced motion:** `* { transition-duration: .01ms !important; animation-iteration-count: 1 !important }`, except the loader's `ld-rm`. Lenis is off. All scrubs render their end state. Nothing is hidden: every reveal's hidden state is gated by `html.hydrated` **inside** `@media (prefers-reduced-motion: no-preference)`, so it never applies under reduced motion. There is no `.rm` class.

---

## 5. Components (with states)

`(C)` marks a client component. Everything else is a server component. State lists cover rest, hover, focus-visible, active, disabled, and loading or empty where relevant.

### 5.1 Shell
- **C1 `Loader`:** see §3.
- **C2 `Header` (C):**
  - Layout: height 68 px (60 px under 760); background `rgba(255,255,255,.86)` with `backdrop-filter: saturate(1.4) blur(14px)`.
  - Contents: brand (Mark 26 px + Wordmark 22 px high, links to `/`), section counter (home only, ≥ 1100), nav, CTA "Start a project" (Ink button → `/contact`), and the Menu button under 1100.
  - States: `is-scrolled` (adds a 1 px `--line` bottom border), `hdr-hidden`. The progress hairline sits at the bottom edge.
  - **Nav:** Work · Studio · PlayHQ (`/#playhq`) · Contact. `aria-current="page"` gets the underline held at full width.
- **C3 `MenuOverlay` (C):** `role="dialog" aria-modal="true" aria-label="Menu"`.
  - Items: numbered list 01 Home · 02 Work · 03 Studio · 04 PlayHQ · 05 Contact, then the email link, then the brand line.
  - Behaviour: focus is trapped, Esc closes, focus returns to the trigger, and `#main` and the footer are made `inert`.
  - States: closed (hidden), opening, open, closing.
- **C4 `Button`:** variants `ink` (primary), `flag` (Ink label), `ghost` (`--ui-line` inset, hovering to an Ink inset), and `sm`.
  - Heights: 48 px, `sm` 40 px. Under 760 every target is still ≥ 44 px.
  - States: rest, hover (M8/M7), focus (ring), active (M9), disabled (opacity .4, `aria-disabled`, no magnet).
  - It renders `<a>` or `<button>` and is never a div.
- **C5 `Roll`:** char-roll text with a visually-hidden copy of the label.
- **C6 `Tag`:** mono 10 px, `--ui-line` border, a Flag pennant bullet, and the text "Sample data" (or "Sample run" / "Sample brands"). It is a real word, never an icon only.
- **C7 `Segmented` (C):** `role="tablist"` (view switches) or `role="radiogroup"` (choices).
  - Track `--surface` (white with an inset line inside plates), sliding indicator, arrow keys, roving tabindex.
  - States: selected (Ink indicator inside plates with white label, white indicator elsewhere with Ink label), hover (label Ink), focus ring.
- **C8 `Chips`:** `aria-pressed` toggles. States: off (`--ui-line` border, muted label), on (Ink fill, white label, with "✓ " prefixed for meal chips), hover (Ink border).
- **C9 `Footer`:**
  - Top row: brand line plus Mark.
  - Footer nav: Work · Studio · PlayHQ · Contact · Email.
  - The legal line "Websport · websport.com.au" and the PlayHQ trademark note.
  - Then the **giant wordmark** (M27): Wordmark paths with `glyphs`, `width: 100%` of `.wrap`, `aria-hidden`.
  - The footer is the only place the "Work" link appears apart from the nav and menu.
- **C10 `Cursor` (C):** see 4.5.
- **C11 `NextUpCard` (C):**
  - Size: fixed 340 × 152 px (under 760: 100% × 136 px). `--surface` background, radius 4.
  - Header: "Next up" mono plus the Sample data tag.
  - Body: two crest rows (crest 28 px, club name, score or time right-aligned in mono 75% tabular), plus a meta line ("Sat 1:40 pm · Ground 2 · Seniors").
  - The whole card is a link-button: "Open the kit in {sport}" (`aria-label`) → `/#build`. Activating it sets the global sport.
  - States: rest, hover (corner tab M30, lift 2 px), focus (ring + notch), pressed.

### 5.2 Hero pieces
- **`Roller` (C):** a grid-stack of eight words, so the slot width is the widest word ("basketball."). The visible H1 is `aria-hidden`, and a sibling `.sr` reads "Websites and apps for clubs that play every sport." The `0X / 08` counter is hidden under 760. Beside the counter there is a mono "Pause" / "Play" toggle (`aria-pressed`, 44 px hit area, 2.2.2). Under 760 it moves to the end of the hero meta row.
- **`HeroMeta`:** a four-cell mono row on an Ink rule. Cells 3 and 4 are hidden under 760.

### 5.3 The six plates (home 03), in founder priority order

**Shared plate anatomy**
- `article.plate[aria-labelledby]`.
- Head: "Plate 0N", the title as h3, and the Sample data tag.
- Body.
- Footer: "**Decision** …" sentence plus "Interact ↗" (`--flag-text`).
- All initial data is **server-rendered** from `src/content/sample.ts` (no blank plates before hydration, W8).

**Layout at ≥ 1100**
- Row A: P1 Fixtures (columns 1–7) | P2 Ladder (8–12). Body height 520 px.
- Row B: P3 Logos (1–5) | P4 RSVP (6–12). Body height 500 px.
- Row C: P5 Announcements (1–7) | P6 Player (8–12). Body height 500 px.
- Bodies are `display:flex; flex-direction:column`, with the action row `margin-top:auto`. The filler elements below are designed to occupy the gap, so there is no dead space (W3).
- Under 1100 the plates stack, with no fixed heights, in this order: P1, P2, P3, P4, P5, P6.

**Sticky sport control (M24)**
- Above the plates: "Kit in:" + chips (AFL · Soccer · Basketball · Baseball · Netball · Cricket · Hockey · Any), plus the tag "Sample data".
- Sticky at `top: 84px` while the plates section is in view (`position: sticky` in the section). It becomes a horizontal scroll row under 760.
- The default sport is "Any", a generic format.

**Per-sport formats (`sample.ts` → `SPORTS`)**

| Sport | Score format (example) | Ladder columns | Points per win | Player stat 3 |
|---|---|---|---|---|
| Any | 3 – 2 | P W L Pts | 2 | Points |
| AFL | 8.11 (59) – 6.9 (45) | P W L D % Pts | 4 | Goals |
| Soccer | 2 – 1 | P W D L GD Pts | 3 | Goals |
| Basketball | 68 – 61 | P W L PCT Pts | 2 | Points |
| Baseball | 5 – 3 | P W L PCT | — | Hits |
| Netball | 42 – 38 | P W D L % Pts | 4 | Goals |
| Cricket | 6/182 – 9/170 | P W L % Pts | 6 | Runs |
| Hockey | 3 – 2 | P W D L GD Pts | 3 | Goals |

**P1 Fixtures & results (C)**
- Controls: Segmented Upcoming/Results (tablist) plus grade chips All/Seniors/Juniors.
- List: six rows of `round | home crest+name | time or score | away crest+name | venue`. Under 760 this becomes a two-line row (home over away, time or score on the right, venue hidden).
- Result badge: W (Ink) or L (`--ui-line`).
- Empty state for a chip with no rows: "No {grade} fixtures this round." in muted.
- Decision: "Pulled from PlayHQ, season by season, grade by grade. Nobody retypes a fixture list again."

**P2 Ladder (C, Ink stage `.is-ink`)**
- Six clubs, with our club marked by a Flag pennant after its name.
- Columns follow the sport (the table above). Names switch to the `short` form at ≤ 480 (W16).
- Action: Flag button "Play next round", plus "After round 8" in mono.
- An `aria-live` region announces results (M17).
- Column headers are `<button>`s that sort the column (`aria-sort`).
- Decision: "Rows move, they don't jump. You see who climbed before you read a number."

**P3 Club logos (C)**
- A 4 × 3 grid of tiles. The initial SSR state is unmatched placeholders (W8).
- Then the count ("0 of 12 matched", `aria-live`) and the button "Match logos" / "Run again".
- Filler: a "Next match" strip, `home crest · v · away crest · Sat 1:40 pm`, which appears matched once the run completes. Its unmatched form shows placeholder shields.
- Tiles are focusable (`tabindex=0`, `aria-label="{club}, logo matched"`).
- Decision: "Every team and every opponent wears its own badge, matched from PlayHQ data. A fixture should read at a glance."

**P4 Events & RSVP (C)**
- Event card: date block, title ("Season launch night"; the name per sport comes from `SPORTS`), meta "7:00 pm · Clubrooms · Dinner $25", avatars, and the "46 going" odometer.
- Controls: a radiogroup Going/Maybe/Can't make it; meal chips Roast/Vegetarian/Kids; a guests stepper (shown only for Going); a Flag button "Pay $25 via event link" (amount rolls). It is a `button` that opens nothing, with the note "Demo: no payment is taken".
- Decision: "One tap to RSVP, a live headcount for the committee, and payment straight through the event's link."

**P5 Announcements (C)**
- An Ink banner "Pinned · Junior registrations are open on PlayHQ."
- A list of four notices (tag, text, time, pin button with `aria-label="Pin notice"`).
- The button "Post a notice" cycles through five sample notices. When the list is long it shows "Archive: 23 notices" as a filler line.
- Decision: "Post once. It shows up everywhere it should, from the home page banner to the archive."

**P6 Player profiles (C)**
- Controls: Segmented Present/Past.
- Card: number, name, era line.
- Stats: Games, Seasons, the sport's stat 3, Club awards.
- The season timeline 1998–2026 (29 bars) grows to fill the remaining height.
- Present is "Sam Okafor · #7 · Current squad · Seniors" (48 / 4 / sport stat / 2). Past is "Jo Whitfield · #14 · 1998–2009 · Past player" (212 / 12 / sport stat / 9).
- Decision: "Past players keep their page. Come back in twenty years and your name is still on the club's site."

**Sample names (only these):** Northside Comets, Riverbend, Eastvale Owls, Banksia Bay, Ironbark, Westgate, Kestrel Park, Saltwater, Hillcrest, Granite Hill, Lakeside, Redgum Flat. Players: Sam Okafor, Jo Whitfield, plus avatar initials only. Our club in the ladder is "Northside Comets".

### 5.4 Other home components
- **`FigMark`:** Fig. 1 with a figcaption.
- **`SportsIndex` + `GroundStage` (C):** see 6.1 H2. Rows are `<li>` with a `<button>` "Use {Sport} in the kit" (`aria-describedby` → the data line). The stage is `aria-hidden`, with a visible mono caption.
- **`KitIndex` (C):** rows are `<button aria-expanded>`. The preview card is `aria-hidden`.
- **`SyncLine` (C)** and **`SyncLog` (C):** the log is `aria-live="polite"`. The "Run a sync" button shows the busy state (`aria-busy`, label "Syncing…") while streaming.
- **`AnyDomain` (C):** a radiogroup, three cards (booking slot picker, pricing toggle, editorial card), and the `TokenReadout` (a mono `dl`: Typeface, Radius, Accent, Heading weight).
  - Booking: day buttons are `aria-pressed`, unavailable slots are `disabled` with a line-through and `aria-label` "… unavailable", and Confirm is disabled until a slot is picked. Confirm then shows "Booked: Tue 10:30" in place for 2 s.
  - Pricing: Monthly/Yearly radios roll the prices (29 → 290 and 59 → 590 per year).
- **`ContactMark` (C):** the M28 scrub.
- **`CopyEmail` (C):** kept, re-themed: Flag button with an Ink label.

### 5.5 Case study and work components (kept, re-themed light)
- **`CaseHero`:** framed capture in a browser frame (`--surface` chrome, 3 traffic dots in `--line-2`, URL text mono). No dark shade.
- **`Compare`:** labels outside the image, range input.
- **`Features`:** `FeatureFrame` ≥ 1024 / `FeatureIndex` below. Frame chrome as in `CaseHero`.
- **`Counter`.**
- **`PhoneStrip`:** phones get a 1 px `--line-2` bezel on white, with no shadows except the single elevation.
- **`StoryExcerpt`:** label "From a member story", the quote in `--t-h3` at weight 500, the source link.
- **`WorkRow`.**
- **`GhostRow`:** dashed `--ui-line` border. "Your club, next."
- **`JsonLd`.**
- **`PennantRail`:** **delete it.** Its role moves to the header progress line.

---

## 6. Pages (final copy)

Metadata pattern: `title` "{Page} — Websport", a per-page `description`, `alternates.canonical`, and `og(path)`.

### 6.1 Home `/` (NO Lang Lang)
- **Title:** "Websport — Websites & apps for community sports clubs"
- **Description:** "Websport designs and builds websites and apps for community sports clubs on PlayHQ, across every code, and brings the same craft to any brand."
- **Header counter:** 00 Index · 01 Positioning · 02 The sports · 03 What we build · 04 The full kit · 05 PlayHQ · 06 Any domain · 07 Contact.

**H0 Hero** (`min-height: 100svh` on desktop, auto on mobile)
- Meta row (mono, on an Ink rule): "Websport · Club websites & apps · Runs on PlayHQ data · Design for any brand".
- H1, as three `.h-line`s: "Websites & apps / for clubs that play / **anything.**" The last word is the roller (Flag): anything. → AFL. → soccer. → basketball. → baseball. → netball. → cricket. → hockey. Screen readers get: "Websites and apps for clubs that play every sport."
- Foot (hairline top, 12 columns):
  - Columns 1–5: sub (`--t-lead`): "We design and build websites and apps for community sports clubs on PlayHQ: fixtures, ladders, logos, events, notices and every player who has worn the colours. The same craft goes into anything else we make."
  - Columns 6–8: the Ink button "Start a project" (→ `#contact`, magnetic) and the underline link "Play with the kit" (→ `#build`).
  - Columns 9–12: `NextUpCard`.
- Scroll cue (mono "Scroll", desktop only).
- Under 760: meta (2 cells), H1, sub, CTAs in a row, the card full width.

**H1 `01 — Positioning`**
- H2 (split): "Specialists in club sport. *Designers for everything else.*" (italic in muted).
- Fig. 1, "The mark" (columns 9–12). Caption: "Every club plants its flag online. A pennant for the club, a pointer for the web, drawn on one 45° line."
- Two columns:
  - "Club sport": "We work with community clubs across every code on PlayHQ. We know what a weekend looks like from the committee's side: the fixture changed, the ground moved, the presentation night needs numbers. A club site should keep up without anyone retyping a thing."
  - "Any domain": "The craft that makes a club site feel alive (type, motion, systems that hold up) is the same craft we bring to studios, clinics, makers and brands. Club sport is our speciality, not our limit."

**H2 `02 — The sports`** (the scroll set piece, W1a)
- Head: "Every code. One clubhouse." Lede: "If your club runs its season on PlayHQ, the site can run off it too. The sport changes the scoring, not the job. Pick one and the whole kit below switches to it."
- **Layout ≥ 1024:** two columns inside `.wrap`.
  - Left (columns 1–7): the sports list, rows in `--t-row`, each with the number, the name and the data line "Fixtures · Ladders · Results · Players". Row 08 is "And the rest", with the data line "If it's on PlayHQ, ask us".
  - Right (columns 8–12): the `GroundStage`, `position: sticky; top: calc(50vh - 22vw)`, 4:3, with the caption under it.
  - The active row is the one crossing the viewport centre (ScrollTrigger per row, `start: "top center", end: "bottom center"`). Hover or focus overrides it while held.
  - The red wedge (M14) fills only the left columns, so it never runs under the stage. **Linework never sits behind text** (W14).
- **Under 1024:** the stage is a sticky strip (`top: 60px`, height `min(36svh, 240px)`, white background, `--line` bottom rule) above the list. Grounds are drawn landscape at the strip size. Tap selects the active row.
- Each row's button: "Use {Sport} in the kit" (visually, a mono "Use in kit →" appears in the data line on hover or focus). It sets the global sport and smooth-scrolls to `#build`.
- Stage captions:
  - "Ground 01 · AFL oval"
  - "Ground 02 · Soccer pitch, 105 × 68 m"
  - "Ground 03 · Basketball court, 28 × 15 m"
  - "Ground 04 · Baseball diamond"
  - "Ground 05 · Netball court, 30.5 × 15.25 m"
  - "Ground 06 · Cricket oval"
  - "Ground 07 · Hockey pitch, 91.4 × 55 m"
  - "Ground 08 · Any field: a grid"

**H3 `03 — What we build`** (`id="build"`)
- Head: "Six plates from the club kit." Lede: "Built in code, right here on the page. Press, sort and toggle them. Every club, name and number is sample data."
- Then the sticky sport control and the six plates (5.3).

**H4 `04 — The full kit`**
- Head: "And the rest of the clubhouse." Lede: "The plates are the headline features. These are what make a site something the committee can run without us."
- Rows:
  - 07 Stories: "Members write about a match, a season or what the club means to them. A committee member reviews every story before it goes up."
  - 08 Committee admin: "A password-protected admin where officials manage events, notices, players, documents and sponsors, and resync PlayHQ when they need to."
  - 09 Sponsors: "Sponsor tiers with logos and links that the committee can update when a deal is signed, not when a developer is free."
  - 10 Documents: "Constitution, policies, codes of conduct and AGM minutes in one place, current version on top."
  - 11 Gallery: "Photos from game day and presentation night, grouped by event and season."
  - 12 Committee & contacts: "Who to talk to about registrations, coaching, the canteen or a lost jumper, with the right email for each."

**H5 `05 — PlayHQ integration`** (`id="playhq"`)
- Head: "PlayHQ in. Club site out." Lede: "Your competition data already lives in PlayHQ. We connect to its API so the site shows the same fixtures, results, ladders and players, without a volunteer copying them across."
- Grid:
  - Columns 1–8: `SyncLine` (M23) with three nodes:
    - Source **PlayHQ**: "Competitions, grades, fixtures, results, ladders, players and club details."
    - Websport sync **Matched & cached**: "Season by season, grade by grade. Teams and opponents matched to the right logos. The committee can resync any time."
    - Your site **Club pages**: "Next match on the home page, fixtures and results, ladders, and a profile for every player."
    - Four stations on the line: Fixtures · Results · Ladders · Club logos.
  - Columns 9–12: `SyncLog` on the **Ink stage** (this section's dark mass). Header "Sync log" plus the tag "Sample run", the button "Run a sync". Log lines (sample):
    - "Connecting to PlayHQ"
    - "Season 2026 · 9 grades"
    - "142 fixtures · 38 results"
    - "9 ladders updated"
    - "24 clubs · 24 logos matched"
    - "312 player profiles"
    - "Done in 4.2 s"
- Note (mono, muted): "PlayHQ is a trademark of its owner. Websport is an independent studio."

**H6 `06 — Design for any domain`** (`id="any"`)
- Head: "Same craft. Any brand." Lede: "One system underneath three everyday components. Switch the brand and watch type, colour, shape and voice change together."
- The segmented control (Clinic / Studio / Cellar door) and the tag "Sample brands" sit in the section-head row (W6).
- The stage holds three cards plus the `TokenReadout`.
- Theme copy:
  - Clinic: "Book an appointment" / "Membership: Essential, Complete" / Journal "What a good first visit feels like".
  - Studio: "Book a studio session" / "Plans: Solo, Team" / "Notes on making things slowly".
  - Cellar door: "Reserve a tasting" / "Wine club: Cellar, Reserve" / "A vintage worth waiting for".
- Footer link: "More about the studio →" (`/studio`).

**H7 `07 — Contact`** (`id="contact"`)
- Columns 1–7: H2 (`--t-cta`, split) "Plant your flag."
- Columns 8–12: `ContactMark` (M28).
- Then the email row: the link "hello@websport.com.au" (mailto, roll) plus the Flag button "Copy email".
- Sub: "Tell us about your club or your brand. A paragraph is plenty."
- The headline never overlaps the mark (W14 / the pitch-lines contact fix).

**Footer (C9)**

**Forbidden on home:** any Lang Lang text, image or link other than the nav/menu/footer "Work" link. Build check: `grep -ri "lang lang\|langlang" out/index.html` returns 0.

### 6.2 Work index `/work`
- **Title:** "Work — Websport"
- **Description:** "Websport's club work, starting with our first customer: Lang Lang Cricket Club's website and club platform."
- **Header:** eyebrow "Work". H1 (`.h-line` × 2): "Our first club. / *Built properly.*"
- **Lede** (columns 1–6): "Every studio starts somewhere. Ours started with Lang Lang Cricket Club, our first customer: a 2019 brochure site that became the centre of the club. It's a success story we're proud of, and the standard every club after it gets."
- **List:**
  - Row 01, `WorkRow` (M37): "Lang Lang Cricket Club" · "Website & club platform" · meta "PlayHQ · Club logos · Events & payments · Announcements · Player profiles" · "Case study →" → `/work/lang-lang`.
  - Row 02, `GhostRow`: "Your club, next." · "Any code on PlayHQ" → `/contact`.
- **Band** (hairline top, two columns):
  - Left: "Every code on PlayHQ" plus the mono sports line "AFL · Soccer · Basketball · Baseball · Netball · Cricket · Hockey · And the rest".
  - Right: "Not a club? The craft is the same." plus "See the studio →".
- **Contact band:** "Plant your flag." (smaller, `--t-h2`) plus the email row.

### 6.3 Case study `/work/lang-lang` (re-themed light; content from `src/content/work/lang-lang.ts`, which is unchanged except where noted)
- **Title:** "Lang Lang Cricket Club — Websport"
- **Description:** keep `summary`.

**CS0 Hero**
- Eyebrow: "Case study · Our first customer · Website & club platform".
- H1 (`.h-line`): "Lang Lang / Cricket Club". Sub (`--t-lead`, ink-2): "A club that lives on its website."
- Meta `dl` (4 columns, mono labels):
  - Client: Lang Lang Cricket Club
  - Work: Website & club platform
  - Stack: Next.js App Router · Postgres + Drizzle · Vercel Blob · PlayHQ API · Admin CMS
  - Live: langlangcricketclub.com ↗
- No year.
- `CaseHero` frame (columns 1–12, 16:10, `home-1440`). It is pinned and scales from .92 to 1 on scrub (≥ 1024). Caption: "Now: langlangcricketclub.com, the club's front door."

**CS1 The brief**
- Label "The club", then `intro` (`--t-lead`).
- h2 "It's not all stats and titles.", then the two `vision.paragraphs`.

**CS2 Before / now:** "From a brochure to a clubhouse." `Compare` (`before-1440` vs `home-1440`), then two captions (`before.old` / `before.now`).

**CS3 What we built:** "Everything the club does, in one place." plus the note "In the order the club cares about most." The five primary features come from `built.primary`, in **founder order**:

| No | Title | Capture | Frame window |
|---|---|---|---|
| 01 | Fixtures, live from PlayHQ. | `fixtures-full` | [0, 0.3] |
| 02 | Every team matched to its club. | `team-full` (B Grade team page; no public page renders opponent logos, so the claim is stated in the body, never shown with mock crests) | [0.209, 0.278] |
| 03 | Events you can RSVP and pay for. | `event-rsvp-full` | [0, 0.45] |
| 04 | Every notice, in one place. | `announcements-full` | [0, 0.22] |
| 05 | Players, present and past. | `player-full` | [0, 0.06] |

- Bodies and captions come from `lang-lang.ts`.
- **Crest rule:** the case study never uses the generated sample crests or any mock UI. Feature 02 shows only the real capture, captioned with what is visible ("Every Lang Lang side with its grade and ladder position, from PlayHQ") until the logos capture exists (8, item 12).
- "Also in the build": stories (`story-full` thumbnail, links to the live story ↗) and committee admin (chips plus the note "Admin not shown: it's behind the committee's password.").

**CS4 Numbers:** "7" (Lang Lang sides synced from PlayHQ) and "8" (Areas the committee runs without a developer). Two `Counter`s, Host Grotesk 600 `clamp(96px,12vw,200px)` tabular, muted captions.

**CS5 Member story** (`StoryExcerpt`):
- Label "From a member story".
- Quote: "When I arrived in Australia in 2024, I was a fresh migrant trying to figure out where I fitted in."
- Caption from `excerpt.caption`, linking to the story.
- Never styled or labelled as a testimonial.

**CS6 On a phone:** "Built for the sideline, not the desk." `PhoneStrip` with `mobile.shots`.

**CS7 Next:** GhostRow "Your club, next." / "Any code on PlayHQ. Tell us what you play." → `/contact`, plus "All work" → `/work`.

**JSON-LD:** `CreativeWork` (existing `JsonLd`), no date.

### 6.4 Studio `/studio` (owns Process and the full "beyond sport" story)
- **Title:** "Studio — Websport"
- **Description:** "Websport is a design and development studio: specialists in community sports club websites and apps on PlayHQ, and designers for any brand."

**ST0 Header**
- Eyebrow "Studio". H1: "Club sport is our speciality. / *Craft is our trade.*"
- Lede (columns 1–7): "Websport is a design and development studio. Community sports clubs on PlayHQ are what we know best: the fixtures, the committees, the Saturday-morning phone checks. The craft underneath (type, motion, interface, accessibility and speed) isn't sport-specific, so we bring it to any brand that wants to be seen properly."
- Columns 9–12: a large Mark with the Fig. 1 guides (static; pointer tilt on fine pointers).

**ST1 `01 — What we build`:** "Two lists, *one standard.*"
- For clubs:
  1. "Club websites & apps": "Fixtures, results and ladders from PlayHQ, for any code."
  2. "The right logo on every team": "Every side and every opponent, matched from PlayHQ data."
  3. "Events, RSVP & payments": "Event pages with a live headcount, RSVPs in a tap and a payment link."
  4. "Announcements": "Notices that post once and show everywhere they should."
  5. "Player profiles, present and past": "Seasons, teams and career stats for everyone who has worn the colours."
  6. "Stories & committee admin": "Member stories the committee reviews, and an admin volunteers can run."
- Beyond sport:
  1. "Brand identity": "Marks, type and colour systems that hold up from a favicon to a billboard."
  2. "Marketing & product sites": "Sites that explain one thing well and load fast on any phone."
  3. "Interface & motion design": "Prototyped in the browser with real content, so motion has a reason."
  4. "Design systems & front-end": "Tokens, components and documentation your team can keep building with."
  5. "Web apps on Next.js": "Accounts, payments and admin, on the same stack as our club platform."
- **Honest note** (`--surface` panel, columns 3–10):
  - Label: "A note on our portfolio".
  - Text: "Our first customer is a sports club, and we don't have work outside sport to show yet. So judge us on this site: every interaction, every contrast ratio and every millisecond here is the standard we'd bring to yours."
  - Links: "Try the any-domain demo →" (`/#any`) and "Read the Lang Lang case study →".

**ST2 `02 — How we work`** (`id="process"`; the scrubbed rail, a red line scaling on X from 0 to 1 with steps lighting at i/4; vertical rail under 760): "From first chat / *to first fixture.*"
1. "Listen": "We sit down with the committee or your team and learn how things actually run: who posts what, where members look, what the old site gets wrong."
2. "Design in the browser": "Type, colour and components designed as working pages, so you react to the real thing rather than a picture of it."
3. "Build & connect": "We build it, connect PlayHQ and your payment links, and set up the admin around how your people work."
4. "Hand over the keys": "Whoever is taking it on learns the admin with us. After that, it's your site to run."

**ST3 `03 — Standards`:** "What we hold / *every project to.*"
1. "Accessible by default": "WCAG 2.2 AA: keyboard paths, visible focus, real contrast, and a calm version for anyone who prefers reduced motion."
2. "Fast on real phones": "Performance budgets set before design starts, checked on mid-range Android, not just a laptop."
3. "Motion with a reason": "Every animation explains something or answers you. If it doesn't, it goes."
4. "Run by you": "Content your people can update themselves, from an admin built around how they actually work."

**ST4 `04 — Stack`:** chips Next.js · React · TypeScript · Postgres + Drizzle · Vercel · PlayHQ API · GSAP. Caption: "What we reach for. We'll tell you why for your project."

**ST5 Contact band:** "Got a club, or a brief / *that deserves better?*" → "Start a project" (`/contact`) plus the email row.

### 6.5 Contact `/contact`
- **Title:** "Contact — Websport"
- **Description:** "Email Websport about a club website, a club app or a design project: hello@websport.com.au."
- Eyebrow "Contact". H1 (`.h-line` × 2): "Got a club, or a brief / *that deserves better?*"
- CTA row: Ink button "Email us" (`mailto:hello@websport.com.au?subject=New%20project`, magnetic) plus `CopyEmail` showing the address at `--t-mail` (`overflow-wrap: anywhere`).
- Columns 9–12: ContactMark in its completed state (with a pointer tilt).
- "What helps in a first email" (numbered mono list, muted):
  1. "Your club or company name, and a link to the current site if there is one."
  2. "The codes you play on PlayHQ, or what you make."
  3. "What isn't working today."
  4. "Anything with a date on it: a season launch, an AGM, a presentation night, a product launch."
- Note: "No forms. Your email comes straight to us."
- No phone, address, reply time or socials.

### 6.6 404 (`not-found.tsx`, exported as `out/404.html`)
- **Title:** "Page not found — Websport"
- The Mark at 120 px (M38). Eyebrow "404". H1: "Out of / *bounds.*"
- Body: "This page isn't on the field. These ones are:"
- Links as big rows (weight glide + char-roll): Home · Work · Studio · Contact. Then "Or email hello@websport.com.au".

---

## 7. Responsive, accessibility, performance, SEO

### 7.1 Responsive
- **Breakpoints:** 480, 760, 1024, 1100, 1440, 1920.
- **Test widths:** 320, 360, 390, 768, 1024, 1280 × 720, 1440 × 900, 1920.
- **Under 760:**
  - Single-column hero; the Next up card is full width at 136 px.
  - Sticky ground strip.
  - Plates stack; fixtures use two-line rows; ladder names use the short form at ≤ 480.
  - Kit rows become accordions.
  - The sync line is vertical with labels in flow.
  - Any-domain cards stack.
  - Header CTA hidden (menu only).
  - No cursor, magnetic effect or hover preview.
- **1024–1099:** the nav collapses to the menu button.
- **≥ 1100:** everything.
- **No horizontal overflow** at any width: `body { overflow-x: clip }`, and Playwright asserts `scrollWidth === innerWidth` at every test width.
- The footer wordmark is SVG `width:100%`, so it cannot overflow (W9).
- **Touch targets:** at least 44 × 44 for primary controls and at least 24 × 24 everywhere (2.5.8). Chips are 36 px high, with the hit area extended to 44 by a pseudo-element.
- Every hover-only reveal has an always-visible or tap equivalent (sports data line, kit description, crest names, the cursor tag is decorative).
- `100svh` is used only for the desktop hero and the case hero pin.

### 7.2 Accessibility (WCAG 2.2 AA; target Lighthouse Accessibility 100 and axe 0 violations)
- **Structure:**
  - Skip link → `#main`.
  - One `h1` per page; heading levels never skip (plates are h3 under section h2).
  - Landmarks: header, primary nav, main, footer and footer nav.
  - `lang="en-AU"`.
- **Contrast:** per 2.3, including the non-text 3:1 control boundaries (`--ui-line`).
- **Focus:**
  - The 2 px Ink ring with 2 px offset, never removed.
  - `scroll-padding-top: 96px`, so focused items are never under the header (2.4.11).
  - The header never hides while focus is inside it.
- **Keyboard parity for every demo:**
  - Tabs and radios use arrow keys with roving tabindex.
  - Ladder headers sort with Enter.
  - Crest tiles are focusable.
  - Notices have Pin and Dismiss buttons.
  - The stepper uses buttons.
  - The theme switch is a radiogroup.
  - Sport rows are buttons.
  - The Next up card is a link-button.
- **Live regions** (`aria-live="polite"`, one per demo, visually hidden): fixtures view changes ("Showing results, seniors"), ladder position changes, crest count, RSVP count, new notices, player era, sport switch, sync log, copy status (`role="status"`).
- **Motion:**
  - Full reduced-motion path (3.6 and 4.6).
  - Auto-moving content (roller, scroll cue, sync packets) pauses offscreen, on hover or focus, and in reduced motion. The roller can also be paused with the "Pause" mono button next to the counter, which satisfies 2.2.2 because it runs longer than 5 s.
- **Dragging:** compare and phone strip have button and key alternatives, and notice swipe has a button (2.5.7).
- **Text:** split text keeps `aria-label`, char-roll keeps visually-hidden text, and decorative SVGs are `aria-hidden`. Crest tiles carry the club name. Images use the descriptive alts from `lang-lang.ts`.
- **Forced colours** and 200% zoom / reflow at 320 px are checked.

### 7.3 Performance budget
- **Targets** (Lighthouse mobile, the median of 3 runs on an idle machine; check `uptime` and keep the load average under 4):
  - LCP < 2.5 s (goal 1.6 s)
  - CLS < 0.05 (goal 0)
  - TBT < 200 ms
  - INP < 200 ms
  - Performance ≥ 90 on every route (goal 95+)
  - Accessibility 100, Best Practices 100, SEO 100
- **LCP mechanics:** the H1 is painted under the loader (3.7). No hero image. Fonts are self-hosted by next/font, with only the Host Grotesk roman and Martian Mono preloaded (the italic is not). The wordmark is paths. CSS is one file, budget ≤ 30 KB gz. Hydration is deferred until after FCP (`defer-hydration.mjs`, kept).
- **JS (gz):**
  - Shared motion chunk (gsap core ~27, ScrollTrigger ~18, lenis ~5, @gsap/react ~1) ≤ 55 KB.
  - Home route client code ≤ 45 KB (all six plates, the stage, any-domain). If it goes over, load P3–P6 plus AnyDomain and SyncLine with `next/dynamic`, hydrated on intersection; their SSR HTML stays in place.
  - First-load JS per route ≤ 190 KB including the framework.
- **Fonts:** 3 files on the critical path (Host Grotesk roman variable, Martian Mono variable, latin), about 90 KB total. The italic is lazy.
- **Images:** home has none (crests and grounds are inline SVG; the ground data is ≤ 18 KB gz). The case study uses the existing responsive webp set via `Picture`, lazy except the hero frame (`fetchPriority="high"`).
- **Runtime:**
  - Animate only `transform`, `opacity`, `clip-path`, `stroke-dashoffset` and `font-variation-settings` (on hover, one element at a time).
  - `will-change` only during a tween.
  - Tickers and loops pause on `document.hidden` and offscreen (IntersectionObserver).
  - Frame budget on a Playwright wheel-scroll run: p95 ≤ 16.7 ms.
- **No third-party scripts.** No cookies, so there is no banner.

### 7.4 SEO, OG, JSON-LD
- `metadataBase: https://websport.com.au`, per-page metadata (6.x), canonical URLs, `twitter.card = summary_large_image`.
- `viewport.themeColor` is `#FFFFFF` and `colorScheme` is `light` (this replaces v3's dark values).
- **OG images** (1200 × 630) from `scripts/og.mjs`, rewritten for white:
  - Ground: white with the 12-column hairline grid at `--line`, a 45° guide, and the Mark at the right (Fig. style with guides).
  - Title in Host Grotesk 600 Ink with an accent word in Flag, and "websport.com.au" as wordmark paths at the bottom left.
  - Per route:
    - home: "Every club plants its flag online."
    - work: "Our first club. Built properly."
    - lang-lang: "Lang Lang Cricket Club: a club that lives on its website." It may include the `home` capture in a browser frame.
    - studio: "Club sport is our speciality. Craft is our trade."
    - contact: "Plant your flag."
  - `og.mjs` must fetch the Host Grotesk TTF instead of Instrument Serif/Geist.
- **JSON-LD:**
  - Home/layout: `Organization` {name, url, email, logo}, with no address and no founding date.
  - Case study: `CreativeWork`.
  - Optional `WebSite` on home.
- `sitemap.ts`: `/`, `/work`, `/work/lang-lang`, `/studio`, `/contact`. `robots.ts`: allow all.
- Icons: `icon.svg` is the Mark on white (Ink pole, Flag pennant), plus a 180 px `apple-icon.png` on white.

---

## 8. Award submission checklist

### 8.1 Gates (all must be true)
1. Every row of §0 verified, with the screenshot or filmstrip named in the QA log.
2. **Loader filmstrips** (seeked frames every 50 ms, 0–2500 ms) at 1440 and 390 show no detached TLD, a band no thicker than `--band`, and no blank frame after 120 ms. Plus a real-time check: hidden by 2.2 s after first paint. Reduced-motion filmstrip. Skip at 400 ms. Repeat visit (`no-intro` at 0 ms). JS disabled (hidden at 2.2 s, page complete).
3. Lighthouse mobile on all 6 routes: Performance ≥ 90 (median of 3), Accessibility 100, Best Practices 100, SEO 100. The LCP element is the H1. Reports saved.
4. axe through Playwright: 0 violations on every route in default, reduced-motion, menu-open, and after interacting with every demo.
5. Keyboard walk of every demo and route, with focus screenshots.
6. No console errors or hydration warnings (dev and the production `out/`).
7. No horizontal overflow at the 8 test widths. Screenshots at 390, 768, 1440 and 1920.
8. **Honesty sweep** on `out/`:
   - "Lang Lang" appears only in `/work*` routes and the sitemap (`out/index.html` has 0).
   - No client names other than Lang Lang.
   - No claim-numbers in marketing copy apart from the case-study 7/8, the 2019 Wix site and the story's 2024. Sample data appears only inside plates and the Next up card, and each of those carries a "Sample data" tag.
   - No city, year founded, availability, reply time, "testimonial" or "Sherlabs".
   - **Exempt** from the numbers rule: standard ground dimensions ("105 × 68 m"), geometry ("45°"), section and plate numbering ("Plate 01", "0X/07"), and tagged sample data ("Dinner $25", ladder figures). The rule targets numbers that make a claim about Websport: clients, years, stats or speed.
9. **Sport-neutral sweep:** outside `/work/lang-lang`, "cricket" appears only in the sports lists, the sport switcher and the roller.
10. Trademark note present on home 05 and the case study footer.
11. OG cards verified for every route.
12. **Logos capture** (prerequisite carried over from v3):
    - Find the live Lang Lang page that shows each side's and each opponent's club logo.
    - Add it to `scripts/capture.mjs` `PAGES`, run `npm run capture -- logos` and then `node scripts/optimize-images.mjs`.
    - Confirm by eye that the logos are visible.
    - Update feature 02 (`shots`, `path`, `scroll`, `caption`).
    - Until then, feature 02 uses the honest fallback. Submit only once this is done, or the founder explicitly accepts the fallback.
13. Founder sign-off on the preview URL.

### 8.2 Craft QA (jury eyes)
- One heavy element per viewport. Scroll at 1440 and 390 and list it for each screen.
- Every interactive element has distinct hover, focus-visible and active states.
- `grep` the code for eases: only `--expo`, `--hand`, `--lift`, `ws.out`, `ws.hand`, `ws.lift`, linear, and the one elastic.
- Stagger groups ≤ 600 ms. Reveals happen once (scrubs excepted).
- Zero CLS during the intro, the sport switch, the roller, the page transition and the font load (Performance panel).
- Sample data is always labelled. No lorem, no "coming soon".
- The 404 is delightful and reachable.

### 8.3 Submission package
- **Awwwards SOTD** (Design Agencies, Sports), **CSSDA WOTD**, **FWA**. Check each form's current asset specs at submission.
- **Title:** "Websport". **URL:** https://websport.com.au.
- **Description** (≤ 300 characters): "Websport builds websites and apps for community sports clubs on PlayHQ, across every code. With no portfolio to hide behind, the site is the proof: a white specimen book of live, touchable club components, grounds drawn in line, and a flag that plants itself."
- **Credits:** Websport (design and development).
- **Tech:** Next.js, React, GSAP, Lenis, Tailwind CSS, Vercel.
- **Fonts:** Host Grotesk, Martian Mono, Sora (wordmark).
- **Colours:** #FFFFFF, #F5F6F8, #0F1729, #5B6475, #E8442B.
- **Assets:**
  - 1440 screenshots: the loader mid-slide, the hero, the sports stage on basketball, the plates with the ladder mid-sort, PlayHQ, any-domain on Studio, contact, the footer.
  - 390 screenshots: hero, stage strip, plates, menu.
  - A 45 s Playwright video at 1440 × 900, 60 fps: the loader, roller, sports scroll, sport switch, ladder sort, logos, RSVP, sync, theme switch, contact build and a page transition.
  - Thumbnail: the loader lockup.
- **Jury notes:** a skippable, once-per-session loader with no JS dependency; reduced-motion and keyboard parity; WCAG 2.2 AA; Lighthouse scores.

---

## 9. Build order and what to delete from v3

### 9.1 Build order
1. **Foundation:**
   - `fonts.ts` (2.4).
   - `globals.css` rewritten: tokens, base, type scale, `.wrap`/grid, buttons, tags, segmented controls, chips, split, odometer, loader CSS, reduced motion.
   - `layout.tsx`: light viewport, new head script, `Loader`, Header, Footer, Cursor, JsonLd.
   - `gsap.ts` eases (4.2), `tokens.ts`.
2. `scripts/wordmark.mjs` → `wordmark.generated.ts`, then `Wordmark.tsx` and `Mark.tsx` (parts).
3. **Loader.** Verify the §8.1 item 2 filmstrips before moving on.
4. **Home static markup** with final copy and SSR sample data (`src/content/sample.ts`, `grounds.ts`). Check the no-JS screenshot.
5. **Shell interactions:** Header (progress, hide, counter), MenuOverlay, Roll, Magnetic, Button fill, Cursor.
6. **Home islands, in order:** Roller + NextUpCard → SplitHeading/FigMark → SportsIndex + GroundStage → SportSwitch → P1–P6 → KitIndex → SyncLine/SyncLog → AnyDomain → ContactMark → FooterWordmark → CopyEmail.
7. **Other pages:** Work, the case study re-theme (CaseHero, Compare, Features, Counter, StoryExcerpt, PhoneStrip, GhostRow, WorkRow), Studio (process rail), Contact, 404.
8. Page transitions (re-theme the `PageTransition` CSS and `.vt-edge`).
9. `og.mjs` rewrite, sitemap/robots check.
10. Passes: reduced motion → accessibility (axe, keyboard) → performance (one `npm run build`, Lighthouse median of 3) → §8 checklist.

Iterate with targeted checks (a single Playwright script per feature). Run the full build once per milestone, piping through `| tail -40`.

### 9.2 Delete (v3 dark visual layer)
- **`src/components/`:** `Ambient.tsx` (Grain/Floodlights), `Intro.tsx` (replaced by `Loader.tsx`; move `SkipLink` into `Header.tsx` or `SkipLink.tsx`), `LiveMark.tsx`, `Lines.tsx`, `Dotted.tsx`, `FooterReveal.tsx` (curtain footer), `SectionHead.tsx` (replaced by `SecHead` with an Ink rule + mono number).
- **`src/components/home/`:** `Hero.tsx`, `Work.tsx`, `WorkRow.tsx`, `FloodFrame.tsx`, `CraftDemo.tsx`, `Who.tsx`, `Services.tsx`, `ServiceStack.tsx`, `SportPill.tsx`, `Pennant.tsx`, `CodesList.tsx`, `PhonesBand.tsx`, `home.css`. All are replaced by the v4 home components; **`home/WorkRow` and `home/Work` are removed outright**, because home has no work.
- **`src/components/studio/`:** `StudioPennant.tsx`, `studio.module.css` (rewritten). `ProcessTrack.tsx` is rewritten as `ProcessRail`.
- **`src/components/contact/`:** `ContactMark.tsx` (rewritten as the M28 scrub), `contact.module.css` (rewritten). `ContactBand.tsx` is rewritten.
- **`src/components/work/`:** `PennantRail.tsx`.
- **`src/motion/`:** `velocitySkew.ts`.
- **`globals.css`:** every v3 rule (night palette, flood, grain, beams, `intro-cover`, `motion`/`intro` gates, `ws-wipe`).
- **`src/lib/gate.ts`:** replace the contents with the v4 head script (3.4).
- The v3 font imports (Instrument Serif, Geist, Geist Mono).
- `viewport.themeColor` `#07090D` and `colorScheme: "dark"`.
- Repo root: `v3-hdr-390.png` (a stray screenshot).

### 9.3 Keep and re-theme
`Picture`, `Compare`, `PhoneStrip`, `Features`, `Counter`, `JsonLd`, `GhostRow`, `work/WorkRow`, `CaseHero`, `RollText` (merge into `Roll`), `work.css` (rewritten light), `Magnetic`, `Roll`, `Reveal` / `useReveal` (switch to the v4 eases), `MotionProvider` (no-intro on first nav, Lenis easing, flags), `PageTransition`, `IntentLink`, `InlineScript`, `CopyEmail`, `Cursor` (rewrite per 4.5), `Logo` / `Mark` (parts), `src/content/work/*` (unchanged data), `scripts/defer-hydration.mjs`, `optimize-images.mjs`, `capture.mjs`, `sitemap.ts`, `robots.ts`, `lib/site.ts` (tagline "Websites & apps for community sports clubs").

### 9.4 Rewrite
`Header`, `Footer`, `MenuOverlay`, `Button`, `FooterWordmark` (paths + M27), `fonts.ts`, `gate.ts`, `globals.css`, `layout.tsx`, `page.tsx` (home), `work/page.tsx`, `work/[slug]/page.tsx` (light layout), `studio/page.tsx`, `contact/page.tsx`, `not-found.tsx`, `scripts/og.mjs`.

### 9.5 New files
- `components/Loader.tsx`, `components/Wordmark.tsx`, `components/wordmark.generated.ts`, `scripts/wordmark.mjs`.
- `content/sample.ts` (clubs, sports formats, fixtures, ladder, notices, players, sync log, themes), `content/grounds.ts`.
- `components/home/`: `Hero`, `Roller`, `NextUpCard`, `FigMark`, `SportsIndex`, `GroundStage`, `SportSwitch` (context provider for the global sport), `Plates` + `FixturesPlate`, `LadderPlate`, `LogosPlate`, `RsvpPlate`, `NoticesPlate`, `PlayerPlate`, `Crest`, `Odometer`, `KitIndex`, `SyncLine`, `SyncLog`, `AnyDomain`, `TokenReadout`.
- `components/ContactMark.tsx`, `components/StoryExcerpt.tsx` (if not already split out), `components/SecHead.tsx`, `components/Segmented.tsx`, `components/Tag.tsx`, `lib/split.ts`, `lib/flip.ts`.
