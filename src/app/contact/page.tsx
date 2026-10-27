import type { Metadata } from "next";
import { JsonLd, breadcrumbs } from "@/components/JsonLd";
import { og, SITE } from "@/lib/site";
import { Button, TextLink } from "@/components/Button";
import { CopyEmail } from "@/components/CopyEmail";
import { ContactMark } from "@/components/ContactMark";
import { FirstEmail } from "@/components/contact/FirstEmail";
import { ContactForm } from "@/components/contact/ContactForm";
import "@/components/contact/contact.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email Websport about a club website, a club app or a design project: hello@websport.com.au.",
  alternates: { canonical: "/contact" },
  openGraph: og("/contact", "/og/contact.png", "Contact Websport: Tell us about your club."),
};

const HELPS = [
  "Your club or company name, and a link to the current site if there is one.",
  "The codes you play on PlayHQ, or what you make.",
  "What isn’t working today.",
  "Anything with a date on it: a season launch, an AGM, a presentation night, a product launch.",
] as const;

/** The same four prompts, pre-filled into a new email (mailto body). */
const OUTLINE = [
  "Club or company:",
  "Current site (if any):",
  "Codes on PlayHQ, or what you make:",
  "What isn’t working today:",
  "Dates coming up:",
].join("\n\n");
const OUTLINE_HREF = `mailto:${SITE.email}?subject=${encodeURIComponent("New project")}&body=${encodeURIComponent(`${OUTLINE}\n`)}`;

/** Contact (§6.5). One short form (Postmark via /api/contact) beside the email address; no phone, address, reply time or socials. */
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

      <section className="wrap ct-body" aria-label="Email us">
        <div className="ct-main">
          <div className="ct-cta h-fade" style={{ "--i": 1 } as React.CSSProperties}>
            <CopyEmail email={SITE.email} size="mail" className="ct-copy" />
            <Button href={`mailto:${SITE.email}?subject=New%20project`} magnetic arrow="↗">
              Email us
            </Button>
          </div>

          <div className="ct-form h-fade" style={{ "--i": 2 } as React.CSSProperties}>
            <h2 id="ct-form-h" className="ct-k mono">
              Or send a message
            </h2>
            <ContactForm email={SITE.email} />
          </div>

          <div className="ct-helps h-fade" style={{ "--i": 2 } as React.CSSProperties}>
            <h2 id="ct-helps-h" className="ct-k mono">
              What helps in a first email
            </h2>
            <FirstEmail items={HELPS} labelledBy="ct-helps-h" />
            <div className="ct-outline">
              <TextLink href={OUTLINE_HREF} arrow="↗">
                Start an email with these prompts
              </TextLink>
            </div>
          </div>

          <p className="ct-note">
            <span className="mono ct-note-k">Note</span>
            Messages and emails come straight to us.
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
