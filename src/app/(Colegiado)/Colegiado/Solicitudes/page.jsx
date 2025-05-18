"use client"

import { fetchMe } from "@/api/endpoints/colegiado"
import { colegiado, solicitudes as solicitudesIniciales } from "@/app/Models/PanelControl/Solicitudes/SolicitudesColegiadosData"
import DashboardLayout from "@/Components/DashboardLayout"
import CrearSolicitudModal from "@/Components/Solicitudes/Solicitudes/CrearSolicitudModal"
import DetalleSolicitud from "@/Components/Solicitudes/Solicitudes/DetalleSolicitud"
import { motion } from "framer-motion"
import {
    CheckCircle,
    Clock,
    FileCheck,
    Filter,
    PlusCircle,
    Search,
    XCircle
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState, useMemo } from "react"
import {useSolicitudesStore} from "@/store/SolicitudesStore.jsx"
import useColegiadoUserStore from "@/store/colegiadoUserStore"


export default function ListaSolicitudesColegiado() {
    // Estados para manejar los datos
    const [solicitudes, setSolicitudes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [userInfo, setUserInfo] = useState(null)
    const [isSolvent, setIsSolvent] = useState(true)
    const [showSolvencyWarning, setShowSolvencyWarning] = useState(false)

    // Estados para la navegación interna
    const [vistaActual, setVistaActual] = useState("lista") 
    const [solicitudSeleccionadaId, setSolicitudSeleccionadaId] = useState(null)
    const [tabActual, setTabActual] = useState("pendientes") 
    const [filtroCosto, setFiltroCosto] = useState("todas") 
    const [solicitudCreada, setSolicitudCreada] = useState(null)

    const fetchTiposSolicitud = useSolicitudesStore((state) => state.fetchTiposSolicitud)
    const addSolicitud = useSolicitudesStore((state) => state.addSolicitud);
    const colegiadoUser = useColegiadoUserStore((state) => state.colegiadoUser);
    const setColegiadoUser = useColegiadoUserStore((state) => state.setColegiadoUser);

    // Obtener la sesión
    const { data: session, status } = useSession()

    const loadTiposSolicitud = async () => {
        try {
          await fetchTiposSolicitud();
        } catch (error) {
          console.error("Error al cargar tipos de solicitud:", error);
        }
      };
    
      useEffect(() => {
        loadTiposSolicitud();
      }, []); 
      
    const getColegiadoData = async () => {
        try {
            if (!session) return;
            const userResponse = await fetchMe(session);
            const userData = userResponse.data;
            setUserInfo(userData);
            setColegiadoUser(userData);
            setIsSolvent(userData.solvencia_status);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    // Efecto para cargar la información del usuario
    useEffect(() => {
        if (status === "loading") return;
        if(!colegiadoUser) getColegiadoData();

        setUserInfo(colegiadoUser);        
        setIsSolvent(colegiadoUser?.solvencia_status);
    }, [session, status]);

    // Cargar datos iniciales de solicitudes
    useEffect(() => {
        setTimeout(() => {
            setSolicitudes(solicitudesIniciales);
            setIsLoading(false);
        }, 1000);
    }, []);

    // Definir el tab activo inicial basado en el contenido
    useEffect(() => {
        if (!isLoading) {
            const hasPendientes = solicitudes.some(s => s.estado === "Pendiente");
            const hasAprobadas = solicitudes.some(s => s.estado === "Aprobada");
            
            if (!hasPendientes && hasAprobadas) {
                setTabActual("aprobadas");
            } else if (!hasPendientes && !hasAprobadas) {
                setTabActual("todas");
            }
        }
    }, [isLoading, solicitudes]);

    // Conteo de solicitudes por estado (usando useMemo para optimización)
    const conteoSolicitudes = useMemo(() => ({
        pendientes: solicitudes.filter(s => s.estado === "Pendiente").length,
        aprobadas: solicitudes.filter(s => s.estado === "Aprobada").length,
        rechazadas: solicitudes.filter(s => s.estado === "Rechazada").length
    }), [solicitudes]);

    // Filtrar solicitudes basado en búsqueda, tab actual y filtro de costo (usando useMemo)
    const solicitudesFiltradas = useMemo(() => {
        return solicitudes
            .filter(solicitud => {
                const matchesSearch =
                    searchTerm === "" || 
                    solicitud.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    solicitud.referencia.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesTab =
                    tabActual === "todas" ||
                    (tabActual === "pendientes" && solicitud.estado === "Pendiente") ||
                    (tabActual === "aprobadas" && solicitud.estado === "Aprobada") ||
                    (tabActual === "rechazadas" && solicitud.estado === "Rechazada");

                const matchesCosto =
                    filtroCosto === "todas" ||
                    (filtroCosto === "conCosto" && solicitud.costo > 0) ||
                    (filtroCosto === "sinCosto" && solicitud.costo === 0);

                return matchesSearch && matchesTab && matchesCosto;
            })
            .sort((a, b) => {
                const [diaA, mesA, anioA] = a.fecha.split('/').map(Number);
                const [diaB, mesB, anioB] = b.fecha.split('/').map(Number);
                const fechaA = new Date(anioA, mesA - 1, diaA);
                const fechaB = new Date(anioB, mesB - 1, diaB);
                return fechaB - fechaA;
            });
    }, [solicitudes, searchTerm, tabActual, filtroCosto]);

    // Helpers y manejadores
    const verDetalleSolicitud = (id) => {
        setSolicitudSeleccionadaId(id);
        setVistaActual("detalleSolicitud");
    };

    const volverALista = () => {
        setVistaActual("lista");
        setSolicitudSeleccionadaId(null);
    };

  const handleSolicitudCreada = async (nuevaSolicitud) => {
    const solCreada= await addSolicitud({...nuevaSolicitud, colegiadoId:colegiadoUser.colegiado_id})
    setSolicitudCreada(solCreada)
  }

    const actualizarSolicitud = (solicitudActualizada) => {
        setSolicitudes(prev => prev.map(s =>
            s.id === solicitudActualizada.id ? solicitudActualizada : s
        ));
    };

    // Cambiar tab y resetear filtro si es necesario
    const cambiarTab = (tab) => {
        setTabActual(tab);
        if (tab !== "aprobadas") {
            setFiltroCosto("todas");
        }
    };

    // Mensaje para estados vacíos
    const getMensajeEstadoVacio = () => {
        let mensajeBase = "";
        
        if (tabActual === "pendientes") {
            mensajeBase = "No tienes solicitudes pendientes";
        } else if (tabActual === "aprobadas") {
            mensajeBase = "No tienes solicitudes aprobadas";
            if (filtroCosto === "conCosto") {
                mensajeBase += " con costo";
            } else if (filtroCosto === "sinCosto") {
                mensajeBase += " exoneradas";
            }
        } else if (tabActual === "rechazadas") {
            mensajeBase = "No tienes solicitudes rechazadas";
        } else if (searchTerm) {
            mensajeBase = "No se encontraron solicitudes con esos criterios";
        } else {
            mensajeBase = "No tienes solicitudes registradas";
        }
        
        return mensajeBase;
    };

    // Loading state
    if (status === "loading") {
        return (
            <div className="select-none cursor-default flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D7008A]"></div>
            </div>
        );
    }

    // Contenido principal basado en la vista actual
    const renderContent = () => {
        // Vista principal de lista
        return (
            <div className="select-none cursor-default w-full px-4 md:px-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="text-center mb-8 md:mb-10"
                >
                    <motion.h1
                        className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                    >
                        Mis solicitudes
                    </motion.h1>
                    <motion.p
                        className="mt-4 max-w-full mx-auto text-gray-600 text-base md:text-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        Gestiona tus solicitudes y crea nuevas
                    </motion.p>
                </motion.div>

                {/* Barra de acciones: Búsqueda y botón de nueva solicitud */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex-1 w-full md:w-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar por tipo o referencia..."
                                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {
                        colegiadoUser?.solvencia_status && (
                            <div className="flex gap-4 w-full md:w-auto">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity w-full md:w-auto justify-center"
                                >
                                    <PlusCircle size={20} />
                                    <span>Nueva solicitud</span>
                                </button>
                            </div>
                        )
                    }
                    
                </div>

                {/* Tabs para filtrar por estado */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex overflow-x-auto">
                            <button
                                onClick={() => cambiarTab("pendientes")}
                                className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${
                                    tabActual === "pendientes"
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
                                onClick={() => cambiarTab("aprobadas")}
                                className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${
                                    tabActual === "aprobadas"
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
                                onClick={() => cambiarTab("rechazadas")}
                                className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${
                                    tabActual === "rechazadas"
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

                {/* Filtros de costo - solo mostrar en tab aprobadas */}
                {tabActual === "aprobadas" && (
                    <div className="mb-6">
                        <div className="flex items-center mb-2">
                            <Filter size={16} className="mr-2 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Filtrar por costo</span>
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
                )}

                {/* Estado de carga o contenido */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
                    </div>
                ) : solicitudesFiltradas.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            {tabActual === "pendientes" && <Clock className="h-8 w-8 text-yellow-500" />}
                            {tabActual === "aprobadas" && <CheckCircle className="h-8 w-8 text-green-500" />}
                            {tabActual === "rechazadas" && <XCircle className="h-8 w-8 text-red-500" />}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {getMensajeEstadoVacio()}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm 
                                ? "Intenta cambiar los criterios de búsqueda" 
                                : "Puedes crear una nueva solicitud cuando lo necesites"}
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity mx-auto"
                        >
                            <PlusCircle size={20} />
                            <span>Nueva solicitud</span>
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                        Referencia
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pago
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
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                                solicitud.estado === 'Pendiente'
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
                                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                            <div className="text-sm text-gray-500">{solicitud.referencia}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                            <div className="text-sm text-gray-500">{solicitud.fecha}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {solicitud.costo > 0 ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    ${solicitud.costo.toFixed(2)}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                                    Exonerada
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal para crear nueva solicitud */}
                {showModal && (
                    <CrearSolicitudModal
                        onClose={() => {setShowModal(false); setSolicitudCreada(null);}}
                        onSolicitudCreada={handleSolicitudCreada}
                        colegiadoPreseleccionado={colegiadoUser}
                        onVerDetalle={verDetalleSolicitud}
                        session={session}
                        mostrarSeleccionColegiado={false}
                        solicitudCreada={solicitudCreada}
                        isAdmin={false}
                    />
                )}
            </div>
        );
    };

    // Renderizado final con DashboardLayout
    return (
        <>
            {renderContent()}
        </>
    );
}