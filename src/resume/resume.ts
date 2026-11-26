/**
 * The CV, drawn as plain DOM so it needs no framework and prints cleanly.
 * The document itself is built in ./model, which the DOCX build reads too, so
 * the page and the Word file cannot disagree about a role, a year or a stack.
 */
import { type ResumeEntry, type ResumeSection, resume } from "./model";
import "./resume.css";

const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

/**
 * Screen only. The CV is a page of its own with no site chrome, so it carries
 * its own way back and its own way onto paper.
 */
const actions = () => {
  const bar = el("div", "cv-actions");

  const back = el("a", "cv-actions__back", "Back to the portfolio");
  back.href = "/";

  const group = el("div", "cv-actions__group");

  const download = el("a", "cv-actions__download", "Download PDF");
  download.href = "/cv/dylan-robinson-resume.pdf";
  download.download = "";

  const print = el("button", "cv-actions__print", "Print or save as PDF");
  print.type = "button";
  print.addEventListener("click", () => window.print());

  group.append(download, print);
  bar.append(back, group);
  return bar;
};

const banner = () => {
  const header = el("header", "cv-banner");
  const identity = el("div", "cv-banner__text");

  identity.append(
    el("h1", "cv-banner__name", resume.name),
    el("p", "cv-banner__role", resume.role),
  );

  const contact = el("p", "cv-banner__contact");
  resume.contact.forEach((item, index) => {
    const chunk = el("span", "cv-banner__item");
    if (item.href) {
      const link = el("a", undefined, item.label);
      link.href = item.href;
      chunk.append(link);
    } else {
      chunk.append(el("span", undefined, item.label));
    }
    if (index < resume.contact.length - 1) {
      chunk.append(el("span", "cv-banner__sep", "·"));
      contact.append(chunk, document.createTextNode(" "));
      return;
    }
    contact.append(chunk);
  });
  identity.append(contact);

  const portrait = el("img", "cv-banner__portrait");
  portrait.src = resume.portrait.src;
  portrait.width = resume.portrait.width;
  portrait.height = resume.portrait.height;
  portrait.alt = "";

  header.append(identity, portrait);
  return header;
};

const entry = (item: ResumeEntry) => {
  const row = el("article", "cv-entry");
  const body = el("div", "cv-entry__body");
  const title = el("h3", "cv-entry__title");

  if (item.titleLink) {
    const link = el("a", undefined, item.titleLink.label);
    link.href = item.titleLink.href;
    title.append(
      link,
      document.createTextNode(item.title.slice(item.titleLink.label.length)),
    );
  } else {
    title.textContent = item.title;
  }
  body.append(title);

  for (const text of item.paragraphs ?? []) {
    body.append(el("p", "cv-entry__prose", text));
  }

  if (item.points?.length) {
    const list = el("ul", "cv-entry__points");
    for (const point of item.points) list.append(el("li", undefined, point));
    body.append(list);
  }

  if (item.note) body.append(el("p", "cv-entry__note", item.note));

  if (item.skills) {
    const skills = el("p", "cv-entry__skills");
    skills.append(
      el("span", "cv-entry__skills-label", "Skills ·"),
      el("span", "cv-entry__skills-value", item.skills),
    );
    body.append(skills);
  }

  row.append(el("p", "cv-entry__when", item.when), body);
  return row;
};

const section = (item: ResumeSection) => {
  const node = el("section", "cv-section");
  node.append(el("h2", "cv-section__heading", item.heading));

  if (item.kind === "prose") {
    for (const text of item.paragraphs) {
      node.append(el("p", "cv-section__prose", text));
    }
    return node;
  }

  if (item.kind === "skills") {
    node.append(el("p", "cv-section__prose", item.items.join(" · ")));
    return node;
  }

  for (const row of item.entries) node.append(entry(row));
  return node;
};

const root = document.getElementById("resume");
if (root) {
  root.before(actions());
  root.append(banner(), ...resume.sections.map(section));
}
