# websport.com.au: design specification

**Direction: "Under lights: every frame full".** October 2026. Replaces every earlier direction. When code and this file disagree, this file wins.

Websport is a small studio that designs and builds websites, platforms and apps for community sports clubs: AFL, soccer, basketball, netball, cricket, hockey, baseball and any code. PlayHQ fixtures, results and ladders, events with RSVP, announcements and player profiles. It also designs for other fields. Client work (Lang Lang Cricket Club) appears on /work and its case study only, never on the home page.

The rule of the direction: **every frame full**. A device is never shown with an empty screen, a section never carries more than 128px of air, and one idea is said once. One display headline per page; everything under it is an H2 at 64px or smaller.

---

## 1. Concept

**A Saturday-night broadcast of club sport.**

The home page opens on a floodlit night ground; the product (a sample club site, rendered live in code) stands in the light. Reading happens on cream, like a printed programme. The only pictures on the site are the product itself: sample club screens on the home page, the real client screens on /work. Display type is the layout; every label, index, caption and table head is set in mono, like a broadcast graphic. The brand blue is the one accent; red exists for one word, "Live".

Nothing decorates. No photography of our own, no illustration, no gradients beyond the floodlight on the hero. No invented facts: no city, team size, awards, testimonials or stats about Websport. Sample surfaces are a fictional club (Northside Comets) and are tagged "Sample data" everywhere they appear.

## 2. Logo

Unchanged geometry (`scripts/brand.mjs`, `src/components/brand.generated.ts`, `public/brand/*`). A heavy W catching a blue ball; the lockup sets "ebsport" in outlined Geist 700 (outlined type: it does not depend on the site fonts). Primary lockup is ink + blue on cream; `logo-white.svg` on night; `icon.svg` is the blue tile with the white W and the navy ball.

- **Header:** the lockup at 20px in the left pill; under 420px the mark alone.
- **Hop (hover/focus on the header logo):** the ball lifts 3px / 2px right and back, 220ms. Nothing else on the logo ever moves.
- **Loader:** the tile and the W are the loader (§6.2). The W never moves anywhere else.
- Don'ts: no W beside a lowercase "websport", no outlines/shadows/gradients/rotation, never the retired marks.

## 3. Tokens

Every token is on `:root` in `src/app/globals.css`.

### 3.1 Colour

Two grounds, **Night** and **Cream**, one accent, one signal.

| Token | Hex | Use |
|---|---|---|
| `--night` | #060D1F | The hero, the scoreboard band, "What you get", the footer, phone bezels |
| `--night-2` | #0C1530 | Panels on night (scoreboard), desktop device bezel |
| `--night-3` | #16203F | Hover grounds on night |
| `--cream` | #EFEBE2 | Page |
| `--cream-2` | #E4DFD3 | Secondary grounds, capture wells |
| `--cream-3` | #D6D0C1 | Retired (kept as a token; the 404 numeral is gone) |
| `--ink` | #0B1020 | Text on cream (navy-black, never grey) |
| `--ink-2` | #3F4556 | Secondary text on cream (7.4:1) |
| `--ink-3` | #5C6273 | Mono labels on cream (5.1:1) |
| `--blue` | #0062FF | The accent: full stops, the button, the marquee dots, "ours" rows, focus |
| `--blue-deep` | #0048C2 | Button hover, links in copy |
| `--blue-light` | #4D8CFF | Blue text on night (6.9:1) |
| `--live` | #FF4530 | The live dot and the word "Live" only. Never a ground, never a button |
| `--err` | #B3261E | Form errors |
| `--glow` | blue at 22% | The floodlight radial on the hero |
| `--on-night` | #EFEBE2 | Text on night |
| `--on-night-2` | #A7ADBF | Secondary text and labels on night (7.6:1) |
| `--line` / `--line-strong` | ink at 14% / 50% | Hairlines and crosshair ticks on cream |
| `--line-night` / `--line-night-strong` | cream at 16% / 50% | The same on night |

