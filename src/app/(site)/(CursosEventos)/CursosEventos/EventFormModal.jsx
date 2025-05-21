import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, DollarSign, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import DynamicEventForm from "./DynamicEventForm";

export default function EventFormModal({ isOpen, onClose, event }) {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    if (!isOpen && !isClosing) return null;

    const formData = {
        ...event.formulario,
        evento: event.id,
        curso: null,
        campos: event.formulario?.campos || []
    };

    const imageUrl = event.image ?
        (event.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_BACK_HOST}${event.image}` : event.image) :
        null;

    return (
        <AnimatePresence>
            {(isOpen || isClosing) && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center">
                    {/* Fondo difuminado y oscuro */}
                    <motion.div
                        className="fixed inset-0 z-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />

                    {/* Capa negra con blur encima de la imagen */}
                    <div className="fixed inset-0 z-10 bg-black/40 backdrop-blur-sm" />

                    {/* Modal principal con sombra blanca */}
                    <motion.div
                        className="relative z-10 w-full max-w-xl max-h-[100vh] overflow-auto bg-white rounded-xl drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Encabezado con imagen */}
                        <div className="relative h-52 overflow-hidden">
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                            )}

                            {/* Overlay negro sobre imagen */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                            {/* Botón de cerrar con degradado */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-gradient-to-r from-[#C40180] to-[#590248] hover:opacity-90 transition-colors z-10"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>

                            {/* Información del evento sobre la imagen */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span>{new Date(event.date).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</span>
                                    </div>
                                    {event.time && (
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-2" />
                                            <span>{event.time}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{event.location}</span>
                                    </div>
                                    {event.price && (
                                        <div className="flex items-center">
                                            <DollarSign className="w-4 h-4 mr-2" />
                                            <span>${parseFloat(event.price).toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contenido del formulario */}
                        <div className="p-6">
                            <DynamicEventForm
                                formulario={formData}
                                title="Formulario de Inscripción"
                                description={`Complete el formulario para inscribirse en "${event.title}"`}
                                onSuccess={handleClose}
                                singleStep={true}
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
