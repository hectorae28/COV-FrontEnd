"use client"

import { Film, ImageIcon, PlusCircle, X } from "lucide-react"
import { useEffect, useState } from "react"

const GeneralInfoTab = ({
    editedArticle,
    handleInputChange,
    handleFileChange,
    fileInputRef,
    mediaType,
    setMediaType,
    mediaSource,
    setMediaSource
}) => {
    console.log("RENDERING GeneralInfoTab", editedArticle)

    // Directamente manipular el editedArticle para asegurar que tags existe
    const [localTags, setLocalTags] = useState([])

    useEffect(() => {
        // Inicializar tags locales desde editedArticle
        const articleTags = Array.isArray(editedArticle.tags) ? editedArticle.tags :
            (editedArticle.category ? [editedArticle.category] : [])
        console.log("Setting local tags from editedArticle:", articleTags)
        setLocalTags(articleTags)
    }, [editedArticle.id]) // Solo actualizar cuando cambia el id del artículo

    const triggerFileInput = () => {
        fileInputRef.current.click()
    }

    // Lista de categorías disponibles
    const availableCategories = [
        "Actualización",
        "Podcast",
        "Revista",
        "Conferencias",
        "Investigación",
        "Educación",
        "Eventos",
        "Internacional",
        "Tecnología",
        "Salud"
    ]

    // Estado local para controlar el input de categoría
    const [categoryInput, setCategoryInput] = useState("")

    // Función para añadir una categoría - Implementación directa
    const addCategory = (category) => {
        // Validación de categoría
        if (!category || category.trim() === "" || localTags.includes(category)) {
            console.log("Categoría inválida o duplicada:", category)
            return
        }

        console.log("Añadiendo categoría:", category)

        // Actualizar tags locales
        const updatedTags = [...localTags, category]
        setLocalTags(updatedTags)

        // Actualizar el artículo principal
        console.log("Actualizando tags del artículo:", updatedTags)
        handleInputChange({
            target: {
                name: "tags",
                value: updatedTags
            }
        })

        // Limpiar el input
        setCategoryInput("")
    }

    // Función para eliminar una categoría
    const removeCategory = (category) => {
        console.log("Eliminando categoría:", category)

        // Actualizar tags locales
        const updatedTags = localTags.filter(tag => tag !== category)
        setLocalTags(updatedTags)

        // Actualizar el artículo principal
        handleInputChange({
            target: {
                name: "tags",
                value: updatedTags
            }
        })
    }

    return (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Noticia</label>
                <input
                    type="text"
                    name="title"
                    value={editedArticle.title || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180] transition-colors"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Breve <span className="text-xs text-gray-500">(Generada automáticamente a partir del contenido o personalízala)</span></label>
                <textarea
                    name="description"
                    value={editedArticle.description || ""}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180] transition-colors"
                    placeholder="Se generará automáticamente a partir del contenido..."
                />
            </div>

            {/* Categorías múltiples - Versión completamente revisada */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Etiquetas</label>
                <div className="mb-2">
                    {/* Etiquetas actuales */}
                    <div className="flex flex-wrap gap-2 mb-2 min-h-10 p-2 border border-gray-200 rounded-lg">
                        {localTags.length > 0 ? (
                            localTags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#C40180]/10 text-[#C40180]"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        className="ml-1.5 text-[#C40180] hover:text-[#890158]"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            removeCategory(tag)
                                        }}
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-gray-500 italic">No hay categorías seleccionadas</span>
                        )}
                    </div>
                </div>

                {/* Categorías predefinidas */}
                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Categorías predefinidas:</p>
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        {availableCategories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault()
                                    addCategory(category)
                                }}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${localTags.includes(category)
                                        ? "bg-[#C40180] text-white cursor-not-allowed"
                                        : "bg-white border border-gray-200 text-gray-700 hover:border-[#C40180] hover:text-[#C40180]"
                                    }`}
                                disabled={localTags.includes(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">Portada</label>
                    <div className="flex space-x-2 text-sm">
                        <button
                            type="button"
                            onClick={() => setMediaType("image")}
                            className={`px-3 py-1 rounded-lg flex items-center ${mediaType === "image" ? "bg-[#C40180] text-white" : "bg-gray-100"}`}
                        >
                            <ImageIcon className="w-3 h-3 mr-1" />
                            Imagen
                        </button>
                        <button
                            type="button"
                            onClick={() => setMediaType("video")}
                            className={`px-3 py-1 rounded-lg flex items-center ${mediaType === "video" ? "bg-[#C40180] text-white" : "bg-gray-100"}`}
                        >
                            <Film className="w-3 h-3 mr-1" />
                            Video
                        </button>
                    </div>
                </div>

                {mediaType === "image" && (
                    <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-600">Origen de la imagen</label>
                            <div className="flex space-x-2 text-sm">
                                <button
                                    type="button"
                                    onClick={() => setMediaSource("local")}
                                    className={`px-2 py-1 rounded-lg ${mediaSource === "local" ? "bg-[#C40180] text-white" : "bg-white border border-gray-200"}`}
                                >
                                    Dispositivo
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMediaSource("url")}
                                    className={`px-2 py-1 rounded-lg ${mediaSource === "url" ? "bg-[#C40180] text-white" : "bg-white border border-gray-200"}`}
                                >
                                    URL
                                </button>
                            </div>
                        </div>

                        {mediaSource === "url" ? (
                            <input
                                type="text"
                                name="imageUrl"
                                value={editedArticle.imageUrl || ""}
                                onChange={handleInputChange}
                                placeholder="URL de imagen"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180] transition-colors"
                            />
                        ) : (
                            <div className="flex flex-col items-center">
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                <button
                                    type="button"
                                    onClick={triggerFileInput}
                                    className="w-full px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-200 flex items-center justify-center transition-colors"
                                >
                                    <ImageIcon className="h-5 w-5 mr-2" />
                                    Seleccionar Imagen
                                </button>
                                {editedArticle.imageUrl && (
                                    <div className="mt-3 max-w-full overflow-hidden rounded-lg">
                                        <img
                                            src={editedArticle.imageUrl || "/placeholder.svg"}
                                            alt="Vista previa"
                                            className="max-h-40 object-contain border rounded-lg"
                                        />
                                        <p className="text-xs text-gray-500 mt-1 text-center">
                                            {editedArticle.imageUrl.length > 30
                                                ? editedArticle.imageUrl.substring(0, 30) + "..."
                                                : editedArticle.imageUrl}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {mediaType === "video" && (
                <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-600 mb-1">URL del video</label>
                        <input
                            type="text"
                            name="videoUrl"
                            value={editedArticle.videoUrl || ""}
                            onChange={handleInputChange}
                            placeholder="URL de YouTube, Vimeo u otro servicio de video"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180] transition-colors"
                        />
                    </div>
                    {editedArticle.videoUrl && (
                        <div className="mt-3 border rounded-lg p-2 bg-white">
                            <p className="text-xs text-gray-500 mb-1">Vista previa del video no disponible</p>
                            <div className="flex items-center p-2 bg-gray-100 rounded-lg">
                                <Film className="w-8 h-8 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-600 truncate">{editedArticle.videoUrl}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default GeneralInfoTab