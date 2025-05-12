"use client"
import { Calendar, Clock, YoutubeIcon } from "lucide-react"

const CardPreview = ({ news }) => {
    // Verificar si la imageUrl es una URL de video (YouTube, Vimeo, etc.)
    const isVideo = news.imageUrl && (
        news.imageUrl.includes('youtube.com') ||
        news.imageUrl.includes('youtu.be') ||
        news.imageUrl.includes('vimeo.com')
    )

    // Extraer el ID de video de YouTube 
    const getYoutubeVideoId = (url) => {
        if (!url) return null

        const youtubeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(youtubeRegex)

        return (match && match[2].length === 11) ? match[2] : url
    }

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 h-full flex flex-col">
            <div className="relative overflow-hidden">
                {isVideo ? (
                    <div className="h-48 relative bg-gray-900">
                        <iframe
                            src={`https://www.youtube.com/embed/${getYoutubeVideoId(news.imageUrl)}`}
                            className="w-full h-full"
                            frameBorder="0"
                            allowFullScreen
                        ></iframe>
                        <div className="absolute top-4 left-4 bg-red-600/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-2 text-xs text-white">
                            <YoutubeIcon className="w-3 h-3" />
                            <span>Video</span>
                        </div>
                    </div>
                ) : (
                    <>
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
                    </>
                )}
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
                    <div className="flex items-center text-sm font-medium text-[#C40180] group">
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                            {news.category || "Categoría"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardPreview