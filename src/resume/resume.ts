/**
 * The resume, rendered as plain DOM so it needs no framework and prints
 * cleanly. It reads the same content module as the portfolio, so the two cannot
 * disagree about a role, a year or a stack.
 */
import {
  CV_URL,
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  LOCATION,
  POSITIONING,
  caseStudies,
  otherProjects,
  roles,
  study,
  toolGroups,
} from "../content";
import "./resume.css";

const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );

const stack = toolGroups.flatMap((group) => group.items).join(", ");

const entry = (when: string, title: string, where: string, extra = "") => `
  <article class="entry">
    <p class="when">${escape(when)}</p>
    <div>
      <h3>${escape(title)}</h3>
      <p class="where">${escape(where)}</p>
      ${extra}
    </div>
  </article>`;

const html = `
  <header class="sheet__head">
    <div>
      <h1>Dylan Robinson</h1>
      <p class="role">Software developer</p>
    </div>
    <ul class="contact">
      <li><a href="mailto:${escape(EMAIL)}">${escape(EMAIL)}</a></li>
      <li>${escape(LOCATION)}</li>
      <li><a href="${escape(LINKEDIN_URL)}">LinkedIn</a></li>
      <li><a href="${escape(GITHUB_URL)}">GitHub</a></li>
    </ul>
  </header>

  <p class="summary">${escape(POSITIONING)}</p>

  <section>
    <h2>Experience</h2>
    ${roles
      .map((role) =>
        entry(
          role.when,
          role.title,
          `${role.company}, ${role.place}${role.note ? ` (${role.note})` : ""}`,
        ),
      )
      .join("")}
  </section>

  <section>
    <h2>Selected work</h2>
    ${caseStudies
      .map((project) =>
        entry(
          project.when,
          project.title,
          `${project.role}${
            project.stack ? ` · ${project.stack.join(", ")}` : ""
          }`,
          `<p class="body">${escape(project.summary)}</p>
           <ul class="points">${project.facts
             .slice(0, 3)
             .map((fact) => `<li>${escape(fact)}</li>`)
             .join("")}</ul>`,
        ),
      )
      .join("")}
    ${otherProjects
      .map((project) =>
        entry(
          project.when,
          project.title,
          project.role,
          `<p class="body">${escape(project.summary)}</p>
            ${project.tech ? `<p class="tech">${escape(project.tech)}</p>` : ""}
            ${project.link ? `<p class="tech"><a href="${escape(project.link.href)}" target="_blank" rel="noopener noreferrer">${escape(project.link.label)}</a></p>` : ""}`,
        ),
      )
      .join("")}
  </section>

  <section>
    <h2>Education</h2>
    ${study
      .map((item) =>
        entry(
          item.when,
          item.title,
          `${item.place}${item.note ? ` · ${item.note}` : ""}`,
        ),
      )
      .join("")}
  </section>

  <section>
    <h2>Tools</h2>
    <p class="body">${escape(stack)}.</p>
  </section>

  <footer class="sheet__foot">
    <p>PDF copy: <a href="${escape(CV_URL)}">${escape(CV_URL)}</a></p>
    <p><a href="/">Back to the portfolio</a></p>
  </footer>
`;

const root = document.getElementById("resume");
if (root) root.innerHTML = html;
