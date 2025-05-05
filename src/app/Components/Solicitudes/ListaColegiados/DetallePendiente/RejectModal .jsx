"use client";
import { XCircle, AlertOctagon } from "lucide-react";
import { motion } from "framer-motion";

export default function RejectModal({
    nombreCompleto,
    motivoRechazo,
    setMotivoRechazo,
    handleRechazarSolicitud,
    handleDenegarSolicitud,
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

                    <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 mb-4">
                        <h4 className="text-sm font-medium text-yellow-800 mb-1 flex items-center">
                            <AlertOctagon size={16} className="mr-1" /> Diferencia entre rechazar y denegar
                        </h4>
                        <p className="text-xs text-yellow-700">
                            • <strong>Rechazar:</strong> Permite correcciones futuras. El solicitante puede volver a intentarlo.
                            <br />
                            • <strong>Denegar:</strong> Rechazo definitivo. No se permitirán más acciones sobre esta solicitud.
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Motivo del rechazo o denegación <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={motivoRechazo}
                            onChange={(e) => setMotivoRechazo(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all"
                            placeholder="Ingrese el motivo del rechazo o denegación"
                            rows="3"
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-1">
                            Este motivo será enviado al solicitante por correo electrónico y quedará registrado en el sistema.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <button
                            onClick={onClose}
                            className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleRechazarSolicitud}
                            className="cursor-pointer px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-md hover:from-[#C40180] hover:to-[#C40180] transition-all shadow-sm font-medium"
                        >
                            Rechazar solicitud
                        </button>
                        <button
                            onClick={handleDenegarSolicitud}
                            className="cursor-pointer px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-600 hover:to-red-600 transition-all shadow-sm font-medium"
                        >
                            Denegar solicitud
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}