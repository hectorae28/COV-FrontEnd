"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ChevronLeft, CheckCircle, X } from "lucide-react";
import { useSession } from "next-auth/react";
import useDataListaColegiados from "@/store/ListaColegiadosData";

// Import components
import PersonalInfoSection from "./PersonalInfoSection ";
import AcademicInfoSection from "./AcademicInfoSection ";
import InstitutionsSection from "./InstitutionsSection ";
import DocumentsSection from "./DocumentsSection ";
import ApprovalModal from "./ApprovalModal ";
import RejectModal from "./RejectModal ";
import DocumentViewerModal from "./DocumentViewerModal ";

export default function DetallePendiente({ params, onVolver }) {
    const { data: session } = useSession();
    const pendienteId = params?.id || "p1";
    // Obtenemos funciones del store centralizado
    const {
        getColegiadoPendiente,
        updateColegiadoPendiente,
        approveRegistration,
    } = useDataListaColegiados();

    // Estados locales
    const [pendiente, setPendiente] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [mostrarRechazo, setMostrarRechazo] = useState(false);
    const [motivoRechazo, setMotivoRechazo] = useState("");
    const [confirmacionExitosa, setConfirmacionExitosa] = useState(false);
    const [rechazoExitoso, setRechazoExitoso] = useState(false);
    const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
    const [documentosCompletos, setDocumentosCompletos] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [documentosRequeridos, setDocumentosRequeridos] = useState([]);
    const [cambiosPendientes, setCambiosPendientes] = useState(false);

    // Estados para datos de registro
    const [datosRegistro, setDatosRegistro] = useState({
        libro: "",
        pagina: "",
        num_cov: ""
    });
    const [pasoModal, setPasoModal] = useState(1);

    // Estados para edición
    const [editandoPersonal, setEditandoPersonal] = useState(false);
    const [editandoAcademico, setEditandoAcademico] = useState(false);
    const [editandoInstituciones, setEditandoInstituciones] = useState(false);
    const [datosPersonales, setDatosPersonales] = useState(null);
    const [datosAcademicos, setDatosAcademicos] = useState(null);
    const [instituciones, setInstituciones] = useState([]);
    const [nuevaInstitucion, setNuevaInstitucion] = useState({
        nombre: "",
        cargo: "",
        telefono: "",
        direccion: ""
    });
    const [agregarInstitucion, setAgregarInstitucion] = useState(false);

    // Cargar datos del pendiente
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);

                // Obtener datos del pendiente desde el store
                const pendienteData = getColegiadoPendiente(pendienteId);

                if (pendienteData) {
                    setPendiente(pendienteData);

                    // Inicializar estados de edición
                    setDatosPersonales({ ...pendienteData.persona });
                    setDatosAcademicos({
                        instituto_bachillerato: pendienteData.instituto_bachillerato || "",
                        universidad: pendienteData.universidad || "",
                        fecha_egreso_universidad: pendienteData.fecha_egreso_universidad || "",
                        num_registro_principal: pendienteData.num_registro_principal || "",
                        fecha_registro_principal: pendienteData.fecha_registro_principal || "",
                        num_mpps: pendienteData.num_mpps || "",
                        fecha_mpps: pendienteData.fecha_mpps || "",
                        observaciones: pendienteData.observaciones || ""
                    });

                    setInstituciones(pendienteData.instituciones ? [...pendienteData.instituciones] : []);

                    // Verificar si los documentos están completos
                    if (pendienteData.documentos) {
                        setDocumentosRequeridos(pendienteData.documentos);
                        setDocumentosCompletos(verificarDocumentosCompletos(pendienteData.documentos));
                    }
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Error al cargar datos del pendiente:", error);
                setIsLoading(false);
            }
        };

        loadData();
    }, [pendienteId, getColegiadoPendiente]);

    // Función para obtener iniciales del nombre
    const obtenerIniciales = () => {
        if (!pendiente) return "CN";

        const { nombre, primer_apellido } = pendiente.persona;
        return `${nombre.charAt(0)}${primer_apellido.charAt(0)}`;
    };

    // Funciones para gestión de documentos
    const handleVerDocumento = (documento) => {
        setDocumentoSeleccionado(documento);
    };

    const handleCerrarVistaDocumento = () => {
        setDocumentoSeleccionado(null);
    };

    // Función para verificar si todos los documentos requeridos están completos
    const verificarDocumentosCompletos = (documentos) => {
        if (!Array.isArray(documentos)) {
            console.error("Error: Los documentos no son un array:", documentos);
            return false;
        }

        const documentosFaltantes = documentos.filter(
            (doc) => doc.requerido && !doc.archivo
        );
        return documentosFaltantes.length === 0;
    };

    // Función para manejar aprobación
    const handleAprobarSolicitud = async () => {
        try {
            if (isSubmitting) return;
            setIsSubmitting(true);

            // Guardar cambios pendientes antes de aprobar
            if (cambiosPendientes) {
                const nuevosDatos = {
                    ...pendiente,
                    persona: datosPersonales,
                    ...datosAcademicos,
                    instituciones
                };
                updateColegiadoPendiente(pendienteId, nuevosDatos);
            }

            // Llamar a la función de aprobación del store
            const colegiadoAprobado = approveRegistration(pendienteId, datosRegistro);

            // Mostrar confirmación
            setConfirmacionExitosa(true);
            setMostrarConfirmacion(false);

            // Volver a la lista después de un tiempo con el colegiado aprobado
            setTimeout(() => {
                if (onVolver) {
                    onVolver({
                        aprobado: true,
                        colegiado: colegiadoAprobado
                    });
                }
            }, 2000);
        } catch (error) {
            console.error("Error al aprobar solicitud:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Función para rechazar solicitud
    const handleRechazarSolicitud = async () => {
        try {
            if (!motivoRechazo.trim()) {
                alert("Debe ingresar un motivo de rechazo");
                return;
            }

            // Guardar cambios pendientes antes de rechazar
            if (cambiosPendientes) {
                const nuevosDatos = {
                    ...pendiente,
                    persona: datosPersonales,
                    ...datosAcademicos,
                    instituciones
                };
                updateColegiadoPendiente(pendienteId, nuevosDatos);
            }

            // Simular proceso de rechazo
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mostrar confirmación de rechazo
            setRechazoExitoso(true);
            setMostrarRechazo(false);

            // Volver a la lista después de un tiempo
            setTimeout(() => {
                if (onVolver) {
                    onVolver();
                }
            }, 3000);
        } catch (error) {
            console.error("Error al rechazar solicitud:", error);
        }
    };

    // Función para manejar retroceso
    const handleVolver = () => {
        // Preguntar si hay cambios sin guardar
        if (cambiosPendientes) {
            if (confirm("Hay cambios sin guardar. ¿Desea salir sin guardar?")) {
                onVolver({ aprobado: false });
            }
        } else {
            onVolver({ aprobado: false });
        }
    };

    // Estados de carga y error
    if (isLoading) {
        return (
            <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
            </div>
        );
    }

    if (!pendiente) {
        return (
            <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
                <div className="text-center">
                    <p className="text-xl text-red-600 mb-2">Error</p>
                    <p className="text-gray-600">No se pudo cargar los datos del pendiente.</p>
                </div>
            </div>
        );
    }

    const nombreCompleto = `${pendiente.persona.nombre} ${pendiente.persona.segundo_nombre || ''} ${pendiente.persona.primer_apellido} ${pendiente.persona.segundo_apellido || ''}`.trim();
    const fechaSolicitud = pendiente.fechaSolicitud || "No especificada";

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

            {/* Notificaciones de éxito */}
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
                        <span>Se ha rechazado la solicitud correctamente. Redirigiendo a la lista de colegiados...</span>
                    </div>
                    <button
                        onClick={() => setRechazoExitoso(false)}
                        className="text-yellow-700 hover:bg-yellow-200 p-1 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}

            {/* Notificación de cambios sin guardar */}
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

            {/* Profile Card */}
            <ProfileCard
                pendiente={pendiente}
                obtenerIniciales={obtenerIniciales}
                nombreCompleto={nombreCompleto}
                fechaSolicitud={fechaSolicitud}
                documentosCompletos={documentosCompletos}
                setMostrarConfirmacion={setMostrarConfirmacion}
                setMostrarRechazo={setMostrarRechazo}
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
                />
            </div>

            <DocumentsSection
                documentosRequeridos={documentosRequeridos}
                handleVerDocumento={handleVerDocumento}
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
                    onClose={() => setMostrarConfirmacion(false)}
                />
            )}

            {mostrarRechazo && (
                <RejectModal
                    nombreCompleto={nombreCompleto}
                    motivoRechazo={motivoRechazo}
                    setMotivoRechazo={setMotivoRechazo}
                    handleRechazarSolicitud={handleRechazarSolicitud}
                    onClose={() => setMostrarRechazo(false)}
                />
            )}

            {documentoSeleccionado && (
                <DocumentViewerModal
                    documento={documentoSeleccionado}
                    onClose={handleCerrarVistaDocumento}
                />
            )}
        </div>
    );
}

