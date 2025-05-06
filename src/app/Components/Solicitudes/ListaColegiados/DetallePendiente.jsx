"use client"

import useDataListaColegiados from "@/app/Models/PanelControl/Solicitudes/ListaColegiadosData"
import { ChevronLeft } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

// Import components
import AcademicInfoSection from "./DetallePendiente/AcademicInfoSection "
import { ApprovalModal, ExonerationModal, RejectModal } from "./DetallePendiente/ActionsModals"
import DocumentsSection from "./DetallePendiente/DocumentsSection"
import DocumentViewerModal from "./DetallePendiente/DocumentViewerModal"
import InstitutionsSection from "./DetallePendiente/InstitutionsSection "
import PaymentsSection from "./DetallePendiente/PaymentsSection"
import PersonalInfoSection from "./DetallePendiente/PersonalInfoSection "
import ProfileCard from "./DetallePendiente/ProfileCard"
import StatusAlerts from "./DetallePendiente/StatusAlerts"

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
    const [solicitudes, setSolicitudes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Estados para modales
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
    const [mostrarRechazo, setMostrarRechazo] = useState(false)
    const [mostrarExoneracion, setMostrarExoneracion] = useState(false)
    const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null)

    // Estados para datos
    const [pagosPendientes, setPagosPendientes] = useState(false)
    const [motivoRechazo, setMotivoRechazo] = useState("")
    const [motivoExoneracion, setMotivoExoneracion] = useState("")
    const [documentosCompletos, setDocumentosCompletos] = useState(false)
    const [documentosRequeridos, setDocumentosRequeridos] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Estados para notificaciones
    const [confirmacionExitosa, setConfirmacionExitosa] = useState(false)
    const [rechazoExitoso, setRechazoExitoso] = useState(false)
    const [denegacionExitosa, setDenegacionExitosa] = useState(false)
    const [exoneracionExitosa, setExoneracionExitosa] = useState(false)

    // Estados para edición
    const [editandoPersonal, setEditandoPersonal] = useState(false)
    const [editandoAcademico, setEditandoAcademico] = useState(false)
    const [editandoInstituciones, setEditandoInstituciones] = useState(false)
    const [datosPersonales, setDatosPersonales] = useState(null)
    const [datosAcademicos, setDatosAcademicos] = useState(null)
    const [instituciones, setInstituciones] = useState([])
    const [agregarInstitucion, setAgregarInstitucion] = useState(false)
    const [nuevaInstitucion, setNuevaInstitucion] = useState({
        nombre: "",
        cargo: "",
        telefono: "",
        direccion: "",
    })

    // Estados para datos de registro
    const [datosRegistro, setDatosRegistro] = useState({
        libro: "",
        pagina: "",
        num_cov: "",
    })
    const [pasoModal, setPasoModal] = useState(1)

    useEffect(() => {
        if (session) {
            initSession(session)
        }
    }, [session, initSession])

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                setIsLoading(true)

                // Obtener solicitudes desde el store centralizado
                const solicitudesColegiado = getSolicitudes(colegiadoId)
                setSolicitudes(solicitudesColegiado)

                setIsLoading(false)
            } catch (error) {
                console.error("Error al cargar las solicitudes:", error)
                setIsLoading(false)
            }
        }

        fetchSolicitudes()
    }, [colegiadoId, getSolicitudes, forceUpdate])

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

            {/* Alertas de estado */}
            <StatusAlerts
                confirmacionExitosa={confirmacionExitosa}
                rechazoExitoso={rechazoExitoso}
                denegacionExitosa={denegacionExitosa}
                exoneracionExitosa={exoneracionExitosa}
                cambiosPendientes={cambiosPendientes}
                documentosCompletos={documentosCompletos}
                isRechazada={isRechazada}
                isDenegada={isDenegada}
                pendiente={pendiente}
                setConfirmacionExitosa={setConfirmacionExitosa}
                setRechazoExitoso={setRechazoExitoso}
                setDenegacionExitosa={setDenegacionExitosa}
                setExoneracionExitosa={setExoneracionExitosa}
                setCambiosPendientes={setCambiosPendientes}
            />

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
                readonly={isDenegada}
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
                    readonly={isDenegada}
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
                    readonly={isDenegada}
                />
            </div>

            {/* Documentos y pagos */}
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
                <ExonerationModal
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