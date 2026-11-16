# Reference docs — audit index

Source documents collected from LGU offices (batch received Sept 2026, c/o
Anamher). Files are renamed `Dept_<title as written inside the document>`.
Nothing here is on the website yet — this folder is the staging area; the
pattern (see `CLAUDE.md`) is to parse a source doc into `data/*.json` and
keep the original linked from `transparency.json` where FDP/legal
completeness requires it.

Tracking sheet: `Calatrava LGU Website Development.xlsx` → **Checklist**
tab, columns H (Reference Document(s)) and I (Coverage / Gaps).

**Only this README and the tracking sheet are in git.** The raw submissions
(~30 MB of scans and DOCX) are `.gitignore`d and live only on RJ's machine —
ask for them if you need to re-parse anything.

## Inventory

| File | Office | What it actually contains | Format | Checklist item |
|---|---|---|---|---|
| `BPLO_Mandate Key Functions and Services Offered.docx` | BPLO | Mandate, 4 key functions, 6 services (new permit, renewal, modification, closure, special permits, inspection) | text | 7, 23 |
| `GFPS_Annual GAD Accomplishment Report CY2025 (FDP Form 5).xlsx` | GFPS / MSWDO | FDP Form 5. Total LGU budget 2025 ₱119,561,203; GAD expenditure ₱3,303,427; ~20 PPAs with budget vs actual; attributed programs. Prepared by Levie F. Fajilan, approved 21 Jan 2026 | data | 9, 25 |
| `GFPS_Annual GAD Plan and Budget FY2027.xlsx` | GFPS | GPB FY2027 (sheet `PCM` is the form). Total LGU budget FY2027 ₱157,082,776; GAD budget ₱7,521,229.50; PPAs with lead office. Also a `Barangay` sheet + scratch sheets | data | 9, 11, 25 |
| `KALAHI_Philippine Community Resilience Project (PCRP) Overview.docx` | KALAHI-CIDSS | PCRP overview, PAGKILOS principles, 4 components, targeting, eligible/negative list, ₱70M 3-year grant (2026–29), 6 infographics + logo | text + images | 16 |
| `MASSO_Mandate Vision Mission and Services.docx` | Assessor | Mandate, vision, mission, 7 services | text | 4, 5, 7, 15 |
| `MBO_Mandate Vision Mission MFO and Targets CY2027 (LBP Form 4).pdf` | Budget | LBP Form 4 (Annex G): mandate (5), vision, mission, org outcome, Budget Management Program targets, ₱1,720,457.21 | scan | 4, 5, 7, 19 |
| `MBO_Supplemental Budgets Nos 1-4 CY2025 (SB Appropriation Ordinances).pdf` | Budget / SB | 40 pp. Four ordinances: **No. 1 s.2025** (SB No. 1, ₱5,685,654.07, 24 Mar 2025, pp. 1–11) · **No. 2 s.2025** (SB No. 2, ₱43,075,620.88, 8 Aug 2025, pp. 12–18) · **No. 3 s.2025** (SB No. 3, ₱1,012,360.13, 27 Aug 2025, pp. 19–29) · **No. 5 s.2025** (SB No. 4, ₱1,808,000.00, 15 Dec 2025, pp. 30–40) | scan | 9, 11 |
| `MCR_Citizens Charter 2023 pp21-26 Civil Registry Services (DUPLICATE).pdf` | Civil Registrar | Pages 21–26 of the Citizen's Charter (5 MCR services) | scan | 20 |
| `MDRRMO_LDRRMF Utilization Reports Jan-Jul 2026 (FDP Form 8).pdf` | MDRRMO | FDP Form 8, one page per month Jan–Jul 2026, signed Rabino / Famadulan, DILG-received | scan (alternating orientation) | 9, 14 |
| `MDRRMO_Municipal Emergency Hotline Calatrava.docx` | MDRRMO | 4 hotlines: Emergency Command Center 0930 326 4161 · PNP 0998 598 5883 · BFP 0999 433 3661 · RHU 0962 462 4365. Also MDRRMO logo (2015) and letterhead (E. Fetalino St., Poblacion; drrmcalatrava@gmail.com) | text + images | 2, 14 |
| `MEO_Citizens Charter 2023 pp64-67 Building and Occupancy Permits (DUPLICATE).pdf` | Engineering | Pages 64–67 of the Citizen's Charter (Building Permit, Occupancy Permit) | scan | 17 |
| `MEO_Mandate Vision Mission MFO and Targets CY2027 (LBP Form 4).pdf` | Engineering | LBP Form 4: mandate (4), vision, mission, 5 PPAs (₱5,544,549.95) + 10 20%-DF projects for 2027 | scan | 4, 5, 7, 12, 17 |
| `MEO_Municipal Engineer Profile (Portrait and Office Contact).docx` | Engineering | Portrait of Engr. Laureano F. Falcutila III (1482×2048 JPEG); text boxes: office no. as typed "+6939 695236538" (12 digits after +63 — not a valid PH number as written, verify), hours 8:00–5:00 | image | 2, 17 |
| `MEO_Permits/` (13 PDFs) | Engineering / OBO | Blank NBC permit application forms — see below | fillable/print PDF | 17 |
| `MNAO_Office Profile and Weight for Age CY2026.docx` | Nutrition | Vision, mission, MNAO designee + staff w/ mobile nos., Municipal Nutrition Committee (16), 7 BNS by barangay, Weight-for-Age CY2026 (900 children), **all 7 barangay seals** as images, NNC logo | text + images | 2, 3, 21, 22 |
| `MSWDO_Vision Mission and Services Offered.pdf` | Social Welfare | Vision, mission, 5 services, requirement lists (medical, burial, fire, case study, VAWC, PMC), livelihood programs, solo-parent / PWD / senior registration requirements | scan (CamScanner) | 4, 5, 24 |
| `OMAG_Office Profile Agricultural Statistics and Programs.docx` | Agriculture | Staff (6), 7 statistics (1,692 farmers; 2,327 fisherfolk; 121 boats …), 12 programs/services, letterhead (maocalatrava@gmail.com). Heading "List of Registered Farmers and Fisherfolk Organizations" is present but **the list is missing** | text + letterhead | 2, 18 |

