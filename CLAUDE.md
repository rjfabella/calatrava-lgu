# CLAUDE.md — Calatrava municipal web portal

This file is read automatically at the start of every Claude Code session in
this repo. It orients any Claude instance working here — read it before
touching code.

## What this is

Everything served at `calatravaromblon.gov.ph` for the **Municipality of
Calatrava, Romblon, Philippines** — two static sites in one repo, deployed
together as one GitHub Pages site:

- **`/` — the tourism portal.** Built first, because tourism is the current
  mayor's priority. Its homepage shows a **Tourist vs. Local pop-up** on load;
  choosing "Local" goes to `/lgu/`.
- **`/lgu/` — the official government portal.** The LGU site proper, and the
  one the governing standards below apply to.

Both halves are **HTML / CSS / JS with no build step** — every page renders
from a `data/*.json` file with a hardcoded fallback so it still works if the
JSON fetch fails (e.g. opened as a local file).

The two were separate repos until 2026-11-01, when the tourism portal was
merged into this one; `MEMORY.md` has the reasoning. Practical consequences:
the LGU site can be entered mid-navigation through the gate rather than only
as a standalone homepage, so keep IA and branding consistent across the two
(same green + gold identity, same header/footer language) rather than
designing either in isolation — and when a change touches the domain root, the
service worker or the 404, remember it affects **both** halves.

## Governing standards (must inform every page/feature)

- **DICT GWTD** — Government Website Template Design guidelines: `.gov.ph`
  domain, consistent gov branding, standard nav, GovCloud-eligible hosting.
- **WCAG 2.0 Level AA** (Philippine Web Accessibility Policy, DICT MC) — alt
  text, captions, keyboard nav, color contrast, accessible documents. Treat
  as a hard requirement, not a nice-to-have, for any new markup or component.
- **Data Privacy Act (RA 10173)** — any form must have a privacy notice; a
  DPO must be named somewhere on the site.
- **DILG Full Disclosure Policy (FDP)**, MC 2010-083 as amended — budget,
  procurement, and financial documents posted and updated quarterly. This is
  what `lgu/transparency.html` / `lgu/data/transparency.json` exist to satisfy.
- **Citizen's Charter (RA 11032 / ARTA)** — every frontline service listed
  needs procedure, requirements, fees, processing time, responsible officer,
  feedback mechanism. Source document: `lgu/assets/contents/Citizen's Charter
  2023.pdf`, now parsed into `lgu/data/citizens-charter.json` (all 45 services)
  and rendered on `lgu/services.html#charter`.
- **FOI (EO 2, s. 2016)** — optional but good practice; no dedicated page yet.
- **SGLG (RA 11292) / Transparency Seal** — an active, transparent, compliant
  site is itself an assessed governance indicator.
- Mobile & cross-browser responsiveness is a DICT best-practice expectation,
  not optional polish.

Full research and the content-collection checklist sent to the Mayor's
office live in the attached Claude Project's doc
`claude/standards-and-checklist.md` — read that for the reasoning behind any
of the above before changing site structure.

## Architecture

```
/        tourism portal — index.html (gate), destinations, accommodation,
         establishments, getting-here, admin.html, 404.html, manifest.json,
         sw.js, icons/, CNAME, and its own assets/ + data/
lgu/     government portal — nine pages plus its own assets/ + data/
```

Each half owns its own `assets/` and `data/`; neither reads the other's.

### Domain-wide (owned by the tourism half, affects both)

- **`sw.js`** registers at the root with scope `/`, so the service worker
  fronts the LGU pages too. Its precache list carries the LGU shell
  (`/lgu/`, its `index.html`, `style.css`, `app.js`); `/lgu/data/` gets the
  same network-first treatment as `/data/`; CSS and JS are
  stale-while-revalidate, *not* cache-first — cache-first would pin
  `lgu/assets/app.js`, which renders the whole LGU chrome, to whatever a
  visitor first downloaded. Bump `CACHE_VERSION` when the shell changes.
- **`404.html`** is the only 404 GitHub Pages serves for the domain, so it
  does double duty: a head script forwards the LGU's eight pre-merge root URLs
  (`/about.html`, `/services.html`, …) to `/lgu/<page>.html`, and for any miss
  under `/lgu/` it swaps its tourism copy for government copy and links.
- **`manifest.json`** is scoped `/`, so the installed PWA covers both halves.
- **`CNAME`** binds `calatravaromblon.gov.ph`. See the README for the
  two-step Pages swap that moves a custom domain between repos.

