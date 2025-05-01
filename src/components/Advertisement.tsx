
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Advertisement as AdvertisementType } from '@/types/admin';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const Advertisement = () => {
  const [ad, setAd] = useState<AdvertisementType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRandomAdvertisement();
  }, []);

  const fetchRandomAdvertisement = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Asegurarse de obtener los datos más recientes
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching advertisements:', error);
        setError('Error loading advertisement');
        toast.error('Error al cargar los anuncios');
        throw error;
      }

      if (data && data.length > 0) {
        // Select a random ad from the results
        const randomIndex = Math.floor(Math.random() * data.length);
        setAd(data[randomIndex]);
      }
    } catch (err) {
      console.error('Error processing advertisements:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-geeky-dark/50 border-geeky-purple/30 mb-4 overflow-hidden animate-pulse">
        <CardContent className="h-20 p-3"></CardContent>
      </Card>
    );
  }
  
  if (error || !ad) return null;

  return (
    <Card className="bg-geeky-dark/50 border-geeky-purple/30 mb-4 overflow-hidden hover:border-geeky-purple/50 transition-all">
      <CardContent className="p-3">
        <a 
          href={ad.link_url || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          <div className="flex items-center space-x-3">
            {ad.image_url && (
              <div className="flex-shrink-0">
                <img 
                  src={ad.image_url} 
                  alt={ad.title} 
                  className="w-16 h-16 object-cover rounded" 
                />
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="text-sm font-medium text-geeky-cyan">
                {ad.title}
              </h3>
              {ad.description && (
                <p className="text-xs text-geeky-purple/80 mt-1 line-clamp-2">
                  {ad.description}
                </p>
              )}
            </div>
          </div>
        </a>
      </CardContent>
    </Card>
  );
};

export default Advertisement;
