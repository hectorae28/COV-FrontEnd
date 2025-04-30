"use client";
import { motion } from "framer-motion";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const RelatedNewsCard = ({ news, index }) => {
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer"
            onClick={() => {
                router.push(`/Noticias/${news.id}`);
                // Hacer scroll al inicio
                window.scrollTo(0, 0);
            }}
        >
            <div className="relative overflow-hidden">
                <img
                    src={`${process.env.NEXT_PUBLIC_BACK_HOST}${news.imagen_portada_url || news.imageUrl}`}
                    alt={news.title || news.titulo}
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                        e.target.src = "/assets/placeholder-image.jpg";
                    }}
                />
                <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center text-xs">
                    <Calendar className="w-3 h-3 text-[#C40180] mr-1" />
                    <span>
                        {news.created_at
                            ? new Date(news.created_at).toLocaleDateString()
                            : news.date}
                    </span>
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {news.title || news.titulo}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 flex-grow">
                    {news.description || news.contenido}
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>
                            {news.created_at
                                ? new Date(news.created_at).toLocaleTimeString()
                                : news.time}
                        </span>
                    </div>
                    <span className="text-sm font-medium text-[#C40180] flex items-center">
                        Leer más
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

const RelatedNews = ({ currentNews, maxItems = 3 }) => {
    // Si no hay noticias relacionadas o currentNews es null, no mostrar nada
    if (!currentNews || !Array.isArray(currentNews) || currentNews.length === 0) {
        return null;
    }

    return (
        <section className="bg-[#F9F9F9] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-2xl font-bold text-gray-800 mb-8 text-center"
                >
                    Noticias relacionadas
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {currentNews.slice(0, maxItems).map((news, index) => (
                        <RelatedNewsCard key={news.id} news={news} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RelatedNews;