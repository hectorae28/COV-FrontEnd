"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import PanelAdmin from "../PanelAdmin";
import Colegiados from "../Colegiados";
import BackgroundAnimation from "@/Components/Home/BackgroundAnimation";
import InfoSection from "@/Components/Home/InfoSection";

export default function LoginScreen() {
  const [showLogin, setShowLogin] = useState(false);
  const [direction, setDirection] = useState("right");
  const [isClosing, setIsClosing] = useState(false);

  const handleSignIn = (slideDirection) => {
    setDirection(slideDirection);
    setShowLogin(true);
    setIsClosing(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowLogin(false);
      setIsClosing(false);
    }, 10);
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Animation */}
        <BackgroundAnimation />

        {/* Backdrop blur */}
        <div className="absolute inset-0 bg-white/13 backdrop-blur-md" />

        {/* Decorative elements - Responsive adjustments */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-20 -left-20 
              w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 
              rounded-full bg-gradient-to-br from-[#D7008A]/20 to-[#41023B]/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute -bottom-40 -right-20 
              w-[24rem] h-[24rem] sm:w-[28rem] sm:h-[28rem] md:w-[30rem] md:h-[30rem] 
              rounded-full bg-gradient-to-tl from-[#41023B]/20 to-[#D7008A]/10 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 1,
            }}
          />
        </div>

        <div className="relative z-1 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
          <AnimatePresence>
            {!showLogin && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-6xl"
              >
                {/* Logo Section - Responsive adjustments */}
                <motion.div
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex justify-center mb-8"
                >
                  <div className="relative mb-16 sm:mb-24 md:mb-32">
                    <div className="absolute inset-0"></div>
                    <Image
                      src="/assets/logo.png"
                      alt="Logo Colegio de Odontólogos de Venezuela"
                      width={300}
                      height={80}
                      className="relative drop-shadow-md object-contain max-w-full h-auto"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Ccircle cx='90' cy='90' r='80' fill='%23ffffff' /%3E%3Ctext x='50%' y='50%' fontSize='24' textAnchor='middle' dominantBaseline='middle' fill='%23D7008A'%3ECOV%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                </motion.div>

                {/* Welcome Text - Responsive typography */}
                <motion.div
                  className="text-center mb-12 sm:mb-16 md:mb-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                    Bienvenido
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-white max-w-4xl mx-auto px-4">
                    Portal del Colegio de Odontólogos de Venezuela para
                    profesionales de la salud bucal
                  </p>
                </motion.div>

                {/* Access Cards - Responsive grid and sizing */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-20 px-4 sm:px-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {/* Panel Admin Card */}
                  <motion.div
                    className="relative overflow-hidden rounded-2xl group"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm border border-white/40 shadow-xl rounded-2xl z-0"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#D7008A]/20 to-[#41023B]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

                    <div className="relative p-6 sm:p-8 z-10 text-center">
                      <h2 className="text-xl sm:text-2xl font-bold text-[#41023B] mb-4 sm:mb-5">
                        Panel de Administradores
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                        Acceso exclusivo para personal administrativo del
                        Colegio de Odontólogos de Venezuela.
                      </p>
                      <motion.button
                        onClick={() => handleSignIn("left")}
                        className="cursor-pointer w-full bg-white text-[#D7008A] border border-[#D7008A]/30 
                        py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl text-base sm:text-lg font-medium
                        shadow-sm hover:shadow-md hover:bg-[#D7008A] hover:text-white transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:ring-opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Acceder como Administrador
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Colegiados Card */}
                  <motion.div
                    className="relative overflow-hidden rounded-2xl group"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm border border-white/40 shadow-xl rounded-2xl z-1"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#41023B]/20 to-[#D7008A]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

                    <div className="relative p-6 sm:p-8 z-10 text-center">
                      <h2 className="text-xl sm:text-2xl font-bold text-[#41023B] mb-4 sm:mb-5">
                        Colegiados
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                        Para odontólogos adscritos al COV o profesionales que
                        desean registrarse y realizar solicitudes.
                      </p>
                      <motion.button
                        onClick={() => handleSignIn("right")}
                        className="cursor-pointer w-full bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white 
                        py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl text-base sm:text-lg font-medium
                        shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:ring-opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Acceder como Colegiado
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Footer - Responsive adjustments */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 text-center text-white text-xs sm:text-sm p-4 sm:p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  {/* Redes Sociales */}
                  <div className="flex justify-center items-center space-x-4 sm:space-x-6 mb-2 sm:mb-4">
                    <a href="#" className="hover:opacity-40 transition-opacity">
                      <Image
                        src="/assets/icons/facebook.png"
                        alt="Facebook"
                        width={20}
                        height={20}
                      />
                    </a>
                    <a href="#" className="hover:opacity-40 transition-opacity">
                      <Image
                        src="/assets/icons/instagram.png"
                        alt="Instagram"
                        width={20}
                        height={20}
                      />
                    </a>
                    <a href="#" className="hover:opacity-40 transition-opacity">
                      <Image
                        src="/assets/icons/twitter.png"
                        alt="Twitter"
                        width={20}
                        height={20}
                      />
                    </a>
                    <a href="#" className="hover:opacity-40 transition-opacity">
                      <Image
                        src="/assets/icons/youtube.png"
                        alt="Youtube"
                        width={24}
                        height={20}
                      />
                    </a>
                  </div>

                  {/* Copyright */}
                  <p className="text-xs sm:text-sm">
                    © {new Date().getFullYear()} Colegio de Odontólogos de
                    Venezuela J-00041277-4
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Information Section - Visible when login panels are open */}
          <AnimatePresence>
            {(showLogin || isClosing) && (
              <InfoSection direction={direction} isClosing={isClosing} />
            )}
          </AnimatePresence>

          {/* Sliding Panels */}
          <AnimatePresence>
            {(showLogin || isClosing) && direction === "left" && (
              <PanelAdmin onClose={handleClose} isClosing={isClosing} />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {(showLogin || isClosing) && direction === "right" && (
              <Colegiados onClose={handleClose} isClosing={isClosing} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
