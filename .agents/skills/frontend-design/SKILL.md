---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Use when a page, component or layout must look chosen rather than generated: choosing a palette, a type scale, a layout concept, or a memorable structural device, and recognising the stock treatments that make generated pages read as templated.
license: Adapted from Anthropic's frontend-design skill. Rules restated for this project.
---

# Frontend Design

Act as the design lead at a studio that gives every client an identity nobody could
mistake for another client's. The client has already rejected work that felt
templated, and is paying for a point of view. Make deliberate choices about
palette, type and layout that come from this subject, and take a real aesthetic
risk where it is justified.

The brief always wins. When this project's `DESIGN.md` pins a direction, follow it
exactly, including where it asks for something the tells list below would
otherwise flag. Those rules apply to the axes the brief leaves free.

## Start from the subject

Before designing anything, name three things: the subject, the audience, and the
job the page does. Design decisions come from the subject's materials, industry,
vernacular and physical facts, not from what a page like this usually looks like.

For a working saddlery: the materials are canvas, ripstop, webbing, thread,
binding, buckles. The verbs are cut, sew, bind, repair, measure. The measurements
are real ranges in feet and inches. The workshop is in a specific town. Any of
these can carry a visual idea; a gradient cannot.

## The tells

Generated design clusters. These treatments appear regardless of subject, so they
read as defaults rather than decisions. Each is legitimate when the subject
genuinely earns it, and a liability when the axis was free.

1. Warm cream ground with a high contrast serif display and a terracotta or clay
   accent. Also the near black ground with one acid or vermilion accent.
2. A broadsheet layout: hairline rules everywhere, no radius at all, dense
   newspaper columns.
3. The SaaS card kit: identical rounded cards, one radius on everything whatever
   its rank, the same soft grey shadow, gradient washes as decoration.
4. Template chrome: a tracked out all caps label above every heading, meta strings
   joined with middle dots, labels shaped `WORD - fragment`, a monospace face for
   small data, an arrow appended to every link.

Two of these describe the site's committed brand. That is allowed, because the
owner chose it and `DESIGN.md` records why. It means the rest of the page must not
spend its freedom on more defaults, and the distinctive work has to happen
somewhere else: in the structural device, the typographic detail, and what the
page chooses to show.

## Rules that decide most pages

- **One memorable thing.** Spend boldness in one place. Everything around it stays
  quiet and disciplined. Before shipping, remove one accessory.
- **Open with the most characteristic thing in the subject**, in the form that
  suits it. A big number with a small label and supporting stats is the default
  hero, so use it only when it is genuinely the best form.
- **Type carries the personality.** One family, or two that are clearly distinct.
  Set a real scale with intentional weight and spacing. When type is the visual
  element, treat it as the design rather than a vehicle for text.
- **Do not** italicise or recolour one word in a heading, set labels in all caps,
  or stack a typographic label above content for no reason.
- **Structure encodes information.** Outlines, numbers, dividers and labels are
  justified when they say something true about the content. Numbered markers are
  for real sequences only.
- **Motion:** one orchestrated moment, or motion that answers an action. Not a
  fade and slide on every section, and not a hover on every card.
- **Line length** under 80 characters, shorter for sans, and slightly more
  line-height for serif body text.
- **Craft floor:** works at 320px, visible keyboard focus, reduced motion
  respected, contrast measured rather than assumed, harmonious palette.

## Writing in a design

Words are content, not decoration. Write from the reader's side, in the words they
already use. Active voice. A control names the action it performs, and keeps that
name through the whole flow, so the button that says Publish produces a message
that says Published. Emptiness is an invitation to act; an error says what went
wrong and how to recover, without apology and without vagueness. Sentence case,
plain verbs, no filler.

## Process

1. **Plan.** Write four short blocks: colour as four to six named values, the type
   families and their roles, a layout concept with a one line sketch of each
   option, and the principles that make this page specific. Keep it to a paragraph
   each.
2. **Review the plan against the brief.** Walk each choice and ask whether a
   designer working on any similar page would have landed there by default. For
   every part that would, change it, and say in one line what changed and why.
   Only then write code.
3. **Build, watching specificity.** Two selectors that cancel each other out cost
   more to debug than the layout is worth.
4. **Critique with a picture.** Screenshot the result in the integrated browser
   and judge it against the plan, not against your memory of writing it. A picture
   is worth a thousand tokens.

## Here

`DESIGN.md` holds the direction, the tokens and the reason for each rule.
`src/assets/theme.css` holds the values. Load the `impeccable` skill as well when
it is available: it owns craft and finish, and it wins where the two disagree. The
anti-slop agent in `.github/agents/anti-slop.agent.md` is the enforcement gate.
