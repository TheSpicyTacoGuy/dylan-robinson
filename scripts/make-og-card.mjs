// One-off generator for public/og/og-card.png (1200x630).
// Re-run with: node scripts/make-og-card.mjs
// Colours match src/index.css: bark band, sand text, lifted eucalyptus.
import { Resvg } from "@resvg/resvg-js";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const centreX = 930;
const centreY = 315;
const rings = Array.from({ length: 13 }, (_, index) => 54 + index * 16.4);
const ringMarkup = rings
  .map(
    (radius, index) =>
      `<circle cx="${centreX}" cy="${centreY}" r="${radius}" fill="none" stroke="${index === 12 ? "#b7d5ae" : "#3a2a1e"}" stroke-width="${index === 12 ? 2.4 : 1.2}" />`,
  )
  .join("\n");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#1f0f08"/>
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="#3a2a1e" stroke-width="1"/>

  <g>
    ${ringMarkup}
    <path d="M ${centreX} ${centreY - 259} A 259 259 0 0 1 ${centreX + 259} ${centreY}" fill="none" stroke="#b7d5ae" stroke-width="3"/>
    <path d="M ${centreX} ${centreY - 140} A 140 140 0 0 1 ${centreX - 140} ${centreY}" fill="none" stroke="#b7d5ae" stroke-width="2" opacity="0.7"/>
    <circle cx="${centreX}" cy="${centreY}" r="4" fill="#b7d5ae"/>
  </g>

  <g font-family="Segoe UI, Arial, sans-serif">
    <text x="80" y="170" font-size="22" letter-spacing="0" fill="#b7d5ae" font-family="Consolas, monospace">Software developer, Yarra Valley</text>
    <text x="78" y="330" font-size="86" font-weight="700" letter-spacing="-4" fill="#ecdfd1">Dylan Robinson</text>
  </g>

  <line x1="80" y1="382" x2="620" y2="382" stroke="#3a2a1e" stroke-width="1"/>

  <g font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#c5b6a6">
    <text x="80" y="440">CTRL Accounting tax return app</text>
    <text x="80" y="478">Four Seasons Horse Rugs site and admin</text>
  </g>

  <g font-family="Consolas, monospace" font-size="18" fill="#b7d5ae">
    <text x="80" y="546">Open to software development roles</text>
    <text x="80" y="572">Melbourne, or remote</text>
  </g>
</svg>`;

mkdirSync(join(root, "public", "og"), { recursive: true });

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: { loadSystemFonts: true },
});

writeFileSync(join(root, "public", "og", "og-card.png"), resvg.render().asPng());

console.log("Wrote public/og/og-card.png");
