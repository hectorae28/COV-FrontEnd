"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
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
  const [paddingY, setPaddingY] = useState(24);
  const [openMenu, setOpenMenu] = useState(null);
  const menuRefs = useRef([]);

  useEffect(() => {
    if (!menuRefs.current) {
      menuRefs.current = [];
    }

    const handleScroll = () => {
      const maxScroll = 100;
      const scrollY = window.scrollY;

      const newPaddingY = Math.max(
        12, 24 - (scrollY / maxScroll) * 12
      );

      setPaddingY(newPaddingY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBridgeHover = (index) => {
    setOpenMenu(index);
  };

  return (
    <header
      className="bg-gradient-to-t from-[#D7008A] to-[#41023B] w-full z-1100 fixed top-0 left-0 transition-all duration-300 shadow-lg"
      style={{ paddingTop: `${paddingY}px`, paddingBottom: `${paddingY}px` }}
    >
      <div className="flex items-center justify-between px-4 w-full">
        {/* Logo */}
        <div className="flex items-center ml-12 cursor-pointer">
          <Image 
            src="/assets/logo.png" 
            alt="logos" 
            width={paddingY > 18 ? 260 : 200}
            height={paddingY > 18 ? 60 : 40} 
            className="transition-all duration-300"
          />
        </div>

        {/* Títulos */}
        <nav className="flex-grow flex items-center justify-center space-x-14 relative">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setOpenMenu(index)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span
                className="text-white font-bold text-[16px] cursor-pointer flex items-center gap-2 transition-all duration-300"
              >
                {item.title} 
                {item.submenu && <FaChevronDown className={`w-3 h-3 transition-transform duration-500 ${openMenu === index ? 'rotate-180' : ''}`} />}
              </span>
              {item.submenu && openMenu === index && (
                <>
                  {/* Puente imaginario */}
                  <div
                    className="absolute top-0 left-0 w-full h-16 bg-transparent z-1110"
                    onMouseEnter={() => handleBridgeHover(index)}
                  ></div>

                  {/* Menú desplegable */}
                  <div 
                    ref={(el) => (menuRefs.current[index] = el)}
                    className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-[#7c235d] shadow-lg rounded-lg py-3 z-1110 min-w-48 overflow-hidden transition-all duration-300 ease-in-out"
                    onMouseEnter={() => setOpenMenu(index)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <div className="space-y-2 px-2">
                      {item.submenu.map((subItem, subIndex) => (
                        <div
                          key={subIndex}
                          className="px-8 py-3 text-white hover:text-black hover:bg-gray-200 hover:rounded-xl cursor-pointer whitespace-nowrap transition-colors duration-10"
                        >
                          {subItem}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
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