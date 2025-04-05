
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import GeekyBotAvatar from './GeekyBotAvatar';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  };
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const [isTyping, setIsTyping] = useState(message.sender === 'bot');
  const [displayedContent, setDisplayedContent] = useState('');
  const isBot = message.sender === 'bot';
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isBot) {
      // Add typing animation for bot messages - increased typing speed
      let currentIndex = 0;
      
      const typeNextChar = () => {
        if (currentIndex < message.content.length) {
          setDisplayedContent(message.content.slice(0, currentIndex + 1));
          currentIndex++;
          // Reduced delay between characters for faster typing (was 20-70ms, now 10-30ms)
          timeout = setTimeout(typeNextChar, Math.random() * 20 + 10);
        } else {
          setIsTyping(false);
        }
      };
      
      // Reduced initial delay before typing starts (was 500ms, now 200ms)
      timeout = setTimeout(typeNextChar, 200);
    } else {
      setDisplayedContent(message.content);
      setIsTyping(false);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [message.content, isBot]);
  
  return (
    <div className={cn(
      "flex items-start gap-3 py-2 transition-all duration-300 group",
      isBot ? "animate-glitch" : ""
    )}>
      {isBot && <GeekyBotAvatar />}
      
      <div className={cn(
        "px-4 py-3 rounded-lg max-w-[80%]",
        isBot 
          ? "bg-muted/30 border border-geeky-purple/30 text-white ml-0" 
          : "bg-geeky-purple/20 border border-geeky-cyan/30 text-geeky-cyan/90 ml-auto"
      )}>
        <div className={cn(
          "font-mono text-sm leading-relaxed",
          isBot && isTyping ? "after:content-['|'] after:ml-0.5 after:animate-cursor-blink" : ""
        )}>
          {displayedContent}
        </div>
        <div className={cn(
          "text-[10px] font-pixel mt-2 opacity-50",
          isBot ? "text-geeky-green" : "text-geeky-cyan"
        )}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {!isBot && (
        <div className="w-10 h-10 rounded-full bg-geeky-cyan/20 border border-geeky-cyan/30 flex items-center justify-center text-geeky-cyan">
          <span className="font-mono text-xs">YOU</span>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
