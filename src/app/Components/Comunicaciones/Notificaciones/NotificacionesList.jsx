"use client"

import { Celebration, CheckCircle, Engineering, Event, Gavel, Message, Payment, Poll, School, Update } from "@mui/icons-material"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { motion } from "framer-motion"
import { Bell, CheckCheck, ChevronRight, EyeOff, Reply, Trash2 } from "lucide-react"
import { useCallback, useState } from "react"

export function NotificacionesList({
  notificaciones,
  selectedNotificacionId,
  onSelectNotificacion,
  onToggleLeida,
  onEliminar,
  onRestaurar,
  onEliminarPermanente,
  activeTab,
  isMobile,
}) {

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  const [isHovered, setIsHovered] = useState(false)

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

  // Función para obtener el icono según el tipo de notificación
  const getIconByType = (tipo, icono) => {
    switch (icono) {
      case "update":
        return <Update className="h-5 w-5 text-blue-500" />
      case "payment":
        return <Payment className="h-5 w-5 text-green-500" />
      case "school":
        return <School className="h-5 w-5 text-purple-500" />
      case "message":
        return <Message className="h-5 w-5 text-cyan-500" />
      case "event":
        return <Event className="h-5 w-5 text-orange-500" />
      case "check_circle":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "gavel":
        return <Gavel className="h-5 w-5 text-red-500" />
      case "engineering":
        return <Engineering className="h-5 w-5 text-gray-500" />
      case "celebration":
        return <Celebration className="h-5 w-5 text-yellow-500" />
      case "poll":
        return <Poll className="h-5 w-5 text-indigo-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  // Función para formatear la fecha relativa
  const formatRelativeDate = (dateStr) => {
    try {
      const date = new Date(dateStr)
      return formatDistanceToNow(date, { addSuffix: true, locale: es })
    } catch (error) {
      return "fecha desconocida"
    }
  }

  // Memoize event handlers for list items to prevent unnecessary re-renders
  const handleItemClick = useCallback((notificacion) => {
    onSelectNotificacion(notificacion)
  }, [onSelectNotificacion])

  const handleToggleLeida = useCallback((e, id) => {
    e.stopPropagation()
    onToggleLeida(id)
  }, [onToggleLeida])

  const handleEliminar = useCallback((e, id) => {
    e.stopPropagation()
    onEliminar(id)
  }, [onEliminar])

  const handleRestaurar = useCallback((e, id) => {
    e.stopPropagation()
    onRestaurar(id)
  }, [onRestaurar])

  const handleEliminarPermanente = useCallback((e, id) => {
    e.stopPropagation()
    onEliminarPermanente(id)
  }, [onEliminarPermanente])

  return (
    <div
      className={`${selectedNotificacionId && isMobile ? "hidden" : "block"
        } bg-white md:border-r flex flex-col h-auto transition-all duration-300 ease-in-out shrink-0 w-full md:w-3/5`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
        <h2 className="font-bold text-lg capitalize text-[#D7008A]">
          {activeTab === "todas"
            ? "Todas las notificaciones"
            : activeTab === "no-leidas"
              ? "Notificaciones no leídas"
              : "Papelera de notificaciones"}
        </h2>
        <span className="text-sm text-gray-500">
          {notificaciones.length} notificación{notificaciones.length !== 1 ? "es" : ""}
        </span>
      </div>
      <div className="flex-1 overflow-auto w-full">
        {notificaciones.length > 0 ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="divide-y">
            {notificaciones.map((notificacion) => {
              const formattedDate = formatRelativeDate(notificacion.fecha)
              return (
                <motion.div
                  key={notificacion.id}
                  variants={itemVariants}
                  onClick={() => handleItemClick(notificacion)}
                  className={`cursor-pointer hover:bg-gray-100 transition-colors ${selectedNotificacionId === notificacion.id ? "border-r-4 border-[#D7008A]" : ""
                    } ${!notificacion.leida && !notificacion.eliminada ? "bg-pink-50" : ""}`}
                >
                  <div className="p-3">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                        {getIconByType(notificacion.tipo, notificacion.icono)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <div className="font-medium truncate">{notificacion.titulo}</div>
                          <div className="text-xs text-gray-500 whitespace-nowrap ml-2">{formattedDate}</div>
                        </div>
                        {/* Asunto de la notificación */}
                        <div className="mt-1">
                          <div className="text-xs bg-purple-100 text-purple-800 rounded-full inline-block truncate max-w-full font-medium">{notificacion.asunto}</div>
                        </div>
                        <div className="mt-1">
                          <div className="text-sm text-gray-600 line-clamp-2">{notificacion.contenido}</div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="flex space-x-1">
                            {!notificacion.leida && !notificacion.eliminada && (
                              <span className="bg-[#D7008A] text-white text-xs px-1.5 py-0.5 rounded-full">Nueva</span>
                            )}
                          </div>
                          <div className="flex items-center">
                            {notificacion.eliminada ? (
                              <>
                                <button
                                  className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
                                  onClick={(e) => handleRestaurar(e, notificacion.id)}
                                  title="Restaurar notificación"
                                >
                                  <Reply className="h-4 w-4" />
                                </button>
                                <button
                                  className="h-8 w-8 rounded-full flex items-center justify-center text-red-400 hover:bg-gray-100"
                                  onClick={(e) => handleEliminarPermanente(e, notificacion.id)}
                                  title="Eliminar permanentemente"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
                                  onClick={(e) => handleToggleLeida(e, notificacion.id)}
                                  title={notificacion.leida ? "Marcar como no leída" : "Marcar como leída"}
                                >
                                  {notificacion.leida ? <EyeOff className="h-4 w-4" /> : <CheckCheck className="h-4 w-4" />}
                                </button>
                                <button
                                  className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
                                  onClick={(e) => handleEliminar(e, notificacion.id)}
                                  title="Eliminar notificación"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
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
                {activeTab === "papelera" ? (
                  <Trash2 className="h-6 w-6 text-white" />
                ) : (
                  <Bell className="h-6 w-6 text-white" />
                )}
              </div>
            </div>
            <p>No hay notificaciones para mostrar</p>
            {activeTab === "papelera" && (
              <p className="text-sm mt-2">Las notificaciones permanecerán aquí por 30 días</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}