
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
          const data = await fetchWelcomeMessage();
          return mockResponse(data, 200, 100);
        } 
        else if (init?.method === 'PUT' || init?.method === 'POST') {
          const body = init.body ? JSON.parse(init.body as string) : {};
          const data = await updateWelcomeMessage(body.content || body.contenido);
          return mockResponse(data, 200, 100);
        }
      }
      
      // Ads endpoints
      if (url.endsWith('/api/anuncios/activos')) {
        const data = await fetchActiveAds();
        return mockResponse(data, 200, 100);
      }
      
      if (url.match(/\/api\/anuncios\/?$/)) {
        if (init?.method === 'POST') {
          const body = init.body ? JSON.parse(init.body as string) : {};
          const data = await createAd(body);
          return mockResponse(data, 201, 100);
        }
      }
      
      if (url.match(/\/api\/anuncios\/\d+$/)) {
        const id = parseInt(url.split('/').pop() || '0');
        
        if (init?.method === 'PUT') {
          const body = init.body ? JSON.parse(init.body as string) : {};
          const data = await updateAd(id, body);
          return mockResponse(data, 200, 100);
        }
        
        if (init?.method === 'DELETE') {
          await deleteAd(id);
          return mockResponse({ success: true }, 200, 100);
        }
      }
      
      // If endpoint not found
      return mockResponse({ error: 'Not found' }, 404, 100);
    }
    
    // For non-API requests, use the original fetch
    return originalFetch.apply(window, [input, init]);
  };
};
