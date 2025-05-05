"use client"
import DetalleColegiado from "@/app/Components/Solicitudes/ListaColegiados/DetalleColegiado"
import DetallePendiente from "@/app/Components/Solicitudes/ListaColegiados/DetallePendiente"
import RegistroColegiados from "@/app/Components/Solicitudes/ListaColegiados/RegistrarColegiadoModal"
import useDataListaColegiados from "@/app/Models/PanelControl/Solicitudes/ListaColegiadosData"
import { motion } from "framer-motion"
import {
    AlertTriangle,
    ArrowUpDown,
    CheckCircle,
    ChevronRight,
    PlusCircle,
    Search,
    UserX,
    X,
    XCircle,
} from "lucide-react"
import { useEffect, useState } from "react"

export default function ListaColegiadosPage() {
    const { colegiados, colegiadosPendientes, getColegiado, getColegiadoPendiente } = useDataListaColegiados()

    // Estado local de UI
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [showRegistro, setShowRegistro] = useState(false)
    const [vistaActual, setVistaActual] = useState("lista")
    const [colegiadoSeleccionadoId, setColegiadoSeleccionadoId] = useState(null)
    const [tabActivo, setTabActivo] = useState("pendientes")
    const [filtroEstado, setFiltroEstado] = useState("todos")
    const [filtroEspecialidad, setFiltroEspecialidad] = useState("todas")

    // Filtros para pendientes
    const [filtroFecha, setFiltroFecha] = useState("todas")
    const [filtroEstadoPendiente, setFiltroEstadoPendiente] = useState("todos")
    const [registroExitoso, setRegistroExitoso] = useState(false)
    const [aprobacionExitosa, setAprobacionExitosa] = useState(false)
    const [fechaDesde, setFechaDesde] = useState("")
    const [fechaHasta, setFechaHasta] = useState("")
    const [ordenFecha, setOrdenFecha] = useState("desc")
    const [ordenFechaRegistrados, setOrdenFechaRegistrados] = useState("desc")

    // Simular carga inicial
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 800)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        // Esta función se ejecutará cuando colegiados o colegiadosPendientes cambien
        if (!isLoading) {
            // Refrescar los filtros aplicados para mostrar correctamente los nuevos datos
            const filtrarDatos = () => {
                // Forzar actualización de filtros
                const nuevoTermino = searchTerm + " "
                setSearchTerm(nuevoTermino)
                setTimeout(() => setSearchTerm(searchTerm), 10)
            }

            filtrarDatos()
        }
    }, [colegiados, colegiadosPendientes])

    // Función auxiliar para convertir la fecha al formato Date
    const parsearFecha = (fechaTexto) => {
        if (!fechaTexto) return null

        // Intentar primero con formato MM/DD/AAAA
        if (fechaTexto.includes("/")) {
            const partes = fechaTexto.split("/")
            if (partes.length === 3) {
                // Formato MM/DD/AAAA
                const mes = Number.parseInt(partes[0]) - 1 // Restar 1 al mes
                const dia = Number.parseInt(partes[1])
                const año = Number.parseInt(partes[2])
                const fecha = new Date(año, mes, dia)
                // Verificar si la fecha es válida
                if (!isNaN(fecha.getTime())) {
                    return fecha
                }
            }
        }

        // Intentar con formato ISO (AAAA-MM-DD)
        if (fechaTexto.includes("-")) {
            const fecha = new Date(fechaTexto)
            if (!isNaN(fecha.getTime())) {
                return fecha
            }
        }

        // Último intento: analizar como string de fecha
        const fecha = new Date(fechaTexto)
        if (!isNaN(fecha.getTime())) {
            return fecha
        }

        return null
    }

    // Filtrar colegiados basado en búsqueda y filtros, y ordenar por fecha
    const colegiadosFiltrados = colegiados
        .filter((colegiado) => {
            const matchesSearch =
                colegiado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                colegiado.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
                colegiado.numeroRegistro.toLowerCase().includes(searchTerm.toLowerCase())

            // Filtrar por estado (solvencia y solicitudes)
            const matchesEstado =
                filtroEstado === "todos"
                    ? true
                    : filtroEstado === "solventes"
                        ? colegiado.solvente
                        : filtroEstado === "No Solvente"
                            ? !colegiado.solvente
                            : filtroEstado === "solicitudes"
                                ? colegiado.solicitudes && colegiado.solicitudes.length > 0
                                : false

            // Filtrar por especialidad
            const matchesEspecialidad = filtroEspecialidad === "todas" ? true : colegiado.especialidad === filtroEspecialidad

            return matchesSearch && matchesEstado && matchesEspecialidad
        })
        // Ordenar por fecha de registro
        .sort((a, b) => {
            const fechaA = parsearFecha(a.fechaRegistro)
            const fechaB = parsearFecha(b.fechaRegistro)

            if (!fechaA || !fechaB) return 0

            return ordenFechaRegistrados === "desc"
                ? fechaB - fechaA // Más nuevo primero
                : fechaA - fechaB // Más viejo primero
        })

    // Función para determinar si un pendiente tiene pagos exonerados
    const isExonerado = (pendiente) => {
        // Verificar si tiene el campo exoneracionPagos
        if (pendiente.exoneracionPagos && pendiente.exoneracionPagos.fecha) {
            return true
        }

        // Verificar si tiene algún documento de comprobante marcado como exonerado
        if (pendiente.documentos) {
            return pendiente.documentos.some(
                (doc) =>
                    (doc.id === "comprobante_pago" || doc.nombre.toLowerCase().includes("comprobante")) &&
                    doc.archivo &&
                    doc.archivo.toLowerCase().includes("exonerado"),
            )
        }

        // Verificar si tiene observaciones que indiquen exoneración
        if (pendiente.observaciones && pendiente.observaciones.toLowerCase().includes("exonerado")) {
            return true
        }

        return false
    }

    // Filtrar pendientes basado en búsqueda y filtros
    // Modificar el filtro para pendientes
    const pendientesFiltrados = colegiadosPendientes
        .filter((pendiente) => {
            // Excluir denegadas del tab de pendientes si estamos en ese tab
            if (tabActivo === "pendientes" && pendiente.estado === "denegada") {
                return false
            }

            // Incluir solo denegadas si estamos en ese tab
            if (tabActivo === "denegadas" && pendiente.estado !== "denegada") {
                return false
            }

            // Búsqueda general
            const matchesSearch =
                pendiente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pendiente.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pendiente.email?.toLowerCase().includes(searchTerm.toLowerCase())

            // Filtrar por estado
            let matchesEstadoPendiente = true
            switch (filtroEstadoPendiente) {
                case "pendientes":
                    matchesEstadoPendiente = !pendiente.estado || pendiente.estado === "pendiente"
                    break
                case "rechazados":
                    matchesEstadoPendiente = pendiente.estado === "rechazada"
                    break
                case "documentosIncompletos":
                    matchesEstadoPendiente = !pendiente.documentosCompletos
                    break
                case "pagosPendientes":
                    matchesEstadoPendiente = pendiente.pagosPendientes
                    break
                case "pagosExonerados":
                    // Verificar tanto el campo exoneracionPagos como los documentos para mayor consistencia
                    matchesEstadoPendiente =
                        (pendiente.exoneracionPagos && pendiente.exoneracionPagos.fecha) ||
                        (pendiente.documentos &&
                            pendiente.documentos.some(
                                (doc) =>
                                    (doc.id === "comprobante_pago" || doc.nombre.toLowerCase().includes("comprobante")) &&
                                    doc.archivo &&
                                    doc.archivo.toLowerCase().includes("exonerado"),
                            ))
                    break
                case "todos":
                default:
                    matchesEstadoPendiente = true
                    break
            }

            const fechaSolicitudDate = parsearFecha(pendiente.fechaSolicitud)
            if (!fechaSolicitudDate) return false

            const hoy = new Date()
            const unaSemanaAtras = new Date()
            unaSemanaAtras.setDate(hoy.getDate() - 7)

            const unMesAtras = new Date()
            unMesAtras.setDate(hoy.getDate() - 30)

            let matchesFechaPredef = true
            if (filtroFecha !== "todas") {
                if (filtroFecha === "semana") {
                    matchesFechaPredef = fechaSolicitudDate >= unaSemanaAtras
                } else if (filtroFecha === "mes") {
                    matchesFechaPredef = fechaSolicitudDate >= unMesAtras
                }
            }

            // Filtrar por rango de fechas personalizado
            let matchesRangoFechas = true
            if (fechaDesde) {
                const fechaDesdeObj = new Date(fechaDesde)
                fechaDesdeObj.setHours(0, 0, 0, 0)
                matchesRangoFechas = matchesRangoFechas && fechaSolicitudDate >= fechaDesdeObj
            }
            if (fechaHasta) {
                const fechaHastaObj = new Date(fechaHasta)
                fechaHastaObj.setHours(23, 59, 59, 999)
                matchesRangoFechas = matchesRangoFechas && fechaSolicitudDate <= fechaHastaObj
            }

            return matchesSearch && matchesEstadoPendiente && matchesFechaPredef && matchesRangoFechas
        })
        // Ordenar por fecha
        .sort((a, b) => {
            const fechaA = parsearFecha(a.fechaSolicitud)
            const fechaB = parsearFecha(b.fechaSolicitud)

            if (!fechaA || !fechaB) return 0

            return ordenFecha === "desc" ? fechaB - fechaA : fechaA - fechaB
        })

    // Handlers para navegación y acciones
    const verDetalleColegiado = (id) => {
        setColegiadoSeleccionadoId(id)
        setVistaActual("detalleColegiado")
    }

    const verDetallePendiente = (id) => {
        setColegiadoSeleccionadoId(id)
        setVistaActual("detallePendiente")
    }

    const volverALista = () => {
        setVistaActual("lista")
        setColegiadoSeleccionadoId(null)
    }

    // Manejador para el registro exitoso de un nuevo colegiado pendiente
    const handleRegistroExitoso = (nuevoColegiado) => {
        setShowRegistro(false)
        setRegistroExitoso(true)
        setTimeout(() => {
            setRegistroExitoso(false)
        }, 3000)
    }

    // Manejador para la aprobación de un colegiado pendiente
    const handleAprobarPendiente = (resultado) => {
        // Siempre volver a la lista primero, para evitar problemas de estado
        volverALista()

        // Comprobar si fue una aprobación exitosa
        if (resultado && resultado.aprobado === true) {
            // Solo mostrar notificación si se aprobó
            setAprobacionExitosa(true)
            setTimeout(() => setAprobacionExitosa(false), 3000)

            // Cambiar al tab de registrados
            setTabActivo("registrados")
        }
    }

    // Alternar orden de fecha para pendientes
    const toggleOrdenFecha = () => {
        setOrdenFecha((prev) => (prev === "desc" ? "asc" : "desc"))
    }

    // Alternar orden de fecha para colegiados registrados
    const toggleOrdenFechaRegistrados = () => {
        setOrdenFechaRegistrados((prev) => (prev === "desc" ? "asc" : "desc"))
    }

    // Renderizar vista basada en el estado actual
    if (vistaActual === "detalleColegiado") {
        const colegiadoActual = getColegiado(colegiadoSeleccionadoId)
        return (
            <DetalleColegiado params={{ id: colegiadoSeleccionadoId }} onVolver={volverALista} colegiado={colegiadoActual} />
        )
    }

    if (vistaActual === "detallePendiente") {
        const pendienteActual = getColegiadoPendiente(colegiadoSeleccionadoId)
        return (
            <DetallePendiente
                params={{ id: colegiadoSeleccionadoId }}
                onVolver={handleAprobarPendiente}
                pendiente={pendienteActual}
            />
        )
    }

    // Vista principal de la lista
    return (
        <div className="w-full px-4 md:px-10 py-10 md:py-12">
            {/* Header con título */}
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

            {/* Notificaciones de éxito */}
            {registroExitoso && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-100 text-green-800 p-4 rounded-md mb-6 flex items-start justify-between shadow-sm"
                >
                    <div className="flex items-center">
                        <CheckCircle size={20} className="mr-2 flex-shrink-0" />
                        <span>El colegiado ha sido registrado exitosamente y está pendiente de aprobación.</span>
                    </div>
                    <button
                        onClick={() => setRegistroExitoso(false)}
                        className="text-green-700 hover:bg-green-200 p-1 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}
            {aprobacionExitosa && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-100 text-green-800 p-4 rounded-md mb-6 flex items-start justify-between shadow-sm"
                >
                    <div className="flex items-center">
                        <CheckCircle size={20} className="mr-2 flex-shrink-0" />
                        <span>La solicitud ha sido aprobada exitosamente. El colegiado ha sido registrado.</span>
                    </div>
                    <button
                        onClick={() => setAprobacionExitosa(false)}
                        className="text-green-700 hover:bg-green-200 p-1 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}

            {/* Barra de acciones: búsqueda y botón de nuevo registro */}
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
                        onClick={() => setShowRegistro(true)}
                        className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity w-full md:w-auto justify-center"
                    >
                        <PlusCircle size={20} />
                        <span>Registrar nuevo</span>
                    </button>
                </div>
            </div>

            {/* Tabs para alternar entre colegiados y pendientes */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex gap-6">
                    <button
                        className={`py-4 cursor-pointer px-1 font-medium text-sm sm:text-base border-b-2 ${tabActivo === "pendientes"
                            ? "border-[#C40180] text-[#C40180]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            } transition-colors`}
                        onClick={() => setTabActivo("pendientes")}
                    >
                        Pendientes por aprobación ({colegiadosPendientes.filter(p => p.estado !== "denegada").length})
                    </button>
                    <button
                        className={`py-4 cursor-pointer px-1 font-medium text-sm sm:text-base border-b-2 ${tabActivo === "denegadas"
                            ? "border-[#C40180] text-[#C40180]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            } transition-colors`}
                        onClick={() => setTabActivo("denegadas")}
                    >
                        Denegadas ({colegiadosPendientes.filter(p => p.estado === "denegada").length})
                    </button>
                    <button
                        className={`py-4 px-1 cursor-pointer font-medium text-sm sm:text-base border-b-2 ${tabActivo === "registrados"
                            ? "border-[#C40180] text-[#C40180]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            } transition-colors`}
                        onClick={() => setTabActivo("registrados")}
                    >
                        Colegiados registrados ({colegiados.length})
                    </button>
                </nav>
            </div>

            {/* Filtros adicionales para colegiados registrados */}
            {tabActivo === "registrados" && (
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Filtros:</h3>
                    <div className="flex flex-wrap gap-3">
                        {/* Filtro de estado de solvencia */}
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Estado de solvencia</p>
                            <div className="flex gap-2">
                                <button
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${filtroEstado === "todos"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    onClick={() => setFiltroEstado("todos")}
                                >
                                    Todos
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${filtroEstado === "solventes"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    onClick={() => setFiltroEstado("solventes")}
                                >
                                    Solventes
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${filtroEstado === "No Solvente"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    onClick={() => setFiltroEstado("No Solvente")}
                                >
                                    No Solventes
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${filtroEstado === "solicitudes"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    onClick={() => setFiltroEstado("solicitudes")}
                                >
                                    Con Solicitudes
                                </button>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 mb-1">Especialidad</p>
                            <select
                                value={filtroEspecialidad}
                                onChange={(e) => setFiltroEspecialidad(e.target.value)}
                                className="px-4 py-2 rounded-lg text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="todas">Todas las especialidades</option>
                                <option value="Odontología general">Odontología general</option>
                                <option value="Ortodoncia">Ortodoncia</option>
                                <option value="Endodoncia">Endodoncia</option>
                                <option value="Periodoncia">Periodoncia</option>
                                <option value="Odontopediatría">Odontopediatría</option>
                                <option value="Cirugía maxilofacial">Cirugía maxilofacial</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Filtros para pendientes */}
            {tabActivo === "pendientes" && (
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Filtros:</h3>
                    <div className="flex flex-wrap gap-5">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Fecha de solicitud</p>
                            <div className="flex gap-2">
                                <button
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${filtroFecha === "todas"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    onClick={() => setFiltroFecha("todas")}
                                >
                                    Todas
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${filtroFecha === "semana"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    onClick={() => setFiltroFecha("semana")}
                                >
                                    Última semana
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${filtroFecha === "mes"
                                        ? "bg-indigo-100 text-indigo-800"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    onClick={() => setFiltroFecha("mes")}
                                >
                                    Último mes
                                </button>
                            </div>
                        </div>

                        {/* Nuevo filtro de rango de fechas */}
                        <div>
                            <div className="flex gap-2 items-center">
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Desde</label>
                                    <input
                                        type="date"
                                        value={fechaDesde}
                                        onChange={(e) => setFechaDesde(e.target.value)}
                                        className="px-2 py-1 border rounded text-sm w-full"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Hasta</label>
                                    <input
                                        type="date"
                                        value={fechaHasta}
                                        onChange={(e) => setFechaHasta(e.target.value)}
                                        className="px-2 py-1 border rounded text-sm w-full"
                                    />
                                </div>
                                {(fechaDesde || fechaHasta) && (
                                    <button
                                        onClick={() => {
                                            setFechaDesde("")
                                            setFechaHasta("")
                                        }}
                                        className="mt-4 text-gray-500 hover:text-red-500"
                                        title="Limpiar fechas"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Estado</p>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${filtroEstadoPendiente === "todos"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    onClick={() => setFiltroEstadoPendiente("todos")}
                                >
                                    Todos
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${filtroEstadoPendiente === "pendientes"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    onClick={() => setFiltroEstadoPendiente("pendientes")}
                                >
                                    Pendientes
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${filtroEstadoPendiente === "rechazados"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    onClick={() => setFiltroEstadoPendiente("rechazados")}
                                >
                                    Rechazados
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${filtroEstadoPendiente === "documentosIncompletos"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    onClick={() => setFiltroEstadoPendiente("documentosIncompletos")}
                                >
                                    Documentos Incompletos
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${filtroEstadoPendiente === "pagosPendientes"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    onClick={() => setFiltroEstadoPendiente("pagosPendientes")}
                                >
                                    Pagos Pendientes
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${filtroEstadoPendiente === "pagosExonerados"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    onClick={() => setFiltroEstadoPendiente("pagosExonerados")}
                                >
                                    Pagos Exonerados
                                </button>
                            </div>
                        </div>
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
                    {/* Lista de colegiados o pendientes según el tab seleccionado */}
                    {tabActivo === "registrados" ? (
                        // TABLA DE COLEGIADOS REGISTRADOS
                        <div>
                            {colegiadosFiltrados.length === 0 ? (
                                <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex justify-center mb-4">
                                        <Search size={48} className="text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-500">No se encontraron colegiados</h3>
                                    <p className="text-gray-400 mt-1">No hay registros que coincidan con tu búsqueda</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nombre
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                                    Cédula
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                                    N° Registro
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                                    <button
                                                        className="flex items-center justify-center gap-1 w-full"
                                                        onClick={toggleOrdenFechaRegistrados}
                                                    >
                                                        Fecha Registro
                                                        <ArrowUpDown
                                                            size={14}
                                                            className={`transition-transform ${ordenFechaRegistrados === "desc" ? "text-purple-600" : "text-gray-400 rotate-180"}`}
                                                        />
                                                    </button>
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                                    Especialidad
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {colegiadosFiltrados.map((colegiado) => (
                                                <tr key={colegiado.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <div className="font-medium text-gray-900">{colegiado.nombre || "-"}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell">
                                                        {colegiado.cedula || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center hidden md:table-cell">
                                                        {colegiado.numeroRegistro || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center hidden md:table-cell">
                                                        {colegiado.fechaRegistro || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center hidden lg:table-cell">
                                                        {colegiado.especialidad || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colegiado.solvente ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                                }`}
                                                        >
                                                            {colegiado.solvente ? "Solvente" : "No Solvente"}
                                                        </span>
                                                        {colegiado.solicitudes && colegiado.solicitudes.length > 0 && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                                                                Solicitudes
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                        <button
                                                            onClick={() => verDetalleColegiado(colegiado.id)}
                                                            className="text-[#C40180] hover:text-[#590248] cursor-pointer flex items-center justify-center gap-1 mx-auto"
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
                    ) : tabActivo === "pendientes" || tabActivo === "denegadas" ? (
                        // TABLA DE COLEGIADOS PENDIENTES O DENEGADAS
                        <div>
                            {pendientesFiltrados.length === 0 ? (
                                <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex justify-center mb-4">
                                        {tabActivo === "denegadas" ? (
                                            <UserX size={48} className="text-gray-300" />
                                        ) : (
                                            <CheckCircle size={48} className="text-gray-300" />
                                        )}
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-500">
                                        {tabActivo === "denegadas"
                                            ? "No hay solicitudes denegadas"
                                            : "No hay solicitudes pendientes"}
                                    </h3>
                                    <p className="text-gray-400 mt-1">
                                        {tabActivo === "denegadas"
                                            ? "No se han denegado solicitudes"
                                            : "Todas las solicitudes han sido procesadas"}
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nombre
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                                    Cédula
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                                    <button className="flex items-center justify-center gap-1 w-full" onClick={toggleOrdenFecha}>
                                                        Fecha solicitud
                                                        <ArrowUpDown
                                                            size={14}
                                                            className={`transition-transform ${ordenFecha === "desc" ? "text-purple-600" : "text-gray-400 rotate-180"}`}
                                                        />
                                                    </button>
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {/* Modificar la visualización de la etiqueta de pagos exonerados en la tabla */}
                                            {pendientesFiltrados.map((pendiente) => (
                                                <tr key={pendiente.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <div className="font-medium text-gray-900">{pendiente.nombre}</div>
                                                        <div className="text-sm text-gray-500 md:hidden">{pendiente.cedula}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell">
                                                        {pendiente.cedula}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center hidden md:table-cell">
                                                        {pendiente.fechaSolicitud}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <div className="flex flex-col sm:flex-row gap-1 justify-center items-center">
                                                            {pendiente.estado === "rechazada" ? (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                                    <AlertTriangle size={12} /> Rechazada
                                                                </span>
                                                            ) : pendiente.estado === "denegada" ? (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                    <UserX size={12} /> Denegada
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    {!pendiente.documentosCompletos && (
                                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                            <XCircle size={12} /> Documentos Incompletos
                                                                        </span>
                                                                    )}
                                                                    {pendiente.pagosPendientes && !isExonerado(pendiente) && (
                                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1 sm:mt-0 sm:ml-2">
                                                                            <XCircle size={12} /> Pagos Pendientes
                                                                        </span>
                                                                    )}
                                                                    {isExonerado(pendiente) && (
                                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1 sm:mt-0 sm:ml-2">
                                                                            <CheckCircle size={12} /> Pagos Exonerados
                                                                        </span>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                        <button
                                                            onClick={() => verDetallePendiente(pendiente.id)}
                                                            className={`text-[#C40180] hover:text-[#590248] cursor-pointer flex items-center justify-center gap-1 mx-auto ${pendiente.estado === "denegada" ? "opacity-75" : ""
                                                                }`}
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
                    ) : null}
                </>
            )}

            {/* Modal para registrar nuevo colegiado */}
            {showRegistro && (
                <RegistroColegiados
                    isAdmin={true}
                    onClose={() => setShowRegistro(false)}
                    onRegistroExitoso={handleRegistrVeoExitoso}
                />
            )}
        </div>
    )
}