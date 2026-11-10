import { useState } from "react";
import type { Project } from "../content";

type ProjectIndexProps = {
  projects: Project[];
};

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function ProjectIndex({ projects }: ProjectIndexProps) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="index" aria-labelledby="also-built">
      <h3 className="index__title" id="also-built">
        Also built
      </h3>
      <p className="index__intro">
        Client and capstone work, some of it under NDA, so the detail here is
        the outline.
      </p>

      <ul className="index__list">
        {projects.map((project) => {
          const id = slug(project.title);
          const isOpen = open === project.title;

          return (
            <li
              className={isOpen ? "index__row is-open" : "index__row"}
              key={project.title}
            >
              <button
                type="button"
                className="index__button"
                aria-expanded={isOpen}
                aria-controls={`panel-${id}`}
                onClick={() => setOpen(isOpen ? null : project.title)}
              >
                <span className="index__when">{project.when}</span>
                <span className="index__name">{project.title}</span>
                <span className="index__role">{project.role}</span>
                <span className="index__toggle" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              <div
                className="index__panel"
                id={`panel-${id}`}
                role="region"
                aria-label={project.title}
                inert={!isOpen}
              >
                <div>
                  <p>{project.summary}</p>
                  {project.tech && (
                    <p className="index__tech">{project.tech}</p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
