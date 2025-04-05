
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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
  
  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    
    // Simulate response from the external AI
    simulateBotResponse(content);
  };
  
  const simulateBotResponse = (userMessage: string) => {
    // In a real implementation, this would call the external AI service
    // For now, we'll just simulate a response
    setTimeout(() => {
      const botResponses = [
        "¡Eso suena fascinante! Como fan de la cultura geek, puedo decirte que hay múltiples universos que exploran ese concepto.",
        "Según mis circuitos de conocimiento gaming, ese juego es considerado un clásico de culto. ¡Excelente gusto!",
        "En el multiverso del anime, ese personaje tiene varias versiones. Mi favorita es la del universo alternativo del manga.",
        "¡Por las barbas de Gandalf! Esa es una referencia oscura pero increíble. Solo verdaderos conocedores como tú la mencionarían.",
        "Mis sensores detectan que eres alguien de cultura. Ese tema es fascinante tanto en los cómics como en su adaptación cinematográfica.",
        "¡Santo píxel! Esa saga de videojuegos marcó una generación completa de jugadores. ¿Has probado la remasterización?"
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(messages => [...messages, botMessage]);
      
      // Show a toast notification
      toast("Nuevo mensaje de GeekyBot", {
        description: "GeekyBot ha respondido a tu mensaje",
        icon: <Bot className="h-4 w-4 text-geeky-green" />,
      });
    }, 1500);
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
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="p-4 bg-geeky-dark/80">
        <ChatInput onSendMessage={handleSendMessage} />
        <div className="mt-2 text-[10px] font-mono text-geeky-purple/50 text-center">
          Sistema de comunicación interdimensional // Protocolo Geek v1.0 // Error rate: 0.01%
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
