# Dylan Robinson, portfolio

A one page portfolio for Dylan Robinson, a software developer in the Yarra Valley.
React 19, TypeScript, Vite and hand written CSS. No UI kit.

## What is on the page

- **Intro.** The name, the roles he is open to, three facts and a wide portrait.
- **Work.** Two case studies, the CTRL Accounting tax return app and the Four
  Seasons Horse Rugs site, then an index of three smaller builds. Every screenshot
  opens at full size.
- **History.** An interactive ring timeline. One ring per year from 2014, filed as one
  continuous section with month divisions. Point at a ring or pick a role to light it.
- **Background.** Study and the tools, grouped.
- **Contact.** Email, LinkedIn, GitHub and the CV.

## Run it

```shell
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## Content

All copy lives in [src/content.ts](src/content.ts). A role needs `start` and `end`
year numbers (use `null` for the current role), and the ring timeline picks it up
without any other change.

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

Archivo, IBM Plex Sans and IBM Plex Mono are self hosted from `public/fonts`. They are
under the SIL Open Font License, with the licence files next to them. The site makes
no third party requests. Archivo carries every heading, the name and the email;
Plex Sans carries body and labels; Plex Mono survives only for the ring diagram's
months and year readout.

## Design

[DESIGN.md](DESIGN.md) holds the direction, the tokens and the rules. Read it before
changing colour, type or layout.

## Animation and security

There is no animation library. The ring draw is a CSS dash offset triggered by an
IntersectionObserver, and the spine progress is a CSS variable written on scroll, so
scrolling does not re-render React. Keep it that way: the bundle is 223KB, and a motion
library was most of the 130KB that came out of it.

The production build gets a `Content-Security-Policy` meta tag from
[vite.config.ts](vite.config.ts), with the inline theme script hashed at build time.
If you add an inline script, the plugin hashes only the first one, so move it into a
module instead. The host should also send `frame-ancestors` and `X-Content-Type-Options`
as headers, which a meta tag cannot do.

## Deploy

`npm run build` writes `dist/`. Upload the contents of `dist/` to the host. The site
is static and needs no server.
