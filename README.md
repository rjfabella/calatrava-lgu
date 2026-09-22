# Calatrava LGU — Government Portal

Official government portal of the **Municipality of Calatrava, Romblon,
Philippines**. Plain HTML / CSS / JS, **no build step** — each page renders from
a `data/*.json` file with a hardcoded fallback so it still works offline.

The information architecture follows a typical PH LGU portal (modeled on
[San Agustin, Romblon](https://sanagustinromblon.gov.ph/)): rotating hero
banner, an 8-category service taxonomy, online services (eLGU), community
programs ("Uswag"), barangays, transparency, recognition seals, emergency
hotlines, and a Data Privacy / DPO notice.

Brand identity follows the LGU Public Information Office: **green + gold**, the
motto *"Abante pang gador, Calatrava!"*, and a clean aerial hero of the town.
The site cross-links to the separate [tourism portal](https://rjfabella.github.io/calatrava-tourism-portal/).

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Homepage — emergency strip, hero banner, popular services, eLGU band, mayor's welcome, programs & projects, stats, latest news, recognition seals |
| `about.html` | Government — vision & mission, elected officials, departments, history |
| `services.html` | Public services — online services, 8 service categories, emergency hotlines |
| `barangays.html` | The 7 barangays with officials and population |
| `transparency.html` | Full Disclosure Policy documents (DILG compliance) |
| `news.html` | News & bulletins — announcements, ordinances, biddings, events |
| `contact.html` | Office directory, address & hours, location map |

## How it works

- **Shared chrome:** `assets/app.js` injects the top bar, nav, mobile nav, and
  footer on every page from one definition (`NAV_ITEMS`), so you edit the menu
  in one place. Each page calls `initChrome('<page-id>')`.
- **Content is data-driven:** edit the JSON in `data/` — no HTML changes needed.
  - `site.json` — hero slides, motto, eLGU band, popular services, programs, stats, recognition seals
  - `officials.json` — mayor's welcome, vision/mission, mandate and service pledge (Charter wording), elected officials, department heads, history
  - `organization.json` — the full 2026 org chart: all 13 offices and 61 plantilla positions with title and salary grade, parsed from `assets/contents/Organizational Chart 2026.pptx`. `officials.json`'s department heads are a summary of this file — update both if HR sends a new chart.
  - `services.json` — 8 service-group summary cards, online services, emergency hotlines (hand-curated quick reference for the homepage/services page)
  - `citizens-charter.json` — the full Citizen's Charter 2023: all 45 frontline services by office, with classification, who may avail, requirements + where to secure, fees, and processing time, parsed from `assets/contents/Citizen's Charter 2023.pdf`. Rendered as the accordion on `services.html#charter`. `fees`/`processingTime` are auto-extracted and best-effort — verify against the PDF (cited per service as `sourcePages`) before treating a number as final.
  - `barangays.json` — the 7 barangays, captains, population
  - `news.json` — news items (sorted by date automatically)
  - `transparency.json` — Full Disclosure document links, including the actual Citizen's Charter PDF and Org Chart PPTX. Each entry carries a `status`: `available` renders as a link, `pending` renders as a greyed-out row (use it instead of `href: "#"` for a document the LGU hasn't submitted yet)
  - `contact.json` — office directory, address, map embed
- **Styling:** one shared `assets/style.css` carries the design system
  (Merriweather + Source Sans 3, green / gold palette). Re-theme via the
  `:root` variables. Typography is deliberately large — an 18.5px base and a
  12.5px floor on any text — because most of this site's users are older
  residents. Keep new components at or above those sizes, and check any new
  colour pairing against WCAG AA (4.5:1 body, 3:1 large text) before shipping.
- **Assets:** `assets/logos/` (municipal + provincial seals), `assets/hero/`
  (banner images).

## Fill-in checklist (placeholders to replace)

- [x] Names of the Mayor, Vice Mayor, SB members and department heads — real, from `Organizational Chart 2026.pptx` (`officials.json`, `organization.json`)
- [ ] Official photos — drop into `assets/` and set the `photo` paths
- [x] Barangay captains, mobile numbers, emails and seals for the 7 barangays (`barangays.json`, `assets/images/barangays/`) — 3 emails were truncated in the source screenshot; confirm with the LGU
- [ ] Emergency hotline numbers (currently `0000-000-0000` in `services.json`)
- [x] Per-office phone numbers and email addresses (`contact.json`) — real, from the LGU's official office directory sheet (2026-09-06); the invented `@calatrava.gov.ph` addresses were removed
- [x] Service requirements, classification, who-may-avail — real, from `Citizen's Charter 2023.pdf` (`citizens-charter.json`)
- [x] Service fees / processing times in `services.json` — reconciled against the Charter PDF (41 services across 8 groups); amounts the Charter does not fix read "Per Local Revenue Code" or "See Citizen's Charter"
- [ ] Real news items, programs, and Full Disclosure budget/procurement PDF links
- [ ] Real recognition/award seals (currently placeholder labels)
- [ ] Municipal Hall map embed URL in `contact.json` (currently a generic Google Maps embed)
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

then open <http://localhost:5173/>. Pages **must** be served over HTTP for the
JSON `fetch` to work; opening the files directly falls back to the inline
defaults.

## Deployment

Designed for **GitHub Pages** — push to GitHub, then Settings → Pages → Deploy
from branch (`main`, `/root`). No build step, no secrets, no backend; the site
serves as-is and `data/*.json` is the source of truth.

> **Note:** a staff admin editor is not included yet. To add GitHub-API
> publishing (like the tourism portal's `admin.html`), copy that pattern and
> point it at this repo's `data/*.json`.
