import { PageTransition } from "@/components/PageTransition";

/**
 * Route surface (DESIGN.md 3.4, M16): the old page moves up and dims, the new one wipes up (CSS in globals.css).
 * PageTransition keys it by pathname, because this template only remounts when the first segment changes.
 * Renders the single <main id="main">, so pages render sections only; the menu marks #main inert, and `.page`
 * is the footer-curtain surface (M38).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
