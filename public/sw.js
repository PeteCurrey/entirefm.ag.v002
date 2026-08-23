/**
 * ENTIREFM FIELD SERVICE WORKER (Phase 0C-R PWA Shell)
 * ====================================================
 * Offline shell caching, asset pre-caching, and safe update strategy.
 * Does not cache sensitive client data indiscriminately.
 */

const CACHE_NAME = 'efm-field-shell-v0.3.1';
const STATIC_ASSETS = [
  '/engineer',
  '/manifest.json',
  '/branding/icon-192.png',
  '/branding/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Never cache API routes or POST/PATCH mutations
  if (event.request.url.includes('/api/') || event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        if (event.request.mode === 'navigate') {
          return caches.match('/engineer');
        }
        return new Response('Network offline', { status: 503, statusText: 'Offline' });
      })
  );
});
