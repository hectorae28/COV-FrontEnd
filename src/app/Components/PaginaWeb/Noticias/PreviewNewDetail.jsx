"use client"
import { Calendar, Clock, Tag } from "lucide-react"

const NewsDetailPreview = ({ news }) => {
    // Si el contenido está en HTML desde el editor de texto enriquecido
    const isHtmlContent = news.fullContent && news.fullContent.includes("</")

    // Para contenido en formato texto plano
    const firstParagraph = !isHtmlContent ? (news.fullContent || news.description)?.split("\n\n")[0] || "" : ""
    const remainingContent = !isHtmlContent
        ? (news.fullContent || news.description)?.split("\n\n").slice(1).join("\n\n") || ""
        : ""

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
            {/* Categoría */}
            <div className="p-4 flex justify-end">
                <div className="flex items-center bg-[#C40180] px-3 py-1 rounded-full">
                    <Tag className="w-3 h-3 mr-1 text-white" />
                    <span className="text-xs font-medium text-white">{news.category || "Categoría"}</span>
                </div>
            </div>

            {/* Imagen */}
            <div className="relative h-[200px] overflow-hidden">
                <img
                    src={news.imageUrl || "/assets/placeholder-image.jpg"}
                    alt={news.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = "/assets/placeholder-image.jpg"
                    }}
                />
            </div>

            {/* Contenido */}
            <div className="p-5">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{news.title || "Título de la noticia"}</h1>

                <div className="flex flex-wrap items-center gap-2 text-[#C40180] mb-6 text-xs">
                    <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{news.date || "Fecha"}</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{news.time || "00:00 AM"}</span>
                    </div>
                </div>

                <div className="prose max-w-none">
                    {isHtmlContent ? (
                        // Renderizar contenido HTML
                        <div
                            className="text-gray-700 max-h-[300px] overflow-y-auto"
                            dangerouslySetInnerHTML={{ __html: news.fullContent }}
                        />
                    ) : (
                        // Renderizar contenido en formato texto
                        <>
                            <p className="text-base font-medium text-gray-700 mb-4">
                                {firstParagraph || "Primer párrafo de la noticia..."}
                            </p>

                            {remainingContent && (
                                <div className="text-gray-700 text-sm max-h-[250px] overflow-y-auto">
                                    {remainingContent.split("\n\n").map((paragraph, i) => (
                                        <p key={i} className="mb-2">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NewsDetailPreview
