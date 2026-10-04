import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { og, PLAYHQ_NOTE, SPORTS_LINE } from "@/lib/site";
import { ContactBand } from "@/components/ContactBand";
import { TextLink } from "@/components/Button";
import { DotList } from "@/components/DotList";
import { Rise } from "@/components/Reveal";
import { WorkRow } from "@/components/work/WorkRow";
import { GhostRow } from "@/components/work/GhostRow";
import { JsonLd, breadcrumbs } from "@/components/JsonLd";
import { allWork } from "@/content/work";
import "@/components/work/work.css";

export const metadata: Metadata = {
  title: "Work",
  description: "Websport’s club work, starting with our first customer: Lang Lang Cricket Club’s website and club platform.",
  alternates: { canonical: "/work" },
  openGraph: og("/work", "/og/work.png", "Websport work: Our first club. Built properly."),
};

/** Work index (DESIGN.md v4 §6.2). */
export default function WorkIndex() {
  const n = (k: number) => String(k).padStart(2, "0");
  const i = (k: number) => ({ "--i": k }) as CSSProperties;
  return (
    <>
      <header className="wrap pg-hd wk-hd">
        <p className="pg-eyebrow mono h-fade" style={i(0)}>
          <span>Work</span>
          <span className="wk-hd__count">
            Index · {n(allWork.length)} case {allWork.length === 1 ? "study" : "studies"}
          </span>
        </p>
        <div className="wk-hd__row">
          <h1 className="pg-h t-display wk-hd__h">
            <span className="h-line" style={i(0)}>
              Our first club.
            </span>
            <span className="h-line" style={i(1)}>
              <em>Built properly.</em>
            </span>
          </h1>
          <p className="wk-hd__lede t-lead h-fade" style={i(1)}>
            Every studio starts somewhere. Ours started with Lang Lang Cricket Club, our first customer: a 2019 brochure site that became the centre of
            the club. It&rsquo;s a success story we&rsquo;re proud of, and the standard every club after it gets.
          </p>
        </div>
      </header>

      <section className="wrap wk-sec" aria-label="Projects">
        <p className="wk-list__k mono h-fade" style={i(2)} aria-hidden="true">
          <span>No.</span>
          <span>Project</span>
          <span className="wk-list__k-kind">Site</span>
        </p>
        <ol className="wk-list">
          {allWork.map((w, k) => (
            <WorkRow
              key={w.slug}
              no={n(k + 1)}
              href={`/work/${w.slug}`}
              name={w.client}
              kind={w.kind}
              meta={w.tags}
              slug={w.slug}
              shot={w.hero}
              domain={w.live.label}
              eager={k === 0}
            />
          ))}
          <li className="wk-list__ghost">
            <GhostRow no={n(allWork.length + 1)} />
          </li>
        </ol>

        <Rise className="wk-band">
          <div className="wk-band__col">
            <h2 className="wk-band__h">Every code on PlayHQ</h2>
            <p className="wk-band__sports mono">
              <DotList items={SPORTS_LINE} />
            </p>
            <p className="wk-band__tm mono">{PLAYHQ_NOTE}</p>
          </div>
          <div className="wk-band__col">
            <h2 className="wk-band__h">
              Not a club? <em>The craft is the same.</em>
            </h2>
            <TextLink href="/studio" arrow="→" className="wk-band__link">
              See the studio
            </TextLink>
          </div>
        </Rise>
      </section>

      <ContactBand title="Plant your flag." size="h2" />
      <JsonLd
        data={breadcrumbs([
          ["Home", "/"],
          ["Work", "/work"],
        ])}
      />
    </>
  );
}
