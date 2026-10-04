import type { Metadata } from "next";
import { JsonLd, breadcrumbs } from "@/components/JsonLd";
import { og } from "@/lib/site";
import { ContactBand } from "@/components/ContactBand";
import { SecHead } from "@/components/SecHead";
import { Button, TextLink } from "@/components/Button";
import { StudioFig } from "@/components/studio/StudioFig";
import { ProcessRail } from "@/components/studio/ProcessRail";
import { Standards } from "@/components/studio/Standards";
import "@/components/studio/studio.css";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Websport is a design and development studio: specialists in community sports club websites and apps on PlayHQ, and designers for any brand.",
  alternates: { canonical: "/studio" },
  openGraph: og("/studio", "/og/studio.png", "Websport studio: Club sport is our speciality. Craft is our trade."),
};

const CLUBS = [
  ["Club websites & apps", "Fixtures, results and ladders from PlayHQ, for any code."],
  ["The right logo on every team", "Every side and every opponent, matched from PlayHQ data."],
  ["Events, RSVP & payments", "Event pages with a live headcount, RSVPs in a tap and a payment link."],
  ["Announcements", "Notices that post once and show everywhere they should."],
  ["Player profiles, present and past", "Seasons, teams and career stats for everyone who has worn the colours."],
  ["Stories & committee admin", "Member stories the committee reviews, and an admin volunteers can run."],
] as const;

const BEYOND = [
  ["Brand identity", "Marks, type and colour systems that hold up from a favicon to a billboard."],
  ["Marketing & product sites", "Sites that explain one thing well and load fast on any phone."],
  ["Interface & motion design", "Prototyped in the browser with real content, so motion has a reason."],
  ["Design systems & front-end", "Tokens, components and documentation your team can keep building with."],
  ["Web apps on Next.js", "Accounts, payments and admin, on the same stack as our club platform."],
] as const;

const STEPS = [
  { title: "Listen", text: "We sit down with the committee or your team and learn how things actually run: who posts what, where members look, what the old site gets wrong." },
  { title: "Design in the browser", text: "Type, colour and components designed as working pages, so you react to the real thing rather than a picture of it." },
  { title: "Build & connect", text: "We build it, connect PlayHQ and your payment links, and set up the admin around how your people work." },
  { title: "Hand over the keys", text: "Whoever is taking it on learns the admin with us. After that, it’s your site to run." },
] as const;

const STANDARDS = [
  { title: "Accessible by default", text: "WCAG 2.2 AA: keyboard paths, visible focus, real contrast, and a calm version for anyone who prefers reduced motion." },
  { title: "Fast on real phones", text: "Performance budgets set before design starts, checked on mid-range Android, not just a laptop." },
  { title: "Motion with a reason", text: "Every animation explains something or answers you. If it doesn’t, it goes." },
  { title: "Run by you", text: "Content your people can update themselves, from an admin built around how they actually work." },
] as const;

const STACK = ["Next.js", "React", "TypeScript", "Postgres + Drizzle", "Vercel", "PlayHQ API", "GSAP"] as const;

