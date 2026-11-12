export const LINKEDIN_URL =
  "https://www.linkedin.com/in/dylan-robinson-415171184/";
export const GITHUB_URL = "https://github.com/TheSpicyTacoGuy";
export const STUDENT_GITHUB_URL = "https://github.com/DylanRobinson-101634222";
export const EMAIL = "hey@dylan-robinson.dev";
export const CV_URL = "/cv/dylan-robinson-resume.pdf";

/**
 * A bare mailto lands as an unlabelled reply. The subject line says what the
 * email is about before it is opened, which helps when it is sent from a
 * recruiter's mailbox in a hurry.
 */
export const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(
  "Software developer role enquiry",
)}`;

export const POSITIONING =
  "Open to full time software development and related roles, in Melbourne or remote.";

export const LOCATION = "Yarra Valley, Victoria";

export type Fact = {
  label: string;
  value: string;
};

/** The scannable version of the CV, for a recruiter with ten seconds. */
export const facts: Fact[] = [
  { label: "Work rights", value: "Unrestricted Australian work rights" },
  { label: "Availability", value: POSITIONING },
  {
    label: "Now",
    value: "Lead developer and director at CTRL Accounting since 2023",
  },
  { label: "Location", value: `${LOCATION}. Melbourne commute, or remote.` },
  {
    label: "Stack",
    value:
      "TypeScript, Vue 3, React, Node.js, Express, PHP, MySQL, PostgreSQL, MongoDB",
  },
  {
    label: "Before",
    value:
      "Eight years in a computer repair shop, then the sawmill at Powelltown",
  },
  {
    label: "Education",
    value: "Bachelor of Computer Science, Swinburne, 2024 to 2026",
  },
];

export type Section = {
  id: string;
  label: string;
};

export const sections: Section[] = [
  { id: "intro", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "facts", label: "Facts" },
  { id: "history", label: "Experience" },
  { id: "background", label: "About" },
  { id: "contact", label: "Contact" },
];

export const sectionIds = sections.map((section) => section.id);

export type CaseStudy = {
  id: string;
  title: string;
  when: string;
  role: string;
  status: string;
  stack?: string[];
  summary: string;
  facts: string[];
  link?: { label: string; href: string };
  plates: Shot[];
};

export const caseStudies: CaseStudy[] = [
  {
    id: "ctrl",
    title: "Online tax return app",
    when: "2023 to now",
    role: "CTRL Accounting, lead web developer and director",
    status: "Pre-launch, private repository",
    stack: ["Vue 3", "Express 5", "MongoDB", "Keycloak", "Stripe", "AWS KMS"],
    summary:
      "Clients answer plain-English questions and pay for their return. A registered tax agent then reviews it in a separate workspace and lodges it with the ATO. It is being prepared for launch.",
    facts: [
      "Return contents are encrypted in the browser, so only the assigned tax agent can open them.",
      "The Express 5 API runs on MongoDB, with Helmet headers and eight rate limiters covering auth, submissions, contact, support and both Stripe flows.",
      "139 automated tests across 23 files cover tax rules, TFN and ABN checks, encryption and Stripe webhooks.",
      "Keycloak sign-in with passkeys, or a password plus an authenticator code.",
      "Encryption keys are managed in AWS KMS, and Stripe webhooks are signature checked before any write.",
    ],
    plates: [
      {
        src: "/shots/landing-1477.webp",
        srcSet: "/shots/landing-800.webp 800w, /shots/landing-1477.webp 1477w",
        sizes: "(min-width: 900px) 76vw, 100vw",
        alt: "CTRL landing page headed Take control of your tax return.",
        caption: "Landing page",
        width: 1477,
        height: 822,
        wide: true,
      },
      {
        src: "/shots/dashboard-1600.webp",
        srcSet:
          "/shots/dashboard-800.webp 800w, /shots/dashboard-1600.webp 1600w",
        sizes: "(min-width: 900px) 40vw, 100vw",
        alt: "Client dashboard listing refunds, returns lodged and returns in progress.",
        caption: "Client dashboard",
        width: 1600,
        height: 812,
      },
      {
        src: "/shots/return-1600.webp",
        srcSet: "/shots/return-800.webp 800w, /shots/return-1600.webp 1600w",
        sizes: "(min-width: 900px) 40vw, 100vw",
        alt: "Admin dashboard showing a tax return with a list of questions and answers.",
        caption: "Admin dashboard",
        width: 1600,
        height: 813,
      },
    ],
  },
  {
    id: "four-seasons",
    title: "Four Seasons Horse Rugs",
    when: "2026",
    role: "Sole developer, Yarra Junction",
    status: "Live",
    stack: ["Vue 3", "Vite", "Nuxt UI", "PHP 8", "MySQL", "cPanel"],
    summary:
      "A horse rug maker in Yarra Junction needed prices and repairs online, without a phone call for every quote. The site walks a customer through range, style, item type, size, lining and colour, then shows the price and the binding colours. The owner edits the catalogue, extras, sales, photos and announcement herself, with no developer involved.",
    facts: [
      "Prices live in MySQL in cents and are calculated on the server. A sale never rewrites the base price.",
      "Every write needs a signed-in session and a CSRF token. Sign in is throttled per address and per username.",
      "The public catalogue is cached for 60 seconds. The admin and every other read stay no-store.",
      "Photos are resized in the browser and stored as WebP, and the server validates the decoded bytes.",
      "A sale can target the store, a range, a style or an accessory. The best applicable sale wins, and sales never stack.",
    ],
    link: {
      label: "Open the live site",
      href: "https://new.fourseasonshorserugs.com.au/",
    },
    plates: [
      {
        src: "/four-seasons-prices-1440.webp",
        srcSet:
          "/four-seasons-prices-800.webp 800w, /four-seasons-prices-1440.webp 1440w",
        sizes: "(min-width: 900px) 76vw, 100vw",
        alt: "Four Seasons price builder, headed Every rug, hood, neck rug and quarter sheet, priced.",
        caption: "Price builder",
        width: 1440,
        height: 940,
        wide: true,
      },
      {
        src: "/four-seasons-home-1440.webp",
        srcSet:
          "/four-seasons-home-800.webp 800w, /four-seasons-home-1440.webp 1440w",
        sizes: "(min-width: 900px) 40vw, 100vw",
        alt: "Four Seasons Horse Rugs home page, headed Horse rugs, made and repaired in Yarra Junction.",
        caption: "Home page",
        width: 1440,
        height: 940,
      },
      {
        src: "/four-seasons-admin-1291.webp",
        srcSet:
          "/four-seasons-admin-800.webp 800w, /four-seasons-admin-1291.webp 1291w",
        sizes: "(min-width: 900px) 40vw, 100vw",
        alt: "Price admin signed in, showing 285 products across 10 ranges with a shop preview beside the list.",
        caption: "Price admin, signed in",
        width: 1291,
        height: 768,
      },
    ],
  },
];

export type Project = {
  title: string;
  when: string;
  role: string;
  summary: string;
  tech?: string;
  link?: { label: string; href: string };
};

export const otherProjects: Project[] = [
  {
    title: "SmartCity Dashboard",
    when: "2025 to 2026",
    role: "Swinburne capstone for an industry client, team of five, under NDA",
    summary:
      "A dashboard that watches IoT devices and flags anything unusual. It takes data over MQTT, CoAP, Modbus, Zigbee and LoRaWAN, and an Isolation Forest model flagged about 4.8% of records on the public TON_IoT dataset. The client, the data and the code stay private, so this one is described rather than shown.",
    tech: "Vue 3, Node.js, PostgreSQL, Python, Docker, Azure DevOps, AWS EC2",
  },
  {
    title: "Greenhouse monitoring system",
    when: "University project",
    role: "Group project, Vue interface by Dylan",
    summary:
      "Our group built an Arduino greenhouse monitor with a light sensor and LEDs. It detects low light and switches on UV lights. I built a Vue site to monitor my device and change its settings remotely over MQTT; the group connected the devices to a ThingsBoard dashboard.",
    tech: "Arduino, Vue, MQTT, ThingsBoard, LEDs, light sensor",
  },
  {
    title: "Android apps, COS30017",
    when: "2026",
    role: "Swinburne coursework, Kotlin",
    summary:
      "Three Android assignments published as public repositories on my university GitHub account, written in Kotlin.",
    tech: "Kotlin, Android",
    link: {
      label: "View on GitHub",
      href: STUDENT_GITHUB_URL,
    },
  },
  {
    title: "Essentials Android app",
    when: "Present",
    role: "Open source contributor",
    summary:
      "Fixed issues and raised pull requests for an open-source Android app, using Kotlin and Git.",
    tech: "Kotlin, Git",
    link: {
      label: "View on GitHub",
      href: "https://github.com/sameerasw/essentials",
    },
  },
  {
    title: "WordPress sites and online store",
    when: "2014 to 2022",
    role: "Technology2You IT Services",
    summary:
      "Built and maintained WordPress sites for more than five local clients, including an online store with dynamic inventory supplied by JSON data feeds.",
    tech: "WordPress, JSON",
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
    role: "Powelltown Sawmills, now Timbermaster",
    summary:
      "I fixed and extended the Access database and data-entry portal for Smokemaster, including a new inventory system and tracking for timber moving between the mill and storage. I also stacked timber and helped with equipment maintenance.",
    tech: "Microsoft Access, SQL",
  },
];

export type Role = {
  id: string;
  company: string;
  title: string;
  place: string;
  when: string;
  start: number;
  end: number | null;
  note?: string;
};

export const roles: Role[] = [
  {
    id: "ctrl",
    company: "CTRL Accounting",
    title: "Lead web developer and director",
    place: "Melbourne, remote",
    when: "2023 to now",
    start: 2023,
    end: null,
  },
  {
    id: "powelltown",
    company: "Powelltown Sawmills",
    title: "Sawmill stacker",
    place: "Powelltown",
    when: "2023 to 2025",
    start: 2023,
    end: 2025,
    note: "then their Access and inventory systems",
  },
  {
    id: "technology2you",
    company: "Technology2You IT Services",
    title: "IT technician, shop manager, web developer",
    place: "Woori Yallock",
    when: "2014 to 2022",
    start: 2014,
    end: 2022,
  },
  {
    id: "equiscore",
    company: "EquiScore Dressage Scoring",
    title: "Lead developer",
    place: "Woori Yallock",
    when: "2018 to 2019",
    start: 2018,
    end: 2019,
    note: "not officially employed",
  },
  {
    id: "polktronics",
    company: "Polktronics",
    title: "Auto electrical assistant",
    place: "Woori Yallock",
    when: "2018 to 2019",
    start: 2018,
    end: 2019,
    note: "not officially employed",
  },
];

export type Study = {
  title: string;
  place: string;
  when: string;
  note?: string;
};

export const study: Study[] = [
  {
    title: "Bachelor of Computer Science (Software Development)",
    place: "Swinburne University of Technology, Hawthorn",
    when: "2024 to 2026",
    note: "GPA 3.556/4.0",
  },
  {
    title: "Diploma of Information Technology",
    place: "Swinburne University (UniLink)",
    when: "2017",
    note: "5 HDs and 4 Ds, GPA 3.625/4.0",
  },
  {
    title: "VCE, Year 12",
    place: "Upper Yarra Secondary College",
    when: "2016",
  },
];

export type Shot = {
  src: string;
  srcSet: string;
  sizes: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  wide?: boolean;
};

export type ToolGroup = {
  label: string;
  items: string[];
};

export const toolGroups: ToolGroup[] = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Kotlin", "PHP", "Python", "SQL"],
  },
  {
    label: "Front end",
    items: ["Vue 3", "React", "Nuxt UI", "Vite", "HTML and CSS"],
  },
  {
    label: "Back end and data",
    items: ["Node.js", "Express", "MySQL", "PostgreSQL", "MongoDB", "JSON"],
  },
  {
    label: "Devices and protocols",
    items: [
      "Arduino",
      "ThingsBoard",
      "MQTT",
      "CoAP",
      "Modbus",
      "Zigbee",
      "LoRaWAN",
    ],
  },
  {
    label: "Security and delivery",
    items: [
      "Keycloak",
      "Passkeys",
      "2FA",
      "Stripe",
      "Automated testing",
      "CI/CD",
      "Docker",
      "Azure DevOps",
      "AWS EC2",
      "cPanel",
    ],
  },
  {
    label: "Also",
    items: ["WordPress", "Microsoft Access", "PC repair"],
  },
];
