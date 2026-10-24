import type { Metadata } from "next";
import Link from "@/components/IntentLink";
import { og } from "@/lib/site";
import { ArrowLink } from "@/components/Button";
import { CaptureDuo } from "@/components/Capture";
import { DotList } from "@/components/DotList";
import { JsonLd, breadcrumbs } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { Rail } from "@/components/Rail";
import { Rise } from "@/components/motion/Rise";
import { allWork } from "@/content/work";
import "./work.css";

export const metadata: Metadata = {
  title: "Work",
  description: "Websport’s club work: Lang Lang Cricket Club’s website and club platform, built as the centre of the club.",
  alternates: { canonical: "/work" },
  openGraph: og("/work", "/og/work.png", "Websport work: club websites built for the club that uses them every week."),
};

/** Work (BRIEF 5.1). Head, then one indexed entry per case study (capture pair, headline, outcome, link). The footer closes the page. */
export default function WorkPage() {
  return (
    <>
      <section className="page-head" aria-labelledby="work-h">
        <div className="wrap">
          <PageHead
            id="work-h"
            kicker="Work"
            title="Built for the club|that uses it|every week"
            lede="Every site we make is the centre of the club it belongs to: the fixtures, the events, the people. Here is the first."
            wide
          />
        </div>
      </section>

      {allWork.map((w, i) => {
        const phone = w.mobile.shots.find((s) => s.label === "Home")?.shot ?? w.mobile.shots[0].shot;
        return (
          <article key={w.slug} className="work-entry" aria-labelledby={`w-${w.slug}`}>
            <div className="wrap">
              <Rail index={String(i + 1).padStart(2, "0")} name={w.client} note={w.kind} />
              {/* The capture is a second way in (the arrow link below is the named one), so it is hidden from AT. */}
              <Link href={`/work/${w.slug}`} className={i === 0 ? "work-link cap-reveal" : "work-link"} tabIndex={-1} aria-hidden="true">
                <CaptureDuo
                  slug={w.slug}
                  desktop={w.hero}
                  phone={phone}
                  priority={i === 0}
                  ratio={w.heroRatio}
                  caption={<DotList items={[w.client, w.live.label]} />}
                />
              </Link>
              <Rise className="grid work-row">
                <h2 id={`w-${w.slug}`} className="h2 col-head rise">
                  {w.headline.split("|").join(" ")}
                  <span className="accent">.</span>
                </h2>
                <div className="col-body stack rise">
                  <p className="work-outcome">{w.outcome}</p>
                  <ArrowLink href={`/work/${w.slug}`}>Read the case study</ArrowLink>
                </div>
              </Rise>
            </div>
          </article>
        );
      })}
      <JsonLd data={breadcrumbs([["Home", "/"], ["Work", "/work"]])} />
    </>
  );
}
