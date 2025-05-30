"use client";

import PagosColg from "@/app/Components/PagosModal";
import { motion } from "framer-motion";
import {
    AlertCircle, Calendar, CheckCircle, CreditCard, DollarSign,
    Hash,
    RefreshCcw, XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import VerificationSwitch from "../VerificationSwitch";
import { DocumentViewer } from "./DocumentModule"; // Tu visor avanzado

export default function PaymentReceiptSection({
    comprobanteData,
    onUploadComprobante,
    onViewComprobante,
    onStatusChange,
    readOnly = false,
    isAdmin = false,
    costoInscripcion = 50,
    metodoPago = [],
    tasaBCV = 0,
    entityData = null // Agregar entityData para detectar pagos existentes
}) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [localComprobanteData, setLocalComprobanteData] = useState(comprobanteData);

    // Visor avanzado
    const [showComprobanteViewer, setShowComprobanteViewer] = useState(false);
    const [comprobanteParaVer, setComprobanteParaVer] = useState(null);

    useEffect(() => {
        // Si recibimos datos del comprobante desde el padre, usarlos directamente
        // Esto permite que los datos persistan al recargar la página
        if (comprobanteData) {
            console.log("📝 PaymentReceiptSection: Recibiendo comprobanteData desde DetalleInfo:", comprobanteData);
            setLocalComprobanteData(comprobanteData);
        } else if (entityData?.pago) {
            // Si no hay comprobanteData pero SÍ hay pago en entityData, crear estructura temporal
            console.log("📝 PaymentReceiptSection: Detectado pago sin comprobante, creando estructura temporal");
            const pagoSinComprobante = {
                id: "comprobante_pago",
                nombre: "Comprobante de pago",
                archivo: "comprobante_pendiente.pdf",
                url: null, // No hay URL de comprobante aún
                status: 'pending',
                rejectionReason: "",
                paymentDetails: {
                    fecha_pago: entityData.pago.fecha_pago,
                    numero_referencia: entityData.pago.num_referencia,
                    monto: entityData.pago.monto,
                    metodo_pago: entityData.pago.metodo_de_pago?.nombre || "Método de pago",
                    metodo_pago_slug: entityData.pago.metodo_de_pago?.datos_adicionales?.slug || "unknown",
                    tasa_bcv: entityData.pago.tasa_bcv_del_dia || entityData.pago.tasa_bcv
                }
            };
            setLocalComprobanteData(pagoSinComprobante);
        } else {
            console.log("📝 PaymentReceiptSection: No hay comprobanteData ni pago disponible");
            setLocalComprobanteData(null);
        }
    }, [comprobanteData, entityData]);

    const currentComprobanteData = localComprobanteData || comprobanteData;
    const hasComprobante = !!(currentComprobanteData?.url || currentComprobanteData?.archivo);
    const hasPayment = !!(entityData?.pago || currentComprobanteData?.paymentDetails); // Detectar si ya hay pago
    const isApproved = currentComprobanteData?.status === 'approved';
    const isRejected = currentComprobanteData?.status === 'rechazado';

    // Ya no necesitamos cargar datos internamente, los recibimos como props

    // Subida de comprobante desde PagosColg
    const handlePaymentComplete = async (paymentData) => {
        try {
            setIsProcessing(true);
            
            console.log("📤 PaymentReceiptSection: Iniciando proceso de pago...");
            console.log("📝 PaymentData recibido:", paymentData);
            
            // Paso 1: Enviar los datos del pago (como JSON, igual que en DetalleInfo)
            const pagoData = {
                pago: {
                    fecha_pago: paymentData.paymentDate,
                    num_referencia: paymentData.referenceNumber,
                    monto: paymentData.totalAmount,
                    metodo_de_pago: paymentData.metodo_de_pago?.id,
                    tasa_bcv_del_dia: paymentData.tasa_bcv_del_dia
                }
            };
            
            console.log("📤 Paso 1: Enviando datos del pago...", pagoData);
            const response1 = await onUploadComprobante(pagoData);
            console.log("✅ Respuesta Paso 1:", response1);
            
            // Verificar que el archivo existe antes del Paso 2
            if (!paymentData.paymentFile) {
                console.error("❌ No hay archivo de comprobante para enviar");
                throw new Error("No se seleccionó archivo de comprobante");
            }
            
            console.log("📁 Archivo a enviar:", {
                name: paymentData.paymentFile.name,
                size: paymentData.paymentFile.size,
                type: paymentData.paymentFile.type
            });
            
            // Paso 2: Enviar el comprobante como FormData separadamente
            const Form = new FormData();
            Form.append("comprobante", paymentData.paymentFile);
            
            console.log("📤 Paso 2: Enviando comprobante...");
            console.log("📋 FormData creado:");
            for (let pair of Form.entries()) {
                console.log(`   ${pair[0]}:`, pair[1]);
            }
            
            const response2 = await onUploadComprobante(Form);
            console.log("✅ Respuesta Paso 2:", response2);
            
            // Usar la respuesta del segundo paso para actualizar la UI
            const finalResponse = response2 || response1;
            console.log("✅ PaymentReceiptSection: Respuesta final del backend:", finalResponse);
            
            // Si hay respuesta exitosa, actualizar estado local
            if (finalResponse && finalResponse.data) {
                // Cargar los datos del comprobante desde la respuesta del backend
                const updatedComprobanteData = extractComprobanteFromBackendData(finalResponse.data);
                console.log("🔄 Datos del comprobante extraídos:", updatedComprobanteData);
                setLocalComprobanteData(updatedComprobanteData);
            }
            
            setShowPaymentModal(false);
            
        } catch (error) {
            console.error("❌ Error en handlePaymentComplete:", error);
            console.error("📋 Error stack:", error.stack);
            alert("Error al enviar el comprobante. Por favor intente nuevamente.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Función para extraer datos del comprobante desde la respuesta del backend
    const extractComprobanteFromBackendData = (backendData) => {
        const comprobanteUrl = 
            backendData.comprobante_url ||
            backendData.comprobante ||
            backendData.pago?.comprobante_url ||
            backendData.pago?.comprobante ||
            backendData.file_comprobante_url;

        if (comprobanteUrl) {
            return {
                id: "comprobante_pago",
                nombre: "Comprobante de pago",
                archivo: typeof comprobanteUrl === "string" 
                    ? comprobanteUrl.split("/").pop() 
                    : "comprobante_pago.pdf",
                url: comprobanteUrl,
                status: backendData.comprobante_validate === null 
                    ? "pending" 
                    : backendData.comprobante_validate === true 
                        ? "approved" 
                        : backendData.comprobante_validate === false 
                            ? "rechazado" 
                            : "pending",
                rejectionReason: backendData.comprobante_motivo_rechazo || "",
                paymentDetails: backendData.pago ? {
                    fecha_pago: backendData.pago.fecha_pago,
                    numero_referencia: backendData.pago.num_referencia,
                    monto: backendData.pago.monto,
                    metodo_pago: backendData.pago.metodo_de_pago?.nombre || 
                                backendData.pago.metodo_pago?.nombre,
                    metodo_pago_slug: backendData.pago.metodo_de_pago?.datos_adicionales?.slug || 
                                     backendData.pago.metodo_pago?.datos_adicionales?.slug,
                    tasa_bcv: backendData.pago.tasa_bcv_del_dia || backendData.pago.tasa_bcv
                } : null
            };
        }
        
        return null;
    };

    // Visor avanzado
    const handleViewComprobante = (comprobante) => {
        setComprobanteParaVer({
            ...comprobante,
            nombre: comprobante.nombre || "Comprobante de pago"
        });
        setShowComprobanteViewer(true);
        if (typeof onViewComprobante === "function") onViewComprobante(comprobante);
    };

    function getCardClasses() {
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
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
            >
                <div className="flex items-center justify-between mb-5 border-b pb-3">
                    <div className="flex items-center">
                        <CreditCard size={20} className="text-[#C40180] mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900">Comprobante de Pago</h2>
                    </div>
                </div>

                <div>
                    {hasComprobante || hasPayment ? (
                        <div className={getCardClasses()}>
                            <div className="p-4 flex justify-between items-start">
                                <div
                                    className="flex items-center flex-1 min-w-0"
                                    style={{ cursor: hasComprobante ? "pointer" : "default" }}
                                    onClick={() => {
                                        if (hasComprobante) handleViewComprobante(currentComprobanteData);
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
                                                ? (currentComprobanteData?.nombre || "Comprobante de pago")
                                                : hasPayment 
                                                    ? "Pago registrado - Pendiente de comprobante"
                                                    : "Sin comprobante"
                                            }
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {hasComprobante 
                                                ? (currentComprobanteData?.archivo || "comprobante_pago.pdf")
                                                : hasPayment
                                                    ? "Comprobante pendiente de subir"
                                                    : "No se ha subido comprobante"
                                            }
                                        </p>
                                        <div className="flex items-center mt-1">
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                isApproved ? 'bg-green-100 text-green-800' :
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
                                {/* Franja de botones */}
                                <div className="flex flex-col items-end space-y-2 ml-4">
                                    {!readOnly && (!hasComprobante || !isApproved) && (
                                        <button
                                            onClick={e => { e.stopPropagation(); setShowPaymentModal(true); }}
                                            className="text-orange-600 hover:bg-orange-50 p-2 rounded-full transition-colors"
                                            title={hasPayment ? "Subir comprobante" : "Realizar pago"}
                                        >
                                            <RefreshCcw size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {isRejected && currentComprobanteData?.rejectionReason && (
                                <div className="bg-red-50 p-3 rounded-md border border-red-200 mt-2">
                                    <span className="text-red-700 text-sm font-medium">
                                        <strong>Motivo de rechazo:</strong>{" "}
                                        {currentComprobanteData.rejectionReason}
                                    </span>
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

                    {hasComprobante && currentComprobanteData?.paymentDetails && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
                            <h5 className="font-medium text-gray-900 mb-3">Detalles del Pago</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {currentComprobanteData.paymentDetails.fecha_pago && (
                                    <div className="flex items-center space-x-2">
                                        <Calendar size={16} className="text-blue-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">Fecha</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {new Date(currentComprobanteData.paymentDetails.fecha_pago).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {currentComprobanteData.paymentDetails.numero_referencia && (
                                    <div className="flex items-center space-x-2">
                                        <Hash size={16} className="text-purple-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">Referencia</p>
                                            <p className="text-sm font-medium text-gray-900 font-mono">
                                                {currentComprobanteData.paymentDetails.numero_referencia}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {currentComprobanteData.paymentDetails.monto && (
                                    <div className="flex items-center space-x-2">
                                        <DollarSign size={16} className="text-green-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">Monto</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {currentComprobanteData.paymentDetails.metodo_pago_slug === 'bdv' ? 'Bs ' : '$ '}
                                                {parseFloat(currentComprobanteData.paymentDetails.monto).toLocaleString('es-ES', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {currentComprobanteData.paymentDetails.metodo_pago && (
                                    <div className="flex items-center space-x-2">
                                        <CreditCard size={16} className="text-indigo-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">Método</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {currentComprobanteData.paymentDetails.metodo_pago}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {isAdmin && hasComprobante && (
                        <div className="pt-4 border-t border-gray-200">
                            <VerificationSwitch
                                item={currentComprobanteData}
                                onChange={(updatedComprobante) => {
                                    setLocalComprobanteData(updatedComprobante);
                                    onStatusChange(updatedComprobante);
                                }}
                                readOnly={readOnly || isApproved}
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
            </motion.div>

            {/* Modal de PagosColg EXACTAMENTE como tú lo tenías */}
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
                                <XCircle size={24} />
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

            {/* Modal visor avanzado del comprobante */}
            {showComprobanteViewer && comprobanteParaVer && (
                <DocumentViewer
                    documento={comprobanteParaVer}
                    onClose={() => setShowComprobanteViewer(false)}
                />
            )}
        </>
    );
}
