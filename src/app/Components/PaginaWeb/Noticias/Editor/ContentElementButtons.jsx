"use client"

import {
    Film,
    Heading1,
    Heading2,
    Heading3,
    ImageIcon,
    List,
    ListOrdered,
    Quote
} from "lucide-react"

const ContentElementButtons = ({ prepareContentElement }) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-500 w-full mb-2">Añadir nuevo elemento:</span>

            {/* Grupo de Encabezados */}
            <div className="bg-white rounded-lg p-2 border border-gray-200">
                <div className="text-xs text-gray-400 mb-1">Encabezados</div>
                <div className="flex flex-wrap gap-1">
                    <button
                        onClick={() => prepareContentElement("heading1")}
                        className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
                    >
                        <Heading1 className="w-4 h-4 mr-1" />
                        <span>Título</span>
                    </button>
                    <button
                        onClick={() => prepareContentElement("heading2")}
                        className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
                    >
                        <Heading2 className="w-4 h-4 mr-1" />
                        <span>Subtítulo</span>
                    </button>
                    <button
                        onClick={() => prepareContentElement("heading3")}
                        className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
                    >
                        <Heading3 className="w-4 h-4 mr-1" />
                        <span>Comentario</span>
                    </button>
                </div>
            </div>

            {/* Grupo de Contenido */}
            <div className="bg-white rounded-lg p-2 border border-gray-200">
                <div className="text-xs text-gray-400 mb-1">Contenido</div>
                <div className="flex flex-wrap gap-1">
                    <button
                        onClick={() => prepareContentElement("paragraph")}
                        className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
                    >
                        <span>Párrafo</span>
                    </button>
                    <button
                        onClick={() => prepareContentElement("quote")}
                        className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
                    >
                        <Quote className="w-4 h-4 mr-1" />
                        <span>Cita</span>
                    </button>
                </div>
            </div>

            {/* Grupo de Multimedia */}
            <div className="bg-white rounded-lg p-2 border border-gray-200">
                <div className="text-xs text-gray-400 mb-1">Multimedia</div>
                <div className="flex flex-wrap gap-1">
                    <button
                        onClick={() => prepareContentElement("image")}
                        className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
                    >
                        <ImageIcon className="w-4 h-4 mr-1" />
                        <span>Imagen</span>
                    </button>
                    <button
                        onClick={() => prepareContentElement("video")}
                        className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
                    >
                        <Film className="w-4 h-4 mr-1" />
                        <span>Video</span>
                    </button>
                </div>
            </div>

            {/* Grupo de Listas */}
            <div className="bg-white rounded-lg p-2 border border-gray-200">
                <div className="text-xs text-gray-400 mb-1">Listas</div>
                <div className="flex flex-wrap gap-1">
                    <button
                        onClick={() => prepareContentElement("list")}
                        className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
                    >
                        <List className="w-4 h-4 mr-1" />
                        <span>Lista</span>
                    </button>
                    <button
                        onClick={() => prepareContentElement("orderedList")}
                        className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
                    >
                        <ListOrdered className="w-4 h-4 mr-1" />
                        <span>Lista Numerada</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ContentElementButtons