"use client";

import PagosColg from "@/app/Components/PagosModal";
import { motion } from "framer-motion";
import {
    AlertCircle, Calendar, CheckCircle, CreditCard, DollarSign,
    Hash, RefreshCcw, Upload, X, XCircle
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import VerificationSwitch from "../VerificationSwitch";
import { DocumentViewer } from "./DocumentModule";

export default function PaymentReceiptSection({
    entityData = null,
    onUploadComprobante,
    onValidationChange,
    readOnly = false,
    isAdmin = false,
    costoInscripcion = 50,
    metodoPago = [],
    tasaBCV = 0
}) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Estados para cambios locales inmediatos
    const [localPaymentData, setLocalPaymentData] = useState(entityData);
    const [localPaymentChanges, setLocalPaymentChanges] = useState({});
    
    // Estados para el visor de comprobantes
    const [showComprobanteViewer, setShowComprobanteViewer] = useState(false);
    const [comprobanteParaVer, setComprobanteParaVer] = useState(null);
    
    // Estados para notificaciones
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadedPaymentInfo, setUploadedPaymentInfo] = useState("");

    const fileInputRef = useRef(null);

    // Sincronizar datos cuando cambien los props
    useEffect(() => {
        setLocalPaymentData(entityData);
        
        // Limpiar cambios locales que ya están reflejados en el servidor
        if (entityData) {
            setLocalPaymentChanges(prevChanges => {
                const newChanges = { ...prevChanges };
                Object.keys(prevChanges).forEach(changeKey => {
                    if (entityData[changeKey] === prevChanges[changeKey]) {
                        delete newChanges[changeKey];
                    }
                });
                return newChanges;
            });
        }
    }, [entityData]);

    // Función para obtener valor considerando cambios locales
    const getFieldValue = useCallback((fieldName, defaultValue = null) => {
        return localPaymentChanges.hasOwnProperty(fieldName) 
            ? localPaymentChanges[fieldName] 
            : (localPaymentData?.[fieldName] ?? defaultValue);
    }, [localPaymentChanges, localPaymentData]);

    // Función para extraer datos del comprobante desde el backend
    const extractComprobanteData = useCallback(() => {
        const pagoData = getFieldValue('pago');
        if (!pagoData) return null;

        const comprobanteUrl = pagoData.comprobante_url;
        if (!comprobanteUrl) return null;

        // Mapear status del backend a estados del componente
        let status = "pending"; // Default
        const backendStatus = pagoData.status;
        
        if (backendStatus === "aprobado") {
            status = "approved";
        } else if (backendStatus === "rechazado") {
            status = "rechazado";
        } else {
            status = "pending"; // "revisión" o cualquier otro valor
        }

        return {
            id: "comprobante_pago",
            nombre: "Comprobante de pago",
            archivo: comprobanteUrl.split("/").pop(),
            url: comprobanteUrl,
            status: status,
            rejectionReason: pagoData.motivo_rechazo || "",
            paymentDetails: {
                fecha_pago: pagoData.fecha_pago,
                numero_referencia: pagoData.num_referencia,
                monto: pagoData.monto,
                metodo_pago: pagoData.metodo_de_pago?.nombre || "Método de pago",
                metodo_pago_slug: pagoData.metodo_de_pago?.datos_adicionales?.slug || "unknown",
                tasa_bcv: pagoData.tasa_bcv_del_dia || pagoData.tasa_bcv
            }
        };
    }, [getFieldValue]);

    const comprobanteData = extractComprobanteData();
    const hasComprobante = !!(comprobanteData?.url);
    const hasPayment = !!(getFieldValue('pago'));
    const isApproved = comprobanteData?.status === 'approved';
    const isRejected = comprobanteData?.status === 'rechazado';

    // Manejo de subida de comprobantes con actualización local
    const handlePaymentComplete = async (paymentData) => {
        try {
            setIsProcessing(true);

            // Validaciones básicas (solo las esenciales)
            if (!paymentData.metodo_de_pago?.id) {
                throw new Error("Debe seleccionar un método de pago válido");
            }
            
            if (!paymentData.referenceNumber || paymentData.referenceNumber.trim() === "") {
                throw new Error("El número de referencia es obligatorio");
            }
            
            if (!paymentData.paymentFile) {
                throw new Error("No se seleccionó archivo de comprobante");
            }

            // Crear datos del pago como en la implementación original
            const pagoData = {
                fecha_pago: paymentData.paymentDate,
                num_referencia: paymentData.referenceNumber,
                monto: paymentData.totalAmount,
                metodo_de_pago: paymentData.metodo_de_pago?.id,
                tasa_bcv_del_dia: paymentData.tasa_bcv_del_dia
            };

            // Crear FormData exactamente como en la implementación original
            const formData = new FormData();
            formData.append("comprobante", paymentData.paymentFile);
            formData.append("pago", JSON.stringify(pagoData));
            formData.append("comprobante_validate", "revisando");
            formData.append("status", "revisando");

            // Crear datos temporales para mostrar cambio inmediato
            const tempUrl = URL.createObjectURL(paymentData.paymentFile);
            const tempPaymentData = {
                monto: paymentData.totalAmount,
                fecha_pago: paymentData.paymentDate,
                num_referencia: paymentData.referenceNumber,
                metodo_de_pago: paymentData.metodo_de_pago,
                status: "revision", // Nuevo comprobante va a revisión
                comprobante_url: tempUrl,
                tasa_bcv_del_dia: paymentData.tasa_bcv_del_dia
            };

            // Actualización local inmediata
            setLocalPaymentChanges(prevChanges => ({
                ...prevChanges,
                pago: tempPaymentData
            }));

            // Mostrar notificación de éxito inmediatamente
            setUploadSuccess(true);
            setUploadedPaymentInfo("Comprobante de pago");
            setTimeout(() => setUploadSuccess(false), 5000);

            // Cerrar modal inmediatamente
            setShowPaymentModal(false);

            // Subir al servidor
            const response = await onUploadComprobante(formData);

            // Actualizar con datos reales del servidor
            if (response?.data) {
                URL.revokeObjectURL(tempUrl); // Limpiar URL temporal
                
                setLocalPaymentData(prevData => ({
                    ...prevData,
                    ...response.data
                }));
                
                // Limpiar cambios locales
                setLocalPaymentChanges(prevChanges => {
                    const newChanges = { ...prevChanges };
                    delete newChanges.pago;
                    return newChanges;
                });
            }
        } catch (error) {
            console.error("Error al subir comprobante:", error);
            
            // Revertir cambios locales si falla
            setLocalPaymentChanges(prevChanges => {
                const newChanges = { ...prevChanges };
                delete newChanges.pago;
                return newChanges;
            });
            
            setUploadSuccess(false);
            
            // Manejo específico de errores
            if (error.code === 'ECONNABORTED' || 
                error.message.includes('timeout') || 
                error.name === 'AxiosError' && error.message.includes('timeout')) {
                alert("⏰ El servidor está tardando más de lo esperado.\n\n✅ Tu comprobante puede haberse subido correctamente.\n\n🔄 Refresca la página para verificar o intenta nuevamente en unos minutos.");
            } else if (error.response?.status >= 500) {
                alert("🚨 Error del servidor. Por favor intenta nuevamente en unos minutos.");
            } else if (error.response?.status === 413) {
                alert("📁 El archivo es demasiado grande. Por favor sube un archivo más pequeño.");
            } else {
                alert(`❌ Error: ${error.message}`);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    // Manejar visualización de comprobantes
    const handleViewComprobante = useCallback((comprobante) => {
        setComprobanteParaVer({
            ...comprobante,
            nombre: comprobante.nombre || "Comprobante de pago"
        });
        setShowComprobanteViewer(true);
    }, []);

    // Manejar cambios de validación del VerificationSwitch
    const handleValidationChange = useCallback((updatedComprobante) => {
        // Mapear estados del componente al backend
        let backendStatus;
        if (updatedComprobante.status === "approved") {
            backendStatus = "aprobado";
        } else if (updatedComprobante.status === "rechazado") {
            backendStatus = "rechazado";
        } else {
            backendStatus = "revision";
        }

        // Actualizar cambios locales
        setLocalPaymentChanges(prevChanges => ({
            ...prevChanges,
            pago: {
                ...getFieldValue('pago'),
                status: backendStatus,
                motivo_rechazo: updatedComprobante.rejectionReason || ""
            }
        }));

        // Llamar al callback del padre
        if (onValidationChange) {
            onValidationChange(updatedComprobante);
        }
    }, [getFieldValue, onValidationChange]);

    // Estilos dinámicos para la tarjeta
    const getCardClasses = () => {
        let base = "border rounded-lg transition-all duration-200";
        if (isApproved) {
            base += " border-green-200 bg-green-50";
        } else if (isRejected) {
            base += " border-red-200 bg-red-50";
        } else if (hasComprobante) {
            base += " border-gray-200 hover:border-[#C40180] hover:shadow-md cursor-pointer bg-white";
        } else {
            base += " border-red-200 bg-red-50";
        }
        return base;
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5 border-b pb-3">
                    <div className="flex items-center">
                        <CreditCard size={20} className="text-[#C40180] mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900">Comprobante de Pago</h2>
                    </div>
                </div>

                {/* Notificación de éxito */}
                {uploadSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start justify-between"
                    >
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-medium">Comprobante subido exitosamente</p>
                                <p className="text-sm">{uploadedPaymentInfo} ha sido cargado al sistema.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setUploadSuccess(false)}
                            className="text-green-700 hover:bg-green-200 p-1 rounded-full"
                        >
                            <X size={18} />
                        </button>
                    </motion.div>
                )}

                {/* Contenido principal */}
                <div>
                    {hasComprobante || hasPayment ? (
                        <div className={getCardClasses()}>
                            <div className="p-4 flex justify-between items-start">
                                <div
                                    className="flex items-center flex-1 min-w-0"
                                    style={{ cursor: hasComprobante ? "pointer" : "default" }}
                                    onClick={() => {
                                        if (hasComprobante) handleViewComprobante(comprobanteData);
                                    }}
                                >
                                    <div className={`${isApproved
                                        ? "bg-green-100"
                                        : isRejected
                                            ? "bg-red-100"
                                            : hasComprobante
                                                ? "bg-[#F9E6F3]"
                                                : hasPayment
                                                    ? "bg-yellow-100"
                                                    : "bg-red-100"
                                        } p-2 rounded-md mr-3`}>
                                        {isApproved ? (
                                            <CheckCircle className="text-green-500" size={20} />
                                        ) : isRejected ? (
                                            <XCircle className="text-red-500" size={20} />
                                        ) : hasComprobante ? (
                                            <AlertCircle className="text-[#C40180]" size={20} />
                                        ) : hasPayment ? (
                                            <AlertCircle className="text-yellow-500" size={20} />
                                        ) : (
                                            <AlertCircle className="text-red-500" size={20} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 flex items-center">
                                            {hasComprobante
                                                ? (comprobanteData?.nombre || "Comprobante de pago")
                                                : hasPayment
                                                    ? "Pago registrado - Pendiente de comprobante"
                                                    : "Sin comprobante"
                                            }
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {hasComprobante
                                                ? (comprobanteData?.archivo || "comprobante_pago.pdf")
                                                : hasPayment
                                                    ? "Comprobante pendiente de subir"
                                                    : "No se ha subido comprobante"
                                            }
                                        </p>
                                        <div className="flex items-center mt-1">
                                            <span className={`text-xs px-2 py-1 rounded-full ${isApproved ? 'bg-green-100 text-green-800' :
                                                    isRejected ? 'bg-red-100 text-red-800' :
                                                        hasComprobante ? 'bg-yellow-100 text-yellow-800' :
                                                            hasPayment ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'
                                                }`}>
                                                {isApproved ? 'Aprobado' :
                                                    isRejected ? 'Rechazado' :
                                                        hasComprobante ? 'Pendiente de revisión' :
                                                            hasPayment ? 'Pago registrado - Falta comprobante' :
                                                                'Sin pago registrado'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex flex-col items-end space-y-2 ml-4">
                                    {!readOnly && (!isApproved) && (
                                        <button
                                            onClick={e => { e.stopPropagation(); setShowPaymentModal(true); }}
                                            className="text-orange-600 hover:bg-orange-50 p-2 rounded-full transition-colors"
                                            title={hasComprobante ? "Subir nuevo comprobante" : "Realizar pago"}
                                        >
                                            {hasComprobante ? <RefreshCcw size={18} /> : <Upload size={18} />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Mostrar motivo de rechazo */}
                            {isRejected && comprobanteData?.rejectionReason && (
                                <div className="bg-red-50 p-3 rounded-md border border-red-200 mt-2 mx-4 mb-4">
                                    <span className="text-red-700 text-sm font-medium">
                                        <strong>Motivo de rechazo:</strong>{" "}
                                        {comprobanteData.rejectionReason}
                                    </span>
                                </div>
                            )}

                            {/* Detalles del pago */}
                            {hasComprobante && comprobanteData?.paymentDetails && (
                                <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4 mx-4 mb-4">
                                    <h5 className="font-medium text-gray-900 mb-3">Detalles del Pago</h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {comprobanteData.paymentDetails.fecha_pago && (
                                            <div className="flex items-center space-x-2">
                                                <Calendar size={16} className="text-blue-600" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Fecha</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {new Date(comprobanteData.paymentDetails.fecha_pago).toLocaleDateString('es-ES')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {comprobanteData.paymentDetails.numero_referencia && (
                                            <div className="flex items-center space-x-2">
                                                <Hash size={16} className="text-purple-600" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Referencia</p>
                                                    <p className="text-sm font-medium text-gray-900 font-mono">
                                                        {comprobanteData.paymentDetails.numero_referencia}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {comprobanteData.paymentDetails.monto && (
                                            <div className="flex items-center space-x-2">
                                                <DollarSign size={16} className="text-green-600" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Monto</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {comprobanteData.paymentDetails.metodo_pago_slug === 'bdv' ? 'Bs ' : '$ '}
                                                        {parseFloat(comprobanteData.paymentDetails.monto).toLocaleString('es-ES', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {comprobanteData.paymentDetails.metodo_pago && (
                                            <div className="flex items-center space-x-2">
                                                <CreditCard size={16} className="text-indigo-600" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Método</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {comprobanteData.paymentDetails.metodo_pago}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* VerificationSwitch para admins */}
                            {isAdmin && hasComprobante && (
                                <div className="pt-4 border-t border-gray-200 mx-4 mb-4">
                                    <VerificationSwitch
                                        item={comprobanteData}
                                        onChange={handleValidationChange}
                                        readOnly={readOnly}
                                        type="comprobante"
                                        labels={{
                                            aprobado: "Comprobante aprobado",
                                            pendiente: "Pendiente de revisión",
                                            rechazado: "Rechazado"
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 bg-red-50 border border-red-200 rounded-lg p-6">
                            <span className="text-sm text-gray-500">No hay comprobante cargado.</span>
                            {!readOnly && (
                                <button
                                    onClick={() => setShowPaymentModal(true)}
                                    className="px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-md"
                                >
                                    Subir comprobante de pago
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Modal de PagosColg */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-semibold text-[#41023B]">
                                {hasComprobante ? "Actualizar" : "Registrar"} Comprobante de Pago
                            </h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
                                disabled={isProcessing}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <PagosColg
                                props={{
                                    costo: costoInscripcion,
                                    allowMultiplePayments: false,
                                    handlePago: handlePaymentComplete
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Modal visor de comprobante */}
            {showComprobanteViewer && comprobanteParaVer && (
                <DocumentViewer
                    documento={comprobanteParaVer}
                    onClose={() => setShowComprobanteViewer(false)}
                />
            )}
        </>
    );
}
