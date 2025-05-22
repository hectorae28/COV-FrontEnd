"use client"

import CrearSolvenciaModal from "@/Components/SolicitudesSolvencia/CrearSolvenciaModal"
import DateRangePicker from "@/Components/SolicitudesSolvencia/DateRangePicker"
import DetalleSolvencia from "@/Components/SolicitudesSolvencia/DetalleSolvencia"
import { motion } from "framer-motion"
import {
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  CreditCard,
  PlusCircle,
  Search,
  Shield,
  XCircle
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useSolicitudesStore } from "@/store/SolicitudesStore"

export default function ListaSolvencias() {
  // Estados para manejar los datos
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [colegiadoSeleccionado, setColegiadoSeleccionado] = useState(null);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroCreador, setFiltroCreador] = useState("todos");
  
  // Estados para la navegación interna
  const [vistaActual, setVistaActual] = useState("lista");
  const [solvenciaSeleccionadaId, setSolvenciaSeleccionadaId] = useState(null);
  const [tabActual, setTabActual] = useState("revision");
  const [filtroCosto, setFiltroCosto] = useState("todas");
  
  // Estados para filtros de fecha
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [ordenFecha, setOrdenFecha] = useState("desc");
  const fetchSolicitudesDeSolvencia = useSolicitudesStore((state) => state.fetchSolicitudesDeSolvencia);
  const solicitudesDeSolvencia = useSolicitudesStore((state) => state.solicitudesDeSolvencia);

  // Cargar datos iniciales
  useEffect(() =>  {
    fetchSolicitudesDeSolvencia();
    setIsLoading(false);    
  }, [fetchSolicitudesDeSolvencia]);

  // Determinar si mostrar por defecto aprobadas cuando no hay en revisión
  useEffect(() => {
    if (!isLoading) {
      const existenRevision = solicitudesDeSolvencia.some(s => s.statusSolicitud === "revisando");
      if (tabActual === "revision" && !existenRevision) {
        setTabActual("aprobadas");
      }
    }
    console.log('EPA VIENDO LAS SOLICITUDES', solicitudesDeSolvencia);
  },[solicitudesDeSolvencia]);

  // Conteo de solvencias por estado para los tabs

