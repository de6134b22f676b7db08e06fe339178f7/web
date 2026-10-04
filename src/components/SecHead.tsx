import type { ReactNode } from "react";
import { SplitHeading } from "./Reveal";

/**
 * Section head (§2.6): 1px Ink rule, mono "0N — Name" key, then (≤ 72px below the rule) the split-reveal h2
 * (columns 1–8) and the lede (9–12). `aside` sits in the head row (e.g. a segmented control, W6).
 * Pair with <section data-sec="0N" data-sec-name="Name"> on home for the header counter.
 */
export function SecHead({ n, name, title, lede, id, aside, className = "" }: { n?: string; name: string; title: ReactNode; lede?: ReactNode; id?: string; aside?: ReactNode; className?: string }) {
  return (
    <div className={`sec-hd ${className}`.trim()}>
      <p className="sec-k mono">
        {n ? <span>{n}</span> : null}
        <span>{name}</span>
      </p>
      <div className="sec-hd-row">
        <SplitHeading as="h2" id={id} className="sec-h t-h2">
          {title}
        </SplitHeading>
        {lede || aside ? (
          <div className="sec-lede">
            {lede ? <p>{lede}</p> : null}
            {aside}
          </div>
        ) : null}
      </div>
    </div>
  );
}
