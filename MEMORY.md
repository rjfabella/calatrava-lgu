# MEMORY.md — Calatrava LGU Website: project history & status

Running log of decisions, status, and open items for this project. Update
this file (don't just accumulate context in chat) whenever something here
changes materially — a decision gets made, real data replaces a placeholder,
or a new open question comes up. Keep entries short; link out to
`claude/standards-and-checklist.md` in the Claude Project for the full
research writeups rather than duplicating them here.

## Project goal

Build the official LGU website for the Municipality of Calatrava, Romblon,
following DICT and DILG standards, with a more modern UI, integration with
current systems, and eventually a one-stop-shop for LGU services. Plan first
(data gathering + design), build with code after. Owner: RJ, freelance
developer, working under a Job Order arrangement with the Calatrava
municipal government.

## Key decisions (resolved)

- **Site relationship to the tourism portal** — `calatravaromblon.gov.ph` is
  RJ's own earlier project, a tourism portal, built first because tourism is
  the current mayor's priority. It shows a Tourist-vs-Local popup gate on
  load; "Local" redirects to this LGU site. The two are one connected system
  sharing a domain/gateway. Resolved 2026-08-31 — previously an open
  question about domain ownership.
- **Design direction** — plain HTML/CSS/JS, no build step, no framework, no
  backend. Chosen for simplicity of handoff/maintenance to LGU staff and
  because there's no ICT staff confirmed yet to maintain a more complex
  stack. IA modeled on a comparable PH municipal site (San Agustin,
  Romblon) and on GWTD conventions; brand carries over from the tourism
  portal (green + gold, motto "Abante pang gador, Calatrava!").
- **Content collection process** — rather than RJ chasing every department,
  a single consolidated checklist (12 sections, source office per item) was
  compiled and delivered to the Mayor's secretary as
  `Calatrava_LGU_Website_Data_Collection_Checklist.docx` (2026-08-31,
  in `assets/contents/`) for her to collate across offices.
- **Source documents become structured JSON, not linked files** (2026-09-06)
  — when real LGU documents (Citizen's Charter, org chart) arrive as PDF/PPTX,
  they get parsed into `data/*.json` rather than just linked as downloads.
  JSON is what the rest of the site already runs on, is diffable in git, and
  is what a future non-technical editor could update. The original PDF/PPTX
  stay in `assets/contents/` and are still linked from Transparency for
  legal/compliance completeness (DILG FDP expects the actual document to be
  available), but the site's own pages render from the JSON.

## Standards research

Full governing-standards table (DICT GWTD, WCAG 2.0 AA, RA 10173, DILG FDP,
Citizen's Charter/RA 11032, FOI, SGLG, Transparency Seal) and the 12-section
checklist are in the Claude Project doc `claude/standards-and-checklist.md`
— treat that as the source of truth, this file only tracks status.

## Current repo status (updated 2026-09-06)

Site scaffold is built and functional (7 pages, shared chrome via
`assets/app.js`, content via `data/*.json`) — see `CLAUDE.md` for the
architecture.

**Real / confirmed:**
- Motto, brand colors (green/gold), contact number (0966 439 3711), email
  (andagaotour@gmail.com), Facebook page ("Calatrava Romblon")
- Population: 11,342 (2020 PSA)
- The 7 barangay names and population figures
- **Elected officials** (Mayor, Vice Mayor, 8 SB Members, 3 ex-officio SB
  members) and **13 department heads** — sourced from `Organizational Chart
  2026.pptx`, now in `data/officials.json` and the fuller `data/organization.json`
  (all 61 plantilla positions with salary grade, by office)
- **All 45 frontline services** from the Citizen's Charter 2023 (Edition
  II) — office, classification, transaction type, who may avail, and the
  full requirements checklist with where-to-secure — now in
  `data/citizens-charter.json` and rendered as a browsable accordion on
  `services.html#charter`

**Newly added this session:**
- `data/organization.json` — full org chart (13 offices, 61 positions,
  names + position titles + salary grade), parsed from
  `assets/contents/Organizational Chart 2026.pptx`
- `data/citizens-charter.json` — all 45 services from
  `assets/contents/Citizen's Charter 2023.pdf`, grouped by office
- `data/officials.json` updated with real names for the Mayor, Vice Mayor,
  Sanggunian, and department heads (photos still placeholder)
- `data/transparency.json` now links the actual Citizen's Charter PDF and
  Organizational Chart PPTX under Plans & Reports / Governance
- `services.html` gained a "Citizen's Charter directory" accordion section
  (id `charter`) rendering `citizens-charter.json` — requirements table,
  fees, processing time, per service, with a link to the source PDF page

**Added in a second session on 2026-09-06 (after the parse session above):**
- `data/officials.json` gained `mandate` and `servicePledge` — the official
  RA 11032 mandate text and the LGU's Service Pledge, transcribed from the
  Citizen's Charter's front matter (pages 2–3). `vision`/`mission` were also
  replaced with the Charter's exact approved wording (the previous text was
  a written-for-the-site paraphrase, not the approved statements).
- `about.html` gained a "Mandate & service pledge" section (id `mandate`)
  rendering those two fields, plus a source link to the Charter PDF and a
  download link for the Org Chart PPTX under the departments list.
- `data/transparency.json` restructured: every document now carries a
  `status` of `available` or `pending`, and `transparency.html` renders
  pending rows as non-clickable grey rows instead of dead `href="#"` links.
  Real links added for the Charter PDF, the Org Chart PPTX, the on-site
  charter directory, and the DILG FDP portal.
- `data/contact.json` — the office directory now carries the 13 real
  department heads, with office names matched to `organization.json`.
  The invented `@calatrava.gov.ph` addresses and `0000-000-0000` numbers
  were removed rather than left looking real; `contact.html` renders a
  missing phone/email as a plain em dash instead of a broken `mailto:`.
  **Real per-office emails and mobile numbers were supplied later the same
  day** from the LGU's official office directory sheet and are now in place
  for all 13 offices (personal/office Gmail and Yahoo accounts — the LGU
  does not use `@calatrava.gov.ph` mailboxes today). MDRRMO carries its
  acronym in the office name per the source sheet.
- Elected officials on `about.html` now render the Mayor and Vice Mayor as
  wide `lead-official` cards, with the other 11 in the standard grid.

**Also this session:**
- **The LGU email is `andagaoutour@gmail.com`** (note the `u` in
  "andagaou") — confirmed by RJ against the official directory sheet. The
  site previously carried `andagaotour@gmail.com` in `contact.json` and the
  `assets/app.js` footer; both corrected.
- **Emergency band** added to the shared chrome (`buildEmergencyBand()` in
  `assets/app.js`, `.emg-band` in the stylesheet). It renders **directly
  above the footer** on every page — same placement as the tourism portal —
  with the portal's red (`#B3261E`, sampled from the live site) and the same
  hotline, **0930 326 4161**. The number lives in one constant,
  `EMERGENCY_HOTLINE`. The old hardcoded `.emerg` strip on `index.html`
  (placeholder numbers, homepage only) was removed in favour of it;
  `services.json`'s first hotline entry now carries the real number too.
- **Brand accent green is `#1E740F`** (RJ's choice, 2026-09-06) — set on
  `--ocean`, the token used for links, icons, and highlights. `--deep`
  (`#0E3D1B`) and `--teal` were left alone. Contrast checked for the WCAG
  2.0 AA requirement: 5.9:1 on white, 5.6:1 on cream, 5.1:1 on sand, and
  5.9:1 for white text on the accent — all pass for normal text.

**Readability pass for older users (2026-09-06):**
- **Fonts changed** — display is now **Merriweather** (was Cormorant Garamond,
  a light-stroke serif that read as thin on screen) and body is **Source Sans 3**
  (was Jost, a geometric sans with a small x-height). Both were picked for a
  large x-height and sturdy strokes. Headings run at 700 where they used to be
  300–500. The Google Fonts `<link>` is identical in all seven pages — change
  it in all of them together.
- **Base font size 16.8px → 18.5px**, body line-height 1.6 → 1.7, and every
  component size was raised with it. **Nothing on the site renders below
  12.5px now**; body copy sits at 16–18.5px.
- **Palette adjusted for contrast, not taste** — the antique gold was too light
  to carry small text (3.2:1), so `--gold` went `#B8862F` → `#8A6218` for text
  and `--gl` (`#E6C173`) is now the gold used on dark backgrounds. `--muted`
  darkened to `#586255`, `--deep` to `#123F1E`, and low-opacity white text in
  the footer/breadcrumbs was raised from .45–.55 to .82–.88.
- **Result: zero WCAG AA contrast failures** across index, services and
  transparency (measured, not eyeballed — every text node's computed colour
  against its real backdrop). Was 8 failing styles before.
- **Also added:** a skip link, a real `<main id="main">` landmark (injected by
  `wrapMain()` in `initChrome`, since the pages had no landmark at all),
  `:focus-visible` outlines, `aria-current` on the active nav item, 44px
  touch targets on nav/footer/social links, a 26px hit area on the hero dots,
  and a `prefers-reduced-motion` block. The hero slider now pauses on
  hover/focus and does not auto-advance for reduced-motion users (WCAG 2.2.2).

**Agency logos for the Good Governance section (done 2026-09-06):**
- The homepage "Recognition & certifications" band now shows real agency
  marks instead of generic line icons. `data/site.json` recognitions take an
  optional `logo` path; `index.html` renders it on a white circular plate
  (`.seal-logo`, 72px) because the band is dark green and the marks are
  full-colour. If the image 404s the line icon reappears automatically.
- Logos in `assets/logos/`: **`dict.png`** (supplied by RJ; renamed from
  "DICT Logo.png" so the URL has no `%20`), **`dilg.png`** and **`npc.png`**
  (downloaded from Wikimedia Commons via `Special:FilePath?width=320` —
  official PH government works, public domain under RA 8293/10372).
- **The real SGLG seal arrived** — RJ added `assets/logos/DILG_SGLG.png`, so
  that entry no longer falls back to the plain DILG seal. He also supplied
  `NPC_Logo_1.webp` (the full NPC lockup with wordmark), which replaced the
  downloaded keyhole-only `npc.png` everywhere; `npc.png` was deleted as
  unused. `Bagong_Pilipinas_Logo.png` was already in the folder.
- Two gotchas worth remembering: the `hidden` attribute **does not hide an
  `<svg>`** (it is an HTML-only IDL attribute), so the icon fallback is
  toggled with an `.is-fallback` class; and in the `onerror` handler you must
  grab `closest('.seal-chip')` **before** calling `this.remove()`, or the
  element is already detached and the lookup returns null.
- **Still unresolved: nobody has confirmed Calatrava actually holds these
  statuses.** "NPC Registered", "SGLG" and "eGovPH Ready" came from the
  original placeholder scaffold. A real agency seal beside an unverified
  claim reads as a false certification — worse than a generic icon. Confirm
  each with the Mayor's office, and drop any entry that does not check out,
  before this page goes public. "Full Disclosure Policy" is the safest of the
  four now that the Transparency page backs it up.
- **All logos were cropped and downscaled (2026-09-06)** with Pillow (now
  installed): transparent margins trimmed to the artwork's alpha bounding box,
  then capped at 480px on the long side. `dict.png` had ~30% empty margin,
  which is why it looked shrunken in its plate — it now fills the 104px plate
  at 84×104. Total saving ~360 KB. **If a logo is ever replaced, crop it the
  same way** or it will render small next to the others.

**Homepage layout work (2026-09-06):**
- **Recognitions are now certification cards** (`.certs` / `.cert-card`,
  replacing the old `.seals` / `.seal-chip` pills). White card on the dark
  band, inset gold hairline to read as a certificate, a **fixed 104px logo
  plate** and a `min-height` so all four cards stay identical even though the
  marks differ wildly in proportion — DICT is portrait, SGLG and NPC are
  landscape, DILG is square. Verified: all four render 282×268.
- **Footer "In partnership with" now shows logos**, not text chips — DILG,
  DICT, NPC and Bagong Pilipinas on uniform 138×70 white plates (the footer
  is dark, the marks are full-colour). Driven by the `PARTNERS` array in
  `assets/app.js`; each falls back to its old text chip if the file is
  missing. The agency name lives in `alt`, so nothing is lost to screen
  readers.
- **The header CTA** (`.nav-cta`) is a solid accent-green button with a gold
  underline, symmetrical 14/28px padding, a drop shadow and a hover lift. It
  carried an icon briefly; RJ had it removed. **Its selector must stay
  `.nav-links .nav-cta` (0,2,0)** — plain `.nav-cta` (0,1,0) loses to
  `.nav-links a` (0,1,1) and the button silently collapses to a text link's
  padding.
- **The "Services" tab was removed from the nav** (RJ, redundant with the
  Online Services button). `services.html` is now reached only through that
  button and the footer links. **Watch this:** that page holds the whole
  Citizen's Charter (45 services), the service groups and the emergency
  hotlines — far more than "online services" — so if constituents report
  trouble finding the charter, the fix is to relabel the button "Services" or
  point it at the top of the page rather than `#online`.
- **The mobile menu had no Online Services entry at all**, so removing the
  Services tab left `services.html` unreachable on phones. A `.mob-cta`
  button was added to the mobile nav to match the desktop header.
- **Vision & Mission now appear on the homepage** (`#vision-mission`, placed
  between the eLGU band and the Mayor's welcome so the light/sand/light
  rhythm holds). Framed two-up card, gold top rule, circled icons, and a
  faint municipal seal watermark behind it.
  **The mission is rendered as a list, not a paragraph** — the Citizen's
  Charter states it as eight numbered commitments, and a long centred
  paragraph is hard to read, especially for this site's older audience. That
  meant adding `missionLead` + `missionPoints` to `data/officials.json`
  alongside the existing single-string `mission`, which `about.html` still
  uses. **Keep the two in sync when either changes.**

**Mobile audit — all 7 pages at 375px (2026-09-06):** no horizontal scroll, no
text under 12.5px, no WCAG AA contrast failures, no undersized tap targets.
Two 21–22px `.mandate-note` links (about + services) were padded to clear 24px.
The charter tables and the contact map scroll inside their own containers by
design and are excluded from the overflow check. Mobile menu items measure
59–64px tall with a 48×48 close button.

**Facebook → News sync: BUILT AND THEN SCRAPPED (2026-09-10). Do not retry.**
- **Why it's dead: the municipal PIO account is a personal Facebook *Profile*,
  not a Page.** Meta's Graph API exposes no endpoint for reading a Profile's
  posts — that is a deliberate platform restriction, not a permissions or
  App Review problem, so no token, app, or workaround makes it work. Every
  automated route (Graph API, Page Plugin, third-party widgets like Juicer or
  EmbedSocial) depends on the account being a Page.
- **The one thing that would change this:** Facebook can convert a Profile
  into a Page. If the LGU ever does that, the approach below was sound and
  the removed code is recoverable from git history (commits `4c4c2a7` and
  `ca0da4c`, removed after).
- What was built and removed: `scripts/sync_facebook.py`, the
  `.github/workflows/sync-facebook.yml` cron job, `docs/facebook-sync-setup.md`,
  `data/news-fb.json`, and `assets/news/`. `news.html` and the homepage no
  longer merge two sources; `data/news.json` is the sole source again, and
  the repo is back to zero build tooling and zero CI.
- **Findings worth keeping if this is ever revisited:** reading a Page you
  administer with your own app needs no App Review (Standard Access covers
  `pages_read_engagement`); Facebook's CDN image URLs are signed and expire
  within weeks, so photos must be copied locally rather than hotlinked; and
  Meta retires Graph API versions on a ~2-year cycle.
- **The Page Plugin iframe was rejected earlier for separate reasons** that
  still stand if anyone suggests it: it can't take alt text or honour the
  site's 18.5px type, and it contacts Meta for every visitor before any
  consent (RA 10173).
- **Consequence: the News page has no content pipeline at all.** It renders an
  empty state until someone adds items to `data/news.json` by hand. If news
  matters, the realistic options are a small admin form following the tourism
  portal's `admin.html` GitHub-API pattern, or staff editing the JSON.

**The under-construction popup was removed (2026-09-10)** at RJ's request —
`buildNotice()`, `closeNotice()`, `TOURISM_URL`, and the whole `.uc-*` CSS
block are gone. It had become a dead end anyway: its "Continue" button was
hidden in commit `2a3b767`, leaving only "Go back to Tourism Portal".

**Live-site bug sweep and fixes (2026-09-10, after PR #1 went live):**
Audited https://rjfabella.github.io/calatrava-lgu/ and fixed everything found.
- **Fake emergency numbers were dialable.** Police / RHU / BFP rendered
  `0000-000-0000` as working `tel:` links. `renderHotlines()` now only emits a
  link when a number is real (7+ digits, not all zeros); anything else renders
  as a non-clickable pending row pointing at the MDRRMO number. **Never let an
  unconfirmed hotline look callable** — a dead `tel:` in an emergency is worse
  than a blank.
- **All five news items were fabricated** (invented permit extensions,
  ordinances, bid invitations) and 87 days stale. Removed. `data/news.json`
  now holds an empty `items` with a documented `_example`; `news.html` shows an
  empty state, and the homepage hides its news section entirely when empty.
- **The DPO email `dpo@calatrava.gov.ph` was invented** and unreachable (the
  LGU has no `@calatrava.gov.ph` mailboxes). Removed from the footer. A `dpo`
  object now sits in `data/contact.json`, empty on purpose, and `privacy.html`
  renders it automatically once filled.
- **New `privacy.html`** — the footer's "Privacy Notice" was `href="#"`, which
  RA 10173 requires to be real. Written to describe what the site *actually*
  does: no collection, no analytics, no cookies of ours, with Google
  Fonts/Maps and GitHub Pages named as the third parties that do see requests.
  Revisit it the moment any form or online transaction is added.
- **`[Punong Barangay]` placeholders** replaced with a graceful "To be
  announced"; captains are empty strings in `barangays.json` until real names
  arrive.
- **The Mayor's photo rendered as a 614px solid green block** (`<img src="">`
  failing into an `onerror` that painted the wrapper `--deep`). Replaced with
  a `monogram()` helper in `app.js` — initials on the sand tone — used for the
  mayor's welcome and all 13 official photo slots. Reads as pending, not
  broken. **Don't reintroduce `<img src="">`.**
- Single-slide hero no longer renders a lone slider dot; the charter PDF link
  got a real tap target.
- Re-audited all 8 pages at 375px: no overflow, no text under 12.5px, no
  contrast failures, no tap targets under 24px, no images missing alt.

**Portraits replaced with a matched set (2026-09-16).** The LGU re-shot all
13 as one composite series — same municipal-hall green backdrop with flag,
same seal, **no caption bands**, all 1536×2047 (3:4) — and dropped them in
under the same filenames, so `officials.json` needed only one change: the
Mayor's file is now `Portrait_Mayor.jpg` (the old `Portrait_Mayor1/2.jpg`
and `MBF Portrait.png` went into `assets/images/Archive/`, which is now
gitignored — they survive in git history). Faces were cross-checked against
the previously verified set; the mapping is unchanged.
**Lesson: don't re-encode the LGU's exports.** They arrive already compressed
harder than a q86 re-save, so downscaling 1536→960 *grew* the files by ~23%
(2.0 MB → 2.4 MB total). The 960×1280 versions are what's committed — fine
visually and correctly sized for every render — but the next drop should be
used as-is. If bytes ever matter, ask RJ for the originals rather than
re-encoding a second generation.

**Officials' portraits — all 12 first added 2026-09-12.**
- The LGU dropped 14 files into `assets/images/` named by initials
  (`Portrait_VM-EFF.jpg`, `Portrait_SB-HFF.jpg`, …). **Every mapping was
  confirmed against the name printed on the photo itself**, not just the
  filename — the studio portraits carry a "HON. NAME / ROLE" caption band.
  `SB-EMM` didn't match Emil Ralph M. Fajel's initials, but its caption reads
  "HON. EMIL RALPH F. FAJEL", which settled it.
- Two officials came with a second file. **RJ chose the candids** (`SB-VCM`,
  a selfie; `SB-RFR`, an event photo) over the studio "2" versions, which
  were then deleted. Both candids were cropped to 3:4 — RFR anchored to the
  top edge because his head sits right at it, VCM trimmed evenly at the
  sides. RFR is only 508×677 (its native width); at the grid's 153×203 that
  is still 2.5× density, so it is fine, but it will look soft if the frame
  ever grows much.
- **The files were cropped and downscaled in place** (originals are with the
  LGU). The studio photos are 2:3 with the caption band in the bottom ~11%;
  the grid frame is 3:4. Removing the band by cropping to `width × 4/3` from
  the top yields exactly 3:4 — the template was clearly built as a 3:4 photo
  plus a band — so no side crop and no `object-position` hacks. `SB-NFF`'s
  caption sat higher than the others and needed a tighter crop. All are now
  900×1200 JPEG, roughly half their original weight. **If a new portrait
  arrives, crop it the same way** or its caption will show through the frame.
- **Two names differed between the org chart and the photo captions; RJ
  ruled the photos are correct** and both `officials.json` and
  `organization.json` were updated to match (2026-09-12):
  1. *Emil Ralph M. Fajel* — **the org chart was right after all.** RJ first
     said to follow the photo caption ("F."), then corrected himself: the
     middle initial is **M.** The photo's caption is the one with the typo.
  2. **NorvelKimwell F. Falcutila** — also the org chart's version, with RJ's
     capitalisation (one word, capital K, "F." restored). The photo caption's
     two-word spelling without the initial was the error. Briefly changed to
     the caption's form and reverted the same day.
  **Net result: both names follow the org chart. The photo captions are the
  ones with typos.** The order of events matters only so nobody "corrects"
  either name from the photos again.
  The org chart PPTX in `assets/contents/` still has the old spellings; it is
  the source document and is left untouched.
- `Banner.jpg` (2048×853) arrived in the same drop with no instruction. It
  is committed but not wired in — presumably a future hero slide.

**Mayor's portrait — RESOLVED 2026-09-11.** The LGU supplied two portraits
(`assets/images/Portrait_Mayor1.jpg`, `Portrait_Mayor2.jpg`, both 1536×2047)
and asked for **#2** on the homepage welcome and the Government page. It is
the same person as the earlier `MBF Portrait.png`, so the "M.B.F." monogram
question is settled by the LGU's own instruction — the initials are simply
not R.M.F. Both `welcome.photo` and `elected[0].photo` in `officials.json`
now point at `Portrait_Mayor2.jpg`. The portrait is 3:4, which is exactly the
officials-grid frame (no crop) and a ~3% top/bottom crop in the 4:5 welcome
frame — the face is nowhere near it. `Portrait_Mayor1.jpg` and
`MBF Portrait.png` are now unused; the latter (1.3 MB) could be deleted.

**Known gaps / needs a human decision before this goes further:**
- **`fees` and `processingTime` in `citizens-charter.json` are auto-extracted
  from the PDF's tables and are best-effort, not verified** — the PDF's
  multi-row step tables don't extract perfectly (wrapped cells, occasional
  merged lines). `requirements`, `classification`, `transactionType`, and
  `whoMayAvail` came from cleanly bordered table cells and are reliable.
  Before quoting a fee to a resident from this data, cross-check the cited
  `sourcePages` in the actual PDF.
