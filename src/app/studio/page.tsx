import type { Metadata } from "next";
import { og, CODES } from "@/lib/site";
import { JsonLd, breadcrumbs } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { Rail } from "@/components/Rail";
import { ScrubWords } from "@/components/motion/ScrubWords";
import { Rise } from "@/components/motion/Rise";
import "./studio.css";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Websport designs and builds websites, platforms and apps for community sports clubs, and designs for people outside sport too.",
  alternates: { canonical: "/studio" },
  openGraph: og("/studio", "/og/studio.png", "Websport studio: a small studio for club sport."),
};

/** The seven codes plus the open door. No codes are added here (DESIGN.md truthfulness rules). */
const CODE_LIST = [...CODES, "Any code"];

/** "Care after launch" is gated until the founder confirms terms, so it is not listed. */
const GET = [
  ["Design", "Your crest, your colours, your people, laid out around the season, not a template."],
  ["Build", "The site, the match and player pages, the events and the admin, built as one system."],
  ["Hosting", "Live on the club’s own domain, fast on a phone at the ground."],
  ["A CMS the committee can use", "Notices, events, players and pages, updated by the club without calling us."],
  ["PlayHQ integration", "Fixtures, results and ladders from the PlayHQ API, matched to every team and opponent."],
] as const;

/**
 * Studio: a wide head (lede left, the codes list right), 01 how we work (h2 beside a statement that resolves word by
 * word), 02 what you get (ledger on the night ground), then the footer. No team size, photos, location, years, awards
 * or testimonials (gated). "Not a club?" lives in the head lede; it is not a section.
 */
export default function StudioPage() {
  return (
    <>
      <section className="page-head studio-head" aria-labelledby="studio-h">
        <div className="wrap">
          <PageHead
            id="studio-h"
            kicker="Studio"
            note="Websites, platforms and apps"
            title="A small studio|for club sport"
            wide
            lede="Websport designs and builds websites, platforms and apps for community sports clubs: fixtures from PlayHQ, events, player pages and an admin the committee runs. We also design for people outside sport."
            aside={
              <div className="codes">
                <p className="kicker">Codes we build for</p>
                <ul className="codes-list" aria-label="Codes we build for">
                  {CODE_LIST.map((c, i) => (
                    <li key={c}>
                      <span className="codes-i" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            }
          />
        </div>
      </section>

      <section className="sec how" aria-labelledby="how-h">
        <div className="wrap">
          <Rail index="01" name="How we work" note="Design, build, host" />
          <div className="grid studio-split">
            <h2 id="how-h" className="h2 col-head">
              Designed and built by the same hands<span className="accent">.</span>
            </h2>
            <ScrubWords
              className="col-body stack"
              size="statement"
              paragraphs={[
                "One team from the first call to launch. The people who design your site build it.",
                "Fixtures come from PlayHQ, not from someone retyping them. The committee updates everything else without calling us.",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="sec on-night get" aria-labelledby="get-h">
        <div className="wrap">
          <Rail index="02" name="What you get" note="Every project" />
          <Rise className="sec-head">
            <h2 id="get-h" className="h2 rise">
              The whole thing, not a theme<span className="accent">.</span>
            </h2>
          </Rise>
          <Rise>
            <ol className="ledger rise">
              {GET.map(([t, b], i) => (
                <li key={t}>
                  <span className="ledger-i">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="ledger-t">{t}</h3>
                  <p className="ledger-b">{b}</p>
                </li>
              ))}
            </ol>
          </Rise>
        </div>
      </section>
      <JsonLd data={breadcrumbs([["Home", "/"], ["Studio", "/studio"]])} />
    </>
  );
}
