import { AlertCircle, CheckCircle, Shield, XCircle } from "lucide-react";
import { useState } from "react";

export default function DocumentVerificationSwitch({
    documento,
    onChange,
    readOnly = false
}) {
    const [isRejectionOpen, setIsRejectionOpen] = useState(false);
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
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

    // El estado actual del documento (approved, rechazado, pending)
    const status = documento.status || 'pending';

    // Verificar si el documento ya está aprobado
    const isApproved = status === 'approved';

    const handleStatusChange = (newStatus, event) => {
        // Prevenir propagación del evento
        if (event) {
            event.stopPropagation();
        }

        // Si el documento ya está aprobado, no permitas cambios
        if (isApproved || readOnly) return;

        // Si se intenta aprobar, mostrar el modal de confirmación
        if (newStatus === 'approved') {
            setIsApprovalOpen(true);
        }
        // Si se intenta rechazar, mostrar el modal de rechazo
        else if (newStatus === 'rechazado') {
            setIsRejectionOpen(true);
        }
    };

    // Función para confirmar la aprobación
    const confirmApproval = () => {
        onChange({
            ...documento,
            status: 'approved',
            rejectionReason: ''
        });
        setIsApprovalOpen(false);
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
            status: 'rechazado',
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
            {/* Contenedor específico para los botones de aprobar/rechazar */}
            <div className="flex items-center space-x-2 approve-reject-buttons">
                <button
                    onClick={(e) => handleStatusChange('approved', e)}
                    disabled={isApproved || readOnly}
                    className={`p-2 rounded-md transition-all ${
                        isApproved
                            ? 'bg-green-200 text-green-800 ring-2 ring-green-500 shadow-md'
                            : 'bg-gray-100 text-gray-500 hover:bg-green-50'
                    } ${(isApproved || readOnly) ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={
                        isApproved
                            ? "Este documento ya ha sido aprobado"
                            : readOnly
                                ? "No se puede modificar este documento"
                                : "Aprobar documento"
                    }
                >
                    <CheckCircle size={20} />
                </button>

                <button
                    onClick={(e) => handleStatusChange('rechazado', e)}
                    disabled={isApproved || readOnly}
                    className={`p-2 rounded-md transition-all ${
                        status === 'rechazado'
                            ? 'bg-red-100 text-red-700 ring-2 ring-red-500'
                            : 'bg-gray-100 text-gray-500 hover:bg-red-50'
                    } ${(isApproved || readOnly) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={
                        isApproved
                            ? "No se puede rechazar un documento aprobado"
                            : readOnly
                                ? "No se puede modificar este documento"
                                : "Rechazar documento"
                    }
                >
                    <XCircle size={20} />
                </button>

                <span 
                    className={`text-sm font-medium ${
                        status === 'approved' ? 'text-green-700' :
                        status === 'rechazado' ? 'text-red-700' :
                        'text-gray-600'
                    }`}
                    onClick={(e) => e.stopPropagation()} // También prevenir click en el texto
                >
                    {status === 'approved' && (
                        <span className="flex items-center">
                            <Shield size={16} className="mr-1" />
                            Aprobado
                        </span>
                    )}
                    {status === 'rechazado' && 'Rechazado'}
                    {status === 'pending' && 'Pendiente'}
                </span>
            </div>

            {/* Si está aprobado, mostrar un mensaje destacado */}
            {isApproved && (
                <div 
                    className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded-md border border-green-200"
                    onClick={(e) => e.stopPropagation()} // Prevenir click en el mensaje
                >
                    <p className="font-medium flex items-center">
                        <Shield size={14} className="mr-1" />
                        Documento verificado y aprobado
                    </p>
                    <p className="mt-1">Este documento ha sido verificado y no puede ser modificado.</p>
                </div>
            )}

            {/* Modal de confirmación de aprobación */}
            {isApprovalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                            <CheckCircle className="text-green-500 mr-2" size={20} />
                            Confirmar aprobación
                        </h3>

                        <div className="mb-4">
                            <p className="text-gray-700">
                                ¿Está seguro de que desea aprobar este documento? Esta acción es <strong>irreversible</strong> y una vez aprobado:
                            </p>
                            <ul className="mt-2 ml-6 list-disc text-sm text-gray-600 space-y-1">
                                <li>No podrá cambiar el estado a rechazado</li>
                                <li>No se podrá reemplazar el archivo</li>
                                <li>Solo se permitirá visualizar el documento</li>
                            </ul>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsApprovalOpen(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmApproval}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Confirmar aprobación
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${
                                    (useCustomReason ? !customReason.trim() : !rejectionPreset)
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
            {status === 'rechazado' && documento.rejectionReason && (
                <div 
                    className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-md border border-red-200"
                    onClick={(e) => e.stopPropagation()} // Prevenir click en el motivo de rechazo
                >
                    <span className="font-medium">Motivo de rechazo:</span> {documento.rejectionReason}
                </div>
            )}
        </div>
    );
}