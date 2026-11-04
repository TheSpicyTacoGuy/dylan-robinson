import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "./theme";

const LINKEDIN_URL = "https://www.linkedin.com/in/dylan-robinson-415171184/";
const GITHUB_URL = "https://github.com/TheSpicyTacoGuy";
const EMAIL = "drskyrim1@gmail.com";
const CV_URL = "/cv/Dylan Robinson Resume.pdf";

const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sections = [
  { id: "intro", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "history", label: "History" },
  { id: "study", label: "Study" },
  { id: "contact", label: "Contact" },
];

const sectionIds = sections.map((section) => section.id);

function useActiveSection() {
  const [active, setActive] = useState(sectionIds[0]);

  useEffect(() => {
    const measure = () => {
      const line = window.scrollY + window.innerHeight * 0.35;
      let current = sectionIds[0];

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) return;
        const top = element.getBoundingClientRect().top + window.scrollY;
        if (top <= line) current = id;
      });

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;

      setActive(atBottom ? sectionIds[sectionIds.length - 1] : current);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return active;
}

type Project = {
  title: string;
  when: string;
  role: string;
  summary: string;
  tech?: string;
  facts?: string[];
};

const projects: Project[] = [
  {
    title: "Online tax return app",
    when: "2023 to now",
    role: "CTRL Accounting, lead web developer and director",
    summary:
      "Clients answer plain-English questions and pay for their return. A registered tax agent then reviews it in a separate workspace and lodges it with the ATO. It is being prepared for launch.",
    facts: [
      "Return contents are encrypted in the browser, so only the assigned tax agent can open them.",
      "Keycloak sign-in with passkeys, or a password plus an authenticator code.",
      "Stripe Checkout for fees and Stripe Identity for ID checks.",
      "Support requests, notifications, and an audit and diagnostics screen for staff.",
      "I hold a 20% share as a director, so I have a say in where the product goes.",
    ],
  },
];

const otherProjects: Project[] = [
  {
    title: "SmartCity Dashboard",
    when: "2025 to 2026",
    role: "Swinburne capstone for an industry client, team of five",
    summary:
      "A dashboard that watches IoT devices and flags anything unusual. It takes data over MQTT, CoAP, Modbus, Zigbee and LoRaWAN, and an Isolation Forest model flagged about 4.8% of records on the public TON_IoT dataset.",
    tech: "Vue 3, Node.js, PostgreSQL, Python, Docker, Azure DevOps, AWS EC2",
  },
  {
    title: "Dressage scoring and results portal",
    when: "2018 to 2019",
    role: "EquiScore Dressage Scoring, lead developer (not a paid role)",
    summary:
      "Scorers entered results and the portal published them while the competition was still running. I built the scoring screens and the public results viewer, with a small amount of Angular on the front end.",
    tech: "HTML, CSS, PHP, JavaScript, Ajax, Angular",
  },
  {
    title: "Access database rebuild",
    when: "2023 to 2025",
    role: "Powelltown Sawmills",
    summary:
      "The sawmill tracked jobs and stock in a Microsoft Access database and a data entry portal. I rebuilt parts of both, added site-to-site stock transfer support, and kept the old system running while I did it.",
    tech: "Microsoft Access, SQL",
  },
];

type Role = {
  company: string;
  title: string;
  place: string;
  when: string;
  note?: string;
};

const roles: Role[] = [
  {
    company: "CTRL Accounting",
    title: "Lead web developer and director",
    place: "Melbourne, remote",
    when: "2023 to now",
  },
  {
    company: "Powelltown Sawmills",
    title: "Sawmill stacker",
    place: "Powelltown",
    when: "2023 to 2025",
  },
  {
    company: "Technology2You IT Services",
    title: "IT technician, shop manager, web developer",
    place: "Woori Yallock",
    when: "2014 to 2022",
  },
  {
    company: "EquiScore Dressage Scoring",
    title: "Lead developer",
    place: "Woori Yallock",
    when: "2018 to 2019",
    note: "not officially employed",
  },
  {
    company: "Polktronics",
    title: "Auto electrical assistant",
    place: "Woori Yallock",
    when: "2018 to 2019",
    note: "not officially employed",
  },
];

type Study = {
  title: string;
  place: string;
  when: string;
  note?: string;
};

const study: Study[] = [
  {
    title: "Bachelor of Computer Science (Software Development)",
    place: "Swinburne University of Technology, Hawthorn",
    when: "Mar 2024 to May 2026",
    note: "GPA above 3.5/4.0",
  },
  {
    title: "Diploma of Information Technology",
    place: "Swinburne University (UniLink)",
    when: "2017",
    note: "5 HDs and 4 Ds, GPA above 3.6/4.0",
  },
  {
    title: "VCE, Year 12",
    place: "Upper Yarra Secondary College",
    when: "2016",
  },
];

type Shot = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  wide?: boolean;
};

