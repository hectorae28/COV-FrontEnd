"use client"

import VerificationSwitch from "@/app/Components/Solicitudes/ListaColegiados/VerificationSwitch";
import { useSolicitudesStore } from "@/store/SolicitudesStore";
import { motion } from "framer-motion";
import { AlertCircle, Eye, FileText, RefreshCcw, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

export default function DocumentosSection({ solicitud, onVerDocumento, updateDocumento, onDocumentStatusChange, isAdmin }) {
    const [documentoParaSubir, setDocumentoParaSubir] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState("")
    const fileInputRef = useRef(null)

    // Función para limpiar los documentosAdjuntos quitando las keys numéricas
    const limpiarDocumentosAdjuntos = (documentosAdjuntos) => {
        if (!documentosAdjuntos) return {};

        return Object.fromEntries(
            Object.entries(documentosAdjuntos).filter(([key]) => isNaN(key) || key.includes('_'))
        );
    };

    // Obtener documentos adjuntos limpios
    const documentosAdjuntosLimpios = limpiarDocumentosAdjuntos(solicitud.documentosAdjuntos);
    // Mapa de equivalencias entre nombres de documentos y claves del backend
    const documentosMapping = {
        "foto tipo carnet": "file_foto",
        "fotos tipo carnet": "file_fotos_carnet",
        "título de especialización": "file_titulo_especializacion",
        "título de especialización (fondo negro)": "file_fondo_negro_titulo_especializacion",
        "título de odontólogo": "file_titulo_odontologo",
        "título de odontólogo (fondo negro)": "file_fondo_negro_titulo_odontologo",
        "cédula de identidad ampliada": "file_cedula_ampliada",
        "comprobante de solvencia": "file_solvencia",
        "carta de solicitud": "file_carta_solicitud",
        "cédula de identidad": "file_cedula"
    };

    // Función para buscar el campo backend de manera más flexible
    const buscarCampoBackend = (docNombre) => {
        const docNombreNormalizado = docNombre.toLowerCase();
        // Primero buscar coincidencia exacta
        if (documentosMapping[docNombreNormalizado]) {
            return documentosMapping[docNombreNormalizado];
        }
        
        // Buscar coincidencias parciales
        if (docNombreNormalizado.includes("foto") && docNombreNormalizado.includes("carnet")) {
            return docNombreNormalizado.includes("fotos") ? "fotos_carnet" : "file_foto";
        }
        if (docNombreNormalizado.includes("título") && docNombreNormalizado.includes("especialización")) {
            return docNombreNormalizado.includes("fondo negro") ? "fondo_negro_titulo_especializacion" : "titulo_especializacion";
        }
        if (docNombreNormalizado.includes("título") && docNombreNormalizado.includes("odontólogo")) {
            return docNombreNormalizado.includes("fondo negro") ? "fondo_negro_titulo_odontologo" : "titulo_odontologo";
        }
        if (docNombreNormalizado.includes("cédula") && docNombreNormalizado.includes("ampliada")) {
            return "cedula_ampliada";
        }
        if (docNombreNormalizado.includes("solvencia")) {
            return "solvencia";
        }
        if (docNombreNormalizado.includes("carta")) {
            return "carta_solicitud";
        }
        if (docNombreNormalizado.includes("cédula")) {
            return "file_cedula";
        }
        
        return null;
    };

    // Mapear los documentos requeridos al formato esperado por el componente
    const documentosFormateados = solicitud.documentosRequeridos.map((docNombre, index) => {
        const campoBackend = buscarCampoBackend(docNombre);
        
        // Get validation status from solicitud data
        let validateField = null;
        let motivoRechazoField = null;
        
        if (campoBackend && solicitud.detallesSolicitud) {
            // Search for validation status in all sections (carnet, especializacion, etc.)
            
            // Para documentos de carnet
            if (solicitud.detallesSolicitud?.carnet?.archivos) {
                const carnetArchivos = solicitud.detallesSolicitud.carnet.archivos;
                
                // Buscar con diferentes patrones de nombres
                const possibleKeys = [
                    `${campoBackend}_validate`,
                    `file_${campoBackend}_validate`,
                    campoBackend === 'file_foto' ? 'foto_validate' : null // Caso especial para foto de carnet
                ].filter(Boolean);
                
                for (const key of possibleKeys) {
                    if (carnetArchivos[key] !== undefined) {
                        validateField = carnetArchivos[key];
                        motivoRechazoField = carnetArchivos[key.replace('_validate', '_motivo_rechazo')];
                        break;
                    }
                }
            }
            
            // Para documentos de especialización
            if (solicitud.detallesSolicitud?.especializacion?.archivos) {
                const especialArchivos = solicitud.detallesSolicitud.especializacion.archivos;
                
                // Buscar con diferentes patrones de nombres
                const possibleKeys = [
                    `${campoBackend}_validate`,
                    `file_${campoBackend}_validate`
                ];
                
                for (const key of possibleKeys) {
                    if (especialArchivos[key] !== undefined) {
                        validateField = especialArchivos[key];
                        motivoRechazoField = especialArchivos[key.replace('_validate', '_motivo_rechazo')];
                        break;
                    }
                }
            }
            
            // Para documentos de constancia
            if (solicitud.detallesSolicitud?.constancias) {
                solicitud.detallesSolicitud.constancias.forEach(constancia => {
                    if (constancia.archivos) {
                        const possibleKeys = [
                            `${campoBackend}_validate`,
                            `file_${campoBackend}_validate`
                        ];
                        
                        for (const key of possibleKeys) {
                            if (constancia.archivos[key] !== undefined) {
                                validateField = constancia.archivos[key];
                                motivoRechazoField = constancia.archivos[key.replace('_validate', '_motivo_rechazo')];
                                break;
                            }
                        }
                    }
                });
            }
        }

        // Determine status based on validation field
        let status = 'pending';
        if (validateField === true) {
            status = 'approved';
        } else if (validateField === false) {
            status = 'rechazado';
        }

        return {
            id: campoBackend || `doc-${index}`,
            nombre: docNombre,
            descripcion: "Documento requerido para la solicitud",
            requerido: true,
            url: campoBackend && documentosAdjuntosLimpios[campoBackend]
                ? documentosAdjuntosLimpios[campoBackend]
                : null,
            status: status,
            rejectionReason: motivoRechazoField || '',
            isReadOnly: status === 'approved'
        };
    });

    // Función para validar archivo
    const validarArchivo = (file) => {
        // Validar tipo de archivo (PDF, JPG, PNG)
        const validTypes = ["application/pdf", "image/jpeg", "image/png"]
        if (!validTypes.includes(file.type)) {
            setError("Tipo de archivo no válido. Por favor suba un archivo PDF, JPG o PNG.")
            return false
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("El archivo es demasiado grande. El tamaño máximo es 5MB.")
            return false
        }

        return true
    }

    // Función para reemplazar documento
    const handleReemplazarDocumento = (documento) => {
        setDocumentoParaSubir(documento)
        setSelectedFile(null)
        setError("")
    }

    // Funciones para el modal de carga
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (validarArchivo(file)) {
                setSelectedFile(file)
                setError("")
            } else {
                setSelectedFile(null)
            }
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0]
            if (validarArchivo(file)) {
                setSelectedFile(file)
                setError("")
            }
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Por favor seleccione un archivo para subir.")
            return
        }

        setIsUploading(true)
        setError("")

        try {
            if (updateDocumento) {
                const Form = new FormData();
                Form.append(`${documentoParaSubir.id}`, selectedFile)

                // Actualizar el documento
                updateDocumento(Form)
            }

            // Cerrar modal después de subir
            setDocumentoParaSubir(null)
            setSelectedFile(null)
        } catch (error) {
            console.error("Error al subir documento:", error)
            setError("Ocurrió un error al subir el documento. Por favor intente nuevamente.")
        } finally {
            setIsUploading(false)
        }
    }

    // Componente de tarjeta de documento reutilizable
    const DocumentCard = ({ documento }) => {
        const tieneArchivo = !documento.requerido || (documento.requerido && documento.url !== null)
        const isReadOnly = documento.status === 'approved' && documento.isReadOnly;
        const updateDocumentoSolicitud = useSolicitudesStore(state => state.updateDocumentoSolicitud)
        // Función para ver el documento
        const handleVerDoc = () => {
            if (onVerDocumento && documento.url) {
                onVerDocumento(documento.url)
            }
        }

        return (
            <div
                className={`border rounded-lg ${tieneArchivo ? "border-gray-200 hover:border-[#C40180]" : "border-red-200 bg-red-50"
                    } hover:shadow-md transition-all duration-200`}
            >
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center mb-2">
                                <div className={`${tieneArchivo ? "bg-[#F9E6F3]" : "bg-red-100"} p-2 rounded-md mr-3`}>
                                    <FileText className={tieneArchivo ? "text-[#C40180]" : "text-red-500"} size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-gray-900 flex items-center">
                                        {documento?.nombre}
                                        {documento?.requerido && <span className="text-red-500 ml-1">*</span>}
                                    </h3>
                                    <p className="text-xs text-gray-500">{documento?.descripcion}</p>
                                </div>
                            </div>

                            {/* Mensaje cuando no hay archivo */}
                            {!tieneArchivo && (
                                <div className="mt-2 flex items-start bg-red-100 p-2 rounded text-xs text-red-600">
                                    <AlertCircle size={14} className="mr-1 flex-shrink-0 mt-0.5" />
                                    <span>
                                        Falta documento.{" "}
                                        {documento?.requerido && "Este documento es requerido para completar el registro."}
                                    </span>
                                </div>
                            )}
                            {tieneArchivo && (
                                <div className="mt-3">

                                    <VerificationSwitch
                                        item={documento}
                                        onChange={onDocumentStatusChange}
                                        readOnly={isReadOnly}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-1">
                            {tieneArchivo ? (
                                <button
                                    onClick={handleVerDoc}
                                    className="cursor-pointer text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                                    title="Ver documento"
                                >
                                    <Eye size={18} />
                                </button>
                            ) : (
                                <span className="cursor-no-drop text-gray-400 p-2" title="No hay documento para ver">
                                    <Eye size={18} />
                                </span>
                            )}

                            <button
                                onClick={() => handleReemplazarDocumento(documento)}
                                className={`${tieneArchivo ? "cursor-pointer text-orange-600 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"} cursor-pointer p-2 rounded-full transition-colors`}
                                title={tieneArchivo ? "Reemplazar documento" : "Subir documento"}
                            >
                                {tieneArchivo ? <RefreshCcw size={18} /> : <Upload size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
        >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <div className="flex items-center mb-5 md:mb-0 border-b md:border-b-0 pb-3 md:pb-0">
                    <FileText size={20} className="text-[#C40180] mr-2" />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Documentos</h2>
                        <p className="text-sm text-gray-500">Documentación obligatoria para la solicitud</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentosFormateados && documentosFormateados.length > 0 ? (
                    documentosFormateados.map((documento, index) => (
                        <DocumentCard key={index} documento={documento} />
                    ))
                ) : (
                    <div className="col-span-2 bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center">
                        <FileText size={40} className="text-gray-300 mb-3" />
                        <p className="text-gray-500 text-center">No hay documentos configurados en el sistema</p>
                    </div>
                )}
            </div>

            {/* Modal para subir documentos */}
            {documentoParaSubir && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-xl w-full max-w-md"
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <div className="flex items-center">
                                <FileText className="text-[#C40180] mr-2" size={20} />
                                <h3 className="text-lg font-medium text-gray-900">
                                    {documentoParaSubir.url ? "Actualizar documento" : "Subir documento"}
                                </h3>
                            </div>
                            <button
                                onClick={() => setDocumentoParaSubir(null)}
                                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-4">
                                <h4 className="font-medium text-gray-800 mb-1">{documentoParaSubir.nombre}</h4>
                                <p className="text-sm text-gray-500">{documentoParaSubir.descripcion}</p>
                            </div>

                            {/* Área para arrastrar y soltar archivos */}
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 ${error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-[#C40180] bg-gray-50"
                                    }`}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />

                                <Upload className="mx-auto h-12 w-12 text-gray-400" />

                                <p className="mt-2 text-sm font-medium text-gray-700">
                                    {selectedFile ? selectedFile.name : "Haga clic o arrastre un archivo aquí"}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">PDF, JPG o PNG (máx. 5MB)</p>

                                {selectedFile && (
                                    <div className="mt-2 text-sm text-green-600 font-medium">
                                        Archivo seleccionado: {selectedFile.name}
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="mb-4 flex items-start bg-red-100 p-3 rounded text-sm text-red-600">
                                    <AlertCircle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setDocumentoParaSubir(null)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                                    disabled={isUploading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={!selectedFile || isUploading}
                                    className={`px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-md hover:opacity-90 transition-colors flex items-center gap-2 ${!selectedFile || isUploading ? "opacity-70 cursor-not-allowed" : ""
                                        }`}
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                            <span>Subiendo...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={16} />
                                            <span>{documentoParaSubir.url ? "Actualizar documento" : "Subir documento"}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    )
}