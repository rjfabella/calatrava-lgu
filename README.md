# Calatrava, Romblon — municipal web portal

Everything served at **calatravaromblon.gov.ph** for the Municipality of
Calatrava, Romblon, Philippines. Two sites, one repo, one GitHub Pages deploy:

| Path | Site | Audience |
|------|------|----------|
| `/` | **Tourism portal** — destinations, stays, local life, getting here | Visitors |
| `/lgu/` | **Official government portal** — officials, services, transparency | Residents |

A Tourist / Local pop-up on the tourism homepage sends residents to `/lgu/`.
Before these were merged the two sites were separate repos and that choice was
a cross-origin jump to `rjfabella.github.io`; it is now a same-site navigation.

Both halves are plain HTML / CSS / JS with **no build step**, and every page
renders from a `data/*.json` file with a hardcoded fallback so it still works
if the fetch fails or the visitor is offline.

## Layout

```
/                       tourism portal (root)
  index.html            homepage + Tourist/Local gate
  destinations.html  accommodation.html  establishments.html  getting-here.html
  admin.html            staff content editor (publishes via the GitHub API)
  404.html              domain-wide 404; also forwards the LGU's old root URLs
  manifest.json  sw.js  icons/      PWA shell for the whole domain
  assets/  data/        tourism images and content
  CNAME                 calatravaromblon.gov.ph
lgu/                    government portal
  index.html  about.html  about-us.html  services.html  transparency.html
  news.html  contact.html  privacy.html  barangays.html (redirect stub)
  assets/  data/        LGU images, documents and content
```

The two `assets/` and `data/` directories are separate on purpose — each half
owns its own content and neither reads the other's.

## The tourism half (`/`)

- **Pages**: `index.html` (homepage), `destinations.html` (catalogue),
  `accommodation.html` (places to stay), `getting-here.html` (transport),
  `establishments.html` (dining, shops, services).
- **Editing content**: open `admin.html`, sign in, edit a section, hit Save.
  Signed in with a fine-grained GitHub PAT (Contents read & write on
  **this** repo), Save commits straight to `data/*.json` and is live in about a
  minute. Without a token, edits stay as browser drafts — Export JSON and
  replace the file by hand. The editor also uploads photos into
  `assets/destinations`, `assets/accommodations` and `assets/establishments`.
- **Visitor gate**: `data/settings.json` → `visitorGate` toggles the
  Tourist / Local pop-up and sets where "Local" goes (`/lgu/`). Both are
  editable from the admin editor's Settings card.
- **PWA**: `manifest.json` + `sw.js`, scoped to the whole domain, so the
  service worker fronts the LGU pages too. Bump `CACHE_VERSION` in `sw.js`
  when the shell changes.

## The government half (`/lgu/`)

| File | Purpose |
|------|---------|
| `lgu/index.html` | Homepage — emergency strip, hero banner, popular services, eLGU band, mayor's welcome, programs & projects, stats, latest news, recognition seals |
| `lgu/about.html` | Government — elected officials, offices & departments |
| `lgu/about-us.html` | History / Barangays / Map (tabs) |
| `lgu/services.html` | Public services — Citizen's Charter explainer, the 45-service charter directory, services by category |
| `lgu/transparency.html` | Full Disclosure Policy documents (DILG compliance) |
| `lgu/news.html` | News & bulletins — announcements, ordinances, biddings, events |
| `lgu/contact.html` | Office directory, address & hours |
| `lgu/privacy.html` | Data Privacy Act notice |
| `lgu/barangays.html` | Redirect stub → `about-us.html#barangays` |

- **Shared chrome:** `lgu/assets/app.js` injects the top bar, nav, mobile nav,
  page-title strip and footer on every page from one definition (`NAV_ITEMS`),
  so you edit the menu in one place. Each page calls `initChrome('<page-id>')`.
- **Content is data-driven:** edit the JSON in `lgu/data/` — no HTML changes
  needed.
  - `site.json` — hero slides, motto, eLGU band, popular services, programs, stats, recognition seals
  - `officials.json` — mayor's welcome, vision/mission, mandate and service pledge (Charter wording), elected officials, department heads, history
  - `organization.json` — the full 2026 org chart: all 13 offices and 61 plantilla positions with title and salary grade, parsed from `lgu/assets/contents/Organizational Chart 2026.pptx`. `officials.json`'s department heads are a summary of this file — update both if HR sends a new chart.
  - `services.json` — 8 service-group summary cards, featured services, emergency hotlines (hand-curated quick reference for the homepage/services page)
  - `citizens-charter.json` — the full Citizen's Charter 2023: all 45 frontline services by office, with classification, who may avail, requirements + where to secure, fees, and processing time, parsed from `lgu/assets/contents/Citizen's Charter 2023.pdf`. Rendered as the accordion on `lgu/services.html#charter`. `fees`/`processingTime` are auto-extracted and best-effort — verify against the PDF (cited per service as `sourcePages`) before treating a number as final.
  - `barangays.json` — the 7 barangays, captains, population
  - `news.json` — news items (sorted by date automatically)
  - `transparency.json` — Full Disclosure document links, including the actual Citizen's Charter PDF and Org Chart PPTX. Each entry carries a `status`: `available` renders as a link, `pending` renders as a greyed-out row (use it instead of `href: "#"` for a document the LGU hasn't submitted yet)
  - `contact.json` — office directory, address, map embed
