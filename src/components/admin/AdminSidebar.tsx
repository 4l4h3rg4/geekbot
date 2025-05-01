
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Settings, MessageSquare, Image } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { 
      path: "/admin", 
      title: "Panel Principal", 
      icon: <Layout className="w-5 h-5" /> 
    },
    { 
      path: "/admin/site-settings", 
      title: "Configuración del Sitio", 
      icon: <Settings className="w-5 h-5" /> 
    },
    { 
      path: "/admin/welcome-message", 
      title: "Mensaje de Bienvenida", 
      icon: <MessageSquare className="w-5 h-5" /> 
    },
    { 
      path: "/admin/advertisements", 
      title: "Anuncios", 
      icon: <Image className="w-5 h-5" /> 
    }
  ];

  return (
    <div className="bg-geeky-dark/90 w-64 min-h-screen border-r border-geeky-purple/20 p-4">
      <div className="mb-6">
        <h2 className="text-xl font-pixel text-geeky-purple">Admin GeekyBot</h2>
        <p className="text-xs text-geeky-purple/60 mt-1">Panel de Administración</p>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
              location.pathname === item.path
                ? "bg-geeky-purple/20 text-geeky-cyan"
                : "text-geeky-purple/70 hover:bg-geeky-purple/10 hover:text-geeky-cyan/80"
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span className="font-mono text-sm">{item.title}</span>
          </Link>
        ))}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <Link 
          to="/" 
          className="flex items-center justify-center w-full px-3 py-2 text-sm font-mono text-geeky-purple/70 hover:text-geeky-cyan border border-geeky-purple/30 rounded-md transition-colors"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