function BuildList({ id, label, items }: { id: string; label: string; items: readonly (readonly [string, string])[] }) {
  return (
    <div className="bl">
      <h3 id={id} className="bl-hd mono">
        <span className="pen" aria-hidden="true" />
        <span>{label}</span>
        <span className="bl-c" aria-hidden="true">
          {String(items.length).padStart(2, "0")}
        </span>
      </h3>
      <ol className="bl-list" aria-labelledby={id}>
        {items.map(([t, x], i) => (
          <li key={t} className="bl-row">
            <span className="bl-n mono" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="bl-t wglide">{t}</span>
            <span className="bl-x">{x}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Studio (§6.4): owns Process and the full "beyond sport" story. */
export default function Studio() {
  return (
    <>
      <header className="wrap pg-hd st-hd">
        <p className="pg-eyebrow mono h-fade" style={{ "--i": 0 } as React.CSSProperties}>
          <span>Studio</span>
        </p>
        <h1 className="pg-h t-display st-h">
          <span className="h-line" style={{ "--i": 0 } as React.CSSProperties}>
            Club sport is <br />
            our speciality.
          </span>
          <span className="h-line" style={{ "--i": 1 } as React.CSSProperties}>
            <em>Craft is our trade.</em>
          </span>
        </h1>
        <div className="st-hd-row">
          <p className="st-lede t-lead h-fade" style={{ "--i": 1 } as React.CSSProperties}>
            Websport is a design and development studio. Community sports clubs on PlayHQ are what we know best: the
            fixtures, the committees, the Saturday-morning phone checks. The craft underneath (type, motion, interface,
            accessibility and speed) isn&rsquo;t sport-specific, so we bring it to any brand that wants to be seen properly.
          </p>
          <div className="st-fig h-fade" style={{ "--i": 2 } as React.CSSProperties}>
            <StudioFig />
          </div>
        </div>
      </header>

      <section className="sec" aria-labelledby="st-build">
        <div className="wrap">
          <SecHead n="01" name="What we build" id="st-build" title={<>Two lists, <em>one standard.</em></>} />
          <div className="sec-body bl-grid">
            <BuildList id="st-clubs" label="For clubs" items={CLUBS} />
            <BuildList id="st-beyond" label="Beyond sport" items={BEYOND} />
          </div>
          <aside className="note" aria-labelledby="st-note">
            <h3 id="st-note" className="note-k mono">
              <span className="pen" aria-hidden="true" />A note on our portfolio
            </h3>
            <p className="note-x">
              Our first customer is a sports club, and we don&rsquo;t have work outside sport to show yet. So judge us on this
              site: every interaction, every contrast ratio and every millisecond here is the standard we&rsquo;d bring to
              yours.
            </p>
            <div className="note-links">
              <TextLink href="/#any" arrow="→">
                Try the any-domain demo
              </TextLink>
              <TextLink href="/work/lang-lang" arrow="→">
                Read the Lang Lang case study
              </TextLink>
            </div>
          </aside>
        </div>
      </section>

      <section id="process" className="sec" aria-labelledby="st-process">
        <div className="wrap">
          <SecHead n="02" name="How we work" id="st-process" title={<>From first chat <em>to first fixture.</em></>} />
          <div className="sec-body">
            <ProcessRail steps={STEPS} />
          </div>
        </div>
      </section>

      <section className="sec" aria-labelledby="st-standards">
        <div className="wrap">
          <SecHead n="03" name="Standards" id="st-standards" title={<>What we hold <em>every project to.</em></>} />
          <div className="sec-body">
            <Standards items={STANDARDS} />
          </div>
        </div>
      </section>

      <section className="sec" aria-labelledby="st-stack">
        <div className="wrap">
          <div className="sec-hd">
            <p className="sec-k mono">
              <span>04</span>
              <span>Stack</span>
            </p>
            <div className="stk">
              <h2 id="st-stack" className="sr">
                Stack
              </h2>
              <ul className="stk-list">
                {STACK.map((s, i) => (
                  <li key={s} className="stk-i" style={{ "--k": i } as React.CSSProperties}>
                    {s}
                  </li>
                ))}
              </ul>
              <p className="stk-cap">What we reach for. We&rsquo;ll tell you why for your project.</p>
            </div>
          </div>
        </div>
      </section>

      <ContactBand
        id="st-contact"
        n="05"
        title={
          <>
            Got a club, or a brief <br className="d" />
            <em>that deserves better?</em>
          </>
        }
        size="h2"
        actions={
          <Button href="/contact" magnetic arrow="→">
            Start a project
          </Button>
        }
      />
      <JsonLd
        data={breadcrumbs([
          ["Home", "/"],
          ["Studio", "/studio"],
        ])}
      />
    </>
  );
}
