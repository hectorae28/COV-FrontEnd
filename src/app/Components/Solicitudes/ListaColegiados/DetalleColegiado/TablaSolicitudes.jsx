"use client"
import { AlertCircle, CheckCircle, Clock, FileText, Search } from "lucide-react"
import { useEffect, useState } from "react"
import useDataListaColegiados from "@/app/Models/PanelControl/Solicitudes/ListaColegiadosData"

/**
 * Componente para visualizar y gestionar las solicitudes de un colegiado
 * @param {string} colegiadoId - ID del colegiado
 */
export default function TablaSolicitudes({ colegiadoId }) {
  // Obtener funciones del store
  const { getSolicitudes } = useDataListaColegiados()

  // Estados locales
  const [solicitudes, setSolicitudes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Cargar solicitudes del colegiado
  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        setIsLoading(true)

        // Obtener solicitudes desde el store centralizado
        const solicitudesColegiado = getSolicitudes(colegiadoId)
        setSolicitudes(solicitudesColegiado)

        setIsLoading(false)
      } catch (error) {
        console.error("Error al cargar las solicitudes:", error)
        setIsLoading(false)
      }
    }
    fetchSolicitudes()
  }, [colegiadoId, getSolicitudes])

  // Filtrar solicitudes según el término de búsqueda
  const solicitudesFiltradas = solicitudes.filter(solicitud =>
    solicitud.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitud.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitud.fecha?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitud.estado?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Contar solicitudes por estado
  const solicitudesPendientes = solicitudes.filter(sol => sol.estado === "Pendiente" || sol.estado === "En proceso").length
  const solicitudesCompletadas = solicitudes.filter(sol => sol.estado === "Completada").length

  // Obtener el color de fondo según el estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Completada":
        return "bg-green-100 text-green-800"
      case "En proceso":
        return "bg-blue-100 text-blue-800"
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "Exonerada":
        return "bg-teal-100 text-teal-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Función para mostrar el monto correctamente
  const formatMonto = (monto) => {
    // Verificar si monto existe y es un número
    if (monto !== undefined && monto !== null && !isNaN(monto)) {
      return `$${monto.toFixed(2)}`;
    }
    // Si es costo en lugar de monto
    if (solicitud.costo !== undefined && solicitud.costo !== null && !isNaN(solicitud.costo)) {
      return `$${solicitud.costo.toFixed(2)}`;
    }
    // Si no hay valor válido
    return "$0.00";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Solicitudes</h3>
          <p className="text-sm text-gray-500 mt-1">Trámites y solicitudes realizadas por el colegiado</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar solicitud..."
              className="pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Resumen de solicitudes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Total de solicitudes</p>
          <p className="text-xl font-semibold text-purple-600">{solicitudes.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Pendientes o en proceso</p>
          <p className="text-xl font-semibold text-yellow-600">{solicitudesPendientes}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Completadas</p>
          <p className="text-xl font-semibold text-green-600">{solicitudesCompletadas}</p>
        </div>
      </div>

      {/* Lista de solicitudes */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
        </div>
      ) : (
        <>
          {solicitudesFiltradas.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="flex justify-center mb-4">
                <FileText size={48} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-500">No se encontraron solicitudes</h3>
              <p className="text-gray-400 mt-1">No hay registros de solicitudes que coincidan con tu búsqueda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {solicitudesFiltradas.map(solicitud => (
                <div key={solicitud.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div className="mb-4 sm:mb-0">
                        <h4 className="text-lg font-medium text-gray-900">{solicitud.tipo}</h4>
                        <p className="text-sm text-gray-500 mt-1">{solicitud.descripcion}</p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(solicitud.estado)}`}>
                          {solicitud.estado === "En proceso" && <Clock size={12} className="mr-1" />}
                          {solicitud.estado === "Completada" && <CheckCircle size={12} className="mr-1" />}
                          {solicitud.estado === "Pendiente" && <AlertCircle size={12} className="mr-1" />}
                          {solicitud.estado === "Exonerada" && <CheckCircle size={12} className="mr-1" />}
                          {solicitud.estado}
                        </span>
                        {solicitud.urgente && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Urgente
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Fecha de solicitud</p>
                        <p className="text-sm font-medium">{solicitud.fecha}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Monto</p>
                        <p className="text-sm font-medium">
                          {solicitud.monto !== undefined ?
                            `$${solicitud.monto.toFixed(2)}` :
                            (solicitud.costo !== undefined ?
                              `$${solicitud.costo.toFixed(2)}` :
                              "$0.00")
                          }
                        </p>
                      </div>
                      <div className="sm:col-span-2 md:col-span-1 flex justify-start sm:justify-end md:justify-start">
                        <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                          <FileText size={16} className="mr-1" />
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