const shots: Shot[] = [
  {
    src: "/shots/landing.jpg",
    alt: "CTRL landing page headed Take control of your tax return.",
    caption: "Landing page",
    width: 1600,
    height: 890,
    wide: true,
  },
  {
    src: "/shots/dashboard.jpg",
    alt: "Client dashboard listing refunds, returns lodged and returns in progress.",
    caption: "Client dashboard",
    width: 1600,
    height: 812,
  },
  {
    src: "/shots/return.jpg",
    alt: "Admin dashboard showing a tax return with a list of questions and answers.",
    caption: "Admin dashboard",
    width: 1600,
    height: 813,
  },
];

function Shots() {
  const [missing, setMissing] = useState<string[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const hasOpened = useRef(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], [18, -18]);

  const visible = shots.filter((shot) => !missing.includes(shot.src));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (openIndex === null) {
      if (dialog.open) dialog.close();
      if (hasOpened.current) triggerRef.current?.focus();
      return;
    }

    hasOpened.current = true;
    if (!dialog.open) dialog.showModal();
  }, [openIndex]);

  if (visible.length === 0) return null;

  const active = openIndex === null ? null : visible[openIndex];

  const step = (direction: number) => {
    setOpenIndex((current) => {
      if (current === null) return current;
      return (current + direction + visible.length) % visible.length;
    });
  };

  return (
    <>
      <figure className="shots">
        <div className="shots__grid" ref={gridRef}>
          {visible.map((shot, index) => (
            <motion.div
              className={shot.wide ? "shot shot--wide" : "shot"}
              key={shot.src}
              style={reduceMotion || !shot.wide ? undefined : { y: drift }}
            >
              <button
                type="button"
                className="shot__button"
                onClick={(event) => {
                  triggerRef.current = event.currentTarget;
                  setOpenIndex(index);
                }}
                aria-label={`Open ${shot.caption} at full size`}
              >
                <img
                  src={shot.src}
                  alt={shot.alt}
                  width={shot.width}
                  height={shot.height}
                  loading="lazy"
                  decoding="async"
                  onError={() =>
                    setMissing((current) =>
                      current.includes(shot.src)
                        ? current
                        : [...current, shot.src],
                    )
                  }
                />
              </button>
              <p className="shot__caption">{shot.caption}</p>
            </motion.div>
          ))}
        </div>
        <figcaption className="shots__note">
          CTRL tax return app, using test data. Open a screen for the full size.
        </figcaption>
      </figure>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Screenshot viewer"
        onClose={() => setOpenIndex(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpenIndex(null);
        }}
      >
        {active && (
          <div className="lightbox__inner">
            <img
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
            />
            <div className="lightbox__bar">
              <p className="lightbox__caption">{active.caption}</p>
              <div className="lightbox__actions">
                <button
                  type="button"
                  className="lightbox__btn"
                  onClick={() => step(-1)}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="lightbox__btn"
                  onClick={() => step(1)}
                >
                  Next
                </button>
                <button
                  type="button"
                  className="lightbox__btn"
                  onClick={() => setOpenIndex(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

function App() {
  const { theme, resolved, setTheme, cycleTheme } = useTheme();
  const isDark = resolved === "dark";
  const reduceMotion = useReducedMotion();
  const active = useActiveSection();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });
  const nameY = useTransform(scrollYProgress, [0, 0.2], [0, -64]);
  const nameFade = useTransform(scrollYProgress, [0, 0.18], [1, 0.2]);

  const historyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: historyProgress } = useScroll({
    target: historyRef,
    offset: ["start 92%", "end 55%"],
  });

  const themeLabel = theme === "system" ? `system (${resolved})` : theme;

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "s") return;
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        (target instanceof HTMLInputElement && target.type !== "checkbox") ||
        target instanceof HTMLTextAreaElement
      )
        return;
      event.preventDefault();
      cycleTheme();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [cycleTheme]);

  const [hasCv, setHasCv] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Hosts often answer missing files with the SPA shell and a 200, so check
    // the content type rather than trusting the status code.
    fetch(CV_URL)
      .then((response) => {
        const type = response.headers.get("content-type") ?? "";
        return response.ok && type.includes("pdf");
      })
      .then((exists) => {
        if (!cancelled) setHasCv(exists);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="frame">
      <a className="skip" href="#main">
        Skip to content
      </a>

      <aside className="rail">
        <div className="rail__top">
          <a className="rail__name" href="#intro">
            <span className="rail__full">Dylan Robinson</span>
            <span className="rail__short">DR</span>
          </a>
          <p className="rail__role">Software developer, Yarra Valley</p>
        </div>

        <nav className="rail__nav" aria-label="Sections">
          {sections.map((section, index) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={
                active === section.id ? "nav-link is-active" : "nav-link"
              }
              aria-current={active === section.id ? "location" : undefined}
            >
              <span className="nav-link__num">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{section.label}</span>
            </a>
          ))}
        </nav>

        <div className="rail__bottom">
          <a className="rail__mail" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          {hasCv && (
            <a
              className="rail__mail"
              href={CV_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              CV (PDF)
            </a>
          )}
          <div className="rail__switch">
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              aria-label="Dark mode"
              className="theme-switch"
              title={`Theme: ${themeLabel}. Press S to switch.`}
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              <span className="theme-switch__thumb">{isDark ? "☾" : "☀"}</span>
            </button>
          </div>
        </div>

        <motion.div
          className="rail__progress"
          style={{ scaleY: reduceMotion ? 1 : progress }}
          aria-hidden="true"
        />
        <motion.div
          className="rail__progress-h"
          style={{ scaleX: reduceMotion ? 1 : progress }}
          aria-hidden="true"
        />
      </aside>

      <div className="sheet">
        <main id="main" tabIndex={-1}>
          <header className="intro" id="intro">
            <p className="intro__kicker">Yarra Valley, Victoria</p>

            <motion.h1
              className="intro__name"
              style={reduceMotion ? undefined : { y: nameY, opacity: nameFade }}
            >
              {["Dylan", "Robinson"].map((word, index) => (
                <span className="intro__word" key={word}>
                  <motion.span
                    initial={reduceMotion ? false : { y: "115%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: 1,
                      delay: 0.08 + index * 0.09,
                      ease: easing,
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            <div className="intro__text">
              <p className="intro__lede">
                I build the online tax return app at CTRL Accounting, where I am
                lead developer and a director. It is being prepared for launch.
              </p>

              <p className="intro__body">
                Before the app I worked part-time for eight years in a computer
                repair shop in the Yarra Valley, fixing PCs and building
                WordPress sites for local businesses. I finished a computer
                science degree at Swinburne in May 2026.
              </p>

              <p className="intro__body">
                I work on whatever part of a system is causing trouble: the
                database, the front end, or the person on the phone explaining
                what went wrong.
              </p>
            </div>
          </header>

          <section className="section" id="work">
            <h2 className="section__label">Work</h2>

            <article className="case">
              <p className="case__meta">{projects[0].when}</p>
              <h3 className="case__title">{projects[0].title}</h3>
              <p className="case__role">{projects[0].role}</p>
              <p className="case__text">{projects[0].summary}</p>

              {projects[0].facts && (
                <ul className="case__facts">
                  {projects[0].facts.map((fact) => (
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
                    {project.tech && (
                      <p className="entry__tech">{project.tech}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <p className="tools-line">
              <strong>Tools</strong> TypeScript, Vue 3, React, Node.js,
              JavaScript, PHP, Python, PostgreSQL, SQL, Docker, HTML and CSS,
              plus WordPress, Microsoft Access and eight years of PC repair.
            </p>
          </section>

          <section className="section" id="history">
            <h2 className="section__label">History</h2>

            <div className="timeline" ref={historyRef}>
              <div className="timeline__rail" aria-hidden="true">
                <motion.span
                  className="timeline__fill"
                  style={
                    reduceMotion ? { scaleY: 1 } : { scaleY: historyProgress }
                  }
                />
              </div>

              {roles.map((role) => (
                <article
                  className="timeline__row"
                  key={`${role.company}-${role.when}`}
                >
                  <p className="timeline__when">{role.when}</p>
                  <h3 className="timeline__title">{role.company}</h3>
                  <p className="timeline__role">
                    {role.title}, {role.place}
                    {role.note ? ` (${role.note})` : ""}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="section" id="study">
            <h2 className="section__label">Study</h2>

            <dl className="study">
              {study.map((item) => (
                <div className="study__row" key={item.title}>
                  <dt className="study__when">{item.when}</dt>
                  <dd className="study__what">
                    <span className="study__title">{item.title}</span>
                    <span className="study__place">
                      {item.place}
                      {item.note ? ` (${item.note})` : ""}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="section contact" id="contact">
            <h2 className="section__label">Contact</h2>

            <p className="contact__text">
              I am looking for a software development role. Email is the
              quickest way to reach me.
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
        </main>

        <footer className="colophon">
          <div className="colophon__links">
            <a
              className="icon-link"
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0.297C5.373 0.297 0 5.67 0 12.297c0 5.29 3.438 9.773 8.205 11.366.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.524.117-3.176 0 0 1.008-.323 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.045.138 3.003.404 2.29-1.553 3.296-1.23 3.296-1.23.656 1.653.244 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 5.92.43.37.815 1.102.815 2.222 0 1.605-.015 2.898-.015 3.293 0 .319.216.694.825.576C20.565 22.065 24 17.584 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>

            <a
              className="icon-link"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M4.98 3.5C4.98 5.43 3.43 7 1.5 7S-2 5.43-2 3.5 0.57 0 2.5 0 4.98 1.57 4.98 3.5zM.02 8H5V24H.02V8zM8.5 8H13.3v2.15h.07c.66-1.25 2.28-2.57 4.69-2.57 5.01 0 5.94 3.3 5.94 7.6V24h-4.98V15.3c0-2.06-.04-4.7-2.86-4.7-2.87 0-3.3 2.24-3.3 4.56V24H8.5V8z" />
              </svg>
            </a>
          </div>

          <div className="colophon__meta">
            <p>
              Press <kbd>S</kbd> to change the theme
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
