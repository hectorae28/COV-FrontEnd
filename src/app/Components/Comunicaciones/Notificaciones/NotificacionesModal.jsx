"use client"

import { Celebration, CheckCircle, Engineering, Event, Gavel, Message, Payment, Poll, School, Update } from "@mui/icons-material"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Bell, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useNotificaciones } from "../../../Models/Comunicaciones/Notificaciones/NotificacionesData"

export function NotificacionesModal({ isOpen, onClose, anchorRef }) {
  const router = useRouter()
  const {
    getNotificacionesRecientes,
    toggleLeidaNotificacion,
    marcarVistaEnModal,
  } = useNotificaciones()
  const modalRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [notificacionesVisibles, setNotificacionesVisibles] = useState([])

  useEffect(() => {
    if (isOpen) {
      setNotificacionesVisibles(getNotificacionesRecientes())
    }
  }, [isOpen, getNotificacionesRecientes])

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
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose, anchorRef])

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

  // Navegar a la página de notificaciones y abrir una específica
  const handleNotificacionClick = (notificacion) => {
    if (!notificacion.leida) {
      toggleLeidaNotificacion(notificacion.id);
    }
    marcarVistaEnModal(notificacion.id);
    setNotificacionesVisibles((prev) => prev.filter((n) => n.id !== notificacion.id));
    onClose();
    router.push(`/Notificaciones?id=${notificacion.id}`);
  }

  const handleVerTodasClick = () => {
    onClose()
    router.push("/Notificaciones")
  }

  if (!isOpen) return null

  // Estilo para móvil
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <div className="bg-gradient-to-r from-[#D7008A] to-[#41023B] px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={onClose} className="text-white mr-2">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-medium text-white">Notificaciones</h3>
          </div>
          <button onClick={handleVerTodasClick} className="text-white text-sm">
            Ver todas
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto">
          {notificacionesVisibles.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notificacionesVisibles.map((notificacion) => (
                <div
                  key={notificacion.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notificacion.leida ? "bg-pink-50" : ""
                    }`}
                  onClick={() => handleNotificacionClick(notificacion)}
                >
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                      {getIconByType(notificacion.tipo, notificacion.icono)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-gray-900 truncate">{notificacion.titulo}</p>
                        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                          {formatRelativeDate(notificacion.fecha)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{notificacion.contenido}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Bell className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500">No tienes notificaciones</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Estilo para desktop
  return (
    <div className="fixed z-50" style={{ top: "60px", right: "80px" }}>
      <div
        ref={modalRef}
        className="bg-white rounded-lg overflow-hidden shadow-xl w-80 sm:w-96 max-h-[80vh] flex flex-col"
      >
        <div className="bg-gradient-to-r from-[#D7008A] to-[#41023B] px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-white mr-2" />
            <h3 className="text-lg font-medium text-white">Notificaciones</h3>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 focus:outline-none">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 max-h-[50vh]">
          {notificacionesVisibles.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notificacionesVisibles.map((notificacion) => (
                <div
                  key={notificacion.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notificacion.leida ? "bg-pink-50" : ""
                    }`}
                  onClick={() => handleNotificacionClick(notificacion)}
                >
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                      {getIconByType(notificacion.tipo, notificacion.icono)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-gray-900 truncate">{notificacion.titulo}</p>
                        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                          {formatRelativeDate(notificacion.fecha)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{notificacion.contenido}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Bell className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500">No tienes notificaciones</p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-4 py-3 border-t">
          <button
            onClick={handleVerTodasClick}
            className="w-full flex justify-center items-center px-4 py-2 text-sm font-medium text-[#D7008A] hover:text-[#41023B] focus:outline-none transition-colors"
          >
            Ver todas las notificaciones
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}