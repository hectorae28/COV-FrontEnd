"use client";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import Alert from "@/app/Components/Alert";
import { useState } from "react";
import { fetchDataUsuario } from "@/api/endpoints/colegiado";

export default function ClaimAccountForm({ onBackToLogin }) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "info" });
    const [email, setEmail] = useState("")


    const handleSubmit = async (e) => {
      setIsLoading(true);
      e.preventDefault();
      await fetchDataUsuario("recaudos-token",null, `?email=${email}`)
        .then((_) => {
          setIsLoading(false);
          onBackToLogin({ text: "Email Enviado", type: "success" });
        })
        .catch((err) => {
          console.error(err)
          setIsLoading(false);
          setMessage({ text: "Error al enviar email", type: "error" });
        });
    };

    return (
      <form onSubmit={handleSubmit}>
        {message.text.length > 0 && !isLoading && (
          <Alert type={message.type}>{message.text}</Alert>
        )}
        <div className="mb-6">
          <div className="flex">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none w-full">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:border-transparent shadow-sm"
                placeholder="Correo electrónico"
              />
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          className="cursor-pointer w-full bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white py-4 px-6 rounded-xl text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:ring-opacity-50 inline"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Procesando...</span>
            </div>
          ) : (
            "Enviar Correo"
          )}
        </motion.button>

        <div className="text-center mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <a
            href="#"
            className="cursor-pointer text-[#D7008A] font-medium hover:underline flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              onBackToLogin({ text: "", type: "info" })
            }}
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Volver a Iniciar Sesión
          </a>
        </div>
      </form>
    );
}
