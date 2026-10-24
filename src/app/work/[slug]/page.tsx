import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allWork, getWork } from "@/content/work";
import { SITE } from "@/lib/site";
import { ArrowLink } from "@/components/Button";
import { Capture } from "@/components/Capture";
import { Picture } from "@/components/Picture";
import { DotList } from "@/components/DotList";
import { JsonLd, breadcrumbs } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { Rail } from "@/components/Rail";
import { Rise } from "@/components/motion/Rise";
import { Pan } from "@/components/motion/Pan";
import { Compare } from "@/components/motion/Compare";
import { ScrubWords } from "@/components/motion/ScrubWords";
import "../work.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return allWork.map((w) => ({ slug: w.slug }));
}

function ogImage(slug: string) {
  return existsSync(path.join(process.cwd(), "public", "og", `${slug}.png`)) ? `/og/${slug}.png` : "/og.png";
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = getWork(slug);
  if (!w) return {};
  const title = w.headline.split("|").join(" ");
  return {
    title: w.client,
    description: w.summary,
    alternates: { canonical: `/work/${w.slug}` },
    openGraph: {
      type: "article",
      locale: "en_AU",
      siteName: SITE.name,
      url: `/work/${w.slug}`,
      title: `${w.client}: ${title}.`,
      description: w.summary,
      images: [{ url: ogImage(w.slug), width: 1200, height: 630, alt: `${w.client} case study by Websport` }],
    },
    twitter: { card: "summary_large_image" },
  };
}

/** Full-measure captures (hero, the pair). */
const FULL = "(min-width:1440px) 1325px, 92vw";
/** Feature windows: cols 6-13 at >= 900px; under 900px the window is zoomed to 180% of its 92vw frame. */
const FEAT = "(min-width:1440px) 763px, (min-width:900px) 54vw, (min-width:600px) 130vw, 166vw";
const label = (s: string) => s.replace(" · ", ": ");

/**
 * Case study (BRIEF 5.2). Content from src/content/work/<slug>.ts, in its order: head, the hero capture (first fold),
 * the meta cells, 01 before/now, 02 the brief, 03 what we built (five features, sticky copy beside a panning
 * capture), 04 run by the club. The footer closes the page.
 */
