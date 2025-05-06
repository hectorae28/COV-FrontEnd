"use client"

import { useState, useEffect } from "react"

// Datos de ejemplo para mensajes
const mensajesIniciales = [
  {
    id: "1",
    remitente: "Juan Pérez",
    destinatario: "Administrador",
    asunto: "Solicitud de Constancia de Colegiatura",
    contenido:
      "Estimado administrador, necesito una constancia de colegiatura para presentarla en mi nuevo trabajo. ¿Podría indicarme el procedimiento para solicitarla?",
    fecha: "2023-05-15",
    hora: "09:30",
    leido: true,
    favorito: false,
    importante: true,
    eliminado: false,
    respuestas: [
      {
        id: "1-1",
        contenido:
          "Claro, para solicitar una constancia debe completar el formulario en la sección de solicitudes y realizar el pago correspondiente. En 24-48 horas estará disponible.",
        fecha: "2023-05-15",
        hora: "11:45",
        status: "read",
      },
    ],
    colegiadoId: "101",
  },
  {
    id: "2",
    remitente: "María Rodríguez",
    destinatario: "Administrador",
    asunto: "Renovación de Carnet",
    contenido:
      "Buenas tardes, mi carnet está por vencer el próximo mes. ¿Cuál es el proceso para renovarlo? Gracias de antemano.",
    fecha: "2023-05-14",
    hora: "15:20",
    leido: false,
    favorito: true,
    importante: false,
    eliminado: false,
    respuestas: [],
    colegiadoId: "102",
  },
  {
    id: "3",
    remitente: "Carlos Gómez",
    destinatario: "Administrador",
    asunto: "Pago de Cuotas",
    contenido:
      "Hola, quisiera saber si puedo pagar las cuotas pendientes en línea o debo acercarme a las oficinas del colegio.",
    fecha: "2023-05-13",
    hora: "10:05",
    leido: true,
    favorito: false,
    importante: false,
    eliminado: true,
    respuestas: [],
    colegiadoId: "103",
  },
]

// Asuntos predefinidos para mensajes
export const asuntosPredefinidos = [
  "Solicitud de Inscripción",
  "Solicitud de Constancia de Colegiatura",
  "Solicitud de Solvencia",
  "Solicitud de Certificación Profesional",
  "Renovación de Carnet",
  "Cambio de Residencia",
  "Trámite de Jubilación",
  "Consulta Deontológica",
  "Denuncia Ética",
  "Eventos y Formación Continua",
  "Pago de Cuotas",
  "Otro",
]

// Crear un almacén compartido para los mensajes
let mensajesStore = [...mensajesIniciales]
let listeners = []

// Función para notificar a todos los listeners cuando hay cambios
const notifyListeners = () => {
  listeners.forEach((listener) => listener(mensajesStore))
}

