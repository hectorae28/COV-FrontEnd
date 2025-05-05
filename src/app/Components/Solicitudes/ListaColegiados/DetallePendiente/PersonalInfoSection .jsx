"use client";

import { User, Pencil, X, Save, Clock } from "lucide-react";
import { motion } from "framer-motion";
import SessionInfo from "@/Components/SessionInfo";

export default function PersonalInfoSection({
    pendiente,
    datosPersonales,
    setDatosPersonales,
    editandoPersonal,
    setEditandoPersonal,
    updateColegiadoPendiente,
    pendienteId,
    setCambiosPendientes
}) {
    // Función para manejar cambios en datos personales
    const handleDatosPersonalesChange = (e) => {
        const { name, value } = e.target;
        setDatosPersonales(prev => {
            // Manejar campos anidados como dirección
            if (name.includes('.')) {
                const [parent, child] = name.split('.');
                return {
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: value
                    }
                };
            }
            return {
                ...prev,
                [name]: value
            };
        });
        setCambiosPendientes(true);
    };

    // Función para guardar cambios en datos personales
    const handleGuardarDatosPersonales = () => {
        const nuevosDatos = { ...pendiente, persona: datosPersonales };
        updateColegiadoPendiente(pendienteId, nuevosDatos);
        setEditandoPersonal(false);
        setCambiosPendientes(false);
    };

    // Formatear el nombre completo para mostrar
    const nombreCompleto = pendiente ?
        `${pendiente.persona.nombre} ${pendiente.persona.segundo_nombre || ''} ${pendiente.persona.primer_apellido} ${pendiente.persona.segundo_apellido || ''}`.trim()
        : "";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
        >
            
            {/* Información del creador */}
            {pendiente?.creador && (
                <div className="pt-6 mb-8">
                    <div className="flex items-center mb-5 border-b pb-3">
                        <Clock size={20} className="text-[#C40180] mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900">Información del registro</h2>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-md">
                        <SessionInfo
                            creador={pendiente.creador}
                            variant="full"
                        />
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-5 border-b pb-3">
                <div className="flex items-center">
                    <User size={20} className="text-[#C40180] mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">Información personal</h2>
                </div>

                {!editandoPersonal ? (
                    <button
                        onClick={() => setEditandoPersonal(true)}
                        className="bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:bg-purple-200 transition-colors"
                    >
                        <Pencil size={16} className="mr-1" />
                        Editar
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                // Revertir cambios
                                setDatosPersonales({ ...pendiente.persona });
                                setEditandoPersonal(false);
                                setCambiosPendientes(false);
                            }}
                            className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                            <X size={16} className="mr-1" />
                            Cancelar
                        </button>
                        <button
                            onClick={handleGuardarDatosPersonales}
                            className="bg-green-100 text-green-700 px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:bg-green-200 transition-colors"
                        >
                            <Save size={16} className="mr-1" />
                            Guardar
                        </button>
                    </div>
                )}
            </div>

            {!editandoPersonal ? (
                // Vista de información personal
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Primera columna */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Nombre completo</p>
                            <p className="font-medium text-gray-800">{nombreCompleto}</p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Cédula</p>
                            <p className="font-medium text-gray-800">{datosPersonales?.nacionalidad}-{datosPersonales?.identificacion}</p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de nacimiento</p>
                            <p className="font-medium text-gray-800">{datosPersonales?.fecha_de_nacimiento ? new Date(datosPersonales.fecha_de_nacimiento).toLocaleDateString('es-ES') : "No especificada"}</p>
                        </div>
                    </div>

                    {/* Segunda columna */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Correo electrónico</p>
                            <p className="font-medium text-gray-800">{datosPersonales?.correo}</p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Teléfono</p>
                            <p className="font-medium text-gray-800">{datosPersonales?.telefono_movil}</p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Dirección</p>
                            <p className="font-medium text-gray-800">{datosPersonales?.direccion?.completa || "No especificada"}</p>
                        </div>
                    </div>

                    {/* Tercera columna */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Título entregado en oficina</p>
                            <p className="font-medium text-gray-800">{datosPersonales?.titulo_entregado ? "Entregado" : "No entregado"}</p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de registro</p>
                            <p className="font-medium text-gray-800">{datosPersonales?.fecha_registro ? new Date(datosPersonales.fecha_registro).toLocaleDateString('es-ES') : "No especificada"}</p>
                        </div>
                    </div>
                </div>
            ) : (
                // Formulario de edición de información personal
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primera columna */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={datosPersonales?.nombre || ""}
                                onChange={handleDatosPersonalesChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Segundo nombre</label>
                            <input
                                type="text"
                                name="segundo_nombre"
                                value={datosPersonales?.segundo_nombre || ""}
                                onChange={handleDatosPersonalesChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Primer apellido</label>
                            <input
                                type="text"
                                name="primer_apellido"
                                value={datosPersonales?.primer_apellido || ""}
                                onChange={handleDatosPersonalesChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Segundo apellido</label>
                            <input
                                type="text"
                                name="segundo_apellido"
                                value={datosPersonales?.segundo_apellido || ""}
                                onChange={handleDatosPersonalesChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Nacionalidad</label>
                                <select
                                    name="nacionalidad"
                                    value={datosPersonales?.nacionalidad || "V"}
                                    onChange={handleDatosPersonalesChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                >
                                    <option value="V">V</option>
                                    <option value="E">E</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Identificación</label>
                                <input
                                    type="text"
                                    name="identificacion"
                                    value={datosPersonales?.identificacion || ""}
                                    onChange={handleDatosPersonalesChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de nacimiento</label>
                            <input
                                type="date"
                                name="fecha_de_nacimiento"
                                value={datosPersonales?.fecha_de_nacimiento ? datosPersonales.fecha_de_nacimiento.split('T')[0] : ""}
                                onChange={handleDatosPersonalesChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                            />
                        </div>
                    </div>

                    {/* Segunda columna */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Correo electrónico</label>
                            <input
                                type="email"
                                name="correo"
                                value={datosPersonales?.correo || ""}
                                onChange={handleDatosPersonalesChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Teléfono</label>
                            <input
                                type="tel"
                                name="telefono_movil"
                                value={datosPersonales?.telefono_movil || ""}
                                onChange={handleDatosPersonalesChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Dirección completa</label>
                            <input
                                type="text"
                                name="direccion.completa"
                                value={datosPersonales?.direccion?.completa || ""}
                                onChange={handleDatosPersonalesChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Título entregado</label>
                                <select
                                    name="titulo_entregado"
                                    value={datosPersonales?.titulo_entregado ? "true" : "false"}
                                    onChange={handleDatosPersonalesChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                >
                                    <option value="false">No entregado</option>
                                    <option value="true">Entregado</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de registro</label>
                                <input
                                    type="date"
                                    name="fecha_registro"
                                    value={datosPersonales?.fecha_registro ? datosPersonales.fecha_registro.split('T')[0] : ""}
                                    onChange={handleDatosPersonalesChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}