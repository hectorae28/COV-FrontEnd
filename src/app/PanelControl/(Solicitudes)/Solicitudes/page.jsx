"use client"

import CrearSolicitudModal from "@/Components/Solicitudes/Solicitudes/CrearSolicitudModal"
import { motion } from "framer-motion"
import {
  CheckCircle,
  Clock,
  FileCheck,
  Filter,
  PlusCircle,
  Router,
  Search,
  Shield,
  User,
  XCircle
} from "lucide-react"
import { useEffect, useState,useMemo } from "react"
import Pagination from "@/Components/Paginations.jsx";
import {useSolicitudesStore} from "@/store/SolicitudesStore.jsx"
import useColegiadoUserStore from "@/store/colegiadoUserStore"
import transformBackendData from "@/utils/formatDataSolicitudes";
import {useRouter} from "next/navigation"
export default function ListaSolicitudes() {
  // Estados para manejar los datos
  //const [solicitudes, setSolicitudes] = useState([])
  //const fetchTiposSolicitud = useSolicitudesStore((state) => state.fetchTiposSolicitud)
  const initStore = useSolicitudesStore((state) => state.initStore)
  const solicitudes = useSolicitudesStore((state)=>state.solicitudes)
  const solicitudesPagination = useSolicitudesStore((state)=>state.solicitudesPagination)

  const solicitudesAbiertas = useSolicitudesStore((state)=>state.solicitudesAbiertas)
  const solicitudesAbiertasPagination = useSolicitudesStore((state)=>state.solicitudesAbiertasPagination)
  const solicitudesCerradas = useSolicitudesStore((state)=>state.solicitudesCerradas)
  const solicitudesCerradasPagination = useSolicitudesStore((state)=>state.solicitudesCerradasPagination)
  const loading = useSolicitudesStore((state)=>state.loading)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [colegiadoSeleccionado, setColegiadoSeleccionado] = useState(null)
  //const [colegiados, setColegiados] = useState([])
  const user = useColegiadoUserStore((state) => state.colegiadoUser);
  const addSolicitud = useSolicitudesStore((state) => state.addSolicitud);
  
  // Estados para la navegación interna
  const [vistaActual, setVistaActual] = useState("lista") // lista, detalleSolicitud
  const [solicitudCreada, setSolicitudCreada] = useState(null)

  const [solicitudSeleccionadaId, setSolicitudSeleccionadaId] = useState(null)
  const [tabActual, setTabActual] = useState("todas") // todas, pendientes, aprobadas, rechazadas
  const [filtroCosto, setFiltroCosto] = useState("todas") // todas, conCosto, sinCosto
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()
  
  const loadTiposSolicitud = async () => {
    try {
      await initStore();
    } catch (error) {
      console.error("Error al cargar tipos de solicitud:", error);
    }
  };
  useEffect(() => {
    loadTiposSolicitud();
  }, []); // Solo se ejecuta al montar el componente

  const TypeSolicitudes = {
    todas: solicitudes,
    abierta: solicitudesAbiertas,
    cerrada: solicitudesCerradas
  }
  const PaginationSolicitudes = {
    todas: solicitudesPagination,
    abierta: solicitudesAbiertasPagination,
    cerrada: solicitudesCerradasPagination
  }
  // Filtrar solicitudes basado en búsqueda, tab actual y filtro de costo
  const solicitudesFiltradas = useMemo(() => {
    return TypeSolicitudes[tabActual] || [];
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
  const handleSolicitudCreada = async (nuevaSolicitud) => {
    const solCreada= await addSolicitud({...nuevaSolicitud, creador:{id:user.id}})
    setSolicitudCreada(solCreada)
  }

  // Función para abrir el modal con un colegiado preseleccionado
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
          transition={{
            duration: 0.8,
            delay: 0.2,
            type: "spring",
            stiffness: 100,
          }}
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
              className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${
                tabActual === "todas"
                  ? "border-[#C40180] text-[#C40180]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Todas las solicitudes
              {solicitudesPagination.count > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {solicitudesPagination.count}
                </span>
              )}
            </button>
            <button
              onClick={() => setTabActual("abierta")}
              className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${
                tabActual === "abierta"
                  ? "border-[#C40180] text-[#C40180]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Abiertas
              {solicitudesAbiertasPagination.count > 0 && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {solicitudesAbiertasPagination.count}
                </span>
              )}
            </button>
            <button
              onClick={() => setTabActual("cerradas")}
              className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${
                tabActual === "cerradas"
                  ? "border-[#C40180] text-[#C40180]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Cerradas
              {solicitudesCerradasPagination.count > 0 && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {solicitudesCerradasPagination.count}
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
          <span className="text-sm font-medium text-gray-700">
            Filtros de costo
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium ${
              filtroCosto === "todas"
                ? "bg-purple-100 text-purple-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setFiltroCosto("todas")}
          >
            Todas
          </button>
          <button
            className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium ${
              filtroCosto === "conCosto"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setFiltroCosto("conCosto")}
          >
            Con costo
          </button>
          <button
            className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium ${
              filtroCosto === "sinCosto"
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
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
        </div>
      ) : (
        <>
          {/* Lista de solicitudes */}
          {solicitudesFiltradas.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                {tabActual === "abierta" && (
                  <Clock className="h-8 w-8 text-yellow-500" />
                )}
                {tabActual === "cerradas" && (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                )}
                {tabActual === "todas" && (
                  <Search className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {tabActual === "abierta" && "No hay solicitudes abiertas"}
                {tabActual === "cerradas" && "No hay solicitudes cerradas"}
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
                  {solicitudesFiltradas.map((solicitudNoFormat, index) => {
                    const solicitud = transformBackendData(solicitudNoFormat);
                    return (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/PanelControl/Solicitudes/${solicitud.id}`
                          )
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            Solicitud {solicitud.tipo}
                          </div>
                          <div className="text-xs text-gray-500 md:hidden">
                            Ref: {solicitud.referencia}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {solicitud.costo > 0
                              ? `${solicitud.costo.toFixed(2)} $`
                              : "Sin costo"}
                          </div>
                          {/* Mostrar información del creador */}
                          {solicitud.creador && (
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              {solicitud.creador.esAdmin ? (
                                <Shield
                                  size={12}
                                  className="mr-1 text-purple-500"
                                />
                              ) : (
                                <User
                                  size={12}
                                  className="mr-1 text-gray-400"
                                />
                              )}
                              <span>
                                Creado por{" "}
                                {solicitud.creador.nombre || "Usuario"}
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
                          <div className="text-sm text-gray-900">
                            {solicitud.colegiadoNombre}
                          </div>
                          <button
                            className="cursor-grab text-xs text-[#C40180] hover:underline mt-1"
                            onClick={(e) =>
                              abrirModalParaColegiado(e, solicitud.colegiadoId)
                            }
                          >
                            + Nueva solicitud
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm text-gray-500">
                            {solicitud.referencia}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="text-sm text-gray-500">
                            {solicitud.fecha}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              solicitud.estado === "Pendiente"
                                ? "bg-yellow-100 text-yellow-800"
                                : solicitud.estado === "Aprobada"
                                ? "bg-green-100 text-green-800"
                                : solicitud.estado === "Exonerada"
                                ? "bg-teal-100 text-teal-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {solicitud.estado === "Pendiente" && (
                              <Clock size={12} />
                            )}
                            {solicitud.estado === "Aprobada" && (
                              <CheckCircle size={12} />
                            )}
                            {solicitud.estado === "Exonerada" && (
                              <FileCheck size={12} />
                            )}
                            {solicitud.estado === "Rechazada" && (
                              <XCircle size={12} />
                            )}
                            {solicitud.estado}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(
                  (PaginationSolicitudes[tabActual].count || 0) / 10
                )}
                onPageChange={setCurrentPage}
                onNextPage={() => setCurrentPage((prev) => prev + 1)}
                onPrevPage={() => setCurrentPage((prev) => prev - 1)}
                isNextDisabled={!PaginationSolicitudes[tabActual].next}
                isPrevDisabled={!PaginationSolicitudes[tabActual].previous}
              />
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
            setSolicitudCreada(null);
          }}
          onSolicitudCreada={handleSolicitudCreada}
          //colegiados={colegiados}
          colegiadoPreseleccionado={colegiadoSeleccionado}
          onVerDetalle={verDetalleSolicitud}
          session={{
            user: {
              name: "Administrador",
              email: "admin@ejemplo.com",
              role: "admin",
              isAdmin: true,
            },
          }}
          solicitudCreada={solicitudCreada}
          isAdmin={true}
        />
      )}
    </div>
  );
}