- **Discrepancy resolved 2026-09-06:** `data/services.json` was reconciled
  by hand against the Charter PDF (not against the auto-extracted JSON) and
  expanded from 20 to 41 services across the same 8 groups. Both known
  discrepancies were real and the PDF won: Death Certificate is **₱50**
  (was ₱100) and the Marriage License is **₱450** (was ₱200). Figures
  spot-checked directly in the PDF: birth/death/marriage registration
  (pp. 21–26), cedula (p. 51), RPT (pp. 53–54), building permit (pp. 64–65).
  Where the Charter does not fix an amount the card now says
  "Per Local Revenue Code" or, for a genuinely unstated fee,
  "See Citizen's Charter" — rather than inventing a peso figure.
  Still worth considering longer term: have the cards pull fee/time from
  `citizens-charter.json` so there is only one number to keep current.
- **"Municipal Administrator's Office" does not appear in the 2026 org
  chart at all** — the old placeholder department list in `officials.json`
  assumed one existed. Removed from the department list rather than left as
  a placeholder. Worth confirming with HR whether Calatrava's plantilla
  simply doesn't have this position (common for smaller municipalities) or
  whether it was omitted from the chart by mistake.
- **Salary grades are included in `organization.json`** (as supplied in the
  PPTX) but not surfaced on any public page yet — decide whether to show SG
  per position on a public "full org chart" page (common practice for PH
  LGU transparency pages) or keep it as backing data only.
