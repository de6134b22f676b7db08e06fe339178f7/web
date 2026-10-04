"use client";
/**
 * Keys the route surface by pathname, so every navigation (including /work -> /work/[slug], where the root
 * template does not remount) exits and enters through the same view-transition wipe (DESIGN.md 3.4, M16).
 */
import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition key={pathname} enter="ws-page-in" exit="ws-page-out" default="none">
      <main id="main" tabIndex={-1} className="page">
        {children}
      </main>
    </ViewTransition>
  );
}
