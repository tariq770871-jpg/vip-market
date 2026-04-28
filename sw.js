self.addEventListener("install",()=>console.log("✅ SW installed"));self.addEventListener("fetch",e=>e.respondWith(fetch(e.request)));
