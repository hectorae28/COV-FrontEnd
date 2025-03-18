"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function CarruselPresents() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);
  const timerRef = useRef(null);

  // Cards
  const slides = [
    {
      imageSrc: "/assets/image.png",
      title: "Colegio de odontologos de guarico eligio nueva directiva",
      buttonText: "Conoce Más",
    },
    {
      imageSrc: "/assets/noticias/normal3.png",
      title: "Jornada Medico-Odontologica organizada por la alcaldia del Municipio Rafael Urdaneta",
      buttonText: "Descubre",
    },
    {
      imageSrc: "/assets/noticias/normal5.png",
      title: "Póliza AMP de Oceánica de Seguros para todo el Gremio Odontológico",
      buttonText: "Explora",
    },
  ];

  const startAutoSlideTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        setFade(true);
      }, 1000);
    }, 3000);
  };

  useEffect(() => {
    startAutoSlideTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const goToSlide = (index) => {
    setFade(false);
    setTimeout(() => {
      setCurrentSlide(index);
      setFade(true);

      startAutoSlideTimer();
    }, 3000);
  };

  const goToPrevSlide = () => {
    const newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    goToSlide(newIndex);
  };

  const goToNextSlide = () => {
    const newIndex = (currentSlide + 1) % slides.length;
    goToSlide(newIndex);
  };

  return (
    <div className="container mx-auto flex flex-col items-center mt-10 relative group">
      <div className={`flex flex-row items-center w-full h-[500px] px-12 transition-opacity duration-1000 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        {/* Imagen */}
        <div className="w-3/4 p-4 h-full">
          <div className="overflow-hidden h-full relative">
            <Image
              src={slides[currentSlide].imageSrc}
              alt={slides[currentSlide].title}
              layout="fill"
              objectFit="contain"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Título y botón */}
        <div className="w-2/5 p-4 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-12">
            {slides[currentSlide].title}
          </h2>
          <div className="px-8">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-600 text-white font-bold text-[14px] py-2 px-8 rounded-full inline-block cursor-pointer transition-all duration-200">
              {slides[currentSlide].buttonText}
            </div>
          </div>
        </div>
      </div>

      {/* Botones de navegación */}
      <button 
        onClick={goToPrevSlide} 
        className="absolute -left-12 top-2/5 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <FaChevronLeft size={24} />
      </button>
      
      <button 
        onClick={goToNextSlide} 
        className="absolute -right-12 top-2/5 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <FaChevronRight size={24} />
      </button>

      {/* Indicadores de navegación */}
      <div className="flex justify-center gap-2 mt-8 mb-12">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 ${
              index === currentSlide ? 'bg-gradient-to-br from-blue-400 to-blue-600 w-6' : 'bg-gray-200'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Ver diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}