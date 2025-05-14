"use client"

import { Trash2 } from "lucide-react"

const ContentElementItem = ({
    element,
    activeElement,
    setActiveElement,
    removeContentElement,
}) => {
    // Obtener el título del elemento según su tipo
    const getElementTypeText = (type) => {
        switch (type) {
            case "paragraph": return "Párrafo"
            case "heading1": return "Título"
            case "heading2": return "Subtítulo"
            case "heading3": return "Comentario"
            case "image": return "Imagen"
            case "video": return "Video"
            case "quote": return "Cita"
            case "list": return "Lista"
            case "orderedList": return "Lista Numerada"
            default: return type
        }
    }

    return (
        <div
            className={`p-2 rounded border cursor-pointer transition-colors ${activeElement === element.id
                ? "border-[#C40180] bg-[#C40180]/5"
                : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
            style={{
                width: element.style?.width || "100%",
                maxWidth: "100%"
            }}
            onClick={() => setActiveElement(element.id)}
        >
            <div className="flex justify-between items-center">
                <span className="flex items-center">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">{getElementTypeText(element.type)}</span>
                    {element.style?.width && (
                        <span className="ml-1 text-xs bg-blue-50 px-1.5 py-0.5 rounded text-blue-700">{element.style.width}</span>
                    )}
                </span>
                <div className="flex">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            removeContentElement(element.id)
                        }}
                        className="cursor-pointer p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            </div>
            <div className="mt-1 text-xs text-gray-500 truncate">
                {element.type === "image" || element.type === "video"
                    ? (element.content ? element.content.substring(0, 15) + "..." : "Sin contenido")
                    : typeof element.content === "string"
                        ? (element.content.substring(0, 20) + (element.content.length > 20 ? "..." : ""))
                        : Array.isArray(element.content)
                            ? `${element.content.length} elementos`
                            : "Sin contenido"
                }
            </div>
        </div>
    )
}

export default ContentElementItem