"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, MinusCircle, Paperclip, Send, X } from "lucide-react"
import { useEffect, useState } from "react"

export function ComposeModal({ onClose, onSendMessage }) {
  const [message, setMessage] = useState({
    destinatario: "",
    asunto: "",
    contenido: "",
  })
  const [attachments, setAttachments] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Simula la adición de archivos adjuntos
  const handleAddAttachment = () => {
    // En una implementación real, esto abrirá un selector de archivos
    const mockAttachment = {
      id: Date.now(),
      name: `Documento-${Math.floor(Math.random() * 1000)}.pdf`,
      size: `${Math.floor(Math.random() * 5) + 1} MB`
    }
    
    setAttachments([...attachments, mockAttachment])
  }
  
  const handleRemoveAttachment = (id) => {
    setAttachments(attachments.filter(att => att.id !== id))
  }

  const handleSend = () => {
    if (!message.destinatario || !message.asunto || !message.contenido) return
    onSendMessage({...message, attachments})
    onClose()
  }
  
  const mobileVariants = {
    hidden: { y: "100%", opacity: 1 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 1 }
  }
  
  const desktopVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50 p-0 md:p-4 mx-auto my-auto"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={isMobile ? mobileVariants : desktopVariants}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`bg-white shadow-lg w-full md:rounded-lg md:max-w-2xl max-h-[98vh] md:max-h-[90vh] flex flex-col overflow-hidden ${
            isMobile ? "rounded-t-xl h-[90vh]" : ""
          }`}
        >
          {/* Encabezado */}
          <div className="flex justify-between items-center p-3 md:p-4 border-b bg-gradient-to-l from-[#D7008A] to-[#41023B]">
            {isMobile ? (
              <div className="flex items-center">
                <button
                  onClick={onClose}
                  className="h-10 w-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="text-lg font-bold text-white ml-2">Nuevo Mensaje</h2>
              </div>
            ) : (
              <h2 className="text-xl font-bold text-white">Nuevo Mensaje</h2>
            )}
            
            {!isMobile && (
              <button
                onClick={onClose}
                className="h-10 w-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Cerrar</span>
              </button>
            )}
          </div>

          {/* Contenido del formulario */}
          <div className="overflow-y-auto p-3 md:p-4 flex-1">
            <div className="space-y-4">
              {isMobile && (
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-2" />
              )}
              
              <div className="space-y-2">
                <label htmlFor="destinatario" className="block text-sm font-medium text-gray-700">
                  Destinatario
                </label>
                <input
                  id="destinatario"
                  value={message.destinatario}
                  onChange={(e) => setMessage({ ...message, destinatario: e.target.value })}
                  placeholder="Nombre del destinatario"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#D7008A] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="asunto" className="block text-sm font-medium text-gray-700">
                  Asunto
                </label>
                <input
                  id="asunto"
                  value={message.asunto}
                  onChange={(e) => setMessage({ ...message, asunto: e.target.value })}
                  placeholder="Asunto del mensaje"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#D7008A] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contenido" className="block text-sm font-medium text-gray-700">
                  Mensaje
                </label>
                <textarea
                  id="contenido"
                  value={message.contenido}
                  onChange={(e) => setMessage({ ...message, contenido: e.target.value })}
                  placeholder="Escribe tu mensaje aquí..."
                  className="w-full p-2 border rounded-md resize-none focus:ring-2 focus:ring-[#D7008A] focus:outline-none"
                  rows={isMobile ? 8 : 12}
                />
              </div>
              
              {/* Sección de archivos adjuntos */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Archivos adjuntos
                  </label>
                  <div className="space-y-2">
                    {attachments.map(att => (
                      <div key={att.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                        <div className="flex items-center">
                          <Paperclip className="h-4 w-4 text-gray-400 " />
                          <span className="text-sm">{att.name}</span>
                          <span className="text-xs text-gray-500 ml-2">({att.size})</span>
                        </div>
                        <button 
                          onClick={() => handleRemoveAttachment(att.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <MinusCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Barra de acciones */}
          <div className="border-t p-3 md:p-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <button
                onClick={handleAddAttachment}
                className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Paperclip className="h-4 w-4" />
                <span className="text-sm hidden xs:inline">Adjuntar</span>
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSend}
                  className={`flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white ${
                    !message.destinatario || !message.asunto || !message.contenido
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:opacity-90"
                  }`}
                  disabled={!message.destinatario || !message.asunto || !message.contenido}
                >
                  <Send className="mr-2 h-4 w-4" />
                  <span className="hidden xs:inline">Enviar</span>
                  <span className="inline xs:hidden">Enviar</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}