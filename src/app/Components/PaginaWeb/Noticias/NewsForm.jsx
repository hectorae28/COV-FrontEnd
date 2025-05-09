"use client"
import { FileImage, Loader2, Save, X } from "lucide-react"
import { useState } from "react"
import BasicEditor from "./ContentEditor"

const NewsForm = ({ formData, setFormData, onSave, onCancel, isSaving }) => {
    const [activeTab, setActiveTab] = useState("general")

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleImageUpload = () => {
        // En un entorno real, aquí se implementaría la lógica de subida de archivo
        // Por ahora, simularemos con un prompt
        const imageUrl = prompt("Ingrese la URL de la imagen:", "https://via.placeholder.com/800x400")
        if (imageUrl) {
            setFormData((prev) => ({
                ...prev,
                imageUrl,
            }))
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("general")}
                        className={`pb-4 px-1 ${activeTab === "general"
                                ? "border-b-2 border-[#C40180] text-[#C40180] font-medium"
                                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        Información General
                    </button>
                    <button
                        onClick={() => setActiveTab("content")}
                        className={`pb-4 px-1 ${activeTab === "content"
                                ? "border-b-2 border-[#C40180] text-[#C40180] font-medium"
                                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        Contenido Completo
                    </button>
                </nav>
            </div>

            {/* Pestaña de información general */}
            {activeTab === "general" && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título de la noticia *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Escribe el título de la noticia"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                            <input
                                type="text"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                placeholder="15 de Octubre, 2023"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                            <input
                                type="text"
                                name="time"
                                value={formData.time}
                                onChange={handleInputChange}
                                placeholder="09:30 AM"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180] appearance-none"
                        >
                            <option value="Actualización">Actualización</option>
                            <option value="Podcast">Podcast</option>
                            <option value="Revista">Revista</option>
                            <option value="Conferencias">Conferencias</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Imagen de portada</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleInputChange}
                                placeholder="https://ejemplo.com/imagen.jpg"
                                className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                            />
                            <button
                                onClick={handleImageUpload}
                                type="button"
                                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 border border-l-0 border-gray-300 rounded-r-md flex items-center"
                            >
                                <FileImage size={18} className="mr-2" />
                                <span className="text-sm">Galería</span>
                            </button>
                        </div>

                        {formData.imageUrl && (
                            <div className="mt-2 relative">
                                <img
                                    src={formData.imageUrl || "/placeholder.svg"}
                                    alt="Vista previa"
                                    className="w-full h-40 object-cover rounded-md border border-gray-200"
                                />
                                <button
                                    onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                                    className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
                                    title="Eliminar imagen"
                                >
                                    <X size={16} className="text-red-500" />
                                </button>
                            </div>
                        )}

                        <p className="text-xs text-gray-500 mt-1">Tamaño recomendado: 800x400px. Formatos: JPG, PNG, WebP</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción corta *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Escribe una breve descripción de la noticia"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180] min-h-[100px]"
                            required
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-1">Máximo 200 caracteres</p>
                    </div>
                </div>
            )}

            {/* Pestaña de contenido completo */}
            {activeTab === "content" && (
                <div>
                    <div className="mb-2 flex gap-2 items-center">
                        <label className="text-sm font-medium text-gray-700">Contenido completo de la noticia *</label>
                        <div className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Usa el editor básico para insertar contenido. Para dar formato al texto, selecciónalo y usa las opciones del navegador.
                        </div>
                    </div>
                    
                    <BasicEditor
                        content={formData.fullContent}
                        setContent={(content) => setFormData((prev) => ({ ...prev, fullContent: content }))}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Puedes dar formato al texto seleccionándolo y usando las herramientas del navegador (negrita, cursiva, etc.)
                    </p>
                </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end mt-8 space-x-3">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-md flex items-center shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5 mr-2" />
                            Guardar
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default NewsForm