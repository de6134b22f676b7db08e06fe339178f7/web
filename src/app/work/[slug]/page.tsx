import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { notFound } from "next/navigation";
import { allWork, getWork } from "@/content/work";
import { PLAYHQ_NOTE, SITE } from "@/lib/site";
import { Picture } from "@/components/Picture";
import { SecHead } from "@/components/SecHead";
import { ClipReveal, Rise } from "@/components/Reveal";
import { TextLink } from "@/components/Button";
import { JsonLd, breadcrumbs } from "@/components/JsonLd";
import { CaseHero } from "@/components/work/CaseHero";
import { Compare } from "@/components/work/Compare";
import { FeatureFrame, FeatureIndex, type FeatureView } from "@/components/work/Features";
import { Counter } from "@/components/work/Counter";
import { PhoneStrip } from "@/components/work/PhoneStrip";
import { StoryExcerpt } from "@/components/work/StoryExcerpt";
import { GhostRow } from "@/components/work/GhostRow";
import "@/components/work/work.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return allWork.map((w) => ({ slug: w.slug }));
}

/** Per-case OG card from `npm run og`; a case study without one falls back to the site card. */
function ogImage(slug: string) {
  return existsSync(path.join(process.cwd(), "public", "og", `${slug}.png`)) ? `/og/${slug}.png` : "/og.png";
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = getWork(slug);
  if (!w) return {};
  return {
    title: w.client,
    description: w.summary,
    alternates: { canonical: `/work/${w.slug}` },
    openGraph: {
      type: "article",
      locale: "en_AU",
      siteName: SITE.name,
      url: `/work/${w.slug}`,
      title: `${w.client} — ${w.headline}`,
      description: w.summary,
      images: [{ url: ogImage(w.slug), width: 1200, height: 630, alt: `${w.client} case study by Websport` }],
    },
    twitter: { card: "summary_large_image" },
  };
}