### `MEO_Permits/`

| File | NBC form | Notes |
|---|---|---|
| `MEO_Unified Application Form for Building Permit.pdf` | Unified form | Calatrava header, but "CITY/MUNICIPALITY OF **CEBU**" left in the Location of Construction line — LGU to fix |
| `MEO_Unified Application Form for Certificate of Occupancy.pdf` | Unified form | generic header (blank LGU) |
| `MEO_Architectural Permit (NBC Form A-01).pdf` | A-01 | generic |
| `MEO_Civil-Structural Permit (NBC Form A-02).pdf` | A-02 | generic |
| `MEO_Electrical Permit (NBC Form A-03).pdf` | A-03 | generic |
| `MEO_Plumbing Permit (NBC Form A-06).pdf` | A-06 | generic |
| `MEO_Electronics Permit (NBC Form A-07).pdf` | A-07 | Calatrava header |
| `MEO_Demolition Permit (NBC Form A-08).pdf` | A-08 | generic |
| `MEO_Excavation and Ground Preparation Permit (NBC Form B-02).pdf` | B-02 | Calatrava header (Excel-built) — **keep this one** |
| `MEO_Excavation and Ground Preparation Permit (NBC Form B-02, generic) (DUPLICATE).pdf` | B-02 | generic version of the same form |
| `MEO_Fencing Permit (NBC Form B-03).pdf` | B-03 | Calatrava header |
| `MEO_Raising Permit (NBC Form B-09).pdf` | B-09 | generic |
| `MEO_Repair Permit (NBC Accessory Form 08-B).pdf` | Acc. 08-B | generic |

## Nov 2026 batch (uploaded to a Claude session, not to this folder)

Five files RJ uploaded on **2026-11-16** while away from his main machine. They
are **not stored in this folder** — session uploads are not part of the repo.
Three were re-sends of Sept 2026 documents, which is what made them parseable
without the machine that holds the originals; two were new.

| File (as uploaded) | Office | Status | Outcome |
|---|---|---|---|
| `BUSINESS_PERMIT_AND_LICENSING_OFFICE-Mandate_and_services.docx` | BPLO | re-send of the Sept file | **Parsed** into `lgu/data/offices.json` — mandate, 4 key functions, 6 services |
| `OMAG.docx` | Agriculture | re-send | **Parsed** — 6 staff, 7 statistics, 12 programmes, letterhead email |
| `Office_of_the_Budget_Officer.pdf` | Budget | re-send (LBP Form 4) | **Parsed** — mandate (5), vision, mission, organizational outcome, CY2027 proposed figures |
| `mcr.pdf` | Civil Registrar | re-send, duplicate of Charter pp. 21–26 | No new content, but **used to verify** `citizens-charter.json` |
| `Accounting_Docs-Cal.pdf` | Accounting | **NEW** — the office had submitted nothing before | **Split and published** — 20 FDP forms |

### `Accounting_Docs-Cal.pdf` → `lgu/assets/contents/fdp/`

20 pages, one FDP form per page, in no particular order. Split one file per
form per quarter and published on `transparency.html`. Source bundle MD5
`ad73e8f2f21dd395ca46287bfdd50ae3` (the bundle itself is not in the repo).

| FDP Form | Document | Periods | Source pages |
|---|---|---|---|
| Form 6 | Trust Fund Utilization / quarterly report on projects | CY2025 Q3–Q4, CY2026 Q1–Q2 | 14, 4, 9, 10 |
| Form 8 | LDRRM Fund Utilization | CY2025 Q3–Q4, CY2026 Q1–Q2 | 11, 5, 13, 12 |
| Form 9 | Statement of Cash Flows | CY2025 Q3–Q4, CY2026 Q1–Q2 | 19, 20, 18, 17 |
| Form 11 | Special Education Fund Utilization | CY2025 Q3–Q4, CY2026 Q1–Q2 | 7, 2, 15, 6 |
| Form 12 | Unliquidated Cash Advances | CY2025 Q3–Q4, CY2026 Q1–Q2 | 8, 1, 16, 3 |

