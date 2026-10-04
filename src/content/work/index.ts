import { langLang } from "./lang-lang";
import type { CaseStudy } from "./types";

export type { CaseStudy, Feature, SupportingFeature, Shot } from "./types";
export { captures } from "./captures.generated";

/** Ordered portfolio. Add new case studies here and they appear everywhere. */
export const allWork: CaseStudy[] = [langLang];

export function getWork(slug: string): CaseStudy | undefined {
  return allWork.find((w) => w.slug === slug);
}
