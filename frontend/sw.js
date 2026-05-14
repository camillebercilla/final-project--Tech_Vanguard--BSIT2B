const CACHE_NAME = 'bicoltransit-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/seats.html',
  '/search.html',
  '/css/style.css',
  '/css/mobile.css',
  '/js/script.js',
  '/js/api.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/index.html'))
  );
});