import { Colophon } from "../components/Colophon";
import {
  CV_URL,
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  POSITIONING,
} from "../content";

type ContactProps = {
  hasCv: boolean;
};

export function Contact({ hasCv }: ContactProps) {
  return (
    <section className="band band--contact" id="contact">
      <div className="band__inner">
        <header className="band__head">
          <h2 className="band__title">Contact</h2>
        </header>

        <p className="contact__status">
          {POSITIONING} Email is the quickest way to reach me.
        </p>

        <a className="contact__mail" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>

        <div className="contact__links">
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
        </div>

        <p className="contact__place">
          Yarra Valley, Victoria. I am happy to walk through any of the work
          above.
        </p>

        <Colophon />
      </div>
    </section>
  );
}
