"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";
import newsItems from "../Components/Home/NoticiasData";
import { fetchNoticias } from "../../api/endpoints/landingPage";

const Noticias = ({ props }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const carouselRef = useRef(null);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef(null);
  const [screenSize, setScreenSize] = useState("lg");
  const newsItems = props;

  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        setWidth(
          carouselRef.current.scrollWidth - carouselRef.current.offsetWidth
        );
      }

      if (window.innerWidth < 640) {
        setScreenSize("sm");
      } else if (window.innerWidth < 1024) {
        setScreenSize("md");
      } else {
        setScreenSize("lg");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Autoplay functionality - changed to 5 seconds
  useEffect(() => {
    // Clear any existing interval first
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }

    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Changed to 5 seconds
    }
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, newsItems.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1
    );
    resetAutoplayTimer();
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? newsItems.length - 1 : prevIndex - 1
    );
    resetAutoplayTimer();
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    resetAutoplayTimer();
  };

  // Reset autoplay timer when manually navigating
  const resetAutoplayTimer = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      if (autoplay) {
        autoplayRef.current = setInterval(() => {
          setCurrentIndex((prevIndex) =>
            prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1
          );
        }, 5000); // Changed to 5 seconds
      }
    }
  };

  // Handle pause/resume autoplay when hovering
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  return (
    <section className="py-8 bg-[#F9F9F9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <motion.span
            className="text-xs sm:text-sm font-medium text-[#C40180] uppercase tracking-wider"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Mantente Informado
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Noticias y Actualizaciones
          </motion.h2>

          <motion.p
            className="mt-4 sm:mt-6 max-w-2xl mx-auto text-gray-600 text-sm sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            Descubre las últimas noticias, eventos y actualizaciones importantes
            para la comunidad odontológica venezolana.
          </motion.p>
        </div>

        {/* Main Carousel Container with Side Navigation for MD and LG */}
        <div className="relative">
          {/* Navigation Buttons for MD and LG screens - Outside at the middle sides */}
          <div className="hidden md:block">
            <motion.button
              className=" cursor-pointer absolute left-[-100] top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#C40180] shadow-lg hover:bg-gray-50 transition-all border border-gray-200"
              whileHover={{ scale: 1.1, x: -18 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>

            <motion.button
              className=" cursor-pointer absolute right-[-100] top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#C40180] shadow-lg hover:bg-gray-50 transition-all border border-gray-200"
              whileHover={{ scale: 1.1, x: 18 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Carousel Content */}
          <div
            className="relative overflow-hidden rounded-xl bg-white shadow-xl border border-gray-100"
            ref={carouselRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Carousel Slider */}
            <div className="relative w-full h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-full"
                >
                  <div className={`flex flex-col md:flex-row w-full`}>
                    {/* Image Section */}
                    <div className="w-full md:w-1/2 h-64 md:h-96 relative overflow-hidden">
                      <img
                        src={`http://localhost:8000${newsItems[currentIndex]?.imagen_portada_url}`}
                        alt={newsItems[currentIndex]?.titulo}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/800x600?text=News+Image";
                        }}
                      />

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    {/* Content Section */}
                    <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                      {/* Date & Time Badge - Moved outside the image */}
                      <div className="mb-4 flex items-center space-x-2 text-sm">
                        <div className="flex items-center text-[#C40180]">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="font-medium text-gray-800">
                            {newsItems[currentIndex]?.created_at}
                          </span>
                        </div>
                        <span className="text-gray-400">|</span>
                        <div className="flex items-center text-[#C40180]">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="font-medium text-gray-800">
                            {newsItems[currentIndex]?.created_at}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl md:text-2xl line-clamp-3 lg:text-3xl font-bold text-gray-800 mb-4">
                          {newsItems[currentIndex]?.titulo}
                        </h3>

                        <p className="text-gray-600 line-clamp-4 text-sm md:text-base mb-6">
                          {newsItems[currentIndex]?.contenido}
                        </p>
                      </div>

                      {/* Read More Button - Now aligned to the right */}
                      <div className="mt-auto flex justify-end">
                        <motion.button
                          className=" cursor-pointer flex items-center text-[#C40180] font-medium text-sm md:text-base group"
                          whileHover={{ x: 5 }}
                        >
                          Leer más
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress Bar - Updated to 5 seconds */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#C40180] to-[#590248]"
              initial={{ width: 0 }}
              key={currentIndex} // Important: forces animation restart with each slide change
              animate={{
                width: "100%",
                transition: {
                  duration: 5, // Changed to 5 seconds to match autoplay
                  ease: "linear",
                },
              }}
            />
          </div>
        </div>

        {/* Navigation Controls for Mobile (SM) - Outside and below the carousel */}
        <div className="flex md:hidden justify-center items-center mt-6 space-x-4">
          <motion.button
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#C40180] shadow-md hover:bg-gray-50 transition-all border border-gray-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.button>

          {/* Progress Indicator Dots */}
          <div className="flex justify-center space-x-2">
            {newsItems &&
              newsItems.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    currentIndex === index ? "bg-[#C40180]" : "bg-gray-300"
                  }`}
                  onClick={() => handleDotClick(index)}
                  whileHover={{ scale: 1.2 }}
                  animate={{
                    scale: currentIndex === index ? [1, 1.2, 1] : 1,
                    transition: {
                      duration: 0.5,
                      repeat: currentIndex === index ? Infinity : 0,
                      repeatType: "reverse",
                    },
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
          </div>

          <motion.button
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#C40180] shadow-md hover:bg-gray-50 transition-all border border-gray-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Thumbnails Preview - Only for desktop */}
        <div className="hidden md:flex justify-center mt-6 gap-2">
          {newsItems &&
            newsItems.map((item, index) => (
              <motion.div
                key={index}
                className={`relative cursor-pointer rounded-md overflow-hidden ${
                  currentIndex === index
                    ? "ring-2 ring-[#C40180]"
                    : "opacity-70"
                }`}
                onClick={() => handleDotClick(index)}
                whileHover={{ scale: 1.05, opacity: 1 }}
              >
                <div className="w-20 h-12 relative">
                  <img
                    src={`http://localhost:8000${item.imagen_portada_url}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {currentIndex === index && (
                    <motion.div
                      className="absolute inset-0 bg-[#C40180]/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </div>
              </motion.div>
            ))}
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-8 sm:mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="px-6 sm:px-8 py-2 sm:py-3 cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white text-sm sm:text-base font-medium rounded-full hover:shadow-lg transition-all duration-300 flex items-center mx-auto"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(196, 1, 128, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            Ver Todas las Noticias
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Noticias;
