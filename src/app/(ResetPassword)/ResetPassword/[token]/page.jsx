"use client";
import BackgroundAnimation from "@/Components/Home/BackgroundAnimation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";
import Alert from "@/app/Components/Alert";
import api from "@/api/api";
import Link from "next/link";
const ResetPassword = ({params}) => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mesagge, setMesagge] = useState({ text: "", type: "info" });
  const [values, setValues] = useState({
    new_password: "",
    confirm_password: "",
  });
  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await params;
      setToken(resolvedParams.token);
    }
    unwrapParams();
  }, [params]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (values.new_password !== values.confirm_password) {
      setMesagge({ text: "Las contraseñas no coinciden", type: "alert" });
      return;
     }
    setIsLoading(true);
    api.get("/usuario/csrf/").then((csrf) => {
        api.post(`/usuario/reset-password/${token}/`, values, {
            headers: {
                "X-CSRFToken": csrf.data,
            },
        }).then((_) => {
            setIsLoading(false);
            setMesagge({text:"Se ha cambiado su contraseña.",type:"success"});
        }).catch((error) => {
            setIsLoading(false);
            setMesagge({text:flattenErrorMessages(error.response.data),type:"alert"});
        }
        );
    })
  };
  const handleChange = (data) => {
    const { name, value } = data.target;
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
  };
  return (
    <>
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="relative w-full h-screen overflow-hidden">
          {/* Background Animation */}
          <BackgroundAnimation />

          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-white/13 backdrop-blur-md" />

          <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20">
            <div className="flex justify-center mb-8">
              <Image
                src="/assets/logo.png"
                alt="Logo Colegio de Odontólogos de Venezuela"
                width={300}
                height={80}
                className="drop-shadow-md"
              />
            </div>
            <div className="max-w-md mx-auto w-full bg-white rounded-2xl shadow-lg p-10 gap-3">
              {/* Logo */}

              <h2 className="text-center text-3xl font-bold text-[#41023B] mb-4">
                Restaurar Contraseña
              </h2>

              <form onSubmit={handleSubmit}>
                {mesagge.text.length > 0 && !isLoading && (
                  <Alert type={mesagge.type}>{mesagge.text}</Alert>
                )}
                <div className="mb-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="new_password"
                      //value={values.new_password}
                      onChange={(e) => handleChange(e)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:border-transparent shadow-sm"
                      placeholder="Nueva Contraseña"
                      required
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
                      name="confirm_password"
                      //value={values.confirm_password}
                      onChange={(e) => handleChange(e)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:border-transparent shadow-sm"
                      placeholder="Confirmar Contraseña"
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
                  Cambiar Contraseña
                </motion.button>

                {/* Back to login link */}
                <div className="text-center mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <Link
                    href="/Login"
                    className="text-[#D7008A] font-medium hover:underline flex items-center justify-center"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" /> Volver a Iniciar
                    Sesión
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function flattenErrorMessages(data) {
  const messages = [];

  function recurse(value) {
    if (typeof value === 'string') {
      messages.push(value.trim());
    } else if (Array.isArray(value)) {
      value.forEach(recurse);
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach(recurse);
    }
    // otros tipos (números, booleanos, null, undefined) se ignoran
  }

  recurse(data);
  // Une con salto de línea, coma o espacio según prefieras
  return messages.join(' ');
}

export default ResetPassword;
