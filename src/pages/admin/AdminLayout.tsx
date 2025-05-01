
import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';

const AdminLayout = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      
      setLoading(false);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/auth');
      } else if (session) {
        setUser(session.user);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate]);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Sesión cerrada correctamente');
      navigate('/auth');
    } catch (error: any) {
      toast.error('Error al cerrar sesión', {
        description: error.message
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-geeky-dark flex items-center justify-center">
        <div className="animate-pulse text-geeky-cyan">Cargando...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-geeky-dark flex flex-col md:flex-row text-white">
      <AdminSidebar />
      
      <div className="flex-1 p-4 md:p-8 max-w-full overflow-x-hidden">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-geeky-green via-geeky-cyan to-geeky-purple">
            Panel de Administración
          </h1>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-geeky-purple/80 hidden md:block">
              {user.email}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="border-geeky-purple/50 text-geeky-purple hover:bg-geeky-purple/10"
            >
              <LogOut size={16} className="mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </header>
        
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
