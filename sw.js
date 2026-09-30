// Service worker: la app abre sin conexión después del primer uso
const CACHE='cardio-ra-v16';
const CORE=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png'];
const EXT=/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|storage\.googleapis\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/;
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url); if(u.origin!==location.origin&&!EXT.test(u.host)) return;
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(r);
    const net=fetch(r).then(res=>{ if(res&&(res.ok||res.type==='opaque')) c.put(r,res.clone()); return res; }).catch(()=>hit);
    return hit||net;
  }));
});
