
import React, { useState } from 'react';
import { Send, Joystick, Gamepad2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, isLoading = false, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== '' && !isLoading && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const getPlaceholderText = () => {
    if (disabled) {
      return "Activa GeekyBot Plus para continuar...";
    }
    if (isLoading) {
      return "Espera a que GeekyBot termine de responder...";
    }
    return "> Type your message...";
  };
  
  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "relative flex items-center gap-2 p-1 bg-muted/30 border rounded-lg pixel-borders",
        disabled 
          ? "border-geeky-magenta/30" 
          : "border-geeky-purple/30"
      )}
    >
      <button
        type="button"
        className={cn(
          "p-2 transition-colors",
          isLoading || disabled
            ? "text-geeky-green/40" 
            : "text-geeky-green hover:text-geeky-cyan"
        )}
        disabled={isLoading || disabled}
      >
        {disabled ? <Lock className="h-5 w-5" /> : <Joystick className="h-5 w-5" />}
      </button>
      
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={getPlaceholderText()}
        className={cn(
          "bg-transparent w-full px-4 py-2 text-white placeholder:text-muted-foreground/50 font-mono focus:outline-none transition-opacity",
          (isLoading || disabled) && "opacity-50"
        )}
        disabled={isLoading || disabled}
      />
      
      <button
        type="button"
        className={cn(
          "p-2 transition-colors",
          isLoading || disabled
            ? "text-geeky-magenta/40" 
            : "text-geeky-magenta hover:text-geeky-cyan"
        )}
        disabled={isLoading || disabled}
      >
        <Gamepad2 className="h-5 w-5" />
      </button>
      
      <button
        type="submit"
        disabled={!message.trim() || isLoading || disabled}
        className={cn(
          "p-2 rounded-md transition-all duration-300",
          message.trim() && !isLoading && !disabled
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
