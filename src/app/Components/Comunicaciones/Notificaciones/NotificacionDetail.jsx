"use client"

import { Celebration, CheckCircle, Engineering, Event, Gavel, Message, Payment, Poll, School, Update } from "@mui/icons-material"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Bell, CheckCheck, ChevronLeft, EyeOff, Reply, Trash2 } from "lucide-react"
import { useEffect } from "react"

export function NotificacionDetail({
  notificacion,
  onToggleLeida,
  onEliminar,
  onRestaurar,
  onEliminarPermanente,
  onBackToList,
  isMobile,
}) {

  // Función para obtener el icono según el tipo de notificación
  const getIconByType = (tipo, icono) => {
    switch (icono) {
      case "update":
        return <Update className="h-6 w-6 text-blue-500" />
      case "payment":
        return <Payment className="h-6 w-6 text-green-500" />
      case "school":
        return <School className="h-6 w-6 text-purple-500" />
      case "message":
        return <Message className="h-6 w-6 text-cyan-500" />
      case "event":
        return <Event className="h-6 w-6 text-orange-500" />
      case "check_circle":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "gavel":
        return <Gavel className="h-6 w-6 text-red-500" />
      case "engineering":
        return <Engineering className="h-6 w-6 text-gray-500" />
      case "celebration":
        return <Celebration className="h-6 w-6 text-yellow-500" />
      case "poll":
        return <Poll className="h-6 w-6 text-indigo-500" />
      default:
        return <Bell className="h-6 w-6 text-gray-500" />
    }
  }

  const handleBackButtonClick = () => {
    onBackToList();

    const newUrl = window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  };

  // Función para formatear la fecha completa
  const formatFullDate = (dateStr) => {
    try {
      const date = new Date(dateStr)
      return format(date, "PPPp", { locale: es })
    } catch (error) {
      return "fecha desconocida"
    }
  }

  // Marcar como leída automáticamente al abrir
  useEffect(() => {
    if (notificacion && !notificacion.leida) {
      onToggleLeida(notificacion.id)
    }
  }, [notificacion])

  if (!notificacion) {
    return (
      <div className="hidden md:flex w-full h-full flex-col items-center justify-center bg-gray-50">
        <div className="relative w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-[#D7008A] to-[#41023B] opacity-20"></div>
          <Bell className="h-8 w-8 text-[#D7008A] z-10 relative" />
        </div>
        <h3 className="text-xl font-medium text-gray-500 mb-2">No hay notificación seleccionada</h3>
        <p className="text-gray-400 text-center max-w-md px-4">
          Selecciona una notificación de la lista para ver su contenido completo
        </p>
      </div>
    )
  }

  return (
    <div className={`${!notificacion && isMobile ? "hidden" : "flex"} flex-col h-full w-full bg-gray-50 md:w-3/5`}>
      {/* Header */}
      <div className="p-3 border-b flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center">
          {isMobile && (
            <button
              onClick={handleBackButtonClick}
              className="h-8 w-8 mr-2 flex-shrink-0 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
              aria-label="Volver a la lista"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              {getIconByType(notificacion.tipo, notificacion.icono)}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{notificacion.titulo}</h2>
              <p className="text-xs text-gray-500">{formatFullDate(notificacion.fecha)}</p>
            </div>
          </div>
        </div>
        <div className="flex">
          {notificacion.eliminada ? (
            <>
              <button
                className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
                onClick={() => onRestaurar(notificacion.id)}
                title="Restaurar notificación"
              >
                <Reply className="h-4 w-4" />
              </button>
              <button
                className="h-8 w-8 rounded-full flex items-center justify-center text-red-400 hover:bg-gray-100"
                onClick={() => onEliminarPermanente(notificacion.id)}
                title="Eliminar permanentemente"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
                onClick={() => onToggleLeida(notificacion.id)}
                title={notificacion.leida ? "Marcar como leída" : "Marcar como no leída"}
              >
                {notificacion.leida ? <CheckCheck className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button
                className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
                onClick={() => onEliminar(notificacion.id)}
                title="Eliminar notificación"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-grow overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            {/* Asunto de la notificación en el detalle */}
            <div className="mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-sm font-medium bg-purple-100 text-purple-800 inline-block truncate max-w-full">Asunto</h3>
              <p className="text-base font-medium text-gray-800 mt-1">{notificacion.asunto}</p>
            </div>

            <p className="text-gray-700 whitespace-pre-line">{notificacion.contenido}</p>

            {notificacion.tipo === "curso" && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button className="px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#41023B] transition-colors">
                  Ver detalles del curso
                </button>
              </div>
            )}

            {notificacion.tipo === "evento" && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button className="px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#41023B] transition-colors mr-3">
                  Ver evento
                </button>
                <button className="px-4 py-2 border border-[#D7008A] text-[#D7008A] rounded-md hover:bg-pink-50 transition-colors">
                  Descargar programa
                </button>
              </div>
            )}

            {notificacion.tipo === "pago" && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button className="px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#41023B] transition-colors">
                  Realizar pago
                </button>
              </div>
            )}

            {notificacion.tipo === "solicitud" && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button className="px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#41023B] transition-colors">
                  Descargar certificado
                </button>
              </div>
            )}

            {notificacion.tipo === "encuesta" && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button className="px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#41023B] transition-colors">
                  Completar encuesta
                </button>
              </div>
            )}

            {notificacion.tipo === "mensaje" && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button className="px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#41023B] transition-colors">
                  Ver mensaje
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}