import { AlertCircle, CheckCircle, Shield, XCircle } from "lucide-react";
import { useState } from "react";

export default function InstitutionVerificationSwitch({
    institucion,
    onChange,
    readOnly = false,
    index = 0
}) {
    const [isRejectionOpen, setIsRejectionOpen] = useState(false);
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [rejectionPreset, setRejectionPreset] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [useCustomReason, setUseCustomReason] = useState(false);

    // Motivos predefinidos de rechazo para instituciones
    const motivosRechazo = [
        "Institución no válida",
        "Datos de contacto incorrectos",
        "Dirección inexistente",
        "Teléfono no corresponde",
        "Cargo no verificable",
        "Institución inexistente",
        "Información inconsistente",
        "Documentación insuficiente",
        "No autorizado para trabajar",
        "Datos fraudulentos"
    ];

    // El estado actual de la institución
    const status = institucion.verificado;

    // Verificar si la institución ya está aprobada
    const isApproved = status === true;

    const handleStatusChange = (newStatus, event) => {
        // Prevenir propagación del evento
        if (event) {
            event.stopPropagation();
        }

        // Si la institución ya está aprobada, no permitas cambios
        if (isApproved || readOnly) return;

        // Si se intenta aprobar, mostrar el modal de confirmación
        if (newStatus === true) {
            setIsApprovalOpen(true);
        }
        // Si se intenta rechazar, mostrar el modal de rechazo
        else if (newStatus === false) {
            setIsRejectionOpen(true);
        }
    };

    // Función para confirmar la aprobación
    const confirmApproval = () => {
        onChange({
            ...institucion,
            verificado: true,
            motivo_rechazo: ''
        }, index);
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

        // Actualizar institución con estado rechazado y motivo
        onChange({
            ...institucion,
            verificado: false,
            motivo_rechazo: finalReason
        }, index);

        setIsRejectionOpen(false);
        // Limpiar campos después del rechazo
        setRejectionPreset('');
        setCustomReason('');
        setUseCustomReason(false);
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
            <div className="flex items-center space-x-2 institution-verification-buttons">
                <button
                    onClick={(e) => handleStatusChange(true, e)}
                    disabled={isApproved || readOnly}
                    className={`p-2 rounded-md transition-all ${isApproved
                            ? 'bg-green-200 text-green-800 ring-2 ring-green-500 shadow-md'
                            : 'bg-gray-100 text-gray-500 hover:bg-green-50'
                        } ${(isApproved || readOnly) ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={
                        isApproved
                            ? "Esta institución ya ha sido aprobada"
                            : readOnly
                                ? "No se puede modificar esta institución"
                                : "Aprobar institución"
                    }
                >
                    <CheckCircle size={20} />
                </button>

                <button
                    onClick={(e) => handleStatusChange(false, e)}
                    disabled={isApproved || readOnly}
                    className={`p-2 rounded-md transition-all ${status === false
                            ? 'bg-red-100 text-red-700 ring-2 ring-red-500'
                            : 'bg-gray-100 text-gray-500 hover:bg-red-50'
                        } ${(isApproved || readOnly) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={
                        isApproved
                            ? "No se puede rechazar una institución aprobada"
                            : readOnly
                                ? "No se puede modificar esta institución"
                                : "Rechazar institución"
                    }
                >
                    <XCircle size={20} />
                </button>

                <span
                    className={`text-sm font-medium ${status === true ? 'text-green-700' :
                            status === false ? 'text-red-700' :
                                'text-gray-600'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {status === true && (
                        <span className="flex items-center">
                            <Shield size={16} className="mr-1" />
                            Aprobada
                        </span>
                    )}
                    {status === false && 'Rechazada'}
                    {(status === null || status === undefined) && 'Pendiente'}
                </span>
            </div>

            {/* Si está aprobada, mostrar un mensaje destacado */}
            {isApproved && (
                <div
                    className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded-md border border-green-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <p className="font-medium flex items-center">
                        <Shield size={14} className="mr-1" />
                        Institución verificada y aprobada
                    </p>
                    <p className="mt-1">Esta institución ha sido verificada y no puede ser modificada.</p>
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
                                ¿Está seguro de que desea aprobar esta institución? Esta acción es <strong>irreversible</strong> y una vez aprobada:
                            </p>
                            <ul className="mt-2 ml-6 list-disc text-sm text-gray-600 space-y-1">
                                <li>No podrá cambiar el estado a rechazado</li>
                                <li>No se podrá modificar la información</li>
                                <li>Solo se permitirá visualizar los datos</li>
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
                                    placeholder="Explique por qué rechaza esta institución..."
                                    rows={3}
                                ></textarea>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => {
                                    setIsRejectionOpen(false);
                                    setRejectionPreset('');
                                    setCustomReason('');
                                    setUseCustomReason(false);
                                }}
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
            {status === false && institucion.motivo_rechazo && (
                <div
                    className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-md border border-red-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className="font-medium">Motivo de rechazo:</span> {institucion.motivo_rechazo}
                </div>
            )}
        </div>
    );
}