// Hook personalizado para gestionar los mensajes
export function useMessages(tabActivo = "recibidos", searchQuery = "", asuntoSeleccionado = "") {
  // Estado para los mensajes
  const [mensajes, setMensajes] = useState(mensajesStore)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [messageCounts, setMessageCounts] = useState({
    recibidos: 0,
    favoritos: 0,
    importantes: 0,
    eliminados: 0,
    archivados: 0,
  })

  // Suscribirse a cambios en el store
  useEffect(() => {
    // Función para actualizar el estado local cuando cambia el store
    const handleStoreChange = (newMensajes) => {
      setMensajes([...newMensajes])
    }

    // Añadir este componente como listener
    listeners.push(handleStoreChange)

    // Limpiar al desmontar
    return () => {
      listeners = listeners.filter((listener) => listener !== handleStoreChange)
    }
  }, [])

  // Actualizar contadores de mensajes
  useEffect(() => {
    const counts = {
      recibidos: mensajes.filter((m) => !m.eliminado).length,
      favoritos: mensajes.filter((m) => m.favorito && !m.eliminado).length,
      importantes: mensajes.filter((m) => m.importante && !m.eliminado).length,
      eliminados: mensajes.filter((m) => m.eliminado).length,
      archivados: mensajes.filter((m) => m.archivado && !m.eliminado).length,
    }
    setMessageCounts(counts)
  }, [mensajes])

  // Filtrar mensajes según la pestaña activa, búsqueda y asunto
  const filteredMessages = mensajes
    .filter((mensaje) => {
      // Filtrar por tab
      if (tabActivo === "recibidos" && mensaje.eliminado) return false
      if (tabActivo === "favoritos" && (!mensaje.favorito || mensaje.eliminado)) return false
      if (tabActivo === "importantes" && (!mensaje.importante || mensaje.eliminado)) return false
      if (tabActivo === "eliminados" && !mensaje.eliminado) return false
      if (tabActivo === "archivados" && (!mensaje.archivado || mensaje.eliminado)) return false

      // Filtrar por búsqueda
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          mensaje.remitente.toLowerCase().includes(query) ||
          mensaje.asunto.toLowerCase().includes(query) ||
          mensaje.contenido.toLowerCase().includes(query) ||
          (mensaje.respuestas && mensaje.respuestas.some((r) => r.contenido.toLowerCase().includes(query)))

        if (!matchesSearch) return false
      }

      // Filtrar por asunto
      if (asuntoSeleccionado && mensaje.asunto !== asuntoSeleccionado) {
        return false
      }

      return true
    })
    .sort((a, b) => new Date(b.fecha + " " + b.hora) - new Date(a.fecha + " " + a.hora))

  // Obtener lista de asuntos usados
  const asuntosUsados = [...new Set(mensajes.map((m) => m.asunto))].filter(Boolean)

  // Función para marcar un mensaje como leído
  const markMessageAsRead = (messageId) => {
    mensajesStore = mensajesStore.map((m) => (m.id === messageId ? { ...m, leido: true } : m))
    notifyListeners()
  }

  // Función para alternar favorito
  const handleToggleFavorite = (messageId) => {
    mensajesStore = mensajesStore.map((m) => (m.id === messageId ? { ...m, favorito: !m.favorito } : m))
    notifyListeners()
  }

  // Función para alternar importante
  const handleToggleImportant = (messageId) => {
    mensajesStore = mensajesStore.map((m) => (m.id === messageId ? { ...m, importante: !m.importante } : m))
    notifyListeners()
  }

  // Función para eliminar mensaje
  const handleDeleteMessage = (messageId) => {
    mensajesStore = mensajesStore.map((m) => (m.id === messageId ? { ...m, eliminado: true } : m))
    notifyListeners()

    // Si el mensaje eliminado es el seleccionado, deseleccionarlo
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage(null)
    }
  }

  // Función para restaurar mensaje
  const handleRestoreMessage = (messageId) => {
    mensajesStore = mensajesStore.map((m) => (m.id === messageId ? { ...m, eliminado: false } : m))
    notifyListeners()
  }

  // Función para eliminar permanentemente
  const handlePermanentDelete = (messageId) => {
    mensajesStore = mensajesStore.filter((m) => m.id !== messageId)
    notifyListeners()

    // Si el mensaje eliminado es el seleccionado, deseleccionarlo
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage(null)
    }
  }

  // Función para enviar respuesta
  const handleSendReply = (messageId, content, attachment = null) => {
    const now = new Date()
    const respuesta = {
      id: `${messageId}-${Date.now()}`,
      contenido: content,
      fecha: now.toLocaleDateString(),
      hora: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      attachment: attachment,
    }

    mensajesStore = mensajesStore.map((m) =>
      m.id === messageId ? { ...m, respuestas: [...(m.respuestas || []), respuesta] } : m,
    )
    notifyListeners()

    // Simular cambio de estado después de un tiempo
    setTimeout(() => {
      mensajesStore = mensajesStore.map((m) =>
        m.id === messageId
          ? {
            ...m,
            respuestas: m.respuestas.map((r) => (r.id === respuesta.id ? { ...r, status: "delivered" } : r)),
          }
          : m,
      )
      notifyListeners()
    }, 1000)

    setTimeout(() => {
      mensajesStore = mensajesStore.map((m) =>
        m.id === messageId
          ? {
            ...m,
            respuestas: m.respuestas.map((r) => (r.id === respuesta.id ? { ...r, status: "read" } : r)),
          }
          : m,
      )
      notifyListeners()
    }, 2000)
  }

  // Función para enviar nuevo mensaje
  const handleSendNewMessage = (nuevoMensaje) => {
    // Crear un nuevo mensaje con ID único y otros campos necesarios
    const mensajeCreado = {
      id: Date.now().toString(),
      remitente: "Administrador",
      destinatario: nuevoMensaje.destinatario,
      asunto: nuevoMensaje.asunto,
      contenido: nuevoMensaje.contenido,
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      leido: true,
      favorito: false,
      importante: false,
      eliminado: false,
      respuestas: [],
      colegiadoId: nuevoMensaje.colegiadoId || null,
    }

    // Añadir el mensaje al array de mensajes
    mensajesStore = [mensajeCreado, ...mensajesStore]
    notifyListeners()

    // Devolver el mensaje creado para que pueda ser usado por el componente
    return mensajeCreado
  }

  // Agrupar mensajes por colegiado para la vista de conversaciones
  const colegiadosConMensajes = Object.values(
    mensajes.reduce((acc, message) => {
      if (message.eliminado) return acc

      const colegiadoKey = message.colegiadoId || message.remitente

      if (!acc[colegiadoKey]) {
        acc[colegiadoKey] = {
          id: message.colegiadoId,
          nombre: message.remitente,
          mensajes: [],
        }
      }

      acc[colegiadoKey].mensajes.push(message)
      return acc
    }, {}),
  ).sort((a, b) => {
    const lastMessageA = a.mensajes[a.mensajes.length - 1]
    const lastMessageB = b.mensajes[b.mensajes.length - 1]
    return (
      new Date(lastMessageB.fecha + " " + lastMessageB.hora) - new Date(lastMessageA.fecha + " " + lastMessageA.hora)
    )
  })

  return {
    mensajes,
    selectedMessage,
    setSelectedMessage,
    filteredMessages,
    messageCounts,
    handleToggleFavorite,
    handleToggleImportant,
    handleDeleteMessage,
    handleRestoreMessage,
    handlePermanentDelete,
    handleSendReply,
    handleSendNewMessage,
    markMessageAsRead,
    asuntosUsados,
    colegiadosConMensajes,
  }
}

// Función para obtener todos los mensajes (útil para debugging)
export function getAllMessages() {
  return mensajesStore
}

// Función para añadir un mensaje directamente (útil para testing)
export function addMessage(mensaje) {
  mensajesStore = [mensaje, ...mensajesStore]
  notifyListeners()
  return mensaje
}
