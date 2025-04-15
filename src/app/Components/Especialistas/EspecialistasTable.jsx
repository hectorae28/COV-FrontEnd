"use client";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Info,
  X,
  ChevronRight,
  Menu,
} from "lucide-react";
import { fetchData } from "@/api/endpoints/landingPage";

export default function EspecialistasTable({
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  onTabChange,
  clearSearch,
  especialidadesInfo,
  activeTab,
}) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);
  const [especialidadesData, setEspecialidadesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const tablaRef = useRef(null);
  const [paginacionConfig, setPaginacionConfig] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchData(
          "colegiado_especializacion",
          `?especializacion=${
            activeTab == 0 ? "" : activeTab
          }&page_size=${recordsPerPage}&page=${currentPage}${
            sortConfig.key !== null
              ? `&ordering=${sortConfig.direction === "ascending" ? "-" : ""}${
                  sortConfig.key
                }`
              : ""
          }&search=${searchTerm}`
        );

        setEspecialidadesData(res.data.results);
        setPaginacionConfig(res.data);
        setTotalPages(Math.ceil(res.data.count / recordsPerPage));
        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };
    loadData();
  }, [activeTab, currentPage, recordsPerPage, sortConfig, searchTerm]);

  // Obtener información de la especialidad activa
  const getEspecialidadInfo = useCallback(
    (label = activeTab) => {
      // Encontrar el item correspondiente al id de activeTab
      const selectedItem = Object.entries(especialidadesInfo).filter(
        ([_, info]) => info.id === label
      );
      return selectedItem[0][1];
    },
    [activeTab]
  );

  const especialidadInfo = getEspecialidadInfo();

  // Filtrar datos según la especialidad activa y término de búsqueda
  const getFilteredData = useCallback(() => {
    if (!especialidadesData) {
      return [];
    }
    let filtered = [...especialidadesData];
    return filtered;
  }, [especialidadesData]);

  const filteredData = useMemo(() => getFilteredData(), [getFilteredData]);

  // // Calcular índices para paginación
  // const indexOfLastRecord = currentPage * recordsPerPage;
  // const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData;
  //   indexOfFirstRecord,
  //   indexOfLastRecord
  // );

  // Función para ordenar datos
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  // Obtener icono de ordenamiento
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const toggleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  const handleSearch = (e) => {
    console.log(e.target.value);
    const setSearchTimeout = setTimeout(() => {
      setSearchTerm(e.target.value.split(".").join(""));
      setCurrentPage(1);
    }, 500);
    if (setSearchTimeout) {
      clearTimeout(setSearchTimeout);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#C40180]"></div>
        <p className="ml-4 text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-xl overflow-hidden mb-8"
        ref={tablaRef}
      >
        <motion.div
          className="h-2 w-full"
          style={{ backgroundColor: especialidadInfo.color }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{ color: especialidadInfo.color }}
              >
                {especialidadInfo.title}
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl">
                {especialidadInfo.description}
              </p>
              {activeTab !== "todas" && (
                <button
                  className="mt-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:underline flex items-center"
                  onClick={() => onTabChange(0)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Ver todas las
                  especialidades
                </button>
              )}
            </motion.div>
            <motion.div
              className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto mt-6 md:mt-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                  style={{
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    focusRingColor: `${especialidadInfo.color}60`,
                  }}
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value.split(".").join(""))
                  }
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              <div className="flex w-full md:w-auto justify-between items-center space-x-2">
                <select
                  className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none bg-white"
                  style={{
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    focusRingColor: `${especialidadInfo.color}60`,
                  }}
                  value={recordsPerPage}
                  onChange={(e) => setRecordsPerPage(Number(e.target.value))}
                >
                  <option value={5}>5 por página</option>
                  <option value={10}>10 por página</option>
                  <option value={20}>20 por página</option>
                  <option value={50}>50 por página</option>
                </select>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="md:hidden px-3 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 font-medium transition-colors duration-200 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" /> Limpiar
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Desktop Table View */}
          <motion.div
            className="hidden md:block overflow-x-auto rounded-xl border border-gray-200"
            style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <table className="min-w-full divide-y divide-gray-200 text-center">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center font-medium focus:outline-none mx-auto"
                      onClick={() =>
                        requestSort("colegiado__recaudos__persona__nombre")
                      }
                    >
                      Nombre(s)
                      {getSortIcon("colegiado__recaudos__persona__nombre")}
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center font-medium focus:outline-none mx-auto"
                      onClick={() =>
                        requestSort(
                          "colegiado__recaudos__persona__primer_apellido"
                        )
                      }
                    >
                      Apellido(s)
                      {getSortIcon(
                        "colegiado__recaudos__persona__primer_apellido"
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center font-medium focus:outline-none mx-auto"
                      onClick={() => requestSort("colegiado__libro")}
                    >
                      Libro
                      {getSortIcon("colegiado__libro")}
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center font-medium focus:outline-none mx-auto"
                      onClick={() => requestSort("colegiado__pagina")}
                    >
                      Folio
                      {getSortIcon("colegiado__pagina")}
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center font-medium focus:outline-none group mx-auto"
                      onClick={() => requestSort("nEspecializacion")}
                    >
                      <span className="flex items-center">
                        N° Esp
                        <span className="relative">
                          <Info className="h-3.5 w-3.5 ml-1 text-gray-400 group-hover:text-gray-600" />
                          <span className="absolute left-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-32 pointer-events-none">
                            Número de especialidad
                          </span>
                        </span>
                      </span>
                      {getSortIcon("nEspecializacion")}
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center font-medium focus:outline-none mx-auto"
                      onClick={() =>
                        requestSort(
                          "colegiado__recaudos__persona__identificacion"
                        )
                      }
                    >
                      Cédula
                      {getSortIcon(
                        "colegiado__recaudos__persona__identificacion"
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center font-medium focus:outline-none mx-auto"
                      onClick={() => requestSort("colegiado__num_cov")}
                    >
                      COV
                      {getSortIcon("colegiado__num_cov")}
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center font-medium focus:outline-none mx-auto"
                      onClick={() => requestSort("especializacion__pk")}
                    >
                      Especialidad
                      {getSortIcon("especializacion__pk")}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {currentRecords.length > 0 ? (
                    currentRecords.map((item, index) => {
                      // Obtener el color de la especialidad
                      const espKey = item.especialidad;
                      const espColor =
                        getEspecialidadInfo(espKey)?.color || "#073B4C";
                      return (
                        <motion.tr
                          key={`desktop-${item.id}`}
                          className="hover:bg-gray-50 transition-colors"
                          initial={{
                            opacity: 0,
                            backgroundColor: `${espColor}08`,
                          }}
                          animate={{
                            opacity: 1,
                            backgroundColor: "transparent",
                          }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          exit={{ opacity: 0 }}
                          whileHover={{ backgroundColor: `${espColor}10` }}
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.nombres}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.apellidos}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.libro}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.folio}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.numEspecialidad}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.cedula}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.cov}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <motion.span
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                              className="px-3 py-1.5 text-xs font-medium rounded-full cursor-pointer"
                              style={{
                                backgroundColor: `${espColor}15`,
                                color: espColor,
                                border: `1px solid ${espColor}30`,
                              }}
                            >
                              {getEspecialidadInfo(espKey)?.title}
                            </motion.span>
                          </td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td colSpan={8} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Search className="w-12 h-12 mb-4 text-gray-300" />
                          <p className="text-lg font-medium mb-1">
                            No se encontraron resultados
                          </p>
                          <p className="text-sm">
                            Intenta con otros criterios de búsqueda
                          </p>
                          {searchTerm && (
                            <button
                              onClick={clearSearch}
                              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 font-medium transition-colors duration-200"
                            >
                              Limpiar búsqueda
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
          {/* Mobile Card View */}
          <motion.div
            className="md:hidden space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {currentRecords.length > 0 ? (
              currentRecords.map((item, index) => {
                // Obtener el color de la especialidad
                const espKey = item.especialidad;
                const espColor =
                  getEspecialidadInfo(espKey)?.color || "#073B4C";
                const isExpanded = expandedRow === item.id;

                return (
                  <motion.div
                    key={`mobile-${item.id}`}
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    exit={{ opacity: 0 }}
                    style={{
                      borderLeft: `4px solid ${espColor}`,
                    }}
                  >
                    {/* Card Header - Always visible */}
                    <div
                      className="p-4 bg-white flex justify-between items-center cursor-pointer"
                      onClick={() => toggleExpandRow(item.id)}
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {item.nombres} {item.apellidos}
                        </h3>
                        <motion.span
                          className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full"
                          style={{
                            backgroundColor: `${espColor}15`,
                            color: espColor,
                            border: `1px solid ${espColor}30`,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEspecialidadChange(item.especialidad);
                          }}
                        >
                          {item.especialidad}
                        </motion.span>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      </motion.div>
                    </div>

                    {/* Expandable Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-100 bg-gray-50"
                        >
                          <div className="p-4 grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-500 text-xs mb-1">
                                Libro
                              </p>
                              <p className="font-medium">{item.libro}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs mb-1">
                                Folio
                              </p>
                              <p className="font-medium">{item.folio}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs mb-1">
                                N° Especialidad
                              </p>
                              <p className="font-medium">
                                {item.numEspecialidad}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs mb-1">
                                Cédula
                              </p>
                              <p className="font-medium">{item.cedula}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-gray-500 text-xs mb-1">COV</p>
                              <p className="font-medium">{item.cov}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg border border-gray-200 p-8 text-center"
              >
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Search className="w-10 h-10 mb-3 text-gray-300" />
                  <p className="text-base font-medium mb-1">
                    No se encontraron resultados
                  </p>
                  <p className="text-sm">
                    Intenta con otros criterios de búsqueda
                  </p>
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 font-medium transition-colors duration-200"
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
          {/* Paginación mejorada */}
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="text-xs md:text-sm text-gray-600 mb-4 md:mb-0">
              Mostrando desde 1 hasta 5 de 50 registros
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                onClick={prevPage}
                disabled={paginacionConfig.prev === null}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              {/* Mobile page indicator */}
              <div className="md:hidden flex items-center justify-center px-3 py-1 bg-white border border-gray-300 rounded-md shadow-sm">
                <span className="text-sm font-medium">
                  {currentPage} / {totalPages}
                </span>
              </div>

              {/* Desktop pagination buttons */}
              <div className="hidden md:flex space-x-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Lógica para mostrar páginas alrededor de la página actual
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <motion.button
                      key={pageNum}
                      whileHover={{ scale: currentPage === pageNum ? 1 : 1.05 }}
                      whileTap={{ scale: currentPage === pageNum ? 1 : 0.95 }}
                      onClick={() => paginate(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer shadow-sm ${
                        currentPage === pageNum
                          ? "text-white font-medium"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                      style={{
                        backgroundColor:
                          currentPage === pageNum ? especialidadInfo.color : "",
                      }}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                onClick={nextPage}
                disabled={paginacionConfig.next == null}
                className={`p-2 rounded-md ${
                  currentPage === totalPages || totalPages === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm cursor-pointer"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
