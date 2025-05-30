"use client";

import api from "@/api/api";
import Alert from "@/app/Components/Alert";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, IdCard, Lock, Mail } from "lucide-react";
import { useState } from "react";

export default function ForgotCredentialsSelector({ onBackToLogin }) {
  const [currentView, setCurrentView] = useState("selector"); // "selector", "password", "credentials"
  const [showInitialSelection, setShowInitialSelection] = useState(true);

  // Estados para el formulario de contraseña
  const [correoRecuperacion, setCorreoRecuperacion] = useState("");
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [messagePassword, setMessagePassword] = useState({ text: "", type: "info" });

  // Estados para el formulario de credenciales
  const [cedula, setCedula] = useState("");
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);
  const [messageCredentials, setMessageCredentials] = useState({ text: "", type: "info" });

  const handleOptionSelect = (option) => {
    setCurrentView(option);
    setShowInitialSelection(false);
  };

  const handleBackToSelector = () => {
    setCurrentView("selector");
    setShowInitialSelection(true);
    // Limpiar formularios
    setCorreoRecuperacion("");
    setCedula("");
    setMessagePassword({ text: "", type: "info" });
    setMessageCredentials({ text: "", type: "info" });
  };

  // Funciones para el formulario de contraseña
  const handleEmailChange = (e) => {
    setCorreoRecuperacion(e.target.value);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessagePassword({ text: "", type: "info" });

    if (!validateEmail(correoRecuperacion)) {
      setMessagePassword({ text: "Por favor, ingresa un formato de correo electrónico válido.", type: "alert" });
      return;
    }

    setIsLoadingPassword(true);

    try {
      const response = await api.post("/usuario/forgot-password/", {
        email: correoRecuperacion,
      });

      setIsLoadingPassword(false);
      onBackToLogin({ text: "Se ha enviado un correo de recuperación a tu correo electrónico.", type: "success" });
    } catch (error) {
      setIsLoadingPassword(false);
      let errorMessage = "Error desconocido.";

      if (error.status === 404) {
        errorMessage = "El correo no está registrado.";
      } else if (error.status === 500) {
        errorMessage = "Error interno del servidor.";
      }

      setMessagePassword({ text: errorMessage, type: "alert" });
    }
  };

  // Funciones para el formulario de credenciales
  const handleCedulaChange = (e) => {
    let value = e.target.value.toUpperCase();
    value = value.replace(/[^A-Z0-9]/g, '');
    setCedula(value);
  };

  const validateCedula = () => {
    if (cedula.length < 7) {
      setMessageCredentials({ text: "La cédula debe tener al menos 7 caracteres.", type: "alert" });
      return false;
    }
    return true;
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setMessageCredentials({ text: "", type: "info" });

    if (!validateCedula()) {
      return;
    }

    setIsLoadingCredentials(true);

    try {
      const response = await api.post("/usuario/forgot-credentials/", {
        cedula: cedula
      });

      setIsLoadingCredentials(false);
      onBackToLogin({
        text: "Se han enviado tus credenciales al correo asociado a tu cuenta.",
        type: "success"
      });
    } catch (error) {
      setIsLoadingCredentials(false);
      let errorMessage = "Error desconocido.";

      if (error.status === 404) {
        errorMessage = "No se encontró una cuenta con la cédula proporcionada.";
      } else if (error.status === 400) {
        errorMessage = "La cédula proporcionada no es válida. Verifica la información e intenta nuevamente.";
      } else if (error.status === 500) {
        errorMessage = "Error interno del servidor.";
      }

      setMessageCredentials({ text: errorMessage, type: "alert" });
    }
  };

  // Pantalla inicial de selección
  if (showInitialSelection) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Mensaje principal */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#41023B] mb-4">
            Recuperar Credenciales
          </h2>

          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            ¿Qué información necesitas recuperar? Selecciona la opción que mejor se adapte a tu situación:
          </p>
        </div>

        {/* Opciones de selección */}
        <div className="max-w-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opción: Recuperar Contraseña */}
            <motion.button
              type="button"
              onClick={() => handleOptionSelect("password")}
              className="group relative p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-[#D7008A] hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#D7008A] to-[#41023B] rounded-full mx-auto flex items-center justify-center mb-3 group-hover:shadow-lg transition-all">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#41023B] mb-2">
                  Olvidé mi Contraseña
                </h3>
                <p className="text-gray-600 text-xs">
                  Conozco mi correo electrónico pero no recuerdo mi contraseña
                </p>
                <div className="mt-3 flex items-center justify-center text-[#D7008A] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-medium mr-1">Continuar</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </motion.button>

            {/* Opción: Recuperar Correo/Usuario */}
            <motion.button
              type="button"
              onClick={() => handleOptionSelect("credentials")}
              className="group relative p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-[#D7008A] hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#D7008A] to-[#41023B] rounded-full mx-auto flex items-center justify-center mb-3 group-hover:shadow-lg transition-all">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#41023B] mb-2">
                  Olvidé mi Correo o Usuario
                </h3>
                <p className="text-gray-600 text-xs">
                  No recuerdo el correo electrónico asociado a mi cuenta
                </p>
                <div className="mt-3 flex items-center justify-center text-[#D7008A] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-medium mr-1">Continuar</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Botón volver al login */}
        <div className="text-center mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <a
            href="#"
            className="text-[#D7008A] font-medium hover:underline flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              onBackToLogin({ text: "", type: "info" });
            }}
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Volver a Iniciar Sesión
          </a>
        </div>
      </motion.div>
    );
  }

  // Formulario de recuperar contraseña
  if (currentView === "password") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackToSelector}
            className="mr-3 p-2 text-gray-500 hover:text-[#D7008A] rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-[#41023B]">Recuperar Contraseña</h3>
        </div>

        <form onSubmit={handlePasswordSubmit}>
          {(messagePassword.text.length > 0 && !isLoadingPassword) && (
            <Alert type={messagePassword.type}>{messagePassword.text}</Alert>
          )}

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-6">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="correoRecuperacion"
                value={correoRecuperacion}
                onChange={handleEmailChange}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:border-transparent shadow-sm"
                placeholder="Correo Electrónico"
                required
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
            disabled={isLoadingPassword}
          >
            {isLoadingPassword ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Enviando...</span>
              </div>
            ) : (
              "Enviar enlace de recuperación"
            )}
          </motion.button>
        </form>
      </motion.div>
    );
  }

  // Formulario de recuperar credenciales
  if (currentView === "credentials") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackToSelector}
            className="mr-3 p-2 text-gray-500 hover:text-[#D7008A] rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-[#41023B]">Recuperar Correo o Usuario</h3>
        </div>

        <form onSubmit={handleCredentialsSubmit}>
          {(messageCredentials.text.length > 0 && !isLoadingCredentials) && (
            <Alert type={messageCredentials.type}>{messageCredentials.text}</Alert>
          )}

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-6 text-center">
              Para ayudarte a recuperar tu correo o usuario, ingresa tu número de cédula o pasaporte.
              Te enviaremos tus credenciales al correo asociado a tu cuenta.
            </p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IdCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="cedula"
                value={cedula}
                onChange={handleCedulaChange}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:border-transparent shadow-sm"
                placeholder="Cédula o Pasaporte"
                required
                minLength={7}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Ingresa solo letras mayúsculas y números. Mínimo 7 caracteres.
            </p>
          </div>

          <motion.button
            type="submit"
            className="cursor-pointer w-full bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white py-4 px-6 rounded-xl text-lg font-medium
            shadow-md hover:shadow-lg transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:ring-opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoadingCredentials}
          >
            {isLoadingCredentials ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Procesando...</span>
              </div>
            ) : (
              "Recuperar Credenciales"
            )}
          </motion.button>
        </form>
      </motion.div>
    );
  }

  return null;
} 