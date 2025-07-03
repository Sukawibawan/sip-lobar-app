// Nama cache untuk aplikasi kita
const CACHE_NAME = 'sip-lobar-cache-v1';

// Daftar file yang akan disimpan di cache untuk mode offline
const urlsToCache = [
  './', // Ini merujuk ke file HTML utama (index.html)
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
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

// Event 'fetch': Dijalankan setiap kali aplikasi meminta sebuah sumber daya (file, gambar, dll.)
self.addEventListener('fetch', event => {
  // Kita hanya menangani permintaan GET, bukan POST ke Google Script
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