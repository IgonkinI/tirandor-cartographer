const CACHE = 'tirandor-cartographer-v0.3.0'
const ASSETS = [
  './', './index.html', './styles.css', './styles-v02.css', './styles-v03.css', './manifest.webmanifest', './icon.svg',
  './js/core.js', './js/drawing.js', './js/editor.js', './js/screens-home.js', './js/screens-editor.js',
  './js/io.js', './js/v02.js', './js/v03.js', './js/main.js'
]
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()))
})
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()))
})
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(resp => {
    const copy = resp.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); return resp
  }).catch(() => caches.match('./index.html'))))
})
