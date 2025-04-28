
import React, { useState, useEffect } from 'react';
import { getWelcomeMessage, updateWelcomeMessage } from '@/businessLogic/services/welcomeMessageService';
import { getActiveAds, createNewAd, updateExistingAd, removeAd } from '@/businessLogic/services/adService';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Ad {
  id?: number;
  titulo: string;
  descripcion: string;
  url_destino: string;
  imagen_portada: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

const AdminPanel = () => {
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [newAd, setNewAd] = useState<Omit<Ad, 'id'>>({
    titulo: '',
    descripcion: '',
    url_destino: '',
    imagen_portada: '',
    fecha_inicio: new Date().toISOString(),
    fecha_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    activo: true
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [messageData, adsData] = await Promise.all([
        getWelcomeMessage(),
        getActiveAds()
      ]);
      setWelcomeMessage(messageData.contenido);
      setAds(adsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    }
  };

  const handleWelcomeMessageUpdate = async () => {
    setLoading(true);
    try {
      await updateWelcomeMessage(welcomeMessage);
      toast.success('Mensaje de bienvenida actualizado');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAd = async () => {
    try {
      await createNewAd(newAd);
      toast.success('Anuncio creado exitosamente');
      loadInitialData();
      setNewAd({
        titulo: '',
        descripcion: '',
        url_destino: '',
        imagen_portada: '',
        fecha_inicio: new Date().toISOString(),
        fecha_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        activo: true
      });
    } catch (error) {
      console.error('Error creating ad:', error);
      toast.error('Error al crear el anuncio');
    }
  };

  const handleUpdateAd = async () => {
    if (!editingAd?.id) return;
    try {
      await updateExistingAd(editingAd.id, editingAd);
      toast.success('Anuncio actualizado exitosamente');
      loadInitialData();
      setEditingAd(null);
    } catch (error) {
      console.error('Error updating ad:', error);
      toast.error('Error al actualizar el anuncio');
    }
  };

  const handleDeleteAd = async (id: number) => {
    try {
      await removeAd(id);
      toast.success('Anuncio eliminado exitosamente');
      loadInitialData();
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast.error('Error al eliminar el anuncio');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-pixel text-geeky-cyan mb-8">Panel de Administración</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-pixel text-geeky-purple mb-4">Mensaje de Bienvenida</h2>
        <div className="space-y-4">
          <Textarea
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            className="w-full h-32 p-4 bg-geeky-dark/50 border border-geeky-purple/30 rounded-lg text-white"
          />
          <button
            onClick={handleWelcomeMessageUpdate}
            disabled={loading}
            className="px-4 py-2 bg-geeky-cyan/20 hover:bg-geeky-cyan/30 text-geeky-cyan font-pixel rounded-lg transition-colors"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-pixel text-geeky-purple mb-4">Crear Nuevo Anuncio</h2>
        <div className="space-y-4 bg-geeky-dark/50 p-4 rounded-lg border border-geeky-purple/30">
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={newAd.titulo}
              onChange={(e) => setNewAd({...newAd, titulo: e.target.value})}
              className="bg-geeky-dark/70"
            />
          </div>
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={newAd.descripcion}
              onChange={(e) => setNewAd({...newAd, descripcion: e.target.value})}
              className="bg-geeky-dark/70"
            />
          </div>
          <div>
            <Label htmlFor="url">URL de destino</Label>
            <Input
              id="url"
              type="url"
              value={newAd.url_destino}
              onChange={(e) => setNewAd({...newAd, url_destino: e.target.value})}
              className="bg-geeky-dark/70"
            />
          </div>
          <div>
            <Label htmlFor="imagen">URL de la imagen</Label>
            <Input
              id="imagen"
              type="url"
              value={newAd.imagen_portada}
              onChange={(e) => setNewAd({...newAd, imagen_portada: e.target.value})}
              className="bg-geeky-dark/70"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha_inicio">Fecha de inicio</Label>
              <Input
                id="fecha_inicio"
                type="datetime-local"
                value={new Date(newAd.fecha_inicio).toISOString().slice(0, 16)}
                onChange={(e) => setNewAd({...newAd, fecha_inicio: new Date(e.target.value).toISOString()})}
                className="bg-geeky-dark/70"
              />
            </div>
            <div>
              <Label htmlFor="fecha_fin">Fecha de fin</Label>
              <Input
                id="fecha_fin"
                type="datetime-local"
                value={new Date(newAd.fecha_fin).toISOString().slice(0, 16)}
                onChange={(e) => setNewAd({...newAd, fecha_fin: new Date(e.target.value).toISOString()})}
                className="bg-geeky-dark/70"
              />
            </div>
          </div>
          <button
            onClick={handleCreateAd}
            className="w-full px-4 py-2 bg-geeky-cyan/20 hover:bg-geeky-cyan/30 text-geeky-cyan font-pixel rounded-lg transition-colors"
          >
            Crear Anuncio
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-pixel text-geeky-purple mb-4">Anuncios Activos</h2>
        <div className="space-y-4">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-geeky-dark/50 p-4 rounded-lg border border-geeky-purple/30">
              {editingAd?.id === ad.id ? (
                <div className="space-y-4">
                  <Input
                    value={editingAd.titulo}
                    onChange={(e) => setEditingAd({...editingAd, titulo: e.target.value})}
                    className="bg-geeky-dark/70"
                  />
                  <Textarea
                    value={editingAd.descripcion}
                    onChange={(e) => setEditingAd({...editingAd, descripcion: e.target.value})}
                    className="bg-geeky-dark/70"
                  />
                  <Input
                    type="url"
                    value={editingAd.url_destino}
                    onChange={(e) => setEditingAd({...editingAd, url_destino: e.target.value})}
                    className="bg-geeky-dark/70"
                  />
                  <Input
                    type="url"
                    value={editingAd.imagen_portada}
                    onChange={(e) => setEditingAd({...editingAd, imagen_portada: e.target.value})}
                    className="bg-geeky-dark/70"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="datetime-local"
                      value={new Date(editingAd.fecha_inicio).toISOString().slice(0, 16)}
                      onChange={(e) => setEditingAd({...editingAd, fecha_inicio: new Date(e.target.value).toISOString()})}
                      className="bg-geeky-dark/70"
                    />
                    <Input
                      type="datetime-local"
                      value={new Date(editingAd.fecha_fin).toISOString().slice(0, 16)}
                      onChange={(e) => setEditingAd({...editingAd, fecha_fin: new Date(e.target.value).toISOString()})}
                      className="bg-geeky-dark/70"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateAd}
                      className="flex-1 px-4 py-2 bg-geeky-cyan/20 hover:bg-geeky-cyan/30 text-geeky-cyan font-pixel rounded-lg transition-colors"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingAd(null)}
                      className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-pixel rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-geeky-cyan font-pixel text-lg mb-2">{ad.titulo}</h3>
                  <p className="text-white/80 mb-2">{ad.descripcion}</p>
                  <p className="text-geeky-purple/80 text-sm mb-2">URL: {ad.url_destino}</p>
                  {ad.imagen_portada && (
                    <img src={ad.imagen_portada} alt={ad.titulo} className="w-full h-32 object-cover rounded-lg mb-2" />
                  )}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setEditingAd(ad)}
                      className="flex-1 px-4 py-2 bg-geeky-cyan/20 hover:bg-geeky-cyan/30 text-geeky-cyan font-pixel rounded-lg transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteAd(ad.id!)}
                      className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-pixel rounded-lg transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
