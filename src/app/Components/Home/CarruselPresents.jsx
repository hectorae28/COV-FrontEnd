"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function CarruselPresents({ props }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const autoPlayRef = useRef(null);
  const slideRef = useRef(null);
  const slides = props;

  const minSwipeDistance = 50;

  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, []);
  const handleMouseEnter = () => {
    setIsHovering(true);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (!autoPlayRef.current) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
  };

  const onTouchStart = (e) => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }

    if (!autoPlayRef.current) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };
  return (
    <div
      ref={slideRef}
      className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[740px] overflow-hidden mt-16 sm:mt-18 md:mt-20"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0">
              <Image
                src={`http://localhost:8000${slides[currentSlide]?.imagen_portada_url}`}
                alt={slides[currentSlide].titulo}
                fill
                unoptimized
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  width: "100%",
                  height: "100%",
                }}
                priority
                quality={100}
                draggable={false}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

            {/* Contenido truncate  */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.1 }}
              className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-10 text-white"
            >
              <h2 className="text-xl line-clamp-2 sm:text-2xl md:text-3xl lg:text-4xl xl:text-[48px] font-bold px-2 sm:px-4 md:px-8 lg:px-16 xl:px-20">
                {slides[currentSlide].titulo}
              </h2>
              <p className="text-sm line-clamp-2 sm:text-base md:text-xl lg:text-2xl xl:text-[28px] px-2 sm:px-4 md:px-8 lg:px-16 xl:px-20 mt-1 sm:mt-2">
                {slides[currentSlide].contenido}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-2 sm:mt-3 md:mt-4 lg:mt-6 xl:mt-8 bg-gradient-to-br from-[#D7008A] to-[#41023B] text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg py-1.5 sm:py-2 px-4 sm:px-5 md:px-6 lg:px-8 rounded-full hover:shadow-lg transition-all duration-100 ml-2 sm:ml-4 md:ml-8 lg:ml-16 xl:ml-28 cursor-pointer"
              >
                Más información
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Desplazamiento */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex justify-between px-4 opacity-0">
        <div className="bg-white/20 rounded-full p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>
        <div className="bg-white/20 rounded-full p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 lg:bottom-6 right-6 sm:right-4 md:right-8 lg:right-12 flex space-x-1 sm:space-x-1.5 md:space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 sm:h-2.5 md:h-3 rounded-full transition-all duration-300 cursor-pointer ${
              currentSlide === index
                ? "bg-white w-4 sm:w-6 md:w-8"
                : "bg-white/30 w-2 sm:w-2.5 md:w-3"
            }`}
          />
        ))}
      </div>

      {/* Flechas */}
      <div
        className={`transition-opacity duration-300 ${
          isHovering ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Botón Izquierdo */}
        <button
          onClick={() =>
            setCurrentSlide(
              (prev) => (prev - 1 + slides.length) % slides.length
            )
          }
          className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-1 sm:p-2 md:p-3 transition-all duration-100 cursor-pointer"
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 lg:h-10 lg:w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Botón Derecho */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-1 sm:p-2 md:p-3 transition-all duration-100 cursor-pointer"
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 lg:h-10 lg:w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
