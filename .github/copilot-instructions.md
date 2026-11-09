# Four Seasons Horse Rugs, price builder

## Architecture

- Frontend: Vue 3 single page app, Composition API, deployed as static files on cPanel.
- Backend: PHP 8 API in `api/`, same host, serves JSON from MySQL.
- Database: MySQL. Products are normalised, money is stored in cents.

Request flow: `Vue` -> `api/index.php` -> MySQL.

## Data model

| Table               | Purpose                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------ |
| `categories`        | The range, for example Canvas or Synthetic, with the note shown under the range step       |
| `styles`            | Styles inside a range, for example 16oz Rawhide or 600D X-Calibur, with a binding mode of none, single or double |
| `item_types`        | Rug, Hood, Neck Rug, Quarter Sheet                                                         |
| `sizes`             | Cob/Full, Small Pony, 4'0"-5'6" and so on                                                  |
| `finishes`          | Acrylic Fleece, Canvas                                                                     |
| `products`          | One row per style, type, size and finish, with `price_cents`                               |
| `extras`            | Optional extras, linked to a style                                                         |
| `extra_rules`       | One extra included when another is ticked, with the message shown beside it                |
| `accessories`       | Item number list, with notes that may run over several lines                               |
| `photos`            | One photo per style, product or accessory, stored as WebP under `api/uploads/photos`       |
| `shared_lists`      | Owner defined lists such as Binding Colours, with an input type, a maximum and a public note |
| `shared_list_items` | Values in a shared list, with an optional WebP under `api/uploads/swatches`                |
| `colour_swatches`   | One photo per colour per range, overriding `colours.swatch` when set                       |
| `range_colours`     | The colours a range is made in, chosen on the range's More tab                             |
| `sales`             | One active, paused or ended sale on the store, a range, a style or an accessory, as a percent off, with an optional last day |
| `site_settings`     | The one site-wide announcement banner, text and active flag                                |
| `admin_users`       | One row per person who can edit prices                                                     |
| `login_attempts`    | Throttling and audit of sign in attempts                                                   |

## Endpoints

| Method          | Path                                               | Access            |
| --------------- | -------------------------------------------------- | ----------------- | --- | ---- | ------------------------------ | --------------- |
| GET             | `/api/catalog`                                     | Public            |
| GET             | `/api/announcement`                                | Public            |
| POST            | `/api/auth/login`                                  | Public, throttled |
| POST            | `/api/auth/logout`                                 | Signed in         |
| GET             | `/api/auth/session`                                | Public            |
| GET             | `/api/admin/catalog`                               | Signed in         |
| POST PUT DELETE | `/api/admin/products`                              | Signed in, CSRF   |
| POST PUT DELETE | `/api/admin/extras`                                | Signed in, CSRF   |
| POST PUT DELETE | `/api/admin/extra-rules`                           | Signed in, CSRF   |
| POST PUT DELETE | `/api/admin/accessories`                           | Signed in, CSRF   |
| POST PUT DELETE | `/api/admin/lookups`                               | Signed in, CSRF   |
| PUT             | `/api/admin/lookups/order`                         | Signed in, CSRF   |
| POST            | `/api/admin/styles/:id/merge`                      | Signed in, CSRF   |     | POST | `/api/admin/styles/:id/lining` | Signed in, CSRF |
| POST            | `/api/admin/products/bulk`                         | Signed in, CSRF   |
| POST            | `/api/admin/photos`                                | Signed in, CSRF   |
| DELETE          | `/api/admin/photos/:id`                            | Signed in, CSRF   |
| POST PUT DELETE | `/api/admin/shared-lists`                          | Signed in, CSRF   |
| POST PUT DELETE | `/api/admin/shared-lists/:id/items`                | Signed in, CSRF   |
| PUT             | `/api/admin/shared-lists/order` and `/items/order` | Signed in, CSRF   |
| POST DELETE     | `/api/admin/images`                                | Signed in, CSRF   |
| PUT             | `/api/admin/categories/:id/colours`                | Signed in, CSRF   |
| GET             | `/api/uploads/swatches/:file`                      | Public file       |
| POST PUT DELETE | `/api/admin/sales`                                 | Signed in, CSRF   |
| PUT             | `/api/admin/announcement`                          | Signed in, CSRF   |

