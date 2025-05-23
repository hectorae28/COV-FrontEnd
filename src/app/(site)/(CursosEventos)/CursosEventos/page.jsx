"use client";
import { fetchEventosCursos } from "@/api/endpoints/landingPage";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Filter, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import EventCard from "./EventCard";

export default function Eventos() {
  // Estados para datos y filtros
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [eventsData, setEventsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Nuevos estados para filtrado por fecha
  const [dateFilter, setDateFilter] = useState("todos");
  const [customDateRange, setCustomDateRange] = useState({
    start: null,
    end: null
  });

  // Obtener la fecha actual para los filtros
  const currentDate = new Date();
  const oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);

  const oneMonthAhead = new Date(currentDate);
  oneMonthAhead.setMonth(currentDate.getMonth() + 1);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Primero intentamos cargar desde la API
        const response = await fetchEventosCursos();
        if (response.data && response.data.length > 0) {
          setEventsData(response.data);
          setVisibleEvents(response.data);
        } else {
          // En lugar de usar datos mock, mostrar array vacío o datos de ejemplo
          const emptyData = Array(3).fill().map((_, index) => ({
            id: `empty-${index}`,
            nombre: `Ejemplo de evento ${index + 1}`,
            fecha: new Date().toISOString(),
            lugar: "Sin ubicación",
            cover_url: null
          }));
          setEventsData(emptyData);
          setVisibleEvents(emptyData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Usar datos vacíos en lugar de datos mock
        const emptyData = Array(3).fill().map((_, index) => ({
          id: `empty-${index}`,
          nombre: `Ejemplo de evento ${index + 1}`,
          fecha: new Date().toISOString(),
          lugar: "Sin ubicación",
          cover_url: null
        }));
        setEventsData(emptyData);
        setVisibleEvents(emptyData);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Filtro para todos los criterios
  useEffect(() => {
    let filtered = [...eventsData];

    // 1. Filtrar por categoría (evento/curso)
    if (selectedFilter !== "todos") {
      const tipoFiltro = selectedFilter === "Eventos" ? "evento" : "curso";
      filtered = filtered.filter(event => {
        // Primero verificar el tipo explícito
        if (event.tipo) {
          return event.tipo.toLowerCase() === tipoFiltro;
        }

        // Si no hay tipo explícito, usar la lógica anterior
        if (tipoFiltro === "curso") {
          return event.nombre?.toLowerCase().includes("curso") ||
            event.title?.toLowerCase().includes("curso");
        } else {
          return !event.nombre?.toLowerCase().includes("curso") &&
            !event.title?.toLowerCase().includes("curso");
        }
      });
    }

    // 2. Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        (event.nombre && event.nombre.toLowerCase().includes(term)) ||
        (event.lugar && event.lugar.toLowerCase().includes(term)) ||
        (event.descripcion && event.descripcion.toLowerCase().includes(term))
      );
    }

    // 3. Filtrar por fecha
    if (dateFilter !== "todos") {
      filtered = filtered.filter(event => {
        // Convertir la fecha del evento a objeto Date
        const eventDate = new Date(event.fecha || event.date);

        // Filtro personalizado si se seleccionó un rango de fechas
        if (dateFilter === "custom" && customDateRange.start && customDateRange.end) {
          return eventDate >= new Date(customDateRange.start) &&
            eventDate <= new Date(customDateRange.end);
        }

        // Filtros predefinidos
        switch (dateFilter) {
          case "proximos":
            return eventDate > currentDate;
          case "mes-anterior":
            return eventDate >= oneMonthAgo && eventDate <= currentDate;
          case "mes-proximo":
            return eventDate >= currentDate && eventDate <= oneMonthAhead;
          case "pasados":
            return eventDate < currentDate;
          default:
            return true;
        }
      });
    }

    // Actualizar eventos visibles
    setVisibleEvents(filtered);
  }, [selectedFilter, searchTerm, dateFilter, customDateRange, eventsData]);

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
            Eventos y Cursos
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

        {/* Búsqueda y Filtros */}
        <div className="mb-10">
          <div className="flex flex-col gap-4 max-w-4xl mx-auto">
            {/* Buscador y Filtros */}
            <div className="mb-10">
              <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                {/* Tabs de filtro de categoría (centrados) */}
                <div className="flex justify-center">
                  <div className="inline-flex p-1 bg-white rounded-xl shadow-sm border border-gray-100">
                    {["todos", "Eventos", "Cursos"].map((filter) => (
                      <button
                        key={`filter-tipo-${filter}`}
                        className={`px-8 py-2.5 text-sm font-medium rounded-lg transition-all ${selectedFilter === filter
                          ? "bg-gradient-to-r from-[#C40180] to-[#590248] text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-100"
                          }`}
                        onClick={() => setSelectedFilter(filter)}
                      >
                        {filter === "todos" ? "Todos" : filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buscador (toda la línea) */}
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Buscar por nombre, lugar o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C40180] focus:border-transparent outline-none shadow-sm"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Selector de rango de fechas personalizado */}
            {dateFilter === "custom" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fecha-inicio" className="block text-sm font-medium text-gray-700 mb-1">
                    Desde
                  </label>
                  <input
                    id="fecha-inicio"
                    type="date"
                    value={customDateRange.start || ''}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#C40180] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="fecha-fin" className="block text-sm font-medium text-gray-700 mb-1">
                    Hasta
                  </label>
                  <input
                    id="fecha-fin"
                    type="date"
                    value={customDateRange.end || ''}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#C40180] focus:border-transparent outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estados de carga */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={`skeleton-${i}`} className="bg-white rounded-xl shadow-md overflow-hidden h-full animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                  <div className="h-10 bg-gray-300 rounded w-full mt-5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : visibleEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 max-w-md mx-auto"
          >
            <div className="text-gray-400 mb-6">
              <Filter className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? `No hay eventos o cursos que coincidan con "${searchTerm}"`
                : "No hay eventos o cursos disponibles con los filtros seleccionados"}
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedFilter("todos");
                setDateFilter("todos");
                setCustomDateRange({ start: null, end: null });
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpiar filtros
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            <AnimatePresence>
              {visibleEvents.map((event, index) => (
                <motion.div
                  key={`event-card-${event.id}-${index}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <EventCard
                    id={event.id}
                    title={event.nombre || event.title}
                    nombre={event.nombre}
                    date={event.fecha || event.date}
                    fecha={event.fecha}
                    hora_inicio={event.hora_inicio}
                    location={event.lugar || event.location}
                    lugar={event.lugar}
                    image={event.cover_url || event.image}
                    cover_url={event.cover_url}
                    linkText={event.linkText || "Inscríbete"}
                    precio={event.precio || event.price}
                    isPaid={event.isPaid || (event.precio && parseFloat(event.precio) > 0)}
                    showPriceTag={event.showPriceTag !== undefined ? event.showPriceTag : true}
                    currency={event.currency || "USD"}
                    formulario={event.formulario}
                    slug={event.slug}
                    tipo={event.tipo} // Pasar el tipo explícitamente
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Future Events Teaser */}
        <div className="mt-20">
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