const conteoSolvencias = useMemo(() => ({
  // En "todas" solo contar las que no están aprobadas ni rechazadas
  todas: solicitudesDeSolvencia.filter(s => s.statusSolicitud !== "aprobado"
                                        && s.statusSolicitud !== "rechazado").length,
  // En "revision" solo contar las en estado de Revisión
  revision: solicitudesDeSolvencia.filter(s => s.statusSolicitud === "revisando").length,
  // En "aprobadas" solo contar las aprobadas
  aprobadas: solicitudesDeSolvencia.filter(s => s.statusSolicitud === "aprobado").length,
  // En "rechazadas" solo contar las rechazadas
  rechazadas: solicitudesDeSolvencia.filter(s => s.statusSolicitud === "rechazado").length,
  // En "admin" solo contar las creadas por admin que no estén aprobadas ni rechazadas
  admin: solicitudesDeSolvencia.filter(s => s.creador.isAdmin &&
    s.statusSolicitud !== "aprobado" && 
    s.statusSolicitud !== "rechazado"
  ).length,
  
  // En "colegiado" solo contar las creadas por colegiado que no estén aprobadas ni rechazadas
  colegiado: solicitudesDeSolvencia.filter(s => 
    !s.creador.isAdmin &&
    s.statusSolicitud !== "aprobado" && 
    s.statusSolicitud !== "rechazado"
  ).length,
  
  // En "costo_especial" contar todas las que tienen costo null
  solicitudCosto: solicitudesDeSolvencia.filter(s => s.statusSolicitud === "costo_especial").length,
  
  // Conteos adicionales que puedan ser útiles
  conCosto: solicitudesDeSolvencia.filter(s => s.costoRegularSolicitud >= 0).length,
  sinCosto: solicitudesDeSolvencia.filter(s => s.costoRegularSolicitud < 0).length
}), [solicitudesDeSolvencia]);

  // Convertir string de fecha (formato DD/MM/YYYY) a objeto Date
  const parseStringToDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day);
  }

  // Filtrar solvencias basado en búsqueda, tab actual y rango de fechas
  const solvenciasFiltradas = useMemo(() => {
    return solicitudesDeSolvencia
      .filter(solvencia => {
        // Filtro de búsqueda
        const matchesSearch =
          searchTerm === "" ||
          solvencia.nombreColegiado.toLowerCase().includes(searchTerm.toLowerCase())

        // Filtro por tab/estado principal (SIMPLIFICADO - ya no incluye "todas")
        let matchesTab = true;

        // Lógica para cada pestaña
        /*if (tabActual === "admin") {
          // En "admin" mostrar solo las que no estén aprobadas ni rechazadas y sean creadas por admin
          matchesTab = solvencia.creadoPor &&
                      solvencia.statusSolicitud !== "aprobado" &&
                      solvencia.statusSolicitud !== "rechazado";

          // Si hay filtro específico de estado, aplicarlo
          if (filtroEstado !== "todos") {
            matchesTab = solvencia.creadoPor && solvencia.statusSolicitud === (
              filtroEstado === "revisando" ? "Revisión" :
              filtroEstado === "aprobadas" ? "Aprobada" :
              "Rechazada"
            );
          }
        } else if (tabActual === "colegiado") {
          // En "colegiado" mostrar solo las que no estén aprobadas ni rechazadas y no sean creadas por admin
          matchesTab = solvencia.creadoPor === null &&
                      solvencia.statusSolicitud !== "aprobado" &&
                      solvencia.statusSolicitud !== "rechazado";

          // Si hay filtro específico de estado, aplicarlo
          if (filtroEstado !== "todos") {
            matchesTab = solvencia.creadoPor !== null && solvencia.statusSolicitud === (
              filtroEstado === "revisando" ? "Revisión" :
              filtroEstado === "aprobado" ? "Aprobada" :
              "Rechazada"
            );
          }*/
        if (tabActual === "admin") {
          // En "admin" mostrar solo las que no estén aprobadas ni rechazadas y sean creadas por admin
          matchesTab = solvencia.creador.isAdmin &&
              solvencia.statusSolicitud !== "aprobado" &&
              solvencia.statusSolicitud !== "rechazado";

          // Si hay filtro específico de estado, aplicarlo
          /*if (filtroEstado !== "todos") {
            matchesTab = solvencia.creador.isAdmin && solvencia.statusSolicitud === (
                filtroEstado === "revisando" ? "Revisión" :
                    filtroEstado === "aprobadas" ? "Aprobada" :
                        "Rechazada"
            );
          }*/

        } else if (tabActual === "colegiado") {
          // En "admin" mostrar solo las que no estén aprobadas ni rechazadas y sean creadas por admin
          matchesTab = !solvencia.creador.isAdmin &&
              solvencia.statusSolicitud !== "aprobado" &&
              solvencia.statusSolicitud !== "rechazado";

          // Si hay filtro específico de estado, aplicarlo
          /*if (filtroEstado !== "todos") {
            matchesTab = solvencia.creador.isAdmin && solvencia.statusSolicitud === (
                filtroEstado === "revisando" ? "Revisión" :
                    filtroEstado === "aprobadas" ? "Aprobada" :
                        "Rechazada"
            );
          }*/

        } else if (tabActual === "costo_especial") {
          // En "costo_especial" mostrar solo las que tengan costo null
          matchesTab = solvencia.statusSolicitud === 'costo_especial';
        } else if (tabActual === "revision") {
          // En "revisión" mostrar solo las que estén en revisión
          matchesTab = solvencia.statusSolicitud === "revisando";

          // Aplicar filtro de creador si está activo
          /*if (filtroCreador !== "todos") {
            matchesTab = matchesTab && (
                filtroCreador === "admin" ? solvencia.creador.isAdmin : false
            );
          }*/
        } else if (tabActual === "aprobadas") {
          // En "aprobadas" mostrar solo las que estén aprobadas
          matchesTab = solvencia.statusSolicitud === "aprobado";

          // Aplicar filtro de creador si está activo
          /*if (filtroCreador !== "todos") {
            matchesTab = matchesTab && (
              filtroCreador === "admin" ? solvencia.creador.isAdmin : false
            );
          }*/
        } else if (tabActual === "rechazadas") {
          // En "rechazadas" mostrar solo las que estén rechazadas
          matchesTab = solvencia.statusSolicitud === "rechazado";

          // Aplicar filtro de creador si está activo
          /*if (filtroCreador !== "todos") {
            matchesTab = matchesTab && (
              filtroCreador === "admin" ? solvencia.creador.isAdmin :
              false
            );
          }*/
        }

        // Filtro por rango de fechas
        /*
        let matchesFechas = true;
        if (fechaInicio && fechaFin) {
          const fechaSolvencia = parseStringToDate(solvencia.fecha);
          const inicio = parseStringToDate(fechaInicio);
          const fin = parseStringToDate(fechaFin);

          if (fechaSolvencia && inicio && fin) {
            fin.setHours(23, 59, 59, 999);
            matchesFechas = fechaSolvencia >= inicio && fechaSolvencia <= fin;
          }
        }*/

        return matchesSearch && matchesTab;
      })
      .sort((a, b) => {
        const [yearA, monthA, dayA] = a.fechaSolicitud.split('-');
        const [yearB, monthB, dayB] = b.fechaSolicitud.split('-');

        const fechaA = new Date(yearA, monthA - 1, dayA);
        const fechaB = new Date(yearB, monthB - 1, dayB);

        return ordenFecha === "desc" ? fechaB - fechaA : fechaA - fechaB;
      });
}, [solicitudesDeSolvencia, searchTerm, tabActual, filtroEstado, filtroCreador, fechaInicio, ordenFecha]);

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

    const colegiado = solicitudesDeSolvencia.find(c => c.idColegiado === colegiadoId)
    setColegiadoSeleccionado(colegiado)
    setShowModal(true)
  }

  // Actualizar una solvencia existente
  const actualizarSolvencia = (solvenciaActualizada) => {
    setSolvencias(prev => prev.map(s =>
      s.idSolicitudSolvencia === solvenciaActualizada.idSolicitudSolvencia ? solvenciaActualizada : s
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
        solvencias={solicitudesDeSolvencia}
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
          className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2
          bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
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
              placeholder="Buscar por colegiado..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full
              focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">


          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className="cursor-pointer border border-gray-300 bg-white text-gray-700
            px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50
            transition-colors w-full md:w-auto justify-center"
          >
            <Calendar size={20} />
            <span>Filtrar por fecha</span>
          </button>
          
          <button
            onClick={() => {
              setColegiadoSeleccionado(null);
              setShowModal(true);
            }}
            className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-4
            py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity w-full md:w-auto justify-center"
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
          <nav className="-mb-px flex flex-wrap">
            <button
              onClick={() => setTabActual("revision")}
              className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${
                tabActual === "revision"
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
              className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${
                tabActual === "aprobadas"
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
              className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${
                tabActual === "rechazadas"
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
            <button
              onClick={() => setTabActual("admin")}
              className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${
                tabActual === "admin"
                  ? "border-[#C40180] text-[#C40180]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Creado por Admin
              {conteoSolvencias.admin > 0 && (
                <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {conteoSolvencias.admin}
                </span>
              )}
            </button>
            <button
              onClick={() => setTabActual("colegiado")}
              className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${
                tabActual === "colegiado"
                  ? "border-[#C40180] text-[#C40180]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Creado por Colegiado
              {conteoSolvencias.colegiado > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {conteoSolvencias.colegiado}
                </span>
              )}
            </button>
            <button
              onClick={() => setTabActual("costo_especial")}
              className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${
                tabActual === "costo_especial"
                  ? "border-[#C40180] text-[#C40180]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <span>Solicitud de Costo</span>
                {conteoSolvencias.solicitudCosto > 0 && (
                  <span className={`ml-2 ${
                    tabActual === "costo_especial"
                      ? "bg-[#C40180] text-white"
                      : "bg-red-500 text-white"
                  } text-xs px-2 py-0.5 rounded-full`}>
                    {conteoSolvencias.solicitudCosto}
                  </span>
                )}
              </div>
            </button>
          </nav>
        </div>
      </div>
      
      {/* Mensaje informativo para solicitudes de costo */}
      {tabActual === "costo_especial" && (
        <div className="mb-6 flex items-center bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <div className="mr-2 bg-indigo-100 rounded-full p-1">
            <CreditCard size={20} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-indigo-800 font-medium">Solicitudes pendientes de asignación de costo</p>
            <p className="text-xs text-indigo-700">Estas solicitudes requieren que
              se les asigne un costo o se exoneren de pago.</p>
          </div>
        </div>
      )}

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
                {tabActual === "costo_especial" && <CreditCard className="h-8 w-8 text-indigo-500" />}
                {tabActual === "todas" && <Search className="h-8 w-8 text-gray-400" />}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {tabActual === "revision" && "No hay solvencias en revisión"}
                {tabActual === "aprobadas" && "No hay solvencias aprobadas"}
                {tabActual === "rechazadas" && "No hay solvencias rechazadas"}
                {tabActual === "costo_especial" && "No hay solicitudes pendientes de costo"}
                {tabActual === "todas" && "No se encontraron solvencias"}
                {filtroCosto !== "todas" && tabActual === "todas" && (
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
                      Colegiado
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium
                      text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Fecha de Vencimiento
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {solvenciasFiltradas.map((solvencia) => (
                    <tr
                      key={solvencia.idSolicitudSolvencia}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => verDetalleSolvencia(solvencia.idSolicitudSolvencia)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-sm text-gray-900">{solvencia.nombreColegiado}</div>
                            {solvencia.creador.isAdmin && (
                              <div className="flex items-center">
                                <Shield size={14} className="text-purple-500" />
                                <span className="ml-1 text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                                  Admin
                                </span>
                              </div>
                            )}
                          </div>
                          <button
                            className="text-xs text-[#C40180] hover:underline"
                            onClick={(e) => abrirModalParaColegiado(e, solvencia.idColegiado)}
                          >
                            + Nueva solvencia
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell">
                        <div className="text-sm text-gray-500">{solvencia.fechaExpSolicitud || "No establecida"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-col items-center">
                          <span className={`inline-flex items-center justify-center gap-1 px-2.5 py-0.5
                            rounded-full text-xs font-medium ${
                            solvencia.statusSolicitud === 'revisando'
                              ? 'bg-yellow-100 text-yellow-800'
                              : solvencia.statusSolicitud === 'aprobado'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {solvencia.statusSolicitud === 'revisando' && <Clock size={12} />}
                            {solvencia.statusSolicitud === 'aprobado' && <CheckCircle size={12} />}
                            {solvencia.statusSolicitud === 'rechazado' && <XCircle size={12} />}
                            {solvencia.statusSolicitud}
                          </span>
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

      {/* Modal para crear nueva solvencia */}
      {showModal && (
        <CrearSolvenciaModal
          onClose={() => {
            setShowModal(false);
            setColegiadoSeleccionado(null);
          }}
          onSolvenciaCreada={handleSolvenciaCreada}
          colegiados={solicitudesDeSolvencia}
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