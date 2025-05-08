"use client"

import { Eye, CreditCard, CheckCircle, AlertCircle, Upload, RefreshCcw, X } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useRef } from "react"

export default function PaymentsSection({ documentosRequeridos, handleVerDocumento, pendiente, updateDocumento }) {
    const [documentoParaSubir, setDocumentoParaSubir] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState("")
    const fileInputRef = useRef(null)

    // Filtrar solo los comprobantes de pago
    const comprobantesPago = null

    // Función para determinar si un archivo está exonerado
    const isExonerado = (documento) => {
        return (
            (documento && documento.archivo && documento.archivo.toLowerCase().includes("exonerado")) ||
            (documento &&
                documento.id.includes("comprobante_pago") &&
                pendiente &&
                pendiente.exoneracionPagos &&
                pendiente.exoneracionPagos.fecha)
        )
    }

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
            // Simulación de carga
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // Simular respuesta exitosa
            const uploadedFileUrl = URL.createObjectURL(selectedFile)

            // Actualizar el documento
            if (updateDocumento) {
                // Create the updated document object with all necessary properties
                const updatedDoc = {
                    ...documentoParaSubir,
                    archivo: selectedFile.name,
                    archivoUrl: uploadedFileUrl,
                }

                // This will trigger the pagosPendientes update in the parent component
                updateDocumento(updatedDoc)
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

    // Componente de tarjeta de comprobante reutilizable
    const ComprobanteCard = ({ documento }) => {
        const exonerado = isExonerado(documento)
        const tieneArchivo = !!documento.archivo

        return (
            <div
                className={`border rounded-lg ${exonerado
                        ? "border-green-200 bg-green-50"
                        : tieneArchivo
                            ? "border-gray-200 hover:border-[#C40180]"
                            : "border-red-200 bg-red-50"
                    } hover:shadow-md transition-all duration-200`}
            >
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center mb-2">
                                <div
                                    className={`${exonerado ? "bg-green-100" : tieneArchivo ? "bg-[#F9E6F3]" : "bg-red-100"} p-2 rounded-md mr-3`}
                                >
                                    {exonerado ? (
                                        <CheckCircle className="text-green-500" size={20} />
                                    ) : (
                                        <CreditCard className={tieneArchivo ? "text-[#C40180]" : "text-red-500"} size={20} />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 flex items-center">
                                        {exonerado ? "Exoneración de Pago" : documento.nombre}
                                        {documento.requerido && !exonerado && <span className="text-red-500 ml-1">*</span>}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {exonerado ? "Pago exonerado administrativamente" : documento.descripcion}
                                    </p>
                                </div>
                            </div>

                            {/* Mensaje cuando no hay archivo */}
                            {!tieneArchivo && !exonerado && (
                                <div className="mt-2 flex items-start bg-red-100 p-2 rounded text-xs text-red-600">
                                    <AlertCircle size={14} className="mr-1 flex-shrink-0 mt-0.5" />
                                    <span>
                                        Falta comprobante.{" "}
                                        {documento.requerido && "Este comprobante es requerido para completar el registro."}
                                    </span>
                                </div>
                            )}

                            {/* Mensaje cuando es un archivo exonerado */}
                            {exonerado && (
                                <div className="mt-2 flex items-start bg-green-100 p-2 rounded text-xs text-green-600">
                                    <CheckCircle size={14} className="mr-1 flex-shrink-0 mt-0.5" />
                                    <span>Exonerado por administración</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-1">
                            {tieneArchivo || exonerado ? (
                                <button
                                    onClick={() => handleVerDocumento(documento)}
                                    className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                                    title="Ver comprobante"
                                >
                                    <Eye size={18} />
                                </button>
                            ) : (
                                <span className="text-gray-400 p-2" title="No hay comprobante para ver">
                                    <Eye size={18} />
                                </span>
                            )}

                            {!exonerado && (
                                <button
                                    onClick={() => handleReemplazarDocumento(documento)}
                                    className={`${tieneArchivo ? "text-orange-600 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"} p-2 rounded-full transition-colors`}
                                    title={tieneArchivo ? "Reemplazar comprobante" : "Subir comprobante"}
                                >
                                    {tieneArchivo ? <RefreshCcw size={18} /> : <Upload size={18} />}
                                </button>
                            )}
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
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
        >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <div className="flex items-center mb-5 md:mb-0 border-b md:border-b-0 pb-3 md:pb-0">
                    <CreditCard size={20} className="text-[#C40180] mr-2" />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Comprobantes de Pago</h2>
                        <p className="text-sm text-gray-500">Comprobantes de inscripción y otros pagos</p>
                    </div>
                </div>
            </div>

            {pendiente && pendiente.exoneracionPagos && pendiente.exoneracionPagos.fecha && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-start">
                            <CheckCircle size={20} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-medium text-green-800">Pagos exonerados</h3>
                                <p className="text-sm text-green-700 mt-1">
                                    Los pagos han sido exonerados el {new Date(pendiente.exoneracionPagos.fecha).toLocaleDateString()} por{" "}
                                    {pendiente.exoneracionPagos.usuario
                                        ? `${pendiente.exoneracionPagos.usuario.username || pendiente.exoneracionPagos.usuario.name || pendiente.exoneracionPagos.usuario.email}`
                                        : "Administración COV"}
                                </p>
                                {pendiente.exoneracionPagos.motivo && (
                                    <p className="text-xs text-green-600 mt-1">Motivo: {pendiente.exoneracionPagos.motivo}</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                // Crear un documento virtual para ver la exoneración
                                const docExoneracion = {
                                    id: "exoneracion_pago",
                                    nombre: "Exoneración de Pago",
                                    descripcion: "Documento de exoneración de pago",
                                    archivo: "exonerado.pdf",
                                }
                                handleVerDocumento(docExoneracion)
                            }}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                            title="Ver detalles de exoneración"
                        >
                            <Eye size={18} />
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comprobantesPago && comprobantesPago.length > 0 && !pendiente?.exoneracionPagos?.fecha ? (
                    comprobantesPago.map((documento) => <ComprobanteCard key={documento.id} documento={documento} />)
                ) : !pendiente?.exoneracionPagos?.fecha ? (
                    <div className="col-span-2 bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center">
                        <CreditCard size={40} className="text-gray-300 mb-3" />
                        <p className="text-gray-500 text-center">No hay comprobantes de pago registrados</p>
                    </div>
                ) : null}
            </div>

            {/* Modal para subir documentos - similar al de DocumentsSection */}
            {documentoParaSubir && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-xl w-full max-w-md"
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <div className="flex items-center">
                                <CreditCard className="text-[#C40180] mr-2" size={20} />
                                <h3 className="text-lg font-medium text-gray-900">
                                    {documentoParaSubir.archivo ? "Actualizar comprobante" : "Subir comprobante"}
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
                                    className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                                    disabled={isUploading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={!selectedFile || isUploading}
                                    className={`cursor-pointer px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-md hover:opacity-90 transition-colors flex items-center gap-2 ${!selectedFile || isUploading ? "opacity-70 cursor-not-allowed" : ""
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
                                            <span>{documentoParaSubir.archivo ? "Actualizar comprobante" : "Subir comprobante"}</span>
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
