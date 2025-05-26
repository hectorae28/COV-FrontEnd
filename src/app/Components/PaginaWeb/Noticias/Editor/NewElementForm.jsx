"use client"

import { motion } from "framer-motion"
import {
    FileText,
    Film,
    Hash,
    Heading1,
    Heading2,
    Heading3,
    ImageIcon,
    List,
    PlusCircle,
    Quote,
    Type,
    X
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

const NewElementForm = ({ element, onUpdate, onAdd, onCancel }) => {
    const [localContent, setLocalContent] = useState(element?.content || "")
    const [localAlt, setLocalAlt] = useState(element?.alt || "")
    const [localAuthor, setLocalAuthor] = useState(element?.author || "")
    const [localListItems, setLocalListItems] = useState(
        Array.isArray(element?.content) ? element.content : ["", ""]
    )
    const [imageSource, setImageSource] = useState(element?.sourceType || "local")
    const [isValid, setIsValid] = useState(false)

    const fileInputRef = useRef(null)

    // Validación del formulario
    useEffect(() => {
        let valid = false

        switch (element?.type) {
            case "heading1":
            case "heading2":
            case "heading3":
            case "paragraph":
                valid = localContent.trim().length > 0
                break

            case "image":
                if (imageSource === "url") {
                    valid = localContent.trim().length > 0 && isValidUrl(localContent)
                } else {
                    valid = element?.content && element.content.length > 0
                }
                break

            case "video":
                valid = localContent.trim().length > 0 && isValidVideoUrl(localContent)
                break

            case "quote":
                valid = localContent.trim().length > 0
                break

            case "list":
            case "orderedList":
                valid = localListItems.some(item => item.trim().length > 0)
                break

            default:
                valid = false
        }

        setIsValid(valid)
    }, [localContent, localListItems, imageSource, element])

    // Validar URL
    const isValidUrl = (url) => {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    // Validar URL de video (YouTube, Vimeo, etc)
    const isValidVideoUrl = (url) => {
        if (!isValidUrl(url)) return false

        const videoPatterns = [
            /youtube\.com\/watch\?v=/,
            /youtu\.be\//,
            /vimeo\.com\//,
            /dailymotion\.com\/video\//,
            /facebook\.com\/.*\/videos\//
        ]

        return videoPatterns.some(pattern => pattern.test(url))
    }

    // Obtener ícono según el tipo
    const getElementIcon = () => {
        switch (element?.type) {
            case "heading1": return <Heading1 className="w-5 h-5" />
            case "heading2": return <Heading2 className="w-5 h-5" />
            case "heading3": return <Heading3 className="w-5 h-5" />
            case "paragraph": return <FileText className="w-5 h-5" />
            case "image": return <ImageIcon className="w-5 h-5" />
            case "video": return <Film className="w-5 h-5" />
            case "quote": return <Quote className="w-5 h-5" />
            case "list": return <List className="w-5 h-5" />
            case "orderedList": return <Hash className="w-5 h-5" />
            default: return <Type className="w-5 h-5" />
        }
    }

    // Obtener título del elemento
    const getElementTitle = () => {
        switch (element?.type) {
            case "heading1": return "Nuevo Título"
            case "heading2": return "Nuevo Subtítulo"
            case "heading3": return "Nuevo Comentario"
            case "paragraph": return "Nuevo Párrafo"
            case "image": return "Nueva Imagen"
            case "video": return "Nuevo Video"
            case "quote": return "Nueva Cita"
            case "list": return "Nueva Lista"
            case "orderedList": return "Nueva Lista Numerada"
            default: return "Nuevo Elemento"
        }
    }

    // Manejar cambios en el contenido
    const handleContentChange = (value) => {
        setLocalContent(value)

        if (element?.type !== "list" && element?.type !== "orderedList") {
            onUpdate({ content: value })
        }
    }

    // Manejar cambios en elementos de lista
    const handleListItemChange = (index, value) => {
        const newItems = [...localListItems]
        newItems[index] = value
        setLocalListItems(newItems)
        onUpdate({ content: newItems.filter(item => item.trim() !== "") })
    }

    // Añadir elemento a la lista
    const addListItem = () => {
        const newItems = [...localListItems, ""]
        setLocalListItems(newItems)
        onUpdate({ content: newItems })
    }

    // Eliminar elemento de la lista
    const removeListItem = (index) => {
        const newItems = localListItems.filter((_, i) => i !== index)
        setLocalListItems(newItems.length > 0 ? newItems : [""])
        onUpdate({ content: newItems })
    }

    // Manejar selección de archivo
    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        if (file) {
            const imageUrl = URL.createObjectURL(file)
            onUpdate({
                content: imageUrl,
                sourceType: "local",
                file: file
            })
            setLocalContent(imageUrl)
        }
    }

    // Manejar cambio de fuente de imagen
    const handleImageSourceChange = (source) => {
        setImageSource(source)
        onUpdate({ sourceType: source })

        if (source === "url") {
            setLocalContent("")
            onUpdate({ content: "" })
        }
    }

    // Renderizar campos específicos según el tipo
    const renderTypeSpecificFields = () => {
        switch (element?.type) {
            case "heading1":
            case "heading2":
            case "heading3":
            case "paragraph":
                return (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contenido
                        </label>
                        <textarea
                            value={localContent}
                            onChange={(e) => handleContentChange(e.target.value)}
                            rows={element.type.includes("heading") ? 2 : 4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180]"
                            placeholder={`Escribe el ${getElementTitle().toLowerCase()}...`}
                            autoFocus
                        />
                    </div>
                )

            case "image":
                return (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">
                                Origen de la imagen
                            </label>
                            <div className="flex space-x-1">
                                <button
                                    type="button"
                                    onClick={() => handleImageSourceChange("local")}
                                    className={`px-3 py-1 rounded-lg text-sm ${imageSource === "local"
                                            ? "bg-[#C40180] text-white"
                                            : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                >
                                    Dispositivo
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleImageSourceChange("url")}
                                    className={`px-3 py-1 rounded-lg text-sm ${imageSource === "url"
                                            ? "bg-[#C40180] text-white"
                                            : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                >
                                    URL
                                </button>
                            </div>
                        </div>

                        {imageSource === "url" ? (
                            <div>
                                <input
                                    type="text"
                                    value={localContent}
                                    onChange={(e) => handleContentChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180]"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                                {localContent && !isValidUrl(localContent) && (
                                    <p className="text-sm text-red-500 mt-1">URL no válida</p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                                >
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    {element?.content ? "Cambiar Imagen" : "Seleccionar Imagen"}
                                </button>
                                {element?.content && (
                                    <div className="mt-2">
                                        <img
                                            src={element.content}
                                            alt="Vista previa"
                                            className="max-h-32 rounded-lg border"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Texto alternativo (opcional)
                            </label>
                            <input
                                type="text"
                                value={localAlt}
                                onChange={(e) => {
                                    setLocalAlt(e.target.value)
                                    onUpdate({ alt: e.target.value })
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180]"
                                placeholder="Descripción para accesibilidad"
                            />
                        </div>
                    </div>
                )

            case "video":
                return (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                URL del video
                            </label>
                            <input
                                type="text"
                                value={localContent}
                                onChange={(e) => handleContentChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180]"
                                placeholder="https://youtube.com/watch?v=..."
                                autoFocus
                            />
                            {localContent && !isValidVideoUrl(localContent) && (
                                <p className="text-sm text-red-500 mt-1">
                                    URL de video no válida. Soportamos YouTube, Vimeo, etc.
                                </p>
                            )}
                        </div>
                        {localContent && isValidVideoUrl(localContent) && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <Film className="w-4 h-4 text-gray-500 mr-2" />
                                    <span className="text-sm text-gray-600 truncate">{localContent}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )

            case "quote":
                return (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Texto de la cita
                            </label>
                            <textarea
                                value={localContent}
                                onChange={(e) => handleContentChange(e.target.value)}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180]"
                                placeholder="Escribe la cita..."
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Autor (opcional)
                            </label>
                            <input
                                type="text"
                                value={localAuthor}
                                onChange={(e) => {
                                    setLocalAuthor(e.target.value)
                                    onUpdate({ author: e.target.value })
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180]"
                                placeholder="Nombre del autor"
                            />
                        </div>
                    </div>
                )

            case "list":
            case "orderedList":
                return (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Elementos de la lista
                        </label>
                        {localListItems.map((item, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <span className="w-6 text-center text-gray-500 text-sm">
                                    {element.type === "orderedList" ? `${index + 1}.` : "•"}
                                </span>
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleListItemChange(index, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180]"
                                    placeholder="Elemento de lista"
                                    autoFocus={index === 0}
                                />
                                {localListItems.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeListItem(index)}
                                        className="p-2 text-gray-400 hover:text-red-500"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addListItem}
                            className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Añadir elemento
                        </button>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border-2 border-[#C40180] rounded-xl shadow-lg p-6"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <div className="text-[#C40180]">{getElementIcon()}</div>
                    <h3 className="text-lg font-semibold text-gray-800">{getElementTitle()}</h3>
                </div>
                <button
                    onClick={onCancel}
                    className="p-1 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-4">
                {renderTypeSpecificFields()}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        Cancelar
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onAdd}
                        disabled={!isValid}
                        className={`px-4 py-2 rounded-lg flex items-center ${isValid
                                ? "bg-gradient-to-r from-[#C40180] to-[#590248] text-white hover:from-[#e20091] hover:to-[#e20091]"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Añadir Elemento
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

export default NewElementForm