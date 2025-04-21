"use client"

import { useState, useEffect } from "react"
import { FileText, Search, Clock, CheckCircle, XCircle, AlertTriangle, Eye, Calendar } from "lucide-react"

export default function TablaSolicitudes({ colegiadoId }) {
  const [solicitudes, setSolicitudes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Simulación de carga de datos
  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        // Simulamos la carga con un setTimeout
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Datos de ejemplo
        setSolicitudes([
          {
            id: "1",
            tipo: "Constancia de inscripción",
            fecha: "10/01/2024",
            estado: "Completada",
            referencia: "CONST-2024-001",
            costo: 20.00,
            descripcion: "Constancia de inscripción en el Colegio de Odontólogos",
            fechaCompletada: "12/01/2024",
            urgente: false
          },
          {
            id: "2",
            tipo: "Registro de especialidad",
            fecha: "15/02/2024",
            estado: "Completada",
            referencia: "ESP-2024-005",
            costo: 50.00,
            descripcion: "Registro de especialidad en Ortodoncia",
            fechaCompletada: "22/02/2024",
            urgente: false
          },
          {
            id: "3",
            tipo: "Renovación de carnet",
            fecha: "25/02/2024",
            estado: "Completada",
            referencia: "CARNET-2024-078",
            costo: 30.00,
            descripcion: "Renovación de carnet COV",
            fechaCompletada: "27/02/2024",
            urgente: true
          },
          {
            id: "4",
            tipo: "Constancia de solvencia",
            fecha: "05/03/2024",
            estado: "En proceso",
            referencia: "SOLV-2024-045",
            costo: 15.00,
            descripcion: "Constancia de solvencia de pagos",
            fechaCompletada: null,
            urgente: false
          },
          {
            id: "5",
            tipo: "Cambio de jurisdicción",
            fecha: "10/04/2024",
            estado: "Pendiente",
            referencia: "CAMB-2024-012",
            costo: 40.00,
            descripcion: "Cambio de jurisdicción de Caracas a Maracaibo",
            fechaCompletada: null,
            urgente: false
          }
        ])
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error al cargar las solicitudes:", error)
        setIsLoading(false)
      }
    }
    
    fetchSolicitudes()
  }, [colegiadoId])

  // Filtrar solicitudes según el término de búsqueda
  const solicitudesFiltradas = solicitudes.filter(solicitud => 
    solicitud.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitud.referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitud.fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitud.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitud.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'Completada':
        return <CheckCircle size={18} className="text-green-500" />
      case 'En proceso':
        return <Clock size={18} className="text-blue-500" />
      case 'Pendiente':
        return <AlertTriangle size={18} className="text-yellow-500" />
      case 'Rechazada':
        return <XCircle size={18} className="text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Solicitudes</h3>
          <p className="text-sm text-gray-500 mt-1">Historial de solicitudes y trámites</p>
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
      
      {/* Tabla de solicitudes */}
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referencia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha solicitud
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Costo
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {solicitudesFiltradas.map((solicitud) => (
                      <tr key={solicitud.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{solicitud.tipo}</div>
                          <div className="text-xs text-gray-500">{solicitud.descripcion}</div>
                          {solicitud.urgente && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                              Urgente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {solicitud.referencia}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1 text-gray-400" />
                            {solicitud.fecha}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(solicitud.estado)}
                            <span className={`ml-1.5 text-sm font-medium ${
                              solicitud.estado === 'Completada' 
                                ? 'text-green-800' 
                                : solicitud.estado === 'En proceso'
                                  ? 'text-blue-800'
                                  : solicitud.estado === 'Pendiente'
                                    ? 'text-yellow-800'
                                    : 'text-red-800'
                            }`}>
                              {solicitud.estado}
                            </span>
                          </div>
                          {solicitud.fechaCompletada && (
                            <div className="text-xs text-gray-500 mt-1">
                              Completada: {solicitud.fechaCompletada}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${solicitud.costo.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-[#C40180] hover:text-[#590248] flex items-center justify-end gap-1">
                            <Eye size={16} />
                            <span>Ver detalles</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}