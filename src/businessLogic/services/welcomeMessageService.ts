
/**
 * Servicio para gestionar los mensajes de bienvenida
 * Este servicio se comunica con la API interna que a su vez se conecta con Supabase
 */

export const getWelcomeMessage = async () => {
  try {
    const response = await fetch('/api/mensaje_bienvenida');
    if (!response.ok) {
      throw new Error('Failed to fetch welcome message');
    }
    const data = await response.json();
    console.log("Mensaje recibido de la API:", data);
    return data;
  } catch (error) {
    console.error('Error in welcomeMessageService.getWelcomeMessage:', error);
    return { contenido: "¡Bienvenido a GeekyBot!" }; // Default fallback
  }
};

export const updateWelcomeMessage = async (content: string) => {
  try {
    const response = await fetch('/api/mensaje_bienvenida', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update welcome message');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in welcomeMessageService.updateWelcomeMessage:', error);
    throw error;
  }
};
