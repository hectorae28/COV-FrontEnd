"use client";

import { motion } from "framer-motion";
import { AlertCircle, Briefcase, CheckCircle, Pencil, Save, X } from "lucide-react";
import { useState } from "react";

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
    // Estado para validaciones
    const [errors, setErrors] = useState({});

    // Función para manejar cambios en datos profesionales
    const handleDatosProfesionalesChange = (e) => {
        const { name, value } = e.target;

        // Aplicar validaciones según el campo
        let processedValue = value;

        // Para campos numéricos, validar formato
        if (name === "numeroRegistro" || name === "anios_experiencia") {
            if (!/^\d*$/.test(value)) {
                return; // No actualizar si contiene caracteres no numéricos
            }
        }

        setDatosProfesionales(prev => ({
            ...prev,
            [name]: processedValue
        }));
        setCambiosPendientes(true);

        // Limpiar error específico
        setErrors(prev => ({
            ...prev,
            [name]: undefined
        }));
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

    // Validar formulario antes de guardar
    const validateForm = () => {
        const newErrors = {};

        // Validar número de registro
        if (!datosProfesionales.numeroRegistro) {
            newErrors.numeroRegistro = "El número de registro es obligatorio";
        }

        // Validar fecha de vencimiento si el carnet está vigente
        if (datosProfesionales.carnetVigente && !datosProfesionales.carnetVencimiento) {
            newErrors.carnetVencimiento = "La fecha de vencimiento es obligatoria";
        }

        // Validar que los años de experiencia sean un número válido
        if (datosProfesionales.anios_experiencia && !/^\d+$/.test(datosProfesionales.anios_experiencia)) {
            newErrors.anios_experiencia = "Los años de experiencia deben ser un número";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    // Función para guardar cambios en datos profesionales
    const handleGuardarDatosProfesionales = () => {
        // Validar formulario antes de guardar
        if (!validateForm()) {
            return;
        }

        // Implementar lógica para guardar en el backend/store
        const nuevosDatos = { ...datosProfesionales };
        updateColegiadoData(colegiadoId, nuevosDatos);
        setEditandoProfesional(false);
        setCambiosPendientes(false);
    };

    // Formatear fechas para visualización
    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return "No especificada";

        try {
            return new Date(fechaISO).toLocaleDateString('es-ES');
        } catch (error) {
            return fechaISO;
        }
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
                        className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:opacity-90 transition-colors"
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
                                setErrors({});
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
                // Vista de información profesional con layout mejorado
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Número de registro</p>
                            <p className="font-medium text-gray-800">{datosProfesionales?.numeroRegistro || "No especificado"}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Especialidad</p>
                            <p className="font-medium text-gray-800">{datosProfesionales?.especialidad || "No especificada"}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Años de experiencia</p>
                            <p className="font-medium text-gray-800">{datosProfesionales?.anios_experiencia || "No especificado"}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Estado del carnet</p>
                            <p className={`font-medium ${datosProfesionales?.carnetVigente ? 'text-green-600' : 'text-amber-600'} flex items-center`}>
                                {datosProfesionales?.carnetVigente ? (
                                    <>
                                        <CheckCircle size={16} className="mr-1" />
                                        Vigente hasta {formatearFecha(datosProfesionales?.carnetVencimiento)}
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle size={16} className="mr-1" />
                                        {datosProfesionales?.carnetVencimiento
                                            ? `Vencido desde ${formatearFecha(datosProfesionales?.carnetVencimiento)}`
                                            : "No especificado"}
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                // Formulario de edición de información profesional con layout mejorado
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#41023B] mb-2">
                                Número de registro
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                name="numeroRegistro"
                                value={datosProfesionales?.numeroRegistro || ""}
                                onChange={handleDatosProfesionalesChange}
                                className={`w-full px-4 py-3 border ${errors.numeroRegistro ? "border-red-500 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                                placeholder="Ingrese el número de registro"
                            />
                            {errors.numeroRegistro && (
                                <p className="mt-1 text-xs text-red-500">{errors.numeroRegistro}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#41023B] mb-2">
                                Especialidad
                            </label>
                            <input
                                type="text"
                                name="especialidad"
                                value={datosProfesionales?.especialidad || ""}
                                onChange={handleDatosProfesionalesChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                                placeholder="Ingrese la especialidad"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#41023B] mb-2">
                                Años de experiencia
                            </label>
                            <input
                                type="number"
                                name="anios_experiencia"
                                value={datosProfesionales?.anios_experiencia || ""}
                                onChange={handleDatosProfesionalesChange}
                                className={`w-full px-4 py-3 border ${errors.anios_experiencia ? "border-red-500 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                                placeholder="Ingrese los años de experiencia"
                            />
                            {errors.anios_experiencia && (
                                <p className="mt-1 text-xs text-red-500">{errors.anios_experiencia}</p>
                            )}
                        </div>

                        <div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-[#41023B] mb-2">
                                    Estado del carnet
                                </label>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="carnetVigente"
                                        name="carnetVigente"
                                        checked={datosProfesionales?.carnetVigente || false}
                                        onChange={handleCheckboxChange}
                                        className="w-5 h-5 text-[#C40180] rounded border-gray-300 focus:ring-[#D7008A]"
                                    />
                                    <label htmlFor="carnetVigente" className="ml-2 text-sm text-gray-700">
                                        Carnet vigente
                                    </label>
                                </div>
                            </div>

                            {datosProfesionales?.carnetVigente && (
                                <div>
                                    <label className="block text-sm font-medium text-[#41023B] mb-2">
                                        Fecha de vencimiento
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="carnetVencimiento"
                                        value={datosProfesionales?.carnetVencimiento || ""}
                                        onChange={handleDatosProfesionalesChange}
                                        className={`w-full px-4 py-3 border ${errors.carnetVencimiento ? "border-red-500 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                                    />
                                    {errors.carnetVencimiento && (
                                        <p className="mt-1 text-xs text-red-500">{errors.carnetVencimiento}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}