"use client";

import { motion } from "framer-motion";
import { Lock, Mail, Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "../Components/Home/LoginForm";

export default function PanelAdmin({ onClose, isClosing }) {
  const [rememberMe, setRememberMe] = useState(false);
  const [currentView, setCurrentView] = useState("login");
  const router = useRouter();

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
            Panel de Administradores
          </h2>
          <p className="text-center text-gray-700 mb-10">
            Acceso exclusivo para personal administrativo
          </p>

          <form>
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
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
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:border-transparent shadow-sm"
                  placeholder="Contraseña"
                />
              </div>
            </div>

            <div className="flex items-center mb-8 ml-8">
              <div className="relative w-5 h-5 mr-3 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                <div
                  className={`absolute inset-0 rounded border ${rememberMe ? "bg-[#41023B] border-[#41023B]" : "border-gray-800"}`}
                >
                  {rememberMe && <Check className="h-4 w-4 text-white" />}
                </div>
              </div>
              <label className="text-gray-700 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                Recordarme
              </label>
            </div>

            <motion.button
              type="submit"
              className="cursor-pointer w-full bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white py-4 px-6 rounded-xl text-lg font-medium
              shadow-md hover:shadow-lg transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:ring-opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Iniciar Sesión
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
