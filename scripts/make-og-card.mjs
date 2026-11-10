// One-off generator for public/og/og-card.png (1200x630).
// Re-run with: node scripts/make-og-card.mjs
// Colours match the tokens in src/index.css: paper, ink, muted, border, eucalyptus.
import { Resvg } from "@resvg/resvg-js";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f6f2e8"/>

  <g font-family="Georgia, 'Times New Roman', serif">
    <text x="1120" y="104" text-anchor="end" font-size="44" font-weight="bold" letter-spacing="-1" fill="#251a13">DR</text>
  </g>

  <g font-family="'Courier New', monospace">
    <text x="80" y="98" font-size="22" letter-spacing="6" fill="#574d46">YARRA VALLEY, VICTORIA</text>
  </g>

  <line x1="80" y1="150" x2="1120" y2="150" stroke="#d9d0bf" stroke-width="1"/>

  <g font-family="Georgia, 'Times New Roman', serif">
    <text x="78" y="418" font-size="96" font-weight="bold" letter-spacing="-2" fill="#251a13">Dylan Robinson</text>
  </g>

  <rect x="80" y="452" width="72" height="3" fill="#515c39"/>

  <g font-family="'Courier New', monospace">
    <text x="80" y="530" font-size="26" fill="#574d46">Software developer &#183; Lead web developer and director, CTRL Accounting</text>
  </g>

  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="#d9d0bf" stroke-width="1"/>
</svg>`;

mkdirSync(join(root, "public", "og"), { recursive: true });

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: { loadSystemFonts: true },
});

writeFileSync(
  join(root, "public", "og", "og-card.png"),
  resvg.render().asPng(),
);

console.log("Wrote public/og/og-card.png");