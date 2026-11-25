// Generates public/cv/dylan-robinson-resume.pdf from the printable CV page.
// Start the dev server first, then run: npm run resume:pdf
// CHROME_PATH or a URL argument can point at another browser or server.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "public", "cv", "dylan-robinson-resume.pdf");
const temporary = `${output}.tmp`;
const url =
  process.argv[2] ??
  process.env.RESUME_URL ??
  "http://localhost:5173/resume/";

const browserPaths = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const browser = browserPaths.find((path) => existsSync(path));
if (!browser) {
  console.error("No Chrome or Edge found. Set CHROME_PATH to a browser binary.");
  process.exit(1);
}

try {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
} catch {
  console.error(`Could not reach ${url}.`);
  console.error("Start the dev server with `npm run dev`, then try again.");
  process.exit(1);
}

mkdirSync(dirname(output), { recursive: true });
rmSync(temporary, { force: true });

const child = spawn(
  browser,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-pdf-header-footer",
    "--virtual-time-budget=8000",
    `--print-to-pdf=${temporary}`,
    url,
  ],
  { stdio: "ignore" },
);

child.on("error", (error) => {
  rmSync(temporary, { force: true });
  console.error(error.message);
  process.exit(1);
});

child.on("exit", (code) => {
  if (code !== 0 || !existsSync(temporary)) {
    rmSync(temporary, { force: true });
    console.error(`Browser exited with code ${code}; the PDF was not written.`);
    process.exit(1);
  }

  rmSync(output, { force: true });
  renameSync(temporary, output);
  console.log(`Wrote ${relative(root, output)}`);
});
