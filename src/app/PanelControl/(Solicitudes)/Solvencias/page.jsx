"use client"

import CrearSolvenciaModal from "@/Components/SolicitudesSolvencia/CrearSolvenciaModal"
import DateRangePicker from "@/Components/SolicitudesSolvencia/DateRangePicker"
import DetalleSolvencia from "@/Components/SolicitudesSolvencia/DetalleSolvencia"
import { colegiados as colegiadosIniciales, solvencias as solvenciasIniciales } from "@/app/Models/PanelControl/Solicitudes/SolvenciaData"
import { motion } from "framer-motion"
import {
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  Filter,
  PlusCircle,
  Search,
  Shield,
  User,
  XCircle
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

export default function ListaSolvencias() {
  // Estados para manejar los datos
  const [solvencias, setSolvencias] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [colegiadoSeleccionado, setColegiadoSeleccionado] = useState(null)
  const [colegiados, setColegiados] = useState([])
  const [showDateFilter, setShowDateFilter] = useState(false)

  // Estados para la navegación interna
  const [vistaActual, setVistaActual] = useState("lista") // lista, detalleSolvencia
  const [solvenciaSeleccionadaId, setSolvenciaSeleccionadaId] = useState(null)
  const [tabActual, setTabActual] = useState("todas") // todas, revision, aprobadas, rechazadas
  const [filtroCosto, setFiltroCosto] = useState("todas") // todas, conCosto, sinCosto
  
  // Estados para filtros de fecha
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [ordenFecha, setOrdenFecha] = useState("desc") // asc, desc

  // Cargar datos iniciales
  useEffect(() => {
    // Simulando carga de datos con un pequeño retraso
    setTimeout(() => {
      setColegiados(colegiadosIniciales);
      setSolvencias(solvenciasIniciales);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Determinar si mostrar por defecto aprobadas cuando no hay en revisión
  useEffect(() => {
    if (!isLoading) {
      const existenRevision = solvencias.some(s => s.estado === "Revisión");
      if (tabActual === "revision" && !existenRevision) {
        setTabActual("aprobadas");
      }
    }
  }, [solvencias, isLoading, tabActual]);

  // Conteo de solvencias por estado para los tabs
  const conteoSolvencias = useMemo(() => ({
    revision: solvencias.filter(s => s.estado === "Revisión").length,
    aprobadas: solvencias.filter(s => s.estado === "Aprobada").length,
    rechazadas: solvencias.filter(s => s.estado === "Rechazada").length,
  }), [solvencias]);

  // Convertir string de fecha (formato DD/MM/YYYY) a objeto Date
  const parseStringToDate = (dateString) => {
    if (!dateString) return null;
    const [dia, mes, anio] = dateString.split('/');
    return new Date(anio, mes - 1, dia);
  }

  // Filtrar solvencias basado en búsqueda, tab actual, filtro de costo y rango de fechas
  const solvenciasFiltradas = useMemo(() => {
    return solvencias
      .filter(solvencia => {
        // Filtro de búsqueda
        const matchesSearch =
          searchTerm === "" ||
          solvencia.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          solvencia.colegiadoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          solvencia.referencia.toLowerCase().includes(searchTerm.toLowerCase())

        // Filtro por tab/estado
        const matchesTab =
          tabActual === "todas" ||
          (tabActual === "revision" && solvencia.estado === "Revisión") ||
          (tabActual === "aprobadas" && solvencia.estado === "Aprobada") ||
          (tabActual === "rechazadas" && solvencia.estado === "Rechazada")

        // Filtro por costo
        const matchesCosto =
          filtroCosto === "todas" ||
          (filtroCosto === "conCosto" && solvencia.costo > 0) ||
          (filtroCosto === "sinCosto" && solvencia.costo === 0)

        // Filtro por rango de fechas
        let matchesFechas = true;
        if (fechaInicio && fechaFin) {
          const fechaSolvencia = parseStringToDate(solvencia.fecha);
          const inicio = parseStringToDate(fechaInicio);
          const fin = parseStringToDate(fechaFin);
          
          if (fechaSolvencia && inicio && fin) {
            // Ajustar fin para incluir todo el día
            fin.setHours(23, 59, 59, 999);
            matchesFechas = fechaSolvencia >= inicio && fechaSolvencia <= fin;
          }
        }

        return matchesSearch && matchesTab && matchesCosto && matchesFechas;
      })
      .sort((a, b) => {
        // Convertir fechas de formato DD/MM/YYYY a objetos Date
        const [diaA, mesA, anioA] = a.fecha.split('/');
        const [diaB, mesB, anioB] = b.fecha.split('/');

        const fechaA = new Date(anioA, mesA - 1, diaA);
        const fechaB = new Date(anioB, mesB - 1, diaB);

        // Ordenar según la preferencia (ascendente o descendente)
        return ordenFecha === "desc" ? fechaB - fechaA : fechaA - fechaB;
      });
  }, [solvencias, searchTerm, tabActual, filtroCosto, fechaInicio, fechaFin, ordenFecha]);

  // Función para ver detalle de una solvencia
  const verDetalleSolvencia = (id) => {
    setSolvenciaSeleccionadaId(id)
    setVistaActual("detalleSolvencia")
  }

  // Función para volver a la lista
  const volverALista = () => {
    setVistaActual("lista")
    setSolvenciaSeleccionadaId(null)
  }

  // Función para manejar la creación exitosa de una nueva solvencia
  const handleSolvenciaCreada = (nuevaSolvencia) => {
    setSolvencias(prev => [nuevaSolvencia, ...prev]); // Añadir al principio del array
  }

  // Función para abrir el modal con un colegiado preseleccionado
  const abrirModalParaColegiado = (event, colegiadoId) => {
    // Detener la propagación para evitar que el clic llegue a la fila
    event.stopPropagation();

    const colegiado = colegiados.find(c => c.id === colegiadoId)
    setColegiadoSeleccionado(colegiado)
    setShowModal(true)
  }

  // Actualizar una solvencia existente
  const actualizarSolvencia = (solvenciaActualizada) => {
    setSolvencias(prev => prev.map(s =>
      s.id === solvenciaActualizada.id ? solvenciaActualizada : s
    ))
  }

  // Toggle del orden de fecha
  const toggleOrdenFecha = () => {
    setOrdenFecha(prev => prev === "desc" ? "asc" : "desc");
  }

  // Limpiar filtros de fecha
  const limpiarFiltrosFecha = () => {
    setFechaInicio("");
    setFechaFin("");
    setShowDateFilter(false);
  }

  // Renderizado condicional basado en la vista actual
  if (vistaActual === "detalleSolvencia") {
    return (
      <DetalleSolvencia
        solvenciaId={solvenciaSeleccionadaId}
        onVolver={volverALista}
        solvencias={solvencias}
        actualizarSolvencia={actualizarSolvencia}
      />
    )
  }

  // Vista principal de lista
  return (
    <div className="select-none cursor-default w-full px-4 md:px-10 py-10 md:py-12">
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
          Gestión de solvencias
        </motion.h1>
        <motion.p
          className="mt-4 max-w-full mx-auto text-gray-600 text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Administre las solvencias de los colegiados y genere nuevas
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
            onClick={() => setShowDateFilter(!showDateFilter)}
            className="cursor-pointer border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors w-full md:w-auto justify-center"
          >
            <Calendar size={20} />
            <span>Filtrar por fecha</span>
          </button>
          
          <button
            onClick={() => {
              setColegiadoSeleccionado(null);
              setShowModal(true);
            }}
            className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity w-full md:w-auto justify-center"
          >
            <PlusCircle size={20} />
            <span>Nueva solvencia</span>
          </button>
        </div>
      </div>

      {/* Filtro de fecha emergente */}
      {showDateFilter && (
        <div className="mb-6 p-4 border rounded-lg bg-white shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-800">Filtrar por rango de fechas</h3>
            <button 
              onClick={limpiarFiltrosFecha}
              className="text-sm text-[#C40180] hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <DateRangePicker 
                fechaInicio={fechaInicio}
                fechaFin={fechaFin}
                setFechaInicio={setFechaInicio}
                setFechaFin={setFechaFin}
              />
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={toggleOrdenFecha}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <span>Orden: {ordenFecha === "desc" ? "Más recientes primero" : "Más antiguos primero"}</span>
                <ChevronDown className={`transition-transform ${ordenFecha === "asc" ? "rotate-180" : ""}`} size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs para filtrar por estado */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex overflow-x-auto">
            <button
              onClick={() => setTabActual("todas")}
              className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${tabActual === "todas"
                  ? "border-[#C40180] text-[#C40180]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Todas las solvencias
            </button>
            <button
              onClick={() => setTabActual("revision")}
              className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${tabActual === "revision"
                  ? "border-[#C40180] text-[#C40180]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              En revisión
              {conteoSolvencias.revision > 0 && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {conteoSolvencias.revision}
                </span>
              )}
            </button>
            <button
              onClick={() => setTabActual("aprobadas")}
              className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${tabActual === "aprobadas"
                  ? "border-[#C40180] text-[#C40180]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Aprobadas
              {conteoSolvencias.aprobadas > 0 && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {conteoSolvencias.aprobadas}
                </span>
              )}
            </button>
            <button
              onClick={() => setTabActual("rechazadas")}
              className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${tabActual === "rechazadas"
                  ? "border-[#C40180] text-[#C40180]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Rechazadas
              {conteoSolvencias.rechazadas > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {conteoSolvencias.rechazadas}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Filtros de costo - mostrar en todos los tabs */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Filter size={16} className="mr-2 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtros de costo</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium ${filtroCosto === "todas"
                ? "bg-purple-100 text-purple-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            onClick={() => setFiltroCosto("todas")}
          >
            Todas
          </button>
          <button
            className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium ${filtroCosto === "conCosto"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            onClick={() => setFiltroCosto("conCosto")}
          >
            Con costo
          </button>
          <button
            className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium ${filtroCosto === "sinCosto"
                ? "bg-teal-100 text-teal-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            onClick={() => setFiltroCosto("sinCosto")}
          >
            Sin costo
          </button>
        </div>
      </div>

      {/* Estado de carga */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
        </div>
      ) : (
        <>
          {/* Lista de solvencias */}
          {solvenciasFiltradas.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                {tabActual === "revision" && <Clock className="h-8 w-8 text-yellow-500" />}
                {tabActual === "aprobadas" && <CheckCircle className="h-8 w-8 text-green-500" />}
                {tabActual === "rechazadas" && <XCircle className="h-8 w-8 text-red-500" />}
                {tabActual === "todas" && <Search className="h-8 w-8 text-gray-400" />}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {tabActual === "revision" && "No hay solvencias en revisión"}
                {tabActual === "aprobadas" && "No hay solvencias aprobadas"}
                {tabActual === "rechazadas" && "No hay solvencias rechazadas"}
                {tabActual === "todas" && "No se encontraron solvencias"}
                {filtroCosto !== "todas" && (
                  <span>
                    {" "}
                    {filtroCosto === "conCosto" ? "con costo" : "sin costo"}
                  </span>
                )}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || fechaInicio || fechaFin
                  ? "Intenta cambiar los criterios de búsqueda o filtros de fecha"
                  : "Puede crear una nueva solvencia usando el botón superior"}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Colegiado
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Referencia
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {solvenciasFiltradas.map((solvencia) => (
                    <tr
                      key={solvencia.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => verDetalleSolvencia(solvencia.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="font-medium text-gray-900">{solvencia.tipo}</div>
                        <div className="text-xs text-gray-500 md:hidden">
                          Ref: {solvencia.referencia}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {solvencia.costo > 0 ? `${solvencia.costo.toFixed(2)}` : 'Sin costo'}
                        </div>
                        {/* Mostrar información del creador */}
                        {solvencia.creador && (
                          <div className="flex items-center justify-center mt-1 text-xs text-gray-500">
                            {solvencia.creador.esAdmin ? (
                              <Shield size={12} className="mr-1 text-purple-500" />
                            ) : (
                              <User size={12} className="mr-1 text-gray-400" />
                            )}
                            <span>
                              Creado por {solvencia.creador.nombre || "Usuario"}
                              {solvencia.creador.esAdmin && (
                                <span className="ml-1 text-xs bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-[10px]">
                                  Admin
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">{solvencia.colegiadoNombre}</div>
                        <button
                          className="cursor-grab text-xs text-[#C40180] hover:underline mt-1"
                          onClick={(e) => abrirModalParaColegiado(e, solvencia.colegiadoId)}
                        >
                          + Nueva solvencia
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center hidden md:table-cell">
                        <div className="text-sm text-gray-500">{solvencia.referencia}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell">
                        <div className="text-sm text-gray-500">{solvencia.fecha}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          solvencia.estado === 'Revisión'
                            ? 'bg-yellow-100 text-yellow-800'
                            : solvencia.estado === 'Aprobada'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                          {solvencia.estado === 'Revisión' && <Clock size={12} />}
                          {solvencia.estado === 'Aprobada' && <CheckCircle size={12} />}
                          {solvencia.estado === 'Rechazada' && <XCircle size={12} />}
                          {solvencia.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modal para crear nueva solvencia */}
      {showModal && (
        <CrearSolvenciaModal
          onClose={() => {
            setShowModal(false);
            setColegiadoSeleccionado(null);
          }}
          onSolvenciaCreada={handleSolvenciaCreada}
          colegiados={colegiados}
          colegiadoPreseleccionado={colegiadoSeleccionado}
          onVerDetalle={verDetalleSolvencia}
          session={{
            user: {
              name: "Administrador",
              email: "admin@ejemplo.com",
              role: "admin",
              isAdmin: true
            }
          }}
        />
      )}
    </div>
  )
}