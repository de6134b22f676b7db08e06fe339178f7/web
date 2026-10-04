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
          title="Find your game."
          lede="Choose a sport. See the whole kit adapt."
        />
        <div className="sec-body">
          <SportsStage />
        </div>
      </div>
    </section>
  );
}
