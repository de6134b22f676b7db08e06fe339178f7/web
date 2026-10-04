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
          title="The little things, covered."
          lede="Stories, sponsors and simple tools for your committee."
        />
        <div className="sec-body">
          <KitIndex />
        </div>
      </div>
    </section>
  );
}
