import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

export default function VerificationSwitch({
    item,
    onChange,
    readOnly = false,
    index = null,
    type = "documento", // "documento" | "institucion" | "comprobante"
    labels = {
        aprobado: "Aprobado",
        pendiente: "Pendiente",
        rechazado: "Rechazado"
    }
}) {
    const [isRejectionOpen, setIsRejectionOpen] = useState(false);
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [rejectionPreset, setRejectionPreset] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [useCustomReason, setUseCustomReason] = useState(false);

    // Compatibilidad para los distintos tipos
    const status = item.status !== undefined ? item.status : item.verificado;
    const isApproved = status === "approved" || status === true;
    const isRejected = status === "rechazado" || status === false;
    const rejectionReason = item.rejectionReason || item.motivo_rechazo;

    // --- Motivos predefinidos ---
    const motivosRechazoDefault = [
        "Documento ilegible",
        "Documento incompleto",
        "Información incorrecta",
        "Institución no válida",
        "Datos de pago inconsistentes",
        "Archivo dañado",
        "Otro (especifique)"
    ];

    const handleStatusChange = (newStatus, e) => {
        e?.stopPropagation();
        if (readOnly || isApproved) return;
        if (newStatus === true || newStatus === "approved") {
            setIsApprovalOpen(true);
        } else {
            setIsRejectionOpen(true);
        }
    };

    const confirmApproval = () => {
        const updatedItem = {
            ...item,
            status: "approved",
            verificado: true,
            rejectionReason: "",
            motivo_rechazo: ""
        };
        onChange(updatedItem, index);
        setIsApprovalOpen(false);
    };

    const submitRejection = () => {
        const reason = useCustomReason ? customReason : rejectionPreset;
        if (!reason.trim()) {
            alert("Debe especificar el motivo de rechazo");
            return;
        }
        const updatedItem = {
            ...item,
            status: "rechazado",
            verificado: false,
            rejectionReason: reason,
            motivo_rechazo: reason
        };
        onChange(updatedItem, index);
        setIsRejectionOpen(false);
        setRejectionPreset("");
        setCustomReason("");
        setUseCustomReason(false);
    };

    return (
        <div className="relative">
            {/* Botones */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={(e) => handleStatusChange(true, e)}
                    disabled={isApproved || readOnly}
                    className={`p-2 rounded-md transition-all ${isApproved
                        ? "bg-green-200 text-green-800 ring-2 ring-green-500"
                        : "bg-gray-100 text-gray-500 hover:bg-green-50"
                        } ${isApproved || readOnly ? "opacity-80 cursor-not-allowed" : "cursor-pointer"}`}
                    title="Aprobar"
                >
                    <CheckCircle size={20} />
                </button>

                <button
                    onClick={(e) => handleStatusChange(false, e)}
                    disabled={isApproved || readOnly}
                    className={`p-2 rounded-md transition-all ${isRejected
                        ? "bg-red-100 text-red-700 ring-2 ring-red-500"
                        : "bg-gray-100 text-gray-500 hover:bg-red-50"
                        } ${isApproved || readOnly ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    title="Rechazar"
                >
                    <XCircle size={20} />
                </button>

                <span
                    className={`text-sm font-medium ${isApproved
                        ? "text-green-700"
                        : isRejected
                            ? "text-red-700"
                            : "text-gray-600"
                        }`}
                >
                    {isApproved ? labels.aprobado : isRejected ? labels.rechazado : labels.pendiente}
                </span>
            </div>

            {/* Motivo de rechazo visible */}
            {isRejected && rejectionReason && (
                <div className="mt-2 text-xs text-red-700 bg-red-50 p-2 rounded-md border border-red-200">
                    <strong>Motivo de rechazo:</strong> {rejectionReason}
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
                        <div className="mb-4 text-gray-700">
                            ¿Está seguro de que desea aprobar este {type}? Esta acción es <b>irreversible</b>.
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
                                onChange={e => {
                                    setRejectionPreset(e.target.value);
                                    setUseCustomReason(e.target.value === "Otro (especifique)");
                                }}
                                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-300 focus:border-red-500"
                            >
                                <option value="">Seleccione un motivo...</option>
                                {motivosRechazoDefault.map((motivo, idx) => (
                                    <option key={idx} value={motivo}>{motivo}</option>
                                ))}
                            </select>
                        </div>
                        {useCustomReason && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Motivo personalizado <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={customReason}
                                    onChange={e => setCustomReason(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md"
                                    placeholder="Ingrese el motivo específico..."
                                    rows="3"
                                />
                            </div>
                        )}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsRejectionOpen(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={submitRejection}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Rechazar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
