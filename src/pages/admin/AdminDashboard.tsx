
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Settings, MessageSquare, Image } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // Admin cards with quick links
  const adminCards = [
    {
      title: "Configuración del Sitio",
      description: "Editar el nombre y subtítulo del sitio",
      icon: <Settings className="w-5 h-5" />,
      link: "/admin/site-settings",
    },
    {
      title: "Mensaje de Bienvenida",
      description: "Personalizar el mensaje inicial del chat",
      icon: <MessageSquare className="w-5 h-5" />,
      link: "/admin/welcome-message",
    },
    {
      title: "Anuncios",
      description: "Gestionar anuncios promocionales",
      icon: <Image className="w-5 h-5" />,
      link: "/admin/advertisements",
    }
  ];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-geeky-green via-geeky-cyan to-geeky-purple mb-6">
        Panel de Administración
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card, index) => (
          <Link to={card.link} key={index}>
            <Card className="bg-geeky-dark border-geeky-purple/30 hover:border-geeky-purple/60 transition-all hover:shadow-lg hover:shadow-geeky-purple/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-geeky-cyan">{card.title}</CardTitle>
                  <div className="text-geeky-purple">{card.icon}</div>
                </div>
                <CardDescription className="text-geeky-purple/70">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-right pt-2">
                <span className="text-xs text-geeky-green">Gestionar →</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-xl text-geeky-cyan mb-4 font-mono">Guía Rápida</h2>
        <div className="bg-geeky-dark/50 border border-geeky-purple/20 rounded-lg p-4">
          <p className="text-geeky-purple/80 mb-2">
            Bienvenido al panel de administración de GeekyBot. Desde aquí podrás personalizar diferentes aspectos de la aplicación:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-geeky-purple/70">
            <li>Modifica el nombre y subtítulo del sitio</li>
            <li>Cambia el mensaje de bienvenida que ven los usuarios al iniciar el chat</li>
            <li>Gestiona los anuncios promocionales que se muestran en la aplicación</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
