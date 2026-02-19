/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare let self: ServiceWorkerGlobalScope;

// Precache all assets injected by vite-plugin-pwa
precacheAndRoute(self.__WB_MANIFEST);

// API calls — network first with 3s timeout
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3,
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  })
);

// Uploaded files — cache first, 30 days
registerRoute(
  ({ url }) => url.pathname.startsWith('/uploads/'),
  new CacheFirst({
    cacheName: 'uploads-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// Map tiles — cache first, 30 days
registerRoute(
  ({ url }) => url.hostname.includes('tile.openstreetmap.org'),
  new CacheFirst({
    cacheName: 'map-tiles-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 500, maxAgeSeconds: 30 * 24 * 60 * 60 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// Push notification handler
self.addEventListener('push', (event) => {
  let title = 'Love Logger';
  let options: NotificationOptions = {
    body: '',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: 'love-logger',
    data: { url: '/timeline' },
  };

  try {
    if (event.data) {
      const payload = event.data.json();
      title = payload.title || title;
      options.body = payload.body || '';
      options.data = { url: payload.url || '/timeline' };
    }
  } catch {
    // use defaults for malformed payloads
  }

  // iOS requires every push event to show a notification — never skip waitUntil
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = (event.notification.data?.url as string) || '/timeline';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(self.location.origin));
      if (existing) {
        existing.focus();
        existing.navigate(url);
      } else {
        self.clients.openWindow(url);
      }
    })
  );
});

// Skip waiting so new SW activates immediately
self.addEventListener('install', () => {
  self.skipWaiting();
});

// Claim clients immediately on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
