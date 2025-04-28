
// Service Worker para manejar rutas de API en entornos de producción
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Solo interceptar solicitudes de API
  if (url.pathname.startsWith('/api/')) {
    // Responder con un mensaje de error para indicar que debe ser manejado por el servidor
    event.respondWith(
      new Response(JSON.stringify({ 
        error: 'API Service Worker active but server-side handling required',
        info: 'This API endpoint should be handled by the server. Make sure your server is correctly configured to handle API routes.'
      }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      })
    );
  }
});

// Instalación y activación del Service Worker
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
