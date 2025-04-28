
import { fetchWelcomeMessage, updateWelcomeMessage } from '@/dataAccess/welcomeMessageRepository';
import { fetchActiveAds, createAd, updateAd, deleteAd } from '@/dataAccess/adsRepository';

// Función para parsear el cuerpo de la solicitud
const parseRequestBody = async (request: Request) => {
  const contentType = request.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await request.json();
  }
  throw new Error('Unsupported content type');
};

// Función para crear respuestas JSON estandarizadas con CORS adecuado
const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
};

// Manejador de opciones CORS
const handleCORS = () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
};

// Implementación principal del manejador de API
const apiHandler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const method = request.method;
  const path = url.pathname;
  
  console.log(`API Request: ${method} ${path}`);
  
  // Manejar preflight CORS
  if (method === 'OPTIONS') {
    return handleCORS();
  }
  
  // Mensaje de bienvenida endpoints
  if (path === '/api/mensaje_bienvenida') {
    try {
      if (method === 'GET') {
        const data = await fetchWelcomeMessage();
        return jsonResponse(data);
      } 
      if (method === 'PUT') {
        const body = await parseRequestBody(request);
        const data = await updateWelcomeMessage(body.content || body.contenido);
        return jsonResponse(data);
      }
    } catch (error) {
      console.error('Error en endpoint mensaje_bienvenida:', error);
      return jsonResponse({ error: 'Error processing welcome message request' }, 500);
    }
  }
  
  // Anuncios endpoints
  if (path === '/api/anuncios/activos') {
    try {
      if (method === 'GET') {
        const data = await fetchActiveAds();
        return jsonResponse(data);
      }
    } catch (error) {
      console.error('Error en endpoint anuncios/activos:', error);
      return jsonResponse({ error: 'Error fetching active ads' }, 500);
    }
  }
  
  if (path === '/api/anuncios') {
    try {
      if (method === 'GET') {
        const data = await fetchActiveAds();
        return jsonResponse(data);
      }
      if (method === 'POST') {
        const body = await parseRequestBody(request);
        const data = await createAd(body);
        return jsonResponse(data, 201);
      }
    } catch (error) {
      console.error('Error en endpoint anuncios:', error);
      return jsonResponse({ error: 'Error processing ads request' }, 500);
    }
  }
  
  // Manejar operaciones para anuncios específicos (/api/anuncios/1)
  const anuncioPattern = /^\/api\/anuncios\/(\d+)$/;
  const anuncioMatch = path.match(anuncioPattern);
  
  if (anuncioMatch) {
    try {
      const id = parseInt(anuncioMatch[1]);
      
      if (method === 'PUT') {
        const body = await parseRequestBody(request);
        const data = await updateAd(id, body);
        return jsonResponse(data);
      }
      
      if (method === 'DELETE') {
        await deleteAd(id);
        return jsonResponse({ success: true });
      }
    } catch (error) {
      console.error('Error en operación de anuncio específico:', error);
      return jsonResponse({ error: 'Error processing ad operation' }, 500);
    }
  }
  
  // Si no coincide con ninguna ruta de API
  return jsonResponse({ error: 'Not found', path }, 404);
};

// Setup API handlers - Configuración principal de los manejadores de API
export const setupAPIHandlers = () => {
  // En entorno de navegador, registrar un Service Worker para manejar solicitudes API
  if (typeof window !== 'undefined') {
    // Registrar el handler directamente como middleware para capturar solicitudes /api
    const originalFetch = window.fetch;
    
    window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      
      if (typeof url === 'string' && url.startsWith('/api/')) {
        // Para mantener compatibilidad con el cliente interno
        const apiUrl = new URL(url, window.location.origin);
        return apiHandler(new Request(apiUrl, init || {}));
      }
      
      // Para todas las demás solicitudes, usar el fetch original
      return originalFetch.apply(window, [input, init]);
    };

    // Configuración de un event listener para capturar solicitudes de API en entorno cliente
    if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/api-sw.js')
          .then(registration => {
            console.log('API Service Worker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.error('API Service Worker registration failed:', error);
          });
      });
    }
  }
};

// Exportar handler para su uso en entornos de servidor
export const handleApiRequest = async (request: Request): Promise<Response | undefined> => {
  const url = new URL(request.url);
  
  // Solo procesar rutas de API
  if (url.pathname.startsWith('/api/')) {
    return await apiHandler(request);
  }
  
  // Para rutas no-API, dejar que el servidor maneje normalmente
  return undefined;
};
