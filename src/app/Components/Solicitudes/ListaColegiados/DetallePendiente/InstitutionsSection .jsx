"use client";

import { Briefcase, Pencil, X, Save, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function InstitutionsSection({
    pendiente,
    instituciones,
    setInstituciones,
    nuevaInstitucion,
    setNuevaInstitucion,
    agregarInstitucion,
    setAgregarInstitucion,
    editandoInstituciones,
    setEditandoInstituciones,
    updateColegiadoPendiente,
    pendienteId,
    setCambiosPendientes
}) {
    // Función para manejar cambios en instituciones
    const handleInstitucionChange = (index, e) => {
        const { name, value } = e.target;
        const nuevasInstituciones = [...instituciones];
        nuevasInstituciones[index] = {
            ...nuevasInstituciones[index],
            [name]: value
        };
        setInstituciones(nuevasInstituciones);
        setCambiosPendientes(true);
    };

    // Función para eliminar una institución
    const handleEliminarInstitucion = (index) => {
        const nuevasInstituciones = instituciones.filter((_, i) => i !== index);
        setInstituciones(nuevasInstituciones);
        setCambiosPendientes(true);
    };

    // Función para manejar cambios en la nueva institución
    const handleNuevaInstitucionChange = (e) => {
        const { name, value } = e.target;
        setNuevaInstitucion(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Función para añadir una nueva institución
    const handleAgregarInstitucion = () => {
        if (!nuevaInstitucion.nombre) {
            alert("El nombre de la institución es requerido");
            return;
        }

        setInstituciones(prev => [...prev, { ...nuevaInstitucion }]);
        setNuevaInstitucion({
            nombre: "",
            cargo: "",
            telefono: "",
            direccion: ""
        });
        setAgregarInstitucion(false);
        setCambiosPendientes(true);
    };

    // Función para guardar cambios en instituciones
    const handleGuardarInstituciones = () => {
        // Aquí implementarías la lógica para guardar en el backend/store
        const nuevosDatos = { ...pendiente, instituciones };
        updateColegiadoPendiente(pendienteId, nuevosDatos);
        setEditandoInstituciones(false);
        setCambiosPendientes(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
        >
            <div className="flex items-center justify-between mb-5 border-b pb-3">
                <div className="flex items-center">
                    <Briefcase size={20} className="text-[#C40180] mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">Instituciones donde trabaja</h2>
                </div>

                {!editandoInstituciones ? (
                    <button
                        onClick={() => setEditandoInstituciones(true)}
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
                                setInstituciones(pendiente.instituciones ? [...pendiente.instituciones] : []);
                                setAgregarInstitucion(false);
                                setEditandoInstituciones(false);
                                setCambiosPendientes(false);
                            }}
                            className="cursor-pointer bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                            <X size={16} className="mr-1" />
                            Cancelar
                        </button>
                        <button
                            onClick={handleGuardarInstituciones}
                            className="cursor-pointer bg-green-100 text-green-700 px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:bg-green-200 transition-colors"
                        >
                            <Save size={16} className="mr-1" />
                            Guardar
                        </button>
                    </div>
                )}
            </div>

            {!editandoInstituciones ? (
                // Vista de instituciones
                instituciones && instituciones.length > 0 ? (
                    <div className="space-y-6">
                        {instituciones.map((institucion, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-md mb-4 last:mb-0">
                                <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200 flex items-center">
                                    <Briefcase size={16} className="mr-2 text-[#C40180]" />
                                    {institucion.nombre}
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Cargo</p>
                                        <p className="font-medium text-gray-800">{institucion.cargo || "No especificado"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Teléfono</p>
                                        <p className="font-medium text-gray-800">{institucion.telefono || "No especificado"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Dirección</p>
                                        <p className="font-medium text-gray-800">{institucion.direccion || "No especificada"}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 p-4 rounded-md text-gray-500 italic flex items-center justify-center h-32">
                        <div className="text-center">
                            <Briefcase size={24} className="mx-auto mb-2 text-gray-400" />
                            No hay instituciones registradas
                        </div>
                    </div>
                )
            ) : (
                // Formulario de edición de instituciones
                <div>
                    {/* Lista de instituciones existentes */}
                    {instituciones.length > 0 ? (
                        <div className="space-y-4 mb-6">
                            {instituciones.map((institucion, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-md border border-gray-200 relative">
                                    <button
                                        onClick={() => handleEliminarInstitucion(index)}
                                        className="cursor-pointer absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-sm border border-red-100"
                                        title="Eliminar institución"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="space-y-3 mt-2">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Nombre</label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={institucion.nombre || ""}
                                                onChange={(e) => handleInstitucionChange(index, e)}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Cargo</label>
                                            <input
                                                type="text"
                                                name="cargo"
                                                value={institucion.cargo || ""}
                                                onChange={(e) => handleInstitucionChange(index, e)}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Teléfono</label>
                                            <input
                                                type="tel"
                                                name="telefono"
                                                value={institucion.telefono || ""}
                                                onChange={(e) => handleInstitucionChange(index, e)}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Dirección</label>
                                            <input
                                                type="text"
                                                name="direccion"
                                                value={institucion.direccion || ""}
                                                onChange={(e) => handleInstitucionChange(index, e)}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-6 rounded-md text-gray-500 italic flex items-center justify-center h-32 mb-4">
                            <div className="text-center">
                                <Briefcase size={24} className="mx-auto mb-2 text-gray-400" />
                                No hay instituciones registradas
                            </div>
                        </div>
                    )}

                    {/* Formulario para agregar nueva institución */}
                    {agregarInstitucion ? (
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
                            <h3 className="font-semibold text-blue-800 mb-3">Nueva institución</h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Nombre <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={nuevaInstitucion.nombre}
                                        onChange={handleNuevaInstitucionChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                        placeholder="Nombre de la institución"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Cargo</label>
                                    <input
                                        type="text"
                                        name="cargo"
                                        value={nuevaInstitucion.cargo}
                                        onChange={handleNuevaInstitucionChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                        placeholder="Cargo que desempeña"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Teléfono</label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={nuevaInstitucion.telefono}
                                        onChange={handleNuevaInstitucionChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                        placeholder="Teléfono de contacto"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Dirección</label>
                                    <input
                                        type="text"
                                        name="direccion"
                                        value={nuevaInstitucion.direccion}
                                        onChange={handleNuevaInstitucionChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                        placeholder="Dirección de la institución"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 justify-end">
                                <button
                                    onClick={() => setAgregarInstitucion(false)}
                                    className="cursor-pointer px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAgregarInstitucion}
                                    className="cursor-pointer px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                                >
                                    Guardar institución
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setAgregarInstitucion(true)}
                            className="cursor-pointer w-full py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                            <Plus size={18} />
                            Agregar nueva institución
                        </button>
                    )}
                </div>
            )}
        </motion.div>
    );
}