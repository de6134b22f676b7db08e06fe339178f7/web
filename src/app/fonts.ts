import localFont from "next/font/local";

/**
 * Two families (DESIGN.md §3.2), both self-hosted, latin only, preloaded.
 * - Mona Sans (OFL, ./fonts/MonaSans-OFL.txt): display, headings and body. Variable wght 200-900 and wdth 75-125;
 *   the display voice is 800 at ~90% width. `font-stretch` is declared so CSS can use it.
 * - Geist Mono (OFL, ./fonts/GeistMono-OFL.txt): every label, index, table numeral and the scoreboard. Variable 100-900.
 * The logo wordmark is outlined type (brand.generated.ts) and never waits on either file.
 */
export const mona = localFont({
  src: "./fonts/mona-sans-latin-wdth-normal.woff2",
  variable: "--font-mona",
  weight: "200 900",
  style: "normal",
  display: "swap",
  preload: true,
  declarations: [{ prop: "font-stretch", value: "75% 125%" }],
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

export const mono = localFont({
  src: "./fonts/geist-mono-latin-wght-normal.woff2",
  variable: "--font-mono",
  weight: "100 900",
  style: "normal",
  display: "swap",
  preload: true,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});
