export const LINKEDIN_URL =
  "https://www.linkedin.com/in/dylan-robinson-415171184/";
export const GITHUB_URL = "https://github.com/TheSpicyTacoGuy";
export const EMAIL = "drskyrim1@gmail.com";
export const CV_URL = "/cv/dylan-robinson-resume.pdf";

export type Section = {
  id: string;
  label: string;
};

export const sections: Section[] = [
  { id: "intro", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "history", label: "History" },
  { id: "study", label: "Study" },
  { id: "contact", label: "Contact" },
];

export const sectionIds = sections.map((section) => section.id);

export type Project = {
  title: string;
  when: string;
  role: string;
  summary: string;
  tech?: string;
  facts?: string[];
};

export const projects: Project[] = [
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

export const otherProjects: Project[] = [
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

export type Role = {
  company: string;
  title: string;
  place: string;
  when: string;
  note?: string;
};

export const roles: Role[] = [
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

export type Shot = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  wide?: boolean;
};

export const shots: Shot[] = [
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
