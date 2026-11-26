import {
  CV_URL,
  GITHUB_URL,
  LINKEDIN_URL,
  MAILTO,
  roles,
  study,
  toolGroups,
} from "../content";

type ExperienceProps = {
  hasCv: boolean;
};

export function Experience({ hasCv }: ExperienceProps) {
  return (
    <>
      <div className="wrap page-head">
        <h1>Experience</h1>
        <p>
          Software developer in the Yarra Valley. I lead the web side at CTRL
          Accounting and build the systems around it.
        </p>
      </div>

      <section className="section" aria-labelledby="roles-title">
        <div className="wrap">
          <h2 id="roles-title">Roles</h2>
          <ol className="roles">
            {roles.map((role) => (
              <li className="roles__item" key={role.id}>
                <p className="roles__when">{role.when}</p>
                <h3 className="roles__company">{role.company}</h3>
                <p className="roles__detail">{role.title}</p>
                <p className="roles__place">
                  {role.place}
                  {role.note ? ` (${role.note})` : ""}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="study-title">
        <div className="wrap">
          <h2 id="study-title">Study</h2>
          <ul className="study">
            {study.map((item) => (
              <li className="study__item" key={item.title}>
                <p className="study__when">{item.when}</p>
                <p className="study__title">{item.title}</p>
                <p className="study__place">
                  {item.place}
                  {item.note ? ` (${item.note})` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="tools-title">
        <div className="wrap">
          <h2 id="tools-title">Tools</h2>
          <dl className="tools">
            {toolGroups.map((group) => (
              <div className="tools__row" key={group.label}>
                <dt className="tools__label">{group.label}</dt>
                <dd className="tools__items">{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section" aria-labelledby="background-title">
        <div className="wrap">
          <h2 id="background-title">Background</h2>
          <div className="prose">
            <p>
              I work on whatever part of a system is causing trouble: the
              database, the front end, or the person on the phone explaining what
              went wrong. I use AI assistants, specialist agents and MCP tools to
              speed up implementation and debugging, with automated tests and
              security checks kept in the workflow.
            </p>
            <p>
              I came up through a computer repair shop: eight years at
              Technology2You IT Services in Woori Yallock, on the bench, in the
              shop, then building the websites. After that I stacked timber at
              the Powelltown sawmill, and since 2023 I have led the web side at
              CTRL Accounting.
            </p>
          </div>

          <div className="page-links">
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
            <a className="link-quiet" href={MAILTO}>
              Email
            </a>
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
          </div>
        </div>
      </section>
    </>
  );
}
