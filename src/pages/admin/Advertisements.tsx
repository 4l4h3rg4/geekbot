
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Advertisement } from '@/types/admin';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';

const AdvertisementsPage = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [currentAd, setCurrentAd] = useState<Partial<Advertisement>>({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    active: true,
    start_date: new Date().toISOString(),
  });

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAds(data || []);
    } catch (error: any) {
      toast.error('Error al cargar los anuncios', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentAd((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCurrentAd((prev) => ({ ...prev, [name]: checked }));
  };

  const openNewAdDialog = () => {
    setCurrentAd({
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      active: true,
      start_date: new Date().toISOString(),
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEditDialog = (ad: Advertisement) => {
    setCurrentAd(ad);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (!currentAd.title) {
        toast.error('El título es obligatorio');
        return;
      }
      
      if (isEditing && currentAd.id) {
        // Update existing ad
        const { error } = await supabase
          .from('advertisements')
          .update({
            title: currentAd.title,
            description: currentAd.description,
            image_url: currentAd.image_url,
            link_url: currentAd.link_url,
            active: currentAd.active,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentAd.id);
          
        if (error) throw error;
        toast.success('Anuncio actualizado correctamente');
      } else {
        // Create new ad
        const { error } = await supabase
          .from('advertisements')
          .insert([{
            title: currentAd.title,
            description: currentAd.description,
            image_url: currentAd.image_url,
            link_url: currentAd.link_url,
            active: currentAd.active,
            start_date: currentAd.start_date
          }]);
          
        if (error) throw error;
        toast.success('Anuncio creado correctamente');
      }
      
      setDialogOpen(false);
      fetchAdvertisements();
    } catch (error: any) {
      toast.error('Error al guardar el anuncio', {
        description: error.message
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!confirm('¿Estás seguro de que deseas eliminar este anuncio?')) return;
      
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Anuncio eliminado correctamente');
      fetchAdvertisements();
    } catch (error: any) {
      toast.error('Error al eliminar el anuncio', {
        description: error.message
      });
    }
  };

  const handleToggleActive = async (ad: Advertisement) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .update({ 
          active: !ad.active,
          updated_at: new Date().toISOString()
        })
        .eq('id', ad.id);
        
      if (error) throw error;
      
      toast.success(`Anuncio ${!ad.active ? 'activado' : 'desactivado'} correctamente`);
      fetchAdvertisements();
    } catch (error: any) {
      toast.error('Error al actualizar el estado del anuncio', {
        description: error.message
      });
    }
  };

  if (loading) {
    return <div className="text-center py-10">Cargando anuncios...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-geeky-green via-geeky-cyan to-geeky-purple">
          Anuncios
        </h1>
        
        <Button 
          onClick={openNewAdDialog}
          className="bg-geeky-purple hover:bg-geeky-purple/80"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Anuncio
        </Button>
      </div>

      <Card className="bg-geeky-dark border-geeky-purple/30">
        <CardHeader>
          <CardTitle className="text-geeky-cyan">Gestión de Anuncios</CardTitle>
          <CardDescription className="text-geeky-purple/70">
            Administra los anuncios promocionales que aparecen en la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ads.length === 0 ? (
            <div className="text-center py-8 text-geeky-purple/70">
              No hay anuncios disponibles. Crea tu primer anuncio haciendo clic en "Nuevo Anuncio".
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-geeky-cyan">Título</TableHead>
                  <TableHead className="text-geeky-cyan">Estado</TableHead>
                  <TableHead className="text-geeky-cyan">Creado</TableHead>
                  <TableHead className="text-geeky-cyan text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ads.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell className="font-medium text-white">{ad.title}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ad.active 
                          ? "bg-geeky-green/20 text-geeky-green" 
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {ad.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-geeky-purple/70">
                      {new Date(ad.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleToggleActive(ad)}
                          title={ad.active ? 'Desactivar' : 'Activar'}
                        >
                          {ad.active ? 
                            <X className="h-4 w-4 text-red-400" /> : 
                            <Check className="h-4 w-4 text-geeky-green" />
                          }
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => openEditDialog(ad)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4 text-geeky-cyan" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleDelete(ad.id)}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-geeky-dark border-geeky-purple/50 text-white">
          <DialogHeader>
            <DialogTitle className="text-geeky-cyan">
              {isEditing ? 'Editar Anuncio' : 'Nuevo Anuncio'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-geeky-purple">
                Título
              </label>
              <Input
                name="title"
                value={currentAd.title || ''}
                onChange={handleInputChange}
                className="bg-geeky-dark/50 border-geeky-purple/50"
                placeholder="Título del anuncio"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-geeky-purple">
                Descripción
              </label>
              <textarea
                name="description"
                value={currentAd.description || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border border-geeky-purple/50 bg-geeky-dark/50 px-3 py-2 text-white"
                placeholder="Descripción del anuncio"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-geeky-purple">
                URL de la Imagen
              </label>
              <Input
                name="image_url"
                value={currentAd.image_url || ''}
                onChange={handleInputChange}
                className="bg-geeky-dark/50 border-geeky-purple/50"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-geeky-purple">
                URL de Destino
              </label>
              <Input
                name="link_url"
                value={currentAd.link_url || ''}
                onChange={handleInputChange}
                className="bg-geeky-dark/50 border-geeky-purple/50"
                placeholder="https://ejemplo.com"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={currentAd.active || false}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-geeky-purple focus:ring-geeky-cyan"
              />
              <label htmlFor="active" className="text-sm text-geeky-purple">
                Anuncio activo
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              className="border-geeky-purple/50 text-geeky-purple hover:bg-geeky-purple/10"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="bg-geeky-purple hover:bg-geeky-purple/80"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvertisementsPage;
