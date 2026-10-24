import type { Metadata } from "next";
import { og, SITE, CODES } from "@/lib/site";
import { CopyEmail } from "@/components/CopyEmail";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd, breadcrumbs } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { Rail } from "@/components/Rail";
import "./contact.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email Websport about a club website, a club app or a design project: hello@websport.com.au.",
  alternates: { canonical: "/contact" },
  openGraph: og("/contact", "/og/contact.png", "Contact Websport: tell us about your club."),
};

/**
 * Contact: the head, then the address as the page's second headline (sticky beside the form at >= 900px, cols 1-5)
 * and the form (cols 6-13) with hairline fields that stagger in. City and reply time are gated. The footer on this
 * route has no "Tell us about your club" close (SiteFooter): the page is the close.
 */
export default function ContactPage() {
  return (
    <>
      <section className="page-head" aria-labelledby="contact-h">
        <div className="wrap">
          <PageHead
            id="contact-h"
            kicker="Contact"
            note="Clubs and other fields"
            title="What does|your club need"
            accent="?"
            lede="Your teams, your season, and what the committee wants the site to do. Email us, or send the form."
          />
        </div>
      </section>
      <section className="contact-body" aria-label="Get in touch">
        <div className="wrap">
          <Rail index="01" name="Write to us" note="Or send the form" />
          <div className="grid contact-grid">
            <div className="contact-mail head-in" style={{ "--i": 6 } as React.CSSProperties}>
              <CopyEmail email={SITE.email} variant="icon" className="contact-email" />
              <p className="meta">We reply by email.</p>
            </div>
            <div className="contact-form">
              <ContactForm email={SITE.email} codes={CODES} />
            </div>
          </div>
        </div>
      </section>
      <JsonLd data={breadcrumbs([["Home", "/"], ["Contact", "/contact"]])} />
    </>
  );
}
