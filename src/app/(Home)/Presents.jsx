"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CarruselPresents from "../Components/Home/CarruselPresents";

export default function Presents() {
    const [showWhatsappText, setShowWhatsappText] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="rounded-b-4xl bg-black flex flex-col justify-center relative overflow-hidden">
            {/* Instagram */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="absolute top-24 sm:top-24 md:top-28 lg:top-28 xl:top-32 right-4 sm:right-8 md:right-6 lg:right-6 z-100"
                    >
                        <motion.button
                            whileHover={{ scale: 1 }}
                            className="flex items-center bg-[#41023B]/80 hover:bg-[#41023B] text-white/90 font-bold text-[10px] sm:text-[11px] md:text-[12px] py-1 px-2 sm:px-3 md:px-4 rounded-full transition-all duration-200 hover:text-white cursor-pointer shadow-md backdrop-blur-sm border border-white/10"
                        >
                            <span className="mr-1 sm:mr-2">Síguenos en Instagram</span>
                            <Image
                                src="/assets/icons/instagram.png"
                                alt="Instagram"
                                width={16}
                                height={16}
                                className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform duration-300 hover:rotate-12"
                            />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Carrusel */}
            <CarruselPresents />

            {/* WhatsApp */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 1.5
                }}
                className="fixed bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 flex items-center cursor-pointer hover:opacity-100 transition-all duration-300 z-50"
                onMouseEnter={() => setShowWhatsappText(true)}
                onMouseLeave={() => setShowWhatsappText(false)}
            >
                {/* Texto */}
                <AnimatePresence>
                    {showWhatsappText && (
                        <motion.div
                            initial={{ opacity: 0, x: 20, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white text-black font-medium rounded-full mr-2 sm:mr-3 md:mr-4 py-1 sm:py-1.5 md:py-2 px-3 sm:px-4 md:px-6 shadow-lg flex items-center"
                        >
                            <span className="whitespace-nowrap text-xs sm:text-sm md:text-base">¿Necesitas ayuda?</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Icono */}
                <motion.div
                    className="bg-gradient-to-br from-[#0dbf43ff] to-[#008068ff] rounded-full p-2 sm:p-2.5 md:p-3 shadow-lg"
                >
                    <Image
                        src="/assets/icons/whatsapp.png"
                        alt="WhatsApp"
                        width={32}
                        height={32}
                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-8 lg:h-8 transition-transform duration-300 hover:rotate-12"
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}