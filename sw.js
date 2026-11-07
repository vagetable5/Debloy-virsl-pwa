// sw.js — Service Worker (PWA)
// নিয়ম: শুধু নিজের সাইটের ফাইল ক্যাশ হয়। Supabase (লগইন/ডেটা), বিজ্ঞাপন, admin.html কখনও ক্যাশ হয় না।
const VER = 'vv-v1';
const SHELL = ['./', 'index.html', 'post.html', 'info.html', 'offline.html', 'config.js', 'maint.js', 'theme.css', 'pwa.js',
  'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VER).then(c => Promise.allSettled(SHELL.map(u => c.add(u)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;      // বাইরের সব রিকুয়েস্ট সরাসরি নেটওয়ার্কে
  if (/admin/i.test(url.pathname)) return;                                   // অ্যাডমিন পেজ কখনও ক্যাশ নয়
  if (req.mode === 'navigate') {                                             // পেজ: আগে নেটওয়ার্ক, না পেলে ক্যাশ/অফলাইন
    e.respondWith(fetch(req).then(r => {
      if (r.ok) { const cp = r.clone(); caches.open(VER).then(c => c.put(req, cp)); }
      return r;
    }).catch(() => caches.match(req).then(r => r || caches.match('offline.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {                              // ফাইল: ক্যাশ দেখায়, পেছনে নতুন আনে
    const net = fetch(req).then(r => { if (r.ok) { const cp = r.clone(); caches.open(VER).then(c => c.put(req, cp)); } return r; }).catch(() => hit);
    return hit || net;
  }));
});
