"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PlusCircle, Search, ChevronRight, CheckCircle, XCircle, ChevronLeft } from "lucide-react"
import RegistrarColegiadoModal from "@/app/PanelControl/Components/Solicitudes/ListaColegiados/RegistrarColegiaModal"
import DetalleColegiado from "@/app/PanelControl/Components/Solicitudes/ListaColegiados/DetalleColegiado"
import DetallePendiente from "@/app/PanelControl/Components/Solicitudes/ListaColegiados/DetallePendiente"

export default function ListaColegiados() {
  // Estados para manejar los datos
  const [colegiados, setColegiados] = useState([])
  const [colegiadosPendientes, setColegiadosPendientes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  
  // Estados para la navegación interna
  const [vistaActual, setVistaActual] = useState("lista") // lista, detalleColegiado, detallePendiente
  const [colegiadoSeleccionadoId, setColegiadoSeleccionadoId] = useState(null)
  const [tabActivo, setTabActivo] = useState("registrados") // registrados o pendientes
  const [filtroSolvencia, setFiltroSolvencia] = useState("todos") // todos, solventes, insolventes

  // Simulación de datos - en producción se reemplazaría por llamadas a API
  useEffect(() => {
    // Simulando carga de datos con un pequeño retraso
    setTimeout(() => {
      setColegiados([
        {
          id: "1",
          nombre: "María González",
          cedula: "V-12345678",
          numeroRegistro: "ODV-1234",
          email: "maria.gonzalez@mail.com",
          telefono: "+58 412-1234567",
          fechaRegistro: "12/04/2023",
          estado: "Activo",
          solvente: true,
          especialidad: "Ortodoncia"
        },
        {
          id: "2",
          nombre: "Juan Pérez",
          cedula: "V-23456789",
          numeroRegistro: "ODV-2345",
          email: "juan.perez@mail.com",
          telefono: "+58 414-7654321",
          fechaRegistro: "15/05/2023",
          estado: "Activo",
          solvente: false,
          especialidad: "Endodoncia"
        },
        // Más colegiados aquí...
      ])
      
      setColegiadosPendientes([
        {
          id: "p1",
          nombre: "Carlos Ramírez",
          cedula: "V-34567890",
          email: "carlos.ramirez@mail.com",
          telefono: "+58 416-7777777",
          fechaSolicitud: "10/04/2024",
          documentosCompletos: true
        },
        {
          id: "p2",
          nombre: "Ana López",
          cedula: "V-45678901",
          email: "ana.lopez@mail.com",
          telefono: "+58 424-8888888",
          fechaSolicitud: "11/04/2024",
          documentosCompletos: false
        },
        // Más colegiados pendientes aquí...
      ])
      
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filtrar colegiados basado en búsqueda y filtros
  const colegiadosFiltrados = colegiados.filter(colegiado => {
    const matchesSearch = colegiado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          colegiado.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          colegiado.numeroRegistro.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filtroSolvencia === "todos") return matchesSearch
    if (filtroSolvencia === "solventes") return matchesSearch && colegiado.solvente
    if (filtroSolvencia === "insolventes") return matchesSearch && !colegiado.solvente
    
    return matchesSearch
  })

  const colegiadosPendientesFiltrados = colegiadosPendientes.filter(colegiado => 
    colegiado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    colegiado.cedula.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Función para ver detalle de un colegiado
  const verDetalleColegiado = (id) => {
    setColegiadoSeleccionadoId(id)
    setVistaActual("detalleColegiado")
  }

  // Función para ver detalle de un pendiente
  const verDetallePendiente = (id) => {
    setColegiadoSeleccionadoId(id)
    setVistaActual("detallePendiente")
  }

  // Función para volver a la lista
  const volverALista = () => {
    setVistaActual("lista")
    setColegiadoSeleccionadoId(null)
  }

  // Función para manejar el registro exitoso de un nuevo colegiado
  const handleRegistroExitoso = (nuevoColegiado) => {
    // Dependiendo de si es un colegiado completo o una solicitud pendiente
    if (nuevoColegiado.numeroRegistro) {
      setColegiados(prev => [...prev, nuevoColegiado])
    } else {
      setColegiadosPendientes(prev => [...prev, nuevoColegiado])
    }
    setShowModal(false)
  }

  // Renderizado condicional basado en la vista actual
  if (vistaActual === "detalleColegiado") {
    return (
      <DetalleColegiado 
        params={{ id: colegiadoSeleccionadoId }} 
        onVolver={volverALista}
      />
    )
  }

  if (vistaActual === "detallePendiente") {
    return (
      <DetallePendiente 
        params={{ id: colegiadoSeleccionadoId }}
        onVolver={volverALista}
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
          Lista de colegiados
        </motion.h1>
        <motion.p
          className="mt-4 max-w-full mx-auto text-gray-600 text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Administre los colegiados registrados y apruebe nuevas solicitudes
        </motion.p>
      </motion.div>

      {/* Barra de acciones: Búsqueda, filtros y botón de registro */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, cédula o registro..."
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
            <span>Registrar nuevo</span>
          </button>
        </div>
      </div>

      {/* Tabs para alternar entre colegiados registrados y pendientes */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          <button
            className={`py-4 px-1 font-medium text-sm sm:text-base border-b-2 ${
              tabActivo === "registrados" 
                ? "border-[#C40180] text-[#C40180]" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            } transition-colors`}
            onClick={() => setTabActivo("registrados")}
          >
            Colegiados registrados ({colegiados.length})
          </button>
          <button
            className={`py-4 px-1 font-medium text-sm sm:text-base border-b-2 ${
              tabActivo === "pendientes" 
                ? "border-[#C40180] text-[#C40180]" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            } transition-colors relative`}
            onClick={() => setTabActivo("pendientes")}
          >
            Pendientes de aprobación ({colegiadosPendientes.length})
            {colegiadosPendientes.length > 0 && (
              <span className="absolute top-3 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {colegiadosPendientes.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Filtros adicionales para colegiados registrados */}
      {tabActivo === "registrados" && (
        <div className="mb-6 flex flex-wrap gap-3">
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filtroSolvencia === "todos" 
                ? "bg-purple-100 text-purple-800" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setFiltroSolvencia("todos")}
          >
            Todos
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filtroSolvencia === "solventes" 
                ? "bg-green-100 text-green-800" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setFiltroSolvencia("solventes")}
          >
            Solventes
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filtroSolvencia === "insolventes" 
                ? "bg-red-100 text-red-800" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setFiltroSolvencia("insolventes")}
          >
            Insolventes
          </button>
        </div>
      )}

      {/* Estado de carga */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
        </div>
      ) : (
        <>
          {/* Lista de colegiados según el tab activo */}
          {tabActivo === "registrados" ? (
            <div>
              {colegiadosFiltrados.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No se encontraron colegiados con los criterios de búsqueda
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Cédula
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          N° Registro
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                          Especialidad
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
                      {colegiadosFiltrados.map((colegiado) => (
                        <tr key={colegiado.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{colegiado.nombre}</div>
                            <div className="text-sm text-gray-500 md:hidden">{colegiado.cedula}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                            {colegiado.cedula}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                            {colegiado.numeroRegistro}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                            {colegiado.especialidad}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              colegiado.solvente 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {colegiado.solvente ? 'Solvente' : 'Insolvente'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => verDetalleColegiado(colegiado.id)}
                              className="text-[#C40180] hover:text-[#590248] flex items-center justify-end gap-1"
                            >
                              Ver detalles
                              <ChevronRight size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div>
              {colegiadosPendientesFiltrados.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No hay solicitudes pendientes de aprobación
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Cédula
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Fecha solicitud
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Documentos
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {colegiadosPendientesFiltrados.map((colegiado) => (
                        <tr key={colegiado.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{colegiado.nombre}</div>
                            <div className="text-sm text-gray-500 md:hidden">{colegiado.cedula}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                            {colegiado.cedula}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                            {colegiado.fechaSolicitud}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              colegiado.documentosCompletos 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {colegiado.documentosCompletos 
                                ? <><CheckCircle size={12} /> Completos</> 
                                : <><XCircle size={12} /> Incompletos</>}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => verDetallePendiente(colegiado.id)}
                              className="text-[#C40180] hover:text-[#590248] flex items-center justify-end gap-1"
                            >
                              Revisar
                              <ChevronRight size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
      
      {/* Modal para registrar nuevo colegiado */}
      {showModal && (
        <RegistrarColegiadoModal 
          onClose={() => setShowModal(false)}
          onRegistroExitoso={handleRegistroExitoso}
        />
      )}
    </div>
  )
}