self.addEventListener('install', event => {
    console.log('[Service Worker] Install');
    // Cache only core files you know (like index.html)
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
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse; // Return cached file if present
        }
        // Otherwise fetch from network and cache it dynamically
        return fetch(event.request).then(networkResponse => {
          return caches.open('static-v1').then(cache => {
            cache.put(event.request, networkResponse.clone()); // Cache the file for next time
            return networkResponse;
          });
        }).catch(() => {
          // Optional fallback if offline and file not cached
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
    );
  });
  