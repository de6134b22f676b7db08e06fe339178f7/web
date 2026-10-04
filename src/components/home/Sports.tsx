import { SecHead } from "@/components/SecHead";
import { SportsStage } from "./SportsStage";

/** H2 "02 — The sports" (§6.1): the scroll set piece. */
export function Sports() {
  return (
    <section className="sec" data-sec="02" data-sec-name="The sports" aria-labelledby="sports-h">
      <div className="wrap">
        <SecHead
          n="02"
          name="The sports"
          id="sports-h"
          title="Every code. One clubhouse."
          lede="If your club runs its season on PlayHQ, the site can run off it too. The sport changes the scoring, not the job. Pick one and the whole kit below switches to it."
        />
        <div className="sec-body">
          <SportsStage />
        </div>
      </div>
    </section>
  );
}
