
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, PenSquare, FileText } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 bg-geeky-dark/80 backdrop-blur-sm border-b border-geeky-purple/30 z-20 px-4 py-2">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-geeky-green" />
          <span className="font-pixel text-geeky-green">GeekyBot</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className={`px-3 py-1 rounded-md text-sm font-mono transition-colors ${isActive('/') 
              ? 'bg-geeky-cyan/20 text-geeky-cyan' 
              : 'hover:bg-geeky-dark/50 text-white/70 hover:text-white'}`}
          >
            Chat
          </Link>
          
          <Link 
            to="/admin" 
            className={`px-3 py-1 rounded-md text-sm font-mono flex items-center gap-1 transition-colors ${isActive('/admin') 
              ? 'bg-geeky-purple/20 text-geeky-purple' 
              : 'hover:bg-geeky-dark/50 text-white/70 hover:text-white'}`}
          >
            <PenSquare className="h-3 w-3" />
            Admin
          </Link>
          
          <Link 
            to="/api-docs" 
            className={`px-3 py-1 rounded-md text-sm font-mono flex items-center gap-1 transition-colors ${isActive('/api-docs') 
              ? 'bg-geeky-magenta/20 text-geeky-magenta' 
              : 'hover:bg-geeky-dark/50 text-white/70 hover:text-white'}`}
          >
            <FileText className="h-3 w-3" />
            API Docs
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
