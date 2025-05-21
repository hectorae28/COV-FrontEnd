"use client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaBars, FaTimes, FaSpinner } from "react-icons/fa";
import Whatsapp from "./BottomFloat";
import LogoDownloadModal from "../../Components/SobreCOV/LogoDownloadModal";

const menuItems = [
  { title: "Inicio", route: "/" },
  {
    title: "Sobre COV",
    submenu: [
      { title: "Historia", route: "/Historia" },
      { title: "Galeria de Presidentes", route: "/GaleriaPresidentes" },
      { title: "Junta Directiva", route: "/JuntaDirectiva" },
      { title: "Leyes y Reglamentos", route: "/LeyesReglamentos" },
      { title: "Descargar Logo", action: "showLogoModal" },
    ],
  },
  {
    title: "Nueva Ley",
    route: "/NuevaLey",
  },
  {
    title: "Especialistas",
    route: "/Especialistas",
  },
  {
    title: "Eventos",
    route: "/CursosEventos",
  },
  { title: "Trámites", route: "/Tramites" },
  { title: "Contáctenos", route: "/Contactenos" },
  { title: "Revista", route: "https://rov.colegiadoselcov.com/" },
];

export default function AppBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [paddingY, setPaddingY] = useState(24);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(null);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading spinner
  const menuRefs = useRef([]);
  const mobileMenuRef = useRef(null);
  

  // Function to check if a menu item is active based on the current path
  const isMenuActive = (item) => {
    if (item.route === pathname) return true;
    if (item.submenu) {
      return item.submenu.some(
        (subItem) =>
          (subItem.route && pathname === subItem.route) ||
          (subItem.route && pathname.startsWith(subItem.route + "/"))
      );
    }
    return false;
  };

  // Function to check if a submenu item is active
  const isSubmenuActive = (route) => {
    return route && (pathname === route || pathname.startsWith(route + "/"));
  };

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = 100;
      const scrollY = window.scrollY;
      const newPaddingY = Math.max(12, 24 - (scrollY / maxScroll) * 12);
      setPaddingY(newPaddingY);
    };

    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="Toggle menu"]')
      ) {
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

  // Set the active submenu open on mobile when the page loads
  useEffect(() => {
    if (mobileMenuOpen) {
      menuItems.forEach((item, index) => {
        if (
          item.submenu &&
          item.submenu.some(
            (subItem) => subItem.route && isSubmenuActive(subItem.route)
          )
        ) {
          setMobileSubmenuOpen(index);
        }
      });
    }
  }, [mobileMenuOpen, pathname]);

  const navigateTo = (route, action) => {
    if (action === "showLogoModal") {
      setShowLogoModal(true);
      setMobileMenuOpen(false);
      setOpenMenu(null);
      setMobileSubmenuOpen(null);
    } else if (route) {
      router.push(route);
      setMobileMenuOpen(false);
      setOpenMenu(null);
      setMobileSubmenuOpen(null);
    }
  };

  // New function for handling login navigation with loading state
  const navigateToLogin = () => {
    setIsLoading(true);
    // Navigate to login page
    router.push("/Login");
  };

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
      {/* Fondo Oscuro */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          aria-hidden="true"
        ></div>
      )}
      <header
        className="bg-gradient-to-t from-[#D7008A] to-[#41023B] w-full z-1100 fixed top-0 left-0 transition-all duration-300 shadow-lg"
        style={{ paddingTop: `${paddingY}px`, paddingBottom: `${paddingY}px` }}
      >
        <div className="container mx-auto flex items-center justify-between px-4">
          {/* Logo */}
          <div
            onClick={() => navigateTo("/")}
            className="flex items-center cursor-pointer"
          >
            <Image
              src="/assets/logo.png"
              alt="logos"
              width={paddingY > 18 ? 260 : 200}
              height={paddingY > 18 ? 60 : 40}
              style={{ color: "transparent" }}
              className="transition-all duration-300 w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[220px]"
            />
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-grow items-center justify-center relative">
            <div className="cursor-pointer flex items-center lg:space-x-2 xl:space-x-4 2xl:space-x-10">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="relative group"
                  onMouseEnter={() => setOpenMenu(index)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  {item.route ? (
                    <span
                      onClick={() => navigateTo(item.route)}
                      className={`text-white font-bold text-[12px] lg:text-[13px] xl:text-[15px] 2xl:text-[16px] cursor-pointer flex items-center gap-1 lg:gap-2 transition-all duration-300 whitespace-nowrap ${isMenuActive(item) ? "text-yellow-400" : ""
                        }`}
                    >
                      {item.title}
                      {item.submenu && (
                        <FaChevronDown
                          className={`w-2 h-2 lg:w-2.5 lg:h-2.5 xl:w-3 xl:h-3 transition-transform duration-500 ${openMenu === index ? "rotate-180" : ""
                            }`}
                        />
                      )}
                    </span>
                  ) : (
                    <span
                      className={`text-white font-bold text-[12px] lg:text-[13px] xl:text-[15px] 2xl:text-[16px] cursor-pointer flex items-center gap-1 lg:gap-2 transition-all duration-300 whitespace-nowrap ${isMenuActive(item) ? "text-yellow-400" : ""
                        }`}
                    >
                      {item.title}
                      {item.submenu && (
                        <FaChevronDown
                          className={`w-2 h-2 lg:w-2.5 lg:h-2.5 xl:w-3 xl:h-3 transition-transform duration-500 ${openMenu === index ? "rotate-180" : ""
                            }`}
                        />
                      )}
                    </span>
                  )}
                  {item.submenu && openMenu === index && (
                    <>
                      <div
                        className="absolute top-0 left-0 w-full h-16 bg-transparent z-50"
                        onMouseEnter={() => handleBridgeHover(index)}
                      ></div>
                      <div
                        ref={(el) => (menuRefs.current[index] = el)}
                        className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-[#7c235d] shadow-lg rounded-lg py-3 z-50 min-w-48 overflow-hidden transition-all duration-300 ease-in-out opacity-0 pointer-events-none"
                        style={{
                          opacity: openMenu === index ? 1 : 0,
                          transform:
                            openMenu === index
                              ? "translateY(0)"
                              : "translateY(-10px)",
                          pointerEvents: openMenu === index ? "auto" : "none",
                        }}
                        onMouseEnter={() => setOpenMenu(index)}
                        onMouseLeave={() => setOpenMenu(null)}
                      >
                        <div className="space-y-2 px-2">
                          {item.submenu.map((subItem, subIndex) => (
                            <div
                              key={subIndex}
                              onClick={() =>
                                navigateTo(subItem.route, subItem.action)
                              }
                              className={`px-4 lg:px-6 xl:px-8 py-2 lg:py-3 ${subItem.route && isSubmenuActive(subItem.route)
                                  ? "bg-gray-200 text-black"
                                  : "text-white hover:text-black hover:bg-gray-200"
                                } rounded-xl cursor-pointer whitespace-nowrap transition-colors duration-100 text-[12px] lg:text-[13px] xl:text-[14px]`}
                            >
                              {subItem.title}
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
            {/* Botón Colegiados - Tablet */}
            <div className="hidden md:block lg:hidden">
              <div
                onClick={navigateToLogin}
                className={`bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-600 text-white font-bold text-[14px] py-2 px-4 rounded-full cursor-pointer transition-all duration-200 whitespace-nowrap ${pathname === "/Login" ? "ring-2 ring-yellow-300" : ""
                  } flex items-center justify-center`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Cargando...
                  </>
                ) : (
                  "Colegiados"
                )}
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
            {/* Botón Colegiados - Desktop */}
            <div className="hidden lg:flex items-center">
              <div
                onClick={navigateToLogin}
                className={`bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-600 text-white font-bold text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] py-1.5 lg:py-2 px-3 lg:px-4 xl:px-6 2xl:px-8 rounded-full cursor-pointer transition-all duration-200 whitespace-nowrap ${pathname === "/Login" ? "ring-2 ring-yellow-300" : ""
                  } flex items-center justify-center`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Cargando...
                  </>
                ) : (
                  "Colegiados"
                )}
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
              {menuItems.map((item, index) => {
                const isActive = isMenuActive(item);
                return (
                  <div
                    key={index}
                    className="py-2 border-b border-[#D7008A]/30 last:border-b-0"
                  >
                    {item.route ? (
                      <div
                        onClick={() => navigateTo(item.route)}
                        className={`flex justify-between items-center font-bold py-2 ${isActive ? "text-yellow-300" : "text-white"
                          }`}
                      >
                        <span>{item.title}</span>
                        {item.submenu && (
                          <FaChevronDown
                            className={`w-3 h-3 transition-transform duration-300 ${mobileSubmenuOpen === index ? "rotate-180" : ""
                              }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMobileSubmenu(index);
                            }}
                          />
                        )}
                      </div>
                    ) : (
                      <div
                        className={`flex justify-between items-center font-bold py-2 ${isActive ? "text-yellow-300" : "text-white"
                          }`}
                        onClick={() =>
                          item.submenu ? toggleMobileSubmenu(index) : null
                        }
                      >
                        <span>{item.title}</span>
                        {item.submenu && (
                          <FaChevronDown
                            className={`w-3 h-3 transition-transform duration-300 ${mobileSubmenuOpen === index ? "rotate-180" : ""
                              }`}
                          />
                        )}
                      </div>
                    )}
                    {item.submenu && mobileSubmenuOpen === index && (
                      <div className="pl-4 py-2 space-y-2">
                        {item.submenu.map((subItem, subIndex) => {
                          const isSubActive = isSubmenuActive(subItem.route);
                          return (
                            <div
                              key={subIndex}
                              onClick={() =>
                                navigateTo(subItem.route, subItem.action)
                              }
                              className={`py-2 cursor-pointer ${isSubActive
                                  ? "text-yellow-300 font-bold"
                                  : "text-white hover:text-gray-200"
                                }`}
                            >
                              {subItem.title}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Mobile Colegiados */}
              <div className="py-4 flex justify-center md:hidden">
                <div
                  onClick={navigateToLogin}
                  className={`bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-600 text-white font-bold text-[16px] py-2 px-6 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center ${pathname === "/Login" ? "ring-2 ring-yellow-300" : ""
                    }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Cargando...
                    </>
                  ) : (
                    "Colegiados"
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <Whatsapp />
      </header>
      {/* Logo Download Modal */}
      {showLogoModal && (
        <LogoDownloadModal onClose={() => setShowLogoModal(false)} />
      )}
    </>
  );
}
