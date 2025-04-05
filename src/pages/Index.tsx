
import React from 'react';
import { Toaster } from 'sonner';
import ChatInterface from '@/components/ChatInterface';
import PixelBackground from '@/components/PixelBackground';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PixelBackground />
      
      {/* Header */}
      <header className="py-6 text-center relative z-10">
        <h1 className="text-3xl md:text-4xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-geeky-green via-geeky-cyan to-geeky-purple glow-text glitch" data-text="GeekyBot">
          GeekyBot
        </h1>
        <p className="mt-2 font-mono text-geeky-cyan/80">Tu guía definitiva del multiverso geek</p>
      </header>
      
      {/* Main content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pb-6 relative z-10">
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