### The tourism half (`/`)

- **Self-contained pages**: unlike the LGU half there is no shared chrome
  module — each page inlines its own `<style>` and nav/footer markup, with
  only `assets/emergency.css` and `assets/i18n.js` shared. Changing the
  tourism nav means editing every page; don't assume `initChrome` exists here.
- **Fonts**: Cormorant Garamond + Jost (the LGU half uses a different pair —
  see below).
- **`admin.html`** is the staff content editor: it commits `data/*.json`
  straight to this repo through the GitHub Contents API (`GH_REPO`,
  `GH_BRANCH` at the top of its script) with a fine-grained PAT, and uploads
  photos into `assets/destinations|accommodations|establishments`. It is the
  pattern to follow if an editor is ever built for the LGU half.
- **`data/settings.json`** → `visitorGate` toggles the Tourist/Local pop-up
  and sets where "Local" goes (`/lgu/`). Editable from the admin editor.

### The government half (`lgu/`)

Paths in this subsection are relative to `lgu/`.

- **Shared chrome**: `assets/app.js` defines `NAV_ITEMS` once and injects the
  top bar, nav, mobile nav, and footer into every page. Every page calls
  `initChrome('<page-id>')`. Edit navigation in exactly one place
  (`assets/app.js`), never per-page.
- **Content is data-driven**: page content lives in `data/*.json`, not in the
  HTML. To change copy, numbers, officials, news, etc., edit the JSON —
  don't hand-edit the rendered markup.
  - `data/site.json` — hero slides, motto, eLGU band, popular services,
    programs, stats, recognition seals
  - `data/officials.json` — mayor's welcome, vision/mission, elected
    officials, department heads, history. Department heads summarize
    `data/organization.json` — keep both in sync when either changes.
  - `data/organization.json` — the full org chart: every office and
    plantilla position with title and salary grade, parsed from
    `assets/contents/Organizational Chart 2026.pptx`
  - `data/services.json` — 8 hand-curated service-group summary cards,
    `featured` (Calatravanhon Card + Feedback & Complaints), emergency
    hotlines (homepage/services quick reference — NOT auto-generated from the
    charter; reconcile by hand). The old `online` block is gone: the LGU has
    no transactional online services yet, so advertising them was a
    placeholder that read as real.
  - `data/citizens-charter.json` — all 45 frontline services from the
    Citizen's Charter 2023, grouped by office: classification, who may
    avail, requirements + where to secure, fees, processing time. Rendered
    as the accordion on `services.html#charter`. `fees`/`processingTime`
    are auto-extracted from the PDF's tables and best-effort — verify
    against the cited `sourcePages` before treating a figure as final;
    `requirements`/`classification`/`whoMayAvail` came from bordered table
    cells and are reliable. An `about` block carries the edition, legal basis
    and coverage figures rendered on the Citizen's Charter tab.
  - `data/barangays.json` — the 7 barangays, captains, population
  - `data/news.json` — news items, added by hand, auto-sorted by date. This is
    the only source. **Don't propose syncing from Facebook**: the municipal
    PIO account is a personal *Profile*, not a Page, and Meta's API cannot
    read a Profile's posts. A full sync was built and then removed for this
    reason — see `MEMORY.md` before revisiting.
  - `data/transparency.json` — Full Disclosure document links, including
    the actual Citizen's Charter PDF and Org Chart PPTX
  - `data/contact.json` — office directory, address, map embed
- **Styling**: single `assets/style.css` design system (Merriweather + Source
  Sans 3 fonts, green/gold palette) driven by `:root` CSS variables. Re-theme
  there, not with inline styles or per-page stylesheets. Type is deliberately
  large (18.5px base, 12.5px floor) because most of this half's users are
  older residents.
- **Pages**: `index.html`, `about.html` (Government — elected officials +
  offices/departments), `about-us.html` (three tabs: History / Barangays /
  Map),
  `services.html` (Public Services, three tabs: Citizen's Charter explainer /
  Charter directory / services by category), `barangays.html`,
  `transparency.html`, `news.html`, `contact.html` (office directory only),
  `privacy.html`. `barangays.html` is a redirect stub to
  `about-us.html#barangays` — keep it so old links and bookmarks survive.
  The nav's "Tourism" item and the footer's "Tourism Portal" point at
  `../index.html`: every path in this half is relative, which is what let it
  move under `lgu/` untouched, so keep it that way.
