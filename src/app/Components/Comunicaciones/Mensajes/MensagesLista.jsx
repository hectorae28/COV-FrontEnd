"use client"

import { motion } from "framer-motion"
import { AlertCircle, Check, CheckCheck, ChevronRight, Reply, Star, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

export function MessageList({
  messages,
  selectedMessageId,
  onSelectMessage,
  onDeleteMessage,
  onRestoreMessage,
  onPermanentDelete,
  activeTab,
}) {
  const [isHovered, setIsHovered] = useState(false)
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

  useEffect(() => {
  }, [selectedMessageId, isMobile])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  // Función para obtener el último mensaje (original o respuesta)
  const getLastMessage = (message) => {
    if (message.respuestas && message.respuestas.length > 0) {
      const lastReply = message.respuestas[message.respuestas.length - 1]
      return {
        content: lastReply.contenido,
        isReply: true,
        time: lastReply.hora,
        date: lastReply.fecha,
      }
    }
    return {
      content: message.contenido,
      isReply: false,
      time: message.hora,
      date: message.fecha,
    }
  }

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

  return (
    <div
      className={`${selectedMessageId && !isMobile ? (isHovered ? "w-160" : "w-160") : "w-full mx-auto md:w-280"
        } bg-white md:border-r flex flex-col h-auto transition-all duration-300 ease-in-out shrink-0 ${selectedMessageId && isMobile ? "hidden" : "block"
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
        <h2 className="font-bold text-lg capitalize text-[#D7008A]">{activeTab}</h2>
        <span className="text-sm text-gray-500">
          {messages.length} mensaje{messages.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex-1 overflow-auto w-full">
        {messages.length > 0 ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="divide-y">
            {messages.map((message) => {
              const lastMessage = getLastMessage(message)
              const formattedDate = formatDate(lastMessage.date)
              return (
                <motion.div
                  key={message.id}
                  variants={itemVariants}
                  onClick={() => onSelectMessage(message)}
                  className={`cursor-pointer hover:bg-gray-100 transition-colors ${selectedMessageId === message.id ? "border-r-4 border-[#D7008A]" : ""
                    } ${!message.leido && !message.eliminado ? "bg-pink-50" : ""}`}
                >
                  <div className="p-3">
                    <div className="flex items-start">
                      <div className="h-12 w-12 rounded-full bg-gray-300 text-[#41023B] flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0">
                        {message.remitente.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <div className="font-medium truncate">{message.remitente}</div>
                          <div className="text-xs text-gray-500 whitespace-nowrap ml-2">{formattedDate}</div>
                        </div>
                        <div className="flex items-center mt-1">
                          {lastMessage.isReply && (
                            <div className="mr-1 text-[#D7008A]">
                              <CheckCheck className="h-3.5 w-3.5" />
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
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded-full">
                                <Star className="h-3 w-3 inline" />
                              </span>
                            )}
                            {message.importante && (
                              <span className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded-full">
                                <AlertCircle className="h-3 w-3 inline" />
                              </span>
                            )}
                            {!message.leido && !message.eliminado && (
                              <span className="bg-[#D7008A] text-white text-xs px-1.5 py-0.5 rounded-full">Nuevo</span>
                            )}
                          </div>
                          <div className="flex items-center">
                            {message.eliminado ? (
                              <>
                                <button
                                  className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onRestoreMessage(message.id, e)
                                  }}
                                  title="Restaurar mensaje"
                                >
                                  <Reply className="h-4 w-4" />
                                </button>
                                <button
                                  className="h-8 w-8 rounded-full flex items-center justify-center text-red-400 hover:bg-gray-100"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onPermanentDelete(message.id, e)
                                  }}
                                  title="Eliminar permanentemente"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDeleteMessage(message.id, e)
                                }}
                                title="Eliminar mensaje"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                            <ChevronRight className="h-5 w-5 text-gray-400 ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-gray-500 h-auto py-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#D7008A]/20 to-[#41023B]/20 flex items-center justify-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D7008A] to-[#41023B] opacity-30 flex items-center justify-center">
                <Check className="h-6 w-6 text-white" />
              </div>
            </div>
            <p>No hay mensajes para mostrar</p>
            {activeTab === "eliminados" && <p className="text-sm mt-2">Los mensajes permanecerán aquí por 30 días</p>}
          </div>
        )}
      </div>
    </div>
  )
}