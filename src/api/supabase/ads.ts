
import { supabase } from '@/integrations/supabase/client';

export interface Ad {
  id: number;
  titulo: string;
  descripcion: string;
  url_destino: string;
  imagen_portada: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

export const getActiveAds = async () => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('anuncios')
    .select('*')
    .eq('activo', true)
    .gte('fecha_fin', now)
    .lte('fecha_inicio', now);
    
  if (error) {
    console.error('Error fetching active ads:', error);
    throw error;
  }
  
  return data as Ad[];
};

export const createAd = async (ad: Omit<Ad, 'id'>) => {
  const { data, error } = await supabase
    .from('anuncios')
    .insert(ad)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating ad:', error);
    throw error;
  }
  
  return data;
};

export const updateAd = async (id: number, ad: Partial<Ad>) => {
  const { data, error } = await supabase
    .from('anuncios')
    .update(ad)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating ad:', error);
    throw error;
  }
  
  return data;
};

export const uploadAdImage = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  const { data, error } = await supabase
    .storage
    .from('anuncios')
    .upload(fileName, file);
    
  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
  
  const { data: { publicUrl } } = supabase
    .storage
    .from('anuncios')
    .getPublicUrl(fileName);
    
  return publicUrl;
};
