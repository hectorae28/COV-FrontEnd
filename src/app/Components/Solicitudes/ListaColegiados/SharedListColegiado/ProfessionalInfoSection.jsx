// SharedListColegiado/ProfessionalInfoSection.jsx
"use client";

import { Briefcase, CheckCircle, AlertCircle, Pencil, X, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfessionalInfoSection({
    colegiado,
    datosProfesionales,
    setDatosProfesionales,
    editandoProfesional,
    setEditandoProfesional,
    updateColegiadoData,
    colegiadoId,
    setCambiosPendientes,
    readonly = false
}) {
    // Función para manejar cambios en datos profesionales
    const handleDatosProfesionalesChange = (e) => {
        const { name, value } = e.target;
        setDatosProfesionales(prev => ({
            ...prev,
            [name]: value
        }));
        setCambiosPendientes(true);
    };

    // Función para manejar cambios en checkboxes
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setDatosProfesionales(prev => ({
            ...prev,
            [name]: checked
        }));
        setCambiosPendientes(true);
    };

    // Función para guardar cambios en datos profesionales
    const handleGuardarDatosProfesionales = () => {
        // Implementar lógica para guardar en el backend/store
        const nuevosDatos = { ...datosProfesionales };
        updateColegiadoData(colegiadoId, nuevosDatos);
        setEditandoProfesional(false);
        setCambiosPendientes(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
        >
            <div className="flex items-center justify-between mb-5 border-b pb-3">
                <div className="flex items-center">
                    <Briefcase size={20} className="text-[#C40180] mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">Información profesional</h2>
                </div>

                {!editandoProfesional && !readonly ? (
                    <button
                        onClick={() => setEditandoProfesional(true)}
                        className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:bg-purple-200 transition-colors"
                    >
                        <Pencil size={16} className="mr-1" />
                        Editar
                    </button>
                ) : !readonly ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                // Revertir cambios
                                setDatosProfesionales({
                                    numeroRegistro: colegiado?.numeroRegistro || "",
                                    especialidad: colegiado?.especialidad || "",
                                    anios_experiencia: colegiado?.anios_experiencia || "",
                                    carnetVigente: colegiado?.carnetVigente || false,
                                    carnetVencimiento: colegiado?.carnetVencimiento || ""
                                });
                                setEditandoProfesional(false);
                                setCambiosPendientes(false);
                            }}
                            className="cursor-pointer bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                            <X size={16} className="mr-1" />
                            Cancelar
                        </button>
                        <button
                            onClick={handleGuardarDatosProfesionales}
                            className="cursor-pointer bg-green-100 text-green-700 px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:bg-green-200 transition-colors"
                        >
                            <Save size={16} className="mr-1" />
                            Guardar
                        </button>
                    </div>
                ) : null}
            </div>

            {!editandoProfesional ? (
                // Vista de información profesional
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Número de registro</p>
                        <p className="font-medium text-gray-800">{datosProfesionales?.numeroRegistro || "No especificado"}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Especialidad</p>
                        <p className="font-medium text-gray-800">{datosProfesionales?.especialidad || "No especificada"}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Años de experiencia</p>
                        <p className="font-medium text-gray-800">{datosProfesionales?.anios_experiencia || "No especificado"}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Estado del carnet</p>
                        <p className={`font-medium ${datosProfesionales?.carnetVigente ? 'text-green-600' : 'text-amber-600'} flex items-center`}>
                            {datosProfesionales?.carnetVigente ? (
                                <>
                                    <CheckCircle size={16} className="mr-1" />
                                    Vigente hasta {datosProfesionales?.carnetVencimiento || "No especificado"}
                                </>
                            ) : (
                                <>
                                    <AlertCircle size={16} className="mr-1" />
                                    Vencido desde {datosProfesionales?.carnetVencimiento || "No especificado"}
                                </>
                            )}
                        </p>
                    </div>
                </div>
            ) : (
                // Formulario de edición de información profesional
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Número de registro</label>
                        <input
                            type="text"
                            name="numeroRegistro"
                            value={datosProfesionales?.numeroRegistro || ""}
                            onChange={handleDatosProfesionalesChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Especialidad</label>
                        <input
                            type="text"
                            name="especialidad"
                            value={datosProfesionales?.especialidad || ""}
                            onChange={handleDatosProfesionalesChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Años de experiencia</label>
                        <input
                            type="number"
                            name="anios_experiencia"
                            value={datosProfesionales?.anios_experiencia || ""}
                            onChange={handleDatosProfesionalesChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de vencimiento del carnet</label>
                        <input
                            type="date"
                            name="carnetVencimiento"
                            value={datosProfesionales?.carnetVencimiento ? datosProfesionales.carnetVencimiento.split('T')[0] : ""}
                            onChange={handleDatosProfesionalesChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        />
                    </div>

                    <div className="col-span-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="carnetVigente"
                                name="carnetVigente"
                                checked={datosProfesionales?.carnetVigente || false}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 text-[#C40180] focus:ring-[#C40180] border-gray-300 rounded"
                            />
                            <label htmlFor="carnetVigente" className="ml-2 block text-sm text-gray-700">
                                Carnet vigente
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}