"use client";

import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

/**
 * Componente reutilizable para la verificación de documentos (aprobar/rechazar)
 * 
 * @param {Object} documento - Documento a verificar
 * @param {Function} onChange - Función que se ejecuta cuando cambia el estado del documento
 * @param {Boolean} readOnly - Si es true, no permite cambios (para docs ya aprobados)
 * @returns {JSX.Element}
 */
export default function DocumentVerificationSwitch({
    documento,
    onChange,
    readOnly = false
}) {
    // Estados locales
    const [isRejectionOpen, setIsRejectionOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState(documento.rejectionReason || '');
    const [rejectionPreset, setRejectionPreset] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [useCustomReason, setUseCustomReason] = useState(false);

    // Lista de motivos predefinidos de rechazo
    const motivosRechazo = [
        "Documento ilegible",
        "Documento incompleto",
        "Documento caducado",
        "Documento no válido",
        "Formato incorrecto",
        "Faltan firmas o sellos",
        "Información inconsistente",
        "No corresponde con el solicitante",
        "Documento alterado",
        "Documento dañado"
    ];

    // Obtener el estado actual del documento
    const status = documento.status || 'pending';

    /**
     * Maneja el cambio de estado de un documento (aprobar/rechazar)
     * @param {string} newStatus - Nuevo estado ('approved' o 'rejected')
     */
    const handleStatusChange = (newStatus) => {
        // No permitir cambios si está en modo solo lectura
        if (readOnly) return;

        // Si va a rechazar, abrimos modal para motivo
        if (newStatus === 'rejected') {
            setIsRejectionOpen(true);
        } else {
            // Si va a aprobar, actualizamos inmediatamente
            onChange({
                ...documento,
                status: newStatus,
                rejectionReason: ''
            });
        }
    };

    /**
     * Finaliza el proceso de rechazo con el motivo seleccionado
     */
    const submitRejection = () => {
        // Determinar la razón final (preset o personalizada)
        const finalReason = useCustomReason
            ? customReason
            : rejectionPreset;

        // Validar que haya un motivo
        if (!finalReason.trim()) {
            alert("Por favor seleccione o ingrese un motivo de rechazo");
            return;
        }

        // Actualizar el documento con el estado rechazado y el motivo
        onChange({
            ...documento,
            status: 'rejected',
            rejectionReason: finalReason
        });

        // Cerrar modal
        setIsRejectionOpen(false);
    };

    /**
     * Maneja cambios en la selección del motivo de rechazo
     */
    const handleReasonChange = (e) => {
        const value = e.target.value;
        setRejectionPreset(value);

        // Si selecciona "otro", habilita el campo personalizado
        if (value === "otro") {
            setUseCustomReason(true);
        } else {
            setUseCustomReason(false);
        }
    };

    return (
        <div className="relative">
            {/* Botones de aprobación/rechazo */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => handleStatusChange('approved')}
                    disabled={readOnly}
                    className={`p-2 rounded-md transition-all ${status === 'approved'
                        ? 'bg-green-100 text-green-700 ring-2 ring-green-500'
                        : 'bg-gray-100 text-gray-500 hover:bg-green-50'
                        } ${readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={readOnly ? "No se puede modificar un documento aprobado" : "Aprobar documento"}
                >
                    <CheckCircle size={20} />
                </button>

                <button
                    onClick={() => handleStatusChange('rejected')}
                    disabled={readOnly}
                    className={`p-2 rounded-md transition-all ${status === 'rejected'
                        ? 'bg-red-100 text-red-700 ring-2 ring-red-500'
                        : 'bg-gray-100 text-gray-500 hover:bg-red-50'
                        } ${readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={readOnly ? "No se puede modificar un documento aprobado" : "Rechazar documento"}
                >
                    <XCircle size={20} />
                </button>

                <span className="text-sm font-medium">
                    {status === 'approved' && 'Aprobado'}
                    {status === 'rejected' && 'Rechazado'}
                    {status === 'pending' && 'Pendiente'}
                </span>
            </div>

            {/* Modal para motivo de rechazo */}
            {isRejectionOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                            <AlertTriangle className="text-red-500 mr-2" size={20} />
                            Motivo de rechazo
                        </h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Seleccione motivo de rechazo <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={rejectionPreset}
                                onChange={handleReasonChange}
                                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-300 focus:border-red-500"
                            >
                                <option value="">Seleccione un motivo...</option>
                                {motivosRechazo.map((motivo, index) => (
                                    <option key={index} value={motivo}>{motivo}</option>
                                ))}
                                <option value="otro">Agregar Detalles</option>
                            </select>
                        </div>

                        {useCustomReason && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Motivo personalizado <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:border-red-400"
                                    placeholder="Explique por qué rechaza este documento..."
                                    rows={3}
                                ></textarea>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setIsRejectionOpen(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={submitRejection}
                                disabled={useCustomReason ? !customReason.trim() : !rejectionPreset}
                                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${(useCustomReason ? !customReason.trim() : !rejectionPreset)
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                                    }`}
                            >
                                Confirmar rechazo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mostrar motivo de rechazo si existe */}
            {status === 'rejected' && documento.rejectionReason && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-md">
                    <span className="font-medium">Motivo de rechazo:</span> {documento.rejectionReason}
                </div>
            )}
        </div>
    );
}