- One typo in the source PPTX was corrected during parsing: the Assessor's
  slide read "OFFICE OF THE OFFICE OF THE MUNICIPAL ASSESSOR" (doubled
  prefix) — normalized to "Office of the Municipal Assessor" in
  `organization.json`.
- Term dates ("2025–2028") for elected officials are carried over from the
  prior placeholder and are NOT confirmed by the org chart (which has no
  term-date field) — verify against the 2025 SOCE/COMELEC proclamation.
- **Source documents are linked from `assets/contents/`, not copied
  elsewhere.** A second session briefly created a parallel
  `assets/documents/` folder with renamed copies of the same PDF/PPTX;
  it was removed. One folder, one copy — `assets/contents/` — linked from
  `transparency.json` with URL-encoded spaces
  (`assets/contents/Citizen's%20Charter%202023.pdf`).
- **Uncommitted work sat in this repo across two same-day sessions.** The
  second session started from a `git status` snapshot that predated the
  first session's writes and overwrote `data/officials.json`, briefly
  dropping the `welcome` object that `index.html` renders. Recovered.
  Commit at the end of a session, and re-check `git status` before writing
  any `data/*.json` that another session may have just produced.

**Still placeholder — pending real data:**
- ~~Official photos~~ **DONE 2026-09-12** — all 13 elected officials now have
  portraits. See "Officials' portraits" below for how the files were prepared
  and two name discrepancies the photos surfaced.
