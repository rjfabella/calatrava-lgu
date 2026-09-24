/* ==========================================================================
   Calatrava LGU — shared front-end script
   - mobile nav toggle
   - scroll reveal
   - loadJSON(): fetch a data file, fall back to inline default on failure
     so pages still render offline / when opened from the file system.
   ========================================================================== */

// ── MOBILE NAV ──
function openMobNav(){ document.getElementById('mobNav')?.classList.add('open'); }
function closeMobNav(){ document.getElementById('mobNav')?.classList.remove('open'); }

// ── SCROLL REVEAL ──
const _io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), i * 80);
      _io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

function observeReveal(){
  document.querySelectorAll('.reveal:not(.in)').forEach(el => _io.observe(el));
}

/**
 * Fetch a JSON data file. Returns the parsed data, or `fallback` if the
 * request fails (offline, file:// origin, missing file). Mirrors the
 * tourism portal: data/*.json is the source of truth, with a safe default.
 */
async function loadJSON(path, fallback){
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (err) {
    console.warn('loadJSON fallback for', path, '—', err.message);
    return fallback;
  }
}

// ── ICONS (line icons used by service cards) ──
const ICONS = {
  doc:    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>',
  store:  '<path d="M3 9l1-5h16l1 5"/><path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/>',
  health: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  help:   '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  coins:  '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="M16.71 13.88l.7.71-2.82 2.82"/>',
  online: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  id:     '<rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="8.5" cy="11" r="2.5"/><path d="M4.5 17a4.2 4.2 0 0 1 8 0"/><line x1="15" y1="10" x2="19" y2="10"/><line x1="15" y1="14" x2="19" y2="14"/>',
  list:   '<line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4.5" cy="6" r="1.4"/><circle cx="4.5" cy="12" r="1.4"/><circle cx="4.5" cy="18" r="1.4"/>',
  clock:  '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>',
  scale:  '<line x1="12" y1="4" x2="12" y2="21"/><line x1="7" y1="21" x2="17" y2="21"/><path d="M12 6 5 9l-2.2 4.6a3.6 3.6 0 0 0 6.4 0L7 9"/><path d="m12 6 7 3 2.2 4.6a3.6 3.6 0 0 1-6.4 0L17 9"/>',
  leaf:   '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>',
  tools:  '<path d="M14.7 6.3a4 4 0 0 0-5.6 5.6l-6 6a2 2 0 1 0 2.8 2.8l6-6a4 4 0 0 0 5.6-5.6l-2.1 2.1-2.8-2.8z"/>',
  book:   '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  map:    '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
  award:  '<circle cx="12" cy="8" r="6"/><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  eye:    '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  flag:   '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
};
/**
 * Placeholder for a person whose official photo has not been supplied yet.
 * Returns their initials on the sand tone, which reads as a deliberate
 * placeholder rather than a failed image. `aria-hidden` because the person's
 * name is always rendered next to it.
 */
function monogram(name){
  const initials = (name || '')
    .replace(/\b(Engr|Hon|Dr|Atty|Mr|Mrs|Ms|Jr|Sr|II|III|IV)\.?\b/gi, '')
    .trim().split(/\s+/).filter(Boolean)
    .map(w => w[0]).join('').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
  return `<span class="monogram" aria-hidden="true">${initials || '&#9679;'}</span>`;
}

function svgIcon(name, cls){
  return `<svg class="${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.doc}</svg>`;
}

// ── SITE CHROME (shared nav + footer) ──
// Injected by JS so every page stays in sync from one definition. `base` lets
// pages in subfolders point links/assets correctly (here all pages are flat).
const NAV_ITEMS = [
  { id: 'home',         label: 'Home',          href: 'index.html' },
  { id: 'about',        label: 'Government',    href: 'about.html' },
  // Services keeps its CTA treatment in the bar rather than a plain link, so
  // it stays the one obvious call to action; services.html is the landing page.
  { id: 'barangays',    label: 'Barangays',     href: 'barangays.html' },
  { id: 'transparency', label: 'Transparency',  href: 'transparency.html' },
  { id: 'news',         label: 'News',          href: 'news.html' },
  { id: 'about-us',     label: 'About Us',      href: 'about-us.html' },
  { id: 'contact',      label: 'Contact',       href: 'contact.html' },
];

