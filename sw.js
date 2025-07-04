// Nama cache baru untuk memastikan pembaruan
const CACHE_NAME = 'pesona-cache-v2';

// Daftar file yang akan disimpan di cache untuk mode offline
const urlsToCache = [
  './', // Ini merujuk ke file HTML utama (index.html)
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
];

// Event 'install': Dijalankan saat service worker pertama kali diinstal
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache dibuka');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event 'fetch': Dijalankan setiap kali aplikasi meminta sebuah sumber daya
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ditemukan di cache, langsung kembalikan dari cache
        if (response) {
          return response;
        }
        // Jika tidak ada di cache, ambil dari jaringan (internet)
        return fetch(event.request);
      }
    )
  );
});

// Event 'activate': Membersihkan cache lama jika ada versi baru
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Hapus cache yang tidak ada di whitelist (cache lama)
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

