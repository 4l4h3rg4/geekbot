
import { supabase } from '@/integrations/supabase/client';

export const fetchWelcomeMessage = async () => {
  const { data, error } = await supabase
    .from('mensaje_bienvenida')
    .select('*')
    .single();
    
  if (error) {
    console.error('Error fetching welcome message:', error);
    throw error;
  }
  
  return data;
};

export const updateWelcomeMessage = async (content: string) => {
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
  
  return data;
};