const SOCIAL_SVG = {
  facebook: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  mail:     '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  phone:    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.39 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
};

// ── EMERGENCY BAND ──
// Sits directly above the footer on every page, mirroring the tourism portal.
// Update the number here and it changes site-wide.
const EMERGENCY_HOTLINE = '0930 326 4161';

// Departments shown on the band's second line, in this order. Names must match
// `hotlines[].name` in data/services.json, which is where the numbers live.
// Sanitation is deliberately excluded — it is not an emergency service.
const EMERGENCY_DEPARTMENTS = ['Police Department', 'Fire Department', 'Health Department', 'Coastguard'];

const WARN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';

/** Inject the emergency hotline band. Call before buildFooter so it lands just above it. */
function buildEmergencyBand(){
  const tel = EMERGENCY_HOTLINE.replace(/[^0-9+]/g, '');
  const band = document.createElement('div');
  band.className = 'emg-band';
  band.innerHTML = `
    <div class="emg-inner">
      <div class="emg-primary">
        <span class="emg-flag">${WARN_SVG}<span>Emergency?</span></span>
        <a class="emg-call" href="tel:${tel}">
          <span class="emg-label">Call Calatrava Emergency Hotline</span>
          <span class="emg-number">${EMERGENCY_HOTLINE}</span>
        </a>
      </div>
      <ul class="emg-more" id="emgMore" hidden></ul>
    </div>`;
  document.body.appendChild(band);
  fillEmergencyDepartments();
}

/**
 * Fill the band's second line from data/services.json, so the department
 * numbers have exactly one source of truth and can never drift from the
 * Services page. Runs after the band is already on screen: if the fetch
 * fails the second line simply stays hidden and the main hotline above it
 * is unaffected.
 */
async function fillEmergencyDepartments(){
  const list = document.getElementById('emgMore');
  if (!list) return;
  const d = await loadJSON('data/services.json', { hotlines: [] });
  const byName = new Map((d.hotlines || []).map(h => [h.name, h.number]));

  const rows = EMERGENCY_DEPARTMENTS
    .map(name => ({ label: name.replace(/ Department$/, ''), number: byName.get(name) }))
    .filter(r => r.number);
  if (!rows.length) return;

  list.innerHTML = rows.map(r =>
    `<li><a href="tel:${r.number.replace(/[^0-9+]/g, '')}">
      <span class="emg-dept">${r.label}</span>
      <span class="emg-dept-num">${r.number}</span>
    </a></li>`).join('');
  list.hidden = false;
}

