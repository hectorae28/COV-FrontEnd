"use client";
import newsItems from "@/app/Models/PanelControl/PaginaWeb/Inicio/NoticiasData";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Copy,
    Eye,
    Sparkles,
    Tag,
    User
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NoticiaDetalle = () => {
    const router = useRouter();
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedNews, setRelatedNews] = useState([]);
    const [nextNews, setNextNews] = useState(null);
    const [prevNews, setPrevNews] = useState(null);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [views, setViews] = useState(0);
    const [copied, setCopied] = useState(false);

    // Share handlers
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleWhatsAppShare = () => {
        const message = encodeURIComponent(`${news.title} ${window.location.href}`);
        window.open(`https://wa.me/?text=${message}`, '_blank');
    };

    const handleInstagramShare = () => {
        handleCopyLink();
    };

    useEffect(() => {
        if (id) {
            const newsId = parseInt(id);
            const allNews = [...newsItems];
            const newsIndex = allNews.findIndex((item) => item.id === newsId);

            if (newsIndex !== -1) {
                const currentNews = allNews[newsIndex];
                setNews(currentNews);
                setViews(Math.floor(Math.random() * 1000) + 100);
                setLikes(Math.floor(Math.random() * 50) + 5);

                // Cambiado: Mostrar siempre las primeras 4 noticias relacionadas, sin filtrar por categoría
                const related = allNews
                    .filter((item) => item.id !== newsId)
                    .slice(0, 4);

                setRelatedNews(related);

                if (newsIndex > 0) {
                    setPrevNews(allNews[newsIndex - 1]);
                }

                if (newsIndex < allNews.length - 1) {
                    setNextNews(allNews[newsIndex + 1]);
                }
            }
        }

        setLoading(false);
    }, [id]);

    const handleNoticias = (news) => {
        router.push(`/Noticias`);
    };

    const handleGoBack = () => {
        router.back();
    };

    const handleLike = () => {
        if (!liked) {
            setLikes(likes + 1);
            setLiked(true);
        }
    };

    const handleNavigateTo = (newsId) => {
        router.push(`/NoticiaDetalle/${newsId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 pt-28">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-8 border-gray-200"></div>
                    <div className="absolute inset-0 w-24 h-24 rounded-full border-8 border-t-[#C40180] animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[#C40180] animate-pulse" />
                </div>
            </div>
        );
    }

    if (!news) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 pt-28">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md text-center p-8 bg-white rounded-3xl shadow-xl"
                >
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Noticia no encontrada
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Lo sentimos, la noticia que estás buscando no existe o ha sido eliminada.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleGoBack}
                        className="px-6 py-3 bg-gradient-to-r from-[#C40180] to-[#8E0352] text-white rounded-xl hover:shadow-lg transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 inline-block" />
                        Volver
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    const firstParagraph = (news.fullContent || news.description)?.split('\n\n')[0] || '';
    const remainingContent = (news.fullContent || news.description)?.split('\n\n').slice(1).join('\n\n') || '';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Left Sidebar - Fixed */}
                    <div className="w-1/3">
                        <div className="sticky top-32 space-y-6">
                            {/* Back Button */}
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={handleNoticias}
                                className="flex items-center text-gray-700 hover:text-[#C40180] transition-colors group mb-8"
                            >
                                <ArrowLeft className="cursor-pointer w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                                <span>Volver a las noticias</span>
                            </motion.button>

                            {/* Other News - Siempre visible */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl shadow-lg p-4"
                            >
                                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <Sparkles className="w-5 h-5 mr-2 text-[#C40180]" />
                                    Otras Noticias
                                </h3>
                                <div className="space-y-4">
                                    {relatedNews.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                            whileHover={{ scale: 1.02 }}
                                            className="cursor-pointer group"
                                            onClick={() => handleNavigateTo(item.id)}
                                        >
                                            <div className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all">
                                                <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden">
                                                    <img
                                                        src={process.env.NEXT_PUBLIC_BACK_HOST ?
                                                            `${process.env.NEXT_PUBLIC_BACK_HOST}${item.imagen_portada_url || item.imageUrl}` :
                                                            item.imageUrl}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <h4 className="font-medium text-gray-800 line-clamp-2 group-hover:text-[#C40180] transition-colors">
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 mt-2">{item.date}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Share Buttons - Siempre visible */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl shadow-lg p-4"
                            >
                                <h3 className="text-lg text-center font-semibold text-gray-800 mb-4">Compartir</h3>
                                <div className="flex justify-around items-center">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="flex flex-col items-center"
                                    >
                                        <button
                                            onClick={handleWhatsAppShare}
                                            className="flex flex-col mb-2 items-center justify-center w-14 h-14 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                            title="Compartir en WhatsApp"
                                        >
                                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                        </button>

                                        <span className="text-xs mt-1">WhatsApp</span>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="flex flex-col items-center"
                                    >
                                        <button
                                            onClick={handleInstagramShare}
                                            className="flex flex-col mb-2 items-center justify-center w-14 h-14 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors"
                                            title="Compartir en Instagram"
                                        >
                                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                            </svg>
                                        </button>
                                        <span className="text-xs mt-1">Instagram</span>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="flex flex-col items-center"
                                    >
                                        <button
                                            onClick={handleCopyLink}
                                            className="flex flex-col mb-2 items-center justify-center w-14 h-14 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                            title="Copiar enlace"
                                        >
                                            {copied ? (
                                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            ) : (
                                                <Copy className="w-6 h-6" />
                                            )}
                                        </button>
                                        <span className="text-xs mt-1">Copiar enlace</span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Column - Main Content */}
                    <div className="flex-1">
                        {/* Category Badges - Ahora encima de la imagen alineadas a la derecha */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-4"
                        >
                            <div className="flex flex-wrap gap-2 justify-end">
                                {/* Maneja múltiples categorías si es un array */}
                                {Array.isArray(news.category) ? (
                                    news.category.map((category, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center bg-[#C40180] px-4 py-2 rounded-full shadow-md"
                                        >
                                            <Tag className="w-4 h-4 mr-2 text-white" />
                                            <span className="text-sm font-medium text-white">{category}</span>
                                        </div>
                                    ))
                                ) : (
                                    // Para una única categoría
                                    <div className="flex items-center bg-[#C40180] px-4 py-2 rounded-full shadow-md">
                                        <Tag className="w-4 h-4 mr-2 text-white" />
                                        <span className="text-sm font-medium text-white">{news.category}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Featured Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative h-[50vh] rounded-2xl overflow-hidden shadow-xl mb-8"
                        >
                            <img
                                src={process.env.NEXT_PUBLIC_BACK_HOST ?
                                    `${process.env.NEXT_PUBLIC_BACK_HOST}${news.imagen_portada_url || news.imageUrl}` :
                                    news.imageUrl}
                                alt={news.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "/assets/placeholder-image.jpg";
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </motion.div>

                        {/* Article Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mb-8"
                        >
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
                                {news.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-[#C40180] mb-8 justify-center">
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{news.date}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{news.time}</span>
                                </div>
                                {news.author && (
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{news.author}</span>
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <Eye className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{views} lecturas</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Article Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-lg p-8"
                        >
                            <div className="prose prose-lg max-w-none mb-8">
                                <p className="text-xl text-gray-700 leading-relaxed font-medium">
                                    {firstParagraph}
                                </p>
                            </div>

                            {remainingContent && (
                                <div className="prose prose-lg max-w-none">
                                    {remainingContent.split('\n\n').map((paragraph, i) => (
                                        <p key={i} className="text-gray-700 leading-relaxed my-4">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Navigation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mt-8 flex justify-between items-center"
                        >
                            {prevNews ? (
                                <button
                                    onClick={() => handleNavigateTo(prevNews.id)}
                                    className="flex items-center text-gray-600 hover:text-[#C40180] transition-colors group bg-white px-4 py-2 rounded-xl shadow-md"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                                    <span>Anterior</span>
                                </button>
                            ) : (
                                <div></div>
                            )}

                            {nextNews && (
                                <button
                                    onClick={() => handleNavigateTo(nextNews.id)}
                                    className="flex items-center text-gray-600 hover:text-[#C40180] transition-colors group bg-white px-4 py-2 rounded-xl shadow-md"
                                >
                                    <span>Siguiente</span>
                                    <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticiaDetalle;