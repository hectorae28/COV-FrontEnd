"use client";

import ClaimAccountForm from "@/app/(Login)/Login/AccessNewUser";
import ForgotCredentialsSelector from "@/app/(Login)/Login/ForgotCredentialsSelector";
import LoginForm from "@/app/(Login)/Login/LoginForm";
import Alert from "@/app/Components/Alert";
import BackgroundAnimation from "@/Components/Home/BackgroundAnimation";
import { motion } from "framer-motion";
import { Clock, MapPin, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import InfoSection from "./InfoSection";

export default function LoginScreen() {
  const [currentView, setCurrentView] = useState("login");
  const [showContact, setShowContact] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "info" });

  const router = useRouter();
  const { data: session, status } = useSession();

  const authRouter = {
    Colegiados: "/Colegiado",
    Personal_Administrativo: "/PanelControl",
  };

  const handleMessageUpdate = useCallback((newMessage) => {
    if (newMessage && typeof newMessage === 'object') {
      setMessage(newMessage);
    } else {
      setMessage({ text: "", type: "info" });
    }
  }, []);

  // Manejo inteligente del viewport en móvil
  const handleMobileViewport = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Ajustar altura del viewport en dispositivos móviles
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  useEffect(() => {
    handleMobileViewport();
    window.addEventListener('resize', handleMobileViewport);
    window.addEventListener('orientationchange', handleMobileViewport);
    return () => {
      window.removeEventListener('resize', handleMobileViewport);
      window.removeEventListener('orientationchange', handleMobileViewport);
    };
  }, [handleMobileViewport]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      const redirectPath = authRouter[session.user.role];
      if (redirectPath) {
        try {
          router.push(redirectPath);
        } catch (error) {
          console.error("Error de redirección:", error);
          window.location.href = redirectPath;
        }
      }
    }
  }, [status, router, session]);

  const toggleContactSection = useCallback(() => {
    setShowContact(prev => !prev);
  }, []);

  const getTitle = () => {
    switch (currentView) {
      case "login":
        return "Bienvenido";
      case "forgot-credentials":
        return "Recuperar Credenciales";
      case "claim-account":
        return "Registrar Pago";
      default:
        return "Bienvenido";
    }
  };

  const getDescription = () => {
    switch (currentView) {
      case "login":
        return "Acceso para odontólogos adscritos al COV";
      case "forgot-credentials":
        return "¿Olvidaste tu contraseña, correo o usuario? Te ayudamos a recuperarlo";
      case "claim-account":
        return "Ingrese su correo electrónico para reenviarle el enlace de pago. Asegúrese de introducir la misma dirección utilizada anteriormente.";
      default:
        return "Acceso para odontólogos adscritos al COV";
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      {/* Fondo fijo que no se mueve con el scroll */}
      <div className="fixed inset-0 w-full h-full z-0">
        <BackgroundAnimation />
        <div className="absolute inset-0 bg-white/13 backdrop-blur-md" />
        
        {/* Elementos decorativos estáticos */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#D7008A]/20 to-[#41023B]/10 blur-3xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <motion.div
            className="absolute -bottom-40 -right-20 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tl from-[#41023B]/20 to-[#D7008A]/10 blur-3xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </div>

      {/* Contenedor principal con scroll */}
      <div 
        className="relative w-full h-screen lg:h-screen overflow-y-auto lg:overflow-hidden z-10"
        style={{ 
          height: 'calc(var(--vh, 1vh) * 100)',
          minHeight: 'calc(var(--vh, 1vh) * 100)'
        }}
      >
        {/* Contenedor principal */}
        <div className="relative flex lg:h-full min-h-full">
          {/* Left Column - Info Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden lg:flex lg:w-[60%] flex-col justify-center items-center h-full"
          >
            <InfoSection />
          </motion.div>

          {/* Right Column - Main Content */}
          <div className="w-full lg:w-[50%] flex flex-col lg:justify-center lg:items-center px-6 md:px-12 py-8 lg:py-0 lg:h-full">
            
            {/* Logo and Title Section */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-8 lg:flex-shrink-0"
            >
              <div className="flex justify-center mb-6">
                <Link href="/">
                  <Image
                    src="/assets/logo.png"
                    alt="Logo Colegio de Odontólogos de Venezuela"
                    width={440}
                    height={80}
                    className="drop-shadow-md cursor-pointer max-w-full h-auto"
                  />
                </Link>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold text-white mb-2">
                  {getTitle()}
                </h2>
                <p className="text-white mb-2 px-4">
                  {getDescription()}
                </p>
              </motion.div>
            </motion.div>

            {/* Form Container */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="w-full max-w-2xl bg-gradient-to-br from-white to-gray-300 rounded-3xl shadow-2xl p-8 lg:flex-shrink-0"
            >
              {/* Alert Messages */}
              {message.text && message.text.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <Alert type={message.type}>{message.text}</Alert>
                </motion.div>
              )}

              {/* Forms */}
              {currentView === "login" && (
                <LoginForm
                  onForgotCredentials={() => setCurrentView("forgot-credentials")}
                  onRegister={() => router.replace("/Registro")}
                  onClaimAccount={() => setCurrentView("claim-account")}
                  callbackUrl="/Colegiado"
                />
              )}

              {currentView === "forgot-credentials" && (
                <ForgotCredentialsSelector
                  onBackToLogin={(messageData) => {
                    setCurrentView("login");
                    handleMessageUpdate(messageData);
                  }}
                />
              )}

              {currentView === "claim-account" && (
                <ClaimAccountForm
                  onBackToLogin={(messageData) => {
                    setCurrentView("login");
                    handleMessageUpdate(messageData);
                  }}
                />
              )}

              {/* Mobile Contact Toggle */}
              <div className="mt-6 text-center lg:hidden">
                <button
                  onClick={toggleContactSection}
                  className="text-[#D7008A] font-medium hover:text-[#41023B] transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/20"
                  aria-expanded={showContact}
                  aria-controls="mobile-contact-section"
                >
                  {showContact ? "Cerrar" : "Contáctanos"}
                </button>
              </div>
            </motion.div>

            {/* Mobile Contact Section */}
            {showContact && (
              <motion.div
                id="mobile-contact-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeInOut"
                }}
                className="mt-6 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg lg:hidden w-full max-w-2xl"
              >
                <h3 className="text-xl font-bold text-[#41023B] mb-4">Contáctanos</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-black">
                    <Phone className="text-[#41023B] flex-shrink-0" size={20} />
                    <a 
                      href="tel:+582127812267"
                      className="hover:text-[#D7008A] transition-all"
                    >
                      (0212) 781-22 67
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 text-black">
                    <MapPin className="text-[#41023B] flex-shrink-0" size={20} />
                    <a 
                      href="https://maps.app.goo.gl/sj999zBBXoV4ouV39"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#D7008A] transition-all"
                    >
                      Dirección en Google Maps
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 text-black">
                    <Clock className="text-[#41023B] flex-shrink-0" size={20} />
                    <span>Lun-Vie: 8:00 AM - 4:00 PM</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}