
import React, { useState } from 'react';
import { Send, Joystick, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const ChatInput = ({ onSendMessage, isLoading = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== '' && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit}
      className="relative flex items-center gap-2 p-1 bg-muted/30 border border-geeky-purple/30 rounded-lg pixel-borders"
    >
      <button
        type="button"
        className={cn(
          "p-2 transition-colors",
          isLoading 
            ? "text-geeky-green/40" 
            : "text-geeky-green hover:text-geeky-cyan"
        )}
        disabled={isLoading}
      >
        <Joystick className="h-5 w-5" />
      </button>
      
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isLoading ? "Espera a que GeekyBot termine de responder..." : "> Type your message..."}
        className={cn(
          "bg-transparent w-full px-4 py-2 text-white placeholder:text-muted-foreground/50 font-mono focus:outline-none transition-opacity",
          isLoading && "opacity-50"
        )}
        disabled={isLoading}
      />
      
      <button
        type="button"
        className={cn(
          "p-2 transition-colors",
          isLoading 
            ? "text-geeky-magenta/40" 
            : "text-geeky-magenta hover:text-geeky-cyan"
        )}
        disabled={isLoading}
      >
        <Gamepad2 className="h-5 w-5" />
      </button>
      
      <button
        type="submit"
        disabled={!message.trim() || isLoading}
        className={cn(
          "p-2 rounded-md transition-all duration-300",
          message.trim() && !isLoading
            ? "text-geeky-cyan bg-geeky-cyan/10 hover:bg-geeky-cyan/20" 
            : "text-muted-foreground"
        )}
      >
        <Send className={cn("h-5 w-5", isLoading && "animate-pulse")} />
      </button>
    </form>
  );
};

export default ChatInput;
