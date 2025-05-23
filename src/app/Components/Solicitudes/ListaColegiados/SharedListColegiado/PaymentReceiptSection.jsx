"use client";

import { motion } from "framer-motion";
import {
    AlertCircle,
    CheckCircle,
    CreditCard,
    Eye,
    Upload,
    X,
    XCircle
} from "lucide-react";
import { useRef, useState } from "react";
import DocumentVerificationSwitch from "./DocumentVerificationSwitch";

export default function PaymentReceiptSection({
    comprobanteData,
    onUploadComprobante,
    onViewComprobante,
    onStatusChange,
    readOnly = false,
    isAdmin = false
}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [showUploadModal, setShowUploadModal] = useState(false);
    const fileInputRef = useRef(null);

    // Verificar si hay comprobante
    const hasComprobante = comprobanteData?.url || comprobanteData?.archivo;
    const isApproved = comprobanteData?.status === 'approved';
    const isRejected = comprobanteData?.status === 'rechazado';
    const isPending = comprobanteData?.status === 'pending' || (!isApproved && !isRejected);

    // Manejar selección de archivo
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar archivo
        const validTypes = ["application/pdf", "image/jpeg", "image/png"];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            setError("Tipo de archivo no válido. Por favor suba un archivo PDF, JPG o PNG.");
            setSelectedFile(null);
            return;
        }

        if (file.size > maxSize) {
            setError("El archivo es demasiado grande. El tamaño máximo es 5MB.");
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
        setError("");
    };

    // Manejar drag & drop
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];

            // Validar archivo
            const validTypes = ["application/pdf", "image/jpeg", "image/png"];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!validTypes.includes(file.type)) {
                setError("Tipo de archivo no válido. Por favor suba un archivo PDF, JPG o PNG.");
                return;
            }

            if (file.size > maxSize) {
                setError("El archivo es demasiado grande. El tamaño máximo es 5MB.");
                return;
            }

            setSelectedFile(file);
            setError("");
        }
    };

    // Manejar subida de archivo
    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Por favor seleccione un archivo para subir.");
            return;
        }

        setIsUploading(true);
        setError("");

        try {
            // Llamar a la función de upload
            if (onUploadComprobante) {
                const formData = new FormData();
                formData.append('comprobante', selectedFile);
                await onUploadComprobante(formData);
            }

            // Cerrar modal y limpiar
            setShowUploadModal(false);
            setSelectedFile(null);
        } catch (error) {
            console.error("Error al subir comprobante:", error);
            setError("Ocurrió un error al subir el comprobante. Por favor intente nuevamente.");
        } finally {
            setIsUploading(false);
        }
    };

    // Manejar cambio de estado del comprobante
    const handleStatusChange = (updatedData) => {
        if (onStatusChange) {
            onStatusChange({
                ...updatedData,
                id: 'comprobante_pago'
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
        >
            <div className="flex items-center justify-between mb-5 border-b pb-3">
                <div className="flex items-center">
                    <CreditCard size={20} className="text-[#C40180] mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">
                        Comprobante de Pago
                    </h2>
                </div>
            </div>

            {/* Estado del comprobante */}
            <div className="bg-gray-50 rounded-lg p-6">
                {hasComprobante ? (
                    <div className="space-y-4">
                        {/* Información del comprobante */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-md ${isApproved ? 'bg-green-100' :
                                        isRejected ? 'bg-red-100' :
                                            'bg-yellow-100'
                                    }`}>
                                    {isApproved ? (
                                        <CheckCircle size={20} className="text-green-600" />
                                    ) : isRejected ? (
                                        <XCircle size={20} className="text-red-600" />
                                    ) : (
                                        <AlertCircle size={20} className="text-yellow-600" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">
                                        Comprobante de pago
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        {comprobanteData?.archivo || 'comprobante_pago.pdf'}
                                    </p>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => onViewComprobante(comprobanteData)}
                                    className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                    title="Ver comprobante"
                                >
                                    <Eye size={18} />
                                </button>

                                {!readOnly && !isApproved && (
                                    <button
                                        onClick={() => setShowUploadModal(true)}
                                        className="cursor-pointer p-2 text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                                        title="Reemplazar comprobante"
                                    >
                                        <Upload size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Switch de verificación para admin */}
                        {isAdmin && !readOnly && (
                            <div className="pt-4 border-t">
                                <DocumentVerificationSwitch
                                    documento={{
                                        ...comprobanteData,
                                        id: 'comprobante_pago',
                                        nombre: 'Comprobante de pago'
                                    }}
                                    onChange={handleStatusChange}
                                    readOnly={readOnly || isApproved}
                                />
                            </div>
                        )}

                        {/* Mensaje de estado */}
                        {isApproved && (
                            <div className="mt-4 bg-green-50 p-3 rounded-md border border-green-200">
                                <p className="text-sm text-green-700 flex items-center">
                                    <CheckCircle size={16} className="mr-2" />
                                    El comprobante de pago ha sido verificado y aprobado
                                </p>
                            </div>
                        )}

                        {isRejected && comprobanteData?.rejectionReason && (
                            <div className="mt-4 bg-red-50 p-3 rounded-md border border-red-200">
                                <p className="text-sm text-red-700">
                                    <span className="font-medium">Motivo de rechazo:</span>{' '}
                                    {comprobanteData.rejectionReason}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <CreditCard size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No se ha subido comprobante de pago
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Es necesario subir el comprobante de pago para completar el registro
                        </p>
                        {!readOnly && (
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="cursor-pointer inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-md hover:opacity-90 transition-colors"
                            >
                                <Upload size={16} className="mr-2" />
                                Subir comprobante
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal para subir comprobante */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-xl w-full max-w-md"
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <div className="flex items-center">
                                <CreditCard className="text-[#C40180] mr-2" size={20} />
                                <h3 className="text-lg font-medium text-gray-900">
                                    {hasComprobante ? "Actualizar comprobante de pago" : "Subir comprobante de pago"}
                                </h3>
                            </div>
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedFile(null);
                                    setError("");
                                }}
                                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-4">
                                <p className="text-sm text-gray-600">
                                    Por favor suba el comprobante de pago de la inscripción.
                                    Formatos aceptados: PDF, JPG o PNG (máx. 5MB)
                                </p>
                            </div>

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

                                <p className="mt-1 text-xs text-gray-500">
                                    PDF, JPG o PNG (máx. 5MB)
                                </p>

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
                                    onClick={() => {
                                        setShowUploadModal(false);
                                        setSelectedFile(null);
                                        setError("");
                                    }}
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
                                            <span>{hasComprobante ? "Actualizar comprobante" : "Subir comprobante"}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}