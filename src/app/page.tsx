import type { Metadata } from "next";
import { og, SITE } from "@/lib/site";
import { ContactBand } from "@/components/ContactBand";
import { SportProvider } from "@/components/home/SportContext";
import { Hero } from "@/components/home/Hero";
import { Positioning } from "@/components/home/Positioning";
import { Sports } from "@/components/home/Sports";
import { Build } from "@/components/home/Build";
import { Kit } from "@/components/home/Kit";
import { PlayHQ } from "@/components/home/PlayHQ";
import { AnyDomain } from "@/components/home/AnyDomain";
import "@/components/home/home.css";

export const metadata: Metadata = {
  title: { absolute: "Websport — Websites & apps for community sports clubs" },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: og("/", "/og/home.png"),
};

/**
 * Home (DESIGN.md v4 §6.1, "Plates"). Capability is proven by craft and interactive demos on labelled sample data.
 * NO client case study anywhere on this route: the only path to Work is the nav, the menu and the footer.
 */
export default function Home() {
  return (
    <SportProvider>
      <Hero />
      <Positioning />
      <Sports />
      <Build />
      <Kit />
      <PlayHQ />
      <AnyDomain />
      <ContactBand title="Plant your flag." n="07" mark="scrub" sub="Tell us about your club or your brand. A paragraph is plenty." sec={{ n: "07", name: "Contact" }} />
    </SportProvider>
  );
}
