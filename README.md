# Dylan Robinson, portfolio

[![checks](https://github.com/TheSpicyTacoGuy/dylan-robinson/actions/workflows/ci.yml/badge.svg)](https://github.com/TheSpicyTacoGuy/dylan-robinson/actions/workflows/ci.yml)

A portfolio for Dylan Robinson, a software developer in the Yarra Valley. React 19,
TypeScript, Vite and hand written CSS. No UI kit, router library or animation library.

Live at <https://dylan-robinson.dev>.

## Routes

| Route | What it is |
| --- | --- |
| `/` | One-screen title page: name, claim, portrait, four facts and contact links |
| `/work` | All work: the four case studies, then a compact list of the rest |
| `/work/<slug>` | One detail template for every case study and project |
| `/experience` | Roles, study, tools and background |
| `/contact` | Email and links |
| `/resume/` | A separate, printable CV built from the same content |

The old section paths (`/intro`, `/facts`, `/history`, `/background`, `/about`,
`/#contact`) resolve to the equivalent page. `src/lib/router.ts` holds the route
parser, link handling and the legacy map.

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

All portfolio and printable-resume content lives in [src/content.ts](src/content.ts).
Roles need `start` and `end` year numbers (use `null` for the current role); the
experience list reads them in order.

Three lists feed the pages:

- `caseStudies` are the four detailed pieces and carry `facts`, `plates` and
  sometimes a `clip`.
- `otherProjects` are the remaining client, university and open-source projects.
- `workItems` joins both into one shape for routing and the detail template, and
  gives each item a slug. Slugs are the case study `id`, or a slugified title for
  everything else.

Keep each screenshot's `width` and `height` matched to the generated file. A case
study made of phone captures sets `platesLayout: "phones"`, which lays three of them
side by side and opens the lightbox on a portrait stage.

**Adding a project needs one more step:** add its path to the rewrites in
`vercel.json` and to `public/sitemap.xml`. The rewrites are listed one by one rather
than as a catch-all so `/resume/`, `/assets`, `/fonts`, `/shots` and `/cv` always
resolve to their real files.

## Images

Originals live in `source-shots/` and are never shipped. Regenerate the WebP files
with:

```shell
python scripts/build-images.py
```

The script needs Pillow. It writes the portrait crops, the project plates and the
phone captures into `public/`. The PackScanner captures are phone screenshots from
the app, and the case study carries a 14 second screen recording of the capture flow
in the `clip` field.

The share card is generated separately:

```shell
npm run og
```

It writes `public/og/og-card.png` at 1200 by 630. resvg cannot read WOFF2, so
`scripts/og-fonts/` holds TTF instances of the cuts the card draws. Regenerate those
with fontTools if the fonts change.

## Fonts

Archivo and Source Serif 4 are self hosted from `public/fonts` under the SIL Open
Font License, with the licence files beside them. The site makes no third-party font
requests.

- Archivo is instanced twice: width 115 at weight 600 for display, width 100 at
  weight 500 for the interface.
- Source Serif 4 is instanced at optical size 20, weight 400, for prose.

Only the two Archivo cuts are preloaded. See [DESIGN.md](DESIGN.md) for the full type
system and the reason for each face.

## Design

[DESIGN.md](DESIGN.md) holds the direction, the dials, the tokens, the contrast
measurements and the rules. Read it before changing colour, type or layout.

## Motion and interactivity

There is no animation library and no scroll listener. The authored motion is the
home masthead rising line by line out of a mask, a 360ms staggered rise for the rest
of the title page, a 180ms route fade, the theme expanding as a circle from its
button through the View Transitions API, and a 180 to 260ms lightbox entrance.
`prefers-reduced-motion` removes the duration and the stagger, and the theme switches
instantly.

The lightbox uses a native `<dialog>`, closes on Escape, moves with the arrow keys,
and returns focus to the thumbnail that opened it.

## Security

The production build gets a `Content-Security-Policy` meta tag from
[vite.config.ts](vite.config.ts), with the inline theme script hashed at build time.
If you add an inline script, the plugin hashes only the first one, so move it into a
module instead. The host should also send `frame-ancestors` and `X-Content-Type-Options`
as headers, which a meta tag cannot do.

## Deploy

Hosted on Vercel, which builds `dist/` with `npm run build`.

`vercel.json` rewrites the app routes to `index.html`, one path at a time. It also
sets the security headers: `Strict-Transport-Security`, `X-Content-Type-Options`,
`Referrer-Policy`, `X-Frame-Options`, `frame-ancestors` and a `Permissions-Policy`,
plus immutable caching for `/assets` and `/fonts`.

The build has two entries: the app at `index.html` and the printable CV at
`resume/index.html`. Both are generated by `vite.config.ts`, and both get the CSP meta
tag. The CV is plain DOM in [src/resume/resume.ts](src/resume/resume.ts) reading the
same [src/content.ts](src/content.ts), so a fact is only ever edited once.

## Tests

There is no test runner, and this is a deliberate choice rather than an oversight.
The app has little branching logic worth unit testing; the parts that can be checked
mechanically are checked by `lint:design`, which is deterministic and exits non-zero
on findings. Anything visual is verified in a browser, in both themes, at 1440, 1024,
768 and 390 pixels, with the keyboard as well as the mouse.

## Licence

The code is MIT, see [LICENSE](LICENSE). The written content, the photographs and
the screenshots are not covered by that licence and remain the property of Dylan
Robinson. Do not copy the copy.
