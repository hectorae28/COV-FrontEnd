"use client";

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const aliados = [
    { id: 1, logo: '/assets/sponsor/dacosi.png', name: 'Sponsor 1' },
    { id: 2, logo: '/assets/sponsor/dacomed.png', name: 'Sponsor 2' },
    { id: 3, logo: '/assets/sponsor/1.png', name: 'Sponsor 1' },
    { id: 4, logo: '/assets/sponsor/2.png', name: 'Sponsor 2' },
    { id: 5, logo: '/assets/sponsor/3.png', name: 'Sponsor 3' },
    { id: 6, logo: '/assets/sponsor/4.png', name: 'Sponsor 4' },
    { id: 7, logo: '/assets/sponsor/5.png', name: 'Sponsor 5' },
    { id: 8, logo: '/assets/sponsor/6.png', name: 'Sponsor 6' },
    { id: 9, logo: '/assets/sponsor/7.png', name: 'Sponsor 7' },
    { id: 10, logo: '/assets/sponsor/8.png', name: 'Sponsor 8' },
    { id: 11, logo: '/assets/sponsor/9.png', name: 'Sponsor 9' },
    { id: 12, logo: '/assets/sponsor/10.png', name: 'Sponsor 10' },
    { id: 13, logo: '/assets/sponsor/11.png', name: 'Sponsor 11' },
    { id: 14, logo: '/assets/sponsor/12.png', name: 'Sponsor 12' },
    { id: 15, logo: '/assets/sponsor/13.png', name: 'Sponsor 13' },
];

