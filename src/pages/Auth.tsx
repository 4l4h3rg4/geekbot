
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AuthForm from '@/components/auth/AuthForm';
import PixelBackground from '@/components/PixelBackground';
import { Link } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  
  // Comprobar si ya estamos autenticados al cargar la página
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/admin');
      }
    };
    
    checkAuth();

    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <PixelBackground />
      
      {/* Header */}
      <header className="py-6 text-center relative z-10 px-4">
        <Link to="/">
          <h1 className="text-3xl md:text-4xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-geeky-green via-geeky-cyan to-geeky-purple glow-text">
            GeekyBot
          </h1>
        </Link>
        <p className="mt-2 font-mono text-geeky-cyan/80">
          Portal de Administración
        </p>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-6 relative z-10">
        <AuthForm />
      </main>
      
      {/* Footer */}
      <footer className="py-3 text-center text-xs font-mono text-geeky-purple/50 relative z-10">
        <p>GeekyBot &copy; 2025 • v1.0.0 • Panel de Administración</p>
      </footer>
    </div>
  );
};

export default Auth;
