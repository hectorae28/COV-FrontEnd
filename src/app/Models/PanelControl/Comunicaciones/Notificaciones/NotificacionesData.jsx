"use client"

import { createContext, useContext, useEffect, useState } from "react"

const notificacionesIniciales = [
  {
    id: "1",
    titulo: "Actualización de sistema",
    contenido: "Se ha actualizado el sistema a la versión 2.0. Revisa las nuevas funcionalidades disponibles.",
    fecha: "2023-11-15T10:30:00",
    leida: false,
    eliminada: false,
    tipo: "sistema",
    icono: "update",
  },
  {
    id: "2",
    titulo: "Recordatorio de pago",
    contenido: "Tu cuota anual vence en 7 días. Por favor, realiza el pago antes del vencimiento para evitar recargos.",
    fecha: "2023-11-14T09:15:00",
    leida: true,
    eliminada: false,
    tipo: "pago",
    icono: "payment",
  },
  {
    id: "3",
    titulo: "Nuevo curso disponible",
    contenido:
      "Se ha publicado un nuevo curso de 'Odontología Estética Avanzada'. Inscríbete ahora para obtener un 15% de descuento.",
    fecha: "2023-11-13T14:45:00",
    leida: false,
    eliminada: false,
    tipo: "curso",
    icono: "school",
  },
  {
    id: "4",
    titulo: "Mensaje nuevo",
    contenido: "Has recibido un nuevo mensaje de la Dra. María González sobre la próxima reunión del comité.",
    fecha: "2023-11-12T16:20:00",
    leida: false,
    eliminada: false,
    tipo: "mensaje",
    icono: "message",
  },
  {
    id: "5",
    titulo: "Evento próximo",
    contenido:
      "Recuerda que el Congreso Nacional de Odontología comienza el próximo viernes. Ya puedes descargar el programa completo.",
    fecha: "2023-11-11T11:00:00",
    leida: true,
    eliminada: false,
    tipo: "evento",
    icono: "event",
  },
  {
    id: "6",
    titulo: "Solicitud aprobada",
    contenido: "Tu solicitud de certificación ha sido aprobada. Puedes descargar el certificado desde tu perfil.",
    fecha: "2023-11-10T13:30:00",
    leida: true,
    eliminada: false,
    tipo: "solicitud",
    icono: "check_circle",
  },
  {
    id: "7",
    titulo: "Actualización de normativa",
    contenido:
      "Se ha publicado una actualización importante en la normativa de práctica clínica. Por favor, revisa los cambios.",
    fecha: "2023-11-09T10:45:00",
    leida: false,
    eliminada: false,
    tipo: "normativa",
    icono: "gavel",
  },
  {
    id: "8",
    titulo: "Mantenimiento programado",
    contenido: "El sistema estará en mantenimiento el domingo 19 de noviembre de 02:00 a 05:00 AM.",
    fecha: "2023-11-08T09:00:00",
    leida: true,
    eliminada: true,
    tipo: "sistema",
    icono: "engineering",
  },
  {
    id: "9",
    titulo: "Felicitaciones",
    contenido: "¡Felicidades por completar tu perfil profesional! Tu perfil ahora es visible para otros miembros.",
    fecha: "2023-11-07T15:20:00",
    leida: true,
    eliminada: true,
    tipo: "perfil",
    icono: "celebration",
  },
  {
    id: "10",
    titulo: "Encuesta de satisfacción",
    contenido:
      "Nos gustaría conocer tu opinión sobre las nuevas funcionalidades. Por favor, completa esta breve encuesta.",
    fecha: "2025-11-06T14:10:00",
    leida: false,
    eliminada: false,
    tipo: "encuesta",
    icono: "poll",
  },
]

// Crear contexto para las notificaciones
const NotificacionesContext = createContext()

