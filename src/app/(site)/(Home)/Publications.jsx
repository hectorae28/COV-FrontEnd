"use client";

import { motion } from 'framer-motion';
import { useEffect } from 'react';

const InstagramFeed = () => {
    const instagramProfileUrl = "https://www.instagram.com/elcovorg";
    const instagramUsername = "elcovorg";

    useEffect(() => {
        // Load the Behold widget script
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://w.behold.so/widget.js';
        document.head.appendChild(script);

        // Añadir estilos personalizados para el widget
        const style = document.createElement('style');
        style.textContent = `
            behold-widget {
                width: 100% !important;
                max-width: 100% !important;
            }
            
            /* Asegurar que los elementos internos del widget también se expandan */
            behold-widget .behold-grid {
                width: 100% !important;
                max-width: 100% !important;
            }
        `;
        document.head.appendChild(style);

        // Clean up on component unmount
        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    return (
        <section className="overflow-hidden mt-16 mb-18">
            {/* Cambiamos de container a container-fluid para máximo ancho */}
            <div className="container-fluid px-4 mx-auto">
                <div className="text-center mb-12">
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Síguenos en Instagram
                    </motion.h2>
                    <motion.p
                        className="mt-6 max-w-7xl mx-auto text-gray-600"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        Mantente al día con nuestras últimas novedades, casos clínicos y eventos
                        a través de nuestro perfil de Instagram @{instagramUsername}.
                    </motion.p>
                </div>

                <motion.div
                    className="w-full min-h-full"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    {/* Contenedor extra para dar más ancho */}
                    <div className="w-full  mx-auto">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: '<behold-widget feed-id="HbNBtf5OZ76lYiuxDpyY"></behold-widget>'
                            }}
                            className="w-full"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default InstagramFeed;