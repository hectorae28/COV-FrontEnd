"use client";

import NoSolventBanner from "@/app/Components/Solvencia/BannerNoSolv";
import TableUpdateModal from "@/Components/Tabla/ActualizarModalTabla";
import TableDetailsModal from "@/Components/Tabla/DetallesTablaModal";
import TableRow from "@/Components/Tabla/RowTabla";
import { ChevronDown, Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function TablaHistorial({ isSolvent = true }) {
    // Estados iniciales
    const [historialSolicitudes, setHistorialSolicitudes] = useState([
        {
            id: "SOL-2023-001",
            tipo: "Solvencia",
            fecha: "01/04/2023",
            costo: "$20",
            estado: "Aprobada",
            comentario: "",
            actualizable: false,
        },
        {
            id: "SOL-2023-002",
            tipo: "Constancia",
            fecha: "15/06/2023",
            costo: "$15",
            estado: "Aprobada",
            comentario: "",
            actualizable: false,
        },
        {
            id: "SOL-2023-003",
            tipo: "Carnet",
            fecha: "30/09/2023",
            costo: "$25",
            estado: "Pendiente",
            comentario: "En revisión por el departamento",
            actualizable: false,
        },
        {
            id: "SOL-2023-004",
            tipo: "Especialidad",
            fecha: "10/12/2023",
            costo: "$40",
            estado: "Rechazada",
            comentario: "Documentación incompleta",
            actualizable: true,
        },
        {
            id: "SOL-2024-001",
            tipo: "Multiple",
            fecha: "05/01/2024",
            costo: "$55",
            estado: "Pendiente",
            comentario: "Verificación de pago",
            actualizable: false,
        },
    ]);

    // Estados para filtros y búsqueda
    const [filtroEstado, setFiltroEstado] = useState("Todos");
    const [filtroTipo, setFiltroTipo] = useState("Todos");
    const [busqueda, setBusqueda] = useState("");
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    // Modal de detalles
    const [modalDetalles, setModalDetalles] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

    // Estado para archivos y datos de actualización
    const [nuevosDatos, setNuevosDatos] = useState({
        file: null,
        comentario: "",
    });

    // Filtrar solicitudes según los criterios seleccionados
    const solicitudesFiltradas = historialSolicitudes.filter((solicitud) => {
        const coincideBusqueda =
            busqueda === "" ||
            solicitud.id.toLowerCase().includes(busqueda.toLowerCase()) ||
            solicitud.tipo.toLowerCase().includes(busqueda.toLowerCase());

        const coincideEstado =
            filtroEstado === "Todos" || solicitud.estado === filtroEstado;
        const coincideTipo =
            filtroTipo === "Todos" || solicitud.tipo === filtroTipo;

        return coincideBusqueda && coincideEstado && coincideTipo;
    });

    // Ordenar por fecha (más reciente primero)
    useEffect(() => {
        const sortedSolicitudes = [...historialSolicitudes].sort((a, b) => {
            const dateA = new Date(a.fecha.split("/").reverse().join("-"));
            const dateB = new Date(b.fecha.split("/").reverse().join("-"));
            return dateB - dateA;
        });

        if (
            JSON.stringify(sortedSolicitudes) !== JSON.stringify(historialSolicitudes)
        ) {
            setHistorialSolicitudes(sortedSolicitudes);
        }
    }, []);

    // Abrir modal de detalles
    const verDetalles = (solicitud) => {
        setSolicitudSeleccionada(solicitud);
        setModalDetalles(true);
    };

    // Abrir modal de actualización
    const abrirModalActualizar = (solicitud) => {
        if (!isSolvent) return; // No permitir actualizar si no está solvente

        setSolicitudSeleccionada(solicitud);
        setNuevosDatos({
            file: null,
            comentario: "",
        });
        setModalActualizar(true);
    };

    // Manejar carga de archivos
    const handleFileChange = (e) => {
        setNuevosDatos({
            ...nuevosDatos,
            file: e.target.files[0],
        });
    };

    // Enviar actualización
    const enviarActualizacion = () => {
        // En un caso real, aquí enviaríamos los datos al servidor
        // Simulamos actualización local
        const solicitudesActualizadas = historialSolicitudes.map((sol) => {
            if (sol.id === solicitudSeleccionada.id) {
                return {
                    ...sol,
                    estado: "Pendiente",
                    comentario: "Documentación actualizada - en revisión",
                    actualizable: false,
                };
            }
            return sol;
        });

        setHistorialSolicitudes(solicitudesActualizadas);
        setModalActualizar(false);
    };

    return (
        <div className="w-full">
            {/* Banner de no solvente */}
            {!isSolvent && <NoSolventBanner />}

            {/* Encabezado con título y controles */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-black">
                    Historial de Solicitudes
                </h2>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {/* Buscador */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar solicitud..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] outline-none w-full sm:w-52"
                        />
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                    </div>

                    {/* Botón de filtros */}
                    <button
                        onClick={() => setMostrarFiltros(!mostrarFiltros)}
                        className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                        <Filter size={18} />
                        <span>Filtros</span>
                        <ChevronDown
                            size={16}
                            className={`transition-transform ${mostrarFiltros ? "rotate-180" : ""
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Panel de filtros */}
            {mostrarFiltros && (
                <div className="bg-white p-4 rounded-lg mb-4 shadow-sm border border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estado
                            </label>
                            <select
                                value={filtroEstado}
                                onChange={(e) => setFiltroEstado(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] outline-none"
                            >
                                <option value="Todos">Todos</option>
                                <option value="Aprobada">Aprobada</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Rechazada">Rechazada</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo
                            </label>
                            <select
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] outline-none"
                            >
                                <option value="Todos">Todos</option>
                                <option value="Solvencia">Solvencia</option>
                                <option value="Constancia">Constancia</option>
                                <option value="Carnet">Carnet</option>
                                <option value="Especialidad">Especialidad</option>
                                <option value="Multiple">Múltiple</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla de solicitudes */}
            <div className="bg-white shadow overflow-hidden rounded-lg w-full">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* Encabezado de la tabla */}
                        <thead>
                            <tr className="bg-gradient-to-t from-[#D7008A] to-[#41023B]">
                                <th
                                    scope="col"
                                    className="px-3 sm:px-6 py-3 text-white text-center text-xs sm:text-sm font-bold uppercase tracking-wider"
                                >
                                    ID
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 sm:px-6 py-3 text-white text-center text-xs sm:text-sm font-bold uppercase tracking-wider"
                                >
                                    Tipo
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 sm:px-6 py-3 text-white text-center text-xs sm:text-sm font-bold uppercase tracking-wider"
                                >
                                    Fecha
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 sm:px-6 py-3 text-white text-center text-xs sm:text-sm font-bold uppercase tracking-wider"
                                >
                                    Estado
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 sm:px-6 py-3 text-white text-center text-xs sm:text-sm font-bold uppercase tracking-wider"
                                >
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        {/* Cuerpo de la tabla */}
                        <tbody className="bg-white divide-y divide-gray-200">
                            {solicitudesFiltradas.length > 0 ? (
                                solicitudesFiltradas.map((solicitud, index) => (
                                    <TableRow
                                        key={solicitud.id}
                                        solicitud={solicitud}
                                        index={index}
                                        onView={verDetalles}
                                        onUpdate={abrirModalActualizar}
                                        isSolvent={isSolvent}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-center"
                                    >
                                        {busqueda ||
                                            filtroEstado !== "Todos" ||
                                            filtroTipo !== "Todos"
                                            ? "No se encontraron solicitudes con los criterios de búsqueda"
                                            : "No hay solicitudes registradas"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Detalles */}
            {modalDetalles && solicitudSeleccionada && (
                <TableDetailsModal
                    solicitud={solicitudSeleccionada}
                    isSolvent={isSolvent}
                    onClose={() => setModalDetalles(false)}
                    onUpdate={() => {
                        setModalDetalles(false);
                        if (isSolvent) abrirModalActualizar(solicitudSeleccionada);
                    }}
                />
            )}

            {/* Modal de Actualización */}
            {modalActualizar && solicitudSeleccionada && (
                <TableUpdateModal
                    solicitud={solicitudSeleccionada}
                    nuevosDatos={nuevosDatos}
                    handleFileChange={handleFileChange}
                    onCancel={() => setModalActualizar(false)}
                    onSubmit={enviarActualizacion}
                    setNuevosDatos={setNuevosDatos}
                />
            )}
        </div>
    );
}