Rules: text on night is cream, never grey-on-black. Blue text only at >= 15px/500. The sample club screens use their own tokens (`src/components/sample/sample.css`, `.club`: bottle green #0F3D2E / #0A2A1F, amber #FFB020, ink #10151A, mute #5D6670, line #E4E7EA, bg #F6F7F5) so they read as a client's site, never as Websport.

### 3.2 Type

Two families, self-hosted, `next/font/local`, latin only, preloaded (`src/app/fonts.ts`): **Mona Sans** variable (wght 200-900, wdth 75-125; `font-stretch` declared) for display, headings and body; **Geist Mono** variable (100-900) for every label, kicker, index, caption, table head and the scoreboard numerals.

| Role | Face | Size token | Weight / width | Tracking | Leading | Case |
|---|---|---|---|---|---|---|
| Display (`.display`: h1 + footer line only) | Mona | `--t-display: clamp(40px, 6.2vw, 112px)` | 800 / 90% (82% < 600px) | -0.03em | 0.86 | Upper |
| H2 (`.h2`) | Mona | `--t-h2: clamp(30px, 4vw, 64px)` | 800 / 92% | -0.025em | 0.9 | Upper |
| H3 (`.h3`) | Mona | `--t-h3: clamp(21px, 1.9vw, 28px)` | 700 | -0.02em | 1.05 | Sentence |
| H3 large (`.h3-lg`, case-study features) | Mona | `--t-h3-lg: clamp(24px, 2.4vw, 36px)` | 700 | -0.02em | 1.02 | Sentence |
| Statement (`.statement`) | Mona | `--t-statement: clamp(22px, 2.4vw, 38px)` | 500 | -0.02em | 1.1 | Sentence |
| Lede (`.lede`) | Mona | `--t-lede: clamp(17px, 1.3vw, 20px)` | 400 | 0 | 1.45 | |
| Body | Mona | `--t-body: 17px` | 400 | 0 | 1.55 | |
| Meta (`.meta`, field errors) | Mona | `--t-meta: 14px` | 400 | 0 | 1.4 | |
| UI (nav, buttons, links) | Mona | `--t-ui: 15px` | 500 | 0 | 1 | |
| Kicker / rail / index (`.kicker`, `.index`, field labels) | Geist Mono | `--t-rail: 13px` | 500 | 0.08em | 1.4 | Upper |
| Label / caption / table head (`.label`) | Geist Mono | `--t-label: 12px` | 500 | 0.08em | 1.4 | Upper |
| Tag (`.tag`, `.device-tag`) | Geist Mono | 11px | 500 | 0.08em | 1 | Upper |
| Marquee | Mona | `clamp(22px, 2.6vw, 40px)` | 700 / 92% | -0.02em | 1 | Upper |

Headlines end in a blue full stop (`.accent`, a real "." character) and are split into explicit lines (`Lines`, "|" marks the break) so the typography is set, never left to wrapping. `.index` is the mono `01` used by steps, scenes, features and ledgers. `.numeral` (`--t-numeral`) is retired: the class and token remain, no page uses them.

### 3.3 Space, radius, motion

```
--sec: clamp(72px, 8vw, 128px)    --sec-s: clamp(48px, 5vw, 80px)
--gutter: clamp(20px, 4vw, 64px)  --max: 1440px   --gap: 24px   --head: 72px
--r-pill: 999px  --r-card: 20px  --r-screen: 12px  --r-phone: 40px
--ease-out  cubic-bezier(.22,1,.36,1)   --ease-expo  cubic-bezier(.16,1,.3,1)
--ease-io   cubic-bezier(.65,0,.35,1)   --ease-curtain  cubic-bezier(.76,0,.24,1)
```

Breakpoints: 600, 720 (cells only), 900, 1200. Two shadows, for devices only.

## 4. Layout

The contract every page builds against (globals.css):

- **Sections are top-heavy.** `.sec { padding-block: var(--sec) var(--sec-s) }`; `.sec-tight { padding-block: var(--sec-s) }`; `.sec-flush { padding-top: 0 }` for a section after a pinned frame or a night band. No two sections can produce a cream band taller than `--sec + --sec-s` (208px, and only at 1600px+).
- **Rail.** Every section opens with a hairline across the measure, a crosshair tick at each end, then the mono index and name left (`01 — What a club site should do`) and a note right. The rail has `margin-top: 0`: the hairline is the section's top edge. Rail text is `--t-rail`; the note is hidden under 600px and carries information, never legal copy, never a trailing full stop.
- **Section head.** `.sec-head { margin: clamp(24px,3vw,40px) 0 clamp(32px,4vw,56px) }`; at >= 900px the h2 spans cols 1-8, the `.lede` / `.stack` / `.split` cols 9-13, bottom-aligned.
- **Split.** `.split`: one column under 600px, two equal columns from 600px (`gap: var(--gap)`). Lede | actions rows, the footer CTA, pair bodies.
- **Grid.** `.grid`: 12 columns at >= 900px. `.cells`: one column under 720px, `repeat(var(--n,3), 1fr)` above. `.ledger li` at >= 900px: `4ch minmax(0,4fr) minmax(0,7fr)` (title narrow, body wide).
- **Inner page head** (`PageHead`): rail (kicker = page name or client), display h1 in explicit lines, lede in cols 1-6 under it. With `wide` the h1 runs cols 1-11 and the next row is lede (cols 1-6) | aside (cols 7-13). `.page-head { padding-top: calc(var(--head) + clamp(32px,5vw,72px)) }`.
- **Floating header.** Two frosted cream pills 14px below the top edge: the lockup left (the mark alone under 420px); Work · Studio · Contact right with the blue 44px button beside. The button reads "Start" under 600px and is hidden under 380px (Contact is in the nav). Under 600px the pills are cream at 92%, nav links 14px with 9px padding. Measured right edge at 390px: 329px of a 350px budget. It slips away while scrolling down past 200px and returns on the way up. The current page is a filled ink pill.
- **Footer on every page** (the single close; no page has a "Next" or "Not a club?" section before it): night ground, "Tell us about your club." as a display line with the email + Copy and the button beside it (`.split` from 600px, cols 1-8 / 8-13 from 900px); then one row of three columns on one baseline at >= 900px: nav cols 1-5, the brand line cols 5-9, legal right-aligned cols 9-13 (stacked in that order below); then the white lockup at full measure. The PlayHQ trademark note lives here only. On /contact the closing line is dropped (the page is the invitation).

## 5. Primitives

- **Button** (`Button`): blue pill, 48px, 15/500 white, hover `--blue-deep`, press `scale(.97)`. `.btn-sm` 40px; the header button 44px (`.site-header .site-cta`, declared after `.btn`). `.btn-ghost`: outlined in the current colour. Never magnetic.
- **Arrow link:** 15/500 with "→" after; hover underlines and the arrow moves 4px.
- **Accent:** `<span class="accent">.</span>` ends every h1, h2 and the footer line. The "?" on the contact head is the same blue.
- **Label / kicker / index:** Geist Mono uppercase 0.08em `--ink-3`; `<b>` inside is the index in `--ink`.
- **Tag:** "Sample data": mono 11px in a hairline pill. Always visible, never behind hover.
- **Device** (`Device`, `src/components/sample/Device.tsx`): a desktop (16:10, design size **1280x800**) or a phone (390:844, design size **390x844**). The screen is laid out at the design width and scaled to the frame (`.screen`, `scale(100cqi / width)`); explicit aspect ratios, no layout shift. `Device` renders `.device-wrap` (position only, no clip) around the clipped frame and takes `tag?: string`: a sticker pill (`.device-tag`, mono 11px, cream ground, 1px `--line-strong`, `top:-12px; right:16px`) on the wrapper, always visible, `aria-hidden`. Pages never render a per-device caption row; the page's own caption says "Sample data" once in text.
- **The fill rule (sample screens):** every screen root is `display:grid; grid-template-rows: auto 1fr auto; min-height: 100%` (nav / main / foot) so the foot sits on the frame's bottom edge; the main region fills `1fr` with no more than 40px of slack. Phones carry a status strip and a bottom tab bar pinned to the frame's bottom. Measured, not eyeballed: for every `.device .screen > *`, `offsetHeight` is within 8px of the design height (792-800 desk, 836-844 phone) and `scrollHeight <= offsetHeight`.
- **Captures** of real client screens (/work): flat, 1px `--line`, radius 12, no device chrome. `.cap-img`, `.duo`, `.walk` unchanged.
- **Marquee:** one line of the codes in Mona 700 uppercase with blue dots, hairlines above and below, masked at both ends, 38s loop; still under reduced motion.
- **Dot list:** "A · B · C", never starts or ends a line on a dot.
- **Field:** mono `--t-rail` label above, 52px input, 1px `--line-strong` bottom rule only; focus: blue rule + 2px ring; `textarea.input { resize:none; min-height:168px }`; errors in `--err`, plain words under the field.
- **Copy email** (`CopyEmail`): `variant="text"` (footer) is the address and a mono "Copy" word; `variant="icon"` (/contact) is the address and a 44x44 button with a 16px copy glyph on the same line, "Copied" replacing the glyph for 1.5s.
- **Scoreboard (PlayHQ panel):** a night-2 card, radius 20: the round in Mona 800 uppercase with the "Sample data" tag, fixtures as big rows (teams in Mona 600, times and scores in mono, `64–58` with an en dash), the live row with the red dot and the word Live becoming `FT`, then the ladder in mono numerals with the club's row in `--blue-light`.
- **Sample club screens** (`src/components/sample/Screens.tsx`, `sample.css`, data in `src/content/sample.ts`): club home, fixtures & results, ladder, event + RSVP (phone), player profile (phone), match centre (phone), committee admin. Fictional club, fictional people, real DOM, every one filled to the frame (the fill rule above).

## 6. Motion

### 6.1 Rules

- `prefers-reduced-motion: reduce` (`html.reduce`): no loader, no scroll-linked motion, no pin, no reveals, no marquee; everything is in its final state at first paint. CSS also collapses every animation/transition to 0.01ms.
- Only `transform` and `opacity` animate (plus `clip-path` on the Before/Now wipe and the case hero reveal, and `grid-template-rows` on the scene body reveal).
- Nothing is ever hidden behind JS: the head script (`lib/gate.ts`) sets `html.js`, and every start state hangs off it; without JS everything is visible. A `show-anyway` keyframe reveals GSAP-owned targets after 3s if the chunks never arrive.
- Content never shifts: the loader is a fixed sheet over a page whose layout is final at first paint; devices and captures have explicit aspect ratios.
- Reveals: `Rise` on headings, ledgers, cells (`.rise` children rise 32px / fade in once, 1s `expo.out`, 80ms stagger, trigger `top 88%`). Body copy never animates in. Page-head lines rise out of clip boxes on load (CSS, 70ms stagger).
- `ScrubWords`: words from 45% to full opacity, `top 85%` -> `center 55%`, only at >= 900px.
- Durations: reveals <= 1s, state changes <= 450ms, the loader 1.1s. Lenis smooth scroll on fine pointers only. No cursor followers, no magnetic buttons, no parallax on copy.

### 6.2 The loader (home, once per session, 1.1s)

Gate: `html.intro` is set only when JS runs, motion is allowed and `sessionStorage['ws-intro']` is unset (set as it plays; `?intro` forces). Without it the loader markup is `display: none`. `Loader.tsx` is a night curtain (`div.ldr-sheet`) plus the icon tile; everything is CSS keyframes with a deadline, nothing waits on React, and `lib/intro.ts` removes the gate at 1.8s.

| ms | What |
|---|---|
| 0-360 | The tile (104px, blue, white W, navy ball) scales 0.9 -> 1 and fades in (`--ease-expo`). Sheet solid. |
| 300-640 | The ball drops 120px into the W, one small rebound. |
| 640-760 | The tile fades (120ms, `--ease-io`). |
| 640-1080 | The curtain lifts: `translateY(0 -> -101%)`, 440ms, `--ease-curtain`. |
| 660- | The hero h1 lines rise out of their boxes (900ms, 70ms stagger) under the lifting curtain, so it reveals set type. |
| 840- | The kicker, lede and actions (`.hero-in`) fade up, 80ms stagger. |
| 1000-1400 | The header fades in (the sheet is gone at 1080). |
| 1120 | `.ldr` deadline: `display:none; visibility:hidden` whatever happened. |
| 1800 | `html.intro` removed (the last hero line lands at 1700, the last `.hero-in` at 1800; nothing snaps). |

Every other load (repeat visits, reduced motion, no JS) paints the hero in its final state at the first frame: the hero h1 never animates outside the intro. Compatible with `scripts/defer-hydration.mjs`.

### 6.3 Set pieces

- **Hero stage:** the desktop stands up (rotateX 12 -> 0, rises 40px) and the phone rises a little further as the stage scrolls from the bottom of the viewport to 20%; scrubbed (GSAP, `HeroScene`), at >= 600px only (the phone-first mobile hero is flat). Start states in CSS under `html.js:not(.reduce)`.
- **The five screens (`Scenes`):** the section pins for 5 x 60vh with the heading inside the frame, guarded by width **and** height (`(min-width: 900px) and (min-height: 720px)`, in GSAP's matchMedia and the CSS alike). The list sits left (cols 1-5); the active row's body opens (`grid-template-rows: 0fr -> 1fr`, 400ms); one stage right (cols 6-13) shows the active screen (fade + 24px rise, 450/650ms). Stage height `calc(100vh - 250px)`, so the whole section fits one viewport at 1280x720, 1440x900 and 1920x1080. Otherwise (narrow, short, reduced motion, no JS): every item shows its own screen under its copy, no pin.
- **Scoreboard:** scrubbed as it crosses the viewport: rows slide in, the live score counts to its final, Live -> FT, the ladder re-orders (DOM order is the final state).
- **Case study:** the hero capture is revealed by a clip-path on load (CSS); Before/Now wipes by scroll (`Compare`, resting at a 45% split); each feature capture pans by scroll (`Pan`, windowed so it never rests on an empty state or a footer) beside sticky copy; the brief resolves word by word (`ScrubWords`).
- **Studio:** the manifesto resolves word by word.
- **Route change:** `template.tsx` fades the page in (opacity only, 420ms). No exit animation.

## 7. Routes and copy

Copy is final. Nothing gated ships: no city, reply time, team size, awards, testimonials or care-after-launch promise. No invented clubs beyond the flagged sample data. Nothing apologises: no trademark line in a section header, no "one club so far", no "and the rest". Every page ends once, on the footer line.

- **/** Hero (night): kicker "For community sports clubs", h1 "Club websites / that keep up / with the season.", a one-sentence lede, [Start a project] [See the work →], the stage (sample club home + match centre, both tagged "Sample data"; caption "Northside Comets · Sample club site"; phone-first under 600px). Marquee of codes + "Any code". 01 What a club site should do: "Everything the season needs." + the five screens, pinned. 02 PlayHQ, wired in: "The round changes. So does the site." + the scoreboard. 03 How it works: "From a call to launch." + three cells with an artefact, `.index`, h3 and body each. Footer.
- **/work** Head "Built for the club / that uses it / every week." (wide) + lede. 01 Lang Lang Cricket Club: capture duo, h2 "A club that lives on its website.", one outcome sentence, "Read the case study →". Footer.
- **/work/[slug]** Head: kicker = client, note "Case study", h1, a two-sentence intro. Hero capture (first fold), then meta cells (Project / Live / What the club got). 01 Before / Now. 02 The brief. 03 What we built (features 01-05, `.index` + `.h3-lg`, sticky copy + windowed panning capture). 04 Run by the club. Footer.
- **/studio** Head "A small studio / for club sport." (wide; lede left, the codes list right). 01 How we work (h2 + statement). 02 What you get (ledger of five on night). Footer.
- **/contact** Head "What does / your club need?" Email large with the icon Copy button (cols 1-5, sticky), the form (cols 6-13: Name, Email, Club or organisation, Code, What do you need?, Send message). Plain footer.
- **404** Head "Out of / bounds." + "That page isn't on the ground. Head home, or see the work." + two arrow links. No decorative numeral; the `<title>` is the one "404". Standard footer.

## 8. Performance and accessibility

- Static export; chunks deferred until after first paint (`scripts/defer-hydration.mjs`). Everything above the fold is HTML + CSS; the loader is CSS and one inline script. The sample screens are DOM, not images: no bytes, crisp at any size.
- LCP is the headline. On a first home visit it is behind the sheet until ~1s; every other load paints it at the first frame. Never `opacity: 0` on the h1 block as a whole.
- Lighthouse mobile targets: performance >= 90, accessibility 100.
- Focus rings: 2px blue, 3px offset, on cream; cream-coloured on night. `scroll-padding-top` clears the header.
- One h1 per page; sections labelled by their headings; decorative things (the loader, the hero phone, the scene stage, the marquee copy, the device stickers) are `aria-hidden`; the hero desktop carries a label. The split headline keeps a plain-text copy for assistive tech. Sample screens carry "Sample data" as visible text.
- Forced colours: live dots and marquee dots render as `CanvasText`; buttons and stickers get a `ButtonText` border.
