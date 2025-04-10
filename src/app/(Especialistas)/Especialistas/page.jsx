"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import EspecialistasTable from "../../Components/Especialistas/EspecialistasTable";
import EspecialidadesTabs from "../../Components/Especialistas/EspecialidadesTabs";
import { fetchData } from "../../../api/endpoints/landingPage";

export default function EspecialistasPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [especialidadesInfo, setEspecialidadesInfo] = useState({
    todas: {
      id: 0,
      title: "Todas las Especialidades",
      description: "Directorio completo de especialistas odontológicos.",
      color: "#073B4C",
      image: "/files/otros/Todas.avif",
      icon: "users",
    },
  });

  // Referencia a la tabla para el desplazamiento
  const tableRef = useRef(null);
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchData("especializacion");
        setEspecialidadesInfo((prev) => ({ ...prev, ...response.data }));
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    loadData();
  }, []);

  // Restablecer la página actual cuando cambia la pestaña o el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // Manejar cambio de tab
  const handleTabChange = (id) => {
    console.log("Tab changed:", id);
    console.log({ activeTab });
    setActiveTab(id);
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Función para desplazarse a la tabla
  const scrollToTable = () => {
    if (tableRef.current) {
      setTimeout(() => {
        tableRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100); // Pequeño retraso para asegurar que la animación de la tabla haya comenzado
    }
  };
  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32 py-12 max-w-full">
      {/* Título principal con animaciones mejoradas y margin-top agregado */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-16 mt-18 md:mt-28"
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-4xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            type: "spring",
            stiffness: 100,
          }}
        >
          Especialidades Odontológicas
        </motion.h1>
        <motion.p
          className="mt-4 max-w-3xl mx-auto text-gray-600 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Directorio de especialistas del Colegio Odontológico de Venezuela
        </motion.p>
      </motion.div>

      {/* Panel de especialidades con tarjetas en una sola fila */}
      <EspecialidadesTabs
        props={{
          activeTab,
          handleTabChange,
          scrollToTable,
          especialidadesInfo,
        }}
      />

      {/* Tabla de especialistas */}
      <div ref={tableRef}>
        {/* <EspecialistasTable
          activeTab={activeTab}
          onTabChange={handleTabChange}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          clearSearch={clearSearch}
        /> */}
      </div>
    </div>
  );
}
