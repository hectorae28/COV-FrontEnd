"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Facebook,
    Link2,
    Linkedin,
    Tag,
    Twitter,
    WhatsApp,
} from "lucide-react";
import newsItems from "@/app/Models/Home/NoticiasData";

// Componente principal de detalle de noticia
const NoticiaDetalle = () => {
    const params = useParams();
    const router = useRouter();
    const [noticia, setNoticia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Obtener el ID de la noticia desde la URL
        const id = params.id;

        if (!id) {
            setError("No se encontró el ID de la noticia");
            setLoading(false);
            return;
        }

        // Buscar la noticia en los datos
        // En un proyecto real, esto sería una llamada a la API
        const found = newsItems.find((item) => item.id === parseInt(id));

        if (found) {
            setNoticia(found);
            // Simular tiempo de carga para mejorar la experiencia del usuario
            setTimeout(() => {
                setLoading(false);
            }, 300);
        } else {
            setError("No se encontró la noticia");
            setLoading(false);
        }
    }, [params.id]);

    // Función para compartir la noticia
    const handleShare = (platform) => {
        if (typeof window === "undefined") return;

        const url = window.location.href;
        const title = noticia?.title || noticia?.titulo || "Noticia";

        switch (platform) {
            case "facebook":
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
                break;
            case "twitter":
                window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, "_blank");
                break;
            case "linkedin":
                window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`, "_blank");
                break;
            case "whatsapp":
                window.open(`https://api.whatsapp.com/send?text=${title} ${url}`, "_blank");
                break;
            case "link":
                navigator.clipboard.writeText(url);
                alert("Enlace copiado al portapapeles");
                break;
            default:
                break;
        }
    };

    // Renderizar estados de carga y error
    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 flex justify-center">
                <div className="animate-pulse space-y-8 w-full">
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-60 bg-gray-200 rounded"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !noticia) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {error || "No se encontró la noticia"}
                </h2>
                <p className="text-gray-600 mb-8">
                    No pudimos encontrar la noticia que estás buscando. Es posible que haya sido eliminada o que la URL sea incorrecta.
                </p>
                <button
                    onClick={() => router.push("/Noticias")}
                    className="flex items-center text-gray-600 hover:text-[#C40180] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver a noticias
                </button>
            </div>
        );
    }

    // Función para generar párrafos de muestra (en un proyecto real, esto vendría del backend)
    const generateParagraphs = () => {
        // Expandir la descripción en varios párrafos para simular un artículo completo
        const baseText = noticia.description || noticia.contenido;
        return [
            baseText,
            "La innovación en el campo de la odontología avanza continuamente, y los profesionales de la salud bucal deben mantenerse actualizados con las últimas técnicas y tecnologías para ofrecer el mejor servicio a sus pacientes.",
            "Los expertos recomiendan la formación continua y la participación en congresos y seminarios como parte fundamental del desarrollo profesional en el área odontológica.",
            "La implementación de estas nuevas tecnologías no solo mejora la precisión de los diagnósticos y tratamientos, sino que también puede reducir significativamente el tiempo de recuperación y el malestar del paciente.",
            "Es importante destacar que la inversión en equipamiento moderno debe ir acompañada de una capacitación adecuada para maximizar sus beneficios y garantizar la seguridad del paciente.",
            "La comunidad odontológica venezolana continúa demostrando su compromiso con la excelencia y la innovación, posicionándose como referente en la región."
        ];
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Botón para volver a la lista de noticias */}
            <div className="bg-[#F9F9F9] border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <button
                        onClick={() => router.push("/Noticias")}
                        className="flex items-center text-gray-600 hover:text-[#C40180] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver a noticias
                    </button>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                {/* Encabezado */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    {/* Categoría y fecha */}
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center text-[#C40180] bg-[#C40180]/10 px-3 py-1 rounded-full">
                            <Tag className="w-3 h-3 mr-1" />
                            <span>{noticia.category || "Actualización"}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{noticia.date || new Date(noticia.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{noticia.time || new Date(noticia.created_at).toLocaleTimeString()}</span>
                        </div>
                    </div>

                    {/* Título */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                        {noticia.title || noticia.titulo}
                    </h1>
                </motion.div>

                {/* Imagen principal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-10"
                >
                    <img
                        src={`${process.env.NEXT_PUBLIC_BACK_HOST}${noticia.imagen_portada_url || noticia.imageUrl}`}
                        alt={noticia.title || noticia.titulo}
                        className="w-full h-auto rounded-xl shadow-md"
                        onError={(e) => {
                            e.target.src = "/assets/placeholder-image.jpg";
                        }}
                    />
                </motion.div>

                {/* Contenido del artículo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="prose max-w-none mb-12"
                >
                    {generateParagraphs().map((paragraph, index) => (
                        <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                            {paragraph}
                        </p>
                    ))}
                </motion.div>

                {/* Botones para compartir */}
                <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Compartir artículo</h3>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => handleShare("facebook")}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90 transition-colors"
                            aria-label="Compartir en Facebook"
                        >
                            <Facebook className="w-4 h-4" />
                            <span className="hidden sm:inline">Facebook</span>
                        </button>
                        <button
                            onClick={() => handleShare("twitter")}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90 transition-colors"
                            aria-label="Compartir en Twitter"
                        >
                            <Twitter className="w-4 h-4" />
                            <span className="hidden sm:inline">Twitter</span>
                        </button>
                        <button
                            onClick={() => handleShare("linkedin")}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 transition-colors"
                            aria-label="Compartir en LinkedIn"
                        >
                            <Linkedin className="w-4 h-4" />
                            <span className="hidden sm:inline">LinkedIn</span>
                        </button>
                        <button
                            onClick={() => handleShare("whatsapp")}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] text-white hover:bg-[#25D366]/90 transition-colors"
                            aria-label="Compartir en WhatsApp"
                        >
                            <WhatsApp className="w-4 h-4" />
                            <span className="hidden sm:inline">WhatsApp</span>
                        </button>
                        <button
                            onClick={() => handleShare("link")}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                            aria-label="Copiar enlace"
                        >
                            <Link2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Copiar enlace</span>
                        </button>
                    </div>
                </div>
            </article>

            {/* Sección de noticias relacionadas (opcional) */}
            <div className="bg-[#F9F9F9] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                        Noticias relacionadas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {newsItems
                            .filter(item => item.id !== noticia.id && item.category === noticia.category)
                            .slice(0, 3)
                            .map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        router.push(`/Noticias`);
                                        // Hacer scroll al inicio
                                        window.scrollTo(0, 0);
                                    }}
                                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_BACK_HOST}${item.imagen_portada_url || item.imageUrl}`}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            onError={(e) => {
                                                e.target.src = "/assets/placeholder-image.jpg";
                                            }}
                                        />
                                        <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center text-xs">
                                            <Calendar className="w-3 h-3 text-[#C40180] mr-1" />
                                            <span>{item.date}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-2 flex-grow">
                                            {item.description}
                                        </p>
                                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                                            <span className="text-sm font-medium text-[#C40180]">
                                                Leer más →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticiaDetalle;