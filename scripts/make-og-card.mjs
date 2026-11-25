// Generates public/og/og-card.png (1200x630) from the home page's first view.
// Re-run with: npm run og
// Copy comes from src/content.ts and src/pages/Home.tsx. Colours and type come
// from src/index.css. resvg-js cannot read WOFF2, so scripts/og-fonts holds TTF
// conversions of the shipped Latin cuts. Rebuild them with fontTools if
// public/fonts changes.
import { Resvg } from "@resvg/resvg-js";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const font = (name) => join(root, "scripts", "og-fonts", `${name}.ttf`);

const portrait = readFileSync(
  join(root, "source-shots", "portrait.jpg"),
).toString("base64");

const paper = "#f3ebdd";
const ink = "#221c16";
const soft = "#5c5348";
const rule = "#d9cdba";
const mark = "#b4471f";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${paper}"/>

  <g font-family="Archivo Display" fill="${ink}" font-size="82" letter-spacing="-2.4">
    <text x="80" y="160">Dylan</text>
    <text x="80" y="238">Robinson</text>
  </g>

  <g font-family="Source Serif 4" font-size="24" fill="${ink}" letter-spacing="-0.2">
    <text x="80" y="318">I build the online tax return app at CTRL</text>
    <text x="80" y="354">Accounting, where I am lead developer and</text>
    <text x="80" y="390">a director.</text>
  </g>

  <image href="data:image/jpeg;base64,${portrait}" x="830" y="80" width="290" height="290"
    preserveAspectRatio="xMidYMin slice"/>
  <text x="830" y="400" font-family="Archivo Display" font-size="15" fill="${soft}">Yarra Valley, 2026.</text>
  <text x="830" y="432" font-family="Archivo Display" font-size="15" fill="${soft}">dylan-robinson.dev</text>

  <line x1="80" y1="440" x2="800" y2="440" stroke="${rule}" stroke-width="1"/>

  <g font-family="Archivo Display" font-size="13" fill="${soft}">
    <text x="80" y="470">Role</text>
    <text x="280" y="470">Location</text>
    <text x="470" y="470">Availability</text>
    <text x="660" y="470">Work rights</text>
  </g>

  <g font-family="Archivo Display" font-size="16" fill="${ink}">
    <text x="80" y="498">Software developer</text>
    <text x="280" y="498">Yarra Valley,</text>
    <text x="280" y="520">Victoria</text>
    <text x="660" y="498">Unrestricted</text>
    <text x="660" y="520">Australian work</text>
    <text x="660" y="542">rights</text>
  </g>

  <g font-family="Archivo Display" font-size="16" fill="${mark}" font-weight="600">
    <text x="470" y="498">Open to full-time</text>
    <text x="470" y="520">roles, Melbourne</text>
    <text x="470" y="542">or remote</text>
  </g>
</svg>`;

mkdirSync(join(root, "public", "og"), { recursive: true });

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: {
    fontFiles: [font("archivo-display"), font("source-serif-body")],
    loadSystemFonts: false,
    defaultFontFamily: "Archivo Display",
  },
});

writeFileSync(join(root, "public", "og", "og-card.png"), resvg.render().asPng());

console.log("Wrote public/og/og-card.png");