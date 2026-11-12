#!/usr/bin/env node
/**
 * Deterministic design lint for this repository.
 *
 * Checks the rules a pattern can decide, so a review agent does not spend reads
 * re-deriving them. One line per finding: `path:line rule message`.
 *
 *   node scripts/design-lint.mjs --changed
 *   node scripts/design-lint.mjs src/index.css src/sections/Work.tsx
 *
 * Exit code 0 when clean, 1 when there are findings.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync, statSync } from "node:fs";
import { readdirSync } from "node:fs";
import { join, relative, extname } from "node:path";

const ROOT = process.cwd();
const SCAN_EXTENSIONS = new Set([".css", ".tsx", ".ts", ".html"]);
const IGNORED_DIRS = new Set(["node_modules", "dist", ".git", "source-shots"]);

const args = process.argv.slice(2);
const changedOnly = args.includes("--changed");
const explicit = args.filter((arg) => !arg.startsWith("--"));

const gitFiles = (gitArgs) => {
  try {
    return execFileSync("git", gitArgs, { cwd: ROOT, encoding: "utf8" })
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
};

const isIgnored = (path) =>
  path.split(/[\\/]/).some((part) => IGNORED_DIRS.has(part));

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) walk(full, out);
    } else if (SCAN_EXTENSIONS.has(extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
};

const resolveTargets = () => {
  if (explicit.length > 0) {
    return explicit.flatMap((target) => {
      const full = join(ROOT, target);
      if (!existsSync(full)) return [];
      return statSync(full).isDirectory() ? walk(full) : [full];
    });
  }

  if (changedOnly) {
    const names = [
      ...gitFiles(["diff", "--name-only", "HEAD"]),
      ...gitFiles(["diff", "--name-only", "--cached"]),
      ...gitFiles(["ls-files", "--others", "--exclude-standard"]),
    ];
    return [...new Set(names)]
      .filter((name) => SCAN_EXTENSIONS.has(extname(name)))
      .filter((name) => !isIgnored(name))
      .map((name) => join(ROOT, name))
      .filter((full) => existsSync(full));
  }

  return [
    ...walk(join(ROOT, "src")),
    ...["index.html", "resume/index.html"]
      .map((name) => join(ROOT, name))
      .filter((full) => existsSync(full)),
  ];
};

const findings = [];
const add = (file, line, rule, message) => {
  findings.push({
    file: relative(ROOT, file).replace(/\\/g, "/"),
    line,
    rule,
    message,
  });
};

/** Every id the project actually renders or declares, for dead anchor checks. */
const collectIds = (files) => {
  const ids = new Set();
  const idPattern = /\bid=(?:"|{")"?'?([a-z0-9-]+)/gi;
  const contentIdPattern = /\bid:\s*"([a-z0-9-]+)"/gi;
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(idPattern)) ids.add(match[1]);
    for (const match of text.matchAll(contentIdPattern)) ids.add(match[1]);
  }
  return ids;
};

const files = resolveTargets();
const ids = collectIds(files);

