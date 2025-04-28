
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

/**
 * Obtiene los anuncios activos desde Supabase
 * @returns Array de anuncios activos
 */
export const fetchActiveAds = async () => {
  console.log("Repositorio: Obteniendo anuncios activos");
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
  
  console.log("Repositorio: Anuncios activos obtenidos:", data);
  return data || [];
};

/**
 * Obtiene todos los anuncios desde Supabase
 * @returns Array de todos los anuncios
 */
export const fetchAllAds = async () => {
  console.log("Repositorio: Obteniendo todos los anuncios");
  const { data, error } = await supabase
    .from('anuncios')
    .select('*')
    .order('id', { ascending: false });
    
  if (error) {
    console.error('Error fetching all ads:', error);
    throw error;
  }
  
  console.log("Repositorio: Todos los anuncios obtenidos:", data);
  return data || [];
};

/**
 * Crea un nuevo anuncio en Supabase
 * @param ad Datos del anuncio
 * @returns Anuncio creado
 */
export const createAd = async (ad: Omit<Ad, 'id'>) => {
  console.log("Repositorio: Creando anuncio:", ad);
  const { data, error } = await supabase
    .from('anuncios')
    .insert(ad)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating ad:', error);
    throw error;
  }
  
  console.log("Repositorio: Anuncio creado:", data);
  return data;
};

/**
 * Actualiza un anuncio existente en Supabase
 * @param id ID del anuncio
 * @param ad Datos del anuncio para actualizar
 * @returns Anuncio actualizado
 */
export const updateAd = async (id: number, ad: Partial<Ad>) => {
  console.log(`Repositorio: Actualizando anuncio ${id}:`, ad);
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
  
  console.log("Repositorio: Anuncio actualizado:", data);
  return data;
};

/**
 * Elimina un anuncio de Supabase
 * @param id ID del anuncio a eliminar
 * @returns true si se eliminó correctamente
 */
export const deleteAd = async (id: number) => {
  console.log(`Repositorio: Eliminando anuncio ${id}`);
  const { error } = await supabase
    .from('anuncios')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting ad:', error);
    throw error;
  }
  
  console.log(`Repositorio: Anuncio ${id} eliminado correctamente`);
  return true;
};

/**
 * Sube una imagen para un anuncio a Supabase Storage
 * @param file Archivo de imagen
 * @returns URL pública de la imagen
 */
export const uploadAdImage = async (file: File) => {
  console.log("Repositorio: Subiendo imagen:", file.name);
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
    
  console.log("Repositorio: Imagen subida, URL pública:", publicUrl);
  return publicUrl;
};
