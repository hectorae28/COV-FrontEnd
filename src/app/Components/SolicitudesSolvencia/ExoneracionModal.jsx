import { AlertTriangle, Ban } from "lucide-react";
import React, { useState } from 'react';

const motivosExoneracionList = [
    "Miembro directivo",
    "Exención por años de colegiatura",
    "Programa especial",
    "Convenio institucional",
    "Caso especial aprobado",
    "Beneficio por docencia",
    "Exención por méritos profesionales",
    "Otro motivo"
];

const ExoneracionModal = ({ onCancel, onConfirm }) => {
    // Estado local para el modal
    const [motivoExoneracion, setMotivoExoneracion] = useState("");

    const handleConfirm = () => {
        if (!motivoExoneracion) {
            alert("Debe seleccionar un motivo de exoneración");
            return;
        }
        onConfirm(motivoExoneracion);
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Encabezado con gradiente */}
                <div className="bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white p-5">
                    <div className="flex items-center gap-3">
                        <Ban size={24} />
                        <div>
                            <h3 className="text-xl font-bold">Exonerar Pago</h3>
                            <p className="text-sm opacity-90 mt-1">
                                Confirme la exoneración de pago
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-5">
                    {/* Formulario de exoneración */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Motivo de la exoneración <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={motivoExoneracion}
                                onChange={(e) => setMotivoExoneracion(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] text-sm"
                            >
                                <option value="">Seleccione un motivo</option>
                                {motivosExoneracionList.map((motivo) => (
                                    <option key={motivo} value={motivo}>
                                        {motivo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-start bg-teal-50 p-3 rounded-md border border-teal-200">
                            <AlertTriangle size={18} className="text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-teal-800">
                                Esta solvencia será exonerada de pago. Una vez aplicada la exoneración, no se podrá revertir la acción.
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
                            className="cursor-pointer px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                        >
                            Confirmar exoneración
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExoneracionModal