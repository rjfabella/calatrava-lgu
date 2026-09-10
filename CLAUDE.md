# CLAUDE.md — Calatrava LGU Website

This file is read automatically at the start of every Claude Code session in
this repo. It orients any Claude instance working here — read it before
touching code.

## What this is

The official government portal of the **Municipality of Calatrava, Romblon,
Philippines** (`calatravaromblon.gov.ph`). Static **HTML / CSS / JS, no build
step** — every page renders from a `data/*.json` file with a hardcoded
fallback so it still works if JSON fetch fails (e.g. opened as a local file).

This repo is the **government/LGU site**. A separate, already-built
**tourism portal** lives at the same domain gateway
(https://rjfabella.github.io/calatrava-tourism-portal/). That portal shows a
**Tourist vs. Local popup** on load; choosing "Local" redirects here. So this
site can be entered mid-navigation via redirect, not only as a standalone
homepage — keep IA and branding consistent with the tourism portal (same
green + gold identity, same header/footer language) rather than designing in
isolation.

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
  what `transparency.html` / `transparency.json` exist to satisfy.
- **Citizen's Charter (RA 11032 / ARTA)** — every frontline service listed
  needs procedure, requirements, fees, processing time, responsible officer,
  feedback mechanism. Source document: `assets/contents/Citizen's Charter
  2023.pdf`, now parsed into `data/citizens-charter.json` (all 45 services)
  and rendered on `services.html#charter`.
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
    online services, emergency hotlines (homepage/services quick reference —
    NOT auto-generated from the charter; reconcile by hand)
  - `data/citizens-charter.json` — all 45 frontline services from the
    Citizen's Charter 2023, grouped by office: classification, who may
    avail, requirements + where to secure, fees, processing time. Rendered
    as the accordion on `services.html#charter`. `fees`/`processingTime`
    are auto-extracted from the PDF's tables and best-effort — verify
    against the cited `sourcePages` before treating a figure as final;
    `requirements`/`classification`/`whoMayAvail` came from bordered table
    cells and are reliable.
  - `data/barangays.json` — the 7 barangays, captains, population
  - `data/news.json` — staff-written news items (auto-sorted by date)
  - `data/news-fb.json` — **generated**, never hand-edited: posts synced from
    the PIO Facebook Page by `scripts/sync_facebook.py` via the
    `sync-facebook` GitHub Action. `news.html` and the homepage merge this
    with `news.json` and sort by date, so hand-written bulletins keep
    rendering if the sync ever breaks. Setup: `docs/facebook-sync-setup.md`.
  - `data/transparency.json` — Full Disclosure document links, including
    the actual Citizen's Charter PDF and Org Chart PPTX
  - `data/contact.json` — office directory, address, map embed
- **Styling**: single `assets/style.css` design system (Cormorant Garamond +
  Jost fonts, green/gold palette) driven by `:root` CSS variables. Re-theme
  there, not with inline styles or per-page stylesheets.
- **Pages**: `index.html`, `about.html`, `services.html`, `barangays.html`,
  `transparency.html`, `news.html`, `contact.html`, `privacy.html`.
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

## Working conventions

- No build tooling, no framework, no dependencies beyond a static file
  server for local dev (`npm run dev` → `http-server` on :5173). Keep it
  that way unless the user explicitly asks to introduce a build step.
  The one exception, approved by RJ: `scripts/sync_facebook.py` and its
  GitHub Action, which need `requests` + `Pillow`. Those run **only in CI**
  and write data files — the published site is still plain static HTML with
  zero runtime dependencies. Don't let tooling creep past that line.
- Pages must be served over HTTP for `fetch()` of the JSON to work; don't
  "fix" the inline fallback data out of the HTML — it's intentional
  degradation, not dead code.
- No backend, no secrets. Deployment target is **GitHub Pages** serving
  `main` from the repo root as-is.
- There is no admin/CMS editor yet. If one gets built, follow the pattern of
  the tourism portal's `admin.html` (GitHub-API publishing) rather than
  inventing a new approach.
- A lot of current content is **verified placeholder data** — see
  `MEMORY.md` and the README's fill-in checklist for exactly what's real vs.
  placeholder. Don't assume names, numbers, or hotlines in the JSON are
  final; cross-check against `assets/contents/` source docs or ask before
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
