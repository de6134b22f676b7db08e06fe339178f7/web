import type { Metadata, Viewport } from "next";
import "./globals.css";
import { mona, mono } from "./fonts";
import { SITE, og } from "@/lib/site";
import { GATE } from "@/lib/gate";
import { InlineScript } from "@/components/InlineScript";
import { Header, SkipLink } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { Smooth } from "@/components/motion/Smooth";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}: ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: { ...og("/"), url: undefined },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#060D1F",
  colorScheme: "light",
};

/** Organization, without address or founding date (gated). */
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  logo: `${SITE.url}/brand/logo.svg`,
};

/**
 * Root layout (DESIGN.md §4-6). Head script (js / reduce / fine / once-per-session loader gate) -> skip link ->
 * floating header -> <main id="main"> -> footer (night ground, every page) -> Lenis.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${mona.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <InlineScript html={GATE} />
      </head>
      <body>
        <SkipLink />
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter full={<Footer />} plain={<Footer cta={false} />} />
        <Smooth />
        <JsonLd data={organization} />
      </body>
    </html>
  );
}
