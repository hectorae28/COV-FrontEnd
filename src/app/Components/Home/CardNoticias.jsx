"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

const CardNoticias = ({ item, index, screenSize = 'lg' }) => {
    const cardVariants = {
        hover: {
            scale: 1.03,
            transition: { duration: 0.3 }
        }
    };

    const lineVariants = {
        initial: { scaleX: 0 },
        hover: { 
            scaleX: 1,
            transition: { duration: 0.5 }
        }
    };

    const arrowVariants = {
        hover: {
            x: 5,
            transition: { duration: 0.2 }
        }
    };

    // Si es el primer ítem o si tiene tamaño ancho y no estamos en móvil
    const isFeatured = index === 0 || (item.size === 'ancho' && screenSize !== 'sm');
    
    // Ajustar altura de imagen según tamaño de pantalla y tipo de card
    const getImageHeight = () => {
        if (screenSize === 'sm') {
            return item.size === 'alto' ? '250px' : '180px';
        } else if (screenSize === 'md') {
            return item.size === 'alto' ? '300px' : '200px';
        } else {
            return item.size === 'alto' ? '350px' : '200px';
        }
    };
    
    return (
        <motion.div 
            className={`relative rounded-xl overflow-hidden h-full shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 bg-white group cursor-pointer`}
            whileHover="hover"
            variants={cardVariants}
        >
            <div className="relative overflow-hidden">
                <div className="w-full h-full relative">
                    {item.imageUrl.length > 1 && item.size === 'alto' ? (
                        <div className="flex flex-col gap-1">
                            {item.imageUrl.map((url, imgIndex) => (
                                <div
                                    key={imgIndex}
                                    className="relative overflow-hidden"
                                    style={{
                                        height: `${100 / item.imageUrl.length}%`
                                    }}
                                >
                                    <img
                                        src={url}
                                        alt={item.title}
                                        className="w-full h-full object-cover object-center"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/400x200";
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : item.imageUrl.length > 1 ? (
                        <div className={`grid ${screenSize === 'sm' ? 'grid-cols-1' : 'grid-cols-2'} gap-1`}>
                            {item.imageUrl.map((url, imgIndex) => (
                                <div
                                    key={imgIndex}
                                    className="relative overflow-hidden"
                                    style={{
                                        height: screenSize === 'sm' ? '120px' : getImageHeight()
                                    }}
                                >
                                    <img
                                        src={url}
                                        alt={item.title}
                                        className="w-full h-full object-cover object-center"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/400x150";
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            className="relative overflow-hidden"
                            style={{
                                height: getImageHeight()
                            }}
                        >
                            <img
                                src={item.imageUrl[0]}
                                alt={item.title}
                                className="w-full h-full object-cover object-center"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/400x150";
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="p-3 sm:p-4 relative">
    {/* Date badge - Siempre alineado a la derecha */}
    <div
        className={`
            absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full flex items-center space-x-1 sm:space-x-2 
            shadow-sm sm:shadow-md text-xs sm:text-sm w-max max-w-full
        `}
    >
        <Calendar className="w-3 h-3 text-[#C40180]" />
        <span className="font-medium text-gray-800">{item.date}</span>
        <span className="mx-1 text-gray-400">|</span>
        <Clock className="w-3 h-3 text-[#C40180]" />
        <span className="font-medium text-gray-800">{item.time}</span>
    </div>

    {/* Título y descripción */}
    <h3
        className={`
            font-bold text-gray-800 mb-2 mt-8 
            ${
                isFeatured
                    ? `text-lg sm:text-xl ${screenSize === 'lg' ? 'md:text-2xl' : ''}`
                    : 'text-base sm:text-lg'
            } 
            line-clamp-2
        `}
    >
        {item.title}
    </h3>

    <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
        {item.description}
    </p>

    <motion.div
        className="flex items-center justify-end text-[#C40180] font-medium text-xs sm:text-sm"
        variants={arrowVariants}
    >
        Leer más <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
    </motion.div>
</div>
            
            {/* Colorful gradient line at the bottom of the card */}
            <div className="absolute bottom-0 left-0 h-1 sm:h-2 w-full bg-gradient-to-r from-[#C40180] to-[#590248] z-10"></div>
            
            {/* Animated hover line - solo visible en dispositivos que no son táctiles */}
            <div className="hidden sm:block">
                <motion.div 
                    className="absolute bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C40180] to-transparent"
                    variants={lineVariants}
                    initial="initial"
                />
            </div>
        </motion.div>
    );
};

export default CardNoticias;