import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { og } from "@/lib/site";
import { ContactBand } from "@/components/ContactBand";
import { WorkRow } from "@/components/work/WorkRow";
import { GhostRow } from "@/components/work/GhostRow";
import { JsonLd, breadcrumbs } from "@/components/JsonLd";
import { allWork } from "@/content/work";
import "@/components/work/work.css";

export const metadata: Metadata = {
  title: "Work",
  description: "Websport’s club work, starting with our first customer: Lang Lang Cricket Club’s website and club platform.",
  alternates: { canonical: "/work" },
  openGraph: og("/work", "/og/work.png", "Websport work: Made for real clubs. Built properly."),
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
        </p>
        <div className="wk-hd__row">
          <h1 className="pg-h t-display wk-hd__h">
            <span className="h-line" style={i(0)}>
              Made for real clubs.
            </span>
          </h1>
          <p className="wk-hd__lede t-lead h-fade" style={i(1)}>
            A new digital home for Lang Lang Cricket Club. Built around the people who make it.
          </p>
        </div>
      </header>

      <section className="wrap wk-sec" aria-label="Projects">
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

      </section>

      <ContactBand title="Yours could be next." size="h2" />
      <JsonLd
        data={breadcrumbs([
          ["Home", "/"],
          ["Work", "/work"],
        ])}
      />
    </>
  );
}
