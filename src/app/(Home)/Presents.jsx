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
                        className="absolute top-4 right-16 z-10"
                    >
                        <motion.button 
                            whileHover={{ scale: 1 }}
                            className="flex items-center bg-[#41023B]/80 hover:bg-[#41023B] text-white/90 font-bold text-[12px] py-1 px-4 rounded-full transition-all duration-200 hover:text-white cursor-pointer shadow-md backdrop-blur-sm border border-white/10"
                        >
                            <span className="mr-2">Síguenos en Instagram</span>
                            <Image
                                src="/assets/icons/instagram.png"
                                alt="Instagram"
                                width={20}
                                height={20}
                                className="transition-transform duration-300 hover:rotate-12"
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
                className="fixed bottom-8 right-8 flex items-center cursor-pointer hover:opacity-100 transition-all duration-300 z-50"
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
                            className="bg-white text-black font-medium rounded-full mr-4 py-2 px-6 shadow-lg flex items-center"
                        >
                            <span className="whitespace-nowrap">¿Necesitas ayuda?</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Icono */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop"
                    }}
                    className="bg-gradient-to-br from-[#0dbf43ff] to-[#008068ff] rounded-full p-3 shadow-lg"
                >
                    <Image
                        src="/assets/icons/whatsapp.png"
                        alt="WhatsApp"
                        width={32}
                        height={32}
                        className="transition-transform duration-300 hover:rotate-12"
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}