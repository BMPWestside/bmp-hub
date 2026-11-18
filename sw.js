const V='bmp-v1',PRE=['./','index.html','view.html','manifest.webmanifest','view.webmanifest','icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(PRE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin||u.pathname.endsWith('/sw.js'))return;
  if(u.searchParams.has('_')){ /* update check: go to network and refresh the cached copy */
    e.respondWith(fetch(r).then(res=>{if(res.ok){const k=new Request(u.origin+u.pathname);const cp=res.clone();caches.open(V).then(c=>c.put(k,cp))}return res}));return}
  const key=new Request(u.origin+u.pathname);
  e.respondWith(caches.open(V).then(async c=>{const hit=await c.match(key);
    const net=fetch(r).then(res=>{if(res.ok)c.put(key,res.clone());return res}).catch(()=>null);
    return hit||(await net)||new Response('Offline',{status:503})}))});
