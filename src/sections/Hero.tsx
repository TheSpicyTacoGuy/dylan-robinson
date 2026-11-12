import { Log } from "../components/Log";
import { CV_URL, EMAIL, LOCATION } from "../content";

type HeroProps = {
  hasCv: boolean;
};

export function Hero({ hasCv }: HeroProps) {
  return (
    <section className="band band--bark hero" id="intro">
      <div className="band__inner hero__inner">
        <div className="hero__copy">
          <p className="hero__where">{LOCATION}</p>

          <h1 className="hero__name">Dylan Robinson</h1>

          <p className="hero__lede">
            I build the online tax return app at CTRL Accounting, where I am
            lead developer and a director.
          </p>

          <div className="hero__actions">
            <a className="action action--solid" href="#work">
              See selected work
            </a>
            {hasCv && (
              <a
                className="action"
                href={CV_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download CV
              </a>
            )}
            <a className="action" href={`mailto:${EMAIL}`}>
              Email me
            </a>
          </div>
        </div>

        <div className="hero__log">
          <Log />
        </div>
      </div>
    </section>
  );
}
