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

- ENERGY 2. Confident, not loud.
- RHYTHM 3. Bands alternate, plates are staggered, the spine is constant.
- MOTION 2. One draw-in for the rings, hover answers, nothing loops.

One memorable thing: the ring timeline in History. Everything else is disciplined.

## Colour

Brown leads. Warm sand is the page ground, bark is the ink, clay closes the page, and
eucalyptus is the only cool note, saved for links and active marks. There is no cream
and no off-white: the ground sits at 91% lightness with a real warm cast, so it reads
as a surface with colour rather than a default page.

| Token | Light | Role |
| --- | --- | --- |
| `--background` | `oklch(91% 0.024 70)` | warm sand, the page ground |
| `--sunk` | `oklch(86.8% 0.03 68)` | a deeper sand for the About band |
| `--foreground` | `oklch(23.5% 0.028 52)` | bark, text |
| `--muted` | `oklch(41.5% 0.03 56)` | secondary text |
| `--separator` | `oklch(80% 0.028 66)` | rules and dividers |
| `--accent` | `oklch(44.5% 0.078 148)` | eucalyptus, links and active marks |
| `--bark-band` | `oklch(19% 0.03 46)` | the dark bands |
| `--contact-bg` | `oklch(70% 0.06 40)` | the closing band, a warm clay |

Dark is the same photograph at night: deep brown ground, sand text, eucalyptus lifted,
and the contact band deepens to `oklch(30% 0.05 40)` so it stays clay rather than
going bright.

The bark band stays dark in both themes, the way a cover does. The contact band is
the one loud surface, and it is a full screen tall so it can also meet the top of the
window when its nav link is used.

Each band scopes its own `--fg`, `--fg-muted`, `--line` and `--band-accent`, so focus
rings, underlines and hover states are correct on every surface without any
`!important`, blend mode or per-section overrides.

Every text pair was measured from these values: lowest body pair 5.47, lowest
secondary pair 4.54, most between 6 and 15.

## Type

- Display: Archivo, variable weight and width, self-hosted. Set at weight 700 and
  `font-stretch: 88%` to `94%`, so headings are slightly condensed and technical
  rather than soft or rounded.
- Body: IBM Plex Sans, variable weight, self-hosted.
- Data: IBM Plex Mono, used only where the content is genuinely a measurement: the
  months and year readout in the ring diagram. Everything else that used to be mono
  is body text at 0.75rem to 0.8rem with tabular numerals.

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

One parallax scene runs the whole page: a single scroll listener and one
requestAnimationFrame loop walks every element carrying `data-parallax`, skips
anything outside the viewport, and writes a custom property. Layers travel at
different depths, so the hero ring field drifts slowest, the portrait counter-moves,
and the plates breathe at alternating rates. Transform only, never layout.

`prefers-reduced-motion` turns the draw, the parallax and the smooth scroll off.

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
