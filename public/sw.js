const CACHE_NAME = "web-harmonium-v1";

const ASSETS = [
  "/",
  "/manifest.json",
  "/webharmonium/audio-harmonium.wav",
  "/webharmonium/reverb.wav",
  "/webharmonium/webharmonium.png",
  "/webharmonium/icons/webharmonium_016.png",
  "/webharmonium/icons/webharmonium_192.png",
  "/webharmonium/icons/webharmonium_512.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
