"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

const menuItems = [
  { title: "Inicio", link: "#" },
  { 
    title: "Sobre COV", 
    submenu: ["Historia", "Galeria de Presidentes", "Junta Directiva", "Comisiones", "Leyes y Reglamentos", "Descargar Logo"] 
  },
  { 
    title: "Nueva Ley", 
    link: "#" 
  },
  { 
    title: "Especialistas", 
    submenu: ["Armonizacion Orofacial", "Cirugia Bucal", "Cirugia Bucomaxilofacial", "Endodoncia", "Ortodoncia"] 
  },
  { 
    title: "Eventos", 
    submenu: ["Eventos COV", "Juegos Nacionales", "Certificados"] 
  },
  { 
    title: "Trámites", 
    submenu: ["Tarifas", "Carnet", "Odontologos", "Higienistas Dentales", "Tecnicos Dentales", "Especialidades", "Cuentas Bancarias", "Paypal", "Verificar Documentos", "Aval para Cursos", "Tutoriales"] 
  },
  { title: "Contáctenos", link: "#" }
];

export default function AppBar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`bg-gradient-to-t from-[#D7008A] to-[#41023B] w-full z-50 fixed top-0 left-0 transition-all duration-300 ${
        isScrolled ? "py-3 shadow-lg" : "py-6"
      }`}
    >
      <div className="flex items-center justify-between px-4 w-full">
        {/* Logo */}
        <div className="flex items-center ml-12 cursor-pointer">
          <Image src="/assets/logo.png" alt="logos" width={isScrolled ? 200 : 260} height={isScrolled ? 40 : 60} />
        </div>

        {/* Títulos */}
        <nav className="flex-grow flex items-center justify-center space-x-14">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setOpenMenu(index)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span
                className="text-white font-bold text-[16px] cursor-pointer flex items-center gap-2 transition-all duration-300 hover:border-b-2 hover:border-white pb-1"
              >
                {item.title} 
                {item.submenu && <FaChevronDown className={`w-3 h-3 transition-transform duration-500 ${openMenu === index ? 'rotate-180' : ''}`} />}
              </span>
              {item.submenu && (
                <div 
                  className={`absolute left-1/2 transform -translate-x-1/2 mt-4 bg-[#7c235d] shadow-lg rounded-lg py-3 z-50 min-w-48 overflow-hidden transition-all duration-300 ease-in-out ${
                    openMenu === index ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0'
                  }`}
                >
                  <div className="space-y-2">
                    {item.submenu.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        className="px-4 py-2 text-white hover:text-black hover:bg-gray-200 cursor-pointer whitespace-nowrap transition-colors duration-10"
                      >
                        {subItem}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Botón Trámites */}
        <div className="flex items-center px-12">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-600 text-white font-bold text-[18px] py-2 px-8 rounded-full cursor-pointer transition-all duration-200">
            Trámites Online
          </div>
        </div>
      </div>
    </header>
  );
}