// Simple Profile Card component
function ProfileCard({
    pendiente,
    obtenerIniciales,
    nombreCompleto,
    fechaSolicitud,
    documentosCompletos,
    setMostrarConfirmacion,
    setMostrarRechazo
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
                        <span className="text-4xl font-bold text-white">
                            {obtenerIniciales()}
                        </span>
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
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                <Clock size={12} className="mr-1" />
                                Pendiente de aprobación
                            </span>

                            {/* Estado de documentos */}
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${documentosCompletos
                                    ? "bg-green-100 text-green-800 border border-green-200"
                                    : "bg-red-100 text-red-800 border border-red-200"
                                    }`}
                            >
                                {documentosCompletos ? (
                                    <>
                                        <CheckCircle size={12} className="mr-1" />
                                        Documentación completa
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle size={12} className="mr-1" />
                                        Documentación incompleta
                                    </>
                                )}
                            </span>
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
                                <p className="text-sm text-gray-700">{pendiente.persona.nacionalidad}-{pendiente.persona.identificacion}</p>
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
                                <SessionInfo
                                    creador={pendiente.creador}
                                    variant="compact"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => setMostrarConfirmacion(true)}
                            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-sm font-medium"
                        >
                            <CheckCircle size={18} />
                            <span>Aprobar solicitud</span>
                        </button>

                        <button
                            onClick={() => setMostrarRechazo(true)}
                            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-sm font-medium"
                        >
                            <XCircle size={18} />
                            <span>Rechazar solicitud</span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Ensure these imports are added at the top
import {
    Mail,
    Phone,
    User,
    Calendar,
    Clock,
    XCircle
} from "lucide-react";
import SessionInfo from "@/Components/SessionInfo";