const EMOJI = /\p{Extended_Pictographic}/u;
const ALLOWED_RADII = new Set([
  "0",
  "2px",
  "3px",
  "50%",
  "999px",
  "var(--radius)",
]);

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  const isCss = extname(file) === ".css";
  let inReducedMotion = false;
  let reducedDepth = 0;
  let inPrint = false;
  let printDepth = 0;
  let declaration = "";

  /**
   * Mask stops and scrim overlays are not palette colours: black there means
   * alpha, not ink. Print forces black on white because the paper does.
   */
  const isNonPaletteColour = (line) => {
    if (inPrint) return true;
    if (/mask/.test(line)) return true;
    if (/color-mix\(/.test(line) && /#(?:000|fff)\b/i.test(line)) return true;
    // The browser-chrome theme colour is a meta value, so it cannot be a token.
    if (/theme[-_ ]?color/i.test(line)) return true;
    return false;
  };

  lines.forEach((raw, index) => {
    const line = index + 1;
    const trimmed = raw.trim();
    if (!trimmed) return;

    // A declaration can wrap across lines, so keep the whole statement in view.
    declaration += ` ${raw}`;
    const statementEnds =
      trimmed.endsWith(";") || trimmed.endsWith("{") || trimmed.endsWith("}");

    if (trimmed.startsWith("//") && !isCss) {
      // Comments still count for em dashes and emoji.
    }

    if (raw.includes("\u2014")) {
      add(
        file,
        line,
        "em-dash",
        "em dash in source; use a comma or a full stop",
      );
    }

    if (EMOJI.test(raw)) {
      add(file, line, "emoji", "emoji in source; draw an SVG icon instead");
    }

    if (!isCss) {
      for (const match of raw.matchAll(/href="#([a-z0-9-]+)"/gi)) {
        if (!ids.has(match[1])) {
          add(
            file,
            line,
            "dead-link",
            `href="#${match[1]}" has no matching id`,
          );
        }
      }
      for (const match of raw.matchAll(/#[0-9a-f]{6}\b/gi)) {
        if (isNonPaletteColour(raw)) continue;
        add(
          file,
          line,
          "hardcoded-hex",
          `hex colour ${match[0]} outside a token`,
        );
      }
    }

    if (!isCss) return;

    if (trimmed.includes("@media") && trimmed.includes("print")) {
      inPrint = true;
      printDepth = 0;
    }
    if (inPrint) {
      printDepth += (raw.match(/{/g) ?? []).length;
      printDepth -= (raw.match(/}/g) ?? []).length;
      if (printDepth <= 0 && trimmed.includes("}")) inPrint = false;
    }

    if (
      trimmed.includes("@media") &&
      trimmed.includes("prefers-reduced-motion")
    ) {
      inReducedMotion = true;
      reducedDepth = 0;
    }
    if (inReducedMotion) {
      reducedDepth += (raw.match(/{/g) ?? []).length;
      reducedDepth -= (raw.match(/}/g) ?? []).length;
      if (reducedDepth <= 0 && trimmed.includes("}")) inReducedMotion = false;
    }

    if (trimmed.includes("!important") && !inReducedMotion) {
      add(
        file,
        line,
        "important",
        "!important outside the reduced-motion block",
      );
    }

    if (/(?:backdrop-filter|-webkit-backdrop-filter)\s*:/.test(trimmed)) {
      add(
        file,
        line,
        "glass",
        "backdrop-filter; only allowed for a named effect",
      );
    }

    if (/(?:-webkit-)?background-clip\s*:\s*text/.test(trimmed)) {
      add(
        file,
        line,
        "gradient-text",
        "gradient text; use weight or size instead",
      );
    }

    if (/\b(?:width|min-width|max-width)\s*:\s*[\d.]+vw/.test(trimmed)) {
      add(file, line, "viewport-width", "vw width; can force sideways scroll");
    }

    const radius = trimmed.match(/border-radius\s*:\s*([^;]+);?/);
    if (radius) {
      const value = radius[1].trim();
      if (!ALLOWED_RADII.has(value) && !value.startsWith("calc(")) {
        add(
          file,
          line,
          "radius",
          `border-radius ${value} is off the token scale`,
        );
      }
    }

    if (/^\s*--[\w-]+\s*:/.test(raw)) {
      declaration = "";
      return;
    }

    if (trimmed.endsWith("{") || trimmed.startsWith("}")) {
      declaration = "";
      return;
    }

    const hex = trimmed.match(/#[0-9a-f]{3,8}\b/i);
    if (hex && !isNonPaletteColour(declaration)) {
      add(file, line, "hardcoded-hex", `hex colour ${hex[0]} outside a token`);
    }

    if (statementEnds) declaration = "";
  });

  // Shadow plus border on one surface is the ghost card.
  for (const match of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const [, selector, body] = match;
    if (!/box-shadow\s*:/.test(body)) continue;
    if (!/border\s*:\s*(?!0)/.test(body)) continue;
    const line = text.slice(0, match.index).split(/\r?\n/).length;
    add(
      file,
      line,
      "ghost-card",
      `${selector.trim().split(/\s+/)[0]} has both a border and a shadow`,
    );
  }
}

findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);

if (findings.length === 0) {
  console.log(`design-lint: clean (${files.length} files)`);
  process.exit(0);
}

for (const finding of findings) {
  console.log(
    `${finding.file}:${finding.line} ${finding.rule} ${finding.message}`,
  );
}
console.log(
  `design-lint: ${findings.length} findings in ${files.length} files`,
);
process.exit(1);
