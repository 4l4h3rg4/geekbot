
import React from 'react';
import { Bot } from 'lucide-react';

const GeekyBotAvatar = () => {
  return (
    <div className="relative">
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-geeky-dark pixel-borders animate-float overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-geeky-green via-geeky-blue to-geeky-purple"></div>
        <Bot className="h-7 w-7 text-geeky-green animate-pulse" />
      </div>
    </div>
  );
};

export default GeekyBotAvatar;
