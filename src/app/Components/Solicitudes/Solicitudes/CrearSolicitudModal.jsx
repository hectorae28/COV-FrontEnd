"use client"
import SessionInfo from "@/Components/SessionInfo"
import { CheckCircle, ChevronRight, Clock, X } from "lucide-react"
import { useState } from "react"
import SeleccionarSolicitudesStep from "./StepsSeleccionarSolic"

export default function CrearSolicitudModal({
  onClose,
  onSolicitudCreada,
  colegiados = [],
  colegiadoPreseleccionado = null,
  onVerDetalle,
  session,
  tipoSolicitud = null,
  solicitudCreada,
  isAdmin=false
}) {
  // Función para manejar la creación de solicitud
  const handleSolicitudCreada = (nuevaSolicitud) => {
    onSolicitudCreada(nuevaSolicitud)
  }

  // Función para ir a la vista de detalle de la solicitud
  const handleVerDetalle = () => {
    if (onVerDetalle) {
      onVerDetalle(solicitudCreada.id)
      onClose()
    } else {
      onClose()
    }
  }

  // Determinar si estamos en el contexto de un colegiado específico
  const esContextoColegiado = !!colegiadoPreseleccionado

  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {solicitudCreada
              ? ""
              : tipoSolicitud === "multiple"
                ? "Nueva solicitud múltiple"
                : tipoSolicitud === "constancia"
                  ? "Nueva solicitud de constancia"
                  : tipoSolicitud === "carnet"
                    ? "Nueva solicitud de carnet"
                    : tipoSolicitud === "especializacion"
                      ? "Nueva solicitud de especialización"
                      : "Nueva solicitud"}
          </h2>
          <button onClick={onClose} className="cursor-pointer text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        {/* Contenido del modal */}
        {solicitudCreada ? (
          <div className="p-6 md:p-8">
            <div className="py-16">
              <div className="flex items-center justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle size={44} className="text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-[#41023B]">¡Solicitud registrada correctamente!</h3>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
              <button
                onClick={onClose}
                className="cursor-pointer order-2 sm:order-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              >
                Cerrar
              </button>
              <button
                onClick={handleVerDetalle}
                className="cursor-pointer order-1 sm:order-2 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 shadow-md transition-all duration-300"
              >
                <span>Ver detalles</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <SeleccionarSolicitudesStep
            colegiados={colegiados}
            colegiadoPreseleccionado={colegiadoPreseleccionado}
            mostrarSeleccionColegiado={!esContextoColegiado}
            onFinalizarSolicitud={handleSolicitudCreada}
            onClose={onClose}
            tipoSolicitudPreseleccionado={tipoSolicitud}
            creadorInfo={
              session?.user || {
                name: "Usuario del sistema",
                email: "usuario@sistema.com",
                role: "user",
                isAdmin: false,
              }
            }
            isAdmin={isAdmin}
          />
        )}
      </div>
    </div>
  )
}