- ~~Barangay captains for all 7 barangays~~ **DONE 2026-09-22** — names +
  mobile numbers from the LGU's printed directory (photo), emails from the
  LGU's Google Contacts "Barangay's" label (screenshot), official seals
  pulled from the MNAO office-profile .docx into `assets/images/barangays/`.
  Three emails (Linao, Pagsangahan, San Roque) were cut off after "@gm…" in
  the screenshot and were completed as @gmail.com — confirm with the LGU.
  Falcutila's spelling follows the earlier org-chart decision
  ("NorvelKimwell"); the printed directory writes it "NORVEL KIMWELL".
- ~~Emergency hotlines~~ **DONE 2026-09-10** — the site-wide emergency band
  now carries a second line with Police, Fire, Health and Coastguard beneath
  the Emergency Command Center number. Those four are read from
  `data/services.json` at runtime by `fillEmergencyDepartments()` rather than
  duplicated into `app.js`, so the band and the Services page can never
  drift; only the order and the command-centre number are hardcoded. If the
  fetch fails the second line stays hidden and the main hotline is
  unaffected. Sanitation is deliberately left off — not an emergency service.
  All six are real, from the
  LGU's official "Calatrava Hotlines" infographic: Emergency Command Center
  0930 326 4161, Police 0998 598 5883, Fire 0999 433 3661, Health
  0907 237 1460, Coastguard 0995 660 2401, Sanitation 0929 436 2082. Office
  names follow the infographic so they match the posted version residents
  see. These are public hotlines and remain distinct from the office-head
  mobile numbers in `contact.json`.
