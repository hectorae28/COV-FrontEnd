"use client";

import { fetchDataSolicitudes } from "@/api/endpoints/landingPage";
import PagosColg from "@/app/Components/PagosModal";
import { motion } from "framer-motion";
import {
    AlertCircle, Calendar, CheckCircle, CreditCard, DollarSign, RefreshCcw, XCircle, Hash
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
    isAdmin = false
}) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [costoInscripcion, setCostoInscripcion] = useState(50);
    const [metodoPago, setMetodoPago] = useState([]);
    const [tasaBCV, setTasaBCV] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const [localComprobanteData, setLocalComprobanteData] = useState(comprobanteData);

    // Visor avanzado
    const [showComprobanteViewer, setShowComprobanteViewer] = useState(false);
    const [comprobanteParaVer, setComprobanteParaVer] = useState(null);

    useEffect(() => {
        setLocalComprobanteData(comprobanteData);
    }, [comprobanteData]);

    const currentComprobanteData = localComprobanteData || comprobanteData;
    const hasComprobante = !!(currentComprobanteData?.url || currentComprobanteData?.archivo);
    const isApproved = currentComprobanteData?.status === 'approved';
    const isRejected = currentComprobanteData?.status === 'rechazado';

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const tasa = await fetchDataSolicitudes("tasa-bcv");
                setTasaBCV(tasa.data.rate);

                const metodos = await fetchDataSolicitudes("metodo-de-pago");
                const metodosActivos = metodos.data.filter(metodo => metodo.activo === true);
                setMetodoPago(metodosActivos);

                const costo = await fetchDataSolicitudes(
                    "costo",
                    `?search=Inscripcion+Odontologo&es_vigente=true`
                );
                if (costo.data && costo.data.length > 0) {
                    setCostoInscripcion(Number(costo.data[0].monto_usd));
                }
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        loadInitialData();
    }, []);

    // Subida de comprobante desde PagosColg
    const handlePaymentComplete = async (paymentData) => {
        try {
            setIsProcessing(true);
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

            const response = await onUploadComprobante(formData);

            const nuevoComprobante = {
                id: "comprobante_pago",
                nombre: "Comprobante de pago",
                archivo: paymentData.paymentFile?.name || "comprobante_pago.pdf",
                url: response?.data?.comprobante_url || URL.createObjectURL(paymentData.paymentFile),
                status: 'pending',
                rejectionReason: '',
                paymentDetails: {
                    fecha_pago: paymentData.paymentDate,
                    numero_referencia: paymentData.referenceNumber,
                    monto: paymentData.totalAmount,
                    metodo_pago: paymentData.metodo_de_pago?.nombre,
                    metodo_pago_slug: paymentData.metodo_de_pago?.datos_adicionales?.slug,
                    tasa_bcv: paymentData.tasa_bcv_del_dia
                }
            };

            setLocalComprobanteData(nuevoComprobante);
            setShowPaymentModal(false);

        } catch (error) {
            console.error("Error al procesar el pago:", error);
            alert("Error al registrar el pago. Por favor intente nuevamente.");
        } finally {
            setIsProcessing(false);
        }
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
                    {hasComprobante ? (
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
                                                : "bg-red-100"
                                        } p-2 rounded-md mr-3`}>
                                        {isApproved ? (
                                            <CheckCircle className="text-green-500" size={20} />
                                        ) : isRejected ? (
                                            <XCircle className="text-red-500" size={20} />
                                        ) : (
                                            <AlertCircle className="text-[#C40180]" size={20} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 flex items-center">
                                            {currentComprobanteData?.nombre || "Comprobante de pago"}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {currentComprobanteData?.archivo || "comprobante_pago.pdf"}
                                        </p>
                                        <div className="flex items-center mt-1">
                                            <span className={`text-xs px-2 py-1 rounded-full ${isApproved ? 'bg-green-100 text-green-800' :
                                                isRejected ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {isApproved ? 'Aprobado' : isRejected ? 'Rechazado' : 'Pendiente de revisión'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Franja de botones: NO abre visor */}
                                <div className="flex flex-col items-end space-y-2 ml-4">
                                    {!readOnly && !isApproved && (
                                        <button
                                            onClick={e => { e.stopPropagation(); setShowPaymentModal(true); }}
                                            className="text-orange-600 hover:bg-orange-50 p-2 rounded-full transition-colors"
                                            title="Actualizar comprobante"
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
