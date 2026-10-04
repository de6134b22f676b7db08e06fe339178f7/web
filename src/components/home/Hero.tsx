import { Button, TextLink } from "@/components/Button";
import { HeroHead } from "./HeroHead";
import { NextUpCard } from "./NextUpCard";

/** An editorial opening, with the original sport roller and live fixture alongside the introduction. */
export function Hero() {
  return (
    <section className="wrap hero" data-sec="00" data-sec-name="Index" aria-labelledby="hero-h">
      <p className="hero-meta mono h-fade" style={{ "--i": 0 } as React.CSSProperties}>
        <span>Websites &amp; apps for community sport</span>
        <span>Independent digital studio</span>
      </p>
      <HeroHead />
      <div className="hero-foot">
        <p className="hero-aside-title h-fade" style={{ "--i": 1 } as React.CSSProperties}>
          Club spirit. <br />Digital home.
        </p>
        <p className="hero-sub t-lead h-fade" style={{ "--i": 1 } as React.CSSProperties}>
          A place for the fixtures, the familiar faces, and everything that makes your club yours. Designed with care. Connected to PlayHQ.
        </p>
        <div className="hero-ctas h-fade" style={{ "--i": 2 } as React.CSSProperties}>
          <Button href="#contact" magnetic arrow="↗">
            Start a project
          </Button>
        </div>
        <div className="hero-card h-fade" style={{ "--i": 3 } as React.CSSProperties}>
          <p className="hero-card-label mono">A little of what we do <span aria-hidden="true">↙</span></p>
          <NextUpCard />
        </div>
      </div>
      <div className="hero-bottom h-fade" style={{ "--i": 4 } as React.CSSProperties}>
        <span className="hero-bottom-note">Built for the people behind the game.</span>
        <TextLink href="#build" arrow="↓">Explore the club kit</TextLink>
        <span className="hero-cue mono" aria-hidden="true">
          <span className="hero-cue-line"><i /></span>
          Scroll to discover
        </span>
      </div>
    </section>
  );
}
