
import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import GeekyBotAvatar from './GeekyBotAvatar';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchWelcomeMessage();
  }, []);

  const fetchWelcomeMessage = async () => {
    try {
      setIsLoading(true);
      // Asegurarse de obtener los datos más recientes con headers para evitar caché
      const { data, error } = await supabase
        .from('welcome_messages')
        .select('content')
        .eq('active', true)
        .single();

      if (error) throw error;
      
      if (data) {
        setMessages([
          {
            id: 'welcome',
            content: data.content,
            role: 'assistant'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching welcome message:', error);
      // Usar mensaje de bienvenida predeterminado si hay un error
      setMessages([
        {
          id: 'welcome',
          content: '¡Saludos, viajero del multiverso geek! Soy GeekyBot, tu guía definitivo en este vasto universo de cultura friki. ¿Sobre qué quieres hablar hoy?',
          role: 'assistant'
        }
      ]);
      toast.error('Error al cargar el mensaje de bienvenida');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Wait a bit and then add bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(content),
        role: 'assistant',
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateResponse = (message: string) => {
    // Simple response generation logic
    const normalizedMsg = message.toLowerCase();
    
    if (normalizedMsg.includes('hola') || normalizedMsg.includes('saludos') || normalizedMsg.includes('hey')) {
      return '¡Hola! ¿En qué universo geek quieres adentrarte hoy?';
    } else if (normalizedMsg.includes('videojuego') || normalizedMsg.includes('juego')) {
      return 'Los videojuegos son una de mis pasiones. Desde clásicos como Zelda y Mario hasta los últimos lanzamientos AAA o indies revolucionarios. ¿Hay algún género o título específico sobre el que quieras hablar?';
    } else if (normalizedMsg.includes('anime') || normalizedMsg.includes('manga')) {
      return 'Ah, un entusiasta del anime y el manga. ¡Excelente elección! Desde los shonen épicos hasta los slice of life más tranquilos, hay todo un mundo por descubrir. ¿Tienes algún favorito?';
    } else if (normalizedMsg.includes('marvel') || normalizedMsg.includes('dc') || normalizedMsg.includes('cómic') || normalizedMsg.includes('comic')) {
      return 'Los cómics son la base de muchos universos expandidos que disfrutamos hoy. Marvel, DC, independientes... todos tienen historias fascinantes. ¿Algún superhéroe o serie que te interese particularmente?';
    } else if (normalizedMsg.includes('star wars') || normalizedMsg.includes('trek') || normalizedMsg.includes('sci-fi')) {
      return 'La ciencia ficción nos permite explorar posibilidades infinitas en universos completamente diferentes al nuestro. Star Wars, Star Trek, Dune, Fundación... hay tantas historias épicas. ¿Quieres profundizar en alguna en particular?';
    } else if (normalizedMsg.includes('rol') || normalizedMsg.includes('d&d') || normalizedMsg.includes('dungeons')) {
      return 'Los juegos de rol son una forma magnífica de crear historias colaborativas. Desde el clásico D&D hasta sistemas más narrativos como Fate o Apocalypse World. ¿Juegas a alguno o te interesa comenzar?';
    } else {
      return 'Ese es un tema interesante dentro del universo geek. Podría hablarte durante horas sobre ello. ¿Hay algún aspecto específico que te gustaría explorar?';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-20">
            <div className="animate-pulse text-geeky-cyan">Cargando...</div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={{
                id: message.id,
                content: message.content,
                sender: message.role === 'user' ? 'user' : 'bot',
                timestamp: new Date()
              }}
              isBot={message.role === 'assistant'}
            />
          ))
        )}
        
        {isTyping && (
          <div className="flex items-center space-x-3 opacity-70 my-2">
            <div className="flex-shrink-0">
              <GeekyBotAvatar size="sm" />
            </div>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat input */}
      <div className="border-t border-geeky-purple/20 p-4">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatInterface;
