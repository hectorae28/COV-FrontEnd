"use client"
import { Calendar, Clock } from "lucide-react"

const NewsCardPreview = ({ news }) => {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 h-full flex flex-col">
            <div className="relative overflow-hidden">
                <img
                    src={news.imageUrl || "/assets/placeholder-image.jpg"}
                    alt={news.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                        e.target.src = "/assets/placeholder-image.jpg"
                    }}
                />
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-2 text-xs">
                    <Calendar className="w-3 h-3 text-[#C40180]" />
                    <span>{news.date || "Fecha"}</span>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{news.title || "Título de la noticia"}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {news.description || "Descripción breve de la noticia..."}
                </p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{news.time || "00:00 AM"}</span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-[#C40180] group">Leer más</div>
                </div>
            </div>
        </div>
    )
}

export default NewsCardPreview
