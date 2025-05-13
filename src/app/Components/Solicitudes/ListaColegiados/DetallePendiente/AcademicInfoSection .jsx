"use client";

import { Award, Pencil, X, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function AcademicInfoSection({
    pendiente,
    datosAcademicos,
    setDatosAcademicos,
    editandoAcademico,
    setEditandoAcademico,
    updateColegiadoPendiente,
    pendienteId,
    setCambiosPendientes
}) {
    // Función para manejar cambios en datos académicos
    const handleDatosAcademicosChange = (e) => {
        const { name, value } = e.target;
        setDatosAcademicos(prev => ({
            ...prev,
            [name]: value
        }));
        setCambiosPendientes(true);
    };

    // Función para guardar cambios en datos académicos
    const handleGuardarDatosAcademicos = () => {
        // Aquí implementarías la lógica para guardar en el backend/store
        const nuevosDatos = { ...datosAcademicos };
        if(pendiente.tipo_profesion !== "odontologo"){
            delete nuevosDatos.num_registro_principal;
            delete nuevosDatos.fecha_registro_principal;
        }
        updateColegiadoPendiente(pendienteId, nuevosDatos);
        setEditandoAcademico(false);
        setCambiosPendientes(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 md:col-span-2 border border-gray-100"
        >
            <div className="flex items-center justify-between mb-5 border-b pb-3">
                <div className="flex items-center">
                    <Award size={20} className="text-[#C40180] mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">Información académica y profesional</h2>
                </div>

                {!editandoAcademico ? (
                    <button
                        onClick={() => setEditandoAcademico(true)}
                        className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:bg-purple-200 transition-colors"
                    >
                        <Pencil size={16} className="mr-1" />
                        Editar
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                // Revertir cambios
                                setDatosAcademicos({
                                    instituto_bachillerato: pendiente.instituto_bachillerato || "",
                                    universidad: pendiente.universidad || "",
                                    fecha_egreso_universidad: pendiente.fecha_egreso_universidad || "",
                                    num_registro_principal: pendiente.num_registro_principal || "",
                                    fecha_registro_principal: pendiente.fecha_registro_principal || "",
                                    num_mpps: pendiente.num_mpps || "",
                                    fecha_mpps: pendiente.fecha_mpps || "",
                                    observaciones: pendiente.observaciones || ""
                                });
                                setEditandoAcademico(false);
                                setCambiosPendientes(false);
                            }}
                            className="cursor-pointer bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                            <X size={16} className="mr-1" />
                            Cancelar
                        </button>
                        <button
                            onClick={handleGuardarDatosAcademicos}
                            className="cursor-pointer bg-green-100 text-green-700 px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:bg-green-200 transition-colors"
                        >
                            <Save size={16} className="mr-1" />
                            Guardar
                        </button>
                    </div>
                )}
            </div>

            {!editandoAcademico ? (
                // Vista de información académica
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Primera columna */}

                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Universidad</p>
                            <p className="font-medium text-gray-800">{datosAcademicos?.universidad.titulo || "No especificado"}</p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de egreso</p>
                            <p className="font-medium text-gray-800">{datosAcademicos?.fecha_egreso_universidad ? new Date(datosAcademicos.fecha_egreso_universidad).toLocaleDateString('es-ES') : "No especificada"}</p>
                        </div>
                        {pendiente.tipo_profesion === "odontologo" && (
                            <>
                            <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Número de registro principal</p>
                                <p className="font-medium text-gray-800">{datosAcademicos?.num_registro_principal || "No especificado"}</p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de registro principal</p>
                                <p className="font-medium text-gray-800">{datosAcademicos?.fecha_registro_principal ? new Date(datosAcademicos.fecha_registro_principal).toLocaleDateString('es-ES') : "No especificado"}</p>
                            </div>
                            
                            </>
                        )}

                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Número MPPS</p>
                            <p className="font-medium text-gray-800">{datosAcademicos?.num_mpps || "No especificado"}</p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha MPPS</p>
                            <p className="font-medium text-gray-800">{datosAcademicos?.fecha_mpps ? new Date(datosAcademicos.fecha_mpps).toLocaleDateString('es-ES') : "No especificada"}</p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Observaciones</p>
                            <p className="font-medium text-gray-800">{datosAcademicos?.observaciones || "Ninguna"}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Instituto de bachillerato</p>
                            <p className="font-medium text-gray-800">{datosAcademicos?.instituto_bachillerato || "No especificado"}</p>
                        </div>

                </div>
            ) : (
                // Formulario de edición de información académica
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Universidad</label>
                        <input
                            type="text"
                            name="universidad"
                            value={datosAcademicos?.universidad?.titulo || ""}
                            onChange={handleDatosAcademicosChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de egreso</label>
                        <input
                            type="date"
                            name="fecha_egreso_universidad"
                            value={datosAcademicos?.fecha_egreso_universidad ? datosAcademicos.fecha_egreso_universidad.split('T')[0] : ""}
                            onChange={handleDatosAcademicosChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        />
                    </div>

                    {pendiente.tipo_profesion === "odontologo" && (
                        <>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Número de registro principal</label>
                                <input
                                    type="text"
                                    name="num_registro_principal"
                                    value={datosAcademicos?.num_registro_principal || ""}
                                    onChange={handleDatosAcademicosChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de registro principal</label>
                                <input
                                    type="date"
                                    name="fecha_registro_principal"
                                    value={datosAcademicos?.fecha_registro_principal || ""}
                                    onChange={handleDatosAcademicosChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Número MPPS</label>
                        <input
                            type="text"
                            name="num_mpps"
                            value={datosAcademicos?.num_mpps || ""}
                            onChange={handleDatosAcademicosChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha MPPS</label>
                        <input
                            type="date"
                            name="fecha_mpps"
                            value={datosAcademicos?.fecha_mpps ? datosAcademicos.fecha_mpps.split('T')[0] : ""}
                            onChange={handleDatosAcademicosChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Instituto de bachillerato</label>
                        <input
                            type="text"
                            name="instituto_bachillerato"
                            value={datosAcademicos?.instituto_bachillerato || ""}
                            onChange={handleDatosAcademicosChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        />
                    </div>
                </div>
            )}
        </motion.div>
    );
}