const Sponsor = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAutoplay, setIsAutoplay] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [windowWidth, setWindowWidth] = useState(0);
    const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
    const wheelRef = useRef(null);
    const autoplayTimerRef = useRef(null);

    // Determinar el radio según el tamaño de la pantalla
    const getRadius = () => {
        if (windowWidth < 640) return 180;
        if (windowWidth < 768) return 240;
        if (windowWidth < 1024) return 350;
        return 450; // xl y mayores
    };

    // Determinar los tamaños de las imágenes según el tamaño de la pantalla
    const getImageSizes = (isActive) => {
        if (windowWidth < 640) {
            return {
                width: isActive ? 200 : 100,
                height: isActive ? 200 : 120,
                imgWidth: isActive ? 140 : 60,
                imgHeight: isActive ? 120 : 50
            };
        }
        if (windowWidth < 768) {
            return {
                width: isActive ? 200 : 120,
                height: isActive ? 160 : 100,
                imgWidth: isActive ? 120 : 70,
                imgHeight: isActive ? 100 : 60
            };
        }
        if (windowWidth < 1024) {
            return {
                width: isActive ? 260 : 150,
                height: isActive ? 200 : 130,
                imgWidth: isActive ? 150 : 90,
                imgHeight: isActive ? 130 : 70
            };
        }
        return {
            width: isActive ? 320 : 180,
            height: isActive ? 240 : 160,
            imgWidth: isActive ? 180 : 100,
            imgHeight: isActive ? 160 : 80
        };
    };

    const calculatePositions = () => {
        const radius = getRadius();
        const angleStep = (2 * Math.PI) / aliados.length;

        // Calcular cuántos elementos mostrar a cada lado en función del tamaño de pantalla
        const visibleItems = windowWidth < 640 ? 2 : (windowWidth < 1024 ? 3 : 4);

        return aliados.map((aliado, index) => {
            let relativeIndex = index - activeIndex;

            // Normalizar el índice para tener el camino más corto alrededor del círculo
            if (relativeIndex > aliados.length / 2) relativeIndex -= aliados.length;
            if (relativeIndex < -aliados.length / 2) relativeIndex += aliados.length;

            // Limitar la visibilidad a un rango específico
            const isVisible = Math.abs(relativeIndex) <= visibleItems;
            
            const angle = relativeIndex * angleStep;

            // Ajustar la posición X según el tamaño de la pantalla
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius - radius;

            const normalizedZ = (z + radius) / (2 * radius);
            const scale = 0.5 + normalizedZ * 0.5;

            // Ajustar la opacidad para elementos visibles/no visibles
            const opacity = !isVisible ? 0 : (index === activeIndex ? 1.0 : 0.5 + normalizedZ * 0.3);

            return {
                ...aliado,
                x,
                z,
                scale,
                opacity,
                angle,
                isActive: index === activeIndex,
                isVisible
            };
        });
    };

    // Actualizar el tamaño de la ventana
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setWindowWidth(width);
            setIsMobileOrTablet(width < 1024);
        };
        handleResize();
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded || !isAutoplay) return;

        autoplayTimerRef.current = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % aliados.length);
        }, 3000);

        return () => {
            if (autoplayTimerRef.current) {
                clearInterval(autoplayTimerRef.current);
            }
        };
    }, [isLoaded, isAutoplay, aliados.length]);

    const handleClickLogo = (index) => {
        setActiveIndex(index);
        setIsAutoplay(false);
        setTimeout(() => setIsAutoplay(true), 5000);
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStartX(e.clientX);
        setIsAutoplay(false);
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setDragStartX(e.touches[0].clientX);
        setIsAutoplay(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const dragDistance = e.clientX - dragStartX;
        const threshold = windowWidth < 640 ? 40 : 60;
        
        if (Math.abs(dragDistance) > threshold) {
            const direction = dragDistance > 0 ? -1 : 1;
            setActiveIndex((prevIndex) => {
                const newIndex = (prevIndex + direction + aliados.length) % aliados.length;
                return newIndex;
            });

            setDragStartX(e.clientX);
            setIsDragging(false);
            setTimeout(() => setIsDragging(true), 100);
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;

        const dragDistance = e.touches[0].clientX - dragStartX;
        const threshold = windowWidth < 640 ? 30 : 40;
        
        if (Math.abs(dragDistance) > threshold) {
            const direction = dragDistance > 0 ? -1 : 1;
            
            setActiveIndex((prevIndex) => {
                const newIndex = (prevIndex + direction + aliados.length) % aliados.length;
                return newIndex;
            });
            
            setDragStartX(e.touches[0].clientX);

            setIsDragging(false);
            setTimeout(() => setIsDragging(true), 200);
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setTimeout(() => setIsAutoplay(true), 3000);
    };

    const handleChevronClick = (direction) => {
        setActiveIndex((prevIndex) => {
            const newIndex = (prevIndex + direction + aliados.length) % aliados.length;
            return newIndex;
        });
        setIsAutoplay(false);
        setTimeout(() => setIsAutoplay(true), 5000);
    };

    const logoPositions = calculatePositions();

    return (
        <section className="overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
                <div className="text-center mt-8 sm:mt-12 md:mt-16">
                    <motion.h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Nuestros Aliados
                    </motion.h2>

                    <motion.p
                        className="mt-4 sm:mt-6 max-w-2xl mx-auto text-gray-600 text-sm sm:text-base"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        Contamos con el respaldo de las marcas más reconocidas de la industria dental,
                        quienes comparten nuestro compromiso con la excelencia profesional y la salud bucal.
                    </motion.p>
                </div>

                <div className="relative flex justify-center items-center h-64 sm:h-72 md:h-76 lg:h-80 perspective-3000 cursor-grab group my-8 sm:my-12">
                    {/* Botones de navegación solo en desktop (lg y superior) */}
                    {!isMobileOrTablet && (
                        <>
                            <button
                                className="absolute left-4 z-10 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleChevronClick(-1)}
                                aria-label="Previous Sponsor"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-700" />
                            </button>

                            <button
                                className="absolute right-4 z-10 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleChevronClick(1)}
                                aria-label="Next Sponsor"
                            >
                                <ChevronRight className="w-6 h-6 text-gray-700" />
                            </button>
                        </>
                    )}

                    <div
                        className="relative w-full h-full flex justify-center items-center"
                        ref={wheelRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleDragEnd}
                        onMouseLeave={handleDragEnd}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleDragEnd}
                    >
                        <div className="absolute inset-0 flex justify-center items-center">
                            {logoPositions.map((aliado) => {
                                if (!aliado.isVisible) return null;
                                
                                const zIndex = Math.round(aliado.z + 1000);
                                const sizes = getImageSizes(aliado.isActive);

                                return (
                                    <div
                                        key={aliado.id}
                                        className={`absolute bg-white rounded-xl shadow-lg transition-all duration-500 ease-in-out flex items-center justify-center cursor-pointer
                                            ${aliado.isActive ? 'ring-1 ring-[#BFC8D0] shadow-xl' : ''}`}
                                        style={{
                                            transform: `translateX(${aliado.x}px) translateZ(${aliado.z}px) scale(${aliado.scale})`,
                                            opacity: aliado.opacity,
                                            width: `${sizes.width}px`,
                                            height: `${sizes.height}px`,
                                            zIndex,
                                        }}
                                        onClick={() => handleClickLogo(aliados.findIndex(a => a.id === aliado.id))}
                                    >
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Image
                                                src={aliado.logo}
                                                alt={`Logo de ${aliado.name}`}
                                                width={sizes.imgWidth}
                                                height={sizes.imgHeight}
                                                className="object-contain max-w-full max-h-full transition-all duration-500"
                                                priority={aliado.isActive}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Sponsor;