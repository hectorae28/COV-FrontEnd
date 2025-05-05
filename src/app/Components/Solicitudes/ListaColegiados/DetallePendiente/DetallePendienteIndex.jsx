"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
    AlertCircle,
    ChevronLeft,
    CheckCircle,
    X,
    Clock,
    XCircle,
    AlertTriangle,
    UserX,
    Mail,
    Phone,
    User,
    Calendar,
    CreditCard,
} from "lucide-react"
import { useSession } from "next-auth/react"
import useDataListaColegiados from "@/app/Models/PanelControl/Solicitudes/ListaColegiadosData"

// Import components
import PersonalInfoSection from "./PersonalInfoSection "
import AcademicInfoSection from "./AcademicInfoSection "
import InstitutionsSection from "./InstitutionsSection "
import DocumentsSection from "./DocumentsSection "
import PaymentsSection from "./PaymentsSection"
import ApprovalModal from "./ApprovalModal "
import RejectModal from "./RejectModal "
import DocumentViewerModal from "./DocumentViewerModal "
import ExoneracionModal from "./ExoneracionModal "
import SessionInfo from "@/Components/SessionInfo"

export default function DetallePendiente({ params, onVolver }) {
    const { data: session } = useSession()
    const pendienteId = params?.id || "p1"

    // Obtenemos funciones del store centralizado
    const {
        getColegiadoPendiente,
        updateColegiadoPendiente,
        approveRegistration,
        rejectRegistration,
        denyRegistration,
        initSession,
    } = useDataListaColegiados()

    // Estados locales
    const [pagosPendientes, setPagosPendientes] = useState(false)
    const [pendiente, setPendiente] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
    const [mostrarRechazo, setMostrarRechazo] = useState(false)
    const [motivoRechazo, setMotivoRechazo] = useState("")
    const [confirmacionExitosa, setConfirmacionExitosa] = useState(false)
    const [rechazoExitoso, setRechazoExitoso] = useState(false)
    const [denegacionExitosa, setDenegacionExitosa] = useState(false)
    const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null)
    const [documentosCompletos, setDocumentosCompletos] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [documentosRequeridos, setDocumentosRequeridos] = useState([])
    const [cambiosPendientes, setCambiosPendientes] = useState(false)

    // Estados para exoneración de pagos
    const [mostrarExoneracion, setMostrarExoneracion] = useState(false)
    const [exoneracionExitosa, setExoneracionExitosa] = useState(false)
    const [motivoExoneracion, setMotivoExoneracion] = useState("")

    // Estados para datos de registro
    const [datosRegistro, setDatosRegistro] = useState({
        libro: "",
        pagina: "",
        num_cov: "",
    })
    const [pasoModal, setPasoModal] = useState(1)

    // Estados para edición
    const [editandoPersonal, setEditandoPersonal] = useState(false)
    const [editandoAcademico, setEditandoAcademico] = useState(false)
    const [editandoInstituciones, setEditandoInstituciones] = useState(false)
    const [datosPersonales, setDatosPersonales] = useState(null)
    const [datosAcademicos, setDatosAcademicos] = useState(null)
    const [instituciones, setInstituciones] = useState([])
    const [nuevaInstitucion, setNuevaInstitucion] = useState({
        nombre: "",
        cargo: "",
        telefono: "",
        direccion: "",
    })
    const [agregarInstitucion, setAgregarInstitucion] = useState(false)

    useEffect(() => {
        if (session) {
            initSession(session)
        }
    }, [session, initSession])

    // Cargar datos del pendiente
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)
                // Obtener datos del pendiente desde el store
                const pendienteData = getColegiadoPendiente(pendienteId)
                if (pendienteData) {
                    setPendiente(pendienteData)
                    // Inicializar estados de edición
                    setDatosPersonales({ ...pendienteData.persona })
                    setDatosAcademicos({
                        instituto_bachillerato: pendienteData.instituto_bachillerato || "",
                        universidad: pendienteData.universidad || "",
                        fecha_egreso_universidad: pendienteData.fecha_egreso_universidad || "",
                        num_registro_principal: pendienteData.num_registro_principal || "",
                        fecha_registro_principal: pendienteData.fecha_registro_principal || "",
                        num_mpps: pendienteData.num_mpps || "",
                        fecha_mpps: pendienteData.fecha_mpps || "",
                        observaciones: pendienteData.observaciones || "",
                    })
                    setInstituciones(pendienteData.instituciones ? [...pendienteData.instituciones] : [])

                    // Verificar si los documentos están completos
                    if (pendienteData.documentos) {
                        setDocumentosRequeridos(pendienteData.documentos)

                        // Verificar documentos requeridos (excluyendo los exonerados)
                        const docsRequeridos = pendienteData.documentos.filter(
                            (doc) => doc.requerido && !doc.archivo?.toLowerCase().includes("exonerado"),
                        )

                        const docsFaltantes = docsRequeridos.filter((doc) => !doc.archivo || doc.archivo === "")

                        setDocumentosCompletos(docsFaltantes.length === 0)
                    }

                    // Verificar si hay pagos pendientes
                    setPagosPendientes(pendienteData.pagosPendientes || false)
                }
                setIsLoading(false)
            } catch (error) {
                console.error("Error al cargar datos del pendiente:", error)
                setIsLoading(false)
            }
        }
        loadData()
    }, [pendienteId, getColegiadoPendiente])

    // Función para obtener iniciales del nombre
    const obtenerIniciales = () => {
        if (!pendiente) return "CN"

        const { nombre, primer_apellido } = pendiente.persona
        return `${nombre.charAt(0)}${primer_apellido.charAt(0)}`
    }

    // Funciones para gestión de documentos
    const handleVerDocumento = (documento) => {
        setDocumentoSeleccionado(documento)
    }

    const handleCerrarVistaDocumento = () => {
        setDocumentoSeleccionado(null)
    }

    // Función para actualizar un documento
    const updateDocumento = (documentoActualizado) => {
        try {
            // Actualizar el documento en la lista de documentos
            const nuevosDocumentos = documentosRequeridos.map((doc) =>
                doc.id === documentoActualizado.id ? documentoActualizado : doc,
            )

            // Actualizar el estado local
            setDocumentosRequeridos(nuevosDocumentos)

            // Actualizar en el store
            const nuevosDatos = {
                ...pendiente,
                documentos: nuevosDocumentos,
            }
            updateColegiadoPendiente(pendienteId, nuevosDatos)

            // Verificar si los documentos están completos ahora
            const docsRequeridos = nuevosDocumentos.filter(
                (doc) => doc.requerido && !doc.archivo?.toLowerCase().includes("exonerado"),
            )

            const docsFaltantes = docsRequeridos.filter((doc) => !doc.archivo || doc.archivo === "")

            setDocumentosCompletos(docsFaltantes.length === 0)
        } catch (error) {
            console.error("Error al actualizar documento:", error)
        }
    }

    // Función para manejar aprobación
    const handleAprobarSolicitud = async () => {
        try {
            if (isSubmitting) return
            setIsSubmitting(true)

            // Verificar que todos los documentos requeridos estén presentes
            if (!documentosCompletos) {
                alert("No se puede aprobar esta solicitud. Faltan documentos requeridos.")
                setIsSubmitting(false)
                return
            }

            // Asegurarnos de que la sesión esté inicializada
            if (session) {
                initSession(session)
            }

            // Guardar cambios pendientes antes de aprobar
            if (cambiosPendientes) {
                const nuevosDatos = {
                    ...pendiente,
                    persona: datosPersonales,
                    ...datosAcademicos,
                    instituciones,
                }
                updateColegiadoPendiente(pendienteId, nuevosDatos)
            }

            // Llamar a la función de aprobación del store
            const colegiadoAprobado = approveRegistration(pendienteId, datosRegistro)

            // Mostrar confirmación
            setConfirmacionExitosa(true)
            setMostrarConfirmacion(false)

            // Volver a la lista después de un tiempo con el colegiado aprobado
            setTimeout(() => {
                if (onVolver) {
                    onVolver({
                        aprobado: true,
                        colegiado: colegiadoAprobado,
                    })
                }
            }, 2000)
        } catch (error) {
            console.error("Error al aprobar solicitud:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Función para rechazar solicitud
    const handleRechazarSolicitud = async () => {
        try {
            if (!motivoRechazo.trim()) {
                alert("Debe ingresar un motivo de rechazo")
                return
            }

            setIsSubmitting(true)

            // Guardar cambios pendientes antes de rechazar
            if (cambiosPendientes) {
                const nuevosDatos = {
                    ...pendiente,
                    persona: datosPersonales,
                    ...datosAcademicos,
                    instituciones,
                }
                updateColegiadoPendiente(pendienteId, nuevosDatos)
            }

            // Llamar a la función de rechazo del store
            rejectRegistration(pendienteId, motivoRechazo, session?.user)

            // Mostrar confirmación de rechazo
            setRechazoExitoso(true)
            setMostrarRechazo(false)

            // Volver a la lista después de un tiempo
            setTimeout(() => {
                if (onVolver) {
                    onVolver({ rechazado: true })
                }
            }, 3000)
        } catch (error) {
            console.error("Error al rechazar solicitud:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Función para denegar solicitud (rechazo definitivo)
    const handleDenegarSolicitud = async () => {
        try {
            if (!motivoRechazo.trim()) {
                alert("Debe ingresar un motivo de denegación")
                return
            }

            setIsSubmitting(true)

            // Llamar a la función de denegación del store
            denyRegistration(pendienteId, motivoRechazo, session?.user)

            // Mostrar confirmación de denegación
            setDenegacionExitosa(true)
            setMostrarRechazo(false)

            // Volver a la lista después de un tiempo
            setTimeout(() => {
                if (onVolver) {
                    onVolver({ denegado: true })
                }
            }, 3000)
        } catch (error) {
            console.error("Error al denegar solicitud:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Función para exonerar pagos
    const handleExonerarPagos = async () => {
        try {
            if (!motivoExoneracion.trim()) {
                alert("Debe ingresar un motivo de exoneración")
                return
            }

            setIsSubmitting(true)

            // Asegurar que siempre haya información del usuario que exonera
            const usuarioExoneracion = session?.user || {
                username: "Administrador",
                email: "admin@cov.com",
                name: "Administración COV",
            }

            // Actualizar los pagos como exonerados
            const nuevosDatos = {
                ...pendiente,
                pagosPendientes: false,
                exoneracionPagos: {
                    fecha: new Date().toISOString(),
                    motivo: motivoExoneracion,
                    usuario: usuarioExoneracion,
                },
            }

            // Actualizar también los documentos para marcar el comprobante como exonerado
            if (nuevosDatos.documentos) {
                nuevosDatos.documentos = nuevosDatos.documentos.map((doc) => {
                    if (doc.id === "comprobante_pago" || doc.nombre.toLowerCase().includes("comprobante")) {
                        return {
                            ...doc,
                            archivo: "exonerado.pdf",
                        }
                    }
                    return doc
                })
            }

            // Actualizar en el store
            updateColegiadoPendiente(pendienteId, nuevosDatos)

            // Actualizar el estado local
            setPendiente(nuevosDatos)
            setPagosPendientes(false)
            setDocumentosRequeridos(nuevosDatos.documentos)

            // Mostrar confirmación de exoneración
            setExoneracionExitosa(true)
            setMostrarExoneracion(false)

            // Limpiar el motivo
            setMotivoExoneracion("")
        } catch (error) {
            console.error("Error al exonerar pagos:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Función para manejar retroceso
    const handleVolver = () => {
        // Preguntar si hay cambios sin guardar
        if (cambiosPendientes) {
            if (confirm("Hay cambios sin guardar. ¿Desea salir sin guardar?")) {
                onVolver({ aprobado: false })
            }
        } else {
            onVolver({ aprobado: false })
        }
    }

    // Estados de carga y error
    if (isLoading) {
        return (
            <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
            </div>
        )
    }

    if (!pendiente) {
        return (
            <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
                <div className="text-center">
                    <p className="text-xl text-red-600 mb-2">Error</p>
                    <p className="text-gray-600">No se pudo cargar los datos del pendiente.</p>
                </div>
            </div>
        )
    }

    const nombreCompleto =
        `${pendiente.persona.nombre} ${pendiente.persona.segundo_nombre || ""} ${pendiente.persona.primer_apellido} ${pendiente.persona.segundo_apellido || ""}`.trim()
    const fechaSolicitud = pendiente.fechaSolicitud || "No especificada"

    // Determinar si la solicitud está rechazada o denegada
    const isRechazada = pendiente.estado === "rechazada"
    const isDenegada = pendiente.estado === "denegada"

    return (
        <div className="w-full px-4 md:px-10 py-10 md:py-28 bg-gray-50">
            {/* Breadcrumbs */}
            <div className="mb-6">
                <button
                    onClick={handleVolver}
                    className="text-md text-[#590248] hover:text-[#C40180] flex items-center cursor-pointer transition-colors duration-200"
                >
                    <ChevronLeft size={20} className="mr-1" />
                    Volver a la lista de colegiados
                </button>
            </div>

            {/* Notificaciones de éxito y estado */}
            {confirmacionExitosa && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-100 text-green-800 p-4 rounded-md mb-6 flex items-start justify-between shadow-sm"
                >
                    <div className="flex items-center">
                        <CheckCircle size={20} className="mr-2 flex-shrink-0" />
                        <span>Se ha aprobado la solicitud correctamente. Redirigiendo a la lista de colegiados...</span>
                    </div>
                    <button
                        onClick={() => setConfirmacionExitosa(false)}
                        className="text-green-700 hover:bg-green-200 p-1 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}

            {rechazoExitoso && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-6 flex items-start justify-between shadow-sm"
                >
                    <div className="flex items-center">
                        <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                        <span>Se ha rechazado la solicitud. El solicitante podrá realizar correcciones. Redirigiendo...</span>
                    </div>
                    <button
                        onClick={() => setRechazoExitoso(false)}
                        className="text-yellow-700 hover:bg-yellow-200 p-1 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}

            {denegacionExitosa && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-100 text-red-800 p-4 rounded-md mb-6 flex items-start justify-between shadow-sm"
                >
                    <div className="flex items-center">
                        <XCircle size={20} className="mr-2 flex-shrink-0" />
                        <span>Se ha denegado la solicitud permanentemente. Redirigiendo a la lista de colegiados...</span>
                    </div>
                    <button
                        onClick={() => setDenegacionExitosa(false)}
                        className="text-red-700 hover:bg-red-200 p-1 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}

            {/* Notificación de exoneración exitosa */}
            {exoneracionExitosa && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-100 text-purple-800 p-4 rounded-md mb-6 flex items-start justify-between shadow-sm"
                >
                    <div className="flex items-center">
                        <CheckCircle size={20} className="mr-2 flex-shrink-0" />
                        <span>Los pagos han sido exonerados correctamente. Ya puede proceder con la aprobación.</span>
                    </div>
                    <button
                        onClick={() => setExoneracionExitosa(false)}
                        className="text-purple-700 hover:bg-purple-200 p-1 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}

            {cambiosPendientes && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-100 text-blue-800 p-4 rounded-md mb-6 flex items-start justify-between shadow-sm"
                >
                    <div className="flex items-center">
                        <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                        <span>Hay cambios sin guardar. Por favor guarde los cambios antes de continuar.</span>
                    </div>
                    <button
                        onClick={() => setCambiosPendientes(false)}
                        className="text-blue-700 hover:bg-blue-200 p-1 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}

            {/* Banner de solicitud rechazada o denegada */}
            {isRechazada && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-r-md shadow-sm"
                >
                    <div className="flex items-start">
                        <AlertTriangle size={24} className="text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-yellow-800 font-medium">Solicitud rechazada</h3>
                            <p className="text-yellow-700 text-sm mt-1">
                                Esta solicitud fue rechazada el {pendiente.fechaRechazo || "N/A"}.
                                <br />
                                Motivo: {pendiente.motivoRechazo || "No especificado"}
                            </p>
                            <p className="text-yellow-600 text-xs mt-2">
                                El solicitante puede realizar correcciones y volver a enviar la solicitud.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {isDenegada && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md shadow-sm"
                >
                    <div className="flex items-start">
                        <UserX size={24} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-red-800 font-medium">Solicitud denegada permanentemente</h3>
                            <p className="text-red-700 text-sm mt-1">
                                Esta solicitud fue denegada el {pendiente.fechaDenegacion || "N/A"}.
                                <br />
                                Motivo: {pendiente.motivoDenegacion || "No especificado"}
                            </p>
                            <p className="text-red-600 text-xs mt-2">
                                Esta solicitud ha sido rechazada definitivamente y no se permitirán más acciones sobre ella.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Alerta de documentos faltantes */}
            {!documentosCompletos && !isDenegada && !isRechazada && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md shadow-sm"
                >
                    <div className="flex items-start">
                        <AlertCircle size={24} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-red-800 font-medium">Documentos incompletos</h3>
                            <p className="text-red-700 text-sm mt-1">
                                Esta solicitud no puede ser aprobada hasta que todos los documentos requeridos estén completos.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Profile Card */}
            <ProfileCard
                pendiente={pendiente}
                obtenerIniciales={obtenerIniciales}
                nombreCompleto={nombreCompleto}
                fechaSolicitud={fechaSolicitud}
                documentosCompletos={documentosCompletos}
                pagosPendientes={pendiente.pagosPendientes}
                setMostrarConfirmacion={setMostrarConfirmacion}
                setMostrarRechazo={setMostrarRechazo}
                isRechazada={isRechazada}
                setMostrarExoneracion={setMostrarExoneracion}
                isDenegada={isDenegada}
            />

            {/* Main content sections */}
            <PersonalInfoSection
                pendiente={pendiente}
                datosPersonales={datosPersonales}
                setDatosPersonales={setDatosPersonales}
                editandoPersonal={editandoPersonal}
                setEditandoPersonal={setEditandoPersonal}
                updateColegiadoPendiente={updateColegiadoPendiente}
                pendienteId={pendienteId}
                setCambiosPendientes={setCambiosPendientes}
                readonly={isDenegada} // Solo lectura si está denegada
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <AcademicInfoSection
                    pendiente={pendiente}
                    datosAcademicos={datosAcademicos}
                    setDatosAcademicos={setDatosAcademicos}
                    editandoAcademico={editandoAcademico}
                    setEditandoAcademico={setEditandoAcademico}
                    updateColegiadoPendiente={updateColegiadoPendiente}
                    pendienteId={pendienteId}
                    setCambiosPendientes={setCambiosPendientes}
                    readonly={isDenegada} // Solo lectura si está denegada
                />

                <InstitutionsSection
                    pendiente={pendiente}
                    instituciones={instituciones}
                    setInstituciones={setInstituciones}
                    nuevaInstitucion={nuevaInstitucion}
                    setNuevaInstitucion={setNuevaInstitucion}
                    agregarInstitucion={agregarInstitucion}
                    setAgregarInstitucion={setAgregarInstitucion}
                    editandoInstituciones={editandoInstituciones}
                    setEditandoInstituciones={setEditandoInstituciones}
                    updateColegiadoPendiente={updateColegiadoPendiente}
                    pendienteId={pendienteId}
                    setCambiosPendientes={setCambiosPendientes}
                    readonly={isDenegada} // Solo lectura si está denegada
                />
            </div>

            {/* Documentos y pagos separados */}
            <DocumentsSection
                documentosRequeridos={documentosRequeridos}
                handleVerDocumento={handleVerDocumento}
                updateDocumento={updateDocumento}
            />

            <PaymentsSection
                documentosRequeridos={documentosRequeridos}
                handleVerDocumento={handleVerDocumento}
                pendiente={pendiente}
                updateDocumento={updateDocumento}
            />

            {/* Modals */}
            {mostrarConfirmacion && (
                <ApprovalModal
                    nombreCompleto={nombreCompleto}
                    datosRegistro={datosRegistro}
                    setDatosRegistro={setDatosRegistro}
                    pasoModal={pasoModal}
                    setPasoModal={setPasoModal}
                    handleAprobarSolicitud={handleAprobarSolicitud}
                    documentosCompletos={documentosCompletos}
                    onClose={() => setMostrarConfirmacion(false)}
                />
            )}

            {mostrarRechazo && (
                <RejectModal
                    nombreCompleto={nombreCompleto}
                    motivoRechazo={motivoRechazo}
                    setMotivoRechazo={setMotivoRechazo}
                    handleRechazarSolicitud={handleRechazarSolicitud}
                    handleDenegarSolicitud={handleDenegarSolicitud}
                    onClose={() => setMostrarRechazo(false)}
                />
            )}

            {mostrarExoneracion && (
                <ExoneracionModal
                    nombreCompleto={nombreCompleto}
                    motivoExoneracion={motivoExoneracion}
                    setMotivoExoneracion={setMotivoExoneracion}
                    handleExonerarPagos={handleExonerarPagos}
                    onClose={() => setMostrarExoneracion(false)}
                />
            )}

            {documentoSeleccionado && (
                <DocumentViewerModal
                    documento={documentoSeleccionado}
                    onClose={handleCerrarVistaDocumento}
                    pendiente={pendiente}
                />
            )}
        </div>
    )
}

// Componente ProfileCard con soporte para estados rechazados y denegados
function ProfileCard({
    pendiente,
    obtenerIniciales,
    nombreCompleto,
    fechaSolicitud,
    documentosCompletos,
    pagosPendientes,
    setMostrarConfirmacion,
    setMostrarRechazo,
    setMostrarExoneracion,
    isRechazada,
    isDenegada,
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
        >
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/5 flex justify-center items-center mb-8 md:mb-0">
                    {/* Iniciales en lugar de foto de perfil */}
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg shadow-black/40 bg-gradient-to-br from-[#C40180] to-[#7D0053] flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">{obtenerIniciales()}</span>
                    </div>
                </div>
                <div className="md:w-3/4">
                    <div className="flex flex-col md:flex-row md:justify-between mb-4">
                        <div className="md:ml-2">
                            <h1 className="text-2xl font-bold text-gray-800 mb-1">{nombreCompleto}</h1>
                            <div className="flex items-center text-sm text-gray-500">
                                <Clock size={14} className="mr-1" />
                                <span>Solicitud pendiente desde {fechaSolicitud}</span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                            {/* Estados de la solicitud */}
                            {isRechazada ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                    <AlertTriangle size={12} className="mr-1" />
                                    Rechazada
                                </span>
                            ) : isDenegada ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                    <UserX size={12} className="mr-1" />
                                    Denegada
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                    <Clock size={12} className="mr-1" />
                                    Pendiente de aprobación
                                </span>
                            )}

                            {/* Estado de pagos pendientes */}
                            {pagosPendientes && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                    <XCircle size={12} className="mr-1" />
                                    Pagos pendientes
                                </span>
                            )}

                            {/* Estado de documentos - solo si no están completos */}
                            {!documentosCompletos && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                    <AlertCircle size={12} className="mr-1" />
                                    Documentación incompleta
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mt-4">
                        <div className="flex items-center bg-gray-50 p-2 rounded-md">
                            <Mail className="text-[#C40180] h-5 w-5 mr-2" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Correo electrónico</p>
                                <p className="text-sm text-gray-700">{pendiente.persona.correo}</p>
                            </div>
                        </div>
                        <div className="flex items-center bg-gray-50 p-2 rounded-md">
                            <Phone className="text-[#C40180] h-5 w-5 mr-2" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Teléfono</p>
                                <p className="text-sm text-gray-700">{pendiente.persona.telefono_movil}</p>
                            </div>
                        </div>
                        <div className="flex items-center bg-gray-50 p-2 rounded-md">
                            <User className="text-[#C40180] h-5 w-5 mr-2" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Identificación</p>
                                <p className="text-sm text-gray-700">
                                    {pendiente.persona.nacionalidad}-{pendiente.persona.identificacion}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center bg-gray-50 p-2 rounded-md">
                            <Calendar className="text-[#C40180] h-5 w-5 mr-2" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Fecha de solicitud</p>
                                <p className="text-sm text-gray-700">{fechaSolicitud}</p>
                            </div>
                        </div>
                        {/* Información del creador del registro */}
                        {pendiente.creador && (
                            <div className="bg-gray-50 p-2 rounded-md col-span-2 mt-4">
                                <SessionInfo creador={pendiente.creador} variant="compact" />
                            </div>
                        )}

                        {/* Información sobre el rechazo si aplica */}
                        {isRechazada && pendiente.rechazadoPor && (
                            <div className="bg-yellow-50 p-2 rounded-md col-span-2 mt-4 border border-yellow-100">
                                <div className="flex items-start">
                                    <AlertTriangle size={18} className="text-yellow-600 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-800">
                                            Rechazada por: {pendiente.rechazadoPor.username}
                                        </p>
                                        <p className="text-xs text-yellow-700">Fecha: {pendiente.fechaRechazo}</p>
                                        <p className="text-xs text-yellow-700 mt-1">Motivo: {pendiente.motivoRechazo}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Información sobre la denegación si aplica */}
                        {isDenegada && pendiente.denegadoPor && (
                            <div className="bg-red-50 p-2 rounded-md col-span-2 mt-4 border border-red-100">
                                <div className="flex items-start">
                                    <UserX size={18} className="text-red-600 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-red-800">Denegada por: {pendiente.denegadoPor.username}</p>
                                        <p className="text-xs text-red-700">Fecha: {pendiente.fechaDenegacion}</p>
                                        <p className="text-xs text-red-700 mt-1">Motivo: {pendiente.motivoDenegacion}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Solo mostrar botones si NO está denegada */}
                    {!isDenegada && (
                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            {/* Mostrar botón de aprobar tanto para pendientes como para rechazadas */}
                            <button
                                onClick={() => setMostrarConfirmacion(true)}
                                disabled={!documentosCompletos || pagosPendientes}
                                className={`cursor-pointer bg-gradient-to-r ${!documentosCompletos || pagosPendientes
                                        ? "from-gray-400 to-gray-500 cursor-not-allowed"
                                        : "from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                    } text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-sm font-medium`}
                            >
                                <CheckCircle size={18} />
                                <span>Aprobar solicitud</span>
                            </button>

                            {/* Para rechazadas, mostrar botón de denegar; para pendientes, mostrar botón de rechazar */}
                            <button
                                onClick={() => setMostrarRechazo(true)}
                                className={`cursor-pointer bg-gradient-to-r ${isRechazada ? "from-red-600 to-red-700" : "from-yellow-600 to-yellow-700"
                                    } text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 shadow-sm font-medium`}
                            >
                                <XCircle size={18} />
                                <span>{isRechazada ? "Denegar solicitud" : "Rechazar solicitud"}</span>
                            </button>

                            {/* Botón para exonerar pagos (solo si hay pagos pendientes) */}
                            {pagosPendientes && (
                                <button
                                    onClick={() => setMostrarExoneracion(true)}
                                    className="cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 shadow-sm font-medium"
                                >
                                    <CreditCard size={18} />
                                    <span>Exonerar pagos</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
