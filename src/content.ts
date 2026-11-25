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
  "Open to full-time software development and related roles, in Melbourne or remote.";

export const AVAILABILITY = "Open to full-time roles, Melbourne or remote";

export const LOCATION = "Yarra Valley, Victoria";
export const SITE_URL = "https://dylan-robinson.dev";
export const WORK_RIGHTS = "Unrestricted Australian work rights";

export type Fact = {
  label: string;
  value: string;
};

/** The scannable version of the CV, for a recruiter with ten seconds. */
export const facts: Fact[] = [
  { label: "Work rights", value: WORK_RIGHTS },
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

/** A screen recording. It is downloaded only when the reader presses play. */
export type Clip = {
  src: string;
  poster: string;
  label: string;
  caption: string;
  width: number;
  height: number;
};

export type CaseStudy = {
  id: string;
  title: string;
  when: string;
  role: string;
  status: string;
  stack?: string[];
  summary: string;
  /** One line for the work list. The summary carries the detail page. */
  blurb?: string;
  facts: string[];
  link?: { label: string; href: string };
  note?: string;
  clip?: Clip;
  /** Phone captures are taller than they are wide and need their own row. */
  platesLayout?: "phones";
  plates: Shot[];
};

export const caseStudies: CaseStudy[] = [
  {
    id: "school-lesson-planner",
    title: "School lesson planner",
    when: "2026",
    role: "Ongoing, private repository",
    status: "Early build",
    stack: [
      "Vue 3",
      "Fastify 5",
      "PostgreSQL 16",
      "Drizzle ORM",
      "Tailwind CSS v4",
      "Vite",
      "Stripe",
    ],
    summary:
      "WeekBook is a lesson planner for Australian P to 12 teachers, with a read-only portal so parents can see what their child is learning this week. Early: the first loop of API, database and web client is built and tested, and no school is using it yet.",
    blurb:
      "WeekBook, a lesson planner for P to 12 teachers with a parent portal for the week's learning.",
    facts: [
      "Publishing writes a snapshot, so editing a lesson afterwards never changes what a parent has already seen.",
      "Private prep notes stay out of everything a parent can reach.",
      "The planner sits beside the school's existing student information system rather than replacing it.",
    ],
    note: "The repository is private, so the screenshots carry this one.",
    plates: [
      {
        src: "/shots/school-planner-plan-1217.webp",
        srcSet:
          "/shots/school-planner-plan-800.webp 800w, /shots/school-planner-plan-1217.webp 1217w",
        sizes: "(min-width: 900px) 90vw, 100vw",
        alt: "Week 8 in WeekBook: a Monday to Friday grid of lessons for a Year 3 and 4 class, each block marked as a draft.",
        caption: "Planning a week",
        width: 1217,
        height: 768,
      },
      {
        src: "/shots/school-planner-timeline-1147.webp",
        srcSet:
          "/shots/school-planner-timeline-800.webp 800w, /shots/school-planner-timeline-1147.webp 1147w",
        sizes: "(min-width: 900px) 90vw, 100vw",
        alt: "Parent portal showing a week of published lessons and a calendar subscription link.",
        caption: "Parent portal",
        width: 1147,
        height: 768,
      },
    ],
  },
  {
    id: "packscanner",
    title: "PackScanner",
    when: "2026",
    role: "Solo developer, private repository",
    status: "In development on Android",
    stack: [
      "Kotlin Multiplatform",
      "Compose Multiplatform",
      "CameraX",
      "LiteRT",
      "YOLO11n",
      "ML Kit OCR",
      "SQLDelight",
    ],
    summary:
      "A pack scanner for an operator standing in the timber yard: enter the species, grade and trade size, photograph the pack end, and the app finds one box per visible board end and reads the stamped length on each. The operator corrects the review grid in place rather than retyping a count. Everything is saved locally, with the sync client still a stub behind its interface.",
    blurb:
      "An Android pack scanner for the timber yard: on-device board detection and OCR, with a review grid the operator corrects.",
    facts: [
      "Board detection is an object detector running on the phone through LiteRT, one box per visible board end. A YOLO11n or EfficientDet-Lite model swaps in without touching the UI.",
      "A synthetic renderer turns a few reference photos into labelled training data: 480 images and about 51,000 boxes in roughly 30 seconds. A three-epoch YOLO11n run on those renders reached mAP50 0.795, which the training notes treat as proof of the labels rather than proof about a real yard.",
      "Stamped lengths are read by on-device ML Kit OCR over the board region, then parsed and validated before they reach the review grid.",
      "The review grid is the pack face as a tappable grid: correct one piece, remove a false detection with undo, and flagged reads stand out.",
      "Gravity-based levelling guidance for framing, and the aid refuses to report the pack as aligned while a simulated detector is bound to synthetic boxes.",
    ],
    note: "The repository is private, so the video and screenshots carry this one. I can walk through the training data and the scan pipeline in an interview.",
    clip: {
      src: "/shots/packscanner-capture.mp4",
      poster: "/shots/packscanner-capture-poster.webp",
      label:
        "A 14 second screen recording of the PackScanner capture flow, from framing the pack to reviewing the detected board lengths.",
      caption: "Capture flow, 14 seconds",
      width: 672,
      height: 1494,
    },
    platesLayout: "phones",
    plates: [
      {
        src: "/shots/packscanner-new-pack-672.webp",
        srcSet:
          "/shots/packscanner-new-pack-480.webp 480w, /shots/packscanner-new-pack-672.webp 672w",
        sizes: "(min-width: 760px) 16rem, 90vw",
        alt: "New pack form with species, grade, shorts pack, sourcing claim, trade size and pack ID fields, and a Continue to scan button.",
        caption: "New pack",
        width: 672,
        height: 1496,
      },
      {
        src: "/shots/packscanner-history-672.webp",
        srcSet:
          "/shots/packscanner-history-480.webp 480w, /shots/packscanner-history-672.webp 672w",
        sizes: "(min-width: 760px) 16rem, 90vw",
        alt: "Pack history with search and filters, an empty state saying no packs are saved yet, and a Set up a pack button.",
        caption: "Pack history",
        width: 672,
        height: 1496,
      },
      {
        src: "/shots/packscanner-settings-672.webp",
        srcSet:
          "/shots/packscanner-settings-480.webp 480w, /shots/packscanner-settings-672.webp 672w",
        sizes: "(min-width: 760px) 16rem, 90vw",
        alt: "Settings for haptics, motion, diagnostics, scanning and appearance, shown in the dark theme.",
        caption: "Settings",
        width: 672,
        height: 1496,
      },
    ],
  },
  {
    id: "ctrl",
    title: "Online tax return app",
    when: "2023 to now",
    role: "CTRL Accounting, lead web developer and director",
    status: "Pre-launch, private repository",
    stack: ["Vue 3", "Express 5", "MongoDB", "Keycloak", "Stripe", "AWS KMS"],
    summary:
      "Clients answer plain-English questions and pay for their return. A registered tax agent then reviews it in a separate workspace and lodges it with the ATO. It is being prepared for launch.",
    blurb:
      "Encrypted tax returns, agent review and ATO lodgement for CTRL Accounting.",
    facts: [
      "Return contents are encrypted in the browser, so only the assigned tax agent can open them.",
      "The Express 5 API runs on MongoDB, with Helmet headers and eight rate limiters covering auth, submissions, contact, support and both Stripe flows.",
      "139 automated tests across 23 files cover tax rules, TFN and ABN checks, encryption and Stripe webhooks.",
      "Keycloak sign-in with passkeys, or a password plus an authenticator code.",
      "Encryption keys are managed in AWS KMS, and Stripe webhooks are signature checked before any write.",
    ],
    note: "The repository is private. I can walk through the code in an interview.",
    clip: {
      src: "/shots/ctrl-flow.mp4",
      poster: "/shots/ctrl-flow-poster.webp",
      label:
        "A 45 second walkthrough of the CTRL client dashboard and tax return form.",
      caption: "Walkthrough, 45 seconds",
      width: 1440,
      height: 714,
    },
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
    blurb:
      "A price builder and admin for a horse rug maker, run without a developer.",
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

export type ProjectShot = {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  wide?: boolean;
};

export type Project = {
  title: string;
  when: string;
  role: string;
  summary: string;
  tech?: string;
  shots?: ProjectShot[];
  /** Three narrow screens sit as a set; two get more room each. */
  shotColumns?: 2 | 3;
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
    when: "2025",
    role: "Group project, SWE30011 Assignment 4",
    summary:
      "A dashboard for a greenhouse split into four edge devices: climate, irrigation, lighting, and air quality with rain alerts. Each one shows live telemetry and a history chart, and takes manual commands and schedules. The lighting view decides whether the UV lamp should be on from the current light level and the outdoor UV index.",
    shots: [
      {
        src: "/shots/gh-irrigation-1400.webp",
        srcSet:
          "/shots/gh-irrigation-800.webp 800w, /shots/gh-irrigation-1400.webp 1400w",
        sizes: "(min-width: 760px) 92vw, 100vw",
        alt: "Irrigation screen with a soil moisture chart over time and buttons to start and stop watering.",
        caption: "Irrigation device",
        width: 1400,
        height: 500,
      },
      {
        src: "/shots/gh-climate-1400.webp",
        srcSet:
          "/shots/gh-climate-800.webp 800w, /shots/gh-climate-1400.webp 1400w",
        sizes: "(min-width: 760px) 45vw, 100vw",
        alt: "Climate screen showing temperature and humidity readings beside the controller setpoints.",
        caption: "Climate device",
        width: 1400,
        height: 516,
      },
      {
        src: "/shots/gh-lighting-1400.webp",
        srcSet:
          "/shots/gh-lighting-800.webp 800w, /shots/gh-lighting-1400.webp 1400w",
        sizes: "(min-width: 760px) 45vw, 100vw",
        alt: "Lighting screen with a light level chart, a UV schedule and manual relay controls.",
        caption: "Lighting device",
        width: 1400,
        height: 549,
      },
    ],
  },
  {
    title: "Light sensor monitor",
    when: "2025",
    role: "Swinburne coursework, SWE30011 Assignment 2",
    summary:
      "A light sensor and a temperature probe on an Arduino report as JSON over USB serial every 250 ms to a Raspberry Pi. The Pi calibrates the readings, stores each sample in MariaDB and evaluates threshold rules held in JSON, queueing commands back to the board so the dashboard never touches the serial port. The dashboard charts history in D3 and reports Active, Stale or Offline from the age of the last sample.",
    tech: "Arduino, C++, Python, Flask, MariaDB, JavaScript, D3.js, JSON rules",
    shots: [
      {
        src: "/shots/ls-flow-1000.webp",
        srcSet: "/shots/ls-flow-800.webp 800w, /shots/ls-flow-1000.webp 1000w",
        sizes: "(min-width: 760px) 45vw, 100vw",
        alt: "Flow diagram from the Arduino sensors through the serial feed and database to the dashboard and the command queue.",
        caption: "Data flow",
        width: 1000,
        height: 1335,
      },
      {
        src: "/shots/ls-circuit-1200.webp",
        srcSet:
          "/shots/ls-circuit-800.webp 800w, /shots/ls-circuit-1200.webp 1200w",
        sizes: "(min-width: 760px) 45vw, 100vw",
        alt: "Breadboard wiring diagram with an Arduino Uno, the light sensor, resistors, a pushbutton and a buzzer.",
        caption: "Circuit",
        width: 1200,
        height: 1354,
      },
    ],
    link: {
      label: "View on GitHub",
      href: "https://github.com/TheSpicyTacoGuy/SWE30011-IoT-Programming-Assignment-2",
    },
  },
  {
    title: "GrowSpace, greenhouse and plant app",
    when: "2025",
    role: "Swinburne coursework, COS30043",
    summary:
      "A Vue app for tracking greenhouses and the plants inside them. It has Firebase sign in, a tips forum, weather on the dashboard, plant reminders and account deletion, and it installs to a phone home screen and pulls to refresh.",
    tech: "Vue 3, Vite, Firebase Auth, Firestore, Firebase Storage, Bootstrap 5, PWA",
    shots: [
      {
        src: "/shots/gs-dashboard-1400.webp",
        srcSet:
          "/shots/gs-dashboard-800.webp 800w, /shots/gs-dashboard-1400.webp 1400w",
        sizes: "(min-width: 900px) 30vw, (min-width: 760px) 45vw, 100vw",
        alt: "Dashboard with the count of saved greenhouses and tracked plants, the current weather and a seven day forecast.",
        caption: "Dashboard",
        width: 1400,
        height: 1229,
      },
      {
        src: "/shots/gs-plants-1400.webp",
        srcSet:
          "/shots/gs-plants-800.webp 800w, /shots/gs-plants-1400.webp 1400w",
        sizes: "(min-width: 900px) 30vw, (min-width: 760px) 45vw, 100vw",
        alt: "Plants grid with search and a greenhouse filter, showing each plant's watering and feeding dates.",
        caption: "Plants",
        width: 1400,
        height: 1484,
      },
      {
        src: "/shots/gs-tips-1400.webp",
        srcSet: "/shots/gs-tips-800.webp 800w, /shots/gs-tips-1400.webp 1400w",
        sizes: "(min-width: 900px) 30vw, (min-width: 760px) 45vw, 100vw",
        alt: "Tips forum with a share box, community posts and threaded replies.",
        caption: "Tips",
        width: 1400,
        height: 1549,
      },
    ],
    shotColumns: 3,
    link: {
      label: "View on GitHub",
      href: "https://github.com/TheSpicyTacoGuy/GrowSpace",
    },
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
      "Built and maintained WordPress sites for more than five local clients. The biggest was the Technology2You shop, which ran on WooCommerce with its product catalogue kept in step by a supplier data feed instead of being entered by hand.",
    tech: "WordPress, WooCommerce, product data feed, JSON",
    shots: [
      {
        src: "/shots/t2y-storefront-1400.webp",
        srcSet:
          "/shots/t2y-storefront-800.webp 800w, /shots/t2y-storefront-1400.webp 1400w",
        sizes: "(min-width: 760px) 92vw, 100vw",
        alt: "Technology2You storefront with a category sidebar, supplier banner adverts in the middle and a Christmas promotion down both page edges.",
        caption: "Storefront, the previous site",
        width: 1400,
        height: 733,
      },
    ],
  },
  {
    title: "Makofire website",
    when: "Present",
    role: "Built for a friend's wholesale business",
    summary:
      "A WordPress site for an emergency response equipment supplier. It runs on a custom child theme over Kadence, with WooCommerce covering the product range.",
    tech: "WordPress, Kadence child theme, WooCommerce, Elementor",
    link: {
      label: "Visit makofire.com.au",
      href: "https://www.makofire.com.au/",
    },
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

/**
 * One shape for the work pages. The portfolio and the resume still read the
 * original lists; this only joins them for routing and one detail template.
 */
export type WorkItem = {
  slug: string;
  title: string;
  when: string;
  role: string;
  status?: string;
  stack?: string[];
  tech?: string;
  summary: string;
  blurb?: string;
  facts: string[];
  link?: { label: string; href: string };
  note?: string;
  clip?: Clip;
  plates: ProjectShot[];
  platesLayout?: "phones";
  platesColumns?: 2 | 3;
  featured: boolean;
};

const projectSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const workItems: WorkItem[] = [
  ...caseStudies.map((study) => ({
    slug: study.id,
    title: study.title,
    when: study.when,
    role: study.role,
    status: study.status,
    stack: study.stack,
    summary: study.summary,
    blurb: study.blurb,
    facts: study.facts,
    link: study.link,
    note: study.note,
    clip: study.clip,
    plates: study.plates,
    platesLayout: study.platesLayout,
    featured: true,
  })),
  ...otherProjects.map((project) => ({
    slug: projectSlug(project.title),
    title: project.title,
    when: project.when,
    role: project.role,
    tech: project.tech,
    summary: project.summary,
    facts: [],
    link: project.link,
    plates: project.shots ?? [],
    platesColumns: project.shotColumns,
    featured: false,
  })),
];

export const featuredWork = workItems.filter((item) => item.featured);
export const otherWork = workItems.filter((item) => !item.featured);

export const workBySlug = new Map(
  workItems.map((item) => [item.slug, item]),
);

export type Role = {
  id: string;
  company: string;
  title: string;
  place: string;
  when: string;
  start: number;
  end: number | null;
  note?: string;
  /** The CV prints these under the role. */
  points?: string[];
  /** The one-line skills summary the CV prints after the points. */
  skills?: string;
  /** Volunteer or unpaid work, which the CV lists apart from paid roles. */
  volunteer?: boolean;
};

export const roles: Role[] = [
  {
    id: "ctrl",
    company: "CTRL Accounting",
    title: "Sole developer and director (20%)",
    place: "Melbourne, remote",
    when: "2023 to now",
    start: 2023,
    end: null,
    points: [
      "Built CTRL Centre, an online tax return app. Clients fill in their return and pay in one place, and tax agents review it in a separate workspace.",
      "Return contents are encrypted in the browser, so only the assigned tax agent can open them. The server stores them but cannot read them.",
      "139 automated tests across 23 files cover tax rules, TFN and ABN checks, encryption and Stripe webhooks.",
      "The Express 5 API runs on MongoDB, with Helmet headers and eight rate limiters. Encryption keys are managed in AWS KMS, and Stripe webhooks are signature checked before any write.",
    ],
    skills:
      "Vue 3, Node.js, Express, MongoDB, AWS KMS, Keycloak, passkeys, 2FA, Stripe, automated testing",
  },
  {
    id: "powelltown",
    company: "Powelltown Sawmills",
    title: "Sawmill stacker (casual)",
    place: "Powelltown",
    when: "2023 to 2025",
    start: 2023,
    end: 2025,
    note: "then their Access and inventory systems",
    points: [
      "Stacked timber and helped with equipment maintenance.",
      "Fixed up and extended the old Access database and data-entry portal for Smokemaster, including a new inventory system and site-to-site stock transition support.",
    ],
    skills: "Microsoft Access",
  },
  {
    id: "technology2you",
    company: "Technology2You IT Services",
    title: "Computer technician, shop manager, web developer (part time)",
    place: "Woori Yallock",
    when: "2014 to 2022",
    start: 2014,
    end: 2022,
    points: [
      "Repaired PCs, laptops and mobile devices for walk-in customers: failed drives, overheating, RAM and power supply faults, virus removal, data recovery.",
      "Ran the shop when needed, opening and closing, ordering parts and booking jobs, and explained faults and costs to customers who were not technical.",
      "Built and looked after WordPress sites for more than five local clients, including the CEO's online store with dynamic inventory through JSON data feeds.",
    ],
    skills: "JSON, PC and laptop repair, fault diagnosis, WordPress",
  },
  {
    id: "equiscore",
    company: "EquiScore Dressage Scoring",
    title: "Lead developer (unpaid project)",
    place: "Woori Yallock",
    when: "2017 to 2019",
    start: 2017,
    end: 2019,
    volunteer: true,
    points: [
      "Built an online scoring and results portal in PHP, JavaScript and Ajax, with a small amount of Angular on the front end. Scorers entered results and the portal published them while the competition was still running.",
    ],
    skills: "JavaScript, PHP",
  },
  {
    id: "polktronics",
    company: "Polktronics",
    title: "Auto electrical assistant (volunteer)",
    place: "Woori Yallock",
    when: "2018 to 2019",
    start: 2018,
    end: 2019,
    volunteer: true,
    points: [
      "Assisted with upgrades to SES vehicle equipment, fitting new CB radio equipment.",
    ],
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

/** The paragraph the CV opens with, for a reader giving it a first pass. */
export const PROFILE =
  "Software development graduate who spent eight years repairing PCs and mobile devices while helping run a local computer shop. I build web apps and IoT systems, and I am now the lead developer and a director at CTRL Accounting, building their online tax return app. I work on whatever part of a system is causing trouble: the database, the front end, or the person on the phone explaining what went wrong.";

/**
 * One flat line at the end of the CV. It is longer than `toolGroups` on purpose:
 * a resume is read by a keyword match before it is read by a person.
 */
export const skillList: string[] = [
  "TypeScript",
  "JavaScript",
  "Vue 3",
  "React",
  "Nuxt UI",
  "Vite",
  "Node.js",
  "Express",
  "PHP",
  "Python",
  "Kotlin",
  "C/C++",
  "SQL",
  "HTML and CSS",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "JSON",
  "PC and laptop repair",
  "fault diagnosis",
  "Arduino",
  "ThingsBoard",
  "MQTT",
  "CoAP",
  "Modbus",
  "Zigbee",
  "LoRaWAN",
  "3D printing",
  "Fusion 360",
  "Git",
  "Azure DevOps",
  "Jira",
  "Confluence",
  "Docker",
  "AWS EC2",
  "AWS KMS",
  "Keycloak",
  "passkeys",
  "2FA",
  "Stripe",
  "Figma",
  "Firebase",
  "cPanel",
  "WordPress",
  "WooCommerce",
  "Microsoft Access",
  "automated testing",
  "CI/CD",
  "full stack application development",
  "API design and system integration",
  "AI coding tools",
  "authentication and authorisation",
  "backend development",
  "cloud infrastructure",
];
