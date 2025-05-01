
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { SiteSettings } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

const SiteSettingsPage = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const form = useForm<{
    siteName: string;
    siteSubtitle: string;
  }>({
    defaultValues: {
      siteName: '',
      siteSubtitle: '',
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      console.log('Fetching site settings...');
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }

      console.log('Fetched site settings:', data);
      setSettings(data);
      
      form.reset({
        siteName: data.site_name,
        siteSubtitle: data.site_subtitle,
      });
    } catch (error: any) {
      console.error('Error loading site settings:', error);
      toast.error('Error al cargar la configuración', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: { siteName: string; siteSubtitle: string }) => {
    if (!settings) return;
    
    try {
      setSaving(true);
      console.log('Saving site settings:', { id: settings.id, ...values });
      
      // Make sure we're not sending empty values
      if (!values.siteName) {
        toast.error('El nombre del sitio no puede estar vacío');
        setSaving(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('site_settings')
        .update({ 
          site_name: values.siteName,
          site_subtitle: values.siteSubtitle,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id)
        .select();

      if (error) {
        console.error('Error updating site settings:', error);
        throw error;
      }

      console.log('Site settings update response:', data);
      
      if (!data || data.length === 0) {
        throw new Error('No se pudo actualizar la configuración');
      }
      
      setSettings(data[0]);
      toast.success('Configuración guardada correctamente');
      
    } catch (error: any) {
      console.error('Error saving site settings:', error);
      toast.error('Error al guardar la configuración', {
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
        <span className="ml-3 text-geeky-purple">Cargando configuración...</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-geeky-green via-geeky-cyan to-geeky-purple mb-6">
        Configuración del Sitio
      </h1>

      <Card className="bg-geeky-dark border-geeky-purple/30 max-w-2xl">
        <CardHeader>
          <CardTitle className="text-geeky-cyan">Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-geeky-purple">
                      Nombre del Sitio
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-geeky-dark border-geeky-purple/50 text-white focus-visible:ring-geeky-cyan"
                      />
                    </FormControl>
                    <p className="text-xs text-geeky-purple/70">
                      Este nombre aparece en el encabezado principal de la aplicación.
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siteSubtitle"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-geeky-purple">
                      Subtítulo
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-geeky-dark border-geeky-purple/50 text-white focus-visible:ring-geeky-cyan"
                      />
                    </FormControl>
                    <p className="text-xs text-geeky-purple/70">
                      Una breve descripción que aparece debajo del nombre del sitio.
                    </p>
                  </FormItem>
                )}
              />

              <Button 
                type="submit"
                disabled={saving}
                className="bg-geeky-purple hover:bg-geeky-purple/80"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettingsPage;