export const NotificacionesProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([])
  const [selectedNotificacion, setSelectedNotificacion] = useState(null)
  const [activeTab, setActiveTab] = useState("todas")
  const [searchQuery, setSearchQuery] = useState("")
  const [notificacionesVistasEnModal, setNotificacionesVistasEnModal] = useState([])

  // Cargar notificaciones al iniciar
  useEffect(() => {
    const notificacionesConEstadoCorregido = notificacionesIniciales.map((notif, index) => {
      if (index < 3) {
        return { ...notif, leida: false }
      }
      return notif
    })
    setNotificaciones(notificacionesConEstadoCorregido)
  }, [])

  // Filtrar notificaciones según la pestaña activa y búsqueda
  const getFilteredNotificaciones = () => {
    return notificaciones
      .filter((notif) => {
        // Filtrar por tab
        if (activeTab === "todas" && !notif.eliminada) return true
        if (activeTab === "no-leidas" && !notif.leida && !notif.eliminada) return true
        if (activeTab === "papelera" && notif.eliminada) return true
        if (activeTab !== "todas" && activeTab !== "no-leidas" && activeTab !== "papelera") return false

        return false
      })
      .filter((notif) => {
        // Filtrar por búsqueda
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return notif.titulo.toLowerCase().includes(query) || notif.contenido.toLowerCase().includes(query)
      })
      .sort((a, b) => {
        // Ordenar por fecha (más reciente primero)
        return new Date(b.fecha) - new Date(a.fecha)
      })
  }

  // Obtener conteo de notificaciones por tipo
  const getNotificacionesCounts = () => {
    const todas = notificaciones.filter((n) => !n.eliminada).length
    const noLeidas = notificaciones.filter((n) => !n.leida && !n.eliminada).length
    const papelera = notificaciones.filter((n) => n.eliminada).length

    return { todas, noLeidas, papelera }
  }

  // Añadir un evento global para notificar cambios en las notificaciones
  const toggleLeidaNotificacion = (id) => {
    setNotificaciones((prev) => prev.map((notif) => (notif.id === id ? { ...notif, leida: !notif.leida } : notif)))

    // Disparar un evento personalizado para notificar el cambio
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("notificaciones-actualizadas"))
    }
  }

  // Actualizar también las otras funciones que modifican notificaciones
  const eliminarNotificacion = (id) => {
    setNotificaciones((prev) => prev.map((notif) => (notif.id === id ? { ...notif, eliminada: true } : notif)))

    // Si la notificación eliminada es la seleccionada, deseleccionarla
    if (selectedNotificacion && selectedNotificacion.id === id) {
      setSelectedNotificacion(null)
    }

    // Disparar evento
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("notificaciones-actualizadas"))
    }
  }

  const restaurarNotificacion = (id) => {
    setNotificaciones((prev) => prev.map((notif) => (notif.id === id ? { ...notif, eliminada: false } : notif)))

    // Disparar evento
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("notificaciones-actualizadas"))
    }
  }

  const eliminarPermanentemente = (id) => {
    setNotificaciones((prev) => prev.filter((notif) => notif.id !== id))

    // Si la notificación eliminada es la seleccionada, deseleccionarla
    if (selectedNotificacion && selectedNotificacion.id === id) {
      setSelectedNotificacion(null)
    }

    // Disparar evento
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("notificaciones-actualizadas"))
    }
  }

  const vaciarPapelera = () => {
    setNotificaciones((prev) => prev.filter((notif) => !notif.eliminada))

    // Si la notificación seleccionada estaba en la papelera, deseleccionarla
    if (selectedNotificacion && selectedNotificacion.eliminada) {
      setSelectedNotificacion(null)
    }

    // Disparar evento
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("notificaciones-actualizadas"))
    }
  }

  const marcarTodasComoLeidas = () => {
    setNotificaciones((prev) => prev.map((notif) => (!notif.eliminada ? { ...notif, leida: true } : notif)))

    // Disparar evento
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("notificaciones-actualizadas"))
    }
  }

  // Obtener notificaciones recientes para el modal
  const getNotificacionesRecientes = () => {
    return notificaciones
      .filter((n) => !n.eliminada && !notificacionesVistasEnModal.includes(n.id))
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 5)
  }

  const marcarVistaEnModal = (id) => {
    // Añadir a la lista de vistas en modal
    setNotificacionesVistasEnModal((prev) => [...prev, id]);

    // Siempre marcar como leída
    setNotificaciones((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, leida: true } : notif))
    );

    // Disparar evento
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("notificaciones-actualizadas"));
    }
  }

  // Seleccionar una notificación específica por ID
  const selectNotificacionById = (id) => {
    const notificacion = notificaciones.find((n) => n.id === id);
    if (notificacion) {
      setSelectedNotificacion(notificacion);

      // Si la notificación no está leída, marcarla como leída
      if (!notificacion.leida) {
        setNotificaciones((prev) =>
          prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
        );

        // Disparar evento de actualización
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("notificaciones-actualizadas"));
        }
      }

      // Si la notificación está en la papelera, cambiar a la pestaña papelera
      if (notificacion.eliminada) {
        setActiveTab("papelera");
      } else {
        setActiveTab("todas");
      }
    }
  }

  const marcarComoLeida = (id) => {
    setNotificaciones((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, leida: true } : notif))
    );

    // Disparar un evento personalizado para notificar el cambio
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("notificaciones-actualizadas"));
    }
  }

  const value = {
    notificaciones,
    selectedNotificacion,
    setSelectedNotificacion,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    getFilteredNotificaciones,
    getNotificacionesCounts,
    toggleLeidaNotificacion,
    eliminarNotificacion,
    restaurarNotificacion,
    eliminarPermanentemente,
    vaciarPapelera,
    marcarTodasComoLeidas,
    getNotificacionesRecientes,
    selectNotificacionById,
    getNotificacionesRecientes,

    marcarVistaEnModal,
  }

  return <NotificacionesContext.Provider value={value}>{children}</NotificacionesContext.Provider>
}

export const useNotificaciones = () => {
  const context = useContext(NotificacionesContext)
  if (!context) {
    throw new Error("useNotificaciones debe ser usado dentro de un NotificacionesProvider")
  }
  return context
}