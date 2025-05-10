"use client"
import { LayoutGrid, Loader2, Newspaper, Save } from "lucide-react"
import { useState } from "react"

// Importar componentes del editor
import EditorLayout from "./Editor/EditorLayout"
import ImageVideoUploader from "./ImageVideoUploader"

const FormEdit = ({ formData, setFormData, onSave, onCancel, isSaving }) => {
    const [activeTab, setActiveTab] = useState("general")

    // Manejar cambios en los campos de información general
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab("general")}
                            className={`pb-4 px-1 flex items-center ${activeTab === "general"
                                    ? "border-b-2 border-[#C40180] text-[#C40180] font-medium"
                                    : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            <LayoutGrid className="w-4 h-4 mr-2" />
                            Vista de Tarjeta
                        </button>
                        <button
                            onClick={() => setActiveTab("layout")}
                            className={`pb-4 px-1 flex items-center ${activeTab === "layout"
                                    ? "border-b-2 border-[#C40180] text-[#C40180] font-medium"
                                    : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            <Newspaper className="w-4 h-4 mr-2" />
                            Vista Detallada
                        </button>
                    </nav>
                </div>

                {/* Pestaña de información general (Vista de Tarjeta) */}
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180] appearance-none"
                            >
                                <option value="Actualización">Actualización</option>
                                <option value="Podcast">Podcast</option>
                                <option value="Revista">Revista</option>
                                <option value="Conferencias">Conferencias</option>
                                <option value="Educación">Educación</option>
                                <option value="Eventos">Eventos</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen de portada</label>
                            <ImageVideoUploader
                                imageUrl={formData.imageUrl}
                                onImageChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                                previewClassName="h-52"
                                allowVideo={true}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción corta *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Escribe una breve descripción de la noticia"
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180] min-h-[100px]"
                                required
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-1">Máximo 200 caracteres</p>
                        </div>
                    </div>
                )}

                {/* Pestaña de diseño de contenido (Vista Detallada) */}
                {activeTab === "layout" && <EditorLayout formData={formData} setFormData={setFormData} />}

                {/* Botones de acción */}
                <div className="flex justify-end mt-8 space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-xl flex items-center shadow-md hover:shadow-lg transition-all disabled:opacity-70"
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
        </>
    )
}

export default FormEdit
