"use client";

import Image from "next/image";
import { useState } from "react";
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

  return (
    <header className="bg-[#41023B] w-full z-50">
      <div className="py-4 flex items-center justify-between px-4 w-full">
        {/* Logo  */}
        <div className="flex items-center ml-12 mt-8 cursor-pointer">
          <Image src="/assets/logo.png" alt="logos" width={260} height={60} />
        </div>

        {/* Títulos */}
        <nav className="flex-grow flex items-center justify-center space-x-14 mt-8">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setOpenMenu(index)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span
                className="text-white/70 font-bold text-[16px] cursor-pointer flex items-center gap-1 hover:text-white transition-colors duration-500"
              >
                {item.title} {item.submenu && <FaChevronDown className={`w-3 h-3 ml-1 transition-transform duration-500 ${openMenu === index ? 'rotate-180' : ''}`} />}
              </span>
              {item.submenu && (
                <div 
                  className={`absolute left-1/2 transform -translate-x-1/2 mt-4 bg-white shadow-lg rounded-lg py-3 z-50 min-w-48 w-max transition-all origin-top duration-300 ease-in-out ${
                    openMenu === index ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-0 invisible h-0'
                  }`}
                >
                  {item.submenu.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      className="px-4 py-2 text-black hover:text-black hover:bg-gradient-to-br from-blue-400 to-blue-600 cursor-pointer whitespace-nowrap transition-colors duration-200"
                    >
                      {subItem}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Botón Trámites */}
        <div className="flex items-center px-12 mt-8">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-600 text-white font-bold text-[18px] py-2 px-8 rounded-full cursor-pointer transition-all duration-200">
            Trámites Online
          </div>
        </div>
      </div>
    </header>
  );
}