"use client"

import { motion } from "framer-motion"
import {
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  Filter,
  PlusCircle,
  Search,
  XCircle
} from "lucide-react"
import { useEffect, useState } from "react"
import CrearSolicitudModal from "@/Components/Solicitudes/Solicitudes/CrearSolicitudModal"
import DetalleSolicitud from "@/Components/Solicitudes/Solicitudes/DetalleSolicitud"

export default function ListaSolicitudes() {
  // Estados para manejar los datos
  const [solicitudes, setSolicitudes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [colegiadoSeleccionado, setColegiadoSeleccionado] = useState(null)
  const [colegiados, setColegiados] = useState([])
  
  // Estados para la navegación interna
  const [vistaActual, setVistaActual] = useState("lista") // lista, detalleSolicitud
  const [solicitudSeleccionadaId, setSolicitudSeleccionadaId] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState("todas") // todas, pendientes, aprobadas, rechazadas
  const [filtroCosto, setFiltroCosto] = useState("todas") // todas, conCosto, sinCosto

  // Simulación de datos - en producción se reemplazaría por llamadas a API
  useEffect(() => {
    // Simulando carga de datos con un pequeño retraso
    setTimeout(() => {
      // Datos de ejemplo de colegiados para el dropdown
      setColegiados([
        {
          id: "1",
          nombre: "María González",
          cedula: "V-12345678",
          numeroRegistro: "ODV-1234",
        },
        {
          id: "2",
          nombre: "Juan Pérez",
          cedula: "V-23456789",
          numeroRegistro: "ODV-2345",
        },
        {
          id: "3",
          nombre: "Carlos Ramírez",
          cedula: "V-34567890",
          numeroRegistro: "ODV-3456",
        },
      ])
      
      // Datos de ejemplo de solicitudes
      setSolicitudes([
        {
          id: "1",
          tipo: "Constancia de inscripción",
          colegiadoId: "1",
          colegiadoNombre: "María González",
          fecha: "15/04/2025",
          estado: "Pendiente",
          urgente: true,
          descripcion: "Solicitud de constancia de inscripción al Colegio de Odontólogos",
          referencia: "CONST-2025-001",
          costo: 20,
          observaciones: "",
          documentosRequeridos: ["Copia de cédula", "Comprobante de pago"],
          documentosAdjuntos: ["cedula.pdf"]
        },
        {
          id: "2",
          tipo: "Registro de especialidad",
          colegiadoId: "2",
          colegiadoNombre: "Juan Pérez",
          fecha: "10/04/2025",
          estado: "Aprobada",
          urgente: false,
          descripcion: "Registro de especialidad en Endodoncia",
          referencia: "ESP-2025-005",
          costo: 50,
          fechaAprobacion: "12/04/2025",
          aprobadoPor: "Admin",
          observaciones: "Verificados todos los documentos",
          documentosRequeridos: ["Título de especialidad", "Copia de cédula", "Comprobante de pago"],
          documentosAdjuntos: ["titulo_especialidad.pdf", "cedula.pdf", "comprobante.pdf"]
        },
        {
          id: "3",
          tipo: "Cambio de jurisdicción",
          colegiadoId: "3",
          colegiadoNombre: "Carlos Ramírez",
          fecha: "05/04/2025",
          estado: "Rechazada",
          urgente: false,
          descripcion: "Cambio de jurisdicción de Caracas a Maracaibo",
          referencia: "CAMB-2025-010",
          costo: 40,
          fechaRechazo: "08/04/2025",
          rechazadoPor: "Admin",
          motivoRechazo: "Documentación incompleta. Falta constancia de residencia",
          documentosRequeridos: ["Constancia de residencia", "Comprobante de pago"],
          documentosAdjuntos: ["comprobante.pdf"]
        },
        {
          id: "4",
          tipo: "Certificado de solvencia",
          colegiadoId: "1",
          colegiadoNombre: "María González",
          fecha: "18/04/2025",
          estado: "Pendiente",
          urgente: false,
          descripcion: "Solicitud de certificado de solvencia",
          referencia: "SOLV-2025-008",
          costo: 15,
          observaciones: "",
          documentosRequeridos: ["Comprobante de pago"],
          documentosAdjuntos: ["comprobante.pdf"]
        },
        {
          id: "5",
          tipo: "Solicitud de información",
          colegiadoId: "2",
          colegiadoNombre: "Juan Pérez",
          fecha: "12/04/2025",
          estado: "Aprobada",
          urgente: false,
          descripcion: "Solicitud de información sobre cursos disponibles",
          referencia: "INFO-2025-015",
          costo: 0,
          fechaAprobacion: "14/04/2025",
          aprobadoPor: "Admin",
          observaciones: "Información enviada por correo electrónico",
          documentosRequeridos: [],
          documentosAdjuntos: []
        },
        {
          id: "6",
          tipo: "Actualización de datos",
          colegiadoId: "3",
          colegiadoNombre: "Carlos Ramírez",
          fecha: "09/04/2025",
          estado: "Aprobada",
          urgente: false,
          descripcion: "Actualización de dirección y teléfono",
          referencia: "ACT-2025-020",
          costo: 0,
          fechaAprobacion: "10/04/2025",
          aprobadoPor: "Admin",
          observaciones: "Datos actualizados correctamente",
          documentosRequeridos: ["Constancia de residencia"],
          documentosAdjuntos: ["residencia.pdf"]
        }
      ])
      
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filtrar solicitudes basado en búsqueda y filtros
  const solicitudesFiltradas = solicitudes.filter(solicitud => {
    const matchesSearch = 
      solicitud.tipo.toLowerCase().includes(searchTerm.toLowerCase()) || 
      solicitud.colegiadoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.referencia.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesEstado = 
      filtroEstado === "todas" || 
      (filtroEstado === "pendientes" && solicitud.estado === "Pendiente") ||
      (filtroEstado === "aprobadas" && solicitud.estado === "Aprobada") ||
      (filtroEstado === "rechazadas" && solicitud.estado === "Rechazada")
    
    const matchesCosto = 
      filtroCosto === "todas" || 
      (filtroCosto === "conCosto" && solicitud.costo > 0) ||
      (filtroCosto === "sinCosto" && solicitud.costo === 0)
    
    return matchesSearch && matchesEstado && matchesCosto
  })

  // Función para ver detalle de una solicitud
  const verDetalleSolicitud = (id) => {
    setSolicitudSeleccionadaId(id)
    setVistaActual("detalleSolicitud")
  }

  // Función para volver a la lista
  const volverALista = () => {
    setVistaActual("lista")
    setSolicitudSeleccionadaId(null)
  }

  // Función para manejar la creación exitosa de una nueva solicitud
  const handleSolicitudCreada = (nuevaSolicitud) => {
    setSolicitudes(prev => [...prev, nuevaSolicitud])
    setShowModal(false)
  }

  // Función para abrir el modal con un colegiado preseleccionado
  const abrirModalParaColegiado = (colegiadoId) => {
    const colegiado = colegiados.find(c => c.id === colegiadoId)
    setColegiadoSeleccionado(colegiado)
    setShowModal(true)
  }

  // Renderizado condicional basado en la vista actual
  if (vistaActual === "detalleSolicitud") {
    return (
      <DetalleSolicitud 
        solicitudId={solicitudSeleccionadaId} 
        onVolver={volverALista}
        solicitudes={solicitudes}
        actualizarSolicitud={(solicitudActualizada) => {
          setSolicitudes(prev => prev.map(s => 
            s.id === solicitudActualizada.id ? solicitudActualizada : s
          ))
        }}
      />
    )
  }

  // Vista principal de lista
  return (
    <div className="w-full px-4 md:px-10 py-10 md:py-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-8 md:mb-10 mt-16 md:mt-22"
      >
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
        >
          Gestión de solicitudes
        </motion.h1>
        <motion.p
          className="mt-4 max-w-full mx-auto text-gray-600 text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Administre las solicitudes de los colegiados y genere nuevas
        </motion.p>
      </motion.div>

      {/* Barra de acciones: Búsqueda, filtros y botón de registro */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por tipo, colegiado o referencia..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity w-full md:w-auto justify-center"
          >
            <PlusCircle size={20} />
            <span>Nueva solicitud</span>
          </button>
        </div>
      </div>

      {/* Filtros adicionales */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Filter size={16} className="mr-2 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtros</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div>
            <span className="text-xs text-gray-500 block mb-1">Estado</span>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroEstado === "todas" 
                    ? "bg-purple-100 text-purple-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroEstado("todas")}
              >
                Todas
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroEstado === "pendientes" 
                    ? "bg-yellow-100 text-yellow-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroEstado("pendientes")}
              >
                Pendientes
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroEstado === "aprobadas" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroEstado("aprobadas")}
              >
                Aprobadas
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroEstado === "rechazadas" 
                    ? "bg-red-100 text-red-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroEstado("rechazadas")}
              >
                Rechazadas
              </button>
            </div>
          </div>
          
          <div>
            <span className="text-xs text-gray-500 block mb-1">Costo</span>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroCosto === "todas" 
                    ? "bg-purple-100 text-purple-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroCosto("todas")}
              >
                Todas
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroCosto === "conCosto" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroCosto("conCosto")}
              >
                Con costo
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroCosto === "sinCosto" 
                    ? "bg-teal-100 text-teal-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroCosto("sinCosto")}
              >
                Sin costo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estado de carga */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
        </div>
      ) : (
        <>
          {/* Lista de solicitudes */}
          {solicitudesFiltradas.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No se encontraron solicitudes con los criterios de búsqueda
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Colegiado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Referencia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
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
                        <div className="text-xs text-gray-500 md:hidden">
                          Ref: {solicitud.referencia}
                        </div>
                        {solicitud.urgente && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                            Urgente
                          </span>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {solicitud.costo > 0 ? `$${solicitud.costo.toFixed(2)}` : 'Sin costo'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{solicitud.colegiadoNombre}</div>
                        <button 
                          className="text-xs text-[#C40180] hover:underline mt-1"
                          onClick={() => abrirModalParaColegiado(solicitud.colegiadoId)}
                        >
                          + Nueva solicitud
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-500">{solicitud.referencia}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-sm text-gray-500">{solicitud.fecha}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          solicitud.estado === 'Pendiente' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : solicitud.estado === 'Aprobada'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {solicitud.estado === 'Pendiente' && <Clock size={12} />}
                          {solicitud.estado === 'Aprobada' && <CheckCircle size={12} />}
                          {solicitud.estado === 'Rechazada' && <XCircle size={12} />}
                          {solicitud.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {(solicitud.estado === 'Aprobada' && solicitud.costo > 0) && (
                            <button className="text-blue-600 hover:text-blue-800">
                              <Download size={16} />
                            </button>
                          )}
                          <button 
                            onClick={() => verDetalleSolicitud(solicitud.id)}
                            className="text-[#C40180] hover:text-[#590248] flex items-center justify-end gap-1"
                          >
                            {solicitud.estado === 'Pendiente' ? 'Revisar' : 'Ver'}
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      
      {/* Modal para crear nueva solicitud */}
      {showModal && (
        <CrearSolicitudModal 
          onClose={() => {
            setShowModal(false)
            setColegiadoSeleccionado(null)
          }}
          onSolicitudCreada={handleSolicitudCreada}
          colegiados={colegiados}
          colegiadoPreseleccionado={colegiadoSeleccionado}
        />
      )}
    </div>
  )
}