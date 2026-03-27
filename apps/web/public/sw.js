const STATIC_CACHE = "harness-static-v1";
const PAGE_CACHE = "harness-pages-v1";
const CACHE_PREFIXES = ["harness-static-", "harness-pages-"];
const IS_LOCAL_DEVELOPMENT = ["localhost", "127.0.0.1", "[::1]"].includes(self.location.hostname);
const CORE_ASSETS = [
  "/",
  "/app",
  "/offline.html",
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/maskable-512x512.png",
  "/icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  if (IS_LOCAL_DEVELOPMENT) {
    event.waitUntil(self.skipWaiting());
    return;
  }

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  if (IS_LOCAL_DEVELOPMENT) {
    event.waitUntil(
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => CACHE_PREFIXES.some((prefix) => key.startsWith(prefix)))
              .map((key) => caches.delete(key))
          )
        )
        .then(() => self.registration.unregister())
    );
    return;
  }

  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![STATIC_CACHE, PAGE_CACHE].includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (IS_LOCAL_DEVELOPMENT) {
    return;
  }

  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(PAGE_CACHE).then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(event.request);
          return cachedPage || caches.match("/offline.html");
        })
    );
    return;
  }

  if (["script", "style", "image", "font"].includes(event.request.destination)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        const networkResponsePromise = fetch(event.request)
          .then((response) => {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => undefined);

        return cachedResponse || networkResponsePromise || fetch(event.request);
      })
    );
  }
});
