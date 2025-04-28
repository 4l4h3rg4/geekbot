
/**
 * Servicio para gestionar anuncios
 * Este servicio se comunica con la API interna que a su vez se conecta con Supabase
 */

import type { Ad } from '@/dataAccess/adsRepository';

export const getActiveAds = async () => {
  try {
    console.log("Servicio: Obteniendo anuncios activos");
    const response = await fetch('/api/anuncios/activos');
    if (!response.ok) {
      throw new Error('Failed to fetch active ads');
    }
    const data = await response.json();
    console.log("Servicio: Anuncios activos recibidos:", data);
    return data;
  } catch (error) {
    console.error('Error in adService.getActiveAds:', error);
    return [];
  }
};

export const getAllAds = async () => {
  try {
    console.log("Servicio: Obteniendo todos los anuncios");
    const response = await fetch('/api/anuncios');
    if (!response.ok) {
      throw new Error('Failed to fetch all ads');
    }
    const data = await response.json();
    console.log("Servicio: Todos los anuncios recibidos:", data);
    return data;
  } catch (error) {
    console.error('Error in adService.getAllAds:', error);
    return [];
  }
};

export const createNewAd = async (adData: Omit<Ad, 'id'>, imageFile?: File) => {
  try {
    console.log("Servicio: Creando nuevo anuncio:", adData);
    let imageUrl = adData.imagen_portada;
    
    // Proceso para subir imagen si existe
    if (imageFile) {
      // Este proceso debería ser manejado por otra función o servicio
      console.log("Servicio: Procesando carga de imagen");
      // Aquí llamaríamos a una función que suba la imagen
    }
    
    const adWithImage = {
      ...adData,
      imagen_portada: imageUrl
    };
    
    const response = await fetch('/api/anuncios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adWithImage),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create ad');
    }
    
    const data = await response.json();
    console.log("Servicio: Anuncio creado:", data);
    return data;
  } catch (error) {
    console.error('Error in adService.createNewAd:', error);
    throw error;
  }
};

export const updateExistingAd = async (id: number, adData: Partial<Ad>, imageFile?: File) => {
  try {
    console.log(`Servicio: Actualizando anuncio ${id}:`, adData);
    let updatedData = {...adData};
    
    // Proceso para actualizar imagen si existe
    if (imageFile) {
      // Este proceso debería ser manejado por otra función o servicio
      console.log("Servicio: Procesando actualización de imagen");
      // Aquí llamaríamos a una función que suba la imagen
    }
    
    const response = await fetch(`/api/anuncios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update ad');
    }
    
    const data = await response.json();
    console.log("Servicio: Anuncio actualizado:", data);
    return data;
  } catch (error) {
    console.error('Error in adService.updateExistingAd:', error);
    throw error;
  }
};

export const removeAd = async (id: number) => {
  try {
    console.log(`Servicio: Eliminando anuncio ${id}`);
    const response = await fetch(`/api/anuncios/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete ad');
    }
    
    console.log("Servicio: Anuncio eliminado correctamente");
    return true;
  } catch (error) {
    console.error('Error in adService.removeAd:', error);
    throw error;
  }
};
