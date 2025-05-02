"use client";

import { XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function RejectModal({
    nombreCompleto,
    motivoRechazo,
    setMotivoRechazo,
    handleRechazarSolicitud,
    onClose
}) {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden"
            >
                <div className="bg-red-50 p-4 border-b border-red-100">
                    <div className="flex items-center justify-center mb-2 text-red-600">
                        <XCircle size={40} />
                    </div>
                    <h3 className="text-xl font-semibold text-center text-gray-900">
                        Rechazar solicitud
                    </h3>
                </div>

                <div className="p-6">
                    <p className="text-center text-gray-600 mb-4">
                        Está a punto de rechazar la solicitud de <span className="font-medium text-gray-900">{nombreCompleto}</span>.
                    </p>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Motivo del rechazo <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={motivoRechazo}
                            onChange={(e) => setMotivoRechazo(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all"
                            placeholder="Ingrese el motivo del rechazo"
                            rows="3"
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-1">
                            Este motivo será enviado al solicitante por correo electrónico.
                        </p>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleRechazarSolicitud}
                            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-all shadow-sm font-medium"
                        >
                            Rechazar solicitud
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}