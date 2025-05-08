"use client";

import Alert from "@/app/Components/Alert";
import ForgotPasswordForm from "@/Components/Home/ForgotPasswordForm";
import { motion } from "framer-motion";
import { Clock, Lock, Mail, MapPin, Phone } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PanelAdmin({ onClose, isClosing }) {
  const [currentView, setCurrentView] = useState("login");
  const searchParams = useSearchParams();
  const [error, setError] = useState(searchParams.get("error"));
  const [showContact, setShowContact] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const formRef = useRef(null);
  useEffect(() => {
    setError(searchParams.get("error"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try{
      const Form = new FormData(formRef.current);
      const result = await signIn("credentials", {
        username: Form.get("email"),
        password: Form.get("password"),
        redirect: false,
      });
      if (result.error) {
        if (
          result.error === "Account is locked" ||
          result.error === "Account locked due to too many failed attempts"
        ) {
          setError(
            "Su cuenta está bloqueada. Contacta al administrador o recupere su contraseña."
          );
        } else if (result.error === "Invalid credentials") {
          setError(
            "Credenciales inválidas. Por favor, verifique su email y/o contraseña."
          );
        } else if (
          result.error === "Ya existe una sesión activa para este usuario."
        ) {
          setError(
            "Ya existe una sesión activa para este usuario. Por favor, cierra la sesión antes de iniciar sesión nuevamente."
          );
        } else {
          setError("Ocurrió un error inesperado. Intenta nuevamente.");
        }
      } else {
        console.log("Inicio de sesión exitoso:", result);
        router.push("/PanelControl");
      }
    } catch (error) {
      console.error("Error en el proceso de inicio de sesión:", error);
      setError("Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo más tarde.");
    }finally{
      setIsLoading(false);
    }
  }


  // Función para alternar la sección de contacto
  const toggleContactSection = () => {
    setShowContact(!showContact);
  };

  return (
    <motion.div
      key="login-left"
      initial={{ x: "-100%" }}
      animate={{ x: isClosing ? "-100%" : "0%" }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute top-0 bottom-0 left-0 w-full sm:w-full md:w-full lg:w-[45%] bg-gradient-to-br from-white to-gray-300 rounded-r-[40px] md:rounded-r-[80px] lg:rounded-r-[45px] shadow-2xl overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#D7008A]/10 to-[#41023B]/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-20 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tl from-[#41023B]/10 to-[#D7008A]/5 blur-3xl"></div>
      </div>

      {/* Gradient Chevron button - no background, pointing left */}
      <div className="absolute top-6 right-6 lg:top-1/2 lg:right-10 lg:transform lg:-translate-y-1/2 lg:translate-x-1/2 z-50">
        <motion.button
          onClick={onClose}
          className="cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="url(#chevron-gradient-left)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <defs>
              <linearGradient
                id="chevron-gradient-left"
                x1="100%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#D7008A" />
                <stop offset="100%" stopColor="#41023B" />
              </linearGradient>
            </defs>
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </motion.button>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/assets/logo.png"
              alt="Logo Colegio de Odontólogos de Venezuela"
              width={300}
              height={80}
              className="drop-shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Ccircle cx='90' cy='90' r='80' fill='%23ffffff' /%3E%3Ctext x='50%' y='50%' fontSize='24' textAnchor='middle' dominantBaseline='middle' fill='%23D7008A'%3ECOV%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>

          <h2 className="text-center text-3xl font-bold text-[#41023B] mb-2">
            {currentView === "login"
              ? "Panel de Administradores"
              : "Recuperar Contraseña"}
          </h2>
          <p className="text-center text-gray-700 mb-10">
            {currentView === "login"
              ? "Acceso exclusivo para personal administrativo"
              : "Ingresa tu correo para recuperar tu contraseña"}
          </p>
          {currentView === "login" && (
            <form onSubmit={(e) => handleSubmit(e)} ref={formRef}>
              {error && <Alert type="alert">{error}</Alert>}
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="email"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:border-transparent shadow-sm"
                    placeholder="Usuario o correo electrónico"
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:border-transparent shadow-sm"
                    placeholder="Contraseña"
                  />
                </div>
              </div>
              <motion.button
                type="submit"
                className="cursor-pointer w-full bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white py-4 px-6 rounded-xl text-lg font-medium
                shadow-md hover:shadow-lg transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:ring-opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Iniciando Sesión...</span>
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </motion.button>
              {/* Forgot password link */}
              <div className="text-center mt-4">
                <div
                  className="text-[#D7008A] hover:underline text-sm cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentView("forgot-password");
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </div>
              </div>
            </form>
          )}
          {currentView === "forgot-password" && (
            <ForgotPasswordForm onBackToLogin={() => setCurrentView("login")} />
          )}
          <div className="mt-6 text-center">
            <motion.button
              onClick={toggleContactSection}
              className="text-[#D7008A] font-medium hover:text-[#41023B] transition-colors duration-300 md:hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showContact ? "Ocultar contacto" : "Contáctanos"}
            </motion.button>
          </div>

          {/* Sección de contacto (visible solo cuando showContact es true) */}
          {showContact && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-bold text-[#41023B] mb-4 ">Contáctanos</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-black">
                  <Phone className="text-[#41023B]" size={20} />
                  <a
                    href="tel:+582127812267"
                    className="hover:text-[#D7008A] transition-all"
                  >
                    (0212) 781-22 67
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-black">
                  <MapPin className="text-[#41023B]" size={20} />
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
                  <Clock className="text-[#41023B]" size={20} />
                  <span>Lun-Vie: 8:00 AM - 4:00 PM</span>
                </div>
              </div>
            </motion.div>
            )}
        </div>
      </div>
    </motion.div>
  );
}