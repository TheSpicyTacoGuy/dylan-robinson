#!/usr/bin/env node
/**
 * Bounded summary of what changed, for a reviewer that must not read a raw diff.
 *
 *   node scripts/change-brief.mjs                 every changed file vs HEAD
 *   node scripts/change-brief.mjs src/index.css   just these paths
 *
 * For CSS it reports new and removed selectors and the declarations whose value
 * changed inside selectors that were kept. For markup it reports class names that
 * appeared or disappeared. It compares parsed before and after states rather than
 * diff fragments, so a declaration can never be attributed to the wrong selector.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

const ROOT = process.cwd();
const MAX_LINES_PER_FILE = 50;

const git = (args) => {
  try {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" });
  } catch {
    return "";
  }
};

const explicit = process.argv.slice(2);

const changedFiles = () => {
  const names = new Set([
    ...git(["diff", "--name-only", "HEAD"]).split("\n"),
    ...git(["diff", "--name-only", "--cached"]).split("\n"),
  ]);
  return [...names]
    .map((name) => name.trim())
    .filter(Boolean)
    .filter((name) => existsSync(join(ROOT, name)));
};

const files = explicit.length > 0 ? explicit : changedFiles();

if (files.length === 0) {
  console.log("change-brief: no changed files");
  process.exit(0);
}

const normalize = (text) => text.replace(/\r\n/g, "\n");

const priorText = (file) => normalize(git(["show", `HEAD:${file}`]));

const stripComments = (text) =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");

/** selector -> Map(property -> value). At-rule preludes are not selectors. */
const parseCss = (text) => {
  const blocks = new Map();
  const body = stripComments(text);
  let index = 0;
  let current = null;
  let buffer = "";
  let depth = 0;

  while (index < body.length) {
    const character = body[index];

    if (character === "{") {
      const selector = buffer.trim().replace(/\s+/g, " ");
      buffer = "";
      depth += 1;
      if (selector.startsWith("@")) {
        current = null;
      } else {
        current = selector;
        if (!blocks.has(current)) blocks.set(current, new Map());
      }
      index += 1;
      continue;
    }

    if (character === "}") {
      depth = Math.max(0, depth - 1);
      current = null;
      buffer = "";
      index += 1;
      continue;
    }

    if (character === ";" && depth > 0) {
      const declaration = buffer.trim();
      buffer = "";
      const match = declaration.match(/^([-\w]+)\s*:\s*([\s\S]+)$/);
      if (match && current) {
        blocks.get(current).set(match[1], match[2].replace(/\s+/g, " ").trim());
      }
      index += 1;
      continue;
    }

    buffer += character;
    index += 1;
  }

  return blocks;
};

const classNames = (text) =>
  new Set(
    [...text.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\}|\{([^}]*)\})/g)]
      .flatMap((match) => [match[1] ?? "", match[2] ?? "", match[3] ?? ""])
      .flatMap((value) => value.split(/[^a-zA-Z0-9_-]+/))
      .filter((token) => token && !token.includes("$")),
  );

for (const file of files) {
  const after = existsSync(join(ROOT, file))
    ? normalize(readFileSync(join(ROOT, file), "utf8"))
    : "";
  const prior = priorText(file);
  const extension = extname(file);
  const output = [];

  if (prior === after) {
    output.push("no textual change");
  } else if (extension === ".css") {
    const now = parseCss(after);
    const then = parseCss(prior);

    for (const [selector, properties] of now) {
      if (!then.has(selector)) {
        output.push(`+ ${selector} { ${[...properties.keys()].join(", ")} }`);
      }
    }
    for (const selector of then.keys()) {
      if (!now.has(selector)) output.push(`- ${selector}`);
    }
    for (const [selector, properties] of now) {
      if (!then.has(selector)) continue;
      const previous = then.get(selector);
      for (const [property, value] of properties) {
        if (previous.get(property) !== value) {
          output.push(
            `~ ${selector} { ${property}: ${previous.get(property) ?? "(none)"} -> ${value} }`,
          );
        }
      }
    }
    if (output.length === 0) output.push("no selector or declaration change");
  } else {
    const now = classNames(after);
    const then = classNames(prior);
    const added = [...now].filter((token) => !then.has(token));
    const removed = [...then].filter((token) => !now.has(token));
    if (added.length) output.push(`classes added: ${added.join(", ")}`);
    if (removed.length) output.push(`classes removed: ${removed.join(", ")}`);
    if (!added.length && !removed.length) {
      output.push("markup changed, no class change");
    }
  }

  console.log(`\n${file}`);
  for (const line of output.slice(0, MAX_LINES_PER_FILE))
    console.log(`  ${line}`);
  if (output.length > MAX_LINES_PER_FILE) {
    console.log(`  ... ${output.length - MAX_LINES_PER_FILE} more`);
  }
}
