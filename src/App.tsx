import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Chip,
  Link,
  Separator,
  Switch,
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@heroui/react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect } from "react";
import { useTheme } from "./theme";

const MotionCard = motion(Card);

const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.1 + i * 0.08, ease: easing },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easing },
  },
};

const heroVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easing } },
};

type ExperienceItem = {
  role: string;
  company: string;
  location: string;
  period: string;
  points: string[];
};

const education = [
  {
    title: "Bachelor of Computer Science (Software Development)",
    place: "Swinburne University (Hawthorn)",
    date: "Expected completion: May 2026",
  },
  {
    title: "Diploma of Information Technology (UniLink)",
    place: "Swinburne University",
    date: "2017, high achieving",
  },
  {
    title: "Year 12 VCE",
    place: "Upper Yarra Secondary College",
    date: "2016",
  },
];

const experience: ExperienceItem[] = [
  {
    role: "Computer Technician / Shop Manager / Web Developer (part-time)",
    company: "Technology2You IT Services",
    location: "Woori Yallock",
    period: "2014 to 2022",
    points: [
      "Managed day-to-day shop operations and stepped in as store manager when needed.",
      "Handled PC repair, hardware troubleshooting and front-line customer support.",
      "Built and maintained WordPress websites and client-facing web features.",
    ],
  },
  {
    role: "Lead Developer (not officially employed)",
    company: "EquiScore Dressage Scoring",
    location: "Woori Yallock",
    period: "2018 to 2019",
    points: [
      "Developed an online dressage scoring and results portal with HTML, CSS, PHP, JavaScript and Ajax.",
      "Implemented a results viewer and front-end features, with a small amount of Angular.",
    ],
  },
  {
    role: "Auto Electrical Assistant (not officially employed)",
    company: "Polktronics",
    location: "Woori Yallock",
    period: "2018 to 2019",
    points: ["Assisted with upgrades to SES vehicle equipment."],
  },
  {
    role: "Sawmill Stacker (casual)",
    company: "Powelltown Sawmills",
    location: "Powelltown",
    period: "2023 to 2025",
    points: [
      "Completed timber stacking, general maintenance and data entry in Microsoft Access.",
      "Upgraded parts of a legacy Access database and data entry portal.",
    ],
  },
];

