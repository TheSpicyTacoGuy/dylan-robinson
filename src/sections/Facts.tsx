import { CV_URL, EMAIL, GITHUB_URL, LINKEDIN_URL, facts } from "../content";

type FactsProps = {
  hasCv: boolean;
};

/**
 * The recruiter panel. It sits directly under the hero, holds no prose, and
 * exists so nobody has to read a case study to learn the essentials. Every
 * value comes from content.ts, so the page and the resume cannot drift.
 */
export function Facts({ hasCv }: FactsProps) {
  return (
    <section className="band band--bone facts" id="facts" aria-labelledby="facts-title">
      <div className="band__inner">
        <div className="facts__head">
          <h2 className="facts__title" id="facts-title">
            Available now, full time, Melbourne or remote.
          </h2>
        </div>

        <dl className="facts__list">
          {facts
            .filter((fact) => fact.label !== "Availability")
            .map((fact) => (
              <div className="facts__row" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
        </dl>

        <div className="facts__actions">
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
            Email
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
          <a className="action facts__resume" href="/resume/">
            Resume as a page
          </a>
        </div>
      </div>
    </section>
  );
}
