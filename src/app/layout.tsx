import type { Metadata, Viewport } from "next";
import "./globals.css";
import { display, sans, sansItalic, mono } from "./fonts";
import { SITE, og } from "@/lib/site";
import { InlineScript } from "@/components/InlineScript";
import { GATE } from "@/lib/gate";
import { MotionProvider } from "@/motion/MotionProvider";
import { Loader } from "@/components/Loader";
import { Header, SkipLink } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Cursor } from "@/components/Cursor";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  // No `url` here: each page restates the block with its own path via og().
  openGraph: { ...og("/"), url: undefined },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  colorScheme: "light",
};

/** §7.4: Organization without address or founding date. */
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  logo: `${SITE.url}/icon.svg`,
};

/**
 * Root layout (DESIGN.md v4 §3, §4.3). Order matters:
 * head script (js / no-intro / skip) -> skip link -> Loader (pure CSS, outside React state) -> Header -> page -> Footer.
 * The layout never remounts, so the finished loader never replays.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${display.variable} ${sans.variable} ${sansItalic.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <InlineScript html={GATE} />
      </head>
      <body>
        <SkipLink />
        <Loader />
        <MotionProvider>
          <Header email={SITE.email} />
          {children}
          <Footer />
          <Cursor />
        </MotionProvider>
        <div className="vt-edge" aria-hidden="true" />
        <JsonLd data={organization} />
      </body>
    </html>
  );
}
