"use client";

import PagosColg from "@/app/Components/PagosModal";
import useDataListaColegiados from "@/store/ListaColegiadosData";
import { motion } from "framer-motion";
import {
    AlertCircle, Calendar, CheckCircle, CreditCard, DollarSign,
    Hash, RefreshCcw, Search, Upload, X
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
    tasaBCV = 0,
    onPaymentStatusChange,
    showPaymentHistory = false,
    colegiadoId = null,
    handleVerDocumento = null,
    documentos = []
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

    // ESTADOS ADICIONALES para historial de pagos (solo cuando showPaymentHistory = true)
    const [pagos, setPagos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Obtener funciones del store centralizado (solo si showPaymentHistory)
    const { getPagos } = showPaymentHistory ? useDataListaColegiados() : { getPagos: null };

    // CARGAR HISTORIAL DE PAGOS (solo para colegiados)
    useEffect(() => {
        if (showPaymentHistory && colegiadoId && getPagos) {
            const fetchData = async () => {
                try {
                    setIsLoading(true);
                    const pagosColegiado = getPagos(colegiadoId) || [];
                    setPagos(pagosColegiado);
                    setIsLoading(false);
                } catch (error) {
                    console.error("Error al cargar los pagos:", error);
                    setPagos([]);
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [showPaymentHistory, colegiadoId, getPagos]);

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
        let status = "pending"; // Default para revisión
        const backendStatus = pagoData.status;

        if (backendStatus === "aprobado") {
            status = "approved";
        } else if (backendStatus === "rechazado") {
            status = "rechazado";
        } else {
            // Cualquier otro estado (incluyendo "revisando", "revision", null, etc.) va a pending
            status = "pending";
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

    // Validación de estado de pago
    const calculatePaymentApproved = useCallback(() => {
        // Función para obtener valor considerando cambios locales
        const getFieldValue = (fieldName, defaultValue = null) => {
            return localPaymentChanges.hasOwnProperty(fieldName)
                ? localPaymentChanges[fieldName]
                : (localPaymentData?.[fieldName] ?? defaultValue);
        };

        // Si está exonerado de pago, está aprobado automáticamente
        const isExonerado = getFieldValue('pago_exonerado');
        if (isExonerado) {
            return true;
        }

        // Verificar que existe comprobante y está aprobado
        const pagoData = getFieldValue('pago');
        if (!pagoData) {
            return false;
        }

        const comprobanteHasFile = !!(
            pagoData.comprobante_url ||
            pagoData.comprobante
        );

        const comprobanteApproved = (
            pagoData.status === "aprobado" ||
            pagoData.status === true
        );

        const result = comprobanteHasFile && comprobanteApproved;

        return result;
    }, [localPaymentData, localPaymentChanges]);

    // NOTIFICAR CAMBIOS EN EL ESTADO DE PAGO
    useEffect(() => {
        if (onPaymentStatusChange) {
            const paymentApproved = calculatePaymentApproved();
            onPaymentStatusChange(paymentApproved);
        }
    }, [calculatePaymentApproved, onPaymentStatusChange, localPaymentData, localPaymentChanges]);

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

            // Crear FormData - ASEGURAR que siempre vaya como "revisando"
            const formData = new FormData();
            formData.append("comprobante", paymentData.paymentFile);
            formData.append("pago", JSON.stringify(pagoData));
            // Siempre enviar como "revisando" para que requiera aprobación admin
            formData.append("comprobante_validate", "revisando");
            formData.append("status", "revisando");

            // Crear datos temporales - TAMBIÉN asegurar que sea "revisando"
            const tempUrl = URL.createObjectURL(paymentData.paymentFile);
            const tempPaymentData = {
                monto: paymentData.totalAmount,
                fecha_pago: paymentData.paymentDate,
                num_referencia: paymentData.referenceNumber,
                metodo_de_pago: paymentData.metodo_de_pago,
                status: "revisando", // CAMBIO: usar "revisando" en lugar de "revision"
                comprobante_url: tempUrl,
                tasa_bcv_del_dia: paymentData.tasa_bcv_del_dia,
                motivo_rechazo: "" // Limpiar cualquier motivo de rechazo anterior
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

    return (
        <>
            {/* Solo mostrar la sección separada de comprobante para pendientes */}
            {!showPaymentHistory && (
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
                            <div>
                                <div className="p-4 flex justify-between items-start">
                                    <div
                                        className="flex items-center flex-1 min-w-0"
                                        style={{ cursor: hasComprobante ? "pointer" : "default" }}
                                        onClick={() => {
                                            if (hasComprobante) handleViewComprobante(comprobanteData);
                                        }}
                                    >
                                        <div>
                                            <h3 className="font-medium text-gray-900 flex items-center">
                                                {hasComprobante
                                                    ? (comprobanteData?.nombre || "Comprobante de pago")
                                                    : hasPayment
                                                        ? "Pago registrado - Pendiente de comprobante"
                                                        : "Sin comprobante"
                                                }
                                            </h3>
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

                                {/* VerificationSwitch para admins - integrado de forma más limpia */}
                                {isAdmin && hasComprobante && (
                                    <div className="mt-3">
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
            )}

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

            {/*  HISTORIAL DE PAGOS Y CUOTAS (solo para colegiados) */}
            {showPaymentHistory && (
                <>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Pagos y cuotas</h3>
                            <p className="text-sm text-gray-500 mt-1">Historial de pagos y estado de cuotas</p>
                        </div>

                        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar pago..."
                                    className="pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Resumen de pagos */}
                    {(() => {
                        // Crear pago de inscripción desde comprobanteData si existe
                        const pagoInscripcion = comprobanteData ? {
                            id: 'inscripcion',
                            concepto: 'Pago de Inscripción',
                            referencia: comprobanteData.paymentDetails?.numero_referencia || 'N/A',
                            fecha: comprobanteData.paymentDetails?.fecha_pago ?
                                new Date(comprobanteData.paymentDetails.fecha_pago).toLocaleDateString('es-ES') : 'N/A',
                            monto: parseFloat(comprobanteData.paymentDetails?.monto || 0),
                            estado: comprobanteData.status === 'approved' ? 'Pagado' :
                                comprobanteData.status === 'rechazado' ? 'Rechazado' : 'Pendiente',
                            metodoPago: comprobanteData.paymentDetails?.metodo_pago || 'N/A',
                            comprobante: true,
                            comprobanteData: comprobanteData
                        } : null;

                        // Combinar pagos existentes con pago de inscripción
                        const todosLosPagos = pagoInscripcion ? [pagoInscripcion, ...(pagos || [])] : (pagos || []);

                        const pagosFiltrados = todosLosPagos.filter(pago =>
                            pago.concepto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            pago.referencia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            pago.fecha?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            pago.estado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            pago.metodoPago?.toLowerCase().includes(searchTerm.toLowerCase())
                        );

                        // Calcular totales incluyendo el pago de inscripción
                        const totalPagado = todosLosPagos.filter(pago => pago.estado === "Pagado")
                            .reduce((suma, pago) => suma + pago.monto, 0);

                        const totalPendiente = todosLosPagos.filter(pago => pago.estado === "Pendiente")
                            .reduce((suma, pago) => suma + pago.monto, 0);

                        const hayComprobantes = documentos && documentos.length > 0;

                        return (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                        <p className="text-sm text-gray-500 mb-1">Total pagado</p>
                                        <p className="text-xl font-semibold text-green-600">${totalPagado.toFixed(2)}</p>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                        <p className="text-sm text-gray-500 mb-1">Pendiente por pagar</p>
                                        <p className="text-xl font-semibold text-red-600">${totalPendiente.toFixed(2)}</p>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                        <p className="text-sm text-gray-500 mb-1">Estado general</p>
                                        <p className={`text-lg font-semibold flex items-center ${totalPendiente > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                                            {totalPendiente > 0 ? (
                                                <>
                                                    <AlertCircle size={18} className="mr-1" />
                                                    Pagos pendientes
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle size={18} className="mr-1" />
                                                    Al día
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Sección de comprobantes de pago integrada */}
                                {hayComprobantes && (
                                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-6">
                                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                            <h3 className="text-base font-medium text-gray-900">Comprobantes de pago</h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Nombre
                                                        </th>
                                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Tipo
                                                        </th>
                                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Acciones
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {documentos.map((doc) => (
                                                        <tr key={doc.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900">{doc.nombre}</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-500">{doc.tipo || "Documento"}</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <button
                                                                    onClick={() => handleVerDocumento(doc.id)}
                                                                    className="text-purple-600 hover:text-purple-800"
                                                                >
                                                                    Ver documento
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Tabla de pagos */}
                                {isLoading ? (
                                    <div className="flex justify-center items-center py-20">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
                                    </div>
                                ) : pagosFiltrados.length === 0 && !hayComprobantes ? (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                                        <div className="flex justify-center mb-4">
                                            <CreditCard size={48} className="text-gray-300" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-500">No se encontraron pagos</h3>
                                        <p className="text-gray-400 mt-1">No hay registros de pago que coincidan con tu búsqueda</p>
                                    </div>
                                ) : pagosFiltrados.length === 0 ? (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                                        <div className="flex justify-center mb-4">
                                            <CreditCard size={48} className="text-gray-300" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-500">No se encontraron pagos</h3>
                                        <p className="text-gray-400 mt-1">No hay registros de pago que coincidan con tu búsqueda</p>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Concepto
                                                        </th>
                                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Referencia
                                                        </th>
                                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Fecha
                                                        </th>
                                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Monto
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
                                                    {pagosFiltrados.map((pago) => (
                                                        <tr key={pago.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                <div className="font-medium text-gray-900">{pago.concepto}</div>
                                                                <div className="text-sm text-gray-500">{pago.metodoPago}</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                                {pago.referencia}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                                {pago.fecha}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    ${parseFloat(pago.monto || 0).toFixed(2)}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pago.estado === 'Pagado'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : pago.estado === 'Rechazado'
                                                                            ? 'bg-red-100 text-red-800'
                                                                            : 'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                    {pago.estado}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                                <div className="flex justify-center space-x-2">
                                                                    {/* VerificationSwitch para admins solo en pago de inscripción */}
                                                                    {isAdmin && pago.id === 'inscripcion' && pago.comprobanteData && (
                                                                        <div className="ml-2">
                                                                            <VerificationSwitch
                                                                                item={pago.comprobanteData}
                                                                                onChange={handleValidationChange}
                                                                                readOnly={readOnly}
                                                                                type="comprobante"
                                                                                labels={{
                                                                                    aprobado: "Aprobado",
                                                                                    pendiente: "Pendiente",
                                                                                    rechazado: "Rechazado"
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </>
            )}
        </>
    );
}
