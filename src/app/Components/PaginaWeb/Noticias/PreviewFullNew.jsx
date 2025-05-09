"use client"
import { motion } from "framer-motion"
import { Calendar, Clock, Tag, X } from "lucide-react"

const FullNewsPreview = ({ news, onClose }) => {
    // Si el contenido está en HTML desde el editor de texto enriquecido
    const isHtmlContent = news.fullContent && news.fullContent.includes("</")

    // Para contenido en formato texto plano
    const firstParagraph = !isHtmlContent ? (news.fullContent || news.description)?.split("\n\n")[0] || "" : ""
    const remainingContent = !isHtmlContent
        ? (news.fullContent || news.description)?.split("\n\n").slice(1).join("\n\n") || ""
        : ""

    return (
        <div className="fixed inset-0 bg-black/60 z-50 overflow-y-auto py-10">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-2xl overflow-hidden">
                {/* Botón de cerrar */}
                <div className="absolute top-4 right-4">
                    <button onClick={onClose} className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5 text-gray-700" />
                    </button>
                </div>

                <div className="p-8">
                    <div className="flex gap-8">
                        {/* Contenido principal */}
                        <div className="flex-1">
                            {/* Categoría */}
                            <motion.div className="mb-4 flex justify-end">
                                <div className="flex items-center bg-[#C40180] px-4 py-2 rounded-full shadow-md">
                                    <Tag className="w-4 h-4 mr-2 text-white" />
                                    <span className="text-sm font-medium text-white">{news.category || "Categoría"}</span>
                                </div>
                            </motion.div>

                            {/* Imagen */}
                            <motion.div className="relative h-[300px] rounded-2xl overflow-hidden shadow-xl mb-8">
                                <img
                                    src={news.imageUrl || "/assets/placeholder-image.jpg"}
                                    alt={news.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "/assets/placeholder-image.jpg"
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            </motion.div>

                            {/* Título y meta */}
                            <motion.div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                                    {news.title || "Título de la noticia"}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 text-[#C40180] mb-8 justify-center">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{news.date || "Fecha"}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{news.time || "00:00 AM"}</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Contenido */}
                            <motion.div className="bg-white rounded-2xl shadow-lg p-8">
                                {isHtmlContent ? (
                                    // Renderizar contenido HTML
                                    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: news.fullContent }} />
                                ) : (
                                    // Renderizar contenido en formato texto
                                    <div className="prose prose-lg max-w-none">
                                        <p className="text-xl text-gray-700 leading-relaxed font-medium">
                                            {firstParagraph || "Primer párrafo de la noticia..."}
                                        </p>

                                        {remainingContent && (
                                            <div className="prose prose-lg max-w-none">
                                                {remainingContent.split("\n\n").map((paragraph, i) => (
                                                    <p key={i} className="text-gray-700 leading-relaxed my-4">
                                                        {paragraph}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FullNewsPreview
