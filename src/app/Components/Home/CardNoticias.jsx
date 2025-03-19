"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

const CardNoticias = ({ item, index }) => {
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

    const isFeatured = index === 0 || item.size === 'ancho';
    
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
                        <div className="grid grid-cols-2 gap-1">
                            {item.imageUrl.map((url, imgIndex) => (
                                <div
                                    key={imgIndex}
                                    className="relative overflow-hidden"
                                    style={{
                                        height: item.size === 'alto' ? '100%' : '150px'
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
                                height: item.size === 'alto' ? '100%' : '150px'
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

            <div className="p-4 relative">
                {/* Date badge - on the right side above the title */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-2 shadow-md">
                    <Calendar className="w-3 h-3 text-[#C40180]" />
                    <span className="text-xs font-medium text-gray-800">{item.date}</span>
                    <span className="mx-1 text-gray-400">|</span>
                    <Clock className="w-3 h-3 text-[#C40180]" />
                    <span className="text-xs font-medium text-gray-800">{item.time}</span>
                </div>

                {/* Título y descripción */}
                <h3 className={`font-bold text-gray-800 mb-2 mt-8 ${isFeatured ? 'text-xl md:text-2xl' : 'text-lg'} line-clamp-2`}>
                    {item.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                </p>
                
                <motion.div 
                    className="flex items-center justify-end text-[#C40180] font-medium text-sm"
                    variants={arrowVariants}
                >
                    Leer más <ChevronRight className="w-4 h-4 ml-1" />
                </motion.div>
            </div>
            
            {/* Colorful gradient line at the bottom of the card */}
            <div className="absolute bottom-0 left-0 h-2 w-full bg-gradient-to-r from-[#C40180] to-[#590248] z-10"></div>
            
            {/* Animated hover line */}
            <motion.div 
                className="absolute bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C40180] to-transparent"
                variants={lineVariants}
                initial="initial"
            />
        </motion.div>
    );
};

export default CardNoticias;