/* 韩语训练离线缓存 Service Worker · v1.03 */
const CACHE="krtrain-v1.03";
const KEYS=["./","index.html"];
self.addEventListener("install",function(e){self.skipWaiting();e.waitUntil(caches.open(CACHE).then(function(c){return Promise.all(KEYS.map(function(k){return c.add(k).catch(function(){})}));}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
  const req=e.request;
  if(req.method!=="GET")return;
  const url=new URL(req.url);
  if(url.origin!==location.origin)return;
  if(req.mode==="navigate"){
    e.respondWith(fetch(req).then(function(r){
      if(r&&r.ok){const cp=r.clone();return caches.open(CACHE).then(function(c){return Promise.all(KEYS.map(function(k){return c.put(k,cp.clone())})).then(function(){return r})})}
      return r;
    }).catch(function(){
      return caches.match(req).then(function(m){
        if(m)return m;
        return caches.match("./").then(function(m2){return m2||caches.match("index.html")});
      });
    }));
    return;
  }
  e.respondWith(caches.match(req).then(function(m){
    return m||fetch(req).then(function(r){
      if(!(r&&r.ok))return r;
      const cp=r.clone();return caches.open(CACHE).then(function(c){return c.put(req,cp)}).then(function(){return r});
    });
  }));
});
