import { SITE } from "@/lib/site";

/** Inline JSON-LD, escaped like layout.tsx's Organization block. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function breadcrumbs(items: [name: string, path: string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      // Home is the bare origin, matching the rendered canonical (Next drops the trailing slash) and the sitemap.
      item: path === "/" ? SITE.url : `${SITE.url}${path}`,
    })),
  };
}
