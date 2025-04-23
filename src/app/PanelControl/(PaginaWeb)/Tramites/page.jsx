"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
// Import icons from Lucide React
import { BadgeDollarSign, IdCard, User, WandSparkles, Wand, Award, GraduationCap } from "lucide-react"

// Import individual dashboard components
import AvalCursosDashboard from "../../Components/PaginaWeb/Tramites/AvalCursosDashboard"
import CarnetDashboard from "../../Components/PaginaWeb/Tramites/CarnetDashboard"
import EspecialidadesDashboard from "../../Components/PaginaWeb/Tramites/EspecialidadesDashboard"
import HigienistasDDashboard from "../../Components/PaginaWeb/Tramites/HiginistasDDashboard"
import OdontologosDashboard from "../../Components/PaginaWeb/Tramites/OdontologosDashboard"
import TecnicosDDashboard from "../../Components/PaginaWeb/Tramites/TecnicosDDashboard"
import TramitesDashboard from "../../Components/PaginaWeb/Tramites/TramitesDashboard"

// Dashboard modules data moved directly into the component
const dashboardModules = {
  Tramites: {
    id: "Tramites",
    title: "Trámites",
    color: "#590248",
    image: "/assets/PaginaWeb/Tramites/Tramites.avif",
    icon: "BadgeDollarSign"
  },
  
  Carnet: {
    id: "Carnet",
    title: "Carnet",
    color: "#118AB2",
    image: "/assets/PaginaWeb/Tramites/Carnet.avif",
    icon: "IdCard"
  },
  
  Odontologos: {
    id: "Odontológos",
    title: "Odontologos",
    color: "#073B4C",
    image: "/assets/PaginaWeb/Tramites/Odontologos.avif",
    icon: "User"
  },
  
  HigienistasDentales: {
    id: "HigienistasDentales",
    title: "Higienistas Dentales",
    color: "#037254",
    image: "/assets/PaginaWeb/Tramites/HigienistasD.avif",
    icon: "WandSparkles"
  },

  TecnicosDentales: {
    id: "TecnicosDentales",
    title: "Técnicos Dentales",
    color: "#073B4C",
    image: "/assets/PaginaWeb/Tramites/TecnicosD.avif",
    icon: "Wand"
  },
  
  Especialidades: {
    id: "Especialidades",
    title: "Especialidades",
    color: "#037254",
    image: "/assets/PaginaWeb/Tramites/Especialidades.avif",
    icon: "Award"
  },

  AvalCursos: {
    id: "AvalCursos",
    title: "Aval Cursos",
    color: "#037254",
    image: "/assets/PaginaWeb/Tramites/AvalCursos.avif",
    icon: "GraduationCap"
  }
}

