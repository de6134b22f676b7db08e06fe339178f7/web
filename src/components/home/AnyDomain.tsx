"use client";
/**
 * H6 "06 — Design for any domain" (M26, W11). One system under three everyday components. The Clinic / Studio /
 * Cellar door radiogroup sits in the section-head row (W6). Switching re-themes the stage over 700ms hand
 * (background, radius, typeface, heading weight, accent) with a 250ms text crossfade; the token readout rolls
 * each value; the editorial art crossfades between three line drawings built from the same tokens. Booking: day and
 * time are roving radiogroups (arrows skip unavailable slots, which are disabled), Confirm is disabled until a slot is picked, then reads "Booked: Tue 10:30" for 2s. Pricing: Monthly/
 * Yearly radios roll the prices. Sample brands.
 */
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { SecHead } from "@/components/SecHead";
import { Segmented } from "@/components/Segmented";
import { Tag } from "@/components/Tag";
import { TextLink } from "@/components/Button";
import { Odometer } from "@/components/Odometer";
import { DAYS, PRICES, SLOTS, THEMES, slotTaken, type ThemeId } from "./data";
import { prefersReduced } from "./useSkin";

const OPTS = (Object.keys(THEMES) as ThemeId[]).map((k) => ({ value: k, label: THEMES[k].label }));
const KEYS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/** Roving radiogroup keys (same pattern as Billing): arrows move and select, skipping disabled options; Home/End. */
function roveKey(e: KeyboardEvent<HTMLButtonElement>, n: number, cur: number, off: (i: number) => boolean, set: (i: number) => void) {
  let step = KEYS[e.key];
  let i = cur;
  if (e.key === "Home") {
    i = -1;
    step = 1;
  } else if (e.key === "End") {
    i = n;
    step = -1;
  } else if (!step) return;
  e.preventDefault();
  for (let k = 0; k < n; k++) {
    i = (i + step + n) % n;
    if (!off(i)) break;
  }
  if (off(i)) return;
  set(i);
  (e.currentTarget.parentElement?.children[i] as HTMLElement | undefined)?.focus();
}

/** Editorial art: one line drawing per brand, drawn from the same tokens (accent, ink, radius); they crossfade. */
function EdArt() {
  return (
    <svg className="ed-art" viewBox="0 0 240 180" aria-hidden="true" focusable="false">
      <g className="ea ea-clinic">
        <rect x="132" y="14" width="76" height="72" rx="10" className="ea-ln" />
        <path d="M170 14v72M132 50h76" className="ea-ln" />
        <circle cx="151" cy="32" r="10" className="ea-fill" />
        <path d="M18 148h204" className="ea-ln" />
        <path d="M44 148v-30h44v30M40 118h52M50 118c0-26 6-34 16-40" className="ea-ln" />
        <path d="M64 78c-14-4-22-16-20-30 12 2 20 12 20 30zM66 84c6-16 18-22 32-18-2 14-14 20-32 18z" className="ea-fill" />
        <rect x="118" y="124" width="62" height="24" rx="8" className="ea-ln" />
        <path d="M124 124v-22a8 8 0 0 1 8-8h34a8 8 0 0 1 8 8v22" className="ea-ln" />
      </g>
      <g className="ea ea-studio">
        <path d="M14 46h212M14 122h212M14 138h212" className="ea-guide" />
        <text x="18" y="122" className="ea-type">Aa</text>
        <text x="226" y="40" textAnchor="end" className="ea-note">CAP</text>
        <text x="226" y="116" textAnchor="end" className="ea-note">BASE</text>
        <text x="18" y="160" className="ea-note">WEIGHT 300 · 0 PX</text>
        <rect x="186" y="62" width="34" height="34" className="ea-fill" />
      </g>
      <g className="ea ea-cellar">
        <path d="M86 20h18v30c0 8 16 14 16 34v66a6 6 0 0 1-6 6H76a6 6 0 0 1-6-6V84c0-20 16-26 16-34z" className="ea-ln" />
        <rect x="74" y="92" width="42" height="40" rx="3" className="ea-fill" />
        <text x="95" y="117" textAnchor="middle" className="ea-label">2021</text>
        <path d="M150 64h36c0 22-6 36-18 38-12-2-18-16-18-38zM168 102v44M152 146h32" className="ea-ln" />
        <path d="M152 82c10 3 22 3 32 0 0 12-6 20-16 20s-16-8-16-20z" className="ea-fill" />
        <path d="M18 156h204" className="ea-ln" />
      </g>
    </svg>
  );
}

/** A value that rolls: the old text lifts out while the new one rises in (CSS keyframes). */
function RollVal({ v }: { v: string }) {
  const [s, setS] = useState({ cur: v, prev: null as string | null, n: 0 });
  if (s.cur !== v) setS({ cur: v, prev: s.cur, n: s.n + 1 });
  return (
    <span className="rv">
      {s.prev !== null ? (
        <span key={`o${s.n}`} className="rv-out" aria-hidden="true">
          {s.prev}
        </span>
      ) : null}
      <span key={`i${s.n}`} className={s.n ? "rv-in" : undefined}>
        {s.cur}
      </span>
    </span>
  );
}

