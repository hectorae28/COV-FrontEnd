"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { especialidadesInfo } from "./especialidadesData"

export default function EspecialidadesTabs({ activeTab, onTabChange, scrollToTable }) {
    const [hoveredCard, setHoveredCard] = useState(null)
    const [isExpanded, setIsExpanded] = useState(false)
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 0
    )
    
    // Get all specialties
    const especialidades = Object.entries(especialidadesInfo)
    
    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
            // Close expanded view on larger screens
            if (window.innerWidth >= 768) {
                setIsExpanded(false)
            }
        }
        
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    
    const isMobile = windowWidth < 768
    
    const handleTabClick = (id) => {
        if (isMobile && id === activeTab && !isExpanded) {
            setIsExpanded(!isExpanded)
            return
        }
        
        onTabChange(id)
        // Close expanded view after selection on mobile
        if (isMobile) {
            setIsExpanded(false)
        } else {
            // Only scroll to table on non-mobile devices
            scrollToTable()
        }
    }
    
    // Find active specialty info
    const activeSpecialty = activeTab ? especialidadesInfo[activeTab] : null
    
    // Filter out the active specialty from dropdown options
    const dropdownOptions = especialidades.filter(([id]) => id !== activeTab)
    
    return (
        <div className="w-full">
            <div className="mb-4 flex items-center">
                <h2 className="text-xl font-bold text-gray-800">Especialidades</h2>
                <div
                    className="ml-4 h-1 flex-grow"
                    style={{
                        backgroundColor: activeTab
                            ? especialidadesInfo[activeTab]?.color || "gray-200"
                            : "gray-200",
                    }}
                ></div>
            </div>
            
            {/* Mobile view - Single card with dropdown */}
            {isMobile && (
                <div className="mb-8">
                    {/* Active card that toggles dropdown */}
                    <motion.div
                        className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer h-24 mb-2"
                        style={{
                            ringColor: activeSpecialty?.color || "transparent",
                            ring: activeTab ? "3px" : "0px",
                        }}
                        onClick={() => setIsExpanded(!isExpanded)}
                        whileTap={{ scale: 0.98 }}
                    >
                        {/* Background image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500"
                            style={{
                                backgroundImage: activeSpecialty
                                     ? `url(${activeSpecialty.image})`
                                    : "none",
                                filter: "brightness(0.6)"
                            }}
                        />
                        
                        {/* Overlay gradient */}
                        <div
                            className="absolute inset-0 z-5 opacity-90"
                            style={{
                                background: activeSpecialty
                                    ? `linear-gradient(to top, ${activeSpecialty.color}CC, rgba(0,0,0,0.6))`
                                    : "rgba(0,0,0,0.6)"
                            }}
                        />
                        
                        {/* Content */}
                        <div className="absolute inset-0 p-4 flex items-center justify-between z-10">
                            <div className="flex items-center">
                                {/* Icon next to title */}
                                {activeSpecialty && (
                                    <div className="mr-3 opacity-90">
                                        {activeSpecialty.icon}
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-white drop-shadow-md">
                                    {activeSpecialty ? activeSpecialty.title : "Todas las especialidades"}
                                </h3>
                            </div>
                            <div className={`text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>
                        </div>
                        
                        {/* Color bar */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-1.5 z-10 w-full"
                            style={{ backgroundColor: activeSpecialty?.color || "#cbd5e0" }}
                        />
                    </motion.div>
                    
                    {/* Dropdown list with card-style items - excluding active specialty */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                className="overflow-hidden rounded-xl shadow-lg mb-4 space-y-2"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {dropdownOptions.map(([id, info]) => (
                                    <motion.div
                                        key={id}
                                        className="relative overflow-hidden rounded-xl cursor-pointer h-14 shadow-md"
                                        onClick={() => handleTabClick(id)}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {/* Background image */}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center z-0"
                                            style={{
                                                backgroundImage: `url(${info.image})`,
                                                filter: "brightness(0.6)"
                                            }}
                                        />
                                        
                                        {/* Overlay gradient */}
                                        <div
                                            className="absolute inset-0 z-5 opacity-90"
                                            style={{
                                                background: `linear-gradient(to top, ${info.color}CC, rgba(0,0,0,0.6))`
                                            }}
                                        />
                                        
                                        {/* Content */}
                                        <div className="absolute inset-0 p-4 flex items-center justify-between z-10">
                                            <div className="flex items-center">
                                                {/* Icon */}
                                                <div className="mr-3 opacity-90 text-white">
                                                    {info.icon}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white">{info.title}</h4>
                                                    <p className="text-white text-xs opacity-80 line-clamp-1">
                                                        {info.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Color bar */}
                                        <div
                                            className="absolute bottom-0 left-0 right-0 h-1.5 z-10 w-30"
                                            style={{ backgroundColor: info.color }}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
            
            {/* Desktop view - Grid layout */}
            {!isMobile && (
                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, staggerChildren: 0.1 }}
                >
                    {especialidades.map(([id, info], index) => (
                        <motion.div
                            key={id}
                            className={`relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-all duration-300 group h-66 ${
                                activeTab === id
                                    ? "ring-3 transform scale-[1.02] z-10"
                                    : "hover:shadow-xl bg-white"
                            }`}
                            style={{
                                ringColor: activeTab === id ? info.color : "transparent",
                            }}
                            onClick={() => handleTabClick(id)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 100
                            }}
                            whileHover={{
                                scale: activeTab === id ? 1.03 : 1.05,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.98 }}
                            onMouseEnter={() => setHoveredCard(id)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            {/* Imagen de fondo con mejor calidad y efecto parallax */}
                            <motion.div
                                className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500"
                                initial={{ scale: 1 }}
                                animate={{
                                    scale: hoveredCard === id ? 1.15 : 1.05,
                                    filter: hoveredCard === id ? "brightness(0.7)" : "brightness(0.6)"
                                }}
                                transition={{ duration: 0.7 }}
                                style={{
                                    backgroundImage: `url(${info.image})`,
                                }}
                            />
                            
                            {/* Overlay gradiente */}
                            <div
                                className="absolute inset-0 z-5 opacity-90 transition-opacity duration-300"
                                style={{
                                    background: `linear-gradient(to top, ${info.color}CC, ${activeTab === id ? 'transparent' : 'rgba(0,0,0,0.6)'})`
                                }}
                            />
                            
                            {/* Icono profesional */}
                            <div className="absolute top-4 left-4 z-10 opacity-90">
                                {info.icon}
                            </div>
                            
                            {/* Barra de color */}
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-1.5 z-10"
                                initial={{ width: '0%' }}
                                animate={{ width: activeTab === id ? '100%' : hoveredCard === id ? '50%' : '15%' }}
                                transition={{ duration: 0.4 }}
                                style={{ backgroundColor: info.color }}
                            />
                            
                            {/* Contenido */}
                            <motion.div
                                className="absolute inset-0 p-6 flex flex-col justify-end z-10"
                                initial={{ y: 5 }}
                                animate={{ y: hoveredCard === id ? 0 : 5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.h3
                                    className="text-2xl font-bold text-white mb-2 drop-shadow-md text-center"
                                    initial={{ x: -5, opacity: 0.9 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {info.title}
                                </motion.h3>
                                <motion.p
                                    className="text-white text-sm opacity-90 text-center"
                                    initial={{ opacity: 0.7 }}
                                    animate={{ opacity: hoveredCard === id ? 1 : 0.8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {info.description}
                                </motion.p>
                                
                                {/* Botón de ver especialistas */}
                                <motion.div
                                    className="mt-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: hoveredCard === id ? 1 : 0, y: hoveredCard === id ? 0 : 10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <button
                                        className="px-4 py-1.5 bg-white rounded-full text-sm font-medium shadow-md"
                                        style={{ color: info.color }}
                                    >
                                        Ver especialistas →
                                    </button>
                                </motion.div>
                            </motion.div>
                            
                            {/* Indicador de selección */}
                            {activeTab === id && (
                                <motion.div
                                    className="absolute top-3 right-3 w-4 h-4 rounded-full z-10 flex items-center justify-center"
                                    style={{ backgroundColor: 'white' }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                >
                                    <motion.div
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: info.color }}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.1, type: "spring" }}
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    )
}
