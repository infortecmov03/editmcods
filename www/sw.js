const CACHE_NAME = 'editmcode-offline-v1';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './sw.js',
    './manifest.json',
    // CodeMirror core and assets
    './libs/codemirror/codemirror.min.css',
    './libs/codemirror/theme/monokai.min.css',
    './libs/codemirror/codemirror.min.js',
    './libs/codemirror/mode/xml.min.js',
    './libs/codemirror/mode/css.min.js',
    './libs/codemirror/mode/javascript.min.js',
    './libs/codemirror/mode/htmlmixed.min.js',
    './libs/codemirror/addon/edit/closetag.min.js',
    './libs/codemirror/addon/edit/closebrackets.min.js',
    './libs/codemirror/addon/hint/show-hint.min.js',
    './libs/codemirror/addon/hint/show-hint.min.css',
    // local fonts and icons (if present)
    './libs/codemirror/fonte-awesome/css/all.min.css',
    // images and svg
    './imgsvg.html'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            }).catch(function(err){ console.error('SW cache failed', err); })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) return response;
            return fetch(event.request).then(function(fetchRes){
                // Optionally cache new requests
                return caches.open(CACHE_NAME).then(function(cache){
                    try { cache.put(event.request, fetchRes.clone()); } catch(e){}
                    return fetchRes;
                });
            }).catch(function(){
                // fallback to index.html for navigation requests
                if (event.request.mode === 'navigate') return caches.match('./index.html');
            });
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});