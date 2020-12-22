var cacheName = 'svelte1';
var filesToCache = [
  '/',
  '/index.html',
  '/build/bundle.css',
  '/build/bundle.js',
  "https://cdn.jsdelivr.net/npm/halfmoon@1.1.1/css/halfmoon-variables.min.css",
  "https://cdn.jsdelivr.net/npm/halfmoon@1.1.1/js/halfmoon.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/fontawesome.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/solid.min.css"
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});