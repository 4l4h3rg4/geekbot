
import React, { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import ChatInterface from '@/components/ChatInterface';
import PixelBackground from '@/components/PixelBackground';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { SiteSettings } from '@/types/admin';
import { Settings } from 'lucide-react';
import Advertisement from '@/components/Advertisement';

const Index = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      // Fallback to default values if error
      setSettings({
        id: 'default',
        site_name: 'GeekyBot',
        site_subtitle: 'Tu guía definitiva del multiverso geek',
        created_at: '',
        updated_at: ''
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PixelBackground />
      
      {/* Header */}
      <header className="py-6 text-center relative z-10 px-4">
        <h1 className="text-3xl md:text-4xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-geeky-green via-geeky-cyan to-geeky-purple glow-text glitch" data-text={loading ? "GeekyBot" : settings?.site_name}>
          {loading ? "GeekyBot" : settings?.site_name}
        </h1>
        <p className="mt-2 font-mono text-geeky-cyan/80">
          {loading ? "Tu guía definitiva del multiverso geek" : settings?.site_subtitle}
        </p>
      </header>
      
      {/* Main content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pb-6 relative z-10">
        {/* Admin Link */}
        <div className="absolute right-8 top-0 z-20">
          <Link 
            to="/admin" 
            className="text-geeky-purple/60 hover:text-geeky-purple transition-colors" 
            title="Admin Panel"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
        
        {/* Advertisement Banner */}
        <Advertisement />
        
        <div className="bg-geeky-dark/80 backdrop-blur-sm rounded-lg border border-geeky-purple/30 overflow-hidden h-[calc(100vh-180px)]">
          <ChatInterface />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-3 text-center text-xs font-mono text-geeky-purple/50 relative z-10">
        <p>GeekyBot &copy; 2025 • v1.0.0 • Todos los universos geek conectados</p>
      </footer>
      
      <Toaster position="bottom-right" toastOptions={{
        className: "!bg-geeky-dark !border !border-geeky-purple/30 !font-mono !text-white",
        duration: 3000,
      }} />
    </div>
  );
};

export default Index;
