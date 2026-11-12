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
        Additional client, university and open-source work, with NDA-bound
        projects kept high-level.
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
                  {project.shots && (
                    <ul className="index__shots">
                      {project.shots.map((shot) => (
                        <li className="index__shot" key={shot.src}>
                          <img
                            src={shot.src}
                            srcSet={shot.srcSet}
                            sizes={shot.sizes}
                            alt={shot.alt}
                            width={shot.width}
                            height={shot.height}
                            loading="lazy"
                            decoding="async"
                          />
                          {shot.caption && (
                            <span className="index__shot-caption">
                              {shot.caption}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  {project.link && (
                    <a
                      className="index__project-link"
                      href={project.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.link.label}
                    </a>
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
