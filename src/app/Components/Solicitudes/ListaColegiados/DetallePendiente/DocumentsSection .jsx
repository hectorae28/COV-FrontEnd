"use client";

import { FileText, Eye, RefreshCcw, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function DocumentsSection({ documentosRequeridos, handleVerDocumento }) {
    // Función para reemplazar documento
    const handleReemplazarDocumento = (documento) => {
        // Implementar lógica para reemplazar documento
        alert(`Funcionalidad para reemplazar el documento: ${documento.nombre}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
        >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <div className="flex items-center mb-5 md:mb-0 border-b md:border-b-0 pb-3 md:pb-0">
                    <FileText size={20} className="text-[#C40180] mr-2" />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Documentos</h2>
                        <p className="text-sm text-gray-500">Documentación del colegiado</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentosRequeridos && documentosRequeridos.length > 0 ? (
                    documentosRequeridos.map((documento) => (
                        <div
                            key={documento.id}
                            className={`border rounded-lg ${documento.archivo ? "border-gray-200 hover:border-[#C40180]" : "border-red-200 bg-red-50"} hover:shadow-md transition-all duration-200`}
                        >
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <div className={`${documento.archivo ? "bg-[#F9E6F3]" : "bg-red-100"} p-2 rounded-md mr-3`}>
                                                <FileText
                                                    className={documento.archivo ? "text-[#C40180]" : "text-red-500"}
                                                    size={20}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900 flex items-center">
                                                    {documento.nombre}
                                                    {documento.requerido && <span className="text-red-500 ml-1">*</span>}
                                                </h3>
                                                <p className="text-xs text-gray-500">{documento.descripcion}</p>
                                            </div>
                                        </div>

                                        {/* Mensaje cuando no hay archivo */}
                                        {!documento.archivo && (
                                            <div className="mt-2 flex items-start bg-red-100 p-2 rounded text-xs text-red-600">
                                                <AlertCircle size={14} className="mr-1 flex-shrink-0 mt-0.5" />
                                                <span>
                                                    Falta documento. {documento.requerido && "Este documento es requerido para completar el registro."}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-1">
                                        {documento.archivo ? (
                                            <button
                                                onClick={() => handleVerDocumento(documento)}
                                                className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                                                title="Ver documento"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 p-2" title="No hay documento para ver">
                                                <Eye size={18} />
                                            </span>
                                        )}

                                        <button
                                            onClick={() => handleReemplazarDocumento(documento)}
                                            className={`${documento.archivo ? "text-orange-600 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"} p-2 rounded-full transition-colors`}
                                            title={documento.archivo ? "Reemplazar documento" : "Subir documento"}
                                        >
                                            <RefreshCcw size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center">
                        <FileText size={40} className="text-gray-300 mb-3" />
                        <p className="text-gray-500 text-center">No hay documentos configurados en el sistema</p>
                    </div>
                )}
            </div>

            {!documentosRequeridos || documentosRequeridos.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center">
                    <FileText size={40} className="text-gray-300 mb-3" />
                    <p className="text-gray-500 text-center">No hay documentos configurados en el sistema</p>
                </div>
            ) : null}
        </motion.div>
    );
}