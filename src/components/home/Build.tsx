import { SecHead } from "@/components/SecHead";
import { SportSwitch } from "./SportSwitch";
import { FixturesPlate } from "./FixturesPlate";
import { LadderPlate } from "./LadderPlate";
import { LogosPlate } from "./LogosPlate";
import { RsvpPlate } from "./RsvpPlate";
import { NoticesPlate } from "./NoticesPlate";
import { PlayerPlate } from "./PlayerPlate";

/** H3 "03 — What we build" (id="build", §6.1): sticky sport control + the six plates in founder order. */
export function Build() {
  return (
    <section id="build" className="sec build" data-sec="03" data-sec-name="What we build" aria-labelledby="build-h" tabIndex={-1}>
      <div className="wrap">
        <SecHead
          n="03"
          name="What we build"
          id="build-h"
          title="A proper home for club life."
          lede="From the first fixture to the final siren. Try six working pieces of a Websport site. Every club, name and number shown is sample data."
        />
        <div className="sec-body build-body">
          <SportSwitch />
          <div className="plates">
            <FixturesPlate />
            <LadderPlate />
            <LogosPlate />
            <RsvpPlate />
            <NoticesPlate />
            <PlayerPlate />
          </div>
        </div>
      </div>
    </section>
  );
}
