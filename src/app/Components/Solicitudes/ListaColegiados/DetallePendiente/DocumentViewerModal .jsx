"use client";

import { FileText, X, Download } from "lucide-react";
import { motion } from "framer-motion";

export default function DocumentViewerModal({ documento, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center">
                        <FileText className="text-[#C40180] mr-2" size={20} />
                        <h3 className="text-lg font-medium text-gray-900">
                            {documento.nombre}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100">
                    {/* Vista previa del documento (placeholder) */}
                    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-200 rounded-lg">
                        <div className="text-center p-6">
                            <FileText size={64} className="mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500 font-medium">Vista previa no disponible para {documento.nombre}</p>
                            <p className="text-sm text-gray-400 mt-2">Archivo: {documento.archivo}</p>
                            <button className="mt-6 bg-gradient-to-br from-[#C40180] to-[#7D0053] text-white px-5 py-2.5 rounded-md hover:opacity-90 transition-all shadow-sm font-medium flex items-center justify-center gap-2 mx-auto">
                                <Download size={16} />
                                Descargar documento
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}