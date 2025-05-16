import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";

export default function CardPreview({ title, date, hora_inicio, location, image, linkText }) {
    // Determine if the image is a video URL
    const isVideo = image && (
        image.endsWith('.mp4') ||
        image.endsWith('.webm') ||
        image.endsWith('.ogg') ||
        image.includes('youtube.com') ||
        image.includes('youtu.be') ||
        image.includes('vimeo.com')
    );

    return (
        <div className="overflow-hidden rounded-xl shadow-lg bg-white border border-gray-100 flex flex-col w-full max-w-sm mx-auto">
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
                </div>
            </div>
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
                    className="mt-3 inline-flex items-center justify-center px-5 py-2 rounded-md bg-gradient-to-r from-[#C40180] to-[#590248] text-white font-semibold text-sm"
                >
                    {linkText || "Inscríbete"}
                </a>
            </div>
        </div>
    );
}
