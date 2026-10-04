import { SecHead } from "@/components/SecHead";
import { PLAYHQ_NOTE } from "@/lib/site";
import { SyncLine } from "./SyncLine";
import { SyncLog } from "./SyncLog";

/** H5 "05 — PlayHQ integration" (id="playhq", §6.1): SyncLine (columns 1–8) + SyncLog on the Ink stage (9–12). */
export function PlayHQ() {
  return (
    <section id="playhq" className="sec" data-sec="05" data-sec-name="PlayHQ" aria-labelledby="playhq-h" tabIndex={-1}>
      <div className="wrap">
        <SecHead
          n="05"
          name="PlayHQ integration"
          id="playhq-h"
          title="PlayHQ in. Club site out."
          lede="Your competition data already lives in PlayHQ. We connect to its API so the site shows the same fixtures, results, ladders and players, without a volunteer copying them across."
        />
        <div className="sec-body phq">
          <SyncLine />
          <SyncLog />
        </div>
        <p className="phq-note mono">{PLAYHQ_NOTE}</p>
      </div>
    </section>
  );
}
