
import React, { useState, useEffect } from 'react';
import { getWelcomeMessage, updateWelcomeMessage } from '@/businessLogic/services/welcomeMessageService';
import { getActiveAds } from '@/businessLogic/services/adService';
import { toast } from 'sonner';

const AdminPanel = () => {
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-pixel text-geeky-cyan mb-8">Panel de Administración</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-pixel text-geeky-purple mb-4">Mensaje de Bienvenida</h2>
        <div className="space-y-4">
          <textarea
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
      
      <section>
        <h2 className="text-xl font-pixel text-geeky-purple mb-4">Anuncios</h2>
        {/* Implementaremos la gestión de anuncios en el siguiente paso */}
      </section>
    </div>
  );
};

export default AdminPanel;