export default function DashboardPanel() {
  // State management
  const [activeModule, setActiveModule] = useState("Tramites")
  const [hoveredCard, setHoveredCard] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Window width state for responsive design
  const [windowWidth, setWindowWidth] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Refs and animations
  const contentRef = useRef(null)
  const controls = useAnimation()

  // Get current module information
  const moduleInfo = dashboardModules[activeModule] || dashboardModules["presentacion"]

  // Function to render the icon based on icon name
  const renderIcon = (iconName, size = 24, color = "white") => {
    switch (iconName) {
      case "BadgeDollarSign":
        return <BadgeDollarSign size={size} color={color} />;
      case "IdCard":
        return <IdCard size={size} color={color} />;
      case "User":
        return <User size={size} color={color} />;
      case "WandSparkles":
        return <WandSparkles size={size} color={color} />;
        case "Wand":
          return <Wand size={size} color={color} />;
          case "Award":
          return <Award size={size} color={color} />;
          case "GraduationCap":
          return <GraduationCap size={size} color={color} />;
          
      default:
        return null;
    }
  };

  // Check for mobile view on mount and resize
  useEffect(() => {
    // Set the initial width
    setWindowWidth(window.innerWidth)
    setIsMobile(window.innerWidth < 768)

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setIsMobile(window.innerWidth < 768)
      // Close dropdown on larger screens
      if (window.innerWidth >= 768) {
        setIsDropdownOpen(false)
      }
    }

    // Add event listener for window resize
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Initialize animations and confetti effect when tab changes
  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 2000)
    controls.start({ opacity: 1, y: 0 })
    return () => clearTimeout(timer)
  }, [activeModule, controls])

  // Generate star animation for the confetti effect
  const generateStars = () => {
    return Array.from({ length: 25 }).map((_, index) => {
      const size = Math.random() * 5 + 2
      const x = Math.random() * 100
      const y = Math.random() * 100
      const delay = Math.random() * 1
      const duration = Math.random() * 3 + 1
      return (
        <motion.div
          key={index}
          className="absolute rounded-full bg-white opacity-0"
          style={{ width: size, height: size, top: `${y}%`, left: `${x}%` }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: duration,
            delay: delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: Math.random() * 3,
          }}
        />
      )
    })
  }

  // Handle tab click for mobile dropdown
  const handleTabClick = (id) => {
    if (isMobile && id === activeModule && !isDropdownOpen) {
      setIsDropdownOpen(!isDropdownOpen)
      return
    }
    setActiveModule(id)
    // Close dropdown after selection on mobile
    if (isMobile) {
      setIsDropdownOpen(false)
    }
  }

  // Filter out the active tab from dropdown options
  const dropdownOptions = Object.entries(dashboardModules).filter(([id]) => id !== activeModule)

  // Render the appropriate dashboard component based on active module
  const renderDashboardComponent = () => {
    switch (activeModule) {
      case "AvalCursos":
        return <AvalCursosDashboard moduleInfo={moduleInfo} />;
      case "Carnet":
        return <CarnetDashboard moduleInfo={moduleInfo} />;
      case "Especilidades":
        return <EspecialidadesDashboard moduleInfo={moduleInfo} />;
      case "HigienistasDentales":
        return <HigienistasDDashboard moduleInfo={moduleInfo} />;
        case "TecnicosDentales":
        return <TecnicosDDashboard moduleInfo={moduleInfo} />;
        case "Tramites":
        return <TramitesDashboard moduleInfo={moduleInfo} />;
        case "Odontologos":
        return <OdontologosDashboard moduleInfo={moduleInfo} />;
      default:
        return <TramitesDashboard moduleInfo={moduleInfo} />;
    }
  };

  return (
    <div className="w-full px-4 md:px-10 py-10 md:py-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-8 md:mb-10 mt-16 md:mt-22"
      >
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
        >
          Sección Trámites
        </motion.h1>
        <motion.p
          className="mt-4 max-w-full mx-auto text-gray-600 text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Gestión de contenidos de la sección <span className="font-bold text-[#C40180]">Trámites</span> del sitio web del Colegio Odontológico de Venezuela
        </motion.p>
      </motion.div>

      {/* Horizontal Navigation Cards for Desktop */}
      {!isMobile && (
        <motion.div
          className="w-full mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center gap-8 overflow-x-auto pb-8">
            {Object.entries(dashboardModules).map(([id, info], index) => (
              <motion.div
                key={id}
                className={`relative mt-2 overflow-hidden rounded-xl shadow-lg cursor-pointer transition-all duration-300 group ${
                  activeModule === id 
                    ? "ring-2 transform scale-[1.02] z-10" 
                    : "hover:shadow-xl bg-white"
                }`}
                style={{
                  ringColor: activeModule === id ? info.color : "transparent",
                  height: "90px",
                  width: "180px",
                  flexShrink: 0,
                  padding: activeModule === id ? "2px" : "0px"
                }}
                onClick={() => setActiveModule(id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  scale: activeModule === id ? 1.03 : 1.05,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setHoveredCard(id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Background Image */}
                <motion.div
                  className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500"
                  initial={{ scale: 1 }}
                  animate={{
                    scale: hoveredCard === id ? 1.15 : 1.05,
                    filter: hoveredCard === id ? "brightness(0.7)" : "brightness(0.6)",
                  }}
                  transition={{ duration: 0.7 }}
                  style={{
                    backgroundImage: `url(${info.image})`,
                  }}
                />
                {/* Card Overlay Gradient */}
                <div
                  className="absolute inset-0 z-5 opacity-90 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(to right, ${info.color}DD, ${activeModule === id ? info.color + "88" : "rgba(0,0,0,0.6)"})`,
                  }}
                />
                {/* Card Content */}
                <motion.div
                  className="absolute inset-0 px-4 flex items-center justify-center z-10"
                  initial={{ y: 5 }}
                  animate={{ y: hoveredCard === id ? 0 : 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-row items-center w-full justify-center gap-2">
                    {/* Icon */}
                    <motion.div
                      initial={{ y: -5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="mb-1"
                    >
                      {renderIcon(info.icon, activeModule === id ? 28 : 24)}
                    </motion.div>
                    
                    {/* Title */}
                    <motion.h3
                      className="text-lg font-bold text-white drop-shadow-md text-center"
                      initial={{ x: -5, opacity: 0.9 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {info.title}
                    </motion.h3>
                  </div>
                </motion.div>
                {/* Active Indicator - Moved to bottom instead of right */}
                {activeModule === id && (
                  <motion.div
                    className="absolute left-0 right-0 bottom-0 h-1 z-10"
                    style={{ backgroundColor: "white" }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Mobile Dropdown */}
      {isMobile && (
        <div className="mb-6">
          {/* Mobile dropdown trigger */}
          <motion.div
            className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-all duration-300 group ${
              isDropdownOpen ? "ring-2" : ""
            }`}
            style={{
              ringColor: isDropdownOpen ? moduleInfo.color : "transparent",
              height: "83px",
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            whileTap={{ scale: 0.98 }}
          >
            {/* Card Background Image */}
            <motion.div
              className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500"
              initial={{ scale: 1 }}
              animate={{
                scale: 1.05,
                filter: "brightness(0.6)",
              }}
              transition={{ duration: 0.7 }}
              style={{
                backgroundImage: `url(${moduleInfo.image})`,
              }}
            />
            {/* Card Overlay Gradient */}
            <div
              className="absolute inset-0 z-5 opacity-90 transition-opacity duration-300"
              style={{
                background: `linear-gradient(to right, ${moduleInfo.color}DD, ${moduleInfo.color + "88"})`,
              }}
            />
            {/* Card Content */}
            <div className="absolute inset-0 px-4 flex items-center justify-between z-10">
              <div className="flex items-center justify-center w-full gap-3">
                {/* Icon */}
                <div className="flex-shrink-0">
                  {renderIcon(moduleInfo.icon, 28)}
                </div>
                {/* Title */}
                <h3 className="text-lg font-bold text-white drop-shadow-md text-center">{moduleInfo.title}</h3>
              </div>
            </div>
            {/* Active Indicator - Moved to bottom */}
            <motion.div
              className="absolute left-0 right-0 bottom-0 h-1 z-10"
              style={{ backgroundColor: "white" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            />
          </motion.div>

          {/* Dropdown list with card-style items */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                className="overflow-hidden rounded-xl shadow-lg mt-2 space-y-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {dropdownOptions.map(([id, info], index) => (
                  <motion.div
                    key={id}
                    className="relative overflow-hidden rounded-xl cursor-pointer h-16 shadow-md"
                    onClick={() => handleTabClick(id)}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Card Background Image */}
                    <motion.div
                      className="absolute inset-0 bg-cover bg-center z-0"
                      style={{
                        backgroundImage: `url(${info.image})`,
                        filter: "brightness(0.6)",
                      }}
                    />
                    {/* Card Overlay Gradient */}
                    <div
                      className="absolute inset-0 z-5 opacity-90"
                      style={{
                        background: `linear-gradient(to right, ${info.color}DD, rgba(0,0,0,0.6))`,
                      }}
                    />
                    {/* Card Content */}
                    <div className="absolute inset-0 px-4 flex items-center justify-center z-10">
                      <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          {renderIcon(info.icon, 22)}
                        </div>
                        {/* Title */}
                        <h3 className="text-lg font-bold text-white drop-shadow-md">{info.title}</h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Dashboard Content Area */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            className="w-full bg-white rounded-xl shadow-xl overflow-hidden relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Confetti Effect */}
            {showConfetti && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">{generateStars()}</div>
            )}

            {/* Colored Top Border */}
            <motion.div
              className="h-1 w-full"
              style={{ backgroundColor: moduleInfo.color }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />

            {/* Content Container */}
            <div className="p-4 md:p-8 h-full overflow-y-auto">
              {renderDashboardComponent()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}