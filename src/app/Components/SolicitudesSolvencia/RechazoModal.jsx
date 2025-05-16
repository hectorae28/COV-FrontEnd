import { AlertTriangle, XCircle } from "lucide-react";
import { useState } from "react";

const motivosRechazoList = [
    "Información incorrecta o faltante",
    "No cumple con los requisitos",
    "Debe actualizar datos personales",
    "Requiere actualizar registro profesional",
    "Registro profesional suspendido",
    "Faltan pagos anteriores",
    "Ya posee una solvencia válida",
    "Otro motivo"
];

const RechazoModal = ({ onCancel, onConfirm }) => {
    // Estado local para el modal
    const [motivoRechazo, setMotivoRechazo] = useState("");

    const handleConfirm = () => {
        if (!motivoRechazo) {
            alert("Debe seleccionar un motivo de rechazo");
            return;
        }
        onConfirm(motivoRechazo);
    }

    return (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden">
                {/* Encabezado */}
                <div className="bg-gradient-to-r from-[#C40180] to-[#590248] text-white p-5">
                    <div className="flex items-center gap-3">
                        <XCircle size={24} />
                        <div>
                            <h3 className="text-xl font-bold">Rechazar Solvencia</h3>
                            <p className="text-sm opacity-90 mt-1">
                                Por favor, indique el motivo del rechazo
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-5">
                    {/* Formulario de rechazo */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Motivo del rechazo <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={motivoRechazo}
                                onChange={(e) => setMotivoRechazo(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#C40180] focus:border-[#C40180] text-sm"
                            >
                                <option value="">Seleccione un motivo</option>
                                {motivosRechazoList.map((motivo) => (
                                    <option key={motivo} value={motivo}>
                                        {motivo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-start bg-red-50 p-3 rounded-md border border-red-200">
                            <AlertTriangle size={18} className="text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-red-800">
                                La solvencia rechazada no podrá ser utilizada y el colegiado deberá realizar una nueva solicitud.
                            </p>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-3 mt-6 pt-3 border-t">
                        <button
                            onClick={onCancel}
                            className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Confirmar rechazo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RechazoModal