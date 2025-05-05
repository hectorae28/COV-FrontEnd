"use client"

import { X } from "lucide-react"
import { motion } from "framer-motion"

export default function ExoneracionModal({
    nombreCompleto,
    motivoExoneracion,
    setMotivoExoneracion,
    handleExonerarPagos,
    onClose,
}) {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-xl"
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-medium text-[#41023B]">Exonerar pagos</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-700 mb-4">
                            Está a punto de exonerar los pagos para <strong>{nombreCompleto}</strong>. Esta acción marcará al
                            colegiado como solvente sin necesidad de realizar un pago.
                        </p>

                        <div className="p-4 bg-[#41023B]/20 rounded-xl border border-[#41023B] mb-4">
                            <p className="text-md text-gray-800">
                                <span className="text-[#41023B] font-bold">Importante:</span> La exoneración de pagos es una acción
                                administrativa que debe estar debidamente justificada.
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Motivo de exoneración <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={motivoExoneracion}
                            onChange={(e) => setMotivoExoneracion(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:border-[#D7008A]"
                            rows={4}
                            placeholder="Ingrese el motivo por el cual se exoneran los pagos..."
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleExonerarPagos}
                            disabled={!motivoExoneracion.trim()}
                            className={`px-4 py-2 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-md hover:opacity-90 transition-colors ${!motivoExoneracion.trim() ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            Confirmar exoneración
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