export function AnyDomain() {
  const [theme, setTheme] = useState<ThemeId>("clinic");
  const [shown, setShown] = useState<ThemeId>("clinic");
  const [swap, setSwap] = useState(false);
  const [bill, setBill] = useState<"m" | "y">("m");
  const [day, setDay] = useState(1);
  const [slot, setSlot] = useState<number | null>(null);
  const [booked, setBooked] = useState(false);
  const t = useRef(0);
  const bt = useRef(0);
  useEffect(
    () => () => {
      window.clearTimeout(t.current);
      window.clearTimeout(bt.current);
    },
    [],
  );

  const pick = (k: ThemeId) => {
    setTheme(k);
    window.clearTimeout(t.current);
    if (prefersReduced()) return setShown(k);
    setSwap(true);
    t.current = window.setTimeout(() => {
      setShown(k);
      setSwap(false);
    }, 250);
  };
  const th = THEMES[shown];
  const tok = THEMES[theme].tokens;

  const billKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const n = bill === "m" ? "y" : "m";
    setBill(n);
    (e.currentTarget.parentElement?.querySelector(`[data-b="${n}"]`) as HTMLElement | null)?.focus();
  };

  const pickDay = (i: number) => {
    setDay(i);
    setSlot(null);
  };
  const firstFree = SLOTS.findIndex((_, i) => !slotTaken(day, i));

  const confirm = () => {
    if (slot === null) return;
    setBooked(true);
    window.clearTimeout(bt.current);
    bt.current = window.setTimeout(() => setBooked(false), 2000);
  };

  return (
    <section id="any" className="sec any" data-sec="06" data-sec-name="Any domain" aria-labelledby="any-h">
      <div className="wrap">
        <SecHead
          n="06"
          name="Design for any domain"
          id="any-h"
          title="Same craft. Any brand."
          lede="Switch brands. See the design change with it."
          aside={
            <div className="any-bar">
              <Segmented options={OPTS} value={theme} onChange={pick} label="Sample brand" role="radiogroup" />
              <Tag>Sample brands</Tag>
            </div>
          }
        />
        <div className="sec-body">
          <div className={`any-stage${swap ? " is-swap" : ""}`} data-theme={theme} data-cursor="Switch">
            <div className="ac ac-book">
              <p className="ac-k" data-txt="">
                {th.book}
              </p>
              <div className="ac-dets">
                <p data-txt="">{th.dur}</p>
                <p data-txt="">{th.who}</p>
              </div>
              <div className="days" role="radiogroup" aria-label="Day">
                {DAYS.map((d, i) => (
                  <button
                    key={d}
                    type="button"
                    role="radio"
                    aria-checked={day === i}
                    tabIndex={day === i ? 0 : -1}
                    onClick={() => pickDay(i)}
                    onKeyDown={(e) => roveKey(e, DAYS.length, day, () => false, pickDay)}
                  >
                    <span>{d}</span>
                    <b>{17 + i}</b>
                  </button>
                ))}
              </div>
              <div className="slots" role="radiogroup" aria-label="Time">
                {SLOTS.map((s, i) => {
                  const taken = slotTaken(day, i);
                  const tab = slot === null ? i === firstFree : slot === i;
                  return (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={slot === i}
                      tabIndex={tab ? 0 : -1}
                      disabled={taken}
                      aria-label={taken ? `${s} unavailable` : undefined}
                      onClick={() => setSlot(i)}
                      onKeyDown={(e) => roveKey(e, SLOTS.length, slot ?? firstFree, (k) => slotTaken(day, k), setSlot)}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              <div className="ac-confirm">
                <span aria-live="polite">{booked && slot !== null ? `Booked: ${DAYS[day]} ${SLOTS[slot]}` : slot === null ? "Pick a time" : `${DAYS[day]} ${17 + day} · ${SLOTS[slot]}`}</span>
                <button type="button" className="ac-btn" disabled={slot === null} onClick={confirm}>
                  <span data-txt="">{th.confirm}</span>
                </button>
              </div>
            </div>
            <div className="ac ac-price">
              <p className="ac-k" data-txt="">
                {th.priceK}
              </p>
              <div className="bill" role="radiogroup" aria-label="Billing">
                {(["m", "y"] as const).map((b) => (
                  <button key={b} type="button" role="radio" data-b={b} aria-checked={bill === b} tabIndex={bill === b ? 0 : -1} onClick={() => setBill(b)} onKeyDown={billKey}>
                    {b === "m" ? "Monthly" : "Yearly"}
                  </button>
                ))}
              </div>
              <div className="tiers">
                {[th.t1, th.t2].map((name, i) => (
                  <div key={i} className={`tier${i === 1 ? " tier-hi" : ""}`}>
                    <p data-txt="">{name}</p>
                    <p className="amt">
                      $<Odometer value={PRICES[bill][i]} />
                      <span>{bill === "m" ? "/mo" : "/yr"}</span>
                    </p>
                  </div>
                ))}
              </div>
              <ul className="perks">
                {th.perks.map((p) => (
                  <li key={p} data-txt="">
                    {p}
                  </li>
                ))}
              </ul>
              <p className="ac-note" data-txt="">
                {th.note}
              </p>
            </div>
            <div className="ac ac-ed">
              <EdArt />
              <p className="ac-k" data-txt="">
                {th.edK}
              </p>
              <p className="ed-h" data-txt="">
                {th.ed}
              </p>
              <p className="ed-m" data-txt="">
                {th.edM}
              </p>
            </div>
            <dl className="tokens">
              <div>
                <dt className="mono">Typeface</dt>
                <dd>
                  <RollVal v={tok.font} />
                </dd>
              </div>
              <div>
                <dt className="mono">Radius</dt>
                <dd>
                  <RollVal v={`${tok.radius} px`} />
                </dd>
              </div>
              <div>
                <dt className="mono">Accent</dt>
                <dd>
                  <span className="tok-sw" style={{ background: tok.accent }} aria-hidden="true" />
                  <RollVal v={tok.accent} />
                </dd>
              </div>
              <div>
                <dt className="mono">Heading weight</dt>
                <dd>
                  <RollVal v={String(tok.weight)} />
                </dd>
              </div>
            </dl>
          </div>
          <div className="any-foot">
            <TextLink href="/studio" arrow="→">
              More about the studio
            </TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