## Conventions

- Any frontend or UI work starts by loading the `impeccable` skill. Where its rules
  and the anti-slop rules disagree, `impeccable` wins.
- Multi-layer work (a page plus its API, a schema change plus the screen that reads it,
  a refactor across files) can be opened with the `Web Team` agent in
  `.github/agents/web-team.agent.md`. It scouts once with `web-recon`, builds with
  `web-ui` and `web-api`, holds every front end change behind `web-slop-check`
  (`.github/agents/anti-slop.agent.md` R-01 to R-38) and verifies with `web-qa`. A
  single file edit is faster done directly.
- Single file components with `<script setup>`.
- Front end work is checked in the integrated browser page on the running dev server.
  Never launch a separate headless browser (Chrome, Edge, Puppeteer, Playwright CLI) to
  take screenshots: it does not share the dev session or the admin sign in, and it leaves
  a process behind. If the browser tools are unavailable, say so rather than substituting.
- Style tokens live in `src/assets/theme.css`. Do not hardcode hex values in components.
- Fonts are self hosted from `public/fonts` and declared in `src/assets/fonts.css`: Inter
  for UI, Newsreader for display. Never add a third party font stylesheet; the CSP and
  the first paint both depend on it. The `.woff2` files are latin subsets only.
- `/` and `/prices` ship in the first bundle. Services, About and Contact are lazily
  imported routes, so a component only those pages use must stay in their subtree.
- Radius is 2px or 3px only. Nothing is pill shaped.
- No em dashes in UI copy, comments or commit messages.
- All API calls go through `src/api/client.js`.
- Local admin testing runs against `scripts/mock-api.mjs`, sign in with
  `mum` / `test-password-123`. See `docs/local-admin-testing.md`. The mock is
  never uploaded.
- Server side, always use prepared statements and validate input with the helpers in
  `api/lib/bootstrap.php`.
- Work opened from Categories that changes another page (prices, shared lists) opens in
  a modal, so the Categories drafts and selection survive.
- Shared list values live in `shared_list_items`. A list with `has_image` shows a 56px
  picture square per row that opens Browse, Replace and Remove; uploads are resized in
  the browser and stored as WebP under `api/uploads/swatches`. Custom lists are
  catalogue data for now. Prices still use types, sizes, linings and colours.
- Colour photos can be overridden per range in `colour_swatches`. The admin sets them
  in a range's More tab. The price builder uses the range photo first, then the shared
  `colours.swatch`. The image endpoint takes `kind=colour_range` and a `category_id`.
- Binding is a separate ordered choice after the six price choices. A style with
  `binding_mode = 'single'` asks for one binding colour. A style with
  `binding_mode = 'double'` asks for the primary colour first and the underneath colour
  second. Values come from the Binding Colours shared list. The quote does not open
  until every binding slot is filled.
- Binding options are compact text rows. A thumbnail appears only when the value has a
  photo, because a binding list without photos is normal. Do not show a wall of large
  "No photo" squares for binding. The shared list note explains the slots and is shown
  under the choices.
- The quote and the email body name the binding colour, or the primary and underneath
  binding on a double bound style. Binding does not change the price of a style.
- A style's binding mode is set in the More tab of Categories. The upgrade script
  backfills styles whose names contain Single Bound or Double Bound.
- A product family with its own sizes and no lining or colour choice is a range of its
  own. Quarter Sheets is the model: five fabrics, each sold as a Single Bound and a
  Double Bound style, the type Quarter Sheet, sizes Small Pony to Extra Large, and
  price rows that leave lining and colour empty so those two steps fill in by
  themselves. The double binding price lives in the Double Bound style, not in a
  surcharge. Do not add a pricing rule for it unless the owner asks.
- Shared lists store `input_type` (`single`, `multi` or `ordered`), `max_selections` and
  a plain text `note`. Binding Colours is ordered with two slots. The style binding mode
  decides how many slots the public picker shows.
