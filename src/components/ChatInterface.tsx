
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Cpu, Database, Rocket, Code, Gamepad } from 'lucide-react';
import { toast } from 'sonner';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const webhookUrl = "https://n8n.zonenter.blog/webhook-test/b09398a5-b7ea-4829-a5e9-88a069a00536";
  const welcomeMessage = "¡Saludos, viajero del multiverso geek! Soy GeekyBot, tu guía definitivo en este vasto universo de cultura friki. ¿Sobre qué quieres hablar hoy? ¿Videojuegos? ¿Anime? ¿Cómics? ¿Películas de ciencia ficción? ¡Estoy aquí para compartir conocimiento y diversión!";
  
  useEffect(() => {
    // Add welcome message on component mount
    setTimeout(() => {
      setMessages([
        {
          id: '1',
          content: welcomeMessage,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }, 1000);
  }, []);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Send message to n8n webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage: content,
          timestamp: new Date().toISOString(),
          sessionId: localStorage.getItem('geekybot_session_id') || Date.now().toString()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Get response from n8n
      const data = await response.json();
      
      // Save session ID if it doesn't exist
      if (!localStorage.getItem('geekybot_session_id')) {
        localStorage.setItem('geekybot_session_id', Date.now().toString());
      }
      
      // Add bot response to chat
      const botMessage: Message = {
        id: Date.now().toString(),
        // Use the response from n8n or fallback to a default message
        content: data.botResponse || "¡Vaya! Parece que mis circuitos están un poco confundidos. ¿Puedes intentar reformular tu pregunta?",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Show a toast notification
      toast("Nuevo mensaje de GeekyBot", {
        description: "GeekyBot ha respondido a tu mensaje",
        icon: <Bot className="h-4 w-4 text-geeky-green" />,
      });
      
    } catch (error) {
      console.error("Error al conectar con n8n:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "¡Ops! Parece que hay un problema en la matriz. No pude conectarme con mi base de conocimiento. ¿Podrías intentar de nuevo en un momento?",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast("Error de conexión", {
        description: "No se pudo conectar con n8n",
        icon: <Bot className="h-4 w-4 text-red-500" />,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-geeky-purple/30 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-geeky-dark flex items-center justify-center pixel-borders">
            <Bot className="h-6 w-6 text-geeky-green" />
          </div>
          <div>
            <h1 className="font-pixel text-geeky-green text-sm glow-text">
              GeekyBot <span className="text-xs text-geeky-cyan/50">v1.0</span>
            </h1>
            <p className="text-[10px] font-mono text-geeky-purple/70">
              Tu guía definitiva del multiverso geek
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {[Cpu, Database, Rocket, Code, Gamepad].map((Icon, i) => (
            <button 
              key={i} 
              className="h-8 w-8 rounded-md bg-muted/30 flex items-center justify-center hover:bg-geeky-purple/20 transition-colors"
            >
              <Icon 
                className="h-4 w-4" 
                style={{ color: [
                  '#39FF14', '#9B30FF', '#00FFFF', '#FF00FF', '#1E90FF'
                ][i] }} 
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 noise-bg">
        <div className="space-y-4">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-geeky-green font-mono text-sm">
              <div className="animate-pulse h-2 w-2 rounded-full bg-geeky-green"></div>
              <div className="animate-pulse h-2 w-2 rounded-full bg-geeky-green" style={{ animationDelay: "0.2s" }}></div>
              <div className="animate-pulse h-2 w-2 rounded-full bg-geeky-green" style={{ animationDelay: "0.4s" }}></div>
              <span className="text-xs ml-2">GeekyBot está pensando...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="p-4 bg-geeky-dark/80">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        <div className="mt-2 text-[10px] font-mono text-geeky-purple/50 text-center">
          Sistema de comunicación interdimensional // Protocolo Geek v1.0 // Error rate: 0.01%
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
