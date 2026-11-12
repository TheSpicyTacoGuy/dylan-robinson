# Design direction

## The subject

Dylan Robinson, a software developer in the Yarra Valley. The audience is a hiring
manager or a peer with thirty seconds to decide whether he can build something that
holds up. The page has one job: make the work legible, then make it memorable.

## The idea: annual rings

A cut section of a career. Every ring is a year. The rings are not wallpaper: they are
the timeline, the hero field and the progress mark. The site should read as a record of
time served, not as a template with a portfolio inside it.

The world is warm because the portrait is warm. It is not a newspaper: no hairline
columns everywhere, no cream plus serif plus clay. The type is a modern grotesque, the
layout is a spine and full-bleed bands, and the accent closes the page as a surface.

## Dials

- Display: Martian Mono, weights 400, 500 and 700, self hosted. The wide, squared
  lettering gives the name and section headings a plotted, technical voice.
- Body: IBM Plex Sans, weights 400 and 600, self hosted. Prose and controls use a
  proportional face so a hiring manager can scan the story without reading a page
  that looks like source code.
- Data: JetBrains Mono, weight 400, self hosted. Dates, measurements and ring labels
  stay monospaced where fixed-width numerals help.

The three families have separate jobs: display, reading and data. Only Latin subsets
are shipped. Body is a steady 1rem with 1.65 line-height and a measure under 72ch.
Display scales from `2.2rem` to `4.6rem`; section titles from `1.6rem` to `2.4rem`;
case titles from `1.15rem` to `1.4rem`. Display tracking is -0.02em; nothing goes
tighter.
| Token | Light | Role |
| --- | --- | --- |
| `--background` | `oklch(92% 0.018 76)` | soft warm sand, the page ground |
| `--sunk` | `oklch(88% 0.022 72)` | a deeper sand for the About band |
| `--foreground` | `oklch(23.5% 0.028 52)` | bark, text |
| `--muted` | `oklch(42% 0.022 56)` | secondary text |
| `--separator` | `oklch(81% 0.022 68)` | rules and dividers |
| `--accent` | `oklch(43.5% 0.052 145)` | muted eucalyptus, links and active marks |
| `--bark-band` | `oklch(21% 0.026 48)` | lifted walnut bark |
| `--contact-bg` | `oklch(70% 0.06 40)` | the closing band, a warm clay |

Dark is the same photograph at night: a lifted deep-brown ground, sand text, and a
softer eucalyptus accent. The contact band deepens to `oklch(30% 0.05 40)` so it
stays clay rather than going bright.

The bark band stays dark in both themes, the way a cover does. The contact band is
the one loud surface, and it is a full screen tall so it can also meet the top of the
window when its nav link is used.

Each band scopes its own `--fg`, `--fg-muted`, `--line` and `--band-accent`, so focus
rings, underlines and hover states are correct on every surface without any
`!important`, blend mode or per-section overrides.

Every text pair was measured from these values: lowest body pair 5.47, lowest
secondary pair 4.54, most between 6 and 15.

## Type

- Display: Martian Mono, weight 700, self hosted. A wide, squared technical mono, so
  the headings read like something drawn on a plotter rather than set in a brochure.
  10KB per weight, latin subset only.
- Body: JetBrains Mono, weights 400 and 600, self hosted. A tall x-height mono that
  stays readable at 1rem and gives every number in the case studies the same width.
- There is no third face. The two monos differ in width and weight rather than in
  genre, which is what keeps the page from reading as a font salad. All five files
  total 72KB.

Scale: display `clamp(2.9rem, 6.4vw, 6rem)`, section title
`clamp(2rem, 4.2vw, 3.3rem)`, case title `clamp(1.4rem, 2.1vw, 1.85rem)`, body
`clamp(1rem, 0.22vw + 0.95rem, 1.08rem)`. Display tracking is -0.03em, which is the
floor; nothing goes tighter. Body line-height 1.65, measure under 72 characters.

There is no kicker above any heading, no tracked-out label, no all-caps, no italic
word inside a heading, and no section numbers. The heading carries its own weight.

## Layout

A fixed 88px spine on the left holds the mark, the section index, the theme toggle and
the links. It never sits over a dark band, so it needs no colour swap and no glass.
The index is labels only, with a eucalyptus bar marking the active section. No
numbers, and no timeline: the timeline belongs to the ring legend, where it describes
a career rather than a menu. At 900px and below the spine becomes a sticky top bar,
and the scroll offset switches to its height so a section meets the bar exactly.

Bands run from the spine to the right edge:

1. Hero, bark.
2. Work, sand.
3. History, bark.
4. Background, sunk sand. A second, deeper tone so the two light bands do not run
   together.
5. Contact, clay, with the colophon inside it. It is a full screen tall so it can also
   meet the top of the window when its nav link is used.

Inside a band, a 12 column grid with a maximum content width of 82rem. Plates break to
the band's right edge and are staggered by column and offset. Nothing is a card. Radius
is 2px, only on controls and the lightbox.

A case puts its spec beside the body on wide screens. The spec is a fixed panel with a
eucalyptus left rule, never sticky: sticky let it float over the plates.

At 900px the spine becomes a sticky top bar. The bands stack, plates go full width, and
the ring diagram keeps the legend below it. At 760px the hero portrait switches to a
4:5 crop, so the subject is not a letterbox strip.

