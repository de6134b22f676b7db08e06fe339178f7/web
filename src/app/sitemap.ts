import type { MetadataRoute } from "next";
import { allWork } from "@/content/work";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

const base = SITE.url;

/** No lastModified: a build time is not a confirmed content date. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/work`, changeFrequency: "monthly", priority: 0.8 },
    ...allWork.map((w) => ({ url: `${base}/work/${w.slug}`, changeFrequency: "yearly" as const, priority: 0.7 })),
    { url: `${base}/studio`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.6 },
  ];
}