export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const w = getWork(slug);
  if (!w) notFound();
  const title = w.headline.split("|").join(" ");
  const phoneOf = (label: string) => w.mobile.shots.find((s) => s.label === label)?.shot;
  const article = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${w.client}: ${title}.`,
    description: w.summary,
    url: `${SITE.url}/work/${w.slug}`,
    creator: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };
  return (
    <>
      <section className="page-head case-head" aria-labelledby="case-h">
        <div className="wrap">
          <PageHead id="case-h" kicker={w.client} note="Case study" title={w.headline} lede={w.intro} wide />
        </div>
      </section>

      {/* The hero capture, first fold at 1440x900, revealed by a clip-path on load (CSS). Eager, not preloaded: on
          phones it sits under the intro and a preload would compete with the h1's font (the LCP there). */}
      <div className="wrap cap-reveal case-hero">
        <Capture slug={w.slug} shot={w.hero} phoneShot={phoneOf("Home")} sizes={FULL} crop={0} ratio={w.heroRatio} eager />
      </div>

      <div className="wrap">
        <dl className="case-meta">
          <div>
            <dt className="kicker">Project</dt>
            <dd>{w.kind}</dd>
          </div>
          <div>
            <dt className="kicker">Live</dt>
            <dd>
              <ArrowLink href={w.live.href} external>
                {w.live.label}
              </ArrowLink>
            </dd>
          </div>
          <div>
            <dt className="kicker">What the club got</dt>
            <dd>
              <DotList items={w.got} />
            </dd>
          </div>
        </dl>
      </div>

      {/* 01. Before / Now: the Now wipes in from the right and rests as a split. */}
      <section className="sec" aria-labelledby="before-h">
        <div className="wrap">
          <Rail index="01" name="Before and now" note={label(w.before.old.label)} />
          <Rise className="sec-head">
            <h2 id="before-h" className="h2 rise">
              {w.before.heading.replace(/\.$/, "")}
              <span className="accent">.</span>
            </h2>
          </Rise>
          <Compare
            labels={[label(w.before.old.label), label(w.before.now.label)]}
            before={
              <div className="cap-img cap-crop" style={{ "--ratio": w.heroRatio } as React.CSSProperties}>
                <Picture slug={w.slug} shot={w.before.old.shot} sizes={FULL} />
              </div>
            }
            now={
              <div className="cap-img cap-crop" style={{ "--ratio": w.heroRatio } as React.CSSProperties}>
                <Picture slug={w.slug} shot={w.before.now.shot} sizes={FULL} decorative />
              </div>
            }
          />
          <div className="pair-bodies split">
            <p className="pair-b">{w.before.old.body}</p>
            <p className="pair-b">{w.before.now.body}</p>
          </div>
        </div>
      </section>

      {/* 02. The brief: the h2, then the statement that resolves word by word as it crosses the viewport. */}
      <section className="sec sec-tight" aria-labelledby="vision-h">
        <div className="wrap">
          <Rail index="02" name="The brief" note="What the committee asked for" />
          <div className="case-brief">
            <Rise>
              <h2 id="vision-h" className="h2 rise">
                {w.vision.heading.replace(/\.$/, "")}
                <span className="accent">.</span>
              </h2>
            </Rise>
            <ScrubWords className="stack" size="statement" paragraphs={w.vision.paragraphs} />
          </div>
        </div>
      </section>

      {/* 03. Features, in the club's own order. At >= 900px the copy sits in a sticky column beside the capture,
          which pans as it crosses the viewport. Under 900px the phone capture (when there is one) or a 180% zoom
          of the window is the image. */}
      <section className="sec" aria-labelledby="built-h">
        <div className="wrap">
          <Rail index="03" name="What we built" note={w.built.note} />
          <Rise className="sec-head">
            <h2 id="built-h" className="h2 rise">
              {w.built.heading.replace(/\.$/, "")}
              <span className="accent">.</span>
            </h2>
          </Rise>
          <ol className="feats">
            {w.built.primary.map((f) => {
              const phone = f.phone ? phoneOf(f.phone) : undefined;
              const cls = ["cap feat-cap", phone ? "has-phone" : "no-phone", f.ratio ? "feat-wide" : ""].filter(Boolean).join(" ");
              return (
                <li key={f.no} className="feat">
                  <div className="feat-side">
                    <Rise className="feat-text">
                      <p className="index feat-no rise" aria-hidden="true">
                        {f.no}
                      </p>
                      <h3 className="h3-lg feat-t rise">
                        <span className="sr-only">{f.no}. </span>
                        {f.title}
                      </h3>
                      <p className="feat-b rise">{f.body}</p>
                    </Rise>
                  </div>
                  <figure className={cls} style={{ "--zx": f.zoomX ?? 0.1 } as React.CSSProperties}>
                    <Pan from={f.at} to={f.to} ratio={f.ratio ?? "16 / 10"} className="feat-desk">
                      <Picture slug={w.slug} shot={f.shots[0]} sizes={FEAT} />
                    </Pan>
                    {phone ? (
                      <Pan from={0.04} to={0.45} ratio="780 / 1200" className="feat-phone cap-phone">
                        <Picture slug={w.slug} shot={phone} sizes="(min-width:900px) 200px, min(300px, 76vw)" decorative />
                      </Pan>
                    ) : null}
                    <figcaption className="meta cap-cap">{f.caption}</figcaption>
                  </figure>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 04. Run by the club: the close. No admin capture exists, so this is words only. */}
      <section className="sec case-close" aria-labelledby="close-h">
        <div className="wrap">
          <Rail index="04" name="Run by the club" note={w.close.note} />
          <Rise className="sec-head">
            <h2 id="close-h" className="h2 rise">
              {w.close.heading.replace(/\.$/, "")}
              <span className="accent">.</span>
            </h2>
          </Rise>
          <div className="split close-split">
            <p className="close-body">{w.close.body}</p>
            <div className="stack">
              <p className="close-outcome">{w.close.outcome}</p>
              <ArrowLink href="/contact">Start a project</ArrowLink>
            </div>
          </div>
        </div>
      </section>
      <JsonLd data={article} />
      <JsonLd data={breadcrumbs([["Home", "/"], ["Work", "/work"], [w.client, `/work/${w.slug}`]])} />
    </>
  );
}
