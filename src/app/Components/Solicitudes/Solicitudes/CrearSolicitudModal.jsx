"use client"
import { CheckCircle, ChevronRight, Clock, X } from "lucide-react"
import { useState } from "react"
import SeleccionarSolicitudesStep from "./StepsSeleccionarSolic"
import SessionInfo from "@/Components/SessionInfo"

export default function CrearSolicitudModal({
  onClose,
  onSolicitudCreada,
  colegiados = [],
  colegiadoPreseleccionado = null,
  onVerDetalle,
  session
}) {
  // Estado para almacenar la solicitud creada
  const [solicitudCreada, setSolicitudCreada] = useState(null)

  // Función para manejar la creación de solicitud
  const handleSolicitudCreada = (nuevaSolicitud) => {
    // Usar la información de la sesión actual
    const userInfo = session?.user || {
      name: "Usuario del sistema",
      email: "usuario@sistema.com",
      role: "user",
      isAdmin: false
    };

    // Agregar la información del creador a la solicitud
    const solicitudConCreador = {
      ...nuevaSolicitud,
      creador: {
        username: userInfo.name || userInfo.email?.split('@')[0] || "Usuario",
        email: userInfo.email,
        esAdmin: userInfo.role === "admin" || userInfo.isAdmin || false,
        fecha: new Date().toISOString(),
        tipo: 'creado' // Indica que es una creación, no una aprobación
      }
    };

    // Actualizar estado local y enviar al componente padre
    setSolicitudCreada(solicitudConCreador);
    onSolicitudCreada(solicitudConCreador);
  };

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
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {solicitudCreada ? "" : "Nueva solicitud"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        {/* Contenido del modal */}
        {solicitudCreada ? (
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle size={44} className="text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-[#41023B] mb-4">
              ¡Solicitud registrada correctamente!
            </h3>
            <div className="bg-[#f8f9fa] p-5 rounded-xl border border-gray-200 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="font-medium text-gray-800">{solicitudCreada.tipo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Colegiado</p>
                  <p className="font-medium text-gray-800">{solicitudCreada.colegiadoNombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Referencia</p>
                  <p className="font-medium text-gray-800">{solicitudCreada.referencia}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <p className="font-medium flex items-center">
                    {solicitudCreada.estadoPago === "Exonerado" ? (
                      <>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 mr-1">
                          <CheckCircle size={14} />
                          Exonerada
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-1">
                          <Clock size={14} />
                          Pendiente
                        </span>
                      </>
                    )}
                  </p>
                </div>
                {solicitudCreada.creador && (
                  <div className="sm:col-span-2">
                    <SessionInfo
                      creador={solicitudCreada.creador}
                      variant="compact"
                      className="justify-center md:justify-start"
                    />
                  </div>
                )}

              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
              <button
                onClick={onClose}
                className="order-2 sm:order-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              >
                Cerrar
              </button>
              <button
                onClick={handleVerDetalle}
                className="order-1 sm:order-2 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 shadow-md transition-all duration-300"
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
            creadorInfo={session?.user || {
              name: "Usuario del sistema",
              email: "usuario@sistema.com",
              role: "user",
              isAdmin: false
            }}
          />
        )}
      </div>
    </div>
  )
}
