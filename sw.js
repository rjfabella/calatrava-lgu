// Calatrava PWA Service Worker
// Scope is the whole domain, so this sits in front of both halves of the site:
// the tourism portal at "/" and the LGU government portal at "/lgu/".
const CACHE_VERSION = "v3";
const SHELL_CACHE = `calatrava-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `calatrava-runtime-${CACHE_VERSION}`;

// Core "app shell" — precached on install so all public pages work offline immediately.
// admin.html is intentionally excluded.
const SHELL_ASSETS = [
  "/",
  "/index.html",
  "/destinations.html",
  "/accommodation.html",
  "/establishments.html",
  "/getting-here.html",
  "/404.html",
  "/assets/emergency.css",
  "/assets/i18n.js",
  "/data/about.json",
  "/data/accommodation.json",
  "/data/activities.json",
  "/data/contact.json",
  "/data/destinations.json",
  "/data/establishments.json",
  "/data/gallery.json",
  "/data/getting-here.json",
  "/data/settings.json",
  "/data/videos.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/manifest.json",
  // LGU half: its shell only. Its nine pages and its JSON are cached as they
  // are visited, by the navigation and /data/ branches below.
  "/lgu/",
  "/lgu/index.html",
  "/lgu/assets/style.css",
  "/lgu/assets/app.js"
];

// External CDN resources to pre-cache (fonts, etc.)
// These are cached on first visit via the fetch handler below,
// but listing critical ones here ensures they're available immediately.
const CDN_ASSETS = [
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap"
];

// ─── INSTALL ────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      // Cache local shell assets one by one so a single missing file
      // doesn't block the entire install
      caches.open(SHELL_CACHE).then((cache) =>
        Promise.allSettled(
          SHELL_ASSETS.map((url) =>
            cache.add(url).catch((err) =>
              console.warn(`[SW] Failed to precache: ${url}`, err)
            )
          )
        )
      ),
      // Cache CDN assets into runtime cache
      caches.open(RUNTIME_CACHE).then((cache) =>
        Promise.allSettled(
          CDN_ASSETS.map((url) =>
            cache.add(new Request(url, { mode: "cors" })).catch((err) =>
              console.warn(`[SW] Failed to precache CDN: ${url}`, err)
            )
          )
        )
      ),
    ])
  );
  self.skipWaiting();
});

// ─── ACTIVATE ───────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== SHELL_CACHE && key !== RUNTIME_CACHE)
          .map((key) => {
            console.log(`[SW] Deleting old cache: ${key}`);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// ─── FETCH ──────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== "GET") return;

  // Never cache admin — always live network
  if (url.pathname.startsWith("/admin")) return;

  // Skip Google Maps API requests — they can't be meaningfully cached
  if (
    url.hostname.includes("maps.googleapis.com") ||
    url.hostname.includes("maps.gstatic.com")
  ) {
    return;
  }

  // ── Google Fonts: cache-first (they rarely change) ──────────────────────
  if (
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com"
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
    return;
  }

  // ── HTML pages (navigation): network-first → cache → offline fallback ───
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => {
            if (cached) return cached;
            // Offline and never visited: fall back to the homepage of the half
            // being asked for, so an LGU URL doesn't land on the tourism site.
            const home = url.pathname.startsWith("/lgu/")
              ? "/lgu/index.html"
              : "/index.html";
            return caches.match(home);
          })
        )
    );
    return;
  }

  // ── JSON data files: network-first → cached fallback ────────────────────
  // Both halves keep their content in their own data/ directory.
  if (url.pathname.startsWith("/data/") || url.pathname.startsWith("/lgu/data/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // ── Images: cache-first, network fallback, then placeholder ─────────────
  if (/\.(png|jpg|jpeg|webp|svg|gif|ico)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => {
            // Return a transparent 1×1 PNG as placeholder for missing images
            return new Response(
              atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="),
              { headers: { "Content-Type": "image/png" } }
            );
          });
      })
    );
    return;
  }

  // ── CSS, JS, fonts: stale-while-revalidate ──────────────────────────────
  // Serve the cached copy at once, then refresh it in the background so the
  // next load has the new one. Plain cache-first kept a stylesheet or script
  // until the cache version changed, which would now pin the LGU half's
  // app.js — the file that renders its whole nav and footer — to whatever was
  // cached on the visitor's first visit.
  if (/\.(css|js|woff2?|ttf|otf)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fresh = fetch(request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);
        if (cached) {
          // Keep the worker alive long enough for the refresh to land.
          event.waitUntil(fresh);
          return cached;
        }
        return fresh;
      })
    );
    return;
  }

  // ── Everything else: network-first, cache fallback ───────────────────────
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});