/** Render `text` with its trailing `tail` muted in the italic face (content keeps plain strings). */
function tail(text: string, end: string): ReactNode {
  if (!text.endsWith(end)) return text;
  return (
    <>
      {text.slice(0, -end.length)}
      <em>{end}</em>
    </>
  );
}

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** Case study (DESIGN.md v4 §6.3), light. No sample crests, no mock UI, no year: real captures only. */
export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const w = getWork(slug);
  if (!w) notFound();

  const words = w.client.split(" ");
  const h1 = words.length > 2 ? [words.slice(0, 2).join(" "), words.slice(2).join(" ")] : [w.client];
  const domain = w.live.label;
  const features: FeatureView[] = w.built.primary.map((f) => ({
    no: f.no,
    title: f.title,
    body: f.body,
    shot: f.shots[0],
    path: f.path,
    scroll: f.scroll,
    indexAt: f.indexAt,
    caption: f.caption,
  }));
  const [stories, admin] = w.built.supporting;

  return (
    <>
      {/* CS0 hero */}
      <header className="wrap pg-hd cs-hd">
        <p className="pg-eyebrow mono h-fade" style={i(0)}>
          <span>Case study</span>
          <span className="cs-hd__eb">Our first customer · {w.kind}</span>
        </p>
        <div className="cs-hd__row">
          <h1 className="pg-h t-display cs-hd__h">
            {h1.map((l, k) => (
              <span key={l} className="h-line" style={i(k)}>
                {l}
              </span>
            ))}
          </h1>
          <div className="cs-hd__side">
            <p className="cs-hd__sub t-lead h-fade" style={i(1)}>
              {w.headline}
            </p>
          <dl className="cs-meta h-fade" style={i(2)}>
            <div>
              <dt className="mono">Client</dt>
              <dd>{w.client}</dd>
            </div>
            <div>
              <dt className="mono">Work</dt>
              <dd>{w.kind}</dd>
            </div>
            <div>
              <dt className="mono">Stack</dt>
              <dd>{w.stack.join(" · ")}</dd>
            </div>
            <div>
              <dt className="mono">Live</dt>
              <dd>
                <a href={w.live.href} target="_blank" rel="noopener" className="cs-live u-line">
                  {w.live.label}&nbsp;↗<span className="sr"> (opens in a new tab)</span>
                </a>
              </dd>
            </div>
          </dl>
          </div>
        </div>
      </header>

      <CaseHero
        domain={domain}
        caption={
          <>
            <b>Now</b> {domain}, the club&rsquo;s front door.
          </>
        }
      >
        <Picture slug={w.slug} shot={w.hero} sizes="(min-width:1600px) 1504px, 92vw" priority />
      </CaseHero>

      {/* CS1 the brief */}
      <section className="sec" aria-labelledby="cs-brief">
        <div className="wrap">
          <SecHead n="01" name={w.vision.label} id="cs-brief" title={tail(w.vision.heading, "stats and titles.")} />
          <div className="sec-body cs-brief">
            <Rise className="cs-brief__lead">
              <p className="t-lead">{w.intro}</p>
            </Rise>
            <Rise className="cs-brief__p">
              {w.vision.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </Rise>
          </div>
        </div>
      </section>

      {/* CS2 before / now (M35) */}
      <section className="sec" aria-labelledby="cs-compare">
        <div className="wrap">
          <SecHead n="02" name="Before and now" id="cs-compare" title={tail(w.before.heading, "to a clubhouse.")} lede="Drag the handle, or use the arrow keys." />
          <div className="sec-body">
            <Compare
              labels={[w.before.old.label, w.before.now.label]}
              before={<Picture slug={w.slug} shot={w.before.old.shot} sizes="92vw" />}
              now={<Picture slug={w.slug} shot={w.before.now.shot} sizes="92vw" />}
            />
            <Rise className="cs-cmp__caps">
              {[w.before.old, w.before.now].map((s) => (
                <div key={s.label}>
                  <h3 className="mono">{s.label}</h3>
                  <p>{s.body}</p>
                </div>
              ))}
            </Rise>
          </div>
        </div>
      </section>

      {/* CS3 what we built (M34): founder order */}
      <section className="sec" aria-labelledby="cs-built">
        <div className="wrap">
          <SecHead n="03" name="What we built" id="cs-built" title={tail(w.built.heading, "in one place.")} lede={w.built.note} />
          <div className="sec-body">
            <FeatureFrame slug={w.slug} domain={domain} features={features} />
            <FeatureIndex slug={w.slug} features={features} />
            <p className="cs-tm mono">{PLAYHQ_NOTE}</p>
          </div>

          <div className="cs-also">
            <p className="cs-also__k mono">
              <span className="pen" aria-hidden="true" /> Also in the build
            </p>
            <div className="cs-also__grid">
              {stories ? (
                <article className="cs-also__item" aria-labelledby="cs-also-1">
                  <div className="cs-also__copy">
                    <h3 id="cs-also-1" className="t-h3">
                      {stories.title}
                    </h3>
                    <p className="cs-also__b">{stories.body}</p>
                    {stories.href ? (
                      <a href={stories.href} target="_blank" rel="noopener" className="link-u cs-also__link">
                        Read a published story
                        <svg className="btn-arr is-ne" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M4 12L12 4M5.5 4H12v6.5" />
                        </svg>
                        <span className="sr"> (opens in a new tab)</span>
                      </a>
                    ) : null}
                  </div>
                  {stories.shot && stories.href ? (
                    <ClipReveal className="cs-also__side">
                      <a href={stories.href} target="_blank" rel="noopener" className="cs-also__shot wk-frame" data-cursor="Read ↗" tabIndex={-1} aria-hidden="true">
                        <span className="wk-frame__bar">
                          <span className="wk-dots">
                            <i />
                            <i />
                            <i />
                          </span>
                          <span className="wk-frame__url mono">
                            <b>{domain}</b>/history
                          </span>
                        </span>
                        <span className="cs-also__img" data-reveal-inner="">
                          <Picture slug={w.slug} shot={stories.shot} sizes="(min-width:1024px) 46vw, 92vw" />
                        </span>
                      </a>
                    </ClipReveal>
                  ) : null}
                </article>
              ) : null}
              {admin ? (
                <article className="cs-also__item" aria-labelledby="cs-also-2">
                  <div className="cs-also__copy">
                    <h3 id="cs-also-2" className="t-h3">
                      {admin.title}
                    </h3>
                    <p className="cs-also__b">{admin.body}</p>
                    {admin.note ? <p className="cs-also__note mono">{admin.note}</p> : null}
                  </div>
                  {admin.chips ? (
                    <div className="cs-also__side cs-admin">
                      <p className="cs-admin__k mono" aria-hidden="true">
                        <span>Committee</span>
                        <span>{String(admin.chips.length).padStart(2, "0")} areas</span>
                      </p>
                      <Rise selector="li" stagger={0.045}>
                        <ul className="cs-admin__list" aria-label="What the committee manages">
                        {admin.chips.map((c, k) => (
                          <li key={c} className="cs-admin__item">
                            <span className="cs-admin__n mono" aria-hidden="true">
                              {String(k + 1).padStart(2, "0")}
                            </span>
                            <span className="cs-admin__t">{c}</span>
                          </li>
                        ))}
                        </ul>
                      </Rise>
                      {admin.action ? (
                        <p className="cs-admin__act">
                          <span className="cs-admin__act-k mono">Plus</span>
                          <span className="cs-admin__act-b">
                            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M13.5 8a5.5 5.5 0 1 1-1.8-4.1M13.5 2.5v3h-3" />
                            </svg>
                            {admin.action}
                          </span>
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* CS4 numbers */}
      <section className="sec" aria-labelledby="cs-nums">
        <div className="wrap">
          <div className="sec-hd">
            <p className="sec-k mono">
              <span>04</span>
              <span id="cs-nums">The build in numbers</span>
            </p>
          </div>
          <dl className="cs-nums">
            {w.numbers.map((n) => (
              <Counter key={n.label} value={n.value} label={n.label} />
            ))}
          </dl>
        </div>
      </section>

      {/* CS5 member story: never a testimonial */}
      <StoryExcerpt n="05" quote={w.excerpt.quote} caption={w.excerpt.caption} href={w.excerpt.href} />

      {/* CS6 on a phone (M36) */}
      <section className="sec cs-phones" aria-labelledby="cs-phone">
        <div className="wrap">
          <SecHead n="06" name="On a phone" id="cs-phone" title={tail(w.mobile.heading, "not the desk.")} />
          <div className="sec-body">
            <PhoneStrip slug={w.slug} client={w.client} phones={w.mobile.shots} />
          </div>
        </div>
      </section>

      {/* CS7 next */}
      <section className="sec cs-next" aria-labelledby="cs-next">
        <div className="wrap">
          <div className="sec-hd">
            <p className="sec-k mono">
              <span>07</span>
              <span id="cs-next">Next</span>
            </p>
          </div>
          <div className="sec-body">
            <GhostRow name="Your club, next." kind="Start a project" sub="Any code on PlayHQ. Tell us what you play." />
            <div className="cs-next__all">
              <TextLink href="/work" arrow="→">
                All work
              </TextLink>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: `${w.client} — website & club platform`,
          description: w.summary,
          about: { "@type": "SportsOrganization", name: w.client, url: w.live.href },
          creator: { "@type": "Organization", name: SITE.name, url: SITE.url },
          url: `${SITE.url}/work/${w.slug}`,
          image: `${SITE.url}/work/${w.slug}/${w.og.file}-1440.jpg`,
        }}
      />
      <JsonLd
        data={breadcrumbs([
          ["Home", "/"],
          ["Work", "/work"],
          [w.client, `/work/${w.slug}`],
        ])}
      />
    </>
  );
}
