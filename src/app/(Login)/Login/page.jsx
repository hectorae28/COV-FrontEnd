"use client";

import ClaimAccountForm from "@/Components/Home/AccessNewUser";
import BackgroundAnimation from "@/Components/Home/BackgroundAnimation";
import ForgotPasswordForm from "@/Components/Home/ForgotPasswordForm";
import LoginForm from "@/Components/Home/LoginForm";
import Alert from "@/app/Components/Alert";
import { motion } from "framer-motion";
import { Clock, MapPin, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AccesElements from "./AccesElements";

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

  // Redirection logic for authenticated users
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

  // Toggle contact section for mobile
  const toggleContactSection = () => {
    setShowContact(!showContact);
  };

  // Get title based on current view
  const getTitle = () => {
    switch (currentView) {
      case "login":
        return "Colegiados";
      case "forgot-password":
        return "Recuperar Contraseña";
      case "claim-account":
        return "Registrar Pago";
      default:
        return "Colegiados";
    }
  };

  // Get description based on current view
  const getDescription = () => {
    switch (currentView) {
      case "login":
        return "Acceso para odontólogos adscritos al COV";
      case "forgot-password":
        return "Ingresa tu correo para recuperar tu contraseña";
      case "claim-account":
        return "Ingrese su correo electrónico para reenviarle el enlace de pago. Asegúrese de introducir la misma dirección utilizada anteriormente.";
      default:
        return "Acceso para odontólogos adscritos al COV";
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Animation */}
        <BackgroundAnimation />

        {/* Backdrop blur */}
        <div className="absolute inset-0 bg-white/13 backdrop-blur-md" />

        {/* Main decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#D7008A]/20 to-[#41023B]/10 blur-3xl"
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
            className="absolute -bottom-40 -right-20 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tl from-[#41023B]/20 to-[#D7008A]/10 blur-3xl"
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

        <div className="relative z-10 flex h-full">
          {/* Left Column - Info Section (Hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden lg:flex lg:w-[55%]"
          >
            <AccesElements />
          </motion.div>

          {/* Right Column - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-[45%] bg-gradient-to-br from-white to-gray-300 lg:rounded-l-[50px] shadow-2xl flex flex-col justify-center px-6 md:px-12 lg:px-20"
          >
            <div className="max-w-lg mx-auto w-full">
              {/* Logo */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex justify-center mb-8"
              >
                <Link href="/">
                  <Image
                    src="/assets/logo.png"
                    alt="Logo Colegio de Odontólogos de Venezuela"
                    width={300}
                    height={80}
                    className="drop-shadow-md cursor-pointer"
                  />
                </Link>
              </motion.div>

              {/* Title and Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold text-[#41023B] mb-2">
                  {getTitle()}
                </h2>
                <p className="text-gray-700 mb-6 px-4">
                  {getDescription()}
                </p>
              </motion.div>

              {/* Alert Messages */}
              {message.text.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <Alert type={message.type}>{message.text}</Alert>
                </motion.div>
              )}

              {/* Forms */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {/* Login Form */}
                {currentView === "login" && (
                  <LoginForm
                    onForgotPassword={() => setCurrentView("forgot-password")}
                    onRegister={() => router.replace("/Registro")}
                    onClaimAccount={() => setCurrentView("claim-account")}
                    callbackUrl="/Colegiado"
                  />
                )}

                {/* Forgot Password Form */}
                {currentView === "forgot-password" && (
                  <ForgotPasswordForm
                    onBackToLogin={(e) => {
                      setCurrentView("login");
                      setMessage(e);
                    }}
                  />
                )}

                {/* Claim Account Form */}
                {currentView === "claim-account" && (
                  <ClaimAccountForm
                    onBackToLogin={(e) => {
                      setCurrentView("login");
                      setMessage(e);
                    }}
                  />
                )}
              </motion.div>

              {/* Mobile Contact Toggle */}
              <div className="mt-6 text-center lg:hidden">
                <motion.button
                  onClick={toggleContactSection}
                  className="text-[#D7008A] font-medium hover:text-[#41023B] transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showContact ? "Ocultar contacto" : "Contáctanos"}
                </motion.button>
              </div>

              {/* Mobile Contact Section */}
              {showContact && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg lg:hidden"
                >
                  <h3 className="text-xl font-bold text-[#41023B] mb-4">Contáctanos</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-black">
                      <Phone className="text-[#41023B]" size={20} />

                      <a href="tel:+582127812267"
                        className="hover:text-[#D7008A] transition-all"
                      >
                        (0212) 781-22 67
                      </a>
                    </div>
                    <div className="flex items-center space-x-3 text-black">
                      <MapPin className="text-[#41023B]" size={20} />

                      <a href="https://maps.app.goo.gl/sj999zBBXoV4ouV39"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#D7008A] transition-all"
                      >
                        Dirección en Google Maps
                      </a>
                    </div>
                    <div className="flex items-center space-x-3 text-black">
                      <Clock className="text-[#41023B]" size={20} />
                      <span>Lun-Vie: 8:00 AM - 4:00 PM</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Admin Access Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="mt-8 text-center"
              >
                <Link
                  href="/Admin"
                  className="text-gray-600 text-sm hover:text-[#D7008A] transition-colors duration-300"
                >
                  ¿Eres administrador? Accede aquí
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Footer for mobile */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 text-center text-white text-xs p-4 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <p>
            © {new Date().getFullYear()} Colegio de Odontólogos de Venezuela J-00041277-4
          </p>
        </motion.div>
      </div>
    </div>
  );
}