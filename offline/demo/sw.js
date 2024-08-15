const CACHE_NAME = "demo/v7";

const CACHE_FILES = [
  "./index.html",
  "./style.css",
  "./photo.png",
  "./script.js",
];

// this event will get triggered on installation of SW
self.addEventListener("install", (e) => {
  // bcz of waitUntil installation event will wait for this code to get completed before it finishes
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(CACHE_FILES);
    })
  );
});

// this event will get triggered when SW gets activated
self.addEventListener("activate", (e) => {
  // Clean up useless cache (older versions etc)
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key != CACHE_NAME) {
            // delete returns a promise and promise.all will wait for all promises to resolve
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// this event will get triggered when browser makes a fetch request
self.addEventListener("fetch", (e) => {
  // checking the cache first and returning from it is a bad idea bcz in that case network calls will never happen and always stale data will be returned
  // so we first make a call and if that fails return it from cache

  // Offline exprience
  // Whenever a file is requested,
  // 1. fetch from network, update my cache 2. cache as a fallback

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // update my cache
        const cloneData = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, cloneData);
        });
        console.log("returning from network");
        return res;
      })
      .catch(() => {
        console.log("returning from cache");
        return caches.match(e.request).then((file) => file);
      })
  );
});
