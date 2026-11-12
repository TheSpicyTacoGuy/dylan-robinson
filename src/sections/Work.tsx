import { Plates } from "../components/Plates";
import { ProjectIndex } from "../components/ProjectIndex";
import { caseStudies, otherProjects } from "../content";

export function Work() {
  return (
    <section className="band band--bone" id="work">
      <div className="band__inner">
        <header className="band__head">
          <h2 className="band__title">Work</h2>
          <p className="band__note">
            Two detailed case studies, plus selected client, university and
            open-source work.
          </p>
        </header>

        {caseStudies.map((study) => (
          <article className="case" key={study.id}>
            <div className="case__spec">
              <dl>
                <div>
                  <dt>Year</dt>
                  <dd>{study.when}</dd>
                </div>
                <div>
                  <dt>Role</dt>
                  <dd>{study.role}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{study.status}</dd>
                </div>
                {study.stack && (
                  <div>
                    <dt>Stack</dt>
                    <dd>{study.stack.join(", ")}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="case__body">
              <h3 className="case__title">{study.title}</h3>
              <p className="case__text">{study.summary}</p>

              <ul className="case__facts">
                {study.facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>

              {study.link && (
                <a
                  className="action case__link"
                  href={study.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {study.link.label}
                </a>
              )}

              {study.id === "ctrl" && (
                <p className="case__note">
                  The repository is private. I can walk through the code in an
                  interview.
                </p>
              )}
            </div>

            {study.clip && (
              <div className="case__clip">
                <figure>
                  <video
                    className="case__video"
                    controls
                    muted
                    playsInline
                    preload="none"
                    poster={study.clip.poster}
                    width={study.clip.width}
                    height={study.clip.height}
                    aria-label={study.clip.label}
                  >
                    <source src={study.clip.src} type="video/mp4" />
                    This recording cannot be played in your browser.
                  </video>
                  <figcaption className="plate__caption">
                    {study.clip.caption}
                  </figcaption>
                </figure>
              </div>
            )}

            <Plates label={study.title} plates={study.plates} />
          </article>
        ))}

        <ProjectIndex projects={otherProjects} />
      </div>
    </section>
  );
}
