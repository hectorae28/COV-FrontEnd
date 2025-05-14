"use client";

import api from "@/api/api";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import Alert from "@/app/Components/Alert";
import { useState } from "react";

export default function ForgotPasswordForm({ onBackToLogin }) {
  const [correoRecuperacion, setCorreoRecuperacion] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [mesagge, setMesagge] = useState({text:"",type:"info"})

  const handleInputChange = (e) => {
    setCorreoRecuperacion(e.target.value);
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    api.post("/usuario/forgot-password/", {
      email: correoRecuperacion,
    }).then((_) => {
      setIsLoading(false);
      onBackToLogin({text:"Se ha enviado un correo de recuperación a tu correo electrónico.",type:"success"});
    }).catch((error) => {
      setIsLoading(false);
      setMesagge({text:error.status==404?" El correo no esta registrado":error.status==500?"Error interno del servidor.":"Error desconocido.",type:"alert"});
    }
    );

    // Aquí puedes agregar la lógica para enviar el correo de recuperación
  };

  return (
    <form onSubmit={handleSubmit}>
            {(mesagge.text.length > 0 && !isLoading )&& (
        <Alert type={mesagge.type}>{mesagge.text}</Alert>

      )}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="correoRecuperacion"
            value={correoRecuperacion}
            onChange={handleInputChange}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:border-transparent shadow-sm"
            placeholder="Correo Electrónico"
            required
          />
        </div>
      </div>

      {/* Send recovery link button */}
      <motion.button
        type="submit"
        className="cursor-pointer w-full bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white py-4 px-6 rounded-xl text-lg font-medium
        shadow-md hover:shadow-lg transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:ring-opacity-50 inline"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
      >
        Enviar enlace de recuperación
      </motion.button>

      {/* Back to login link */}
      <div className="text-center mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <a
          href="#"
          className="text-[#D7008A] font-medium hover:underline flex items-center justify-center"
          onClick={(e) => {
            e.preventDefault();
            onBackToLogin();
          }}
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Volver a Iniciar Sesión
        </a>
      </div>
    </form>
  );
}
