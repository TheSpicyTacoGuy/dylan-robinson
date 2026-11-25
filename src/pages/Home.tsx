import {
  AVAILABILITY,
  CV_URL,
  LOCATION,
  MAILTO,
  WORK_RIGHTS,
} from "../content";
import { Contributions } from "../components/Contributions";
import { handleLinkClick } from "../lib/router";
import type { CSSProperties } from "react";

type HomeProps = {
  hasCv: boolean;
};

const rise = (step: number) => ({ "--rise": step }) as CSSProperties;

export function Home({ hasCv }: HomeProps) {
  return (
    <section className="hero" aria-labelledby="hero-name">
      <div className="wrap hero__grid">
        <h1 className="hero__name" id="hero-name">
          <span className="hero__line">
            <span style={rise(0)}>Dylan</span>
          </span>
          <span className="hero__line">
            <span style={rise(1)}>Robinson</span>
          </span>
        </h1>

        <figure className="hero__portrait rise" style={rise(2)}>
          <picture>
            <source
              media="(max-width: 680px)"
              srcSet="/portrait-wide-1200.webp 1200w, /portrait-wide-2000.webp 2000w"
              sizes="100vw"
            />
            <img
              src="/portrait-tall-800.webp"
              srcSet="/portrait-tall-800.webp 800w, /portrait-tall-1200.webp 1200w"
              sizes="(min-width: 681px) 22rem, 100vw"
              alt="Dylan Robinson in the Yarra Valley."
              width={800}
              height={1000}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <figcaption>Me, Yarra Valley, 2026.</figcaption>
        </figure>

        <p className="hero__lede rise" style={rise(3)}>
          I build the online tax return app at CTRL Accounting, where I am lead
          developer and a director.
        </p>

        <div className="hero__actions rise" style={rise(4)}>
          <a
            className="action action--solid"
            href="/work"
            onClick={handleLinkClick}
            data-route
          >
            See the work
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
          <a className="link-quiet" href={MAILTO}>
            Email me
          </a>
        </div>

        <dl className="hero__facts rise" style={rise(5)}>
          <div>
            <dt>Role</dt>
            <dd>Software developer</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{LOCATION}</dd>
          </div>
          <div>
            <dt>Availability</dt>
            <dd className="hero__available">{AVAILABILITY}</dd>
          </div>
          <div>
            <dt>Work rights</dt>
            <dd>{WORK_RIGHTS}</dd>
          </div>
        </dl>

        <Contributions />
      </div>
    </section>
  );
}
