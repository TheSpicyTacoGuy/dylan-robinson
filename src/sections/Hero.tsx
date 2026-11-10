import { Log } from "../components/Log";
import { CV_URL, EMAIL, GITHUB_URL, LINKEDIN_URL, LOCATION } from "../content";

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
            {hasCv && (
              <a
                className="action action--solid"
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
            <a
              className="action"
              href={LINKEDIN_URL}
              target="_blank"
              rel="me noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="action"
              href={GITHUB_URL}
              target="_blank"
              rel="me noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="hero__log">
          <Log />
          <p className="hero__log-note">
            Drag to turn it. Yes, it is a log slice.
          </p>
        </div>
      </div>
    </section>
  );
}
