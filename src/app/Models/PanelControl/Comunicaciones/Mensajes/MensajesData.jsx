"use client"

import { useState } from "react"

const initialMessages = [
  {
    id: "1",
    remitente: "Juan Pérez",
    asunto: "Reunión de proyecto",
    contenido: "Hola, ¿podemos agendar una reunión para discutir el avance del proyecto?",
    fecha: "2023-05-15",
    hora: "10:30",
    leido: true,
    favorito: false,
    importante: true,
    archivado: false,
    eliminado: false,
    respuestas: [
      {
        id: "1-1",
        contenido: "Claro, ¿te parece bien mañana a las 3pm?",
        fecha: "2023-05-15",
        hora: "11:45",
        status: "read",
      },
      {
        id: "1-2",
        contenido: "Perfecto, nos vemos en la sala de conferencias.",
        fecha: "2023-05-15",
        hora: "12:20",
        status: "delivered",
      },
    ],
  },
  {
    id: "2",
    remitente: "María González",
    asunto: "Documentación pendiente",
    contenido: "Necesito que me envíes la documentación del cliente para proceder con la facturación.",
    fecha: "2023-05-14",
    hora: "15:20",
    leido: false,
    favorito: true,
    importante: false,
    archivado: false,
    eliminado: false,
    respuestas: [],
  },
  {
    id: "3",
    remitente: "Carlos Rodríguez",
    asunto: "Presupuesto actualizado",
    contenido: "Te adjunto el presupuesto actualizado con los cambios que solicitaste.",
    fecha: "2023-05-13",
    hora: "09:15",
    leido: true,
    favorito: false,
    importante: false,
    archivado: true,
    eliminado: false,
    respuestas: [
      {
        id: "3-1",
        contenido: "Gracias, lo revisaré y te comento.",
        fecha: "2023-05-13",
        hora: "10:30",
        status: "read",
      },
    ],
  },
  {
    id: "4",
    remitente: "Ana Martínez",
    asunto: "Consulta sobre producto",
    contenido: "Tengo una consulta sobre el producto que adquirí recientemente. ¿Podrías ayudarme?",
    fecha: "2023-05-12",
    hora: "14:45",
    leido: true,
    favorito: false,
    importante: false,
    archivado: false,
    eliminado: true,
    respuestas: [],
  },
  {
    id: "5",
    remitente: "Luis Sánchez",
    asunto: "Invitación a evento",
    contenido: "Te invito al lanzamiento de nuestro nuevo producto el próximo viernes a las 7pm.",
    fecha: new Date().toISOString().split("T")[0],
    hora: "08:30",
    leido: false,
    favorito: false,
    importante: true,
    archivado: false,
    eliminado: false,
    respuestas: [],
  },
]

