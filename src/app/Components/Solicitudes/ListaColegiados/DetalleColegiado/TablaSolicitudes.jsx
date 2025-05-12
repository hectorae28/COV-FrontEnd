import useDataListaColegiados from "@/app/Models/PanelControl/Solicitudes/ListaColegiadosData"
import SessionInfo from "@/Components/SessionInfo"
import { AlertCircle, Calendar, CheckCircle, Clock, Eye, FileCheck, FileText, Search, Tag } from "lucide-react"
import { useEffect, useState } from "react"

/** 
 * Componente para visualizar y gestionar las solicitudes de un colegiado 
 * @param {string} colegiadoId - ID del colegiado 
 * @param {boolean} forceUpdate - Bandera para forzar actualización 
 * @param {function} onVerDetalle - Función para ver detalle de solicitud 
 */
export default function TablaSolicitudes({ colegiadoId, forceUpdate, onVerDetalle }) {
  // Obtener funciones del store
  const { getSolicitudes } = useDataListaColegiados()

  // Estados locales
  const [solicitudes, setSolicitudes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Cargar solicitudes del colegiado
  useEffect(() => {
<<<<<<< HEAD
    const fetchSolicitudes = () => {
      setIsLoading(true)
      
      getSolicitudes(colegiadoId)
        .then(solicitudesColegiado => {
          // Asegurarse de que sea un array
          const solicitudesArray = Array.isArray(solicitudesColegiado) ? solicitudesColegiado : [];
          
          // Filtrar elementos no válidos o indefinidos
          const solicitudesValidas = solicitudesArray.filter(item => item && typeof item === 'object');
          
          console.log("Solicitudes válidas:", solicitudesValidas);
          setSolicitudes(solicitudesValidas);
        })
        .catch(error => {
          console.error("Error al cargar las solicitudes:", error);
          setSolicitudes([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
=======
    const fetchSolicitudes = async () => {
      try {
        setIsLoading(true)
        // Obtener solicitudes desde el store centralizado
        const solicitudesColegiado = getSolicitudes(colegiadoId) || []
        setSolicitudes(solicitudesColegiado)
        setIsLoading(false)
      } catch (error) {
        console.error("Error al cargar las solicitudes:", error)
        setIsLoading(false)
      }
>>>>>>> Feat/Noticias
    }
    
    fetchSolicitudes()
  }, [colegiadoId, getSolicitudes, forceUpdate])

  // Filtrar solicitudes según el término de búsqueda
<<<<<<< HEAD
  const solicitudesFiltradas = Array.isArray(solicitudes) ? solicitudes : [];

  // Contar solicitudes por estado
  const solicitudesPendientes = solicitudesFiltradas.filter(sol => sol.estado === "Pendiente" || sol.estado === "En proceso").length
  const solicitudesCompletadas = solicitudesFiltradas.filter(sol => sol.estado === "Completada" || sol.estado === "Aprobada").length
  const solicitudesExoneradas = solicitudesFiltradas.filter(sol => sol.estado === "Exonerada").length
=======
  const solicitudesFiltradas = (solicitudes || []).filter(solicitud =>
    solicitud.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitud.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitud.fecha?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitud.estado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitud.creador?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Contar solicitudes por estado
  const solicitudesPendientes = (solicitudes || []).filter(sol => sol.estado === "Pendiente" || sol.estado === "En proceso").length
  const solicitudesCompletadas = (solicitudes || []).filter(sol => sol.estado === "Completada" || sol.estado === "Aprobada").length
  const solicitudesExoneradas = (solicitudes || []).filter(sol => sol.estado === "Exonerada").length
>>>>>>> Feat/Noticias

  // Obtener el color de fondo según el estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Completada":
      case "Aprobada":
        return "bg-green-100 text-green-800"
      case "En proceso":
        return "bg-blue-100 text-blue-800"
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "Exonerada":
        return "bg-teal-100 text-teal-800"
      case "Rechazada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Obtener el icono según el estado
  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "Completada":
      case "Aprobada":
        return <CheckCircle size={14} className="mr-1" />
      case "En proceso":
        return <Clock size={14} className="mr-1" />
      case "Pendiente":
        return <AlertCircle size={14} className="mr-1" />
      case "Exonerada":
        return <FileCheck size={14} className="mr-1" />
      case "Rechazada":
        return <AlertCircle size={14} className="mr-1" />
      default:
        return <FileText size={14} className="mr-1" />
    }
  }

  // Función para formatear fechas
  const formatearFecha = (fechaTexto) => {
    if (!fechaTexto) return "Fecha no disponible"
    try {
      // Intentar procesar la fecha
      const fecha = new Date(fechaTexto)
      if (isNaN(fecha.getTime())) {
        // Si el formato no es ISO, devolver el texto original
        return fechaTexto
      }
      // Formatear la fecha
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch (error) {
      return fechaTexto
    }
  }

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Total de solicitudes</p>
          <p className="text-xl font-semibold text-purple-600">{solicitudesFiltradas.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Pendientes o en proceso</p>
          <p className="text-xl font-semibold text-yellow-600">{solicitudesPendientes}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Completadas</p>
          <p className="text-xl font-semibold text-green-600">{solicitudesCompletadas}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Exoneradas</p>
          <p className="text-xl font-semibold text-teal-600">{solicitudesExoneradas}</p>
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
              {solicitudesFiltradas.map((solicitud, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg">
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="bg-purple-50 p-2 rounded-md mr-3">
                            <FileText className="text-[#C40180]" size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{solicitud.tipo_solicitud || "Solicitud"}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getEstadoColor(solicitud.estado)}`}>
                              {getEstadoIcon(solicitud.status)}
                              {solicitud.status || "Pendiente"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0">
                        <button
                          onClick={() => onVerDetalle && onVerDetalle(solicitud.id)}
                          className="bg-blue-50 cursor-pointer hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-md text-sm flex items-center transition-colors"
                        >
                          <Eye size={16} className="mr-2" />
                          Ver detalles
                        </button>
                      </div>
                    </div>

                    {solicitud.descripcion && (
                      <div className="mb-4 bg-gray-50 p-3 rounded-md">
                        <p className="text-gray-700 text-sm line-clamp-2">{solicitud.descripcion||"texto"}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        <div>
                          <span className="text-xs text-gray-500 block">Fecha de solicitud</span>
                          <span>{formatearFecha(solicitud.fecha_solicitud)}</span>
                        </div>
                      </div>

                      {solicitud.fechaAprobacion && (
                        <div className="flex items-center text-gray-600">
                          <CheckCircle size={16} className="mr-2 text-gray-400" />
                          <div>
                            <span className="text-xs text-gray-500 block">Fecha de aprobación</span>
                            <span>{formatearFecha(solicitud.fecha_solicitud)}</span>
                          </div>
                        </div>
                      )}

                      {solicitud.categoria && (
                        <div className="flex items-center text-gray-600">
                          <Tag size={16} className="mr-2 text-gray-400" />
                          <div>
                            <span className="text-xs text-gray-500 block">Categoría</span>
                            <span>{solicitud.categoria}</span>
                          </div>
                        </div>
                      )}

                      {solicitud.referencia && (
                        <div className="flex items-center text-gray-600">
                          <FileCheck size={16} className="mr-2 text-gray-400" />
                          <div>
                            <span className="text-xs text-gray-500 block">Referencia</span>
                            <span>{solicitud.referencia}</span>
                          </div>
                        </div>
                      )}

                      {/* Información del creador - USANDO SESSIONINFO */}
                      {solicitud.creador && (
                        <div className="flex items-center text-gray-600">
                          <SessionInfo
                            creador={solicitud.creador}
                            variant="compact"
                            className="justify-center md:justify-start"
                          />
                        </div>
                      )}
                    </div>

                    {solicitud.observaciones && (
                      <div className="mt-4 border-t pt-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Observaciones</p>
                        <p className="text-sm text-gray-700">{solicitud.observaciones}</p>
                      </div>
                    )}
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
