"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Book, Calendar, Download, Search, MapPin, Users, Award, ChevronLeft } from "lucide-react"

export default function TablaInscripciones({ colegiadoId, onVolver }) {
  const [datosAsistencia, setDatosAsistencia] = useState([])
  const [datosPagos, setDatosPagos] = useState([])
  const [estadisticasGenerales, setEstadisticasGenerales] = useState([])
  const [inscripciones, setInscripciones] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Simulación de carga de datos
  useEffect(() => {
    const fetchInscripciones = async () => {
      try {
        // Simulamos la carga con un setTimeout
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Datos de ejemplo
        setInscripciones([
          {
            id: "1",
            nombre: "Curso avanzado de ortodoncia",
            tipo: "Curso",
            fecha: "15/02/2024 - 18/02/2024",
            lugar: "Centro de Convenciones, Caracas",
            estado: "Completado",
            certificado: true,
            ponentes: "Dr. Carlos Ramírez, Dr. Juan Pérez",
            creditos: 20
          },
          {
            id: "2",
            nombre: "Congreso Nacional de Odontología 2024",
            tipo: "Congreso",
            fecha: "05/03/2024 - 07/03/2024",
            lugar: "Hotel Eurobuilding, Caracas",
            estado: "Completado",
            certificado: true,
            ponentes: "Varios especialistas nacionales e internacionales",
            creditos: 30
          },
          {
            id: "3",
            nombre: "Taller de actualización en materiales dentales",
            tipo: "Taller",
            fecha: "20/03/2024",
            lugar: "Sede COV, Caracas",
            estado: "Completado",
            certificado: true,
            ponentes: "Dra. María González",
            creditos: 8
          },
          {
            id: "4",
            nombre: "Seminario de gestión de consultorios odontológicos",
            tipo: "Seminario",
            fecha: "10/04/2024 - 11/04/2024",
            lugar: "Virtual (Zoom)",
            estado: "En curso",
            certificado: false,
            ponentes: "Dr. Pedro Blanco, Dra. Ana Torres",
            creditos: 10
          },
          {
            id: "5",
            nombre: "Simposio de endodoncia moderna",
            tipo: "Simposio",
            fecha: "15/05/2024 - 16/05/2024",
            lugar: "Hotel Renaissance, Caracas",
            estado: "Próximo",
            certificado: false,
            ponentes: "Especialistas invitados",
            creditos: 15
          }
        ])
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error al cargar las inscripciones:", error)
        setIsLoading(false)
      }
    }
    
    fetchInscripciones()
  }, [colegiadoId])

  // Filtrar inscripciones según el término de búsqueda
  const inscripcionesFiltradas = inscripciones.filter(inscripcion => 
    inscripcion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inscripcion.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inscripcion.fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inscripcion.lugar.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inscripcion.estado.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Datos para la estadística
  const totalInscripciones = inscripciones.length
  const inscripcionesCompletadas = inscripciones.filter(i => i.estado === "Completado").length
  const totalCreditos = inscripciones.reduce((total, inscripcion) => total + inscripcion.creditos, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Cursos y eventos</h3>
          <p className="text-sm text-gray-500 mt-1">Inscripciones a cursos, congresos y eventos</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar inscripción..."
              className="pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Resumen de inscripciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Total inscripciones</p>
          <p className="text-xl font-semibold text-purple-600 flex items-center">
            <Book size={20} className="mr-2" />
            {totalInscripciones}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Eventos completados</p>
          <p className="text-xl font-semibold text-green-600 flex items-center">
            <Calendar size={20} className="mr-2" />
            {inscripcionesCompletadas}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Total créditos académicos</p>
          <p className="text-xl font-semibold text-blue-600 flex items-center">
            <Award size={20} className="mr-2" />
            {totalCreditos}
          </p>
        </div>
      </div>
      
      {/* Tabla de inscripciones */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
        </div>
      ) : (
        <>
          {inscripcionesFiltradas.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="flex justify-center mb-4">
                <Book size={48} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-500">No se encontraron inscripciones</h3>
              <p className="text-gray-400 mt-1">No hay registros de inscripciones que coincidan con tu búsqueda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inscripcionesFiltradas.map(inscripcion => (
                <div key={inscripcion.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div className="mb-4 sm:mb-0">
                        <h4 className="text-lg font-medium text-gray-900">{inscripcion.nombre}</h4>
                        <p className="text-sm text-gray-500 mt-1">{inscripcion.tipo}</p>
                      </div>
                      
                      <div className="flex items-start">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          inscripcion.estado === 'Completado' 
                            ? 'bg-green-100 text-green-800' 
                            : inscripcion.estado === 'En curso'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {inscripcion.estado}
                        </span>
                        
                        {inscripcion.certificado && (
                          <button className="ml-2 text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            <Download size={16} />
                            <span className="text-xs">Certificado</span>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-start">
                        <Calendar className="text-gray-400 h-5 w-5 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Fecha</p>
                          <p className="text-sm font-medium">{inscripcion.fecha}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MapPin className="text-gray-400 h-5 w-5 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Lugar</p>
                          <p className="text-sm font-medium">{inscripcion.lugar}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Users className="text-gray-400 h-5 w-5 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Ponentes</p>
                          <p className="text-sm font-medium">{inscripcion.ponentes}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Award className="text-gray-400 h-5 w-5 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Créditos académicos</p>
                          <p className="text-sm font-medium">{inscripcion.creditos}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Botón para volver */}
      {onVolver && (
        <div className="mt-6">
          <button
            onClick={onVolver}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <ChevronLeft size={18} />
            <span>Volver a la lista</span>
          </button>
        </div>
      )}
    </div>
  )
}