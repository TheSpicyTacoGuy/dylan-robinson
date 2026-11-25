# Design direction

## The subject

Dylan Robinson, a software developer in the Yarra Valley. The reader is a hiring
manager or a peer with thirty seconds to decide whether he can build something that
holds up. The page has one job: make the work legible, then make it memorable.

## The idea: a working record

The site is a record sheet rather than a landing page: bone paper, ink linework,
exact rules, and one applied mark. The home is a single title page. The name is set
as a two-line masthead, the claim sits directly under it, the portrait is a square
photograph with a documentary caption, and four facts run across the bottom as a
record strip. Everything else has a page.

The palette is the mill and the survey stake: warm paper, black ink, and the rust
orange of log-marking paint. The accent is information, not decoration. It marks
availability and links, and it is never a wash, gradient or glow.

Two reference points set the level: Jarnket's portfolio, which Dylan named, for a
name treated as a graphic and one committed colour; and Kishor Marasini's one-screen
card, for the discipline of putting only the decision-making facts on the first
screen. Neither site's composition, ground or wordmark is copied.

## Dial

**ENERGY 3 / RHYTHM 2 / MOTION 1.**

The masthead is the loud element. The rest is quiet and structured, with one authored
entrance and no scroll choreography.

## Colour

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--paper` | `#f3ebdd` | `#17130f` | bone paper, the ground |
| `--paper-sunk` | `#ece1cf` | `#221c17` | hover fills, inset surfaces |
| `--ink` | `#221c16` | `#efe6d8` | text and rules of emphasis |
| `--ink-soft` | `#5c5348` | `#b0a391` | secondary text, labels, captions |
| `--rule` | `#d9cdba` | `#322b24` | hairlines between sections and rows |
| `--rule-strong` | `#c2b49d` | `#4a4137` | hairlines that need a little more weight |
| `--mark` | `#b4471f` | `#f08a4b` | availability, links, focus |
| `--mark-on` | `#fff8ee` | `#1a120c` | text on the mark |

The light ground is warm bone, not white and not green-grey. It is the colour of
paper on a bench. The photograph is the only full-colour image and is left natural.
The dark theme is the same record at night, not a separate palette. It starts from
the system preference and is stored per browser.

Measured WCAG contrast:

| Pair | Light | Dark |
| --- | --- | --- |
| ink on paper | 14.24 | 14.94 |
| soft on paper | 6.37 | 7.47 |
| mark on paper | 4.59 | 7.43 |
| ink on sunk paper | 13.26 | 13.62 |

Control borders are ink, so an outlined button keeps a boundary above 3:1. The
availability value is the one accent set at text size; it is not a status dot.

## Type

| Role | Face | Cut | Where |
| --- | --- | --- | --- |
| Display | Archivo | width 115, weight 600 | the name, page and section titles |
| Interface | Archivo | width 100, weight 500 | navigation, buttons, labels, facts |
| Prose | Source Serif 4 | optical size 20, weight 400 | the claim, case study bodies, page intros |

Archivo's width axis is the signature: the name is set wide, the interface normal.
The name breaks across two lines by design, so it reads as a masthead rather than a
heading that happens to be large. The serif is the voice of the writing; the
interface stays in the sans. Figures use Archivo with tabular numerals, not a third
face.

Fonts are self hosted, Latin subsets, instanced to static cuts with fontTools:
`archivo-display` 14.5 kB, `archivo-ui` 14.5 kB, `source-serif-body` 19.2 kB. Only
the two Archivo cuts are preloaded.

Scale: the name is `clamp(3.2rem, 7vw, 6.2rem)` with 0.88 line-height and -0.035em
tracking, two lines at every width. Page titles `clamp(2.1rem, 4.6vw, 3.6rem)`,
section titles `clamp(1.55rem, 2.5vw, 2.15rem)`, the claim `clamp(1.1rem, 1.6vw,
1.4rem)`, body `1.0625rem` at 1.62 line-height. Prose measures stay under 66ch.

There is no kicker above any heading, no tracked-out all-caps label, no section
number, and no italic word inside a heading.

## Layout

A sticky 3.5rem header holds the name, three links, the CV and the theme control. It
sits on the paper with one hairline below.

The home page is one screen, built as a two-column title page with a record strip:

