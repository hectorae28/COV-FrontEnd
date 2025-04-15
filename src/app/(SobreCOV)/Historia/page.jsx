"use client";

import { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { getGradientColor } from "../../Components/SobreCOV/LineaTHist";
import { ReflexionSection } from "../../Components/SobreCOV/ReflexionSection";
import {
  fetchDataLanding,
  fetchHistoria,
} from "../../../api/endpoints/landingPage";
import {
  Clock,
  Award,
  BookOpen,
  Users,
  GlobeIcon,
  MedalIcon,
} from "lucide-react";

const iconMap = {
  Clock,
  Award,
  BookOpen,
  Users,
  GlobeIcon,
  MedalIcon,
};

const IconComponent = ({ name }) => {
  const Icon = iconMap[name];
  return Icon ? <Icon /> : null;
};

const TimelineCard = ({
  fecha,
  titulo,
  subtitulo,
  icono,
  color,
  contenido,
  isLast,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="flex items-start group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ x: 5 }}
    >
      {/* Left side: Timeline */}
      <div className="relative flex flex-col items-center mr-4">
        {/* Timeline vertical line */}
        {!isLast && (
          <motion.div
            className="absolute top-8 bottom-0 w-1 bg-gradient-to-b from-gray-100 to-gray-300"
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        )}

        {/* Timeline dot */}
        <motion.div
          className={`
            relative z-10 w-6 h-6 rounded-full border-2 border-white
            bg-gradient-to-br ${color} shadow-md
            group-hover:scale-110 transition-transform duration-300
          `}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          whileHover={{ scale: 1.2, rotate: 10 }}
        />
      </div>

      {/* Right side: Card content */}
      <div className="flex-1">
        {/* Prominent fecha Display */}
        <motion.div
          className="mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <span
            className={`
            inline-block px-3 py-0.5 rounded-full text-black font-bold
            bg-gradient-to-r shadow-sm
            text-xs tracking-wide
          `}
          >
            {fecha}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`
            relative overflow-hidden rounded-lg border-0 shadow-md
            transition-all duration-500 ease-out
            ${isExpanded ? "shadow-lg" : ""}
          `}
          whileHover={{
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div className="relative p-4 bg-gradient-to-tr from-white to-gray-100">
            <div className="flex">
              {/* Left column: Icon */}
              <div className="mr-4">
                <motion.div
                  className={`
                    flex items-center justify-center p-2 rounded-lg text-white
                    bg-gradient-to-br ${color} shadow-md
                    transition-all duration-500 ease-out
                    ${isExpanded ? "scale-110 rotate-10" : "rotate-0"}
                    w-10 h-10
                  `}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <IconComponent className="w-5 h-5" name={icono} />
                  {/* <Icon className="w-5 h-5" /> */}
                </motion.div>
              </div>

              {/* Right column: Content */}
              <div className="flex-1">
                {/* titulo and Description */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {titulo}
                  </h3>
                  <p className="text-gray-800 text-sm">{subtitulo}</p>
                </div>

                {/* Expand/Collapse Button */}
                {contenido && (
                  <motion.div
                    className="flex items-center text-xs text-[#C40180] cursor-pointer mt-2"
                    onClick={() => setIsExpanded(!isExpanded)}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isExpanded ? "Mostrar menos" : "Leer más"}
                    <ChevronRight
                      className={`
                        ml-1 w-3 h-3 transition-transform 
                        ${isExpanded ? "rotate-90" : ""}
                      `}
                    />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Expanded Description - Now integrated within the card */}
            <AnimatePresence>
              {isExpanded && contenido && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 overflow-hidden"
                >
                  <div className="pt-3 border-t border-gray-300 text-gray-700 text-sm">
                    <p>{contenido}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ReflectionCard = ({ title, content, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="group w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <motion.div
        className={`
          relative overflow-hidden rounded-lg border-0 shadow-md
          transition-all duration-500 ease-out w-full
          ${isExpanded ? "shadow-lg" : ""}
        `}
        whileHover={{
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div className="relative p-4 bg-gradient-to-tr from-white to-gray-100">
          <div className="flex items-center">
            {/* Numbered indicator instead of icon */}
            <motion.div
              className={`
                mr-4 flex items-center justify-center p-2 rounded-lg text-white
                bg-gradient-to-br from-[#C40180] to-[#590248] shadow-md
                transition-all duration-500 ease-out
                ${isExpanded ? "scale-110 rotate-10" : "rotate-0"}
                w-10 h-10
              `}
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <span className="text-lg font-bold">{index + 1}</span>
            </motion.div>

            {/* Title and Action */}
            <div className="flex-1 flex justify-between items-center">
              <h3 className="sm:text-md sm:w-2/3 lg:text-lg font-bold text-gray-800 ">
                {title}
              </h3>
              <motion.div
                className="flex items-center text-xs text-[#C40180] cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
              >
                {isExpanded ? "Mostrar menos" : "Leer más"}
                <ChevronRight
                  className={`
                    ml-1 w-3 h-3 transition-transform 
                    ${isExpanded ? "rotate-90" : ""}
                  `}
                />
              </motion.div>
            </div>
          </div>

          {/* Expanded Description - Fixed width issue */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 overflow-hidden w-full"
              >
                <div className="pt-3 border-t border-gray-300 text-gray-700 text-sm break-words p-4">
                  {content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Historia() {
  const [LineaTSection, setLineaTSection] = useState([]);
  const [reflexiones, setReflexiones] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      try {
        const LineaTSection = await fetchHistoria();
        setLineaTSection(LineaTSection.data);
        const reflexiones = await fetchDataLanding("reflexiones");
        setReflexiones(reflexiones.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#C40180]"></div>
        <p className="ml-4 text-gray-600">Cargando...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col mt-12 lg:mt-20">
      <main className="container mx-auto px-4 py-20 flex-grow">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative z-20"
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-4xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          >
            Nuestra Historia
          </motion.h1>
          <motion.p
            className="mt-6 max-w-4xl mx-auto text-gray-600 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Un recorrido por más de un siglo de evolución, lucha y
            transformación de la odontología venezolana.
          </motion.p>
        </motion.div>

        {/* Main Content - Two Columns */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative flex flex-col md:flex-row gap-16 min-h-[800px]"
        >
          {/* Timeline Section */}
          <section className="space-y-12 pl-4 md:w-1/2">
            {LineaTSection.map((milestone, index) => (
              <TimelineCard
                key={index}
                {...milestone}
                color={getGradientColor(index)}
                isLast={index === LineaTSection.length - 1}
              />
            ))}
          </section>

          {/* Reflections Section - Fixed to show all content without scrolling */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 relative"
          >
            <div className="sticky top-[120px] pb-8 pr-2">
              {reflexiones.title.map((item, index) => (
                <div className="border-b border-gray-300 pb-4 mb-4" key={index}>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-800 mt-1">{item.contenido}</p>
                </div>
              ))}

              <div className="space-y-6 overflow-x-visible">
                {reflexiones.reflexions.map((section, index) => (
                  <ReflectionCard
                    key={index}
                    title={section.title}
                    content={section.contenido}
                    index={index}
                  />
                ))}
              </div>

              {/* Final Quote is now part of the content */}
              <div className="mt-6">
                {reflexiones.quote.map((item, index) => (
                  <div
                    className="mt-6 border-t border-gray-300 pt-4"
                    key={index}
                  >
                    <blockquote className="italic text-gray-700 text-sm pl-4 border-l-2 border-[#C40180]">
                      {item.contenido}
                    </blockquote>
                    <p className="text-right text-xs text-gray-500 mt-2">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
}
