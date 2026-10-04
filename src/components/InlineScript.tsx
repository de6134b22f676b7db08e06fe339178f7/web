"use client";
/**
 * Next's "preventing flash" helper (docs: preventing-flash-before-hydration): executes during HTML parse, inert
 * (text/plain) when React renders it on the client, so dev never warns about a script tag. Client component so the
 * `typeof window` branch actually differs between the server and client renders.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
