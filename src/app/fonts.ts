import { Host_Grotesk, Martian_Mono } from "next/font/google";
/**
 * DESIGN.md v4 §2.4. Host Grotesk (variable wght 300–800) for display + body; its italic is a separate,
 * non-preloaded face used only for `em` in display lines. Martian Mono (wdth 75–112.5) for labels and data.
 * The wordmark is never a font (outlined Sora paths, src/components/wordmark.generated.ts).
 */
export const sans = Host_Grotesk({
  subsets: ["latin"],
  style: "normal",
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

export const sansItalic = Host_Grotesk({
  subsets: ["latin"],
  style: "italic",
  variable: "--font-sans-italic",
  display: "swap",
  adjustFontFallback: true,
  preload: false,
});

export const mono = Martian_Mono({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-mono",
  display: "swap",
  // A real monospace fallback (close widths) instead of size-adjusted Arial, so a late font never rewraps a label.
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
  preload: true,
});
