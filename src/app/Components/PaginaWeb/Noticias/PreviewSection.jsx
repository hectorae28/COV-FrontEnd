"use client"
import { useState } from "react"
import { Check, Eye } from "lucide-react"
import NewsCardPreview from "./PreviewNewcard"
import NewsDetailPreview from "./PreviewNewDetail"
import FullNewsPreview from "./PreviewFullNew"

const PreviewSection = ({ news }) => {
    const [previewMode, setPreviewMode] = useState("card") // card o detail
    const [showFullPreview, setShowFullPreview] = useState(false)

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Vista Previa</h2>

            <div className="mb-4">
                <div className="flex gap-2 mb-2">
                    <button
                        onClick={() => setPreviewMode("card")}
                        className={`px-3 py-1 rounded text-xs font-medium ${previewMode === "card" ? "bg-[#C40180] text-white" : "bg-gray-100 text-gray-600"
                            }`}
                    >
                        Vista de tarjeta
                    </button>
                    <button
                        onClick={() => setPreviewMode("detail")}
                        className={`px-3 py-1 rounded text-xs font-medium ${previewMode === "detail" ? "bg-[#C40180] text-white" : "bg-gray-100 text-gray-600"
                            }`}
                    >
                        Vista detallada
                    </button>
                </div>

                <button
                    onClick={() => setShowFullPreview(true)}
                    className="w-full flex items-center justify-center text-[#C40180] text-xs font-medium py-1.5 bg-[#FCE7F3] rounded mb-3 hover:bg-[#FBCFE8] transition-colors"
                >
                    <Eye className="w-3 h-3 mr-1" />
                    Vista previa en pantalla completa
                </button>
            </div>

            {/* Vista previa de la tarjeta o detalle según el modo seleccionado */}
            {previewMode === "card" ? <NewsCardPreview news={news} /> : <NewsDetailPreview news={news} />}

            {/* Tips útiles */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 mt-6">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">Consejos para crear contenido</h3>
                <ul className="text-xs text-blue-700 space-y-2">
                    <li className="flex items-start">
                        <Check className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                        <span>Utiliza títulos cortos y descriptivos que capturen la atención.</span>
                    </li>
                    <li className="flex items-start">
                        <Check className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                        <span>La descripción debe resumir el contenido principal de manera concisa.</span>
                    </li>
                    <li className="flex items-start">
                        <Check className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                        <span>Usa imágenes de alta calidad relacionadas con el contenido.</span>
                    </li>
                    <li className="flex items-start">
                        <Check className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                        <span>Estructura el contenido en párrafos cortos para facilitar la lectura.</span>
                    </li>
                </ul>
            </div>

            {/* Vista previa en pantalla completa */}
            {showFullPreview && <FullNewsPreview news={news} onClose={() => setShowFullPreview(false)} />}
        </div>
    )
}

export default PreviewSection
