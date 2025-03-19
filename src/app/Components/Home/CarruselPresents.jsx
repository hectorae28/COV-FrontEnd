"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    image: "/assets/noticias/ancho.png",
    title: "Bienvenidos al Colegio de Odontólogos",
    description: "Comprometidos con la excelencia en la salud bucal"
  },
  {
    id: 2,
    image: "/assets/noticias/ancho2.png",
    title: "Próximos Eventos",
    description: "Mantente actualizado con nuestros cursos y certificaciones"
  },
  {
    id: 3,
    image: "/assets/noticias/ancho3.png",
    title: "Nueva Ley de Odontología",
    description: "Conoce los cambios importantes para tu práctica profesional"
  }
];

export default function CarruselPresents() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div
      className="relative w-full h-[740px] overflow-hidden mt-20"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                fill
                unoptimized
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                  width: '100%',
                  height: '100%'
                }}
                priority
                quality={100}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

            {/* Contenido del slide */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.1 }}
              className="absolute bottom-0 left-0 right-0 p-10 text-white"
            >
              <h2 className="text-3xl md:text-[48px] font-bold px-4 md:px-20">{slides[currentSlide].title}</h2>
              <p className="text-xl md:text-[28px] px-4 md:px-20">{slides[currentSlide].description}</p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 md:mt-8 bg-gradient-to-br from-[#D7008A] to-[#41023B] text-white font-bold py-2 px-8 rounded-full hover:shadow-lg transition-all duration-100 ml-4 md:ml-28 cursor-pointer"
              >
                Más información
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicadores */}
      <div className="absolute bottom-6 right-4 md:right-12 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
              currentSlide === index ? 'bg-white w-8' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Desplazamiento */}
      <div className={`transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>

        {/* Botón Izquierdo */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-3 transition-all duration-100 cursor-pointer"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Botón Derecho */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-3 transition-all duration-100 cursor-pointer"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}