/** Inject the top bar + nav. `active` is the NAV_ITEMS id for the current page. */
function buildHeader(active){
  const links = NAV_ITEMS.map(n =>
    `<li><a href="${n.href}"${n.id === active ? ' class="active" aria-current="page"' : ''}>${n.label}</a></li>`).join('');
  const mobLinks = NAV_ITEMS.map(n =>
    `<a href="${n.href}" onclick="closeMobNav()">${n.label}</a>`).join('');

  const header = document.createElement('div');
  // `display:contents` — the wrapper must not become a containing block, or it
  // would clip .site-head's `position:sticky` to its own (header-height) box
  // and nothing would actually stick.
  header.className = 'chrome-wrap';
  header.innerHTML = `
  <a class="skip-link" href="#main">Skip to main content</a>
  <div class="site-head" id="siteHead">
  <div class="topbar">
    <div class="topbar-inner">
      <span>Republic of the Philippines &middot; Province of Romblon</span>
      <div class="topbar-right">
        <a href="https://rjfabella.github.io/calatrava-tourism-portal/">Tourism</a>
        <a href="services.html#hotline">Emergency Hotlines</a>
        <a href="contact.html">Citizen Help Desk</a>
      </div>
    </div>
  </div>
  <nav class="nav" aria-label="Primary">
    <a class="nav-logo" href="index.html">
      <span class="nav-seal"><img src="assets/logos/Calatrava_Romblon_web.png" alt="Municipal seal of Calatrava"></span>
      <span class="nav-name">Calatrava<small>Romblon, Philippines</small></span>
    </a>
    <ul class="nav-links">
      ${links}
      <li><a href="services.html" class="nav-cta${active === 'services' ? ' active' : ''}">Services</a></li>
    </ul>
    <button class="hamburger" aria-label="Open menu" onclick="openMobNav()"><span></span><span></span><span></span></button>
  </nav>
  </div>
  <nav class="mob-nav" id="mobNav" aria-label="Mobile navigation">
    <button class="mob-close" aria-label="Close menu" onclick="closeMobNav()">&times;</button>
    ${mobLinks}
    <a href="services.html" class="mob-cta" onclick="closeMobNav()">Services</a>
  </nav>`;
  document.body.insertAdjacentElement('afterbegin', header);
}

/**
 * Compact sticky title strip, built from the page's own <h1> so no page has to
 * declare it twice. It sits inside the sticky shell under the nav and only
 * reveals itself once the full page hero has scrolled past, so the viewport
 * isn't permanently eaten by a heading the reader can already see.
 *
 * The homepage has no .page-hero and gets no strip — there only the nav
 * freezes, as intended.
 */
function buildPageBar(){
  const hero = document.querySelector('.page-hero');
  const head = document.getElementById('siteHead');
  if (!hero || !head) return;

  const h1 = hero.querySelector('h1');
  const crumb = hero.querySelector('.breadcrumb');
  if (!h1) return;

  // Last crumb is the page's own name; fall back to the h1's plain text.
  const spans = crumb ? [...crumb.querySelectorAll('span')] : [];
  const label = (spans.length ? spans[spans.length - 1].textContent : h1.textContent).trim();

  const bar = document.createElement('div');
  bar.className = 'page-bar';
  bar.id = 'pageBar';
  bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = `<div class="page-bar-inner">
    <span class="page-bar-title">${label}</span>
    <a class="page-bar-top" href="#main">Back to top</a>
  </div>`;
  head.appendChild(bar);

  // Reveal the strip exactly when the hero's heading leaves the sticky shell.
  const sentinel = document.createElement('div');
  sentinel.className = 'page-bar-sentinel';
  hero.insertAdjacentElement('afterend', sentinel);

  if (!('IntersectionObserver' in window)) { return; }
  new IntersectionObserver(([e]) => {
    const on = !e.isIntersecting && e.boundingClientRect.top < 0;
    bar.classList.toggle('is-on', on);
    bar.setAttribute('aria-hidden', String(!on));
  }, { threshold: 0 }).observe(sentinel);
}

// National agencies shown in the footer's "In partnership with" row. `short` is
// the text chip that replaces the mark if the image is missing.
const PARTNERS = [
  { name: 'Department of the Interior and Local Government', short: 'DILG',             logo: 'assets/logos/dilg.png' },
  { name: 'Department of Information and Communications Technology', short: 'DICT',     logo: 'assets/logos/dict.png' },
  { name: 'National Privacy Commission', short: 'NPC',                                  logo: 'assets/logos/NPC_Logo_1.webp' },
  { name: 'Bagong Pilipinas', short: 'Bagong Pilipinas',                                logo: 'assets/logos/Bagong_Pilipinas_Logo.png' },
];

