"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, UserX, UserCheck, PlusCircle, Eye, AlertCircle } from "lucide-react";

export default function ColegiadosList() {
  const [colegiados, setColegiados] = useState([]);
  const [filteredColegiados, setFilteredColegiados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    status: "todos", // 'todos', 'activos', 'inactivos', 'pendientes'
    solvencia: "todos" // 'todos', 'solventes', 'no-solventes'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [adminLevel, setAdminLevel] = useState("bajo"); // Simular nivel de admin

  // Simular carga de colegiados
  useEffect(() => {
    // En una implementación real, obtener nivel de admin del contexto o API
    setAdminLevel("medio"); // Para propósitos de demostración

    const fetchColegiados = async () => {
      try {
        setTimeout(() => {
          // Datos de ejemplo
          const mockColegiados = [
            {
              id: 1,
              nombre: "Ana María",
              apellido: "Rodríguez",
              email: "ana.rodriguez@ejemplo.com",
              numeroColegiado: "COV-12345",
              telefono: "+58 412 555 1234",
              especialidad: "Ortodoncia",
              status: "activo",
              solvencia: {
                estado: "solvente",
                fechaVencimiento: "17-12-2025"
              },
              fechaRegistro: "10-01-2023"
            },
            {
              id: 2,
              nombre: "Carlos",
              apellido: "Méndez",
              email: "carlos.mendez@ejemplo.com",
              numeroColegiado: "COV-12346",
              telefono: "+58 414 555 5678",
              especialidad: "Odontopediatría",
              status: "inactivo",
              solvencia: {
                estado: "no-solvente",
                fechaVencimiento: "10-08-2024"
              },
              fechaRegistro: "15-03-2023"
            },
            {
              id: 3,
              nombre: "Gabriela",
              apellido: "Torres",
              email: "gabriela.torres@ejemplo.com",
              numeroColegiado: "COV-12347",
              telefono: "+58 416 555 9012",
              especialidad: "Endodoncia",
              status: "activo",
              solvencia: {
                estado: "solvente",
                fechaVencimiento: "25-05-2026"
              },
              fechaRegistro: "05-06-2023"
            },
            {
              id: 4,
              nombre: "Roberto",
              apellido: "Fernández",
              email: "roberto.fernandez@ejemplo.com",
              numeroColegiado: "COV-12348",
              telefono: "+58 424 555 3456",
              especialidad: "Cirugía Maxilofacial",
              status: "pendiente",
              solvencia: {
                estado: "pendiente",
                fechaVencimiento: null
              },
              fechaRegistro: "20-04-2025"
            },
            {
              id: 5,
              nombre: "Laura",
              apellido: "Sánchez",
              email: "laura.sanchez@ejemplo.com",
              numeroColegiado: "COV-12349",
              telefono: "+58 426 555 7890",
              especialidad: "Periodoncia",
              status: "activo",
              solvencia: {
                estado: "por-vencer",
                fechaVencimiento: "30-05-2025"
              },
              fechaRegistro: "15-07-2023"
            }
          ];
          
          setColegiados(mockColegiados);
          setFilteredColegiados(mockColegiados);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error al cargar colegiados:", error);
        setIsLoading(false);
      }
    };

    fetchColegiados();
  }, []);

  // Filtrar colegiados según criterios
  useEffect(() => {
    let result = colegiados;
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(colegiado => 
        colegiado.nombre.toLowerCase().includes(term) || 
        colegiado.apellido.toLowerCase().includes(term) || 
        colegiado.email.toLowerCase().includes(term) ||
        colegiado.numeroColegiado.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por estado
    if (filterOptions.status !== "todos") {
      result = result.filter(colegiado => colegiado.status === filterOptions.status);
    }
    
    // Filtrar por solvencia
    if (filterOptions.solvencia !== "todos") {
      result = result.filter(colegiado => 
        colegiado.solvencia.estado === filterOptions.solvencia
      );
    }
    
    setFilteredColegiados(result);
  }, [searchTerm, filterOptions, colegiados]);

  // Manejar cambio de filtros
  const handleFilterChange = (filterName, value) => {
    setFilterOptions(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Verificar si un colegiado tiene solvencia por vencer
  const isSolvencyExpiring = (colegiado) => {
    if (colegiado.solvencia.estado === "por-vencer") return true;
    
    if (!colegiado.solvencia.fechaVencimiento) return false;
    
    const today = new Date();
    const [day, month, year] = colegiado.solvencia.fechaVencimiento.split("-").map(Number);
    const expiryDate = new Date(year, month - 1, day);
    
    // Considerar "por vencer" si faltan menos de 30 días
    const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysToExpiry > 0 && daysToExpiry <= 30;
  };

  // Cambiar estado de colegiado (activo/inactivo)
  const handleToggleStatus = (id) => {
    // Verificar permisos - Solo nivel medio o alto puede cambiar estado
    if (adminLevel === "bajo") {
      alert("No tienes permiso para realizar esta acción");
      return;
    }

    setColegiados(prev => 
      prev.map(colegiado => {
        if (colegiado.id === id) {
          const newStatus = colegiado.status === "activo" ? "inactivo" : "activo";
          return { ...colegiado, status: newStatus };
        }
        return colegiado;
      })
    );
  };

  // Ver detalles de colegiado
  const handleViewDetails = (colegiado) => {
    // En implementación real, navegar a página de detalles
    alert(`Ver detalles de: ${colegiado.nombre} ${colegiado.apellido}`);
  };

  // Aprobar colegiado pendiente
  const handleApproveColegiado = (id) => {
    // Verificar permisos - Solo nivel medio o alto puede aprobar
    if (adminLevel === "bajo") {
      alert("No tienes permiso para realizar esta acción");
      return;
    }

    setColegiados(prev => 
      prev.map(colegiado => {
        if (colegiado.id === id) {
          return { ...colegiado, status: "activo" };
        }
        return colegiado;
      })
    );
    
    alert("Colegiado aprobado correctamente");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D7008A]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-20">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-[#41023B] mb-6">
          Gestión de Colegiados
        </h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            {/* Barra de búsqueda */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre, email o número de colegiado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            
            <div className="flex gap-2">
              {/* Botón de filtros */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                <Filter size={18} />
                <span>Filtros</span>
              </button>
            </div>
          </div>
          
          {/* Panel de filtros */}
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 p-4 rounded-md mb-4"
            >
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={filterOptions.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                  >
                    <option value="todos">Todos</option>
                    <option value="activo">Activos</option>
                    <option value="inactivo">Inactivos</option>
                    <option value="pendiente">Pendientes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Solvencia
                  </label>
                  <select
                    value={filterOptions.solvencia}
                    onChange={(e) => handleFilterChange("solvencia", e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                  >
                    <option value="todos">Todos</option>
                    <option value="solvente">Solventes</option>
                    <option value="por-vencer">Por vencer</option>
                    <option value="no-solvente">No solventes</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Mensaje de información sobre permisos */}
          {adminLevel === "bajo" && (
            <div className="bg-blue-50 p-4 rounded-md mb-4 text-sm text-blue-700 flex items-center gap-2">
              <AlertCircle size={16} className="text-blue-500" />
              <p>Tu nivel de permiso es <strong>básico</strong>. Solo puedes visualizar información. Para realizar cambios, contacta a un administrador de nivel superior.</p>
            </div>
          )}
          
          {/* Tabla de colegiados */}
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Colegiado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profesion/Ocupación
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solvencia
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredColegiados.length > 0 ? (
                  filteredColegiados.map((colegiado) => (
                    <tr key={colegiado.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {colegiado.nombre} {colegiado.apellido}
                            </div>
                            <div className="text-xs text-gray-500">
                              {colegiado.numeroColegiado} • {colegiado.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{colegiado.especialidad}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          colegiado.status === "activo" 
                            ? "bg-green-100 text-green-800" 
                            : colegiado.status === "pendiente"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                        }`}>
                          {colegiado.status === "activo" 
                            ? "Activo" 
                            : colegiado.status === "pendiente"
                              ? "Pendiente"
                              : "Inactivo"
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            colegiado.solvencia.estado === "solvente" 
                              ? "bg-green-100 text-green-800" 
                              : colegiado.solvencia.estado === "por-vencer" || isSolvencyExpiring(colegiado)
                                ? "bg-amber-100 text-amber-800"
                                : colegiado.solvencia.estado === "pendiente"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-red-100 text-red-800"
                          }`}>
                            {colegiado.solvencia.estado === "solvente" 
                              ? "Solvente" 
                              : colegiado.solvencia.estado === "por-vencer" || isSolvencyExpiring(colegiado)
                                ? "Por vencer"
                                : colegiado.solvencia.estado === "pendiente"
                                  ? "Pendiente"
                                  : "No solvente"
                            }
                          </span>
                          {colegiado.solvencia.fechaVencimiento && (
                            <span className="ml-2 text-xs text-gray-500">
                              {colegiado.solvencia.fechaVencimiento}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {/* Ver detalles */}
                          <button 
                            onClick={() => handleViewDetails(colegiado)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                            title="Ver detalles"
                          >
                            <Eye size={18} />
                          </button>
                          
                          {/* Aprobar colegiado pendiente */}
                          {colegiado.status === "pendiente" && (adminLevel === "medio" || adminLevel === "alto") && (
                            <button 
                              onClick={() => handleApproveColegiado(colegiado.id)}
                              className="text-green-600 hover:text-green-900 transition-colors"
                              title="Aprobar colegiado"
                            >
                              <UserCheck size={18} />
                            </button>
                          )}
                          
                          {/* Activar/Inactivar */}
                          {colegiado.status !== "pendiente" && (adminLevel === "medio" || adminLevel === "alto") && (
                            <button 
                              onClick={() => handleToggleStatus(colegiado.id)}
                              className={`${
                                colegiado.status === "activo" 
                                  ? "text-amber-600 hover:text-amber-900" 
                                  : "text-green-600 hover:text-green-900"
                              } transition-colors`}
                              title={colegiado.status === "activo" ? "Inactivar" : "Activar"}
                            >
                              <UserX size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      No se encontraron colegiados con los filtros aplicados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Información de resultados */}
          <div className="mt-4 text-sm text-gray-500">
            Mostrando {filteredColegiados.length} de {colegiados.length} colegiados
          </div>
        </motion.div>
      </div>
    </div>
  );
}