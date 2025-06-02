import { motion } from "framer-motion";
import { Calendar, Clock, ExternalLink, MapPin } from "lucide-react";
import { useState } from "react";
import EventFormModal from "./EventFormModal";

export default function EventCard({
    id,
    title,
    nombre,
    date,
    fecha,
    hora_inicio,
    location,
    lugar,
    image,
    cover_url,
    linkText = "Inscríbete",
    precio,
    isPaid,
    showPriceTag = true,
    currency = "USD",
    formulario,
    slug,
    tipo,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Normalizar propiedades (compatibilidad entre backend y frontend)
    const eventTitle = title || nombre || "Sin título";
    const eventDate = date || fecha || "Fecha no definida";
    const eventLocation = location || lugar || "Sin ubicación";
    const eventImage = image || cover_url || null;
    const eventTime = hora_inicio || null;

    // Determinar si es video (manteniendo la misma lógica que CardPreview)
    const isVideo =
        eventImage &&
        (eventImage.endsWith(".mp4") ||
            eventImage.endsWith(".webm") ||
            eventImage.endsWith(".ogg") ||
            eventImage.includes("youtube.com") ||
            eventImage.includes("youtu.be") ||
            eventImage.includes("vimeo.com"));

    // Lógica para la etiqueta de precio
    const isEventPaid = isPaid || (precio && parseFloat(precio) > 0);

    // Determinar si es curso o evento
    const isCurso =
        tipo === "curso" ||
        (eventTitle && eventTitle.toLowerCase().includes("curso")) ||
        (nombre && nombre.toLowerCase().includes("curso"));

    // Helper para símbolos de moneda
    const getCurrencySymbol = (currencyCode) => {
        switch (currencyCode) {
            case "USD":
                return "$";
            case "EUR":
                return "€";
            case "BS":
                return "Bs";
            default:
                return "$";
        }
    };

    // Formato del precio con moneda
    const formattedPrice =
        isEventPaid && precio
            ? `${getCurrencySymbol(currency)} ${parseFloat(precio).toFixed(2)}`
            : "";

    // Asegurarse de que formulario tenga una estructura básica si es null
    const formData = formulario || { campos: [] };

    return (
        <>
            <motion.div
                className="h-full w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
            >
                <div
                    className="overflow-hidden rounded-xl shadow-lg bg-white border border-gray-100 h-full flex flex-col relative"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at bottom right, rgba(196, 1, 128, 0.03), transparent)",
                    }}
                >
                    {/* Etiqueta de PASE LIBRE o EVENTO/CURSO PAGO */}
                    {showPriceTag && (
                        <div
                            className={`absolute top-4 right-1 z-10 transform rotate-45 translate-x-[32%] -translate-y-[1%] 
    ${isEventPaid ? "bg-emerald-600" : "bg-blue-600"} 
    text-white font-bold py-0.5 px-8 shadow-md`}
                        >
                            {isEventPaid ? (
                                <span className="text-[10px]">
                                    {isCurso ? "Curso Pago" : "Evento Pago"}
                                </span>
                            ) : (
                                <span className="text-[10px]">PASE LIBRE</span>
                            )}
                        </div>
                    )}

                    {/* Card Header with Image */}
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                        <div
                            className={`absolute inset-0 ${eventImage
                                ? "bg-white"
                                : "bg-gradient-to-br from-[#C40180] to-[#590248]"
                                } opacity-80`}
                        ></div>
                        <div className="absolute inset-0">
                            {eventImage ? (
                                isVideo ? (
                                    <video
                                        src={
                                            eventImage.startsWith("/")
                                                ? `${process.env.NEXT_PUBLIC_BACK_HOST}${eventImage}`
                                                : eventImage
                                        }
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        controls={false}
                                    />
                                ) : (
                                    <img
                                        src={
                                            eventImage.startsWith("/")
                                                ? `${process.env.NEXT_PUBLIC_BACK_HOST}${eventImage}`
                                                : eventImage
                                        }
                                        alt={eventTitle}
                                        className="w-full h-full object-cover"
                                    />
                                )
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white opacity-10">
                                    Sin imagen
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                            <h3 className="text-xl font-bold text-white line-clamp-1">
                                {eventTitle}
                            </h3>
                            {isEventPaid && precio && (
                                <div className="mt-1 inline-block bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-white text-sm font-medium">
                                    {formattedPrice}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex flex-col flex-grow space-y-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center text-sm text-gray-700">
                                <Calendar className="mr-2 text-[#C40180] w-4 h-4" />
                                <span>
                                    {new Date(eventDate).toLocaleDateString("es-ES", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                            {eventTime && (
                                <div className="flex items-center text-sm text-gray-700">
                                    <Clock className="mr-2 text-[#C40180] w-4 h-4" />
                                    <span>{eventTime}</span>
                                </div>
                            )}
                            <div className="flex items-center text-sm text-gray-700">
                                <MapPin className="mr-2 text-[#C40180] w-4 h-4" />
                                <span className="line-clamp-1">{eventLocation}</span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-auto inline-flex items-center justify-center w-full px-5 py-2 rounded-md bg-gradient-to-r from-[#C40180] to-[#590248] text-white font-semibold text-sm transition-transform hover:scale-105 active:scale-95"
                        >
                            {linkText || "Inscríbete"}
                            <ExternalLink className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Modal de Formulario */}
            <EventFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                event={{
                    id,
                    title: eventTitle,
                    date: eventDate,
                    location: eventLocation,
                    image: eventImage,
                    price: precio,
                    formulario: formData,
                    slug,
                }}
            />
        </>
    );
}