- **Styling:** one shared `lgu/assets/style.css` carries the design system
  (Merriweather + Source Sans 3, green / gold palette). Re-theme via the
  `:root` variables. Typography is deliberately large — an 18.5px base and a
  12.5px floor on any text — because most of this site's users are older
  residents. Keep new components at or above those sizes, and check any new
  colour pairing against WCAG AA (4.5:1 body, 3:1 large text) before shipping.
- **Assets:** `lgu/assets/logos/` (municipal + provincial seals),
  `lgu/assets/hero/` (banner images), `lgu/assets/contents/` (source documents
  from the LGU).
- **No admin editor on this half yet.** If one gets built, follow the tourism
  portal's `admin.html` pattern (GitHub-API publishing) and point it at
  `lgu/data/*.json`.

The information architecture follows a typical PH LGU portal (modeled on
[San Agustin, Romblon](https://sanagustinromblon.gov.ph/)). Brand identity
follows the LGU Public Information Office: **green + gold**, the motto
*"Abante pang gador, Calatrava!"*, and a clean aerial hero of the town.

## Fill-in checklist (LGU placeholders to replace)

- [x] Names of the Mayor, Vice Mayor, SB members and department heads — real, from `Organizational Chart 2026.pptx` (`officials.json`, `organization.json`)
- [ ] Official photos — drop into `lgu/assets/` and set the `photo` paths
- [x] Barangay captains, mobile numbers, emails and seals for the 7 barangays (`barangays.json`, `lgu/assets/images/barangays/`) — 3 emails were truncated in the source screenshot; confirm with the LGU
- [ ] Emergency hotline numbers (currently `0000-000-0000` in `services.json`)
- [x] Per-office phone numbers and email addresses (`contact.json`) — real, from the LGU's official office directory sheet (2026-09-06); the invented `@calatrava.gov.ph` addresses were removed
- [x] Service requirements, classification, who-may-avail — real, from `Citizen's Charter 2023.pdf` (`citizens-charter.json`)
- [x] Service fees / processing times in `services.json` — reconciled against the Charter PDF (41 services across 8 groups); amounts the Charter does not fix read "Per Local Revenue Code" or "See Citizen's Charter"
- [ ] Real news items, programs, and Full Disclosure budget/procurement PDF links
- [ ] Real recognition/award seals (currently placeholder labels)
- [ ] Term dates for elected officials (carried over as a placeholder "2025–2028", not confirmed by any source document yet)

> **Real data:** the motto, brand colors, and contacts (0966 439 3711 ·
> andagaotour@gmail.com · FB "Calatrava Romblon") are real, as are the
> population (11,342, 2020 PSA), the 7 barangay names/figures, all elected
> officials and department heads, and the full Citizen's Charter service
> directory, and (since 2026-09-22) the 7 Punong Barangays with their
> contact details and official seals. Founding year is still a placeholder.

## Run locally

From the repo root:

```
npm run dev
```

then open <http://localhost:5173/> for the tourism half and
<http://localhost:5173/lgu/> for the government half. Serve from the repo root,
not from `lgu/` — the tourism pages, the service worker and the 404 forwarding
all use absolute paths that assume the domain root.

Pages **must** be served over HTTP for the JSON `fetch` to work; opening the
files directly falls back to the inline defaults.

## Deployment

**GitHub Pages**, `main` from the repo root, no build step, no secrets, no
backend. `CNAME` binds calatravaromblon.gov.ph — served from this repo since
2026-11-01 — and `data/*.json` plus `lgu/data/*.json` are the source of truth.
The predecessor repo, `rjfabella/calatrava-tourism-portal`, is archived and
read-only; its Pages site still serves a frozen pre-merge copy at its own
github.io URL.

One job is left over from the move: `admin.html` needs a fresh fine-grained
PAT with Contents read & write on `rjfabella/calatrava-lgu`. The token saved
on the LGU's device is scoped to the archived repo and will fail on Save.

If the domain ever has to move between Pages sites again — it can only be
attached to one at a time, so release it from the old repo's Settings → Pages
before setting it on the new one. The DNS records don't change, and GitHub
commits the `CNAME` file on both sides for you. Expect the CDN to keep serving
404s cached from before the move; requesting a fresh build
(`gh api -X POST repos/<owner>/<repo>/pages/builds`) purges them.