- **Tabs**: `setupTabs(names, opts)` + `applyTabHash(group)` in `assets/app.js`
  carry the WAI-ARIA tab behaviour (roving tabindex, arrow keys, hash sync).
  Both `services.html` and `about-us.html` use it; don't reimplement per page.
  Markup contract: `#tab-<name>` buttons and a `#panel-<name>` for each.
  `.tabs[hidden]` is declared explicitly because `display:flex` would
  otherwise beat the `hidden` attribute.
- **Search**: `buildSearchIndex`/`searchServices`/`renderSearchBox` in
  `assets/app.js`. The index is built from `citizens-charter.json` +
  `services.json` at runtime, so it can never drift from what renders. The
  homepage box hands off to `services.html?q=…`; the Services page does the
  searching.
- **Page transitions**: cross-document View Transitions via
  `@view-transition{navigation:auto}` in the CSS, with `.site-head` given a
  `view-transition-name` so the frozen header doesn't cross-fade. Browsers
  without the API get a one-off fade-up of `main` from
  `initPageTransition()`. Both are disabled under `prefers-reduced-motion`.
- **Sticky chrome**: `.site-head` (top bar + nav + a compact page-title strip)
  is `position:sticky`. The strip is built in `buildPageBar()` from each
  page's own `<h1>`/breadcrumb and reveals itself once the page hero scrolls
  past; the homepage has no hero and so gets no strip. The injected chrome
  wrapper is `display:contents` — give it a containing block and sticky
  silently stops working.
- **Never publish invented data.** This is a live government portal, so a
  placeholder that *looks* real is worse than a visible gap: fake hotlines
  were dialable, fabricated news items read as official announcements, and an
  invented DPO address was unreachable. The pattern now is to leave the field
  empty in JSON and let the renderer degrade honestly — a pending row, "To be
  announced", an empty state, or an initials monogram. See `MEMORY.md`.
- **Assets**: `assets/logos/` (municipal + provincial seals),
  `assets/hero/` (banner images), `assets/contents/` (source documents
  collected from the LGU — PDFs, DOCX, PPTX). Parse new source documents
  into the relevant `data/*.json` (that's the pattern for the Citizen's
  Charter and Org Chart); the originals also stay linked from
  `transparency.json` for FDP/legal completeness.
  `assets/reference docs/` is the **staging area** for the Sept 2026 batch
  of office submissions — audited, renamed `Dept_DocName`, and indexed in
  its `README.md`; nothing there is on the site yet. The tracking sheet is
  `Calatrava LGU Website Development.xlsx` in that folder (columns H–I map
  each checklist item to its source doc and gaps).

## Working conventions

- No build tooling, no framework, no CI, no dependencies beyond a static file
  server for local dev (`npm run dev` → `http-server` on :5173). Keep it
  that way unless the user explicitly asks to introduce a build step. (A
  Python script and GitHub Action briefly existed for the Facebook sync;
  both were removed with it, and the repo is back to zero tooling.)
- Pages must be served over HTTP for `fetch()` of the JSON to work; don't
  "fix" the inline fallback data out of the HTML — it's intentional
  degradation, not dead code. Serve from the **repo root**, never from `lgu/`:
  the tourism pages, `sw.js` and the 404 forwarding all use absolute paths
  that assume the domain root.
- No backend, no secrets. Deployment target is **GitHub Pages** serving
  `main` from the repo root as-is, at the apex domain.
- The LGU half has no admin/CMS editor. If one gets built, follow
  `admin.html`'s pattern (GitHub-API publishing) pointed at `lgu/data/*.json`,
  rather than inventing a new approach.
- A lot of current content is **verified placeholder data** — see
  `MEMORY.md` and the README's fill-in checklist for exactly what's real vs.
  placeholder. Don't assume names, numbers, or hotlines in the JSON are
  final; cross-check against `lgu/assets/contents/` source docs or ask before
  publishing.

## User working style (RJ)

- Prefers direct execution over explanation — do the thing, don't narrate
  the plan first, unless the task is genuinely ambiguous.
- Approves actions tersely.
- Prefers comprehensive single-pass fixes over incremental back-and-forth —
  when fixing something, look for the same issue elsewhere in the same pass
  rather than doing one file and stopping.

## See also

- `README.md` — human-facing setup/run/deploy instructions (kept in sync
  with this file's Architecture section).
- `MEMORY.md` — project history, decisions made, current status, and open
  questions. Read it for *why* things are the way they are and *what's left*
  before picking up new work here.
- Claude Project "Calatrava LGU Website" → `claude/standards-and-checklist.md`
  — the full standards research and the 12-section content checklist sent to
  the Mayor's secretary.
