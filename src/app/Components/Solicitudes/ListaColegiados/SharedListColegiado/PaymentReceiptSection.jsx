"use client";

import { fetchDataSolicitudes } from "@/api/endpoints/landingPage";
import PagosColg from "@/app/Components/PagosModal";
import { motion } from "framer-motion";
import {
    AlertCircle, Calendar, CheckCircle, CreditCard, DollarSign, 
    RefreshCcw, XCircle, Hash
} from "lucide-react";
import { useEffect, useState } from "react";
import VerificationSwitch from "../VerificationSwitch";
import { DocumentViewer } from "./DocumentModule";

export default function PaymentReceiptSection({
    comprobanteData,
    onUploadComprobante,
    onViewComprobante,
    onStatusChange,
    readOnly = false,
    isAdmin = false
}) {
    // Estados principales
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [costoInscripcion, setCostoInscripcion] = useState(50);
    const [metodoPago, setMetodoPago] = useState([]);
    const [tasaBCV, setTasaBCV] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Estado local optimista para comprobantes
    const [localComprobanteData, setLocalComprobanteData] = useState(comprobanteData);
    
    // Visor de documentos
    const [showComprobanteViewer, setShowComprobanteViewer] = useState(false);
    const [comprobanteParaVer, setComprobanteParaVer] = useState(null);

    // Sincronizar estado local con props
    useEffect(() => {
        setLocalComprobanteData(comprobanteData);
    }, [comprobanteData]);

    // Datos actuales (optimista o props)
    const currentComprobanteData = localComprobanteData || comprobanteData;
    const hasComprobante = !!(currentComprobanteData?.url || currentComprobanteData?.archivo);
    const isApproved = currentComprobanteData?.status === 'approved';
    const isRejected = currentComprobanteData?.status === 'rechazado';
    const isUploading = currentComprobanteData?.status === 'uploading';

    // Cargar datos iniciales de pago
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [tasaResponse, metodosResponse, costoResponse] = await Promise.all([
                    fetchDataSolicitudes("tasa-bcv"),
                    fetchDataSolicitudes("metodo-de-pago"),
                    fetchDataSolicitudes("costo", "?search=Inscripcion+Odontologo&es_vigente=true")
                ]);

                setTasaBCV(tasaResponse.data.rate);
                
                const metodosActivos = metodosResponse.data.filter(metodo => metodo.activo === true);
                setMetodoPago(metodosActivos);

                if (costoResponse.data && costoResponse.data.length > 0) {
                    setCostoInscripcion(Number(costoResponse.data[0].monto_usd));
                }
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        loadInitialData();
    }, []);

    // Función optimizada para manejo de pagos con actualización inmediata
    const handlePaymentComplete = async (paymentData) => {
        try {
            setIsProcessing(true);
            
            // Crear URL temporal para mostrar inmediatamente
            const tempUrl = URL.createObjectURL(paymentData.paymentFile);
            
            // Crear comprobante optimista
            const optimisticComprobante = {
                id: "comprobante_pago",
                nombre: "Comprobante de pago",
                archivo: paymentData.paymentFile?.name || "comprobante_pago.pdf",
                url: tempUrl,
                status: 'uploading',
                isOptimistic: true,
                tempUrl: tempUrl,
                paymentDetails: {
                    fecha_pago: paymentData.paymentDate,
                    numero_referencia: paymentData.referenceNumber,
                    monto: paymentData.totalAmount,
                    metodo_pago: paymentData.metodo_de_pago?.nombre,
                    metodo_pago_slug: paymentData.metodo_de_pago?.datos_adicionales?.slug,
                    tasa_bcv: paymentData.tasa_bcv_del_dia
                }
            };

            // Actualizar UI inmediatamente
            setLocalComprobanteData(optimisticComprobante);
            setShowPaymentModal(false);

            // Preparar FormData para el servidor
            const formData = new FormData();
            if (paymentData.paymentFile) formData.append('comprobante', paymentData.paymentFile);
            if (paymentData.paymentDate) formData.append('fecha_pago', paymentData.paymentDate);
            if (paymentData.referenceNumber) formData.append('numero_referencia', paymentData.referenceNumber);
            if (paymentData.totalAmount) formData.append('monto', paymentData.totalAmount);
            if (paymentData.metodo_de_pago) {
                formData.append('metodo_pago_id', paymentData.metodo_de_pago.id);
                formData.append('metodo_pago_slug', paymentData.metodo_de_pago.datos_adicionales.slug);
            }
            if (paymentData.tasa_bcv_del_dia) formData.append('tasa_bcv', paymentData.tasa_bcv_del_dia);

            // Enviar al servidor
            const response = await onUploadComprobante(formData);

            // Sincronizar con datos reales del servidor
            if (response?.data?.comprobante_url) {
                const realComprobante = {
                    ...optimisticComprobante,
                    url: response.data.comprobante_url,
                    status: 'pending',
                    isOptimistic: false
                };

                setLocalComprobanteData(realComprobante);
                
                // Limpiar URL temporal
                URL.revokeObjectURL(tempUrl);
            }

        } catch (error) {
            // Rollback en caso de error
            setLocalComprobanteData(null);
            if (optimisticComprobante.tempUrl) {
                URL.revokeObjectURL(optimisticComprobante.tempUrl);
            }
            alert("Error al registrar el pago. Por favor intente nuevamente.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Visor optimizado para comprobantes
    const handleViewComprobante = (comprobante) => {
        setComprobanteParaVer({
            ...comprobante,
            nombre: comprobante.nombre || "Comprobante de pago"
        });
        setShowComprobanteViewer(true);
        if (typeof onViewComprobante === "function") onViewComprobante(comprobante);
    };

    // Estilos dinámicos para la tarjeta
    const getCardClasses = () => {
        let base = "border rounded-lg transition-all duration-200";
        if (isUploading) {
            base += " border-blue-200 bg-blue-50 animate-pulse";
        } else if (isApproved) {
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

    const getIconStyles = () => {
        if (isUploading) return "bg-blue-100";
        if (isApproved) return "bg-green-100";
        if (isRejected) return "bg-red-100";
        if (hasComprobante) return "bg-[#F9E6F3]";
        return "bg-red-100";
    };

    const renderIcon = () => {
        if (isUploading) {
            return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>;
        }
        if (isApproved) return <CheckCircle className="text-green-500" size={20} />;
        if (isRejected) return <XCircle className="text-red-500" size={20} />;
        return <AlertCircle className="text-[#C40180]" size={20} />;
    };

    const getStatusLabel = () => {
        if (isUploading) return 'Subiendo...';
        if (isApproved) return 'Aprobado';
        if (isRejected) return 'Rechazado';
        return 'Pendiente de revisión';
    };

    const getStatusStyles = () => {
        if (isUploading) return 'bg-blue-100 text-blue-800';
        if (isApproved) return 'bg-green-100 text-green-800';
        if (isRejected) return 'bg-red-100 text-red-800';
        return 'bg-yellow-100 text-yellow-800';
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

                {/* Contenido principal */}
                <div>
                    {hasComprobante ? (
                        <div className={getCardClasses()}>
                            <div className="p-4 flex justify-between items-start">
                                <div
                                    className="flex items-center flex-1 min-w-0"
                                    style={{ cursor: hasComprobante && !isUploading ? "pointer" : "default" }}
                                    onClick={() => {
                                        if (hasComprobante && !isUploading) handleViewComprobante(currentComprobanteData);
                                    }}
                                >
                                    <div className={`${getIconStyles()} p-2 rounded-md mr-3`}>
                                        {renderIcon()}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 flex items-center">
                                            {currentComprobanteData?.nombre || "Comprobante de pago"}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {currentComprobanteData?.archivo || "comprobante_pago.pdf"}
                                        </p>
                                        <div className="flex items-center mt-1">
                                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyles()}`}>
                                                {getStatusLabel()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex flex-col items-end space-y-2 ml-4">
                                    {!readOnly && !isApproved && !isUploading && (
                                        <button
                                            onClick={e => { 
                                                e.stopPropagation(); 
                                                setShowPaymentModal(true); 
                                            }}
                                            className="text-orange-600 hover:bg-orange-50 p-2 rounded-full transition-colors"
                                            title="Actualizar comprobante"
                                        >
                                            <RefreshCcw size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Motivo de rechazo */}
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

                    {/* Detalles del pago */}
                    {hasComprobante && currentComprobanteData?.paymentDetails && !isUploading && (
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

                    {/* Switch de verificación para administradores */}
                    {isAdmin && hasComprobante && !isUploading && (
  <div className="pt-4 border-t border-gray-200">
    <VerificationSwitch
      item={currentComprobanteData}
      onChange={(updatedComprobante) => {
        // Actualizar estado local inmediatamente
        setLocalComprobanteData({
          ...currentComprobanteData,
          status: updatedComprobante.status,
          rejectionReason: updatedComprobante.rejectionReason || ''
        });
        
        // Llamar al callback del padre
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

            {/* Modal visor de comprobantes */}
            {showComprobanteViewer && comprobanteParaVer && (
                <DocumentViewer
                    documento={comprobanteParaVer}
                    onClose={() => setShowComprobanteViewer(false)}
                />
            )}
        </>
    );
}