/**
 * The resume, rendered as plain DOM so it needs no framework and prints
 * cleanly. It reads the same content module as the portfolio, so the two cannot
 * disagree about a role, a year or a stack.
 */
import {
  type Project,
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  LOCATION,
  POSITIONING,
  SITE_URL,
  WORK_RIGHTS,
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

/**
 * The CV has to fit on pages a recruiter will actually read. Case studies keep
 * their detail; five projects get a line each; anything older is named once in
 * a closing sentence, because the portfolio carries the full list.
 */
const featuredTitles = [
  "SmartCity Dashboard",
  "GrowSpace, greenhouse and plant app",
  "Makofire website",
];

const featuredProjects = featuredTitles
  .map((title) => otherProjects.find((project) => project.title === title))
  .filter((project): project is Project => Boolean(project));

const restProjects = otherProjects.filter(
  (project) => !featuredTitles.includes(project.title),
);

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
      <li>
        <a href="${escape(SITE_URL)}">${escape(
          SITE_URL.replace(/^https?:\/\//, ""),
        )}</a>
      </li>
      <li>Phone on request</li>
    </ul>
  </header>

  <p class="summary">${escape(POSITIONING)} ${escape(WORK_RIGHTS)}.</p>

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
             .slice(0, 2)
             .map((fact) => `<li>${escape(fact)}</li>`)
             .join("")}</ul>`,
        ),
      )
      .join("")}
    ${featuredProjects
      .map((project) =>
        entry(
          project.when,
          project.title,
          `${project.role}${project.tech ? ` · ${project.tech}` : ""}`,
        ),
      )
      .join("")}
    <p class="body">
      <strong>Also:</strong>
      ${restProjects.map((project) => escape(project.title)).join(" · ")}.
    </p>
  </section>

  <section>
    <h2>Education</h2>
    ${study
      .filter((item) => !item.title.startsWith("VCE"))
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
`;

const root = document.getElementById("resume");
if (root) root.innerHTML = html;
