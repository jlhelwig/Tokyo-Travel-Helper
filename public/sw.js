const CACHE_NAME = 'tokyo-travel-v2';
const STATIC_ASSETS = [
  '/',
  '/itinerary',
  '/shopping',
  '/food',
  '/map',
  '/globals.css',
  '/manifest.json',
  '/icon.png'
];

// 1. Install - Pre-cache critical static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// 2. Activate - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Fetch - Stale-While-Revalidate Strategy
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests (Google Maps, etc.) to avoid CORS/Opacity issues
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // If valid response, update cache
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Network failed — return cached response or nothing
          return cachedResponse;
        });

        // Return cached version immediately if available, otherwise wait for network
        return cachedResponse || fetchPromise;
      });
    })
  );
});

