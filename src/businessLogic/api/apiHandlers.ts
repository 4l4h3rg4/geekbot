
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

// Función para crear respuestas JSON estandarizadas
const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

// Setup API handlers
export const setupAPIHandlers = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    
    if (typeof url === 'string' && url.startsWith('/api/')) {
      console.log(`API Request: ${init?.method || 'GET'} ${url}`);
      
      // Manejar preflight CORS
      if (init?.method === 'OPTIONS') {
        return handleCORS();
      }

      // Mensaje de bienvenida endpoints
      if (url.endsWith('/api/mensaje_bienvenida')) {
        try {
          if (init?.method === 'GET' || !init?.method) {
            const data = await fetchWelcomeMessage();
            return jsonResponse(data);
          } 
          if (init?.method === 'PUT') {
            const body = await parseRequestBody(new Request(input, init));
            const data = await updateWelcomeMessage(body.content || body.contenido);
            return jsonResponse(data);
          }
        } catch (error) {
          return jsonResponse({ error: 'Error processing welcome message request' }, 500);
        }
      }
      
      // Anuncios endpoints
      if (url.endsWith('/api/anuncios/activos')) {
        try {
          const data = await fetchActiveAds();
          return jsonResponse(data);
        } catch (error) {
          return jsonResponse({ error: 'Error fetching active ads' }, 500);
        }
      }
      
      if (url.match(/\/api\/anuncios\/?$/)) {
        try {
          if (init?.method === 'GET') {
            const data = await fetchActiveAds();
            return jsonResponse(data);
          }
          if (init?.method === 'POST') {
            const body = await parseRequestBody(new Request(input, init));
            const data = await createAd(body);
            return jsonResponse(data, 201);
          }
        } catch (error) {
          return jsonResponse({ error: 'Error processing ads request' }, 500);
        }
      }
      
      if (url.match(/\/api\/anuncios\/\d+$/)) {
        try {
          const id = parseInt(url.split('/').pop() || '0');
          
          if (init?.method === 'PUT') {
            const body = await parseRequestBody(new Request(input, init));
            const data = await updateAd(id, body);
            return jsonResponse(data);
          }
          
          if (init?.method === 'DELETE') {
            await deleteAd(id);
            return jsonResponse({ success: true });
          }
        } catch (error) {
          return jsonResponse({ error: 'Error processing ad operation' }, 500);
        }
      }
      
      return jsonResponse({ error: 'Not found' }, 404);
    }
    
    return originalFetch.apply(window, [input, init]);
  };
};
