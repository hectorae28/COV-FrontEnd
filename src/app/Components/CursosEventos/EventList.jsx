"use client";

import { useState } from "react";
import { FiCalendar, FiClock, FiFileText, FiMapPin, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { InlineEditForm } from "./InlineEditForm";

export default function EventList({
    filteredData,
    searchTerm,
    setSearchTerm,
    tabIndex,
    editingId,
    handleSelect,
    handleDelete,
    handleFormBuilder,
    handleCancel,
    handleAdd,
    formValues,
    setFormValues,
    handleSave,
    isCreating,
    TabList,
    Tab
}) {
    const [dateFilter, setDateFilter] = useState("");
    const [itemToDelete, setItemToDelete] = useState(null);

    // Función para iniciar proceso de eliminación
    const confirmDelete = (e, id, type) => {
        e.stopPropagation();
        setItemToDelete({ id, type });
    };

    // Función para ejecutar la eliminación
    const executeDelete = () => {
        if (itemToDelete) {
            handleDelete(itemToDelete.id, itemToDelete.type);
            setItemToDelete(null);
        }
    };

    // Función para cancelar eliminación
    const cancelDelete = () => {
        setItemToDelete(null);
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-md">
            {/* Modal de confirmación para eliminación */}
            {itemToDelete && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Confirmar eliminación</h3>
                        <p className="text-gray-600 mb-5">
                            ¿Estás seguro de que deseas eliminar este {itemToDelete.type}? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={cancelDelete}
                                className="cursor-pointer px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={executeDelete}
                                className="cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <TabList className="flex space-x-2 mb-4 p-1 rounded-lg bg-gray-100">
                <Tab className={({ selected }) =>
                    `cursor-pointer px-4 py-2 rounded-md transition-all duration-200 flex-1 text-center font-medium ${selected
                        ? "bg-gradient-to-r from-[#C40180] to-[#590248] text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-200"
                    }`
                }>
                    Eventos
                </Tab>
                <Tab className={({ selected }) =>
                    `cursor-pointer px-4 py-2 rounded-md transition-all duration-200 flex-1 text-center font-medium ${selected
                        ? "bg-gradient-to-r from-[#C40180] to-[#590248] text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-200"
                    }`
                }>
                    Cursos
                </Tab>
            </TabList>

            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-3">
                <div className="relative flex-1 w-full">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={`Buscar ${tabIndex === 0 ? "en Eventos" : "en Cursos"}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#C40180] focus:border-[#C40180] outline-none"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-initial">
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#C40180] focus:border-[#C40180] outline-none"
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        className="cursor-pointer whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-4 py-2 rounded-lg hover:from-[#a80166] hover:to-[#470137] transition-all"
                    >
                        <FiPlus /> Nuevo {tabIndex === 0 ? "Evento" : "Curso"}
                    </button>
                </div>
            </div>

            {filteredData.length === 0 && !isCreating ? (
                <div className="text-center py-10 text-gray-500">
                    {searchTerm ?
                        `No se encontraron ${tabIndex === 0 ? "eventos" : "cursos"} que coincidan con "${searchTerm}"` :
                        `No hay ${tabIndex === 0 ? "eventos" : "cursos"} disponibles`
                    }
                </div>
            ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {isCreating && (
                        <div className="border rounded-lg border-[#C40180] bg-[#C40180]/5 p-4">
                            <InlineEditForm
                                formValues={formValues}
                                setFormValues={setFormValues}
                                handleSave={handleSave}
                                handleCancel={handleCancel}
                                isNew={true}
                            />
                        </div>
                    )}

                    {filteredData.map((item) => (
                        <div
                            key={item.id}
                            className={`border rounded-lg transition-all duration-200 hover:shadow-md ${editingId === item.id ? 'border-[#C40180] bg-[#C40180]/5' : 'border-gray-200'}`}
                        >
                            {editingId === item.id ? (
                                <div className="p-4">
                                    <InlineEditForm
                                        formValues={formValues}
                                        setFormValues={setFormValues}
                                        handleSave={handleSave}
                                        handleCancel={handleCancel}
                                        isNew={false}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center p-3">
                                    <div
                                        className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 mr-4 bg-gray-100"
                                        onClick={() => handleSelect(item)}
                                    >
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.title || item.nombre || "Imagen"}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#C40180] to-[#590248] text-white text-xs">
                                                Sin imagen
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className="flex-1"
                                        onClick={() => handleSelect(item)}
                                    >
                                        <h3 className="font-medium text-gray-800 line-clamp-1">{item.title || item.nombre || "Sin título"}</h3>
                                        <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1">
                                            <div className="flex items-center mr-4">
                                                <FiCalendar className="mr-1 text-[#C40180]" size={14} />
                                                <span>{item.date || item.fecha || "Fecha no definida"}</span>
                                            </div>
                                            {(item.hora_inicio) && (
                                                <div className="flex items-center mr-4">
                                                    <FiClock className="mr-1 text-[#C40180]" size={14} />
                                                    <span>{item.hora_inicio}</span>
                                                </div>
                                            )}
                                            {(item.location || item.lugar) && (
                                                <div className="flex items-center">
                                                    <FiMapPin className="mr-1 text-[#C40180]" size={14} />
                                                    <span className="line-clamp-1">{item.location || item.lugar}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFormBuilder(item);
                                            }}
                                            className="flex flex-col items-center p-1.5 rounded-md text-[#C40180] hover:bg-[#C40180]/10 transition-colors mr-2 cursor-pointer"
                                            title={item.formulario ? "Editar formulario" : "Crear formulario"}
                                        >
                                            <FiFileText size={18} />
                                            <span className="text-xs mt-1">Formulario</span>
                                        </div>

                                        <div
                                            onClick={(e) => confirmDelete(e, item.id, tabIndex === 0 ? "evento" : "curso")}
                                            className="flex flex-col items-center p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                            title="Eliminar"
                                        >
                                            <FiTrash2 size={18} />
                                            <span className="text-xs mt-1">Eliminar</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}