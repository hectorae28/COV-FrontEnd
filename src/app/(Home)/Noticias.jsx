"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import CardNoticias from '../Components/Home/CardNoticias';

const Noticias = () => {
    const newsItems = [
        {
            date: "14/05/2024",
            time: "12:30pm",
            title: "XLII Juegos Nacionales de Odontólogos TACHIRA 2024",
            description: "XLII Juegos Nacionales de Odontólogos TACHIRA 2024. Desde el domingo 28 de abril hasta el viernes 03 de mayo se celebraron los...",
            imageUrl: ["/assets/noticias/ancho.png"],
            size: "normal"
        },
        {
            date: "14/05/2024",
            time: "12:30pm",
            title: "PROYECTO DE ACTUALIZACIÓN DE LEY ORGÁNICA DE LA ODONTOLOGÍA",
            description: "Artículo 1. Objeto de la Ley. La presente Ley tiene por objeto establecer las bases...",
            imageUrl: ["/assets/noticias/normal2.png", "/assets/noticias/normal.png"],
            size: "alto"
        },
        {
            date: "14/05/2024",
            time: "12:30pm",
            title: "NUEVO EPISODIO",
            description: "XLII Juegos Nacionales de Odontólogos TACHIRA 2024. Desde el domingo 28 de abril hasta el viernes 03 de mayo se celebraron los...",
            imageUrl: ["/assets/noticias/ancho2.png"],
            size: "normal" 
        },
        {
            date: "14/05/2024",
            time: "12:30pm",
            title: "Revista Venezuela Odontológica",
            description: "XLII Juegos Nacionales de Odontólogos TACHIRA 2024. Desde el domingo 28 de abril hasta el viernes 03 de mayo se celebraron los...",
            imageUrl: ["/assets/noticias/ancho.png", "/assets/noticias/ancho2.png"],
            size: "ancho"
        },
        {
            date: "14/05/2024",
            time: "12:30pm",
            title: "NUEVO EPISODIO",
            description: "XLII Juegos Nacionales de Odontólogos TACHIRA 2024. Desde el domingo 28 de abril hasta el viernes 03 de mayo se celebraron los...",
            imageUrl: ["/assets/noticias/normal5.png"],
            size: "normal"
        },
        {
            date: "14/05/2024",
            time: "12:30pm",
            title: "PROYECTO DE ACTUALIZACIÓN DE LEY ORGÁNICA DE LA ODONTOLOGÍA",
            description: "Artículo 1. Objeto de la Ley. La presente Ley tiene por objeto establecer las bases...",
            imageUrl: ["/assets/noticias/alto.png"],
            size: "alto"
        },
    ];

    const parseDateAndTime = (dateStr, timeStr) => {
        const [day, month, year] = dateStr.split('/');
        let hours = parseInt(timeStr.slice(0, -2));
        const isPM = timeStr.toLowerCase().includes('pm');
        
        if (isPM && hours !== 12) {
            hours += 12;
        } else if (!isPM && hours === 12) {
            hours = 0;
        }
        
        return new Date(`${year}-${month}-${day}T${hours.toString().padStart(2, '0')}:${timeStr.slice(3, 5)}:00`);
    };

    const sortedNewsItems = useMemo(() => {
        return [...newsItems].sort((a, b) => {
            const dateA = parseDateAndTime(a.date, a.time);
            const dateB = parseDateAndTime(b.date, b.time);
            return dateB - dateA;
        });
    }, [newsItems]);

    const generateGridLayout = (items) => {
        const grid = Array(6).fill().map(() => Array(3).fill(null));
        const itemPositions = {};

        items.forEach((item, index) => {
            const itemId = `card-${index + 1}`;
            let placed = false;

            for (let row = 0; row < grid.length && !placed; row++) {
                for (let col = 0; col < grid[0].length && !placed; col++) {
                    if (grid[row][col] === null) {
                        if (item.size === "normal") {
                            grid[row][col] = itemId;
                            itemPositions[itemId] = { row, col, rowSpan: 1, colSpan: 1 };
                            placed = true;
                        } else if (item.size === "ancho" && col < grid[0].length - 1 && grid[row][col + 1] === null) {
                            grid[row][col] = itemId;
                            grid[row][col + 1] = itemId;
                            itemPositions[itemId] = { row, col, rowSpan: 1, colSpan: 2 };
                            placed = true;
                        } else if (item.size === "alto" && row < grid.length - 1 && grid[row + 1][col] === null) {
                            grid[row][col] = itemId;
                            grid[row + 1][col] = itemId;
                            itemPositions[itemId] = { row, col, rowSpan: 2, colSpan: 1 };
                            placed = true;
                        }
                    }
                }
            }

            if (!placed) {
                const newRow = Array(3).fill(null);
                grid.push(newRow);

                if (item.size === "normal") {
                    grid[grid.length - 1][0] = itemId;
                    itemPositions[itemId] = { row: grid.length - 1, col: 0, rowSpan: 1, colSpan: 1 };
                } else if (item.size === "ancho") {
                    grid[grid.length - 1][0] = itemId;
                    grid[grid.length - 1][1] = itemId;
                    itemPositions[itemId] = { row: grid.length - 1, col: 0, rowSpan: 1, colSpan: 2 };
                } else if (item.size === "alto") {
                    grid[grid.length - 1][0] = itemId;
                    grid.push(Array(3).fill(null));
                    grid[grid.length - 1][0] = itemId;
                    itemPositions[itemId] = { row: grid.length - 2, col: 0, rowSpan: 2, colSpan: 1 };
                }
            }
        });

        let gridTemplateAreas = '';
        for (let row = 0; row < grid.length; row++) {
            gridTemplateAreas += '"';
            for (let col = 0; col < grid[0].length; col++) {
                gridTemplateAreas += (grid[row][col] || '.') + ' ';
            }
            gridTemplateAreas = gridTemplateAreas.trim() + '"\n';
        }

        return {
            areas: gridTemplateAreas,
            columns: "1fr 1fr 1fr",
            rows: `repeat(${grid.length}, auto)`
        };
    };

    const gridLayout = useMemo(() => {
        return generateGridLayout(sortedNewsItems);
    }, [sortedNewsItems]);

    const fadeInUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (custom) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: custom * 0.1,
                duration: 0.5
            }
        })
    };

    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <motion.span 
                        className="text-sm font-medium text-[#C40180] uppercase tracking-wider"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        Mantente Informado
                    </motion.span>
                    
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Noticias y Actualizaciones
                    </motion.h2>
                    
                    <motion.p 
                        className="mt-6 max-w-2xl mx-auto text-gray-600"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        Descubre las últimas noticias, eventos y actualizaciones importantes para la comunidad odontológica venezolana.
                    </motion.p>
                </div>

                <div 
                    className="grid gap-6"
                    style={{
                        gridTemplateAreas: gridLayout.areas,
                        gridTemplateColumns: gridLayout.columns,
                        gridTemplateRows: gridLayout.rows
                    }}
                >
                    {sortedNewsItems.map((item, index) => (
                        <motion.div
                            key={index}
                            custom={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={fadeInUpVariants}
                            style={{ 
                                gridArea: `card-${index + 1}`,
                                height: '100%'
                            }}
                        >
                            <CardNoticias item={item} index={index} />
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    viewport={{ once: true }}
                >
                    <button className="px-8 py-3 cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 flex items-center mx-auto">
                        Ver Todas las Noticias
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default Noticias;