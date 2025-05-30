"use client";

import { motion } from "framer-motion";
import { ChevronRight, Shield, User } from "lucide-react";
import { useState } from "react";

export default function AdminRoleSelector({ onRoleSelect }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    // Simular un pequeño delay para mostrar la selección
    setTimeout(() => {
      onRoleSelect(role);
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Mensaje principal */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-[#41023B] mb-4">
          Autenticación Exitosa
        </h2>

        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          Se ha verificado tu identidad correctamente. Ahora selecciona el rol con el que deseas acceder al sistema:
        </p>
      </div>

      {/* Subtítulo */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-[#41023B]">
          Ingresa como:
        </h3>
      </div>

      {/* Opciones de selección */}
      <div className="max-w-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Opción: Ingresar como Administrador */}
          <motion.button
            type="button"
            onClick={() => handleRoleSelection("admin")}
            disabled={selectedRole === "admin"}
            className={`group relative p-6 bg-white border-2 rounded-xl transition-all duration-300 ${selectedRole === "admin"
                ? "border-[#D7008A] bg-[#D7008A]/5 scale-105"
                : "border-gray-200 hover:border-[#D7008A] hover:shadow-lg"
              }`}
            whileHover={{ scale: selectedRole === "admin" ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3 transition-all ${selectedRole === "admin"
                  ? "bg-gradient-to-r from-[#D7008A] to-[#41023B] shadow-lg"
                  : "bg-gradient-to-r from-[#D7008A] to-[#41023B] group-hover:shadow-lg"
                }`}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#41023B] mb-2">
                Administrador
              </h3>
              <p className="text-gray-600 text-xs">
                Acceso completo al panel de control administrativo
              </p>
              <div className={`mt-3 flex items-center justify-center text-[#D7008A] transition-opacity ${selectedRole === "admin" ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}>
                {selectedRole === "admin" ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-[#D7008A] border-t-transparent rounded-full"></div>
                    <span className="text-xs font-medium">Accediendo...</span>
                  </div>
                ) : (
                  <>
                    <span className="text-xs font-medium mr-1">Seleccionar</span>
                    <ChevronRight className="w-3 h-3" />
                  </>
                )}
              </div>
            </div>
          </motion.button>

          {/* Opción: Ingresar como Colegiado */}
          <motion.button
            type="button"
            onClick={() => handleRoleSelection("colegiado")}
            disabled={selectedRole === "colegiado"}
            className={`group relative p-6 bg-white border-2 rounded-xl transition-all duration-300 ${selectedRole === "colegiado"
                ? "border-[#D7008A] bg-[#D7008A]/5 scale-105"
                : "border-gray-200 hover:border-[#D7008A] hover:shadow-lg"
              }`}
            whileHover={{ scale: selectedRole === "colegiado" ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3 transition-all ${selectedRole === "colegiado"
                  ? "bg-gradient-to-r from-[#D7008A] to-[#41023B] shadow-lg"
                  : "bg-gradient-to-r from-[#D7008A] to-[#41023B] group-hover:shadow-lg"
                }`}>
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#41023B] mb-2">
                Colegiado
              </h3>
              <p className="text-gray-600 text-xs">
                Acceso al portal de colegiados y servicios profesionales
              </p>
              <div className={`mt-3 flex items-center justify-center text-[#D7008A] transition-opacity ${selectedRole === "colegiado" ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}>
                {selectedRole === "colegiado" ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-[#D7008A] border-t-transparent rounded-full"></div>
                    <span className="text-xs font-medium">Accediendo...</span>
                  </div>
                ) : (
                  <>
                    <span className="text-xs font-medium mr-1">Seleccionar</span>
                    <ChevronRight className="w-3 h-3" />
                  </>
                )}
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
} 