"use client";
/**
 * P4 Events & RSVP (M19). Event card (date block, per-sport event name, meta, avatars, live headcount odometer),
 * a Going/Maybe/Can’t make it radiogroup, meal chips, a guests stepper (Going only) and a Flag "Pay $25 via event
 * link" button whose amount rolls. Going pops a "You" avatar in. Nothing is charged: the pay button only says so.
 * Live region: "You’re going. 47 going." Sample data.
 */
import { useRef, useState } from "react";
import { Plate } from "@/components/Plate";
import { Segmented } from "@/components/Segmented";
import { Chips } from "@/components/Chips";
import { Odometer } from "@/components/Odometer";
import { AVATARS, EVENT_NAME } from "./data";
import { useKit } from "./SportContext";
import { useSkin } from "./useSkin";

type R = "go" | "maybe" | "no";
const RSVP = [
  { value: "go", label: "Going" },
  { value: "maybe", label: "Maybe" },
  { value: "no", label: "Can’t make it" },
] as const;
const MEALS = [
  { value: "roast", label: "Roast" },
  { value: "veg", label: "Vegetarian" },
  { value: "kids", label: "Kids" },
] as const;
type Meal = (typeof MEALS)[number]["value"];
const BASE = 46;

export function RsvpPlate() {
  const { sport, bump } = useKit();
  const cell = useRef<HTMLDivElement>(null);
  useSkin(cell, bump, 3);
  const [mine, setMine] = useState<R>("maybe");
  const [guests, setGuests] = useState(0);
  const [meals, setMeals] = useState<Meal[]>(["roast"]);
  const [live, setLive] = useState("");
  const [paid, setPaid] = useState(false);
  const going = mine === "go";
  const total = BASE + (going ? 1 + guests : 0);
  const amount = 25 * (1 + guests);

  const pick = (r: R) => {
    setMine(r);
    setPaid(false);
    if (r !== "go") setGuests(0);
    setLive(r === "go" ? `You’re going. ${BASE + 1} going.` : r === "maybe" ? `Marked as maybe. ${BASE} going.` : `Marked as can’t make it. ${BASE} going.`);
  };
  const step = (d: number) => {
    const g = Math.max(0, Math.min(5, guests + d));
    setGuests(g);
    setLive(`${g} ${g === 1 ? "guest" : "guests"}. ${BASE + 1 + g} going.`);
  };

  return (
    <div ref={cell} className="pl-cell pl-rsvp">
      <Plate n={4} id="p-rsvp" title="Events & RSVP" cursor="RSVP" decision="One tap to RSVP, a live headcount for the committee, and payment straight through the event’s link.">
        <div className="ev card">
          <div className="ev-date">
            <span className="sr">Saturday 18 April</span>
            <span className="mono" aria-hidden="true">
              Apr
            </span>
            <b aria-hidden="true">18</b>
            <span className="mono" aria-hidden="true">
              Sat
            </span>
          </div>
          <div className="ev-main">
            <p key={sport} className="ev-t">
              {EVENT_NAME[sport]}
            </p>
            <p className="ev-m">7:00 pm · Clubrooms · Dinner $25</p>
            <div className="ev-count">
              <span className="avs" aria-hidden="true">
                {going ? <span className="av you">You</span> : null}
                {AVATARS.map(([n, c]) => (
                  <span key={n} className="av" style={{ background: c }}>
                    {n}
                  </span>
                ))}
              </span>
              <span className="ev-n">
                <b>
                  <Odometer value={total} />
                </b>{" "}
                going
              </span>
            </div>
          </div>
        </div>
        <Segmented options={RSVP} value={mine} onChange={pick} label="Your RSVP" role="radiogroup" className="seg-wide" />
        <div className="ev-opts">
          <span className="mono muted" id="meal-l">
            Meal
          </span>
          <Chips options={MEALS} value={meals} onChange={setMeals} label="Meal choice" mode="multi" check />
        </div>
        <div className="ev-cmte card">
          <p className="mono muted ev-cmte-k">Committee view</p>
          {(
            [
              ["Going", total, "go"],
              ["Maybe", 12 + (mine === "maybe" ? 1 : 0), "maybe"],
              ["Can’t make it", 7 + (mine === "no" ? 1 : 0), "no"],
            ] as const
          ).map(([l, v, k]) => (
            <div key={k} className={`ev-bar${mine === k ? " is-me" : ""}`}>
              <span className="ev-bar-l">{l}</span>
              <span className="ev-bar-t" aria-hidden="true">
                <i style={{ transform: `scaleX(${Math.min(1, v / 60)})` }} />
              </span>
              <span className="num ev-bar-v">
                <Odometer value={v} />
              </span>
            </div>
          ))}
          <p className="ev-meals mono muted">
            {MEALS.map((m, i) => (
              <span key={m.value}>
                {m.label} <span className="num">{[31, 9, 6][i] + (going && meals.includes(m.value) ? 1 : 0)}</span>
              </span>
            ))}
          </p>
        </div>
        <div className="plate-act ev-act">
          {going ? (
            <div className="ev-pay">
              <div className="step" role="group" aria-label="Guests">
                <span className="mono muted" aria-hidden="true">
                  Guests
                </span>
                <button type="button" className="step-b" onClick={() => step(-1)} disabled={guests === 0} aria-label="One fewer guest">
                  −
                </button>
                <b className="num" aria-hidden="true">
                  <Odometer value={guests} />
                </b>
                <button type="button" className="step-b" onClick={() => step(1)} disabled={guests === 5} aria-label="One more guest">
                  +
                </button>
              </div>
              <button type="button" className="btn btn-flag btn-sm ev-paybtn" onClick={() => (setPaid(true), setLive("Demo only: no payment is taken."))}>
                <span className="btn-in">
                  Pay <Odometer value={`$${amount}`} /> via event link
                </span>
              </button>
            </div>
          ) : (
            <p className="ev-hint muted">Choose Going to add guests and pay.</p>
          )}
          <p className={`ev-note mono${paid ? " is-on" : ""}`}>Demo: no payment is taken</p>
        </div>
        <p className="sr" aria-live="polite">
          {live}
        </p>
      </Plate>
    </div>
  );
}
