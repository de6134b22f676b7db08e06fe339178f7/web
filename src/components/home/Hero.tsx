import { Button, TextLink } from "@/components/Button";
import { HeroHead } from "./HeroHead";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section className="wrap hero" data-sec="00" data-sec-name="Home" aria-labelledby="hero-h">
      <div className="hero-copy">
        <p className="hero-meta h-fade">Websites for community sport</p>
        <HeroHead />
        <p className="hero-sub t-lead h-fade" style={{ "--i": 1 } as React.CSSProperties}>
          Your club. Beautifully connected. Websites and apps that bring everyone together.
        </p>
        <div className="hero-ctas h-fade" style={{ "--i": 2 } as React.CSSProperties}>
          <Button href="/contact" magnetic arrow="↗">Let’s talk</Button>
          <TextLink href="#build" arrow="↓">Explore the kit</TextLink>
        </div>
      </div>
      <HeroVisual />
    </section>
  );
}
