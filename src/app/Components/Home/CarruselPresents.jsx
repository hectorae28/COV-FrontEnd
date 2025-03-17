"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function CarruselPresents() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);

  // Cards
  const slides = [
    {
      imageSrc: "/assets/image.png",
      title: "Colegio de odontologos de guarico eligio nueva directiva",
      buttonText: "Conoce Más",
    },
    {
      imageSrc: "/assets/noticias/normal2.png",
      title: "Jornada Medico-Odontologica organizada por la alcaldia del Municipio Rafaelurdaneta",
      buttonText: "Descubre",
    },
    {
      imageSrc: "/assets/noticias/normal5.png",
      title: "Póliza AMP de Oceánica de Seguros para todo el Gremio Odontológico",
      buttonText: "Explora",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        setFade(true);
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="container mx-auto px-4 flex flex-col items-center mt-10">
      <div className={`flex flex-row items-center w-full h-130 transition-opacity duration-1000 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        {/* Imagen */}
        <div className="w-3/5 p-4 h-full">
          <div className="rounded-lg overflow-hidden shadow-lg h-full">
            <Image
              src={slides[currentSlide].imageSrc}
              alt={slides[currentSlide].title}
              width={300}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Título y botón */}
        <div className="w-2/5 p-4 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-12">
            {slides[currentSlide].title}
          </h2>
          <div className="px-8">
            <div className="bg-gradient-to-l from-[#0184FB] to-[#01A6FD] hover:from-blue-600 hover:to-blue-600 text-white font-bold text-[14px] py-2 px-8 rounded-full inline-block cursor-default transition-all duration-200">
              {slides[currentSlide].buttonText}
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores de navegación */}
      <div className="flex justify-center mt-12 space-x-4 mb-12">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentSlide ? "bg-blue-500" : "bg-white/60"
              }`}
            aria-label={`Ir a diapositiva ${index + 1}`}
            onClick={() => {
              setFade(false);
              setTimeout(() => {
                setCurrentSlide(index);
                setFade(true);
              }, 1000);
            }}
          />
        ))}
      </div>
    </div>
  );
}