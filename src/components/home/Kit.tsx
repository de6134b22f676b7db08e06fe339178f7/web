import { SecHead } from "@/components/SecHead";
import { KitIndex } from "./KitIndex";

/** H4 "04 — The full kit" (§6.1). */
export function Kit() {
  return (
    <section className="sec" data-sec="04" data-sec-name="The full kit" aria-labelledby="kit-h">
      <div className="wrap">
        <SecHead
          n="04"
          name="The full kit"
          id="kit-h"
          title="And the rest of the clubhouse."
          lede="The everyday details matter too. Stories, sponsors and the tools that keep your committee in control."
        />
        <div className="sec-body">
          <KitIndex />
        </div>
      </div>
    </section>
  );
}
