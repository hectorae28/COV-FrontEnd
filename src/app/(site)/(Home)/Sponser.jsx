"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Globe, Instagram } from "lucide-react";
import { fetchSponsors } from "@/api/endpoints/landingPage";
import Link from "next/link";

const Sponsor = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [aliados, setAliados] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const wheelRef = useRef(null);
  const modalRef = useRef(null);
  const autoplayTimerRef = useRef(null);

  const calculatePositions = () => {
    const radius = 500;
    const angleStep = (2 * Math.PI) / aliados.length;

    return aliados.map((aliado, index) => {
      let relativeIndex = index - activeIndex;

      if (relativeIndex > aliados.length / 2) relativeIndex -= aliados.length;
      if (relativeIndex < -aliados.length / 2) relativeIndex += aliados.length;

      const angle = relativeIndex * angleStep;

      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius - radius;

      const normalizedZ = (z + radius) / (2 * radius);
      const scale = 0.5 + normalizedZ * 0.5;

      const opacity = index === activeIndex ? 1.0 : 0.5 + normalizedZ * 0.3;

      return {
        ...aliado,
        x,
        z,
        scale,
        opacity,
        angle,
        isActive: index === activeIndex,
      };
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSponsors();
        setAliados(data.data);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoaded || !isAutoplay || modalOpen) return;

    autoplayTimerRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % aliados.length);
    }, 3000);

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isLoaded, isAutoplay, aliados.length, modalOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalOpen(false);
      }
    };

    if (modalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalOpen]);

  const handleClickLogo = (index) => {
    setActiveIndex(index);
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 5000);
  };

  const handleOpenModal = (sponsor) => {
    setSelectedSponsor(sponsor);
    setModalOpen(true);
    setIsAutoplay(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setIsAutoplay(true), 1000);
  };

  const handleMouseDown = (e) => {
    if (modalOpen) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setIsAutoplay(false);
  };

  const handleTouchStart = (e) => {
    if (modalOpen) return;
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setIsAutoplay(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || modalOpen) return;

    const dragDistance = e.clientX - dragStartX;
    if (Math.abs(dragDistance) > 50) {
      const direction = dragDistance > 0 ? -1 : 1;
      setActiveIndex((prevIndex) => {
        const newIndex =
          (prevIndex + direction + aliados.length) % aliados.length;
        return newIndex;
      });
      setDragStartX(e.clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || modalOpen) return;

    const dragDistance = e.touches[0].clientX - dragStartX;
    if (Math.abs(dragDistance) > 30) {
      const direction = dragDistance > 0 ? -1 : 1;
      setActiveIndex((prevIndex) => {
        const newIndex =
          (prevIndex + direction + aliados.length) % aliados.length;
        return newIndex;
      });
      setDragStartX(e.touches[0].clientX);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (!modalOpen) {
      setTimeout(() => setIsAutoplay(true), 3000);
    }
  };

  const handleChevronClick = (direction) => {
    if (modalOpen) return;
    
    setActiveIndex((prevIndex) => {
      const newIndex =
        (prevIndex + direction + aliados.length) % aliados.length;
      return newIndex;
    });
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 5000);
  };

  const logoPositions = calculatePositions();
  
  if (!isLoaded) {
    return <div className="text-center py-8">Cargando Aliados...</div>;
  }
  
  // Obtener el sponsor activo
  const activeSponsor = aliados[activeIndex];

  return (
    <section className="overflow-hidden bg-[#f9f9f9]">
      <div className={`container mx-auto mb-10 ${modalOpen ? 'relative' : ''}`}>
        <div className="text-center mt-18">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Nuestros Aliados
          </motion.h2>

          <motion.p
            className="mt-6 max-w-2xl mx-auto text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            Contamos con el respaldo de las marcas más reconocidas de la
            industria dental, quienes comparten nuestro compromiso con la
            excelencia profesional y la salud bucal.
          </motion.p>
        </div>

        <div className={`relative flex flex-col justify-center items-center h-76 perspective-3000 cursor-grab group ${modalOpen ? 'filter blur-sm pointer-events-none' : ''}`}>
          <button
            className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleChevronClick(-1)}
            aria-label="Previous Sponsor"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <div
            className="relative w-full h-full"
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
                const zIndex = Math.round(aliado.z + 1000);

                return (
                  <div
                    key={aliado.id}
                    className={`absolute flex flex-col items-center justify-center transition-all duration-500 ease-in-out cursor-pointer
                                ${aliado.isActive ? "z-[1005]" : ""}`}
                    style={{
                      transform: `translateX(${aliado.x}px) translateZ(${aliado.z}px) scale(${aliado.scale})`,
                      opacity: aliado.opacity,
                      zIndex,
                    }}
                  >
                    <div 
                      className={`bg-white rounded-xl shadow-lg flex items-center justify-center 
                               ${aliado.isActive ? "ring-1 ring-[#BFC8D0] shadow-xl" : ""}`}
                      style={{
                        width: `${aliado.isActive ? 320 : 180}px`,
                        height: `${aliado.isActive ? 240 : 160}px`,
                      }}
                      onClick={() => 
                        aliado.isActive
                          ? handleOpenModal(aliado)
                          : handleClickLogo(
                              aliados.findIndex((a) => a.id === aliado.id)
                            )
                      }
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACK_HOST}${aliado.logo_url}`}
                        alt={`Logo de ${aliado.name}`}
                        width={aliado.isActive ? 180 : 100}
                        height={aliado.isActive ? 160 : 80}
                        className="object-contain max-w-full max-h-full transition-all duration-500"
                        priority={aliado.isActive}
                      />
                    </div>
                    
                    {/* Nombre del sponsor activo */}
                    {aliado.isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 bg-gradient-to-r from-[#C40180] to-[#590248] rounded-full px-6 py-2 shadow-md"
                      >
                        <span className="text-white font-medium">{aliado.name}</span>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleChevronClick(1)}
            aria-label="Next Sponsor"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        
        {/* Modal de información del sponsor */}
        <AnimatePresence>
          {modalOpen && selectedSponsor && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center px-4 pb-10 pt-32"
              style={{ backdropFilter: "blur(0px)" }}
            >
              <div 
                ref={modalRef}
                className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] w-full max-w-3xl mx-auto p-6 relative"
              >
                {/* Botón de cerrar */}
                <button 
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 transition-colors z-10 shadow-md border border-gray-100"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
                
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Imagen del sponsor */}
                  <div className="md:w-1/2 flex items-center justify-center">
                    <div className="relative w-full h-48 md:h-56 p-3">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACK_HOST}${selectedSponsor.logo_url}`}
                        alt={selectedSponsor.name || "Sponsor"}
                        layout="fill"
                        objectFit="contain"
                        priority={true}
                      />
                    </div>
                  </div>
                  
                  {/* Información del sponsor */}
                  <div className="md:w-1/2 flex flex-col justify-between space-y-6">
                    {/* Nombre del sponsor */}
                    <h3 className="text-3xl md:mt-8 font-bold bg-gradient-to-r from-[#C40180] to-[#590248] bg-clip-text text-transparent text-center">
                      {selectedSponsor.name || "Sponsor"}
                    </h3>
                    
                    {/* Botones de acción - Siempre visibles pero se deshabilitan si no hay datos */}
                    <div className="space-y-3">
                      <a
                        href={selectedSponsor.link ? selectedSponsor.link : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => !selectedSponsor.link && e.preventDefault()}
                        className={`w-full py-3 px-4 rounded-xl transition-all flex items-center justify-between group 
                        ${selectedSponsor.link ? 'bg-gradient-to-r from-[#C40180] to-[#590248] text-white hover:shadow-lg cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      >
                        <div className="flex items-center">
                          <Globe className="w-5 h-5 mr-3" />
                          <span className="font-medium">Sitio Web</span>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedSponsor.link ? 'bg-white/20' : 'bg-gray-200'}`}>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </a>
                      
                      <a
                        href={selectedSponsor.instagram ? `https://instagram.com/${selectedSponsor.instagram.replace('@', '')}` : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => !selectedSponsor.instagram && e.preventDefault()}
                        className={`w-full py-3 px-4 rounded-xl transition-all flex items-center justify-between group 
                        ${selectedSponsor.instagram ? 'bg-gradient-to-r from-[#833AB4] to-[#C13584] text-white hover:shadow-lg cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      >
                        <div className="flex items-center">
                          <Instagram className="w-5 h-5 mr-3" />
                          <span className="font-medium">Instagram</span>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedSponsor.instagram ? 'bg-white/20' : 'bg-gray-200'}`}>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Sponsor;