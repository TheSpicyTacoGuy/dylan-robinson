# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: hiring managers and technical leads evaluating Dylan for a full-time software
development role, usually in one short pass before deciding whether an interview is
worth it. Secondary: recruiters scanning for availability, location and work rights;
peers checking the work itself.

## Product Purpose

A personal portfolio for Dylan Robinson, a software developer in the Yarra Valley,
Victoria. It exists so a stranger can see what he has built, how he thinks about
systems, and whether he can be trusted with production work, without needing to read a
CV first. Success: the reader opens a case study and can describe the problem and the
engineering decision behind it afterwards.

## Positioning

Dylan came to software through eight years of computer repair and a stint at the
Powelltown sawmill, and now leads the development of a live tax return application. He
builds the whole thing: schema, API, interface, deployment, and the conversation with
the person using it. The work shown is real and specific, including a pack scanner built
for the timber yard he came from.

## Operating Context

- The site is read on a recruiter's laptop, on a phone between interviews, and in print.
- The CV exists both as a PDF and as a server-rendered page at `/resume/`.
- Work is private or NDA-bound in several cases, so screenshots and descriptions carry
  the proof where a public repository cannot.
- Availability is current: full-time roles, Melbourne or remote, unrestricted Australian
  work rights.

## Capabilities and Constraints

- Fourteen work items: four detailed case studies and ten additional client,
  university and open-source projects.
- Media: webp screenshots at two widths, one mp4 walkthrough with a poster, one portrait.
- No backend, no analytics, no third-party origins. Static hosting on Vercel.
- React 19, Vite 5, Tailwind v4 utilities, hand-written CSS. No router, UI kit or
  animation library.
- Content lives in `src/content.ts` and is shared with the resume page so the two cannot
  disagree.
- The built page carries a Content-Security-Policy meta tag generated at build time.

## Brand Commitments

- The written voice is plain, active and specific. No marketing filler, no invented
  metrics, no invented client names. Private work is labelled private.
- The record sheet is the identity: bone paper, ink rules, one rust mark, a two-line
  masthead and the four facts a recruiter scans first. It must not be replaced with a
  generic portfolio treatment.
- The portrait and the real project screenshots are the only imagery.
- A 2026 explicit constraint from Dylan: clean, fast, well made, distinct and
  memorable; not busy.

## Evidence on Hand

- `public/portrait-tall-*.webp`, `public/portrait-wide-*.webp`
- `public/shots/*` project screenshots and `public/shots/ctrl-flow.mp4`
- `public/four-seasons-*.webp`
- `public/cv/dylan-robinson-resume.pdf`
- Role history, study history and tool groups in `src/content.ts`
- No testimonials, logos, press, download counts or benchmarks exist. Do not fabricate
  any.

## Product Principles

1. The work is the argument. Interface decisions that compete with the work lose.
2. Every claim is traceable to something Dylan actually did, with the constraint that
   made it hard stated plainly.
3. Assume thirty seconds and one thumb. The fastest path to proof is always visible.
4. Fit for a working developer: no effect that costs more than it communicates.
5. Private work is described honestly, never implied to be public.

## Accessibility & Inclusion

Full keyboard path with visible focus on every surface. 44px minimum touch targets.
4.5:1 body contrast and 3:1 large text in both themes. No sideways scroll at 320px. The
career history is semantic HTML and never depends on pointer interaction or animation.
Print produces a clean black-on-white document.
