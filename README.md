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
  - `officials.json` — mayor's welcome, vision/mission, officials, departments, history
  - `services.json` — 8 service groups, online services, emergency hotlines
  - `barangays.json` — the 7 barangays, captains, population
  - `news.json` — news items (sorted by date automatically)
  - `transparency.json` — Full Disclosure document links
  - `contact.json` — office directory, address, map embed
- **Styling:** one shared `assets/style.css` carries the design system
  (Cormorant Garamond + Jost, green / gold palette). Re-theme via the `:root`
  variables.
- **Assets:** `assets/logos/` (municipal + provincial seals), `assets/hero/`
  (banner images).

## Fill-in checklist (placeholders to replace)

- [ ] Names of the Mayor, Vice Mayor, SB members and department heads (`officials.json`, `contact.json`)
- [ ] Barangay captains for the 7 barangays (`barangays.json`)
- [ ] Official photos — drop into `assets/` and set the `photo` paths
- [ ] Emergency hotline numbers (currently `0000-000-0000`)
- [ ] Service fees / processing times (verify against the Citizen's Charter)
- [ ] Real news items, programs, and Full Disclosure PDF links
- [ ] Real recognition/award seals (currently placeholder labels)
- [ ] Municipal Hall map embed URL in `contact.json` (currently a generic Google Maps embed)

> **Real data:** the motto, brand colors, and contacts (0966 439 3711 ·
> andagaotour@gmail.com · FB "Calatrava Romblon") are real, as are the
> population (11,342, 2020 PSA) and the 7 barangay names/figures. Officials,
> founding year, and emergency hotlines are placeholders to verify.

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
