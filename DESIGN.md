# Design direction

## The subject

Dylan Robinson, a software developer in the Yarra Valley. The audience is a hiring
manager or a peer with thirty seconds to decide whether he can build something that
holds up. The page has one job: make the work legible, then make it memorable.

## The idea: annual rings

A cut section of a career. The log carries the annual-ring motif; the experience
section keeps roles in a plain chronological list so dates and employers are easy to
scan. The site should read as a record of time served, not as a template with a
portfolio inside it.

The world is warm because the portrait is warm. It is not a newspaper: no hairline
columns everywhere, no cream plus serif plus clay. The type is a modern grotesque, the
layout is a spine and full-bleed bands, and the accent closes the page as a surface.

## Dials

- Display: Martian Mono 700 for the name and headings.
- Body: IBM Plex Sans 400 and 600 for prose and controls.
- Data: JetBrains Mono 400 for dates and measurements.

Only Latin subsets are shipped. Body is 1rem with 1.65 line-height and a measure under
72ch. Display scales from `2.2rem` to `4.6rem`; section titles from `1.6rem` to
`2.4rem`; case titles from `1.15rem` to `1.4rem`. Display tracking is -0.02em.
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

- Display: Martian Mono 700 for the name and headings.
- Body: IBM Plex Sans 400 and 600 for prose and controls.
- Data: JetBrains Mono 400 for dates and measurements.

Only Latin subsets are shipped. Body is 1rem with 1.65 line-height and a measure under
72ch. Display scales from `2.2rem` to `4.6rem`; section titles from `1.6rem` to
`2.4rem`; case titles from `1.15rem` to `1.4rem`. Display tracking is -0.02em.

There is no kicker above any heading, no tracked-out label, no all-caps, no italic
word inside a heading, and no section numbers. The heading carries its own weight.

## Layout

A fixed 88px spine on the left holds the mark, the section index, the theme toggle and
the links. It never sits over a dark band, so it needs no colour swap and no glass.
The index is labels only, with a eucalyptus bar marking the active section. No
numbers; the Experience section owns the chronology. At 900px and below the spine
becomes a sticky top bar, and the scroll offset switches to its height so a section
meets the bar exactly.

Bands run from the spine to the right edge:

1. Hero, bark, with the portrait beside the introduction.
2. Work, sand, immediately after the introduction.
3. Facts, sand, for availability and recruiter details.
4. History, bark.
5. Background, sunk sand. A second, deeper tone so the two light bands do not run
   together. The log sits here as a supporting reference to the sawmill years.
6. Contact, clay, with the colophon inside it. It is a full screen tall so it can also
   meet the top of the window when its nav link is used.

Inside a band, a 12 column grid with a maximum content width of 82rem. Plates break to
the band's right edge and are staggered by column and offset. Nothing is a card. Radius
is 2px, only on controls and the lightbox.

A case puts its spec beside the body on wide screens. The spec is a fixed panel with a
eucalyptus left rule, never sticky: sticky let it float over the plates.

At 900px the spine becomes a sticky top bar and the bands stack. The portrait uses its
native 4:5 crop at all sizes, narrowing to 16rem on small phones without enlarging the
face.

## Experience list

Roles are presented newest first as semantic list items. Dates, employer, title and
location remain visible together, including overlapping work. No hover, pointer
target or animation is needed to reveal the career history.

## Motion

The log's small scroll-tied turn is the authored motion. The experience list stays
still; the spine progress follows scroll.

## The log

The Background band carries one supporting object: a log, drawn on a canvas with about
150 lines of projection code and no 3D library. It sits after the study and tools, away
from the hero's introduction and the Work section.

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
- **Motion.** As its scene scrolls away, the log rolls about 30 degrees, then rests.
  The turn is tied to the scene's passage, not to the whole page. It is an illustration,
  not a second interactive feature; there is no drag control or load animation.
  Reduced motion paints one frame and attaches no scroll listener.
- **Cost.** One canvas, capped at 2x device pixel ratio, redrawn only while the target
  is moving and paused entirely when its scene leaves the viewport.

The log canvas is decorative and `aria-hidden`. The experience history is semantic
HTML, available without pointer interaction or animation.

One parallax scene runs the whole page: a single scroll listener and one
requestAnimationFrame loop walks every element carrying `data-parallax`, skips
anything outside the viewport, and writes a custom property. The portrait and project
plates move slightly at different rates. Transform only, never layout.

`prefers-reduced-motion` turns parallax, log smoothing and smooth scroll off. The log
paints once at a fixed angle.

## Security

The built page carries a `Content-Security-Policy` meta tag. The only inline script is
the theme bootstrap, so the Vite config hashes it at build time rather than keeping a
hash by hand. `default-src 'self'` for everything else, no third-party origins.
`vercel.json` adds `frame-ancestors 'none'` and standard response security headers,
because framing policy is not enforced from a meta tag.

## Voice

Plain sentences, active voice, specific numbers only when they are real. Buttons name
the action. No em dashes. No marketing filler. Private work is labelled private. There
are no invented metrics, logos, quotes or client names.

## Accessibility floor

- 44px minimum targets at touch sizes.
- 4.5:1 body contrast and 3:1 large text, measured in both themes on every band.
- Full keyboard path, visible focus on every surface, Escape closes the lightbox.
- No sideways scroll at 320px.
- Print: white ground, black text, spine hidden, bands unrolled.