**The scans were deliberately not re-encoded.** They are ~267 DPI CamScanner
JPEGs, ~400 KB per file, 7.9 MB in total. These are financial forms whose peso
figures have to stay readable, and re-encoding an already-compressed LGU export
has backfired here before (see `MEMORY.md` on the portraits).

### Flagged for the Municipal Accountant — published as supplied, on RJ's call

1. **CY2025 Q3 Form 12 totals do not add up.** The listed balances sum to
   **₱731,332.00**; the form's own total reads **₱651,357.00**. The ₱79,975
   difference is exactly the three aged rows (41,460.00 + 29,000.00 +
   9,515.00), so the total appears to count only the current column. Read off a
   scan — verify against the office's original before correcting anything.
2. **An advance dated 01/09/2019** (Susan Fajilan, ₱16,412.00) sits in the
   *under-30-days* column on the same form. Either the date or the ageing is
   wrong; a six-year-old unliquidated advance is also the first thing a reader
   will notice.
3. **Form 12 names individuals with amounts** (~24 people, incl. Sanggunian
   members). FDP Form 12 prescribes the debtor-name column, so this is required
   disclosure rather than a choice — recorded here only so nobody later assumes
   it was published without anyone noticing. RJ decided on 2026-11-16 to post
   all five forms as supplied and raise 1 and 2 with the Accountant separately.

### Other quality notes from this batch

- `Office_of_the_Budget_Officer.pdf` **page 1 is cropped at the foot**: the last
  performance indicator ("No overdrafts in … appropriation", target 0) is cut
  across the page break. The full row needs the LGU's original.
- The MBO mission reads "effieciency" in the source; normalised to "efficiency"
  when parsed, the same way the org chart's doubled office name was.
- OMAG's **"Total Rice area — 60 hectares"** against 5,987.502 ha of
  agricultural land looks low by an order of magnitude. Confirm before it is
  rendered.
- `mcr.pdf` confirmed three Charter fees exactly (Marriage Licence ₱450,
  Marriage Certificate ₱100, Death Certificate ₱50) and filled two empty ones
  with "Based on Revenue Code". It also shows the Charter's own requirement
  numbering jumping **1 → 6** for birth registration; items 2–5 do not exist in
  the source, so that is not a parse error.

## Redundant / already-covered files

| File | Why |
|---|---|
| `MCR_Citizens Charter 2023 pp21-26 … (DUPLICATE).pdf` | Scan of Citizen's Charter pp. 21–26. All 5 services already in `data/citizens-charter.json` (parsed from `assets/contents/Citizen's Charter 2023.pdf`). Adds nothing. |
| `MEO_Citizens Charter 2023 pp64-67 … (DUPLICATE).pdf` | Scan of Citizen's Charter pp. 64–67. Both services already in `data/citizens-charter.json`. Adds nothing. |
| `MEO_Permits/… (NBC Form B-02, generic) (DUPLICATE).pdf` | Same permit as the Calatrava-branded B-02; keep the branded one. |
| `GFPS_… GPB FY2027.xlsx` sheets `Sheet1`, `Sheet2`, `Sheet3` | Scratch/working sheets; only `PCM` (and possibly `Barangay`) are the form. |
| `GFPS_… GAD AR CY2025.xlsx` sheet `FDPP LICENSE` | FDPP upload-template marker, not content. |

Overlaps that are *not* redundant (same office, different content): the two
MEO LBP-Form-4 / profile / permits files; the two MBO files; the two MDRRMO
files; the two GFPS workbooks (plan vs accomplishment).

## Checklist gaps (nothing received)

Items 1 (Cicha — unclear what this is), 6 Pledge, 8 Brief History, 10 CLUP,
12 LDIP, 13 MPDO, and the Annual Budget proper (11 — only supplementals
came). Also no Punong Barangay contact details (21), and most offices sent no
staff list or office contact (2).

## Quality notes before anything is published

- Scanned PDFs (`MSWDO`, `MBO`, `MEO LBP4`, `LDRRMF`, `Supplemental Budgets`)
  have no text layer — content must be re-typed into JSON, and figures
  double-checked against the scan.
- `LDRRMF` scan: pages are landscape and alternate pages are scanned in
  opposite orientation; re-orient before linking on `transparency.html`.
- Engineer office number in the profile doc reads "+6939 695236538" — not a
  valid PH mobile length; confirm before publishing (never publish an
  unverified dialable number).
- Building Permit unified form carries a "CEBU" leftover.
- OMAG's farmer/fisherfolk organizations list was not actually included.
- MNAO's "Weight for Age C.Y. 2026" label may be CY2025 data reported in
  2026 — confirm the reference year.