function App() {
  const { scrollYProgress } = useScroll();
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const haloY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  const { theme, resolved, setTheme, cycleTheme } = useTheme();
  const isDark = resolved === "dark";

  const themeLabel =
    theme === "system"
      ? `System (${resolved})`
      : theme === "dark"
        ? "Dark"
        : "Light";

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

  return (
    <main className="site-shell">
      <motion.div className="bg-orb orb-left" style={{ y: glowY }} />
      <motion.div className="bg-orb orb-right" style={{ y: haloY }} />

      <div className="theme-toggle">
        <TooltipRoot>
          <TooltipTrigger>
            <Switch.Root
              isSelected={isDark}
              onChange={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Switch mode"
              size="lg"
            >
              <Switch.Control>
                <Switch.Thumb>
                  <Switch.Icon className="theme-switch__icon">
                    {isDark ? "🌙" : "☀️"}
                  </Switch.Icon>
                </Switch.Thumb>
              </Switch.Control>
              <Switch.Content className="theme-toggle__label">
                {themeLabel}
              </Switch.Content>
            </Switch.Root>
          </TooltipTrigger>

          <TooltipContent showArrow>Switch mode [s]</TooltipContent>
        </TooltipRoot>
      </div>

      <motion.section
        className="hero-section"
        variants={heroVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div style={{ y: titleY }}>
          <Chip variant="primary" color="accent" className="hero-chip">
            Software Developer Portfolio
          </Chip>
          <h1 className="hero-title">Dylan Robinson</h1>
          <p className="hero-subtitle">
            I build practical web apps and software that solve real business
            problems. I am currently working on an online tax return app for
            CTRL Accounting, where I am also a director.
          </p>
          <div className="hero-actions">
            <TooltipRoot>
              <TooltipTrigger>
                <Button
                  variant="primary"
                  size="lg"
                  onPress={() =>
                    document
                      .getElementById("experience")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                >
                  View Experience
                </Button>
              </TooltipTrigger>
              <TooltipContent showArrow>
                Jump to experience section
              </TooltipContent>
            </TooltipRoot>

            <TooltipRoot>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  size="lg"
                  onPress={() =>
                    document
                      .getElementById("education")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                >
                  View Education
                </Button>
              </TooltipTrigger>
              <TooltipContent showArrow>
                Jump to education section
              </TooltipContent>
            </TooltipRoot>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        className="content-section"
        id="highlights"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div
          variants={sectionVariants}
          custom={0}
          className="feature-card-wrapper"
        >
          <MotionCard className="feature-card mb-4" variants={cardVariants}>
            <CardHeader className="card-header-text">Current Focus</CardHeader>
            <CardContent>
              <p>
                Building the CTRL Accounting online tax return app with a strong
                focus on reliability, user clarity and clean implementation.
              </p>
            </CardContent>
            <CardFooter>
              <Chip color="success" variant="soft">
                Active project
              </Chip>
            </CardFooter>
          </MotionCard>
        </motion.div>

        <motion.div variants={sectionVariants} custom={1}>
          <MotionCard className="feature-card" variants={cardVariants}>
            <CardHeader className="card-header-text">Core Skills</CardHeader>
            <CardContent className="chip-grid">
              <Chip variant="secondary">React</Chip>
              <Chip variant="secondary">TypeScript</Chip>
              <Chip variant="secondary">JavaScript</Chip>
              <Chip variant="secondary">PHP</Chip>
              <Chip variant="secondary">WordPress</Chip>
              <Chip variant="secondary">SQL</Chip>
              <Chip variant="secondary">Customer Support</Chip>
              <Chip variant="secondary">System Troubleshooting</Chip>
            </CardContent>
          </MotionCard>
        </motion.div>
      </motion.section>

      <motion.section
        className="content-section"
        id="experience"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="section-title">Experience</h2>
        <div className="experience-grid">
          {experience.map((item, idx) => (
            <MotionCard
              key={`${item.company}-${item.period}`}
              className="feature-card"
              variant="secondary"
              variants={cardVariants}
              custom={idx}
            >
              <CardHeader className="card-header-text">
                <CardTitle>{item.company}</CardTitle>
                <p>{item.role}</p>
                <p>
                  {item.location} | {item.period}
                </p>
              </CardHeader>
              <Separator />
              <CardContent>
                <ul className="points-list">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </MotionCard>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="content-section"
        id="education"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <h2 className="section-title">Education</h2>
        <div className="education-grid">
          {education.map((item, idx) => (
            <MotionCard
              key={item.title}
              className="edu-card"
              variants={cardVariants}
              custom={idx}
            >
              <CardHeader className="card-header-text">{item.title}</CardHeader>
              <Separator />
              <CardContent>
                <p>{item.place}</p>
              </CardContent>
              <CardFooter>
                <Chip variant="soft" color="accent">
                  {item.date}
                </Chip>
              </CardFooter>
            </MotionCard>
          ))}
        </div>
      </motion.section>

      <section className="content-section footer-section">
        <Card className="feature-card">
          <CardContent>
            <p>
              Open to software development opportunities where I can keep
              building useful products with great user outcomes.
            </p>
          </CardContent>
          <CardFooter className="footer-links">
            <div className="footer-links__left">
              <Link href="#experience">Jump back to experience</Link>
            </div>

            <div className="footer-links__right">
              <TooltipRoot>
                <TooltipTrigger>
                  <Link
                    className="button button--ghost button--icon-only"
                    href="https://github.com/TheSpicyTacoGuy"
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
                  </Link>
                </TooltipTrigger>
                <TooltipContent showArrow>GitHub</TooltipContent>
              </TooltipRoot>

              <TooltipRoot>
                <TooltipTrigger>
                  <Link
                    className="button button--ghost button--icon-only"
                    href="https://www.linkedin.com/in/dylan-robinson-415171184/"
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
                  </Link>
                </TooltipTrigger>
                <TooltipContent showArrow>LinkedIn</TooltipContent>
              </TooltipRoot>
            </div>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}

export default App;
