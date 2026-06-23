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
  leaf:   '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>',
  tools:  '<path d="M14.7 6.3a4 4 0 0 0-5.6 5.6l-6 6a2 2 0 1 0 2.8 2.8l6-6a4 4 0 0 0 5.6-5.6l-2.1 2.1-2.8-2.8z"/>',
  book:   '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  map:    '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
  award:  '<circle cx="12" cy="8" r="6"/><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
};
function svgIcon(name, cls){
  return `<svg class="${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.doc}</svg>`;
}

// ── SITE CHROME (shared nav + footer) ──
// Injected by JS so every page stays in sync from one definition. `base` lets
// pages in subfolders point links/assets correctly (here all pages are flat).
const NAV_ITEMS = [
  { id: 'home',         label: 'Home',          href: 'index.html' },
  { id: 'about',        label: 'Government',    href: 'about.html' },
  { id: 'services',     label: 'Services',      href: 'services.html' },
  { id: 'barangays',    label: 'Barangays',     href: 'barangays.html' },
  { id: 'transparency', label: 'Transparency',  href: 'transparency.html' },
  { id: 'news',         label: 'News',          href: 'news.html' },
  { id: 'contact',      label: 'Contact',       href: 'contact.html' },
];

const SOCIAL_SVG = {
  facebook: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  mail:     '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  phone:    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.39 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
};

/** Inject the top bar + nav. `active` is the NAV_ITEMS id for the current page. */
function buildHeader(active){
  const links = NAV_ITEMS.map(n =>
    `<li><a href="${n.href}"${n.id === active ? ' class="active"' : ''}>${n.label}</a></li>`).join('');
  const mobLinks = NAV_ITEMS.map(n =>
    `<a href="${n.href}" onclick="closeMobNav()">${n.label}</a>`).join('');

  const header = document.createElement('div');
  header.innerHTML = `
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
      <li><a href="services.html#online" class="nav-cta">Online Services</a></li>
    </ul>
    <button class="hamburger" aria-label="Open menu" onclick="openMobNav()"><span></span><span></span><span></span></button>
  </nav>
  <nav class="mob-nav" id="mobNav" aria-label="Mobile navigation">
    <button class="mob-close" aria-label="Close menu" onclick="closeMobNav()">&times;</button>
    ${mobLinks}
  </nav>`;
  document.body.insertAdjacentElement('afterbegin', header);
}

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
        <a href="mailto:andagaotour@gmail.com" aria-label="Email">${SOCIAL_SVG.mail}</a>
        <a href="tel:09664393711" aria-label="Phone">${SOCIAL_SVG.phone}</a>
      </div>
    </div>
    <div class="f-col">
      <h4>Government</h4>
      <ul>
        <li><a href="about.html">Officials</a></li>
        <li><a href="about.html#vision">Vision &amp; Mission</a></li>
        <li><a href="about.html#history">History</a></li>
        <li><a href="transparency.html">Transparency</a></li>
      </ul>
    </div>
    <div class="f-col">
      <h4>Services</h4>
      <ul>
        <li><a href="services.html#admin">Civil Registry</a></li>
        <li><a href="services.html#business">Business Permits</a></li>
        <li><a href="services.html#health">Health Services</a></li>
        <li><a href="services.html#online">Online Services</a></li>
      </ul>
    </div>
    <div class="f-col">
      <h4>Connect</h4>
      <ul>
        <li><a href="news.html">News &amp; Bulletins</a></li>
        <li><a href="contact.html">Contact Directory</a></li>
        <li><a href="services.html#hotline">Emergency Hotlines</a></li>
        <li><a href="https://rjfabella.github.io/calatrava-tourism-portal/">Tourism Portal</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-partners">
    <span class="footer-partners-label">In partnership with</span>
    <div class="footer-partners-row">
      <span class="partner-chip">DILG</span>
      <span class="partner-chip">DICT &middot; eGovPH</span>
      <span class="partner-chip">Bagong Pilipinas</span>
      <span class="partner-chip">NPC Registered</span>
      <span class="partner-chip">Full Disclosure Policy</span>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; ${new Date().getFullYear()} Municipality of Calatrava, Romblon. All rights reserved.</p>
    <p>
      <a href="#" style="color:rgba(255,255,255,.55);text-decoration:none">Privacy Notice</a> &middot;
      Data Protection Officer: dpo@calatrava.gov.ph
    </p>
  </div>`;
  document.body.appendChild(footer);
}

// ── UNDER-CONSTRUCTION NOTICE ──
// The site is a work in progress. Show a one-time notice per browser session
// (set NOTICE_EVERY_LOAD = true to show it on every page navigation instead).
const TOURISM_URL = 'https://rjfabella.github.io/calatrava-tourism-portal/';
const NOTICE_EVERY_LOAD = false;

function closeNotice(){ document.getElementById('uc-notice')?.classList.remove('open'); }

function buildNotice(){
  if (!NOTICE_EVERY_LOAD) {
    try { if (sessionStorage.getItem('uc-seen')) return; sessionStorage.setItem('uc-seen', '1'); } catch (e) {}
  }
  const el = document.createElement('div');
  el.className = 'uc-notice open';
  el.id = 'uc-notice';
  el.innerHTML = `
    <div class="uc-card" role="dialog" aria-modal="true" aria-labelledby="uc-title">
      <img class="uc-seal" src="assets/logos/Calatrava_Romblon_web.png" alt="Municipal seal of Calatrava">
      <div class="uc-eyebrow">Pasensya na &middot; Please pardon our progress</div>
      <h2 class="uc-title" id="uc-title">This site is under construction</h2>
      <p class="uc-text">The official government portal of the Municipality of Calatrava is still being built. Information here is preliminary and may change. Thank you for your patience.</p>
      <div class="uc-actions">
        <a class="uc-btn uc-btn-ghost" href="${TOURISM_URL}">Go back to Tourism Portal</a>
      </div>
    </div>`;
  document.body.appendChild(el);
  el.addEventListener('click', (e) => { if (e.target === el) closeNotice(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNotice(); });
}

/** Call once per page: builds header + footer, the notice, and starts the reveal observer. */
function initChrome(active){
  buildHeader(active);
  buildFooter();
  buildNotice();
  observeReveal();
}

// Reveal anything already on the page once the DOM is ready.
document.addEventListener('DOMContentLoaded', observeReveal);
