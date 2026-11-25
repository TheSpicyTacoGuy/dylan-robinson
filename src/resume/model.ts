/**
 * The CV as one plain document tree. Both renderers read it: the printable page
 * draws it in the browser, and `scripts/make-resume-docx.py` asks Node for the
 * same object as JSON. A fact, a date or a job title is therefore never written
 * twice, and the PDF and the DOCX cannot drift apart.
 */
import {
  type CaseStudy,
  type Project,
  type Role,
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  LOCATION,
  PROFILE,
  SITE_URL,
  caseStudies,
  otherProjects,
  roles,
  skillList,
  study,
} from "../content";

export type ResumeEntry = {
  when: string;
  title: string;
  points?: string[];
  paragraphs?: string[];
  note?: string;
  skills?: string;
};

export type ResumeSection =
  | { kind: "prose"; heading: string; paragraphs: string[] }
  | {
      kind: "entries";
      heading: string;
      layout: "bullets" | "paragraphs";
      entries: ResumeEntry[];
    }
  | { kind: "skills"; heading: string; items: string[] };

export type Resume = {
  name: string;
  role: string;
  contact: { label: string; href?: string }[];
  portrait: { src: string; width: number; height: number };
  sections: ResumeSection[];
};

/** An address a reader can type, without the parts a browser strips. */
const readable = (url: string) =>
  url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

/** "2023 to now" reads as "2023 – Present" in print. */
const dates = (when: string) =>
  when.replace(/ to now$/, " – Present").replace(/ to /, " – ");

const isCaseStudy = (item: CaseStudy | Project): item is CaseStudy =>
  Array.isArray((item as CaseStudy).stack);

/** Newest first, and only the projects worth a paragraph on two pages. */
const projectOrder = [
  "School lesson planner",
  "PackScanner",
  "Four Seasons Horse Rugs",
  "SmartCity Dashboard",
  "Light sensor monitor",
];

const allProjects: (CaseStudy | Project)[] = [...caseStudies, ...otherProjects];

const projectEntry = (project: CaseStudy | Project): ResumeEntry => {
  const url = project.link ? readable(project.link.href) : "";
  const stack = isCaseStudy(project)
    ? (project.stack ?? []).join(", ")
    : (project.tech ?? "");

  return {
    when: dates(project.when),
    title: url ? `${project.title}, ${url}` : project.title,
    paragraphs: [
      project.summary,
      ...(isCaseStudy(project) ? project.facts.slice(0, 1) : []),
    ],
    skills: stack || undefined,
  };
};

const roleEntry = (role: Role): ResumeEntry => ({
  when: dates(role.when),
  title: `${role.title}, ${role.company}`,
  points: role.points,
  skills: role.skills,
});

const paidRoles = roles.filter((role) => !role.volunteer);
const volunteerRoles = roles
  .filter((role) => role.volunteer)
  .sort((a, b) => b.start - a.start);

export const resume: Resume = {
  name: "Dylan Robinson",
  role: "Software developer",
  contact: [
    { label: EMAIL, href: `mailto:${EMAIL}` },
    { label: "Phone on request" },
    { label: LOCATION },
    { label: readable(SITE_URL), href: SITE_URL },
    { label: readable(LINKEDIN_URL), href: LINKEDIN_URL },
    { label: readable(GITHUB_URL), href: GITHUB_URL },
  ],
  portrait: { src: "/cv/portrait.jpg", width: 600, height: 800 },
  sections: [
    { kind: "prose", heading: "Profile", paragraphs: [PROFILE] },
    {
      kind: "entries",
      heading: "Experience",
      layout: "bullets",
      entries: paidRoles.map(roleEntry),
    },
    {
      kind: "entries",
      heading: "Volunteering",
      layout: "bullets",
      entries: volunteerRoles.map(roleEntry),
    },
    {
      kind: "entries",
      heading: "Projects",
      layout: "paragraphs",
      entries: projectOrder
        .map((title) => allProjects.find((item) => item.title === title))
        .filter((item): item is CaseStudy | Project => Boolean(item))
        .map(projectEntry),
    },
    {
      kind: "entries",
      heading: "Education",
      layout: "paragraphs",
      entries: study
        .filter((item) => !item.title.startsWith("VCE"))
        .map((item) => ({
          when: dates(item.when),
          title: `${item.title}, ${item.place}`,
          note: item.note,
        })),
    },
    { kind: "skills", heading: "Skills", items: skillList },
  ],
};
