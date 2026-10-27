import type { Metadata } from "next";
import { JsonLd, breadcrumbs } from "@/components/JsonLd";
import { og, SITE } from "@/lib/site";
import { ContactMark } from "@/components/ContactMark";
import { FirstEmail } from "@/components/contact/FirstEmail";
import { ContactForm } from "@/components/contact/ContactForm";
import "@/components/contact/contact.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Websport about a club website, a club app, a local business website or a design project.",
  alternates: { canonical: "/contact" },
  openGraph: og("/contact", "/og/contact.png", "Contact Websport: Tell us about your club."),
};

const HELPS = [
  "Your club or company name, and a link to the current site if there is one.",
  "The codes you play on PlayHQ, or what you make.",
  "What isn’t working today.",
  "Anything with a date on it: a season launch, an AGM, a presentation night, a product launch.",
] as const;

/** Contact (§6.5). One short form (Postmark via /api/contact) ; no phone, address, reply time or socials. */
export default function Contact() {
  return (
    <>
      <header className="wrap pg-hd ct-hd">
        <p className="pg-eyebrow mono h-fade" style={{ "--i": 0 } as React.CSSProperties}>
          <span>Contact</span>
        </p>
        <h1 className="pg-h t-display ct-h">
          <span className="h-line" style={{ "--i": 0 } as React.CSSProperties}>
            Let’s make
          </span>
          <span className="h-line" style={{ "--i": 1 } as React.CSSProperties}>
            <em>something good.</em>
          </span>
        </h1>
      </header>

      <section className="wrap ct-body" aria-label="Contact us">
        <div className="ct-main">
          <div className="ct-form h-fade" style={{ "--i": 2 } as React.CSSProperties}>
            <h2 id="ct-form-h" className="ct-k mono">
              Send a message
            </h2>
            <ContactForm email={SITE.email} />
          </div>

          <div className="ct-helps h-fade" style={{ "--i": 2 } as React.CSSProperties}>
            <h2 id="ct-helps-h" className="ct-k mono">
              What helps in a message
            </h2>
            <FirstEmail items={HELPS} labelledBy="ct-helps-h" />
          </div>

          <p className="ct-note">
            <span className="mono ct-note-k">Note</span>
            Messages come straight to us.
          </p>
        </div>

        <div className="ct-side h-fade" style={{ "--i": 2 } as React.CSSProperties}>
          <ContactMark mode="static" />
          <p className="mono ct-cap">
            <span>Tell us about your club.</span>
          </p>
        </div>
      </section>
      <JsonLd
        data={breadcrumbs([
          ["Home", "/"],
          ["Contact", "/contact"],
        ])}
      />
    </>
  );
}
