import { SplitHeading } from "@/components/Reveal";
import { FigMark } from "./FigMark";

/** H1 "01 — Positioning" (§6.1): split H2, Fig. 1 (columns 9–12), two columns (Club sport | Any domain). */
export function Positioning() {
  return (
    <section className="sec pos" data-sec="01" data-sec-name="Positioning" aria-labelledby="pos-h">
      <div className="wrap">
        <div className="sec-hd">
          <p className="sec-k mono">
            <span>01</span>
            <span>The studio</span>
          </p>
          <div className="pos-grid">
            <SplitHeading as="h2" id="pos-h" className="pos-h t-h2">
              Club sport at heart. <br />
              <em>Good design, everywhere.</em>
            </SplitHeading>
            <FigMark />
            <div className="pos-cols">
              <div className="pos-col">
                <p className="pos-k mono">
                  <span className="pen" aria-hidden="true" />
                  Club sport
                </p>
                <p>
                  The fixture changed. The ground moved. Presentation night needs numbers. We build club websites that keep up with the weekend, without a volunteer retyping a thing.
                </p>
              </div>
              <div className="pos-col">
                <p className="pos-k mono">
                  <span className="pen" aria-hidden="true" />
                  Any domain
                </p>
                <p>
                  Thoughtful type, useful details, systems that hold up. We bring the same care to studios, clinics, makers and brands. Club sport is our speciality, not our limit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
