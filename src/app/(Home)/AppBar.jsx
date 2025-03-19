"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(null);
  const menuRefs = useRef([]);
  const mobileMenuRef = useRef(null);

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

    const handleClickOutside = (event) => {
      if (mobileMenuOpen && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) &&
          !event.target.closest('button[aria-label="Toggle menu"]')) {
        setMobileMenuOpen(false);
        setMobileSubmenuOpen(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleBridgeHover = (index) => {
    setOpenMenu(index);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (mobileMenuOpen) setMobileSubmenuOpen(null);
  };

  const toggleMobileSubmenu = (index) => {
    setMobileSubmenuOpen(mobileSubmenuOpen === index ? null : index);
  };

  return (
    <>
      <header
        className="bg-gradient-to-t from-[#D7008A] to-[#41023B] w-full z-1100 fixed top-0 left-0 transition-all duration-300 shadow-lg"
        style={{ paddingTop: `${paddingY}px`, paddingBottom: `${paddingY}px` }}
      >
        <div className="container mx-auto flex items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center cursor-pointer">
            <Image 
              src="/assets/logo.png" 
              alt="logos" 
              width={paddingY > 18 ? 260 : 200}
              height={paddingY > 18 ? 60 : 40} 
              className="transition-all duration-300 w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[220px]"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-grow items-center justify-center relative">
            <div className="flex items-center lg:space-x-2 xl:space-x-4 2xl:space-x-10">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="relative group"
                  onMouseEnter={() => setOpenMenu(index)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <span
                    className="text-white font-bold text-[12px] lg:text-[13px] xl:text-[15px] 2xl:text-[16px] cursor-pointer flex items-center gap-1 lg:gap-2 transition-all duration-300 whitespace-nowrap"
                  >
                    {item.title} 
                    {item.submenu && <FaChevronDown className={`w-2 h-2 lg:w-2.5 lg:h-2.5 xl:w-3 xl:h-3 transition-transform duration-500 ${openMenu === index ? 'rotate-180' : ''}`} />}
                  </span>
                  {item.submenu && openMenu === index && (
                    <>
                      {/* Puente imaginario */}
                      <div
                        className="absolute top-0 left-0 w-full h-16 bg-transparent z-50"
                        onMouseEnter={() => handleBridgeHover(index)}
                      ></div>

                      {/* Menú desplegable */}
                      <div 
                        ref={(el) => (menuRefs.current[index] = el)}
                        className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-[#7c235d] shadow-lg rounded-lg py-3 z-50 min-w-48 overflow-hidden transition-all duration-300 ease-in-out"
                        onMouseEnter={() => setOpenMenu(index)}
                        onMouseLeave={() => setOpenMenu(null)}
                      >
                        <div className="space-y-2 px-2">
                          {item.submenu.map((subItem, subIndex) => (
                            <div
                              key={subIndex}
                              className="px-4 lg:px-6 xl:px-8 py-2 lg:py-3 text-white hover:text-black hover:bg-gray-200 hover:rounded-xl cursor-pointer whitespace-nowrap transition-colors duration-10 text-[12px] lg:text-[13px] xl:text-[14px]"
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
            </div>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Botón Trámites - Tablet */}
            <div className="hidden md:block lg:hidden">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-600 text-white font-bold text-[14px] py-2 px-4 rounded-full cursor-pointer transition-all duration-200 whitespace-nowrap">
                Colegiados
              </div>
            </div>
            
            {/* Mobile & Tablet Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="text-white p-2 focus:outline-none lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>

            {/* Botón Colegiados */}
            <div className="hidden lg:flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-600 text-white font-bold text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] py-1.5 lg:py-2 px-3 lg:px-4 xl:px-6 2xl:px-8 rounded-full cursor-pointer transition-all duration-200 whitespace-nowrap">
                Colegiados
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="lg:hidden bg-[#41023B] absolute top-full left-0 w-full shadow-lg z-50"
          >
            <div className="px-4 py-2">
              {menuItems.map((item, index) => (
                <div key={index} className="py-2 border-b border-[#D7008A]/30 last:border-b-0">
                  <div 
                    className="flex justify-between items-center text-white font-bold py-2"
                    onClick={() => item.submenu ? toggleMobileSubmenu(index) : null}
                  >
                    <span>{item.title}</span>
                    {item.submenu && (
                      <FaChevronDown className={`w-3 h-3 transition-transform duration-300 ${mobileSubmenuOpen === index ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                  
                  {item.submenu && mobileSubmenuOpen === index && (
                    <div className="pl-4 py-2 space-y-2">
                      {item.submenu.map((subItem, subIndex) => (
                        <div
                          key={subIndex}
                          className="py-2 text-white hover:text-gray-200 cursor-pointer"
                        >
                          {subItem}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Colegiados */}
              <div className="py-4 flex justify-center md:hidden">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-600 text-white font-bold text-[16px] py-2 px-6 rounded-full cursor-pointer transition-all duration-200">
                  Colegiados
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Fondo Oscuro */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          aria-hidden="true"
        ></div>
      )}
    </>
  );
}