"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Picks the footer by route (DESIGN.md §4): without the closing line on /contact, with it everywhere else. */
export function SiteFooter({ full, plain }: { full: ReactNode; plain: ReactNode }) {
  return usePathname() === "/contact" ? plain : full;
}
