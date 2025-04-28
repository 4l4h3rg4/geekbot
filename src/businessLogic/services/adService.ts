
import { fetchActiveAds, createAd, updateAd, deleteAd, uploadAdImage } from '@/dataAccess/adsRepository';
import type { Ad } from '@/dataAccess/adsRepository';

export const getActiveAds = async () => {
  try {
    const response = await fetch('/api/anuncios/activos');
    if (!response.ok) {
      throw new Error('Failed to fetch active ads');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in adService.getActiveAds:', error);
    return [];
  }
};

export const createNewAd = async (adData: Omit<Ad, 'id'>, imageFile?: File) => {
  try {
    let imageUrl = adData.imagen_portada;
    
    if (imageFile) {
      imageUrl = await uploadAdImage(imageFile);
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
    
    return await response.json();
  } catch (error) {
    console.error('Error in adService.createNewAd:', error);
    throw error;
  }
};

export const updateExistingAd = async (id: number, adData: Partial<Ad>, imageFile?: File) => {
  try {
    let updatedData = {...adData};
    
    if (imageFile) {
      const imageUrl = await uploadAdImage(imageFile);
      updatedData.imagen_portada = imageUrl;
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
    
    return await response.json();
  } catch (error) {
    console.error('Error in adService.updateExistingAd:', error);
    throw error;
  }
};

export const removeAd = async (id: number) => {
  try {
    const response = await fetch(`/api/anuncios/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete ad');
    }
    
    return true;
  } catch (error) {
    console.error('Error in adService.removeAd:', error);
    throw error;
  }
};
