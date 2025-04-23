"use client";

import { useState, useRef, useEffect } from "react";
import { 
  MessageSquareText, 
  X, 
  Send, 
  Minimize2, 
  Paperclip 
} from "lucide-react";

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "¡Hola! ¿En qué puedo ayudarte hoy?", isUser: false, time: "10:30" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messageEndRef = useRef(null);
  
  // Auto-scroll al último mensaje
  useEffect(() => {
    if (messageEndRef.current && isOpen && !isMinimized) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Controlar el scroll de la página
  useEffect(() => {
    const handleScrollLock = () => {
      if (isOpen && !isMinimized) {
        // Prevenir scroll en el body cuando el chat está abierto
        document.body.style.overflow = 'hidden';
        // En iOS también puede ser necesario:
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      } else {
        // Restaurar el scroll cuando el chat está cerrado o minimizado
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
    };

    handleScrollLock();
    
    // Limpiar los estilos cuando el componente se desmonte
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen, isMinimized]);

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const minimizeChat = (e) => {
    e.stopPropagation();
    setIsMinimized(true);
  };

  const closeChat = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    // Agregar mensaje del usuario
    const userMsg = {
      id: messages.length + 1,
      text: newMessage,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, userMsg]);
    setNewMessage("");
    
    // Simular respuesta (puedes reemplazar esto con tu lógica real)
    setTimeout(() => {
      const botMsg = {
        id: messages.length + 2,
        text: "Gracias por tu mensaje. ¿En qué más puedo ayudarte?",
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prevMessages => [...prevMessages, botMsg]);
    }, 1000);
  };

  // Prevenir la propagación de eventos al contenedor principal
  const handleChatContainerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Overlay para dispositivos móviles */}
      {isOpen && !isMinimized && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={closeChat}
          aria-hidden="true"
        />
      )}
      
      <div className="fixed bottom-3 md:bottom-5 right-2 md:right-4 z-50 font-sans cursor-default">
        {/* Botón flotante */}
        {!isOpen && (
          <button
            onClick={toggleChat}
            className="
              flex items-center justify-center
              w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full shadow-lg
              bg-gradient-to-b from-[#41023B] to-[#D7008A]
              cursor-pointer transition-all duration-300 hover:shadow-xl
            "
            aria-label="Abrir chat"
          >
            <MessageSquareText className="text-white" size={28} />
            <span className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 bg-red-500 rounded-full border border-white" />
          </button>
        )}

        {/* Modal de Chat */}
        {isOpen && (
          <div 
            onClick={handleChatContainerClick}
            className={`
              relative overflow-hidden
              transition-all duration-300 ease-out
              ${isMinimized ? 'h-16 w-38 sm:w-40 md:w-44' : 'h-[85vh] max-h-[540px] sm:max-h-[540px] md:max-h-[540px] w-[90vw] max-w-full sm:max-w-full md:max-w-[380px]'}
              bg-white rounded-xl shadow-xl border-0
            `}
          >
            {/* Gradiente de fondo */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-500/5" />
            
            {/* Cabecera */}
            <div 
              onClick={isMinimized ? toggleChat : undefined}
              className={`
                relative flex items-center justify-between
                bg-gradient-to-b from-[#41023B] to-[#D7008A] text-white
                py-3 px-4 ${isMinimized ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              {/* Contenido de la cabecera */}
              <div className={`flex items-center ${isMinimized ? 'justify-center flex-1' : ''}`}>
                {/* Logo imagen */}
                <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center mr-3">
                  <img 
                    src="/assets/escudo.png" 
                    alt="Logo" 
                    className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                  />
                </div>
                <h3 className={`font-medium text-white text-sm sm:text-base mr-2 ${isMinimized ? '' : 'mr-4'}`}>Mensajes</h3>
              </div>

              {/* Botones en la cabecera mejorados */}
              <div className="flex items-center space-x-3">
                {!isMinimized && (
                  <button 
                    onClick={minimizeChat}
                    className="text-white hover:text-gray-200 focus:outline-none flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 cursor-pointer"
                    aria-label="Minimizar chat"
                  >
                    <Minimize2 size={20} />
                  </button>
                )}
                <button 
                  onClick={closeChat}
                  className="text-white hover:text-gray-200 focus:outline-none flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 cursor-pointer"
                  aria-label="Cerrar chat"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Cuerpo del Chat */}
                <div className="h-[calc(100%-110px)] overflow-y-auto p-3 sm:p-4 bg-gray-50">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`mb-3 sm:mb-4 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!msg.isUser && (
                        <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center mr-2">
                          <img 
                            src="/assets/escudo.png" 
                            alt="Logo" 
                            className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                          />
                        </div>
                      )}
                      <div 
                        className={`
                          relative max-w-[85%] px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-sm
                          ${msg.isUser 
                            ? 'bg-gradient-to-b from-white to-white text-black' 
                            : 'bg-white text-black border border-gray-100'
                          }
                        `}
                      >
                        <p className="text-sm sm:text-base">{msg.text}</p>
                        <span className={`text-xs sm:text-sm block mt-1 ${msg.isUser ? 'text-gray-600' : 'text-gray-600'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </div>
                
                {/* Input para enviar mensajes mejorado */}
                <form onSubmit={handleSendMessage} className="border-t border-gray-100 p-3 bg-white absolute bottom-0 w-full">
                  <div className="flex items-center space-x-2">
                    <button 
                      type="button" 
                      className="text-gray-400 hover:text-purple-500 p-2 rounded-full hover:bg-gray-100 focus:outline-none cursor-pointer" 
                      aria-label="Adjuntar archivo"
                    >
                      <Paperclip size={20} />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe tu mensaje ..."
                      className="flex-1 border rounded-full bg-gray-50 px-4 py-2 focus:outline-none text-sm"
                    />
                    <button 
                      type="submit"
                      className="
                        flex items-center justify-center
                        w-10 h-10 rounded-full 
                        bg-gradient-to-b from-[#41023B] to-[#D7008A] text-white
                        focus:outline-none cursor-pointer hover:shadow-md
                      "
                      aria-label="Enviar mensaje"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}