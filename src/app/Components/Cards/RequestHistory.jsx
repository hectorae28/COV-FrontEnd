"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Check, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Eye,
  Download
} from "lucide-react";

export default function RequestHistory() {
  // Estado para las solicitudes
  const [solicitudes, setSolicitudes] = useState([
    { 
      id: "SOL-001",
      tipo: "Constancia", 
      fecha: "01/03/2023", 
      costo: "$15.00",
      estado: "completado",
      documentos: 1
    },
    { 
      id: "SOL-002",
      tipo: "Carnet", 
      fecha: "15/03/2023", 
      costo: "$25.00",
      estado: "pendiente",
      documentos: 2
    },
    { 
      id: "SOL-003",
      tipo: "Multiple", 
      fecha: "28/03/2023", 
      costo: "$67.50",
      estado: "rechazado",
      documentos: 3,
      comentario: "Faltan documentos requeridos"
    },
    { 
      id: "SOL-004",
      tipo: "Especialidad", 
      fecha: "10/04/2023", 
      costo: "$35.00",
      estado: "en revisión",
      documentos: 2
    },
  ]);
  
  // Estado para el filtro
  const [filtro, setFiltro] = useState("todos");
  
  // Estado para la búsqueda
  const [busqueda, setBusqueda] = useState("");
  
  // Estado para las solicitudes filtradas
  const [solicitudesFiltradas, setSolicitudesFiltradas] = useState([]);
  
  // Estado para el modal de detalle
  const [modalSolicitud, setModalSolicitud] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Aplicar filtros
  useEffect(() => {
    let resultado = [...solicitudes];
    
    // Filtrar por estado
    if (filtro !== "todos") {
      resultado = resultado.filter(sol => sol.estado === filtro);
    }
    
    // Buscar por ID o tipo
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase();
      resultado = resultado.filter(
        sol => 
          sol.id.toLowerCase().includes(busquedaLower) || 
          sol.tipo.toLowerCase().includes(busquedaLower)
      );
    }
    
    // Ordenar por fecha (más reciente primero)
    resultado.sort((a, b) => {
      const dateA = new Date(a.fecha.split('/').reverse().join('-'));
      const dateB = new Date(b.fecha.split('/').reverse().join('-'));
      return dateB - dateA;
    });
    
    setSolicitudesFiltradas(resultado);
  }, [solicitudes, filtro, busqueda]);

  // Obtener el color según el estado
  const getStatusColor = (estado) => {
    switch (estado) {
      case "completado":
        return "bg-green-100 text-green-800";
      case "pendiente":
        return "bg-blue-100 text-blue-800";
      case "en revisión":
        return "bg-yellow-100 text-yellow-800";
      case "rechazado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Obtener el icono según el estado
  const getStatusIcon = (estado) => {
    switch (estado) {
      case "completado":
        return <Check size={14} />;
      case "pendiente":
        return <Clock size={14} />;
      case "en revisión":
        return <AlertTriangle size={14} />;
      case "rechazado":
        return <XCircle size={14} />;
      default:
        return null;
    }
  };

  // Abrir modal de detalle
  const openModal = (solicitud) => {
    setModalSolicitud(solicitud);
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setModalSolicitud(null);
    }, 300);
  };

  return (
    <div className="w-full">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-0">
          Historial de Solicitudes
        </h2>
        
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          {/* Búsqueda */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por ID o tipo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:outline-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
          
          {/* Filtro de estado */}
          <div className="relative">
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full appearance-none pl-9 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:outline-none"
            >
              <option value="todos">Todos los estados</option>
              <option value="completado">Completado</option>
              <option value="pendiente">Pendiente</option>
              <option value="en revisión">En revisión</option>
              <option value="rechazado">Rechazado</option>
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      </div>

      {/* Tabla de solicitudes */}
      <div className="bg-white shadow overflow-hidden rounded-lg w-full">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Encabezado de la tabla */}
            <thead>
              <tr className="bg-gradient-to-r from-[#41023B] to-[#D7008A]">
                <th scope="col" className="px-3 sm:px-6 py-3 text-white text-xs sm:text-sm font-bold uppercase tracking-wider text-center">
                  ID
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-white text-xs sm:text-sm font-bold uppercase tracking-wider text-center">
                  Tipo
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-white text-xs sm:text-sm font-bold uppercase tracking-wider text-center">
                  Fecha
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-white text-xs sm:text-sm font-bold uppercase tracking-wider text-center">
                  Costo
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-white text-xs sm:text-sm font-bold uppercase tracking-wider text-center">
                  Estado
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-white text-xs sm:text-sm font-bold uppercase tracking-wider text-center">
                  Acción
                </th>
              </tr>
            </thead>
            
            {/* Cuerpo de la tabla */}
            <tbody className="bg-white divide-y divide-gray-200">
              {solicitudesFiltradas.length > 0 ? (
                solicitudesFiltradas.map((solicitud, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center font-medium">
                      {solicitud.id}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">
                      {solicitud.tipo}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">
                      {solicitud.fecha}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">
                      {solicitud.costo}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(solicitud.estado)}`}>
                        {getStatusIcon(solicitud.estado)}
                        <span className="ml-1">{solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-center">
                      <button
                        className="text-purple-600 hover:text-purple-900 focus:outline-none"
                        onClick={() => openModal(solicitud)}
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No se encontraron solicitudes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de detalle de solicitud */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div 
            className={`bg-white rounded-lg shadow-xl max-w-lg w-full transform transition-all duration-300 ${
              showModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            {/* Encabezado del modal */}
            <div className="bg-gradient-to-r from-[#41023B] to-[#D7008A] px-6 py-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">
                  Detalle de Solicitud
                </h3>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 focus:outline-none"
                >
                  &times;
                </button>
              </div>
            </div>
            
            {/* Cuerpo del modal */}
            <div className="px-6 py-4">
              {modalSolicitud && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">ID de Solicitud</p>
                      <p className="text-sm font-medium">{modalSolicitud.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tipo</p>
                      <p className="text-sm font-medium">{modalSolicitud.tipo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha</p>
                      <p className="text-sm font-medium">{modalSolicitud.fecha}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Costo</p>
                      <p className="text-sm font-medium">{modalSolicitud.costo}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(modalSolicitud.estado)}`}>
                      {getStatusIcon(modalSolicitud.estado)}
                      <span className="ml-1">{modalSolicitud.estado.charAt(0).toUpperCase() + modalSolicitud.estado.slice(1)}</span>
                    </span>
                  </div>
                  
                  {modalSolicitud.comentario && (
                    <div>
                      <p className="text-sm text-gray-500">Comentario</p>
                      <p className="text-sm bg-yellow-50 p-2 rounded border border-yellow-200">
                        {modalSolicitud.comentario}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-500">Documentos</p>
                    <div className="mt-2 space-y-2">
                      {[...Array(modalSolicitud.documentos)].map((_, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center mr-2">
                              <span className="text-xs text-gray-600">PDF</span>
                            </div>
                            <span className="text-sm">Documento {idx + 1}</span>
                          </div>
                          <button className="text-purple-600 hover:text-purple-900">
                            <Download size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Pie del modal con botones */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}