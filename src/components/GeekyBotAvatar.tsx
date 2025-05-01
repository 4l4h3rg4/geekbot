
import React from 'react';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

type GeekyBotAvatarProps = {
  size?: 'sm' | 'md' | 'lg';
};

const GeekyBotAvatar = ({ size = 'md' }: GeekyBotAvatarProps) => {
  const dimensions = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-7 w-7',
    lg: 'h-9 w-9'
  };

  return (
    <div className="relative">
      <div className={cn(
        "flex items-center justify-center rounded-lg bg-geeky-dark pixel-borders animate-float overflow-hidden",
        dimensions[size]
      )}>
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-geeky-green via-geeky-blue to-geeky-purple"></div>
        <Bot className={cn("text-geeky-green animate-pulse", iconSizes[size])} />
      </div>
    </div>
  );
};

export default GeekyBotAvatar;
