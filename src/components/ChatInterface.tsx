
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Cpu, Database, Rocket, Code, Gamepad, Lock } from 'lucide-react';
import { toast } from 'sonner';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getWelcomeMessage } from '@/businessLogic/services/welcomeMessageService';
import { getActiveAds } from '@/businessLogic/services/adService';
import AdBanner from './AdBanner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const MAX_FREE_MESSAGES = 5;
const PAYMENT_LINK = "https://www.paypal.com/ncp/payment/ZZBBENPTUT26N";

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [activeAds, setActiveAds] = useState([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const webhookUrl = "https://n8n.zonenter.blog/webhook/b09398a5-b7ea-4829-a5e9-88a069a00536";
  const defaultWelcomeMessage = "¡Saludos, viajero del multiverso geek! Soy GeekyBot, tu guía definitivo en este vasto universo de cultura friki. Tienes 5 mensajes gratuitos para explorar este universo de conocimiento. Después de eso, necesitarás una suscripción para continuar nuestra aventura. ¿Sobre qué quieres hablar hoy? ¿Videojuegos? ¿Anime? ¿Cómics? ¿Películas de ciencia ficción?";

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Cargar datos iniciales
        const [welcomeMessageData, adsData] = await Promise.all([
          getWelcomeMessage(),
          getActiveAds()
        ]);
        
        console.log("Mensaje de bienvenida cargado:", welcomeMessageData);
        
        // Agregar el mensaje de bienvenida al chat
        setMessages([
          {
            id: '1',
            content: welcomeMessageData.contenido || defaultWelcomeMessage,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        
        setActiveAds(adsData);
      } catch (error) {
        console.error('Error loading initial data:', error);
        // Fallback al mensaje predeterminado si hay un error
        setMessages([
          {
            id: '1',
            content: defaultWelcomeMessage,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      }
    };
    
    loadInitialData();
    
    // Recuperar el contador de mensajes y estado premium del localStorage
    const savedMessageCount = localStorage.getItem('geekybot_message_count');
    if (savedMessageCount) {
      setUserMessageCount(parseInt(savedMessageCount, 10));
    }
    
    const savedPremiumStatus = localStorage.getItem('geekybot_premium');
    if (savedPremiumStatus === 'true') {
      setIsPremium(true);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    if (userMessageCount >= MAX_FREE_MESSAGES && !isPremium) {
      const paymentMessage: Message = {
        id: Date.now().toString(),
        content: `¡Has alcanzado tu límite de mensajes gratuitos!\nPara continuar tu travesía geek con acceso ilimitado a GeekyBot, necesitas suscribirte a GeekyBot Plus.\nHaz clic aquí para completar el pago y desbloquear acceso ilimitado:\n👉 [Pagar con PayPal](${PAYMENT_LINK})`,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, paymentMessage]);
      
      toast("Límite alcanzado", {
        description: "Has alcanzado el límite de mensajes gratuitos",
        icon: <Lock className="h-4 w-4 text-geeky-purple" />,
      });
      
      return;
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    if (!isPremium) {
      const newCount = userMessageCount + 1;
      setUserMessageCount(newCount);
      localStorage.setItem('geekybot_message_count', newCount.toString());
    }
    
    try {
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
      
      const data = await response.json();
      console.log("Response from n8n:", data);
      
      if (!localStorage.getItem('geekybot_session_id')) {
        localStorage.setItem('geekybot_session_id', Date.now().toString());
      }
      
      const botResponse = data.output || data.botResponse || data.message || "¡Vaya! Parece que mis circuitos están un poco confundidos. ¿Puedes intentar reformular tu pregunta?";
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      toast("Nuevo mensaje de GeekyBot", {
        description: "GeekyBot ha respondido a tu mensaje",
        icon: <Bot className="h-4 w-4 text-geeky-green" />,
      });
      
    } catch (error) {
      console.error("Error al conectar con n8n:", error);
      
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
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePremiumActivation = () => {
    setIsPremium(true);
    localStorage.setItem('geekybot_premium', 'true');
    
    const premiumMessage: Message = {
      id: Date.now().toString(),
      content: "¡Enhorabuena! Has activado GeekyBot Plus. Ahora tienes acceso ilimitado a todas mis funciones. ¡Sigamos explorando el universo geek juntos!",
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, premiumMessage]);
    
    toast("Premium activado", {
      description: "¡Ahora tienes acceso ilimitado a GeekyBot!",
      icon: <Rocket className="h-4 w-4 text-geeky-cyan" />,
    });
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
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
        
        <div className="flex items-center gap-2">
          {!isPremium && (
            <div className="px-3 py-1 bg-muted/30 rounded-lg border border-geeky-cyan/30">
              <p className="text-xs font-mono text-geeky-cyan">
                <span className="font-bold">{userMessageCount}</span>/{MAX_FREE_MESSAGES} mensajes
              </p>
            </div>
          )}
          
          {isPremium && (
            <div className="px-3 py-1 bg-muted/30 rounded-lg border border-geeky-magenta/30">
              <p className="text-xs font-mono text-geeky-magenta flex items-center gap-1">
                <Rocket className="h-3 w-3" />
                <span>Premium</span>
              </p>
            </div>
          )}
          
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
      </div>
      
      <div className="flex flex-1 overflow-hidden">
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
            
            {userMessageCount >= MAX_FREE_MESSAGES && !isPremium && (
              <Alert className="bg-geeky-purple/20 border border-geeky-magenta/50 text-white">
                <AlertDescription className="space-y-4">
                  <p className="font-mono text-sm">
                    Para continuar usando GeekyBot, necesitas activar GeekyBot Plus.
                  </p>
                  <div className="flex justify-center">
                    <a 
                      href={PAYMENT_LINK} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-4 py-2 bg-geeky-magenta/70 hover:bg-geeky-magenta text-white rounded-md font-pixel text-sm flex items-center gap-2 transition-colors"
                    >
                      <Rocket className="h-4 w-4" />
                      Activar GeekyBot Plus
                    </a>
                  </div>
                  
                  <div className="text-center mt-2">
                    <button 
                      onClick={handlePremiumActivation}
                      className="text-[10px] text-geeky-cyan/50 hover:text-geeky-cyan underline"
                    >
                      (Demo: Simular activación)
                    </button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {activeAds.length > 0 && (
          <div className="w-64 p-4 overflow-y-auto border-l border-geeky-purple/30 bg-geeky-dark/50">
            <h3 className="font-pixel text-geeky-cyan text-sm mb-4">Anuncios</h3>
            <div className="space-y-4">
              {activeAds.map(ad => (
                <AdBanner key={ad.id} ad={ad} />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-geeky-dark/80">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          disabled={userMessageCount >= MAX_FREE_MESSAGES && !isPremium}
        />
        <div className="mt-2 text-[10px] font-mono text-geeky-purple/50 text-center">
          Sistema de comunicación interdimensional // Protocolo Geek v1.0 // Error rate: 0.01%
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
