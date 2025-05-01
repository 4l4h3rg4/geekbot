
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { SiteSettings } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

const SiteSettingsPage = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [siteName, setSiteName] = useState('');
  const [siteSubtitle, setSiteSubtitle] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) throw error;

      setSettings(data);
      setSiteName(data.site_name);
      setSiteSubtitle(data.site_subtitle);
    } catch (error: any) {
      toast.error('Error al cargar la configuración', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('site_settings')
        .update({ 
          site_name: siteName,
          site_subtitle: siteSubtitle,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast.success('Configuración guardada correctamente');
      
      // Volver a cargar los datos para asegurarse de que tenemos lo más reciente
      await fetchSettings();
    } catch (error: any) {
      toast.error('Error al guardar la configuración', {
        description: error.message
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Cargando configuración...</div>;
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
          <div className="space-y-2">
            <label htmlFor="site-name" className="block text-sm font-medium text-geeky-purple">
              Nombre del Sitio
            </label>
            <Input
              id="site-name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="bg-geeky-dark border-geeky-purple/50 text-white focus-visible:ring-geeky-cyan"
            />
            <p className="text-xs text-geeky-purple/70">
              Este nombre aparece en el encabezado principal de la aplicación.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="site-subtitle" className="block text-sm font-medium text-geeky-purple">
              Subtítulo
            </label>
            <Input
              id="site-subtitle"
              value={siteSubtitle}
              onChange={(e) => setSiteSubtitle(e.target.value)}
              className="bg-geeky-dark border-geeky-purple/50 text-white focus-visible:ring-geeky-cyan"
            />
            <p className="text-xs text-geeky-purple/70">
              Una breve descripción que aparece debajo del nombre del sitio.
            </p>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-geeky-purple hover:bg-geeky-purple/80"
          >
            {saving ? (
              <>Guardando...</>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettingsPage;
