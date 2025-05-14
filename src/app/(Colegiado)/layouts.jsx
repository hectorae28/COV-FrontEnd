"use client";

import { useState, useEffect } from "react";
import { BarraProvider } from "./BarraContext";
import AppBar from "@/Components/AppBar";
import Barra from "@/Components/Barra";

export default function ColegiadoLayout({ children }) {
  // Estado para controlar la visibilidad del menú en dispositivos móviles
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Datos del usuario y solvencia (simularemos datos estáticos por ahora)
  const [solvencyInfo, setSolvencyInfo] = useState("31/12/2025");
  const [userInfo, setUserInfo] = useState({
    name: "Dr. Juan Pérez",
    email: "juan.perez@ejemplo.com",
    avatar: "/assets/avatar.png",
    specialty: "Odontología General"
  });
  
  // Verificar si es solvente (fecha de expiración mayor a la fecha actual)
  const fechaExpiracion = new Date(
    solvencyInfo.split("/").reverse().join("-")
  );
  const isSolvent = fechaExpiracion >= new Date();
  
  // Verificar si la solvencia está por vencer (menos de 30 días)
  const treintaDias = 30 * 24 * 60 * 60 * 1000;
  const showSolvencyWarning = 
    isSolvent && 
    fechaExpiracion.getTime() - new Date().getTime() < treintaDias;
  
  // Mock de la sesión para pasar a los componentes
  const session = {
    user: {
      name: userInfo.name,
      email: userInfo.email,
      image: userInfo.avatar,
      role: "colegiado"
    }
  };
  
  // Cerrar el menú móvil al cambiar el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <BarraProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar / AppBar - Fijo a la izquierda en desktop, modal en móvil */}
        <div
          className={`fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-[#41023B] to-[#D7008A] text-white z-40 transition-transform duration-300 md:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AppBar solvencyInfo={solvencyInfo} />
        </div>
        
        {/* Overlay para cerrar el menú en dispositivos móviles */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        
        {/* Contenido principal */}
        <div className="md:ml-72">
          {/* Barra superior con información de solvencia */}
          <Barra
            onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            solvencyInfo={solvencyInfo}
            isSolvent={isSolvent}
            userInfo={userInfo}
            showSolvencyWarning={showSolvencyWarning}
            session={session}
          />
          
          {/* Contenido de la página */}
          <main>
            {children}
          </main>
        </div>
      </div>
    </BarraProvider>
  );
}