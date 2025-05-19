"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Facebook,
    Link as LinkIcon,
    Printer,
    Share2,
    Twitter,
    Home,
} from "lucide-react";

const ShareButtons = ({ url, title, displayMode = "row" }) => {
    const [shareMenuOpen, setShareMenuOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // Si no se proporciona una URL, usar la URL actual
    let shareUrl
    const shareTitle = title || "Noticia interesante";
    useEffect(() => {
        shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    },[])

    const handleShare = (platform) => {
        switch (platform) {
            case "facebook":
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
                break;
            case "twitter":
                window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
                    "_blank"
                );
                break;
            case "Home":
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle)} ${encodeURIComponent(shareUrl)}`, "_blank");
                break;
            case "copy":
                navigator.clipboard.writeText(shareUrl).then(() => {
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                });
                break;
            case "print":
                window.print();
                break;
            default:
                break;
        }

        if (displayMode === "dropdown") {
            setShareMenuOpen(false);
        }
    };

    // Variantes para animación de los botones
    const buttonVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 },
    };

    // Renderizar versión de botones en línea
    if (displayMode === "row") {
        return (
            <div className="flex flex-wrap gap-2">
                <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleShare("facebook")}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                    <Facebook className="w-4 h-4 mr-2" />
                    <span className="text-sm">Facebook</span>
                </motion.button>
                <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleShare("twitter")}
                    className="flex items-center px-4 py-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                >
                    <Twitter className="w-4 h-4 mr-2" />
                    <span className="text-sm">Twitter</span>
                </motion.button>
                <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleShare("whatsapp")}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                >
                    <Home className="w-4 h-4 mr-2" />
                    <span className="text-sm">WhatsApp</span>
                </motion.button>
                <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleShare("copy")}
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors relative"
                >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm">{copySuccess ? "¡Copiado!" : "Copiar enlace"}</span>
                    {copySuccess && (
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded"
                        >
                            ¡Enlace copiado!
                        </motion.span>
                    )}
                </motion.button>
                <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleShare("print")}
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                >
                    <Printer className="w-4 h-4 mr-2" />
                    <span className="text-sm">Imprimir</span>
                </motion.button>
            </div>
        );
    }

    // Renderizar versión de menú desplegable
    return (
        <div className="relative inline-block">
            <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setShareMenuOpen(!shareMenuOpen)}
                className="flex items-center px-3 py-2 text-gray-700 hover:text-[#C40180] transition-colors"
                aria-label="Compartir"
            >
                <Share2 className="w-5 h-5 mr-2" />
                <span>Compartir</span>
            </motion.button>

            {shareMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-20"
                >
                    <div className="p-2">
                        <button
                            onClick={() => handleShare("facebook")}
                            className="flex w-full items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                        >
                            <Facebook className="w-4 h-4 mr-3 text-blue-600" />
                            Facebook
                        </button>
                        <button
                            onClick={() => handleShare("twitter")}
                            className="flex w-full items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                        >
                            <Twitter className="w-4 h-4 mr-3 text-blue-400" />
                            Twitter
                        </button>
                        <button
                            onClick={() => handleShare("whatsapp")}
                            className="flex w-full items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                        >
                            <WhatsApp className="w-4 h-4 mr-3 text-green-500" />
                            WhatsApp
                        </button>
                        <button
                            onClick={() => handleShare("copy")}
                            className="flex w-full items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                        >
                            <LinkIcon className="w-4 h-4 mr-3 text-gray-600" />
                            {copySuccess ? "¡Copiado!" : "Copiar enlace"}
                        </button>
                        <button
                            onClick={() => handleShare("print")}
                            className="flex w-full items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                        >
                            <Printer className="w-4 h-4 mr-3 text-gray-600" />
                            Imprimir
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ShareButtons;