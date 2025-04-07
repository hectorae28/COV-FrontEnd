"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar, Play, Pause } from "lucide-react";
import LineaTPresi from "../../Components/SobreCOV/LineaTPresi";
import { motion, AnimatePresence } from "framer-motion";
import { fetchPresidentes } from "../../../api/endpoints/landingPage";

const LineaTiempo = () => {
  // const presidentes = LineaTPresi.map((presidente, index) => ({
  //   id: index + 1,
  //   nombre: presidente.title,
  //   periodo: presidente.year,
  //   logros: presidente.description,
  //   imagen_url: presidente.image,
  // }));
  const [presidentes, setPresidentes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const gridRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const presidentes = await fetchPresidentes();
        setPresidentes(presidentes.data);
        setIsLoading(false);
        setIsAutoPlaying(true);
      } catch (error) {
        console.error("Error al cargar presidentes:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Auto-play functionality with 2-second interval (only on desktop)
  useEffect(() => {
    let timer;
    let progressTimer;

    if (isAutoPlaying && !isMobile) {
      // Reset progress
      setProgress(0);

      // Progress animation - update more frequently for smoother animation
      progressTimer = setInterval(() => {
        setProgress((prev) => Math.min(prev + 2.5, 100)); // Increased increment for 2-second cycle
      }, 50);

      // Slide change timer - reduced to 2 seconds
      timer = setTimeout(() => {
        handleNext();
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [isAutoPlaying, currentIndex, isMobile]);

  // Disable auto-play on mobile
  useEffect(() => {
    if (isMobile && isAutoPlaying) {
      setIsAutoPlaying(false);
    }
  }, [isMobile, isAutoPlaying]);

  // Scroll to ensure current president is visible in the grid
  useEffect(() => {
    if (gridRef.current) {
      const grid = gridRef.current;
      const activeElement = grid.querySelector(
        `[data-index="${currentIndex}"]`
      );

      if (activeElement) {
        // Calculate the position to scroll to
        const elementRect = activeElement.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();

        // Only scroll if the element is not fully visible
        if (
          elementRect.bottom > gridRect.bottom ||
          elementRect.top < gridRect.top
        ) {
          activeElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (!isAnimating) {
      setDirection("next");
      setIsAnimating(true);
      setProgress(0);
      setTimeout(() => {
        setCurrentIndex((currentIndex + 1) % presidentes.length);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handlePrev = () => {
    if (!isAnimating) {
      setDirection("prev");
      setIsAnimating(true);
      setProgress(0);
      setTimeout(() => {
        setCurrentIndex(
          (currentIndex - 1 + presidentes.length) % presidentes.length
        );
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleSelectPresident = (index) => {
    if (index !== currentIndex && !isAnimating) {
      setDirection(index > currentIndex ? "next" : "prev");
      setIsAnimating(true);
      setProgress(0);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsAnimating(false);
      }, 300);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };
  if (isLoading) {
    return <div className="text-center py-8">Cargando presidentes...</div>;
  }

  if (presidentes.length === 0) {
    return (
      <div className="text-center py-8">
        No se pudieron cargar los presidentes.
      </div>
    );
  }
  const selected = presidentes[currentIndex];
  // Extract start and end years for timeline
  const startYear = presidentes[0].periodo.split("-")[0];
  const endYear =
    presidentes[presidentes.length - 1].periodo.split("-")[1] || "Actual";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.h1
        className="mt-22 md:mt-28 text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Galería de Presidentes
      </motion.h1>

      {/* Main Content Section with Card Design - Height controlled */}
      <motion.div
        className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {/* Subtle pattern background */}
        <div className="absolute inset-0 bg-[url('/subtle-pattern.png')] opacity-5 pointer-events-none" />

        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Side - President Image and Basic Info */}
          <div className="lg:w-2/5 p-4 sm:p-6 md:p-8 flex items-center justify-center bg-gray-50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-8 w-32 h-32 bg-[#590248]/45 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-[-18] w-40 h-40 bg-[#590248]/45 rounded-full translate-x-1/3 translate-y-1/3"></div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{
                  opacity: 0,
                  x: direction === "next" ? 100 : -100,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: direction === "next" ? -100 : 100,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                className="flex flex-col items-center justify-center z-10 my-auto"
              >
                {/* Improved image container without corner lines */}
                <div className="relative group mb-4 sm:mb-6 w-full max-w-[200px] sm:max-w-xs mx-auto">
                  {/* Elegant shadow and glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C40180] to-[#590248] blur-xl rounded-full transform scale-90 opacity-70"></div>

                  {/* Image with improved frame */}
                  <div className="relative z-10 rounded-xl overflow-hidden shadow-lg">
                    <div className="p-1 bg-gradient-to-br from-[#C40180] to-[#590248] rounded-xl">
                      <div className="bg-white p-2 rounded-lg">
                        <img
                          src={
                            selected.imagen_url
                              ? `http://localhost:8000${selected.imagen_url}`
                              : "/assets/presidente.webp"
                          }
                          alt={selected.nombre}
                          className="w-full aspect-square object-cover rounded-md transform group-hover:scale-105 transition-all duration-700 ease-out"
                        />
                      </div>
                    </div>

                    {/* Decorative accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/50 to-transparent rounded-b-lg"></div>
                  </div>
                </div>

                <div className="text-center">
                  {/* Period with icon */}
                  <div className="flex items-center justify-center gap-4 text-[#590248] mb-2 sm:mb-4">
                    <div className="flex items-center justify-center p-1.5 rounded-md text-white bg-gradient-to-br from-[#C40180] to-[#590248] shadow-sm">
                      <Calendar size={16} />
                    </div>
                    <p className="text-sm sm:text-base font-medium">
                      {selected.periodo}
                    </p>
                  </div>

                  {/* Name with animated underline */}
                  <div className="relative">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                      {selected.nombre}
                    </h2>
                    <motion.div
                      className="h-0.5 bg-gradient-to-r from-[#C40180] to-[#590248] mt-1 mx-auto"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side - Timeline Navigation */}
          <div className="lg:w-3/5 p-4 sm:p-6 md:p-8 flex flex-col rounded-b-xl lg:rounded-bl-none lg:rounded-r-xl">
            {/* Timeline Navigation */}
            <div className="h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#C40180] rounded-full mr-2"></span>
                  Línea de Tiempo Presidencial
                </h4>

                {/* Improved auto-play button - only visible on desktop */}
                {!isMobile && (
                  <motion.button
                    onClick={toggleAutoPlay}
                    className={`flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 shadow-sm ${
                      isAutoPlaying
                        ? "bg-gradient-to-r from-[#590248] to-[#590248] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isAutoPlaying ? (
                      <>
                        <Pause size={14} className="animate-pulse" />
                        <span>Detener</span>
                      </>
                    ) : (
                      <>
                        <Play size={14} />
                        <span>Auto-reproducir</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>

              {/* Improved Timeline Indicator with increased height */}
              <div className="relative h-6 sm:h-8 bg-gray-100 rounded-full w-full mb-4 sm:mb-6 overflow-hidden shadow-inner">
                {/* Progress bar for auto-play */}
                {isAutoPlaying && !isMobile && (
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gray-300"
                    style={{ width: `${progress}%` }}
                  />
                )}

                {/* Position indicator - improved with gradient */}
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#C40180] to-[#590248] rounded-full"
                  style={{
                    width: `${
                      (currentIndex / (presidentes.length - 1)) * 100
                    }%`,
                    transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />

                {/* Timeline dots - improved visibility and size */}
                {presidentes.map((_, index) => {
                  const isCurrent = index === currentIndex;
                  const isPast = index < currentIndex;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectPresident(index)}
                      className={`
                        absolute top-1/2 transform -translate-y-1/2 rounded-full transition-all duration-300
                        ${
                          isCurrent
                            ? "w-5 h-5 bg-white border-2 border-[#C40180] shadow-lg z-10"
                            : "w-3 h-3"
                        }
                        ${
                          isPast
                            ? "bg-[#C40180]"
                            : "bg-gray-200 hover:bg-gray-400"
                        }
                        hover:scale-110
                      `}
                      style={{
                        left: `${(index / (presidentes.length - 1)) * 100}%`,
                      }}
                      aria-label={`Ver presidente ${index + 1}`}
                    />
                  );
                })}
              </div>

              {/* Year Timeline */}
              <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 w-full mb-4 sm:mb-6">
                <span className="font-medium bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">
                  {startYear}
                </span>
                <span className="font-medium bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">
                  {endYear}
                </span>
              </div>

              {/* President Grid Selection with Scrolling - Fixed scaling issue */}
              <div
                ref={gridRef}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-6 overflow-y-auto custom-scrollbar pr-2"
                style={{
                  maxHeight: "190px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                }}
              >
                {presidentes.map((presidente, index) => {
                  const isCurrent = index === currentIndex;
                  const isHovered = hoveredIndex === index;

                  return (
                    <motion.div
                      key={presidente.id}
                      data-index={index}
                      onClick={() => handleSelectPresident(index)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="relative cursor-pointer"
                      animate={{
                        scale: isCurrent ? 1.05 : 1,
                        y: isCurrent ? -2 : 0, // Reduced the y-offset to prevent cutting off
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      {/* Background effect */}
                      <div
                        className={`
                          absolute inset-0
                          opacity-0 rounded-lg
                          transition-all duration-300 ease-out
                          ${isCurrent || isHovered ? "opacity-100" : ""}
                        `}
                      />
                      <div className="flex flex-col items-center p-2">
                        {/* Image container with improved styling */}
                        <div
                          className={`
                            relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden mb-1 sm:mb-2 transition-all duration-300
                            ${
                              isCurrent
                                ? `ring-2 sm:ring-3 ring-[#590248] shadow-lg`
                                : "ring-1 ring-gray-200"
                            }
                            ${
                              isHovered && !isCurrent
                                ? "ring-2 ring-[#590248]"
                                : ""
                            }
                          `}
                        >
                          <img
                            src={
                              presidente.imagen_url
                                ? `http://localhost:8000${presidente.imagen_url}`
                                : "/assets/presidente.webp"
                            }
                            alt={presidente.nombre}
                            className={`
                              w-full h-full object-cover transition-transform duration-500
                              ${isHovered ? "scale-110" : "scale-100"}
                            `}
                          />
                        </div>
                        {/* Period text */}
                        <p
                          className={`
                            text-center text-[10px] sm:text-xs transition-all duration-300 max-w-[60px] truncate
                            ${
                              isCurrent
                                ? "text-[#590248] font-medium"
                                : "text-gray-500"
                            }
                                                        ${
                                                          isHovered &&
                                                          !isCurrent
                                                            ? "text-[#590248]"
                                                            : ""
                                                        }
                          `}
                        >
                          {presidente.periodo.split("-")[0]}
                        </p>
                        {/* Animated underline */}
                        <div
                          className={`
                            h-0.5 bg-[#590248] mt-0.5 sm:mt-1 transition-all duration-300 ease-out
                            ${isCurrent || isHovered ? "w-full" : "w-0"}
                          `}
                        ></div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Navigation Arrows and Counter */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 mt-auto">
                <motion.button
                  onClick={handlePrev}
                  className="p-2 sm:p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#590248] shadow-sm"
                  aria-label="Presidente anterior"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft size={16} className="sm:hidden" />
                  <ChevronLeft size={20} className="hidden sm:block" />
                </motion.button>

                <div className="flex flex-col items-center">
                  <div className="text-[10px] sm:text-xs bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full font-medium shadow-sm">
                    {currentIndex + 1} de {presidentes.length}
                  </div>
                  {!isMobile && isAutoPlaying && (
                    <div className="text-[8px] sm:text-[10px] text-gray-500 mt-1">
                      Cambiando cada 2 segundos
                    </div>
                  )}
                </div>

                <motion.button
                  onClick={handleNext}
                  className="p-2 sm:p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#590248]/50 shadow-sm"
                  aria-label="Siguiente presidente"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight size={16} className="sm:hidden" />
                  <ChevronRight size={20} className="hidden sm:block" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #590248;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #590248;
        }
      `}</style>
    </div>
  );
};

export default LineaTiempo;
