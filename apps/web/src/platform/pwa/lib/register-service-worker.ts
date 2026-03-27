interface RegisterServiceWorkerOptions {
  onRegistered?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: () => void;
}

const CACHE_PREFIXES = ["harness-static-", "harness-pages-"];

const isLocalHostname = (hostname: string) => {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".local")
  );
};

const clearHarnessCaches = async () => {
  if (typeof window === "undefined" || !("caches" in window)) {
    return;
  }

  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((cacheName) => CACHE_PREFIXES.some((prefix) => cacheName.startsWith(prefix)))
      .map((cacheName) => caches.delete(cacheName))
  );
};

export const unregisterServiceWorkers = async () => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
  await clearHarnessCaches();
};

export const shouldEnableServiceWorker = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return process.env.NODE_ENV === "production" && !isLocalHostname(window.location.hostname);
};

export const registerServiceWorker = async ({
  onRegistered,
  onUpdate
}: RegisterServiceWorkerOptions = {}) => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  if (!shouldEnableServiceWorker()) {
    await unregisterServiceWorkers();
    return null;
  }

  const registration = await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
    updateViaCache: "none"
  });

  onRegistered?.(registration);

  if (registration.waiting) {
    onUpdate?.();
  }

  registration.addEventListener("updatefound", () => {
    const installingWorker = registration.installing;

    if (!installingWorker) {
      return;
    }

    installingWorker.addEventListener("statechange", () => {
      if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
        onUpdate?.();
      }
    });
  });

  return registration;
};