/** Inject the footer. */
function buildFooter(){
  const footer = document.createElement('footer');
  footer.innerHTML = `
  <div class="footer-grid">
    <div class="f-brand">
      <div class="f-logos">
        <img src="assets/logos/Calatrava_Romblon_web.png" alt="Calatrava seal">
        <img src="assets/logos/Ph_seal_romblon_web.png" alt="Romblon seal">
      </div>
      <h3>Municipality of Calatrava</h3>
      <p style="font-family:var(--fd);font-style:italic;font-size:16px;color:var(--gl);margin-bottom:.5rem">Abante pang gador, Calatrava!</p>
      <p>Official website of the Local Government Unit of Calatrava, Province of Romblon, Republic of the Philippines.</p>
      <div class="f-social">
        <a href="https://www.facebook.com/calatrava.romblon.217551/" target="_blank" rel="noopener" aria-label="Facebook">${SOCIAL_SVG.facebook}</a>
        <a href="mailto:andagaoutour@gmail.com" aria-label="Email">${SOCIAL_SVG.mail}</a>
        <a href="tel:09664393711" aria-label="Phone">${SOCIAL_SVG.phone}</a>
      </div>
    </div>
    <div class="f-col">
      <h4>Government</h4>
      <ul>
        <li><a href="about.html">Officials</a></li>
        <li><a href="about.html#departments-section">Offices &amp; Departments</a></li>
        <li><a href="about-us.html#history">History</a></li>
        <li><a href="transparency.html">Transparency</a></li>
      </ul>
    </div>
    <div class="f-col">
      <h4>Services</h4>
      <ul>
        <li><a href="services.html#admin">Civil Registry</a></li>
        <li><a href="services.html#business">Business Permits</a></li>
        <li><a href="services.html#health">Health Services</a></li>
        <li><a href="services.html#charter">Citizen's Charter</a></li>
      </ul>
    </div>
    <div class="f-col">
      <h4>Connect</h4>
      <ul>
        <li><a href="news.html">News &amp; Bulletins</a></li>
        <li><a href="contact.html">Contact Directory</a></li>
        <li><a href="about-us.html#find-us">Find the Municipal Hall</a></li>
        <li><a href="services.html#hotline">Emergency Hotlines</a></li>
        <li><a href="https://rjfabella.github.io/calatrava-tourism-portal/">Tourism Portal</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-partners">
    <span class="footer-partners-label">In partnership with</span>
    <div class="footer-partners-row">
      ${PARTNERS.map(p => `<span class="partner-logo"><img src="${p.logo}" alt="${p.name}" title="${p.name}" onerror="this.parentElement.textContent='${p.short}';this.parentElement.className='partner-chip'"></span>`).join('')}
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; ${new Date().getFullYear()} Municipality of Calatrava, Romblon. All rights reserved.</p>
    <p>
      <a href="privacy.html">Privacy Notice</a> &middot;
      <a href="transparency.html">Transparency</a> &middot;
      <a href="contact.html">Contact</a>
    </p>
  </div>`;
  document.body.appendChild(footer);
}

/**
 * Wrap the page's own content in <main id="main"> so screen readers get a main
 * landmark and the skip link has somewhere to land. Runs before the chrome is
 * injected, so header/footer/band stay outside it. Element references (and the
 * ids the page scripts render into) survive the move.
 */
function wrapMain(){
  if (document.querySelector('main')) return;
  const content = [...document.body.children].filter(el => el.tagName !== 'SCRIPT');
  if (!content.length) return;
  const main = document.createElement('main');
  main.id = 'main';
  main.setAttribute('tabindex', '-1');
  document.body.insertBefore(main, content[0]);
  content.forEach(el => main.appendChild(el));
}

/** Call once per page: builds header + footer and starts the reveal observer. */
function initChrome(active){
  wrapMain();
  buildHeader(active);
  buildPageBar();
  buildEmergencyBand();
  buildFooter();
  observeReveal();
}

// Reveal anything already on the page once the DOM is ready.
document.addEventListener('DOMContentLoaded', observeReveal);
