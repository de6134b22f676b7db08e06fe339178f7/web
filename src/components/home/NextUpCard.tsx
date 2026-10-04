"use client";
/**
 * Next up card (C11, M4, W10). Fixed 340 × 152 (100% × 136 under 760), so LCP stays the headline and nothing
 * shifts. Follows the hero roller's sport; shows that sport's real score format for the last meeting.
 * Content swaps: the rows lift in (600ms expo) and the crests settle (scale .8 → 1, rotate −6° → 0).
 * The whole card is a link-button to #build, which sets the global sport. Its accessible name is an sr-only
 * "Open the kit in {sport}:" prefix followed by the visible text (2.5.3 Label in Name).
 */
import { useState } from "react";
import { club } from "@/content/sample";
import { Crest } from "@/components/Crest";
import { Tag } from "@/components/Tag";
import { NEXT_UP, nextUpScore, sportName } from "./data";
import { useHero, useKit } from "./SportContext";

export function NextUpCard() {
  const { shown } = useHero();
  const { setSport } = useKit();
  const [hs, as] = nextUpScore(shown);
  const home = club(NEXT_UP.home);
  const away = club(NEXT_UP.away);
  // The first render rests at full contrast; only later sport swaps play the lift-in.
  const [prev, setPrev] = useState(shown);
  const [swaps, setSwaps] = useState(0);
  if (prev !== shown) {
    setPrev(shown);
    setSwaps(swaps + 1);
  }
  return (
    <a href="#build" className="nu notch" onClick={() => setSport(shown)} data-cursor="Open">
      <span className="sr">Open the kit in {sportName(shown)}: </span>
      <span className="nu-hd">
        <span className="mono">Last meeting</span>
        <Tag />
      </span>
      <span key={shown} className={swaps ? "nu-body is-in" : "nu-body"}>
        <span className="nu-row">
          <Crest club={home} size={28} className="nu-crest" />
          <span className="nu-name">{home.name}</span>
          <span className="nu-score num">{hs}</span>
        </span>
        <span className="nu-row">
          <Crest club={away} size={28} className="nu-crest" />
          <span className="nu-name">{away.name}</span>
          <span className="nu-score num">{as}</span>
        </span>
      </span>
      <span className="nu-meta mono">Next: {NEXT_UP.meta}</span>
    </a>
  );
}
