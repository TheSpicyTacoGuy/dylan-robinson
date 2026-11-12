import { CV_URL, EMAIL, LOCATION } from "../content";

type HeroProps = {
  hasCv: boolean;
};

export function Hero({ hasCv }: HeroProps) {
  return (
    <section className="band band--bark hero" id="intro">
      <div className="band__inner hero__inner">
        <div className="hero__copy">
          <h1 className="hero__name">Dylan Robinson</h1>
          <p className="hero__location">{LOCATION}</p>

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
          </div>

          <a className="hero__email" href={`mailto:${EMAIL}`}>
            Email me
          </a>
        </div>

        <figure className="hero__portrait">
          <img
            src="/portrait-tall-800.webp"
            srcSet="/portrait-tall-800.webp 800w, /portrait-tall-1200.webp 1200w"
            sizes="(min-width: 760px) 28rem, 100vw"
            alt="Dylan Robinson in the Yarra Valley."
            width={800}
            height={1000}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </figure>
      </div>
    </section>
  );
}