- Colour swatches use `object-fit: fill` in the price builder, quote and admin colour
  rows so the whole sample is visible. Lining photos keep `cover`. Public colour
  choices are swatch cards with the name below a square sample, around 115px to 155px,
  under the 160px source size. A colour without a photo shows a dashed No photo square
  so the card keeps its shape. The swatch is the preview; avoid hover overlays that
  cover the options.
- The colour step is not skipped for a single real colour. Only "No colour" is filled
  silently, because it is not a choice. A single real colour stays visible for the
  customer to choose.
- The wizard uses a six-segment clickable step rail, with no "x of 6 chosen" count
  line. Future steps are disabled until their prerequisites are chosen, and completed
  steps can be revisited.
- Options show a Limited stock chip when every matching price row is low stock. A mix
  of in-stock and low-stock variants is not labelled; the exact choice gets the chip
  once the later steps narrow it down.
- Options show the real price behind them, built by `buildOptionPriceHints` in
  `src/utils/optionPriceHints.js`. The name leads at 500 weight in ink, the figure is a
  secondary annotation at 0.75rem, then an exact figure once every remaining variant
  costs the same. On the range and style steps the commonest item is named once under
  the choices, so the word Rug is not repeated on every row. Never add a fixed per
  option surcharge: the same lining difference changes with the size. The hint uses the
  sale price, and a step hides its figures when every priced option is the same amount.
- When all six choices are made, the quote expands into a full-width review panel. The
  step rail and choice chips stay above it for edits. On a phone the price card comes
  first and the panel scrolls into view. The quote header has a secondary Change
  choices button, not a status badge.
- `range_colours` is the list of colours a range is made in. The admin ticks them in
  the same More tab. Once a range is configured, the price builder ignores price rows
  for any other colour, so a stray Canvas Rust Check cannot appear. Until it is
  configured, the builder keeps using the colours that have a price.
- On a phone the running total is a floating panel. It expands to show the product
  photo, an email or call cue and a View quote link, and it hides while the quote or
  footer is on screen. The total animates once when all six choices are made, and the
  reduced motion setting turns that off.
- Use a multi-select where one value would force a repeated pass: price filters for
  lining, type, size and colour, and lining and colour in Add prices.
- The admin can switch to a stored dark theme. It is a warm charcoal token override on
  `.dark`, applied only while `AdminPage` is mounted, so the public site stays light.
- Admin nav is grouped into Catalogue and Storefront. Promotions holds the banner and
  the sales list. A sale can target the whole store, a range, a style or an accessory;
  the best applicable sale wins and sales never stack. Sale prices are calculated on
  the server, never written back into `price_cents`, and the admin price table keeps
  showing the base price plus a sale tag.
- A sale can carry a last day in `sales.ends_on`. Empty means it runs until paused. Once
  the day has passed the sale shows as Ended, stops applying to any price, and no longer
  blocks a new sale on the same target. The date rule lives in one place: the admin
  refuses to save a past day, the API accepts any real day so Undo can restore one.
- A failed catalogue load shows a recovery panel with Try again and Reload the page
  instead of an empty table. A failed refresh keeps the table and adds Try again to the
  message. Unsaved rows survive a retry.
- A column of prices can be pasted into the first price cell. The rows below fill in the
  order the table shows, a review lists every old and new price, unreadable lines and
  values past the last row are named, and the batch saves as one undoable change. Do not
  write pasted prices one cell at a time.
- The announcement lives in `site_settings`, is read from `/api/announcement`, and only
  renders when the text is non-empty and the active flag is set.
- Public reads (catalogue, banner, reviews) answer with an ETag and `Cache-Control:
  public, max-age=60`; a matching `If-None-Match` gets a 304 with no body. Everything
  else, including every admin read, stays `no-store`. Keep the public reads on
  `json_cacheable()` and the rest on `json_response()`, and do not add
  `stale-while-revalidate`: it would serve an old price after a save.
