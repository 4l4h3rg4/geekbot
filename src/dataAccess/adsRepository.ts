
import { supabase } from '@/integrations/supabase/client';

export interface Ad {
  id?: number;
  titulo: string;
  descripcion: string;
  url_destino: string;
  imagen_portada: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

export const fetchActiveAds = async () => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('anuncios')
    .select('*')
    .eq('activo', true)
    .lte('fecha_inicio', now)
    .gte('fecha_fin', now);
    
  if (error) {
    console.error('Error fetching active ads:', error);
    throw error;
  }
  
  return data || [];
};

export const fetchAllAds = async () => {
  const { data, error } = await supabase
    .from('anuncios')
    .select('*')
    .order('id', { ascending: false });
    
  if (error) {
    console.error('Error fetching all ads:', error);
    throw error;
  }
  
  return data || [];
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

export const deleteAd = async (id: number) => {
  const { error } = await supabase
    .from('anuncios')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting ad:', error);
    throw error;
  }
  
  return true;
};

export const uploadAdImage = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('anuncios')
    .upload(filePath, file);
    
  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('anuncios')
    .getPublicUrl(filePath);
    
  return publicUrl;
};
