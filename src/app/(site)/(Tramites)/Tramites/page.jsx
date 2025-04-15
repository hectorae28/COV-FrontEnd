"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  ArrowRight,
  Download,
  ExternalLink,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import {
  BancoVenezuelaModal,
  PayPalModal,
} from "@/Components/Tramites/PaymentModals";
import {
  tramitesInfo,
  tramiteMapping,
  tarifasData,
} from "@/Components/Tramites/TramitesData";

export default function TramitesPanel() {
  // State management
  const [activeTab, setActiveTab] = useState("carnet");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isBancoVenezuelaModalOpen, setIsBancoVenezuelaModalOpen] =
    useState(false);
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Replace the useState and useEffect for window width with this approach
  const [windowWidth, setWindowWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Refs and animations
  const contentRef = useRef(null);
  const controls = useAnimation();

  // Get current tramite information
  const tramiteInfo = tramitesInfo[activeTab] || tramitesInfo["carnet"];

  // Check for mobile view on mount and resize
  // Use useEffect to update window width only on the client side
  useEffect(() => {
    // Set the initial width
    setWindowWidth(window.innerWidth);
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
      // Close dropdown on larger screens
      if (window.innerWidth >= 768) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Replace the isMobile variable definition with this
  // const isMobile = windowWidth < 768

  // Handle icon mapping for buttons
  const getIconComponent = (iconName) => {
    const icons = {
      Download: <Download className="w-4 h-4" />,
      ExternalLink: <ExternalLink className="w-4 h-4" />,
    };
    return icons[iconName] || null;
  };

  // Initialize animations and confetti effect when tab changes
  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 2000);
    controls.start({ opacity: 1, y: 0 });
    return () => clearTimeout(timer);
  }, [activeTab, controls]);

  // Generate star animation for the confetti effect
  const generateStars = () => {
    return Array.from({ length: 25 }).map((_, index) => {
      const size = Math.random() * 5 + 2;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 1;
      const duration = Math.random() * 3 + 1;

      return (
        <motion.div
          key={index}
          className="absolute rounded-full bg-white opacity-0"
          style={{ width: size, height: size, top: `${y}%`, left: `${x}%` }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: duration,
            delay: delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: Math.random() * 3,
          }}
        />
      );
    });
  };

  // Handle tab click for mobile dropdown
  const handleTabClick = (id) => {
    if (isMobile && id === activeTab && !isDropdownOpen) {
      setIsDropdownOpen(!isDropdownOpen);
      return;
    }

    setActiveTab(id);
    // Close dropdown after selection on mobile
    if (isMobile) {
      setIsDropdownOpen(false);
    }
  };

  // Filter out the active tab from dropdown options
  const dropdownOptions = Object.entries(tramitesInfo).filter(
    ([id]) => id !== activeTab
  );

  return (
    <div className="w-full px-4 md:px-20 py-6 md:py-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-8 md:mb-16 mt-16 md:mt-28"
      >
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            type: "spring",
            stiffness: 100,
          }}
        >
          Trámites Odontológicos
        </motion.h1>
        <motion.p
          className="mt-4 max-w-full mx-auto text-gray-600 text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Gestión de trámites profesionales del Colegio Odontológico de
          Venezuela
        </motion.p>
      </motion.div>

      {/* Main Content Grid - Maintain 3-column layout but with responsive adjustments */}
      <div
        className={`${
          !isMobile
            ? activeTab === "avalCursos"
              ? "grid grid-cols-[1fr_4fr]"
              : "grid grid-cols-[1fr_3fr_1.5fr]"
            : "block"
        } gap-8`}
        ref={contentRef}
      >
        {/* Column 1: Navigation Cards */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isMobile ? (
            <div className="mb-6">
              {/* Mobile dropdown content remains the same */}
              <motion.div
                className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-all duration-300 group ${
                  isDropdownOpen ? "ring-2" : ""
                }`}
                style={{
                  ringColor: isDropdownOpen ? tramiteInfo.color : "transparent",
                  height: "93px",
                }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                whileTap={{ scale: 0.98 }}
              >
                {/* Card Background Image */}
                <motion.div
                  className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500"
                  initial={{ scale: 1 }}
                  animate={{
                    scale: 1.05,
                    filter: "brightness(0.6)",
                  }}
                  transition={{ duration: 0.7 }}
                  style={{
                    backgroundImage: `url(${tramiteInfo.image})`,
                  }}
                />

                {/* Card Overlay Gradient */}
                <div
                  className="absolute inset-0 z-5 opacity-90 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(to right, ${
                      tramiteInfo.color
                    }DD, ${tramiteInfo.color + "88"})`,
                  }}
                />

                {/* Card Content */}
                <div className="absolute inset-0 px-4 flex items-center justify-between z-10">
                  <div className="flex items-center">
                    <div className="mr-3">
                      <div style={{ color: "white" }}>{tramiteInfo.icon}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white drop-shadow-md">
                        {tramiteInfo.title}
                      </h3>
                    </div>
                  </div>
                  <div
                    className={`text-white transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </div>

                {/* Active Indicator */}
                <motion.div
                  className="absolute right-0 top-0 bottom-0 w-1 z-10"
                  style={{ backgroundColor: "white" }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                />
              </motion.div>

              {/* Dropdown list with card-style items */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="overflow-hidden rounded-xl shadow-lg mt-2 space-y-2"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {dropdownOptions.map(([id, info], index) => (
                      <motion.div
                        key={id}
                        className="relative overflow-hidden rounded-xl cursor-pointer h-16 shadow-md"
                        onClick={() => handleTabClick(id)}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Card Background Image */}
                        <motion.div
                          className="absolute inset-0 bg-cover bg-center z-0"
                          style={{
                            backgroundImage: `url(${info.image})`,
                            filter: "brightness(0.6)",
                          }}
                        />

                        {/* Card Overlay Gradient */}
                        <div
                          className="absolute inset-0 z-5 opacity-90"
                          style={{
                            background: `linear-gradient(to right, ${info.color}DD, rgba(0,0,0,0.6))`,
                          }}
                        />

                        {/* Card Content */}
                        <div className="absolute inset-0 px-4 flex items-center justify-between z-10">
                          <div className="flex items-center">
                            <div className="mr-3">
                              <div style={{ color: "white" }}>{info.icon}</div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold text-white drop-shadow-md">
                                {info.title}
                              </h3>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-white" />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {Object.entries(tramitesInfo).map(([id, info], index) => (
                <motion.div
                  key={id}
                  className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-all duration-300 group ${
                    activeTab === id
                      ? "ring-2 transform scale-[1.02] z-10"
                      : "hover:shadow-xl bg-white"
                  }`}
                  style={{
                    ringColor: activeTab === id ? info.color : "transparent",
                    height: "93px",
                  }}
                  onClick={() => setActiveTab(id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    scale: activeTab === id ? 1.03 : 1.05,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setHoveredCard(id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Card Background Image */}
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500"
                    initial={{ scale: 1 }}
                    animate={{
                      scale: hoveredCard === id ? 1.15 : 1.05,
                      filter:
                        hoveredCard === id
                          ? "brightness(0.7)"
                          : "brightness(0.6)",
                    }}
                    transition={{ duration: 0.7 }}
                    style={{
                      backgroundImage: `url(${info.image})`,
                    }}
                  />

                  {/* Card Overlay Gradient */}
                  <div
                    className="absolute inset-0 z-5 opacity-90 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(to right, ${info.color}DD, ${
                        activeTab === id ? info.color + "88" : "rgba(0,0,0,0.6)"
                      })`,
                    }}
                  />

                  {/* Card Content */}
                  <motion.div
                    className="absolute inset-0 px-4 flex items-center z-10"
                    initial={{ y: 5 }}
                    animate={{ y: hoveredCard === id ? 0 : 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center w-full">
                      <div className="mr-3">
                        <div style={{ color: "white" }}>{info.icon}</div>
                      </div>
                      <div className="flex-1">
                        <motion.h3
                          className="text-lg font-bold text-white drop-shadow-md"
                          initial={{ x: -5, opacity: 0.9 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {info.title}
                        </motion.h3>
                      </div>
                      <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: hoveredCard === id ? 5 : 0 }}
                        transition={{ duration: 0.2, type: "spring" }}
                      >
                        <ArrowRight className="h-5 w-5 text-white" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Active Indicator */}
                  {activeTab === id && (
                    <motion.div
                      className="absolute right-0 top-0 bottom-0 w-1 z-10"
                      style={{ backgroundColor: "white" }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 15,
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Column 2: Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className={`w-full bg-white rounded-xl shadow-xl overflow-hidden relative ${
              isMobile ? "mb-6" : ""
            }`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Confetti Effect */}
            {showConfetti && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                {generateStars()}
              </div>
            )}

            {/* Colored Top Border */}
            <motion.div
              className="h-1 w-full"
              style={{ backgroundColor: tramiteInfo.color }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />

            {/* Content Container */}
            <div className="p-4 md:p-8 h-full overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* PDF Viewer for Aval de Cursos */}
                {tramiteInfo.pdfViewer ? (
                  <>
                    {/* Information about courses with COV approval */}
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4
                        className="font-medium mb-2"
                        style={{ color: tramiteInfo.color }}
                      >
                        Información para organizar cursos avalados por el COV
                      </h4>
                      <p className="text-gray-700 flex items-start">
                        <span className="text-gray-400 mr-2 font-medium mt-1">
                          •
                        </span>
                        <span>
                          Enviar la información a través del correo electrónico:
                          <a
                            href="mailto:doctrinacapacitacion@elcov.org"
                            className="ml-1 font-medium hover:underline block md:inline"
                            style={{ color: tramiteInfo.color }}
                          >
                            doctrinacapacitacion@elcov.org
                          </a>
                        </span>
                      </p>
                    </div>

                    {/* Mobile/Tablet: Only show buttons */}
                    <div className="md:hidden flex flex-col gap-4 items-center">
                      <div className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                        <p className="text-gray-700 mb-4">
                          Para visualizar el documento de requisitos, puede
                          abrirlo en una nueva ventana o descargarlo.
                        </p>
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() =>
                              window.open(tramiteInfo.pdfUrl, "_blank")
                            }
                            className="flex items-center justify-center px-4 py-2 rounded-lg text-white transition-all duration-300"
                            style={{ backgroundColor: tramiteInfo.color }}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            <span>Abrir</span>
                          </button>
                          <a
                            href={tramiteInfo.pdfUrl}
                            download
                            className="flex items-center justify-center px-4 py-2 rounded-lg border transition-all duration-300"
                            style={{
                              color: tramiteInfo.color,
                              borderColor: tramiteInfo.color,
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            <span>Descargar</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Desktop: PDF Viewer Component */}
                    <div className="hidden md:block relative bg-gray-100 rounded-lg overflow-hidden shadow-md">
                      {/* PDF Header */}
                      <div
                        className="flex justify-between items-center p-3 rounded-t-lg"
                        style={{
                          background: `linear-gradient(to right, ${tramiteInfo.color}, ${tramiteInfo.color}CC)`,
                        }}
                      >
                        <h3 className="text-sm font-bold text-white"></h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              window.open(tramiteInfo.pdfUrl, "_blank")
                            }
                            className="flex items-center justify-center px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-all duration-300"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            <span className="text-xs">Abrir</span>
                          </button>
                          <a
                            href={tramiteInfo.pdfUrl}
                            download
                            className="flex items-center justify-center px-2 py-1 rounded-md bg-white hover:bg-gray-100 transition-all duration-300"
                            style={{ color: tramiteInfo.color }}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            <span className="text-xs">Descargar</span>
                          </a>
                        </div>
                      </div>

                      {/* PDF Iframe */}
                      <div className="h-96">
                        <iframe
                          src={`${tramiteInfo.pdfUrl}#view=FitH&toolbar=0&navpanes=0`}
                          className="w-full h-full rounded-b-lg"
                          title="Documento de requisitos"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Requirements Section */}
                    <div>
                      <h4
                        className="font-semibold text-lg mb-3"
                        style={{ color: tramiteInfo.color }}
                      >
                        Requisitos:
                      </h4>
                      <ul className="list-disc pl-5 md:pl-8">
                        {tramiteInfo.requisitos.map((req, index) => (
                          <li
                            key={index}
                            className={`text-gray-700 ${
                              req.startsWith("-") ? "ml-4 list-none" : ""
                            } mb-1`}
                          >
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Additional Notes */}
                    {tramiteInfo.notas && tramiteInfo.notas.length > 0 && (
                      <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4
                          className="font-medium mb-2"
                          style={{ color: tramiteInfo.color }}
                        >
                          Notas importantes:
                        </h4>
                        <ul>
                          {tramiteInfo.notas.map((nota, index) => (
                            <li key={index} className="text-gray-700 flex mb-2">
                              <span className="text-gray-400 mr-2 flex-shrink-0">
                                •
                              </span>
                              <span>{nota}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {tramiteInfo.botones && tramiteInfo.botones.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-3 md:justify-start justify-center">
                        {tramiteInfo.botones.map((boton, index) => (
                          <a
                            key={index}
                            href={boton.link}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all duration-300"
                            style={{ backgroundColor: boton.color }}
                          >
                            {getIconComponent(boton.icon)}
                            <span>{boton.texto}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Column 3: Fees and Payment Info (hidden for aval cursos) */}
        {(activeTab !== "avalCursos" || !isMobile) && (
          <motion.div
            className={`w-full bg-white rounded-xl shadow-xl overflow-hidden ${
              isMobile && activeTab !== "avalCursos" ? "block" : ""
            }`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: isMobile && activeTab === "avalCursos" ? "none" : "",
            }}
          >
            {/* Colored Top Border */}
            <motion.div
              className="h-1 w-full"
              style={{ backgroundColor: tramiteInfo.color }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />

            <div className="p-4 md:p-6 h-full flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 overflow-auto"
              >
                <h3
                  className="text-xl font-semibold mb-4 text-center"
                  style={{ color: tramiteInfo.color }}
                >
                  Tarifas y Pagos
                </h3>

                {/* Fee Table */}
                <div className="mb-4 overflow-x-auto">
                  <div className="min-w-full rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Trámite
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Monto
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tarifasData.map((item, index) => (
                          <tr
                            key={index}
                            style={{
                              backgroundColor:
                                tramiteMapping[activeTab] === item.tramite
                                  ? `${tramiteInfo.color}15`
                                  : "",
                              fontWeight:
                                tramiteMapping[activeTab] === item.tramite
                                  ? "bold"
                                  : "normal",
                            }}
                          >
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                              {item.tramite}
                            </td>
                            <td
                              className="px-4 py-2 whitespace-nowrap text-sm"
                              style={{
                                color:
                                  tramiteMapping[activeTab] === item.tramite
                                    ? tramiteInfo.color
                                    : "rgb(55, 65, 81)",
                              }}
                            >
                              {item.monto}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="text-sm text-gray-700 space-y-2 mb-4">
                  {activeTab === "odontologos" && (
                    <p>
                      Las inscripciones se cobran a partir de la fecha de la
                      emisión del título. Consultar por vía telefónica para
                      obtener un monto exacto.
                    </p>
                  )}
                  <p className="text-justify">
                    <span className="font-bold">Carnet COV:</span> Para obtener
                    el carnet (físico o digital), es necesario estar solvente
                    con el COV. El físico se retira en las oficinas y el digital
                    se descarga desde el Sistema Colegiados.
                  </p>
                  {activeTab === "especialidades" && (
                    <p>
                      <span className="font-bold">Especialidades:</span> Debe
                      estar solvente con el COV.
                    </p>
                  )}
                </div>

                {/* Payment Methods */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Métodos de Pago:</h4>
                  <div className="flex flex-col gap-2">
                    {/* In-person Payment */}
                    <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300 text-sm">
                      <CreditCard className="w-4 h-4" />
                      <span>
                        Instalaciones del COV (Tarjeta de Débito / Crédito)
                      </span>
                    </button>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {/* Banco de Venezuela */}
                      <button
                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-red-600 border hover:bg-red-100 transition-all duration-300 text-sm"
                        onClick={() => setIsBancoVenezuelaModalOpen(true)}
                      >
                        <img
                          src="/assets/icons/BDV.png"
                          alt="Banco de Venezuela"
                          className="w-7 h-7"
                        />
                        <span>Banco de Venezuela</span>
                      </button>

                      {/* PayPal */}
                      <button
                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-blue-600 border hover:bg-blue-100 transition-all duration-300 text-sm"
                        onClick={() => setIsPayPalModalOpen(true)}
                      >
                        <img
                          src="/assets/icons/Paypal.png"
                          alt="PayPal"
                          className="w-5 h-5"
                        />
                        <span>PayPal</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Payment Modals */}
      <BancoVenezuelaModal
        isOpen={isBancoVenezuelaModalOpen}
        onClose={() => setIsBancoVenezuelaModalOpen(false)}
      />
      <PayPalModal
        isOpen={isPayPalModalOpen}
        onClose={() => setIsPayPalModalOpen(false)}
      />
    </div>
  );
}
