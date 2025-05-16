"use client"

import CrearSolicitudModal from "@/Components/Solicitudes/Solicitudes/CrearSolicitudModal"
import DetalleSolicitud from "@/Components/Solicitudes/Solicitudes/DetalleSolicitud"
import { colegiados as colegiadosIniciales, solicitudes as solicitudesIniciales } from "@/app/Models/PanelControl/Solicitudes/SolicitudesData"
import { convertJsonToFormData } from "@/store/SolicitudesStore.jsx"
import { motion } from "framer-motion"
import {
  CheckCircle,
  Clock,
  FileCheck,
  Filter,
  PlusCircle,
  Search,
  Shield,
  User,
  XCircle
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
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
  const [tabActual, setTabActual] = useState("todas") // todas, pendientes, aprobadas, rechazadas
  const [filtroCosto, setFiltroCosto] = useState("todas") // todas, conCosto, sinCosto

  // Cargar datos iniciales
  useEffect(() => {
    // Simulando carga de datos con un pequeño retraso
    setTimeout(() => {
      setColegiados(colegiadosIniciales);
      setSolicitudes(solicitudesIniciales);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Conteo de solicitudes por estado para los tabs
  const conteoSolicitudes = useMemo(() => ({
    pendientes: solicitudes.filter(s => s.estado === "Pendiente").length,
    aprobadas: solicitudes.filter(s => s.estado === "Aprobada").length,
    rechazadas: solicitudes.filter(s => s.estado === "Rechazada").length,
    exoneradas: solicitudes.filter(s => s.estado === "Exonerada").length
  }), [solicitudes]);

  // Filtrar solicitudes basado en búsqueda, tab actual y filtro de costo
  const solicitudesFiltradas = useMemo(() => {
    return solicitudes
      .filter(solicitud => {
        const matchesSearch =
          searchTerm === "" ||
          solicitud.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          solicitud.colegiadoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          solicitud.referencia.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesTab =
          tabActual === "todas" ||
          (tabActual === "pendientes" && solicitud.estado === "Pendiente") ||
          (tabActual === "aprobadas" && solicitud.estado === "Aprobada") ||
          (tabActual === "rechazadas" && solicitud.estado === "Rechazada") ||
          (tabActual === "exoneradas" && solicitud.estado === "Exonerada")

        const matchesCosto =
          filtroCosto === "todas" ||
          (filtroCosto === "conCosto" && solicitud.costo > 0) ||
          (filtroCosto === "sinCosto" && solicitud.costo === 0)

        return matchesSearch && matchesTab && matchesCosto
      })
      .sort((a, b) => {
        // Convertir fechas de formato DD/MM/YYYY a objetos Date
        const [diaA, mesA, anioA] = a.fecha.split('/');
        const [diaB, mesB, anioB] = b.fecha.split('/');

        const fechaA = new Date(anioA, mesA - 1, diaA);
        const fechaB = new Date(anioB, mesB - 1, diaB);

        // Ordenar descendente (más reciente primero)
        return fechaB - fechaA;
      });
  }, [solicitudes, searchTerm, tabActual, filtroCosto]);

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
    console.log({ nuevaSolicitud })
    const formatSolicitud = convertJsonToFormData(nuevaSolicitud)
    console.log(formatSolicitud)
    //setSolicitudes(prev => [nuevaSolicitud, ...prev]); // Añadir al principio del array
  }

  // Función para abrir el modal con un colegiado preseleccionado
  const abrirModalParaColegiado = (event, colegiadoId) => {
    // Detener la propagación para evitar que el clic llegue a la fila
    event.stopPropagation();

    const colegiado = colegiados.find(c => c.id === colegiadoId)
    setColegiadoSeleccionado(colegiado)
    setShowModal(true)
  }

  // Actualizar una solicitud existente
  const actualizarSolicitud = (solicitudActualizada) => {
    setSolicitudes(prev => prev.map(s =>
      s.id === solicitudActualizada.id ? solicitudActualizada : s
    ))
  }

  // Renderizado condicional basado en la vista actual
  if (vistaActual === "detalleSolicitud") {
    return (
      <DetalleSolicitud
        solicitudId={solicitudSeleccionadaId}
        onVolver={volverALista}
        solicitudes={solicitudes}
        actualizarSolicitud={actualizarSolicitud}
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
            onClick={() => {
              setColegiadoSeleccionado(null);
              setShowModal(true);
            }}
            className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity w-full md:w-auto justify-center"
          >
            <PlusCircle size={20} />
            <span>Nueva solicitud</span>
          </button>
        </div>
      </div>

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
              Todas las solicitudes
            </button>
            <button
              onClick={() => setTabActual("pendientes")}
              className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${tabActual === "pendientes"
                ? "border-[#C40180] text-[#C40180]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Pendientes
              {conteoSolicitudes.pendientes > 0 && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {conteoSolicitudes.pendientes}
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
              {conteoSolicitudes.aprobadas > 0 && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {conteoSolicitudes.aprobadas}
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
              {conteoSolicitudes.rechazadas > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {conteoSolicitudes.rechazadas}
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
            Exonerada
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
          {/* Lista de solicitudes */}
          {solicitudesFiltradas.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                {tabActual === "pendientes" && <Clock className="h-8 w-8 text-yellow-500" />}
                {tabActual === "aprobadas" && <CheckCircle className="h-8 w-8 text-green-500" />}
                {tabActual === "rechazadas" && <XCircle className="h-8 w-8 text-red-500" />}
                {tabActual === "todas" && <Search className="h-8 w-8 text-gray-400" />}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {tabActual === "pendientes" && "No hay solicitudes pendientes"}
                {tabActual === "aprobadas" && "No hay solicitudes aprobadas"}
                {tabActual === "rechazadas" && "No hay solicitudes rechazadas"}
                {tabActual === "todas" && "No se encontraron solicitudes"}
                {filtroCosto !== "todas" && (
                  <span>
                    {" "}
                    {filtroCosto === "conCosto" ? "con costo" : "exoneradas"}
                  </span>
                )}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? "Intenta cambiar los criterios de búsqueda"
                  : "Puede crear una nueva solicitud usando el botón superior"}
              </p>
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {solicitudesFiltradas.map((solicitud) => (
                    <tr
                      key={solicitud.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => verDetalleSolicitud(solicitud.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{solicitud.tipo}</div>
                        <div className="text-xs text-gray-500 md:hidden">
                          Ref: {solicitud.referencia}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {solicitud.costo > 0 ? `${solicitud.costo.toFixed(2)}` : 'Sin costo'}
                        </div>
                        {/* Mostrar información del creador */}
                        {solicitud.creador && (
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            {solicitud.creador.esAdmin ? (
                              <Shield size={12} className="mr-1 text-purple-500" />
                            ) : (
                              <User size={12} className="mr-1 text-gray-400" />
                            )}
                            <span>
                              Creado por {solicitud.creador.nombre || "Usuario"}
                              {solicitud.creador.esAdmin && (
                                <span className="ml-1 text-xs bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-[10px]">
                                  Admin
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{solicitud.colegiadoNombre}</div>
                        <button
                          className="cursor-grab text-xs text-[#C40180] hover:underline mt-1"
                          onClick={(e) => abrirModalParaColegiado(e, solicitud.colegiadoId)}
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
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${solicitud.estado === 'Pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : solicitud.estado === 'Aprobada'
                            ? 'bg-green-100 text-green-800'
                            : solicitud.estado === 'Exonerada'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                          {solicitud.estado === 'Pendiente' && <Clock size={12} />}
                          {solicitud.estado === 'Aprobada' && <CheckCircle size={12} />}
                          {solicitud.estado === 'Exonerada' && <FileCheck size={12} />}
                          {solicitud.estado === 'Rechazada' && <XCircle size={12} />}
                          {solicitud.estado}
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

      {/* Modal para crear nueva solicitud */}
      {showModal && (
        <CrearSolicitudModal
          onClose={() => {
            setShowModal(false);
            setColegiadoSeleccionado(null);
          }}
          onSolicitudCreada={handleSolicitudCreada}
          colegiados={colegiados}
          colegiadoPreseleccionado={colegiadoSeleccionado}
          onVerDetalle={verDetalleSolicitud}
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