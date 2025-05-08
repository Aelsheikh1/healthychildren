const CACHE_NAME = 'mealinfo-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/data/videos.json',
  '/data/tips.json'
];

// Update cache when new content is processed
async function updateCache() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(urlsToCache);
}

// eslint-disable-next-line no-restricted-globals
const scope = self;

// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Add a message listener to handle processing requests
// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', async event => {
  if (event.data && event.data.type === 'PROCESS_CONTENT') {
    try {
      // Process content
      const worker = new Worker('/process-content-worker.js');
      worker.postMessage({ type: 'PROCESS_CONTENT' });
      
      // Wait for response
      return new Promise((resolve, reject) => {
        worker.onmessage = (event) => {
          if (event.data.success) {
            // Update cache
            updateCache();
            
            // Send success message
            scope.clients.matchAll().then(clients => {
              clients.forEach(client => {
                client.postMessage({ type: 'CONTENT_PROCESSED', success: true });
              });
            });
            resolve(event.data);
          } else {
            reject(event.data.error);
          }
        };
        
        worker.onerror = (error) => {
          reject(error.message);
        };
      });
    } catch (error) {
      console.error('Error processing content:', error);
      scope.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'CONTENT_PROCESSED', success: false, error: error.message });
        });
      });
      throw error;
    }
  }
});
