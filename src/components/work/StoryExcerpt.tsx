import { SplitHeading } from "@/components/Reveal";

/**
 * Member story excerpt (DESIGN.md v4 §5.5, §6.3 CS5). Labelled "From a member story" and linked to the story on
 * the club site. Never styled or labelled as a testimonial: no portrait, no name card, no stars. The quote is a
 * split-line reveal (static children only); the opening mark is a Flag pennant, not a quotation glyph.
 */
export function StoryExcerpt({ n, quote, caption, href }: { n?: string; quote: string; caption: string; href: string }) {
  return (
    <section className="sec cs-story" aria-labelledby="cs-story-k">
      <div className="wrap">
        <div className="sec-hd">
          <p className="sec-k mono" id="cs-story-k">
            {n ? <span>{n}</span> : null}
            <span>From a member story</span>
          </p>
        </div>
        <figure className="cs-story__fig">
          <span className="cs-story__mk" aria-hidden="true" />
          <SplitHeading as="blockquote" className="cs-story__q" threshold={0.3}>
            &ldquo;{quote}&rdquo;
          </SplitHeading>
          <figcaption className="cs-story__cap">
            <span>{caption}</span>
            <a href={href} target="_blank" rel="noopener" className="link-u cs-story__link">
              Read the story
              <svg className="btn-arr is-ne" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 12L12 4M5.5 4H12v6.5" />
              </svg>
              <span className="sr"> (opens in a new tab)</span>
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
