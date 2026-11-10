import { RingField } from "../components/RingField";
import { CV_URL, EMAIL, GITHUB_URL, LINKEDIN_URL } from "../content";

type HeroProps = {
  hasCv: boolean;
};

export function Hero({ hasCv }: HeroProps) {
  return (
    <section className="band band--bark hero" id="intro">
      <div className="ring-field" data-parallax="54">
        <RingField />
      </div>

      <div className="band__inner hero__inner">
        <div className="hero__copy">
          <h1 className="hero__name">Dylan Robinson</h1>

          <p className="hero__lede">
            I build the online tax return app at CTRL Accounting, where I am
            lead developer and a director. It is being prepared for launch.
          </p>

          <p className="hero__body">
            Before that, eight years fixing PCs and building WordPress sites in
            the Yarra Valley. Then the sawmill, their Access databases, and a
            new inventory system for Smokemaster. I finished a computer science
            degree at Swinburne in 2026.
          </p>

          <div className="hero__actions">
            <a className="action action--solid" href={`mailto:${EMAIL}`}>
              Email me
            </a>
            {hasCv && (
              <a
                className="action"
                href={CV_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                CV (PDF)
              </a>
            )}
            <a
              className="action"
              href={GITHUB_URL}
              target="_blank"
              rel="me noopener noreferrer"
            >
              GitHub
            </a>
            <a
              className="action"
              href={LINKEDIN_URL}
              target="_blank"
              rel="me noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <dl className="hero__meta">
          <div>
            <dt>Based</dt>
            <dd>Yarra Valley, Victoria</dd>
          </div>
          <div>
            <dt>Now</dt>
            <dd>Lead developer and director, CTRL Accounting</dd>
          </div>
          <div>
            <dt>Looking for</dt>
            <dd>Full time software development or related roles</dd>
          </div>
        </dl>      </div>

      <figure className="hero__portrait" data-parallax="-30">
        <div className="hero__portrait-frame">
          <picture>
            <source
              media="(max-width: 900px)"
              srcSet="/portrait-tall-800.webp 800w, /portrait-tall-1200.webp 1200w"
              sizes="100vw"
            />
            <img
              src="/portrait-wide-2000.webp"
              srcSet="/portrait-wide-1200.webp 1200w, /portrait-wide-2000.webp 2000w"
              sizes="(min-width: 900px) calc(100vw - 5.5rem), 100vw"
              alt="Dylan Robinson in the Yarra Valley."
              width={2000}
              height={909}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>
        <figcaption className="hero__caption">
          <span>Yarra Valley, Victoria</span>
        </figcaption>
      </figure>
    </section>
  );
}
