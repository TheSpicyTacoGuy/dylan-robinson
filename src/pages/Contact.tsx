import {
  AVAILABILITY,
  CV_URL,
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  LOCATION,
  MAILTO,
  POSITIONING,
  WORK_RIGHTS,
} from "../content";

type ContactProps = {
  hasCv: boolean;
};

export function Contact({ hasCv }: ContactProps) {
  return (
    <>
      <div className="wrap page-head">
        <h1>Contact</h1>
        <p>
          {POSITIONING} Email is the quickest way to reach me.
        </p>
      </div>

      <section className="section" aria-label="Contact details">
        <div className="wrap">
          <a className="contact__mail" href={MAILTO} id="contact-mail">
            {EMAIL}
          </a>

          <div className="contact__links">
            <a
              className="link-quiet"
              href={LINKEDIN_URL}
              target="_blank"
              rel="me noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="link-quiet"
              href={GITHUB_URL}
              target="_blank"
              rel="me noopener noreferrer"
            >
              GitHub
            </a>
            <a className="link-quiet" href="/resume/">
              Resume as a page
            </a>
            {hasCv && (
              <a
                className="link-quiet"
                href={CV_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                CV as a PDF
              </a>
            )}
          </div>

          <dl className="record contact__record">
            <div>
              <dt>Based</dt>
              <dd>{LOCATION}</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd className="contact__available">{AVAILABILITY}</dd>
            </div>
            <div>
              <dt>Work rights</dt>
              <dd>{WORK_RIGHTS}</dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
