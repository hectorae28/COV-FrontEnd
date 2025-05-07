"use client"

import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, Check, ChevronRight, Clock, Star, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

export function MessageList({
  messages,
  selectedMessageId,
  onSelectMessage,
  onToggleFavorite,
  onToggleImportant,
  onDeleteMessage,
  onRestoreMessage,
  onPermanentDelete,
  activeTab,
}) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  // Función para formatear la fecha
  const formatDate = (dateStr) => {
    const today = new Date()
    const messageDate = new Date(dateStr)
    // Si es hoy, mostrar solo la hora
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
    // Si es esta semana, mostrar el día
    const diffDays = Math.round((today - messageDate) / (1000 * 60 * 60 * 24))
    if (diffDays < 7) {
      return messageDate.toLocaleDateString([], { weekday: "short" })
    }
    // Si es este año, mostrar día y mes
    if (messageDate.getFullYear() === today.getFullYear()) {
      return messageDate.toLocaleDateString([], { day: "numeric", month: "short" })
    }
    // Si es otro año, mostrar día, mes y año
    return messageDate.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" })
  }

  // Función para obtener el último mensaje o respuesta
  const getLastMessageContent = (message) => {
    if (message.respuestas && message.respuestas.length > 0) {
      const lastReply = message.respuestas[message.respuestas.length - 1]
      return {
        content: lastReply.contenido,
        isReply: true,
        time: lastReply.hora,
      }
    }
    return {
      content: message.contenido,
      isReply: false,
      time: message.hora,
    }
  }

  // Determinar qué nombre mostrar (destinatario si el remitente es Administrador)
  const getDisplayName = (message) => {
    return message.remitente === "Administrador" ? message.destinatario : message.remitente
  }

  // Obtener la inicial para el avatar
  const getAvatarInitial = (message) => {
    const displayName = getDisplayName(message)
    return displayName.charAt(0)
  }

  return (
    <div
      className={`bg-white border-r overflow-hidden ${selectedMessageId && isMobile ? "hidden" : "flex"
        } flex-col w-full md:w-1/3 lg:w-2/5`}
    >
      <div className="overflow-y-auto flex-1">
        {messages.length > 0 ? (
          <div className="divide-y">
            <AnimatePresence initial={false}>
              {messages.map((message) => {
                const isSelected = message.id === selectedMessageId
                const lastMessage = getLastMessageContent(message)
                const formattedDate = formatDate(message.fecha)

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    transition={{ duration: 0.2 }}
                    className={`cursor-pointer hover:bg-gray-100 transition-colors ${isSelected ? "bg-purple-50" : message.leido ? "" : "bg-pink-50"
                      }`}
                    onClick={() => onSelectMessage(message)}
                  >
                    <div className="p-3">
                      <div className="flex items-start">
                        <div className="h-12 w-12 rounded-full bg-gray-300 text-[#41023B] flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0">
                          {getAvatarInitial(message)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <div className="font-medium truncate">{getDisplayName(message)}</div>
                            <div className="text-xs text-gray-500 whitespace-nowrap ml-2">{formattedDate}</div>
                          </div>

                          <div className="text-sm font-medium text-gray-900 truncate mt-1">{message.asunto}</div>

                          <div className="flex items-center mt-1">
                            {lastMessage.isReply && (
                              <div className="mr-1 text-[#D7008A]">
                                <Check className="h-3.5 w-3.5" />
                              </div>
                            )}
                            <div className="text-sm text-gray-600 truncate flex-1">
                              {lastMessage.isReply ? "Tú: " : ""}
                              {lastMessage.content}
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-1">
                            <div className="flex space-x-1">
                              {message.favorito && (
                                <span className="text-yellow-500">
                                  <Star className="h-4 w-4" />
                                </span>
                              )}
                              {message.importante && (
                                <span className="text-red-500">
                                  <AlertCircle className="h-4 w-4" />
                                </span>
                              )}
                              {!message.leido && (
                                <span className="bg-[#D7008A] text-white text-xs px-1.5 py-0.5 rounded-full">
                                  Nuevo
                                </span>
                              )}
                            </div>
                            <div className="flex items-center">
                              {activeTab === "eliminados" ? (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onRestoreMessage(message.id)
                                    }}
                                    className="text-gray-400 hover:text-[#D7008A] p-1"
                                    aria-label="Restaurar mensaje"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onPermanentDelete(message.id)
                                    }}
                                    className="text-gray-400 hover:text-red-500 p-1"
                                    aria-label="Eliminar permanentemente"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </>
                              ) : (
                                <ChevronRight className="h-5 w-5 text-gray-400 ml-1" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-gray-500 h-full py-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#D7008A]/20 to-[#41023B]/20 flex items-center justify-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D7008A] to-[#41023B] opacity-30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <p>No hay mensajes para mostrar</p>
          </div>
        )}
      </div>
    </div>
  )
}
