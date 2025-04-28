
import React from 'react';
import { Ad } from '@/api/supabase/ads';

interface AdBannerProps {
  ad: Ad;
}

const AdBanner = ({ ad }: AdBannerProps) => {
  return (
    <a
      href={ad.url_destino}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full p-4 bg-geeky-dark/50 border border-geeky-purple/30 rounded-lg hover:bg-geeky-dark/70 transition-colors"
    >
      {ad.imagen_portada && (
        <img
          src={ad.imagen_portada}
          alt={ad.titulo}
          className="w-full h-32 object-cover rounded-lg mb-2"
        />
      )}
      <h3 className="text-geeky-cyan font-pixel text-sm mb-1">{ad.titulo}</h3>
      <p className="text-geeky-purple/80 text-xs font-mono">{ad.descripcion}</p>
    </a>
  );
};

export default AdBanner;
