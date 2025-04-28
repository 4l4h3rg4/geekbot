
import { supabase } from '@/integrations/supabase/client';

/**
 * Obtiene el mensaje de bienvenida desde Supabase
 * @returns Objeto con el contenido del mensaje de bienvenida
 */
export const fetchWelcomeMessage = async () => {
  console.log("Repositorio: Obteniendo mensaje de bienvenida");
  const { data, error } = await supabase
    .from('mensaje_bienvenida')
    .select('*')
    .single();
    
  if (error) {
    console.error('Error fetching welcome message:', error);
    throw error;
  }
  
  console.log("Repositorio: Mensaje de bienvenida obtenido:", data);
  return data;
};

/**
 * Actualiza el mensaje de bienvenida en Supabase
 * @param content Nuevo contenido del mensaje
 * @returns Objeto con el mensaje actualizado
 */
export const updateWelcomeMessage = async (content: string) => {
  console.log("Repositorio: Actualizando mensaje de bienvenida:", content);
  
  const { data, error } = await supabase
    .from('mensaje_bienvenida')
    .update({ 
      contenido: content,
      fecha_actualizacion: new Date().toISOString()
    })
    .eq('id', 1)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating welcome message:', error);
    throw error;
  }
  
  console.log("Repositorio: Mensaje de bienvenida actualizado:", data);
  return data;
};
