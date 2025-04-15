"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import LoginForm from "../Components/Home/LoginForm"
import ForgotPasswordForm from "../Components/Home/ForgotPasswordForm"

export default function Colegiados({ onClose, isClosing }) {
  const [currentView, setCurrentView] = useState('login')
  const router = useRouter()

  const handleRegisterClick = () => {
    // Close the current modal if needed
    if (onClose) {
      onClose();
    }
    // Navigate to the registration page
    router.push('/Registro/RegistrationForm');
  }

  return (
    <motion.div
      key="login-right"
      initial={{ x: "100%" }}
      animate={{ x: isClosing ? "100%" : "0%" }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute top-0 bottom-0 right-0 w-full lg:w-[45%] bg-gradient-to-br from-white to-gray-300 rounded-l-[50px] shadow-2xl overflow-hidden"
    >
      {/* Botón de cierre */}
      <div className="absolute top-6 left-6 lg:top-1/2 lg:left-10 lg:transform lg:-translate-y-1/2 lg:-translate-x-1/2 z-50">
        <motion.button
          onClick={onClose}
          className="cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Cerrar"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#chevron-gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="chevron-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D7008A" />
                <stop offset="100%" stopColor="#41023B" />
              </linearGradient>
            </defs>
            <polyline points="9 18 15 12 9 6"></polyline>
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
            />
          </div>

          <h2 className="text-center text-3xl font-bold text-[#41023B] mb-2">
            {currentView === 'login' ? 'Colegiados' : 'Recuperar Contraseña'}
          </h2>
          <p className="text-center text-gray-700 mb-10 px-4">
            {currentView === 'login'
              ? 'Acceso para odontólogos adscritos al COV'
              : 'Ingresa tu correo para recuperar tu contraseña'}
          </p>

          {currentView === 'login' && (
            <LoginForm 
              onForgotPassword={() => setCurrentView('forgot-password')} 
              onRegister={() => router.replace('/RegistrationForm')} 
            />
          )}
          
          {currentView === 'forgot-password' && (
            <ForgotPasswordForm 
              onBackToLogin={() => setCurrentView('login')} 
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}
