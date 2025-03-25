"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import LoginForm from "../Components/Home/LoginForm"
import RegistrationForm from "../Components/Home/RegistrationForm"
import ForgotPasswordForm from "../Components/Home/ForgotPasswordForm"

export default function Colegiados({ onClose, isClosing }) {
  const [currentView, setCurrentView] = useState('login')

  return (
    <motion.div
      key="login-right"
      initial={{ x: "100%" }}
      animate={{ x: isClosing ? "100%" : "0%" }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute top-0 bottom-0 right-0 w-full sm:w-full md:w-full lg:w-[45%] bg-gradient-to-br from-white to-gray-300 rounded-l-[40px] md:rounded-l-[80px] lg:rounded-l-[45px] shadow-2xl overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#D7008A]/10 to-[#41023B]/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-20 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tl from-[#41023B]/10 to-[#D7008A]/5 blur-3xl"></div>
      </div>

      {/* Gradient Chevron button - no background */}
      <div className="absolute top-6 left-6 lg:top-1/2 lg:left-10 lg:transform lg:-translate-y-1/2 lg:-translate-x-1/2 z-50">
        <motion.button
          onClick={onClose}
          className="cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
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
              onError={(e) => {
                e.target.onerror = null
                e.target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Ccircle cx='90' cy='90' r='80' fill='%23ffffff' /%3E%3Ctext x='50%' y='50%' fontSize='24' textAnchor='middle' dominantBaseline='middle' fill='%23D7008A'%3ECOV%3C/text%3E%3C/svg%3E"
              }}
            />
          </div>

          <h2 className="text-center text-3xl font-bold text-[#41023B] mb-2">
            {currentView === 'login' 
              ? 'Colegiados' 
              : currentView === 'register' 
                ? 'Registro de Colegiados' 
                : 'Recuperar Contraseña'}
          </h2>
          <p className="text-center text-gray-700 mb-10 px-4">
            {currentView === 'login' 
              ? 'Acceso para odontólogos adscritos al COV'
              : currentView === 'register' 
                ? 'Regístrate como miembro del COV'
                : 'Ingresa tu correo para recuperar tu contraseña'}
          </p>

          {currentView === 'login' && (
            <LoginForm 
              onForgotPassword={() => setCurrentView('forgot-password')} 
              onRegister={() => setCurrentView('register')} 
            />
          )}
          
          {currentView === 'register' && (
            <RegistrationForm 
              onBackToLogin={() => setCurrentView('login')} 
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