- The price catalogue is held once per tab in `usePricingData`, shared by the home page
  and the price builder, revalidated with the ETag after 60 seconds and never blanked by
  a failed refresh. Any successful write drops the fresh window. Do not create a second
  copy of the catalogue state, and do not call `/api/catalog` directly.
- The home and price shells preload `/api/catalog`; the prerender script injects it.
  Keep `crossorigin="use-credentials"` or the app repeats the request instead of reusing
  it, and keep the other shells free of it.
- The public accessory catalogue can add priced, available accessories to the quote.
  Quote totals and the email body include them. A zero price means price on request,
  so that row has no add action.
- Extra rules are edited on the Extra rules admin page. A rule is stored by extra name,
  so it follows the same extra across styles. The public picker reads the active rules
  from the catalogue and never hardcodes a condition.
- Photo fields offer Browse, Replace, Remove and alt text. Images are still compressed
  in the browser and validated on the server.
- Descriptions and price notes use the Nuxt UI editor (`AdminRichText.vue`) and are
  stored as the editor's JSON document. Render them with `RichText.vue`; never put the
  stored value through `v-html`. Accessory notes stay plain text.
- The admin remembers the open section and scroll position across a refresh.
- A style can move to another range by dragging it onto a range in the Categories list,
  or with Move to another range on the style's More tab. The move keeps its prices,
  extras and photo. Names stay unique inside the target range, and the moved style
  joins the end of its list.
- Adding a range or style opens a form at the top of its list. The new range is selected
  with the Add style form ready, and a new style is selected with Add prices in the
  header and the Choices tab. Unsaved details block a new item so a refresh cannot
  discard them.
- Add prices is a full screen modal and accepts a style or range focus, so the same form
  opens from Products, a style, a range or the price window. It keeps typed prices when a
  combination fails so the owner can correct and retry.
- Order lives on Details, beside the name and photo. More holds the range colours, move
  tools and delete.
- Deleting a style or range names the prices, extras, sales and photos that go with it,
  then asks for the word Delete. The server cascades those rows and removes the saved
  photo and range swatch files.

## Cost rules

Every tool call is a separate billed request that re-sends the conversation, so the
cheapest change is the one that takes fewer calls and says less.

- Batch independent reads, searches and edits into one turn. Never spend a turn on a
  single lookup that could have travelled with three others.
- Verify once per change, not after every edit: one build, one lint, one browser pass.
  Never re-run a check that already passed.
- Trim command output at the source: `Select-Object -Last`, `head_limit`, a narrow
  `view_range`. A large dump is re-sent on every later request.
- Do not paste file contents or diffs into a prompt. Cite `path:line` and let the
  reader open the range.
- Keep one chat to one concern, and one model for the whole task. A model switch has
  no matching cache prefix, so the next turn pays for the whole transcript again.
- Take no screenshot unless the verdict is visual judgement, and then one. Measure
  rects, computed styles and pixel counts instead.
- Keep the opening moves identical from session to session: same instructions, same
  files, same order. A stable prefix is what the cache matches.

## Security rules

- Never commit `api/config.php`.
- Never return `password_hash` or any credential in a response.
- Every write requires an authenticated session and a CSRF token.
- Keep login throttling in place. Do not raise `login_max_attempts` without a reason.
- Throttle per address and per username. One alone lets an attack spread out.
- Sessions expire after `session_idle_minutes` idle and `session_max_hours` total.
- The admin must never be served over plain HTTP. `public/.htaccess` redirects.
- Do not add localhost origins to a live `allowed_origins` list.
- Photo uploads are resized in the browser and stored as WebP. Validate the decoded
  bytes, never the supplied file name or MIME alone. Generated names only, and never
  allow script execution in `api/uploads/`.

## Outstanding

- Deploy. Full runbook in `docs/cpanel-deploy.md`: upload `api/`, import
  `api/schema.sql` then `api/seed.sql`, upload the contents of `dist/` into `public_html/`.
  On an existing database, run `api/upgrade.sql` before the new `api/` files go live,
  because the binding columns are read by the API. That file is structure only and
  never writes a catalogue row.
- Create the owner account with `php api/create-admin.php <username>`.