- Real news items — `data/news.json` is deliberately empty; the page shows an
  empty state until someone adds items by hand (no automated source exists —
  see the scrapped Facebook sync above)
- A designated Data Protection Officer (`dpo` in `contact.json`, empty)
- Real news items, ongoing programs, Full Disclosure Budget/Procurement
  PDFs (Annual Budget, SRE, APP, ordinances, resolutions, executive orders
  — all marked `"status": "pending"` in `transparency.json`)
- Real recognition/award seals (currently placeholder labels)
- Municipal Hall map embed URL (currently a generic Google Maps embed)
- Founding year / municipal history details

## Open questions (unresolved, need Mayor's office input)

- Who is the designated ICT/MIS focal person?
- Any existing online systems (permits, e-payment) that this site needs to
  integrate with?
- Hosting preference: GovCloud vs. GitHub Pages (current plan is GitHub
  Pages — confirm this is acceptable, since GWTD favors GovCloud/DICT-vetted
  hosting)
- Is there a branding guide beyond the seal that this site and the tourism
  portal should both follow?
- Does the Municipal Administrator position exist? (see gap above)
- Should salary grades be public on the site, or internal-only?

## Next steps

1. ~~Reconcile `data/services.json`'s fee/time summary cards~~ — done
   2026-09-06. Optional follow-up: refactor `services.html` to source
   fee/time from the Charter data directly so there's only one number to
   keep current.
