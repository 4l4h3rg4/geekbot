
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { WelcomeMessage } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Loader2 } from 'lucide-react';

const WelcomeMessagePage = () => {
  const [welcomeMessage, setWelcomeMessage] = useState<WelcomeMessage | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWelcomeMessage();
  }, []);

  const fetchWelcomeMessage = async () => {
    try {
      setLoading(true);
      console.log('Fetching welcome message...');
      
      const { data, error } = await supabase
        .from('welcome_messages')
        .select('*')
        .eq('active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching welcome message:', error);
        throw error;
      }

      console.log('Fetched welcome message:', data);
      
      if (!data) {
        console.log('No active welcome message found, creating one...');
        // If no active message, create a default one
        const { data: newMessage, error: createError } = await supabase
          .from('welcome_messages')
          .insert({
            content: '¡Saludos, viajero del multiverso geek! Soy GeekyBot, tu guía definitivo en este vasto universo de cultura friki.',
            active: true
          })
          .select()
          .single();
          
        if (createError) {
          console.error('Error creating welcome message:', createError);
          throw createError;
        }
        
        setWelcomeMessage(newMessage);
        setContent(newMessage.content);
      } else {
        setWelcomeMessage(data);
        setContent(data.content);
      }
    } catch (error: any) {
      console.error('Error loading welcome message:', error);
      toast.error('Error al cargar el mensaje de bienvenida', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!welcomeMessage) return;
    
    try {
      setSaving(true);
      console.log('Saving welcome message:', { id: welcomeMessage.id, content });
      
      const { data, error } = await supabase
        .from('welcome_messages')
        .update({ 
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', welcomeMessage.id)
        .select();

      if (error) {
        console.error('Error updating welcome message:', error);
        toast.error('Error al guardar el mensaje de bienvenida', {
          description: error.message
        });
        return;
      }

      console.log('Update response:', data);
      
      if (!data || data.length === 0) {
        toast.error('No se pudo actualizar el mensaje de bienvenida');
        return;
      }
      
      toast.success('Mensaje de bienvenida actualizado correctamente');
      
      // Update the local state with the updated data
      setWelcomeMessage(data[0]);
      setContent(data[0].content);
      
    } catch (error: any) {
      console.error('Error updating welcome message:', error);
      toast.error('Error al guardar el mensaje de bienvenida', {
        description: error.message
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-geeky-purple" />
        <span className="ml-3 text-geeky-purple">Cargando mensaje de bienvenida...</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-geeky-green via-geeky-cyan to-geeky-purple mb-6">
        Mensaje de Bienvenida
      </h1>

      <Card className="bg-geeky-dark border-geeky-purple/30 max-w-3xl">
        <CardHeader>
          <CardTitle className="text-geeky-cyan">Editar Mensaje Inicial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="welcome-message" className="block text-sm font-medium text-geeky-purple">
              Mensaje de Bienvenida
            </label>
            <Textarea
              id="welcome-message"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full rounded-md border border-geeky-purple/50 bg-geeky-dark text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-geeky-cyan"
            />
            <p className="text-xs text-geeky-purple/70">
              Este mensaje es lo primero que verán los usuarios al iniciar una conversación con GeekyBot.
            </p>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-geeky-purple hover:bg-geeky-purple/80"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-geeky-dark border-geeky-purple/30 max-w-3xl mt-6 p-4">
        <h3 className="text-geeky-cyan text-sm font-medium mb-2">Vista previa:</h3>
        <div className="bg-black/30 rounded-lg p-4 border border-geeky-purple/20">
          <p className="text-white whitespace-pre-wrap">{content}</p>
        </div>
      </Card>
    </div>
  );
};

export default WelcomeMessagePage;
