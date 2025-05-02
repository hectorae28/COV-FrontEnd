"use client";

import { CheckCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function ApprovalModal({
    nombreCompleto,
    datosRegistro,
    setDatosRegistro,
    pasoModal,
    setPasoModal,
    handleAprobarSolicitud,
    onClose
}) {
    // Función para manejar cambios en el formulario
    const handleDatosRegistroChange = (e) => {
        const { name, value } = e.target;
        setDatosRegistro(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Función para avanzar al siguiente paso
    const avanzarPasoModal = () => {
        // Validar campos del primer paso
        if (!datosRegistro.libro || !datosRegistro.pagina || !datosRegistro.num_cov) {
            alert("Por favor complete todos los campos requeridos para continuar");
            return;
        }

        setPasoModal(2);
    };

    // Función para retroceder al paso anterior
    const retrocederPasoModal = () => {
        setPasoModal(1);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden"
            >
                {pasoModal === 1 ? (
                    // Paso 1: Formulario de registro
                    <>
                        <div className="bg-[#7D0053]/10 p-4 border-b border-[#7D0053]">
                            <div className="flex items-center justify-center mb-2 text-[#7D0053]">
                                <FileText size={40} />
                            </div>
                            <h3 className="text-xl font-semibold text-center text-gray-900">
                                Datos de registro de colegiado
                            </h3>
                            <p className="text-center text-gray-600 mt-2">
                                Ingrese los datos de registro para el colegiado <span className="font-medium text-gray-900">{nombreCompleto}</span>
                            </p>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Libro <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="libro"
                                            value={datosRegistro.libro}
                                            onChange={handleDatosRegistroChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                            placeholder="Número de libro"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Página <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="pagina"
                                            value={datosRegistro.pagina}
                                            onChange={handleDatosRegistroChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                            placeholder="Número de página"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Número COV <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="num_cov"
                                        value={datosRegistro.num_cov}
                                        onChange={handleDatosRegistroChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                        placeholder="Número de registro COV"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={avanzarPasoModal}
                                    className="px-6 py-2 bg-gradient-to-br from-[#C40180] to-[#7D0053] text-white rounded-md hover:from-[#C40180] hover:to-[#C40180] transition-all shadow-sm font-medium"
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    // Paso 2: Confirmación
                    <>
                        <div className="bg-green-50 p-4 border-b border-green-100">
                            <div className="flex items-center justify-center mb-2 text-green-600">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-xl font-semibold text-center text-gray-900">
                                Confirmar aprobación
                            </h3>
                        </div>

                        <div className="p-6">
                            <p className="text-center text-gray-600 mb-4">
                                ¿Está seguro que desea aprobar la solicitud de <span className="font-medium text-gray-900">{nombreCompleto}</span>?
                                Se generará un nuevo registro de colegiado en el sistema con los siguientes datos:
                            </p>

                            <div className="bg-gray-50 p-4 rounded-md mb-6">
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex justify-between">
                                        <span className="font-medium">Libro:</span>
                                        <span>{datosRegistro.libro}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="font-medium">Página:</span>
                                        <span>{datosRegistro.pagina}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="font-medium">Número COV:</span>
                                        <span>{datosRegistro.num_cov}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={retrocederPasoModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Volver
                                </button>
                                <button
                                    onClick={handleAprobarSolicitud}
                                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-all shadow-sm font-medium"
                                >
                                    Confirmar aprobación
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}