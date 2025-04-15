"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, ChevronRight, ExternalLink } from "lucide-react";
import { eventsData } from "../../Components/Eventos/EventosData";
import { fetchEventosCursos } from "../../../api/endpoints/landingPage";
import Link from "next/link";

const EventCardWrapper = ({
  title,
  date,
  hora_inicio,
  location,
  image,
  linkText = "Inscripciones clic aquí",
  link = "#",
}) => {
  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div
        className="overflow-hidden rounded-xl shadow-lg bg-white border border-gray-100 h-full flex flex-col"
        style={{
          backgroundImage:
            "radial-gradient(circle at bottom right, rgba(196, 1, 128, 0.03), transparent)",
        }}
      >
        {/* Card Header with Image - Fixed Height */}
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <div
            className={`absolute inset-0 ${
              image
                ? "bg-white"
                : "bg-gradient-to-br from-[#C40180] to-[#590248]"
            } opacity-80`}
          ></div>
          <div className="absolute inset-0">
            {image ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BACK_HOST}${image}`}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  viewBox="0 0 800 800"
                  className="w-32 h-32 text-white opacity-10"
                >
                  <path
                    fill="currentColor"
                    d="M400 0C179.1 0 0 179.1 0 400s179.1 400 400 400 400-179.1 400-400S620.9 0 400 0zm0 722c-177.2 0-322-144.8-322-322S222.8 78 400 78s322 144.8 322 322-144.8 322-322 322zm22-483h-44v142.2l111.7 111.7 31.1-31.1-98.8-98.8V239z"
                  />
                </svg>
              </div>
            )}
          </div>
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <h3 className="text-xl md:text-2xl font-bold text-white line-clamp-1">
              {title}
            </h3>
          </div>
        </div>
        {/* Card Content - Flexible Height with Flex Grow */}
        <div className="p-4 flex flex-col flex-grow space-y-4">
          {/* Event Details */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center text-sm text-gray-700 gap-2">
              <Calendar className="w-4 h-4 mr-2 text-[#C40180]" />
              <span>{date}</span> <span>{hora_inicio}</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <MapPin className="w-4 h-4 mr-2 text-[#C40180]" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>
          {/* Action Button - Always at Bottom */}
          <div>
            <a
              href={link}
              className="inline-flex items-center justify-center w-full px-5 py-2 rounded-md bg-gradient-to-r from-[#C40180] to-[#590248] text-white font-semibold text-sm transition-transform hover:scale-105 active:scale-95"
            >
              {linkText}
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Eventos() {
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchEventosCursos();
        setEventsData(response.data);
        setVisibleEvents(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedFilter === "todos") {
      setVisibleEvents(eventsData);
    } else {
      setVisibleEvents(
        eventsData.filter((event) => event.category === selectedFilter)
      );
    }
  }, [selectedFilter]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-16 flex-grow">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 relative z-10"
        >
          <motion.h1
            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text mt-18 md:mt-28"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          >
            Eventos
          </motion.h1>
          <motion.p
            className="mt-4 max-w-2xl mx-auto text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Mantente al día con nuestras actividades científicas, congresos,
            cursos y eventos académicos
          </motion.p>
        </motion.div>
        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-white rounded-lg shadow-md">
            {["todos", "Eventos", "Cursos"].map((filter) => (
              <button
                key={filter}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  selectedFilter === filter
                    ? "bg-gradient-to-r from-[#C40180] to-[#590248] text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedFilter(filter)}
              >
                {filter === "todos" ? "Todos" : filter}
              </button>
            ))}
          </div>
        </div>
        {/* Events Grid - Using CSS Grid with Same-Height Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          <AnimatePresence>
            {visibleEvents.map((event, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <EventCardWrapper {...event} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {/* Empty State */}
        {visibleEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700">
              No hay eventos en esta categoría
            </h3>
            <p className="text-gray-500 mt-2">
              Intenta seleccionar otra categoría o vuelve más tarde
            </p>
          </motion.div>
        )}
        {/* Future Events Teaser */}
        <div className="mt-16">
          <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-white to-gray-100 shadow-xl border border-gray-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg
                className="w-full h-full"
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="smallGrid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#smallGrid)"
                  stroke="#C40180"
                />
              </svg>
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ¿Tienes un evento en mente?
              </h2>
              <p className="text-gray-600 mb-6">
                El Colegio de Odontólogos de Venezuela ofrece sus espacios para
                la realización de eventos científicos y académicos. Contáctanos
                para conocer más sobre nuestras instalaciones y disponibilidad.
              </p>
              <Link
                href="/Contactenos"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#C40180] to-[#590248] text-white font-medium text-sm transition-transform hover:scale-105 active:scale-95"
              >
                Contactar
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
