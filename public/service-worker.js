self.addEventListener('install', event => {
    console.log('[Service Worker] Install');
    event.waitUntil(
      caches.open('static-v1').then(cache => {
        return cache.addAll([
          '/',
          '/index.html',
          '/styles.css',
          '/icon-192.png',
          '/icon-512.png'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });
  