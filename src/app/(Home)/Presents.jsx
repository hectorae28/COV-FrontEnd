"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CarruselPresents from "../Components/Home/CarruselPresents";

export default function Presents({ props }) {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="rounded-b-4xl bg-black flex flex-col justify-center relative overflow-hidden">
      {/* Instagram */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute top-24 sm:top-24 md:top-28 lg:top-28 xl:top-32 right-4 sm:right-8 md:right-6 lg:right-6 z-100"
          >
            <a
              href="https://www.instagram.com/elcovorg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                whileHover={{ scale: 1 }}
                className="flex items-center bg-[#41023B]/80 hover:bg-[#41023B] text-white/90 font-bold text-[10px] sm:text-[11px] md:text-[12px] py-1 px-2 sm:px-3 md:px-4 rounded-full transition-all duration-200 hover:text-white cursor-pointer shadow-md backdrop-blur-sm border border-white/10"
              >
                <span className="mr-1 sm:mr-2">Síguenos en Instagram</span>
                <Image
                  src="/assets/icons/instagram.png"
                  alt="Instagram"
                  width={16}
                  height={16}
                  className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform duration-300 hover:rotate-12"
                />
              </motion.button>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carrusel */}
      <CarruselPresents props={props} />
    </div>
  );
}
