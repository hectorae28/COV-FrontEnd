"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import newsItems from "@/app/Models/Home/NoticiasData";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Share2,
    Eye,
    ThumbsUp,
    BookmarkPlus,
    Bookmark,
    ChevronRight,
    ChevronLeft,
    Tag,
    User,
    Send,
    MessageCircle,
} from "lucide-react";
import ShareButtons from "@/app/components/Home/ShareButtons";
import Comments from "@/app/components/Home/Comments";

const NoticiaDetalle = () => {
    const router = useRouter();
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedNews, setRelatedNews] = useState([]);
    const [nextNews, setNextNews] = useState(null);
    const [prevNews, setPrevNews] = useState(null);
    const [bookmarked, setBookmarked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [views, setViews] = useState(0);
    const [readPercentage, setReadPercentage] = useState(0);
    const contentRef = useRef(null);
    const heroRef = useRef(null);

    // Efecto de parallax para la imagen de cabecera
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

    useEffect(() => {
        // En un proyecto real, aquí harías una llamada a la API
        // para obtener los detalles de la noticia basada en el ID

        // Por ahora, utilizamos los datos de ejemplo
        if (id) {
            const newsId = parseInt(id);
            const allNews = [...newsItems]; // Copia para no modificar el original
            const newsIndex = allNews.findIndex((item) => item.id === newsId);

            if (newsIndex !== -1) {
                const currentNews = allNews[newsIndex];
                setNews(currentNews);

                // Establecer vistas aleatorias para simular estadísticas
                setViews(Math.floor(Math.random() * 1000) + 100);
                setLikes(Math.floor(Math.random() * 50) + 5);

                // Obtener noticias relacionadas de la misma categoría
                const related = allNews
                    .filter(
                        (item) =>
                            item.id !== newsId &&
                            item.category === currentNews.category
                    )
                    .slice(0, 3); // Limitamos a 3 noticias relacionadas

                setRelatedNews(related);

                // Establecer noticias anterior y siguiente
                if (newsIndex > 0) {
                    setPrevNews(allNews[newsIndex - 1]);
                }

                if (newsIndex < allNews.length - 1) {
                    setNextNews(allNews[newsIndex + 1]);
                }
            }
        }

        setLoading(false);

        // Verificar si esta noticia está en los marcadores
        const bookmarks = JSON.parse(localStorage.getItem("newsBookmarks") || "[]");
        if (bookmarks.includes(parseInt(id))) {
            setBookmarked(true);
        }

        // Inicializar un contador para monitorear el progreso de lectura
        const handleScroll = () => {
            if (contentRef.current) {
                const contentHeight = contentRef.current.offsetHeight;
                const scrollPosition = window.scrollY;
                const windowHeight = window.innerHeight;
                const scrollableHeight = contentHeight - windowHeight;

                if (scrollableHeight > 0) {
                    const percentage = Math.min(
                        100,
                        Math.round((scrollPosition / scrollableHeight) * 100)
                    );
                    setReadPercentage(percentage);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [id]);

    const handleGoBack = () => {
        router.back();
    };

    const handleBookmark = () => {
        const newsId = parseInt(id);
        const bookmarks = JSON.parse(localStorage.getItem("newsBookmarks") || "[]");

        if (bookmarked) {
            // Eliminar de marcadores
            const updatedBookmarks = bookmarks.filter((id) => id !== newsId);
            localStorage.setItem("newsBookmarks", JSON.stringify(updatedBookmarks));
            setBookmarked(false);
        } else {
            // Añadir a marcadores
            bookmarks.push(newsId);
            localStorage.setItem("newsBookmarks", JSON.stringify(bookmarks));
            setBookmarked(true);
        }
    };

    const handleLike = () => {
        if (!liked) {
            setLikes(likes + 1);
            setLiked(true);

            // En un proyecto real, aquí enviarías el like al servidor
        }
    };

    const handleNavigateTo = (newsId) => {
        router.push(`/NoticiaDetalle/${newsId}`);
    };

    // Si está cargando, mostramos un indicador de carga estilizado
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#f8f8f8] to-[#f2f2f2]">
                <div className="w-20 h-20 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-[#C40180] animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">Cargando noticia...</p>
            </div>
        );
    }

    // Si no se encuentra la noticia, mostramos un mensaje de error
    if (!news) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-[#f8f8f8] to-[#f2f2f2]">
                <div className="max-w-md text-center p-8 bg-white rounded-xl shadow-xl">
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
                        className="px-6 py-3 bg-gradient-to-r from-[#C40180] to-[#8E0352] text-white rounded-full hover:shadow-lg transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 inline-block" />
                        Volver a noticias
                    </motion.button>
                </div>
            </div>
        );
    }

    // Determinamos si hay contenido para cada sección antes de renderizar
    const hasContent = news?.description?.length > 100;
    const hasExtraContent = news?.fullContent || news?.description?.length > 300;

    // Extraer la primera parte del contenido para destacar
    const firstParagraph = (news.fullContent || news.description)?.split('\n\n')[0] || '';
    const remainingContent = (news.fullContent || news.description)?.split('\n\n').slice(1).join('\n\n') || '';

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Botón de volver y compartir en móvil */}
            <div className="sticky top-0 z-50 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <motion.button
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleGoBack}
                        className="flex items-center text-gray-700 hover:text-[#C40180] transition-colors pt-28"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <span className="hidden sm:inline">Volver a noticias</span>
                    </motion.button>

                    <div className="flex items-center space-x-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="hidden sm:flex items-center space-x-1 text-gray-500 text-sm"
                        >
                            <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#C40180]"
                                    style={{ width: `${readPercentage}%` }}
                                ></div>
                            </div>
                            <span>{readPercentage}% leído</span>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            onClick={handleBookmark}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label={bookmarked ? "Eliminar de guardados" : "Guardar noticia"}
                        >
                            {bookmarked ? (
                                <Bookmark className="w-5 h-5 text-[#C40180]" />
                            ) : (
                                <BookmarkPlus className="w-5 h-5 text-gray-600" />
                            )}
                        </motion.button>

                        <ShareButtons displayMode="dropdown" title={news?.title} />
                    </div>
                </div>
            </div>

            {/* Hero section con parallax */}
            <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden" ref={heroRef}>
                <motion.div
                    className="absolute inset-0 bg-black/40 z-10"
                    style={{ opacity: heroOpacity }}
                ></motion.div>
                <motion.div
                    className="absolute inset-0 h-[120%] w-full"
                    style={{ y: heroY }}
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
                </motion.div>

                <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/50 to-transparent h-1/2"></div>

                <div className="relative z-30 h-full flex flex-col justify-end p-6 sm:p-12">
                    <div className="max-w-5xl mx-auto w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-wrap items-center gap-3 mb-4 text-white/90"
                        >
                            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span className="text-sm">{news.date}</span>
                            </div>
                            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                <Clock className="w-4 h-4 mr-2" />
                                <span className="text-sm">{news.time}</span>
                            </div>
                            <div className="flex items-center bg-[#C40180]/70 px-3 py-1 rounded-full">
                                <Tag className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium">{news.category}</span>
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg"
                        >
                            {news.title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-wrap items-center gap-4 text-white/90"
                        >
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
                            <button
                                onClick={handleLike}
                                className={`flex items-center ${liked ? "text-red-400" : "text-white/90"}`}
                            >
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                <span className="text-sm">{likes} me gusta</span>
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8" ref={contentRef}>
                {/* Layout con contenido principal y sidebar */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Contenido principal */}
                    <div className="lg:w-2/3">
                        {/* Primera sección de contenido destacada */}
                        {hasContent && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mb-8 bg-white rounded-xl shadow-md p-6 md:p-8"
                            >
                                <div className="prose prose-lg max-w-none mb-6">
                                    <p className="text-xl text-gray-700 leading-relaxed font-medium">
                                        {firstParagraph}
                                    </p>
                                </div>

                                {/* Contenido restante */}
                                {remainingContent && (
                                    <div className="prose prose-lg max-w-none">
                                        {remainingContent.split('\n\n').map((paragraph, i) => (
                                            <p key={i} className="text-gray-700 leading-relaxed my-4">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {/* Detalles adicionales específicos según el tipo de noticia */}
                                {news.category === "Conferencias" && news.location && (
                                    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <h3 className="font-semibold text-gray-800 mb-2">Detalles del evento</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                            {news.location && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Ubicación:</span> {news.location}
                                                </div>
                                            )}
                                            {news.dates && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Fechas:</span> {news.dates}
                                                </div>
                                            )}
                                            {news.organizer && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Organizador:</span> {news.organizer}
                                                </div>
                                            )}
                                            {news.contactInfo && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Contacto:</span> {news.contactInfo}
                                                </div>
                                            )}
                                        </div>

                                        {news.registrationLink && (
                                            <a
                                                href={news.registrationLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 inline-block px-4 py-2 bg-[#C40180] text-white rounded-lg hover:bg-[#A00160] transition-colors"
                                            >
                                                Registrarse al evento
                                            </a>
                                        )}
                                    </div>
                                )}

                                {news.category === "Revista" && news.featuredArticles && (
                                    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <h3 className="font-semibold text-gray-800 mb-2">Artículos destacados</h3>
                                        <ul className="list-disc pl-5 space-y-2">
                                            {news.featuredArticles.map((article, index) => (
                                                <li key={index} className="text-gray-700">{article}</li>
                                            ))}
                                        </ul>

                                        {news.accessLink && (
                                            <a
                                                href={news.accessLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 inline-block px-4 py-2 bg-[#C40180] text-white rounded-lg hover:bg-[#A00160] transition-colors"
                                            >
                                                Acceder a la revista
                                            </a>
                                        )}
                                    </div>
                                )}

                                {news.category === "Podcast" && news.episodeNumber && (
                                    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <h3 className="font-semibold text-gray-800 mb-2">Información del podcast</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-700">Episodio:</span> {news.episodeNumber}
                                            </div>
                                            {news.duration && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Duración:</span> {news.duration}
                                                </div>
                                            )}
                                            {news.hostName && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Host:</span> {news.hostName}
                                                </div>
                                            )}
                                        </div>

                                        {news.guests && news.guests.length > 0 && (
                                            <div className="mt-2">
                                                <span className="font-medium text-gray-700">Invitados:</span>
                                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                                    {news.guests.map((guest, index) => (
                                                        <li key={index} className="text-gray-700 text-sm">{guest}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {news.audioLink && (
                                            <div className="mt-4">
                                                <audio
                                                    className="w-full"
                                                    controls
                                                    src={news.audioLink}
                                                >
                                                    Tu navegador no soporta la reproducción de audio
                                                </audio>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Botones de compartir */}
                                <div className="border-t border-gray-200 pt-6 mt-8">
                                    <h3 className="text-sm font-medium text-gray-500 mb-4">
                                        Comparte esta noticia:
                                    </h3>
                                    <ShareButtons title={news?.title} />
                                </div>
                            </motion.div>
                        )}

                        {/* Navegación entre noticias */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mb-8 flex justify-between"
                        >
                            {prevNews ? (
                                <button
                                    onClick={() => handleNavigateTo(prevNews.id)}
                                    className="flex items-center text-gray-700 hover:text-[#C40180] transition-colors group"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-1 group-hover:mr-2 transition-all" />
                                    <span className="text-sm">Noticia anterior</span>
                                </button>
                            ) : (
                                <div></div>
                            )}

                            {nextNews && (
                                <button
                                    onClick={() => handleNavigateTo(nextNews.id)}
                                    className="flex items-center text-gray-700 hover:text-[#C40180] transition-colors group"
                                >
                                    <span className="text-sm">Siguiente noticia</span>
                                    <ChevronRight className="w-5 h-5 ml-1 group-hover:ml-2 transition-all" />
                                </button>
                            )}
                        </motion.div>

                        {/* Sección de comentarios */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mb-8"
                        >
                            <Comments newsId={id} />
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3">
                        {/* Tarjeta de autor si existe */}
                        {news.author && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="mb-6 bg-white rounded-xl shadow-md p-6"
                            >
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Sobre el autor</h3>
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#C40180] to-[#8E0352] flex items-center justify-center text-white text-xl font-bold">
                                        {news.author.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-medium text-gray-800">{news.author}</p>
                                        {news.authorCredentials && (
                                            <p className="text-sm text-gray-600">{news.authorCredentials}</p>
                                        )}
                                    </div>
                                </div>
                                {news.authorBio && (
                                    <p className="text-sm text-gray-600">{news.authorBio}</p>
                                )}
                            </motion.div>
                        )}

                        {/* Noticias relacionadas */}
                        {relatedNews.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mb-6 bg-white rounded-xl shadow-md p-6"
                            >
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Noticias relacionadas</h3>
                                <div className="space-y-4">
                                    {relatedNews.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.4, delay: 0.1 * index }}
                                            className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                            onClick={() => handleNavigateTo(item.id)}
                                        >
                                            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                                                <img
                                                    src={process.env.NEXT_PUBLIC_BACK_HOST ?
                                                        `${process.env.NEXT_PUBLIC_BACK_HOST}${item.imagen_portada_url || item.imageUrl}` :
                                                        item.imageUrl}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "/assets/placeholder-image.jpg";
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="font-medium text-gray-800 line-clamp-2 text-sm">
                                                    {item.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Información adicional específica según el tipo de noticia */}
                        {news.category === "Actualización" && news.sources && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="mb-6 bg-white rounded-xl shadow-md p-6"
                            >
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Fuentes</h3>
                                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                                    {news.sources.map((source, index) => (
                                        <li key={index}>{source}</li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}

                        {/* Llamado a la acción según la categoría */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="bg-gradient-to-r from-[#C40180] to-[#8E0352] rounded-xl shadow-md p-6 text-white"
                        >
                            <h3 className="text-lg font-semibold mb-3">
                                {news.category === "Conferencias"
                                    ? "¡No te pierdas este evento!"
                                    : news.category === "Revista"
                                        ? "Accede a la revista completa"
                                        : news.category === "Podcast"
                                            ? "Escucha nuestros podcasts"
                                            : "Mantente actualizado"}
                            </h3>
                            <p className="text-white/90 mb-4 text-sm">
                                {news.category === "Conferencias"
                                    ? "Regístrate ahora y asegura tu lugar en este importante evento para la comunidad odontológica."
                                    : news.category === "Revista"
                                        ? "Suscríbete a nuestra revista científica y accede a contenido exclusivo para profesionales."
                                        : news.category === "Podcast"
                                            ? "No te pierdas ningún episodio. Suscríbete a nuestro canal de podcast."
                                            : "Recibe las últimas actualizaciones y noticias directamente en tu correo."}
                            </p>
                            <button className="w-full py-2 bg-white text-[#C40180] rounded-lg font-medium hover:bg-white/90 transition-colors">
                                {news.category === "Conferencias"
                                    ? "Registrarme ahora"
                                    : news.category === "Revista" || news.category === "Podcast"
                                        ? "Suscribirme"
                                        : "Recibir actualizaciones"}
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Botón de volver flotante para móvil */}
            <div className="lg:hidden fixed bottom-6 right-6 z-40">
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleGoBack}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-[#C40180] text-white shadow-lg hover:bg-[#A00160] transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </motion.button>
            </div>
        </div>
    );
};

export default NoticiaDetalle;