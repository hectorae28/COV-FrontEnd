"use client"
import { Heading1, ImageIcon, ListIcon, MessageCircle, MessageSquareQuote, Type, YoutubeIcon } from "lucide-react"

const ElementPreview = ({ element }) => {
    // Obtener estilos para la vista previa
    const getPreviewStyle = () => {
        return {
            backgroundColor: element.backgroundColor || 'transparent',
            color: element.textColor || 'inherit',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            textAlign: element.align || 'left'
        };
    };

    // Renderizar vista previa según el tipo de elemento
    switch (element.type) {
        case "paragraph":
            return (
                <div className="min-h-[40px]" style={getPreviewStyle()}>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                        <Type size={12} className="mr-1" />
                        <span>Párrafo</span>
                    </div>
                    <p className="text-xs line-clamp-3">{element.content}</p>
                </div>
            )

        case "heading":
            return (
                <div className="min-h-[40px]" style={getPreviewStyle()}>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                        <Heading1 size={12} className="mr-1" />
                        <span>Título {element.headingLevel || 2}</span>
                    </div>
                    <div
                        className={`font-bold line-clamp-2 ${element.headingLevel === 1 ? "text-base" : element.headingLevel === 2 ? "text-sm" : "text-xs"
                            }`}
                    >
                        {element.content}
                    </div>
                </div>
            )

        case "image":
            return (
                <div className="min-h-[40px]" style={getPreviewStyle()}>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                        <ImageIcon size={12} className="mr-1" />
                        <span>Imagen</span>
                    </div>
                    {element.content ? (
                        <div className="h-16 bg-gray-100 rounded overflow-hidden">
                            <img
                                src={element.content || "/placeholder.svg"}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "/assets/placeholder-image.jpg"
                                }}
                            />
                        </div>
                    ) : (
                        <div className="h-16 bg-gray-100 rounded flex items-center justify-center">
                            <ImageIcon size={20} className="text-gray-400" />
                        </div>
                    )}
                </div>
            )

        case "video":
            return (
                <div className="min-h-[40px]" style={getPreviewStyle()}>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                        <YoutubeIcon size={12} className="mr-1" />
                        <span>Video</span>
                    </div>
                    <div className="h-16 bg-gray-800 rounded flex items-center justify-center">
                        <YoutubeIcon size={20} className="text-red-500" />
                    </div>
                </div>
            )

        case "list":
            return (
                <div className="min-h-[40px]" style={getPreviewStyle()}>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                        <ListIcon size={12} className="mr-1" />
                        <span>Lista {element.listType === "ordered" ? "numerada" : "con viñetas"}</span>
                    </div>
                    {element.items && element.items.length > 0 ? (
                        element.listType === "ordered" ? (
                            <ol className="text-xs pl-4 list-decimal line-clamp-3">
                                {element.items.slice(0, 3).map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                                {element.items.length > 3 && <li>...</li>}
                            </ol>
                        ) : (
                            <ul className="text-xs pl-4 list-disc line-clamp-3">
                                {element.items.slice(0, 3).map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                                {element.items.length > 3 && <li>...</li>}
                            </ul>
                        )
                    ) : (
                        <p className="text-xs text-gray-400">Lista vacía</p>
                    )}
                </div>
            )

        case "quote":
            return (
                <div className="min-h-[40px]" style={getPreviewStyle()}>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                        <MessageSquareQuote size={12} className="mr-1" />
                        <span>Cita</span>
                    </div>
                    <div className="border-l-2 border-gray-300 pl-2">
                        <p className="text-xs italic line-clamp-2">{element.content}</p>
                        {element.author && <p className="text-xs text-gray-500 mt-1">— {element.author}</p>}
                    </div>
                </div>
            )

        case "comment":
            return (
                <div className="min-h-[40px]" style={getPreviewStyle()}>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                        <MessageCircle size={12} className="mr-1" />
                        <span>Comentario</span>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                        <p className="text-xs line-clamp-2">{element.content}</p>
                    </div>
                </div>
            )

        default:
            return (
                <div className="min-h-[40px] flex items-center justify-center" style={getPreviewStyle()}>
                    <p className="text-xs text-gray-500">Elemento desconocido</p>
                </div>
            )
    }
}

export default ElementPreview