1. **Masthead.** The name on two lines at the left. The square portrait sits at the
   right, top-aligned with the name, with the caption `Yarra Valley, 2026.` below it.
2. **Claim and actions.** `I build the online tax return app at CTRL Accounting,
   where I am lead developer and a director.` in the serif, then `See the work`,
   `CV (PDF)` and `Email me`.
3. **Record strip.** Four facts across the full measure, divided by hairlines:
   Role, Location, Availability and Work rights. Availability is set in the mark.
   This is the record strip of the page and the fastest read on the site.

At 680px the page stacks: name, portrait band, claim, actions, record strip in two
columns (one column at 360px). The page fits one 390x844 screen apart from a few
pixels; at 320px it scrolls a little.

The page is 76rem wide with a `clamp(1.25rem, 5vw, 3.5rem)` gutter. Sections on the
inner pages are separated by a single hairline plus `clamp(3.5rem, 7vw, 6rem)` of
air.

`/work` lists the four case studies with their one-line summaries and stack, then
the remaining work as compact rows. `/work/<slug>` uses one template for all
fourteen items: back link, title, a meta line with hairline separators, the stack,
the summary, a lead plate, the engineering notes, video, the remaining plates, the
private-work note, and the next project. `/experience` carries the roles, study,
tools and background. `/contact` carries the email at display size and the links.
`/resume/` stays a separate static page.

## Controls

`action` is a 2.75rem minimum target with a one-pixel ink border and no shadow;
`action--solid` inverts it to ink. The email address is the one display-size link,
with a two-pixel rule under it. Inline links carry a one-pixel mark-coloured
underline. Focus is a two-pixel mark outline with a three-pixel offset on every
surface. Nothing relies on colour alone.

Plates are screenshots in a hairline frame on the sunk paper. Clicking opens a modal
dialog with previous, next and close, Escape to close, arrow keys to move, and focus
returned to the trigger. Phone captures sit as a set of three at 16rem. The
walkthrough uses native video controls and loads nothing until play. A portrait
recording (the PackScanner capture flow) sits at 20rem with a 1.25rem frame radius,
the only large radius on the site.

## Motion

Three authored moments, each with a job:

- **Masthead.** Each name line rises out of its own mask over 520ms with an
  exponential ease-out, the second line 70ms behind the first. The name assembles;
  the rest of the page fades and rises 8px over 360ms with a 45ms stagger.
- **Theme.** The new ground expands as a circle from the theme button over 450ms
  through the View Transitions API, so the change has a visible origin. Unsupported
  browsers and reduced motion switch instantly.
- **Lightbox.** The dialog fades over 180ms, the backdrop over 200ms, and the stage
  image settles from 98% over 260ms, connecting the thumbnail to the full size.

Route content fades in over 180ms. Hover and focus colour changes take 130ms, and an
underline thickens. Nothing floats, parallaxes, reveals on scroll or loops.
`prefers-reduced-motion` removes the duration and the delay. The page listens to
scroll nowhere.

## Bans

No gradients, no box shadows, no glass, no grain, no background grid or dot pattern,
no parallax, no scroll-progress bar, no reveal-on-scroll, no cards, no numbered
section labels, no all-caps eyebrows, no arrows on every control, no coloured left
stripe, no em dashes, no emoji, no monospace headings. Radius is 2px on controls
and 1.25rem only on phone capture frames. No circular status dots; availability is
written out.

## Accessibility floor

- 4.5:1 body contrast and 3:1 large text, measured in both themes.
- Control boundaries carry the ink colour, above 3:1.
- 44px minimum targets; the footer links are 2.75rem tall.
- Full keyboard path, visible focus, skip link, Escape closes the lightbox.
- Landmarks, one h1 per route, no skipped heading levels.
- No sideways scroll at 320px.
- Print: white ground, black text, header, footer and portrait hidden, sections
  unrolled.

## Voice

Plain sentences, active voice, specific numbers only when they are real. Buttons name
the action and the format (`CV (PDF)`, not `Download` when it opens a PDF). No
marketing filler. Private work is labelled private. There are no invented metrics,
logos, quotes or client names.

## Security

The built page carries a `Content-Security-Policy` meta tag. The only inline script is
the theme bootstrap, so the Vite config hashes it at build time. `default-src 'self'`
for everything else, no third-party origins. `vercel.json` adds `frame-ancestors
'none'` and standard response headers.