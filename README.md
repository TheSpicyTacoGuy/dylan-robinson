# Dylan Robinson, portfolio

[![checks](https://github.com/TheSpicyTacoGuy/dylan-robinson/actions/workflows/ci.yml/badge.svg)](https://github.com/TheSpicyTacoGuy/dylan-robinson/actions/workflows/ci.yml)

A one page portfolio for Dylan Robinson, a software developer in the Yarra Valley.
React 19, TypeScript, Vite and hand written CSS. No UI kit. No animation library.

Live at <https://dylan-robinson.dev>.

## What is on the page

- **Intro.** Name, portrait, introduction and a direct link to selected work.
- **Work.** Two detailed case studies followed by ten selected client, university
  and open-source projects. Case study screenshots open at full size; the
  additional projects show their screens inline.
- **Facts.** Availability, work rights, recruiter details and contact links.
- **Experience.** A chronological, keyboard- and screen-reader-readable list of roles.
- **Background.** Study, exact GPAs, grouped tools, working style and the supporting
  log illustration.
- **Contact.** Email, LinkedIn, GitHub and the CV.

## Run it

Node 20 or newer. The exact version used is in `.nvmrc`.

```shell
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run lint:design
```

Every push to `main` and every pull request runs the same three checks in
`.github/workflows/ci.yml`: ESLint, the design rules, and a full build. The badge
at the top of this file is that workflow.

## Design checks

Two dependency-free scripts back the review agents. Both are deterministic and
bounded, so they can be run instead of reading a diff.

```shell
npm run lint:design            # whole project
npm run lint:design:changed    # files changed since HEAD
npm run brief -- <paths>       # new selectors, changed declaration values
```

`lint:design` covers what a pattern can decide: em dashes, emoji, dead in-page
anchors, glass, gradient text, hardcoded hex outside tokens, `vw` widths, radius
off the token scale, a border and shadow on one surface, and `!important` outside
the reduced-motion block. It exits `1` on findings.

Prints and mask stops are allowed to use black and white, and the `theme-color`
meta value is allowed to be a literal, because none of those can reference a
token.

`brief` compares the file at `HEAD` with the working copy and reports new and
removed selectors plus every declaration whose value changed. It replaces reading
a raw diff on a restyled file.

## Content

All portfolio and printable-résumé content lives in [src/content.ts](src/content.ts).
Roles need `start` and `end` year numbers (use `null` for the current role); the
Experience list displays them newest first. Selected projects live in `otherProjects`.

Case studies take `plates`, which are the screenshots and their captions. Keep the
`width` and `height` values matched to the generated files.

## Images

Originals live in `source-shots/` and are never shipped. Regenerate the WebP files
with:

```shell
python scripts/build-images.py
```

The script needs Pillow. It writes the portrait crops and the project plates into
`public/`. The Four Seasons screenshots are of the live site, taken November 2026.

The share card is generated separately:

```shell
node scripts/make-og-card.mjs
```

It writes `public/og/og-card.png` at 1200 by 630.

## Fonts

Martian Mono, IBM Plex Sans and JetBrains Mono are self hosted from `public/fonts`.
They are under the SIL Open Font License, with the licence files next to them. The
site makes no third-party font requests. Martian Mono is display, IBM Plex Sans is
body copy, and JetBrains Mono is reserved for data and dates.

## Design

[DESIGN.md](DESIGN.md) holds the direction, the tokens and the rules. Read it before
changing colour, type or layout.

## Animation and security

There is no animation library. The experience list is static; the background log has
one bounded scroll response, pauses offscreen, and paints a still under reduced
motion. The spine progress is a CSS variable written on scroll, so scrolling does not
re-render React.

The hero log is the one piece of real geometry: [src/lib/log3d.ts](src/lib/log3d.ts)
builds two 56 point rings, projects them through a pitch and a yaw rotation with a mild
lens, culls the bark panels facing away with a screen space cross product, sorts
everything by depth and paints it back to front. The convex hull of the two rings is
filled first, so the shape cannot come out see through. [src/components/Log.tsx](src/components/Log.tsx)
owns the canvas: it caps the device pixel ratio at 2, paints once synchronously, pauses
when the hero leaves the viewport, and attaches no scroll listener at all under
`prefers-reduced-motion`. Geometry changes go in `log3d.ts`; the canvas lifecycle does
not need touching.

The production build gets a `Content-Security-Policy` meta tag from
[vite.config.ts](vite.config.ts), with the inline theme script hashed at build time.
If you add an inline script, the plugin hashes only the first one, so move it into a
module instead. The host should also send `frame-ancestors` and `X-Content-Type-Options`
as headers, which a meta tag cannot do.

## Navigation

Section links use clean paths, so the URL bar reads `/work` rather than `/#work`.
They are real links: opening `/work` in a new tab loads the page and scrolls to the
section, which works without JavaScript. A click is intercepted only for a plain
left click and turned into a scroll, so the address bar stays clean and the page
does not reload. `src/lib/nav.ts` holds `pathFor`, `sectionFromPath` and the
`useSectionRouting` hook, and `vercel.json` rewrites each path to `index.html`.
Adding a section means adding it to `sections` in `content.ts` and to the rewrites.

The skip control is a button rather than an anchor, so no link on the page carries
a hash.

## Deploy

Hosted on Vercel, which builds `dist/` with `npm run build`. No configuration is
needed beyond the repository.

`vercel.json` does two things. It rewrites the six section paths to `index.html`,
listed one by one rather than as a catch-all, so `/resume/`, `/assets`, `/shots`
and `/cv` keep resolving to their real files. It also sets the security headers:
`Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`,
`X-Frame-Options`, `frame-ancestors` and a `Permissions-Policy`, plus immutable
caching for `/assets` and `/fonts`.

The build has two entries: the page at `index.html` and the printable CV at
`resume/index.html`. Both are generated by `vite.config.ts`, and both get the CSP meta
tag. The CV is plain DOM in [src/resume/resume.ts](src/resume/resume.ts) reading the
same [src/content.ts](src/content.ts), so a fact is only ever edited once.

## Tests

There is no test runner, and this is a deliberate choice rather than an oversight.
The page has no branching logic worth unit testing; the parts that can be checked
mechanically are checked by `lint:design`, which is deterministic and exits non-zero
on findings. Anything visual is verified in a browser at 1440, 1024, 768 and 390
pixels before it is committed.

## Licence

The code is MIT, see [LICENSE](LICENSE). The written content, the photographs and
the screenshots are not covered by that licence and remain the property of Dylan
Robinson. Do not copy the copy.