2. Spot-check `data/citizens-charter.json`'s `fees`/`processingTime`/
   `personResponsible` arrays against the PDF for the highest-traffic
   services first (business permit, civil registry, RPT) before treating
   them as authoritative.
3. Chase the Mayor's secretary for the remaining checklist items: photos,
   barangay captains, hotlines, FDP budget/procurement documents, term
   dates. **2026-09-22 update:** a first batch of 30 office documents
   arrived and was audited into `assets/reference docs/` (see its
   `README.md`). Still nothing for: Cicha (item 1, unclear), Pledge, Brief
   History, CLUP, LDIP, MPDO, the Annual Budget ordinance itself (only
   the four 2025 supplementals came), Punong Barangay contacts. Three files
   are duplicates of content already parsed (Citizen's Charter pp. 21–26
   and 64–67; a generic NBC B-02 form).
4. **2026-09-24 IA change.** Government lost Vision/Mission and Mandate
   (still in `officials.json`, still rendered on the homepage); History moved
   to a new **About Us** tab along with the Find-us map from Contact. Header
   CTA is now plain "Services". The history text is DRAFT, compiled from
   Wikipedia and **not yet verified by the LGU** — see `_historyNote` in
   `officials.json`. Department acronyms come from the Citizen's Charter; the
   Accountant's and Vice Mayor's offices have none there, so their chips are
   deliberately blank rather than invented. One dept-head portrait is unused
   (MLGOO — a DILG-assigned officer, not an LGU office). The Mayor's and
   Vice Mayor's offices are deliberately absent from the departments grid;
   both lead the Elected Officials grid above it.
5. Parse the reference-docs batch into JSON — office profiles (mandate/
   vision/mission/services for BPLO, MASSO, MBO, MEO, MSWDO, MNAO, OMAG,
   KALAHI), the 4 emergency hotlines (replace the pending rows), the 7
   barangay seals from the MNAO doc, permit forms as downloads, and the FDP
   documents (GAD AR 2025, GAD PB 2027, LDRRMF Jan–Jul 2026, Supplemental
   Budgets 1–4 CY2025) into `transparency.json`. Not started — RJ wants
   structure agreed first.
5. Decide the Municipal Administrator and salary-grade-visibility questions
   above.
6. Run a WCAG 2.0 AA pass once real content (esp. photos, PDFs) is in place.
7. Decide on hosting (GitHub Pages vs GovCloud) with the Mayor's office
   before final launch, given GWTD's hosting guidance.
