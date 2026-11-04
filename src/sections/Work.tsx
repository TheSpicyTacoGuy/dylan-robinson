import { motion, useReducedMotion } from "framer-motion";
import { Shots } from "../components/Shots";
import { otherProjects, projects } from "../content";
import { easing } from "../motion";

export function Work() {
  const reduceMotion = useReducedMotion();
  const featured = projects[0];

  return (
    <section className="section" id="work">
      <h2 className="section__label">Work</h2>

      <article className="case">
        <p className="case__meta">{featured.when}</p>
        <h3 className="case__title">{featured.title}</h3>
        <p className="case__role">{featured.role}</p>
        <p className="case__text">{featured.summary}</p>

        {featured.facts && (
          <ul className="case__facts">
            {featured.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        )}

        <Shots />
      </article>

      <p className="work__more">Other work</p>

      <div className="entries">
        {otherProjects.map((project) => (
          <article className="entry" key={project.title}>
            <p className="entry__when">{project.when}</p>
            <div className="entry__body">
              <motion.span
                className="entry__rule"
                aria-hidden="true"
                initial={reduceMotion ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.9, ease: easing }}
              />
              <h3 className="entry__title">{project.title}</h3>
              <p className="entry__role">{project.role}</p>
              <p className="entry__text">{project.summary}</p>
              {project.tech && <p className="entry__tech">{project.tech}</p>}
            </div>
          </article>
        ))}
      </div>

      <p className="tools-line">
        <strong>Tools</strong> TypeScript, Vue 3, React, Node.js, JavaScript,
        PHP, Python, PostgreSQL, SQL, Docker, HTML and CSS, plus WordPress,
        Microsoft Access and eight years of PC repair.
      </p>
    </section>
  );
}
