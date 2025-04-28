"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, Mail, Check } from "lucide-react";
import { useState, useRef } from "react";

export default function LoginForm({ onForgotPassword, onRegister }) {
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const Form = new FormData(formRef.current);
    try {
      const result = await signIn("credentials", {
        username: Form.get("email").split("@")[0],
        password: Form.get("password"),
        redirect: false,
      });
      if (result?.error) {
        console.error("Error al iniciar sesión:", result.error);
      } else {
        console.log("Inicio de sesión exitoso:", result);
        router.push("/Colegiado");
      }
    } catch (error) {
      console.error("Error en el proceso de inicio de sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} ref={formRef}>
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:border-transparent shadow-sm"
            placeholder="Correo electrónico"
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

      {/* Remember me checkbox */}
      <div className="flex items-center mb-8 ml-8">
        <div
          className="relative w-5 h-5 mr-3 cursor-pointer"
          onClick={() => setRememberMe(!rememberMe)}
        >
          <div
            className={`absolute inset-0 rounded border ${
              rememberMe ? "bg-[#41023B] border-[#41023B]" : "border-gray-800"
            }`}
          >
            {rememberMe && <Check className="h-4 w-4 text-white" />}
          </div>
        </div>
        <label
          className="text-gray-700 cursor-pointer"
          onClick={() => setRememberMe(!rememberMe)}
        >
          Recordarme
        </label>
      </div>

      {/* Login button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        className="cursor-pointer w-full bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white py-4 px-6 rounded-xl text-lg font-medium
        shadow-md hover:shadow-lg transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:ring-opacity-50 disabled:opacity-70"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Iniciando sesión...</span>
          </div>
        ) : (
          "Iniciar Sesión"
        )}
      </motion.button>

      {/* Forgot password link */}
      <div className="text-center mt-4">
        <a
          href="#"
          className="text-[#D7008A] hover:underline text-sm"
          onClick={(e) => {
            e.preventDefault();
            onForgotPassword();
          }}
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      {/* Register link */}
      <div className="text-center mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-gray-700 mb-2">¿No tienes una cuenta?</p>
        <a
          href="#"
          className="text-[#D7008A] font-medium hover:underline"
          onClick={(e) => {
            e.preventDefault();
            onRegister();
          }}
        >
          Registrate como Colegiado
        </a>
      </div>
    </form>
  );
}