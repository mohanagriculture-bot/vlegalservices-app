/* V Legal Services - minimal service worker.
   Only purpose: let the site install as an app and show a friendly page when there is no internet.
   It never stores portal pages, documents or data - everything is always fetched live. */
var V = 'vls-shell-1';
var OFFLINE = '/assets/offline.html';
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(V).then(function(c){ return c.add(OFFLINE); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){return k!==V;}).map(function(k){return caches.delete(k);})); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  var r = e.request;
  if(r.mode !== 'navigate') return;
  e.respondWith(fetch(r).catch(function(){ return caches.match(OFFLINE); }));
});
