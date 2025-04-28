
import { fetchWelcomeMessage, updateWelcomeMessage } from '@/dataAccess/welcomeMessageRepository';
import { fetchActiveAds, createAd, updateAd, deleteAd } from '@/dataAccess/adsRepository';

// Mock response function to simulate API responses
const mockResponse = (data: any, status = 200, delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(new Response(JSON.stringify(data), { 
        status,
        headers: { 'Content-Type': 'application/json' }
      }));
    }, delay);
  });
};

// Setup fetch interceptor for API routes
export const setupAPIHandlers = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    
    // Check if this is an API request
    if (typeof url === 'string' && url.includes('/api/')) {
      console.log(`API Request: ${init?.method || 'GET'} ${url}`);
      
      // Welcome message endpoints
      if (url.endsWith('/api/mensaje_bienvenida')) {
        if (init?.method === 'GET' || !init?.method) {
          console.log("Obteniendo mensaje de bienvenida de Supabase");
          const data = await fetchWelcomeMessage();
          console.log("Mensaje obtenido:", data);
          return mockResponse(data, 200, 100);
        } 
        else if (init?.method === 'PUT' || init?.method === 'POST') {
          const body = init.body ? JSON.parse(init.body as string) : {};
          console.log("Actualizando mensaje de bienvenida:", body.content || body.contenido);
          const data = await updateWelcomeMessage(body.content || body.contenido);
          console.log("Mensaje actualizado:", data);
          return mockResponse(data, 200, 100);
        }
      }
      
      // Ads endpoints
      if (url.endsWith('/api/anuncios/activos')) {
        console.log("Obteniendo anuncios activos");
        const data = await fetchActiveAds();
        console.log("Anuncios activos:", data);
        return mockResponse(data, 200, 100);
      }
      
      if (url.match(/\/api\/anuncios\/?$/)) {
        if (init?.method === 'GET') {
          console.log("Obteniendo todos los anuncios");
          const data = await fetchActiveAds(); // Usamos fetchActiveAds por ahora, pero podríamos tener un fetchAllAds
          return mockResponse(data, 200, 100);
        }
        if (init?.method === 'POST') {
          const body = init.body ? JSON.parse(init.body as string) : {};
          console.log("Creando nuevo anuncio:", body);
          const data = await createAd(body);
          return mockResponse(data, 201, 100);
        }
      }
      
      if (url.match(/\/api\/anuncios\/\d+$/)) {
        const id = parseInt(url.split('/').pop() || '0');
        
        if (init?.method === 'PUT') {
          const body = init.body ? JSON.parse(init.body as string) : {};
          console.log(`Actualizando anuncio ${id}:`, body);
          const data = await updateAd(id, body);
          return mockResponse(data, 200, 100);
        }
        
        if (init?.method === 'DELETE') {
          console.log(`Eliminando anuncio ${id}`);
          await deleteAd(id);
          return mockResponse({ success: true }, 200, 100);
        }
      }
      
      // Si endpoint no encontrado
      return mockResponse({ error: 'Not found' }, 404, 100);
    }
    
    // Para solicitudes que no son de API, usar el fetch original
    return originalFetch.apply(window, [input, init]);
  };
};
