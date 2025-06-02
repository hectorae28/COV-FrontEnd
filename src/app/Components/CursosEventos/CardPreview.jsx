import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";

export default function CardPreview({ 
    title, date, hora_inicio, location, image, linkText, 
    showPriceTag, price, precio, currency 
}) {
    // Calcular automáticamente si es de pago basado en el precio
    const isPaid = (price && parseFloat(price) > 0) || (precio && parseFloat(precio) > 0);
    
    // Usar el precio que esté disponible
    const finalPrice = price || precio;
    
    // Determine if the image is a video URL
    const isVideo = image && (
        image.endsWith('.mp4') ||
        image.endsWith('.webm') ||
        image.endsWith('.ogg') ||
        image.includes('youtube.com') ||
        image.includes('youtu.be') ||
        image.includes('vimeo.com')
    );

    // Helper for currency symbols
    const getCurrencySymbol = (currencyCode) => {
        switch(currencyCode) {
            case 'USD': return '$';
            case 'EUR': return '€';
            case 'BS': return 'Bs';
            default: return '$';
        }
    };

    // Format price with currency
    const formattedPrice = isPaid && finalPrice ? 
        `${getCurrencySymbol(currency)} ${parseFloat(finalPrice).toFixed(2)}` : '';

    return (
        <div className="overflow-hidden rounded-xl shadow-lg bg-white border border-gray-100 flex flex-col w-full max-w-sm mx-auto relative">
            {/* Etiqueta de PASE LIBRE o EVENTO/CURSO PAGO */}
            {showPriceTag && (
                <div className={`absolute top-4 right-1 z-10 transform rotate-45 translate-x-[32%] -translate-y-[30%] 
                    ${isPaid ? 'bg-orange-500' : 'bg-emerald-500'} 
                    text-white font-bold py-0.5 px-8 shadow-md`}>
                    {isPaid ? (
                        <span className="text-[10px]">
                            {title && title.toLowerCase().includes('curso') ? 'PAGO' : 'PAGO'}
                        </span>
                    ) : (
                        <span className="text-[10px]">PASE LIBRE</span>
                    )}
                </div>
            )}

            {/* Resto del componente permanece igual */}
            <div className="relative h-48 overflow-hidden">
                <div
                    className={`absolute inset-0 ${image ? "bg-white" : "bg-gradient-to-br from-[#C40180] to-[#590248]"} opacity-80`}
                ></div>
                <div className="absolute inset-0">
                    {image ? (
                        isVideo ? (
                            <video
                                src={image}
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                controls={false}
                            />
                        ) : (
                            <img src={image} alt={title} className="w-full h-full object-cover" />
                        )
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white opacity-10">Sin imagen</div>
                    )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-xl font-bold text-white line-clamp-1">{title || "Sin título"}</h3>
                    {isPaid && (
                        <div className="mt-1 inline-block bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-white text-sm font-medium">
                            {formattedPrice}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Resto del JSX permanece igual */}
            <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center text-sm text-gray-700">
                    <FiCalendar className="mr-2 text-[#C40180]" /> {date || "Fecha no definida"}
                </div>
                {hora_inicio && (
                    <div className="flex items-center text-sm text-gray-700">
                        <FiClock className="mr-2 text-[#C40180]" /> {hora_inicio}
                    </div>
                )}
                <div className="flex items-center text-sm text-gray-700">
                    <FiMapPin className="mr-2 text-[#C40180]" /> {location || "Sin ubicación"}
                </div>
                <a
                    href="#"
                    className="mt-3 inline-flex items-center justify-center px-5 py-2 rounded-md bg-gradient-to-r from-[#C40180] to-[#590248] text-white font-semibold text-sm pointer-events-none"
                >
                    {linkText || "Inscríbete"}
                </a>
            </div>
        </div>
    );
}