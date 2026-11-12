// Generates public/og/og-card.png (1200x630) from the site's hero.
// Re-run with: npm run og
// Copy comes from src/content.ts and src/sections/Hero.tsx, and the colours
// come from the bark band in src/index.css.
// resvg-js cannot read WOFF2, so scripts/og-fonts holds TTF conversions of the
// site's Latin subsets. Rebuild them with fontTools if public/fonts changes.
import { Resvg } from "@resvg/resvg-js";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// The shipped Martian Mono subsets are the SemiExpanded cut: the 400, 500 and
// 700 files hold the same outlines, so the card draws them at their own weight.
const font = (name) => join(root, "scripts", "og-fonts", `${name}.ttf`);

const portrait = readFileSync(
  join(root, "source-shots", "portrait.jpg"),
).toString("base64");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#22150e"/>

  <image href="data:image/jpeg;base64,${portrait}" x="680" y="40" width="440" height="550" preserveAspectRatio="xMidYMid slice"/>

  <g font-family="Martian Mono SemiExpanded" fill="#f0eae1" font-size="88" letter-spacing="-1.76">
    <text x="80" y="150">Dylan</text>
    <text x="80" y="240">Robinson</text>
  </g>

  <text x="80" y="284" font-family="Martian Mono SemiExpanded" font-size="20" letter-spacing="0.4" fill="#a8c8a8">Yarra Valley, Victoria</text>

  <g font-family="IBM Plex Sans" font-size="26" fill="#bdb2a7">
    <text x="80" y="350">I build the online tax return app at</text>
    <text x="80" y="389">CTRL Accounting, where I am lead</text>
    <text x="80" y="428">developer and a director.</text>
  </g>

  <line x1="80" y1="492" x2="640" y2="492" stroke="#41352f" stroke-width="1"/>

  <g font-family="JetBrains Mono" font-size="17" fill="#a8c8a8">
    <text x="80" y="536">Open to full time software development</text>
    <text x="80" y="560">and related roles, in Melbourne or remote.</text>
  </g>
</svg>`;

mkdirSync(join(root, "public", "og"), { recursive: true });

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: {
    fontFiles: [
      font("martian-mono-700"),
      font("ibm-plex-sans-400"),
      font("jetbrains-mono-400"),
    ],
    loadSystemFonts: false,
    defaultFontFamily: "IBM Plex Sans",
  },
});

writeFileSync(join(root, "public", "og", "og-card.png"), resvg.render().asPng());

console.log("Wrote public/og/og-card.png");