## The ring timeline

- One ring per year, 2014 to the current year, innermost first. The rings fill
  almost the whole band, so the section reads as one continuous cut with hairline
  divisions rather than a stack of separate hoops.
- Twelve month sectors per ring, January at the top, clockwise. An accent marker
  outside the outermost ring shows how much of this year has run.
- A role paints every year it was held. Roles that overlap in a year are split into
  radial tracks so no arc sits on another.
- The current year is drawn to the current month. Years only: a role that starts or
  ends mid year is drawn as the full year, and the caption says so.
- **Hit testing is geometric, not per element.** Pointer position is converted to a
  radius and an angle: the radius picks the ring and the track, the angle picks the
  month. The whole annulus is a target, so the gaps between arcs never clear the
  selection and the diagram cannot flicker. This replaced per arc hover handlers,
  which flickered whenever the pointer crossed a gap.
- The legend is a column of bordered boxes beside the rings. A vertical rule runs
  down their margin with a node per role and a short connector into each box, so the
  list reads as a career timeline. Hover, focus or tap lights that role's arcs and
  writes the span in the centre. Click or tap pins it. Arrow keys move, Escape clears.
- Colour is never the only signal. The active box carries a eucalyptus border and
  tinted fill, its node fills and grows, and the button sets `aria-pressed`; the active
  arcs gain stroke width.
- The SVG is `aria-hidden`. The legend and caption carry the information.
- The draw is a CSS dash offset on a normalised path, triggered once by an
  IntersectionObserver. No animation library.

## Motion

The rings draw once when the band enters view, 1s, ease out. The spine progress line
follows scroll. Hover transitions are 150ms.

## The log

The hero carries one object: a log, drawn on a canvas with about 150 lines of
projection code and no 3D library.

- **Geometry.** A real cylinder. Two end rings of 56 points, a bark panel joining each
  pair, all of it rotated on a pitch axis and a yaw axis and projected with a mild
  lens (camera 9 units, so the near end is roughly 20% larger than the far one).
- **Bark roughness.** The radius of each ring point is nudged by three layered sine
  frequencies, fixed per segment, so the outline is rugged the way stringybark is
  rather than a machined circle.
- **Depth.** Every end and every bark panel goes into a single queue with its depth,
  the queue is sorted, and then it is painted. That is what makes it solid: the wall
  hides the far end, the near end hides the inside of the wall. Panels facing away are
  culled in screen space with a cross product, so the inside of the far wall is never
  drawn.
- **Opaque first.** The convex hull of the two rings is filled in bark before anything
  else is laid on it, and stroked with a 6px fringe. A row that grazes a nearly flat
  part of the outline therefore still comes out solid. Measured over 216 angles, the
  count of pixels inside the log that are less than 78% opaque is zero.
- **Bark.** Each panel is cut into four lengthwise strips with a fixed per-strip tone
  offset, plus a deeper fibre down some panels. The offsets are hashed from the panel
  index, so the texture rides round with the log and never crawls as it turns.
- **The ends.** The one facing the reader is filled pale and carries the traced growth
  rings, the radial checks and the pith, clipped to its own outline. It also gets a
  bark collar, which separates the sawn face from the wall.
- **Shadow.** A soft ellipse at the lowest point of the silhouette, drawn before the
  log, so it stays on the ground under it however the log turns.
- **Motion.** As the hero scrolls away, the log rolls about 30 degrees, then rests.
  The turn is tied to the hero's passage, not to the whole page. It is an illustration,
  not a second interactive feature; there is no drag control or load animation.
  Reduced motion paints one frame and attaches no scroll listener.
- **Cost.** One canvas, capped at 2x device pixel ratio, redrawn only while the target
  is moving and paused entirely when the hero leaves the viewport.

The ring timeline in History is the same data told again in two dimensions, and it is
the accessible version: the canvas is decorative and `aria-hidden`; the role legend
and caption carry the information.

One parallax scene runs the whole page: a single scroll listener and one
requestAnimationFrame loop walks every element carrying `data-parallax`, skips
anything outside the viewport, and writes a custom property. Layers travel at
different depths, so the hero ring field drifts slowest, the portrait counter-moves,
and the plates breathe at alternating rates. Transform only, never layout.

`prefers-reduced-motion` turns the draw, the parallax, the smoothing in the log and
the smooth scroll off, and the log paints once at a fixed angle.

## Security

The built page carries a `Content-Security-Policy` meta tag. The only inline script is
the theme bootstrap, so the Vite config hashes it at build time rather than keeping a
hash by hand. `default-src 'self'` for everything else, no third-party origins, no
`frame-ancestors` in the meta (browsers ignore it there, so the host must set it as a
header).

## Voice

Plain sentences, active voice, specific numbers only when they are real. Buttons name
the action. No em dashes. No marketing filler. Private work is labelled private. There
are no invented metrics, logos, quotes or client names.

## Accessibility floor

- 44px minimum targets at touch sizes.
- 4.5:1 body contrast and 3:1 large text, measured in both themes on every band.
- Full keyboard path, visible focus on every surface, Escape closes the lightbox and
  clears a pinned ring.
- No sideways scroll at 320px.
- Print: white ground, black text, spine hidden, bands unrolled.
