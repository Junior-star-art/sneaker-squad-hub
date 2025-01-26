const CACHE_NAME = 'nike-store-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/placeholder.svg',
  '/offline.html'
];

const DATA_CACHE_NAME = 'nike-store-data-v1';
const API_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DATA_CACHE_NAME).then((cache) => {
        console.log('Creating data cache');
      })
    ])
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== DATA_CACHE_NAME)
          .map((name) => {
            console.log('Removing old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
});

// Helper function to determine if a request is for an API endpoint
const isApiRequest = (request) => {
  return request.url.includes('/rest/v1/') || request.url.includes('/auth/v1/');
};

// Helper function to determine if a response is valid
const isValidResponse = (response) => {
  return response && response.status === 200 && response.type === 'basic';
};

// Fetch Strategy: Network First with Cache Fallback for API requests, Cache First for static assets
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Handle API requests
  if (isApiRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return caches.match(request);
          }

          const responseToCache = response.clone();
          caches.open(DATA_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                // Check if cached response is still valid
                const cachedAt = new Date(cachedResponse.headers.get('date'));
                if (Date.now() - cachedAt.getTime() < API_CACHE_DURATION) {
                  return cachedResponse;
                }
              }
              // Return offline fallback for API requests
              return new Response(
                JSON.stringify({ error: 'You are offline' }),
                {
                  headers: { 'Content-Type': 'application/json' },
                  status: 503
                }
              );
            });
        })
    );
    return;
  }

  // Handle static assets and other requests
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        if (!isValidResponse(response)) {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        return new Response('Offline');
      });
    })
  );
});

// Background Sync for Offline Actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'syncCart') {
    event.waitUntil(syncCart());
  }
});

// Helper function to sync cart data
async function syncCart() {
  try {
    const cartData = await getOfflineCartData();
    if (cartData && cartData.length > 0) {
      await Promise.all(cartData.map(item => syncCartItem(item)));
      await clearOfflineCartData();
    }
  } catch (error) {
    console.error('Error syncing cart:', error);
  }
}

// Push Notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Nike Store', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});