export function useMessages(activeTab, searchQuery) {
  const [messages, setMessages] = useState(initialMessages)
  const [selectedMessage, setSelectedMessage] = useState(null)

  // Calcular contadores correctamente
  const messageCounts = {
    recibidos: messages.filter(m => !m.eliminado && !m.archivado).length,
    favoritos: messages.filter(m => m.favorito && !m.eliminado).length,
    importantes: messages.filter(m => m.importante && !m.eliminado).length,
    archivados: messages.filter(m => m.archivado && !m.eliminado).length,
    eliminados: messages.filter(m => m.eliminado).length,
  }

  // Filtrar mensajes según la pestaña activa
  const filteredMessages = messages
    .filter((message) => {
      // Filtrar por pestaña
      switch (activeTab) {
        case "recibidos":
          return !message.eliminado && !message.archivado
        case "favoritos":
          return message.favorito && !message.eliminado
        case "importantes":
          return message.importante && !message.eliminado
        case "archivados":
          return message.archivado && !message.eliminado
        case "eliminados":
          return message.eliminado
        default:
          return !message.eliminado && !message.archivado
      }
    })
    .filter((message) => {
      // Filtrar por búsqueda
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        message.remitente.toLowerCase().includes(query) ||
        message.asunto.toLowerCase().includes(query) ||
        message.contenido.toLowerCase().includes(query) ||
        message.respuestas?.some((resp) => resp.contenido.toLowerCase().includes(query))
      )
    })

  // Marcar mensaje como leído
  const markMessageAsRead = (messageId) => {
    setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === messageId ? { ...msg, leido: true } : msg)))
  }

  // Alternar favorito
  const handleToggleFavorite = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.id === messageId ? { ...msg, favorito: !msg.favorito } : msg)),
    )
  }

  // Alternar importante
  const handleToggleImportant = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.id === messageId ? { ...msg, importante: !msg.importante } : msg)),
    )
  }

  // Eliminar mensaje
  const handleDeleteMessage = (messageId) => {
    setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === messageId ? { ...msg, eliminado: true } : msg)))
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage(null)
    }
  }

  // Restaurar mensaje
  const handleRestoreMessage = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.id === messageId ? { ...msg, eliminado: false } : msg)),
    )
  }

  // Eliminar permanentemente
  const handlePermanentDelete = (messageId) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId))
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage(null)
    }
  }

  // Enviar respuesta - Corregido para actualizar el mensaje seleccionado
  const handleSendReply = (messageId, content, attachment = null) => {
    if (!content.trim() && !attachment) return
    // Crear nueva respuesta
    const newReply = {
      id: `${messageId}-${Date.now()}`,
      contenido: attachment
        ? `${content} ${attachment.type === "image" ? "[Imagen]" : "[Archivo: " + attachment.name + "]"}`
        : content,
      fecha: new Date().toISOString().split("T")[0],
      hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sending",
    }
    // Actualizar mensajes y mensaje seleccionado
    const updatedMessages = messages.map((msg) => {
      if (msg.id === messageId) {
        const updatedMsg = {
          ...msg,
          respuestas: [...(msg.respuestas || []), newReply],
        }
        // Actualizar también el mensaje seleccionado
        if (selectedMessage && selectedMessage.id === messageId) {
          setSelectedMessage(updatedMsg)
        }
        return updatedMsg
      }
      return msg
    })
    setMessages(updatedMessages)
    // Simular cambio de estado a enviado
    setTimeout(() => {
      const updatedWithSent = messages.map((msg) => {
        if (msg.id === messageId) {
          const updatedMsg = {
            ...msg,
            respuestas: msg.respuestas.map((reply) => {
              if (reply.id === newReply.id) {
                return { ...reply, status: "sent" }
              }
              return reply
            }),
          }
          // Actualizar también el mensaje seleccionado
          if (selectedMessage && selectedMessage.id === messageId) {
            setSelectedMessage(updatedMsg)
          }
          return updatedMsg
        }
        return msg
      })
      setMessages(updatedWithSent)
    }, 500)
    // Simular cambio de estado a entregado
    setTimeout(() => {
      const updatedWithDelivered = messages.map((msg) => {
        if (msg.id === messageId) {
          const updatedMsg = {
            ...msg,
            respuestas: msg.respuestas.map((reply) => {
              if (reply.id === newReply.id) {
                return { ...reply, status: "delivered" }
              }
              return reply
            }),
          }
          // Actualizar también el mensaje seleccionado
          if (selectedMessage && selectedMessage.id === messageId) {
            setSelectedMessage(updatedMsg)
          }
          return updatedMsg
        }
        return msg
      })
      setMessages(updatedWithDelivered)
    }, 1500)
    // Simular cambio de estado a leído
    setTimeout(() => {
      const updatedWithRead = messages.map((msg) => {
        if (msg.id === messageId) {
          const updatedMsg = {
            ...msg,
            respuestas: msg.respuestas.map((reply) => {
              if (reply.id === newReply.id) {
                return { ...reply, status: "read" }
              }
              return reply
            }),
          }
          // Actualizar también el mensaje seleccionado
          if (selectedMessage && selectedMessage.id === messageId) {
            setSelectedMessage(updatedMsg)
          }
          return updatedMsg
        }
        return msg
      })
      setMessages(updatedWithRead)
    }, 3000)
  }

  // Enviar nuevo mensaje
  const handleSendNewMessage = (messageData) => {
    const newMessage = {
      id: Date.now().toString(),
      remitente: messageData.destinatario,
      asunto: messageData.asunto,
      contenido: messageData.contenido,
      fecha: new Date().toISOString().split("T")[0],
      hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      leido: false,
      favorito: false,
      importante: false,
      archivado: false,
      eliminado: false,
      respuestas: [],
    }
    setMessages((prevMessages) => [newMessage, ...prevMessages])
  }

  return {
    messages,
    selectedMessage,
    setSelectedMessage,
    filteredMessages,
    handleToggleFavorite,
    handleToggleImportant,
    allMessages: messages,
    messageCounts,
    handleDeleteMessage,
    handleRestoreMessage,
    handlePermanentDelete,
    handleSendReply,
    handleSendNewMessage,
    markMessageAsRead,
  }
}