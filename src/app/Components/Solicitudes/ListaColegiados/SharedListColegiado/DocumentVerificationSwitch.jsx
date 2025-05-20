import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

export default function DocumentVerificationSwitch({
    documento,
    onChange,
    readOnly = false
}) {
    const [isRejectionOpen, setIsRejectionOpen] = useState(false);
    const [rejectionPreset, setRejectionPreset] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [useCustomReason, setUseCustomReason] = useState(false);

    // Motivos predefinidos de rechazo
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

    // El estado actual del documento (approved, rejected, pending)
    const status = documento.status || 'pending';

    const handleStatusChange = (newStatus) => {
        if (readOnly) return;

        // Si se rechaza, abrir modal para motivo
        if (newStatus === 'rejected') {
            setIsRejectionOpen(true);
        } else {
            // Si se aprueba, actualizar inmediatamente
            onChange({
                ...documento,
                status: newStatus,
                rejectionReason: ''
            });
        }
    };

    const submitRejection = () => {
        // Determinar la razón de rechazo final
        const finalReason = useCustomReason
            ? customReason
            : rejectionPreset;

        if (!finalReason.trim()) {
            alert("Por favor seleccione o ingrese un motivo de rechazo");
            return;
        }

        // Actualizar documento con estado rechazado y motivo
        onChange({
            ...documento,
            status: 'rejected',
            rejectionReason: finalReason
        });

        setIsRejectionOpen(false);
    };

    // Actualizar la razón al cambiar la selección
    const handleReasonChange = (e) => {
        const value = e.target.value;
        setRejectionPreset(value);

        // Si selecciona "Otro", habilitar campo personalizado
        if (value === "otro") {
            setUseCustomReason(true);
        } else {
            setUseCustomReason(false);
        }
    };

    return (
        <div className="relative">
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

            {/* Modal de razón de rechazo */}
            {isRejectionOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                            <AlertCircle className="text-red-500 mr-2" size={20} />
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

            {/* Mostrar motivo del rechazo si existe */}
            {status === 'rejected' && documento.rejectionReason && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-md">
                    <span className="font-medium">Motivo de rechazo:</span> {documento.rejectionReason}
                </div>
            )}
        </div>
    );
}