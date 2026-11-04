import { CV_URL, EMAIL, LINKEDIN_URL } from "../content";

type ContactProps = {
  hasCv: boolean;
};

export function Contact({ hasCv }: ContactProps) {
  return (
    <section className="section contact" id="contact">
      <h2 className="section__label">Contact</h2>

      <p className="contact__text">
        I am looking for a software development role. Email is the quickest way
        to reach me.
      </p>

      <a className="contact__mail" href={`mailto:${EMAIL}`}>
        {EMAIL}
      </a>

      <p className="contact__meta">
        Or find me on{" "}
        <a
          className="contact__link"
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        {hasCv ? (
          <>
            {" "}
            or download my{" "}
            <a
              className="contact__link"
              href={CV_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              CV (PDF)
            </a>
          </>
        ) : null}
        .
      </p>
    </section>
  );
}
