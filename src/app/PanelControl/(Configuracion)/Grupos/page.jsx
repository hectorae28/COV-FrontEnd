"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Shield, PlusCircle, AlertTriangle, Users, EyeOff, UserCog, Key, Settings } from "lucide-react";
import PermissionGuard from "@/Components/GruposUsuarios/AdminComponents/PermissionGuard";
import AdminPermissionDetails from "@/Components/GruposUsuarios/AdminPermissionDetails";

export default function GruposPage() {
  const [adminUsers, setAdminUsers] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [adminLevel, setAdminLevel] = useState("alto"); // Nivel del usuario actual
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showAdminDetails, setShowAdminDetails] = useState(false);

  // Cargar administradores (simulado)
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        // En producción, verificar que el usuario actual tiene nivel alto
        // Si no, redirigir
        
        setTimeout(() => {
          // Datos de ejemplo
          const mockAdmins = [
            {
              id: 1,
              nombre: "Laura",
              apellido: "Jiménez",
              email: "laura.jimenez@cov.org",
              cargo: "Administrador de Sistema",
              nivelPermiso: "alto",
              permisos: {
                usuarios: true,
                colegiados: true,
                pagos: true,
                contenido: true,
                grupos: true,
                reportes: true,
              },
              ultimoAcceso: "17-05-2025 10:30",
              status: "activo"
            },
            {
              id: 2,
              nombre: "Carlos",
              apellido: "Martínez",
              email: "carlos.martinez@cov.org",
              cargo: "Gerente de Contenido",
              nivelPermiso: "medio",
              permisos: {
                usuarios: true,
                colegiados: true,
                pagos: false,
                contenido: true,
                grupos: false,
                reportes: true,
              },
              ultimoAcceso: "16-05-2025 15:45",
              status: "activo"
            },
            {
              id: 3,
              nombre: "María",
              apellido: "González",
              email: "maria.gonzalez@cov.org",
              cargo: "Asistente Administrativo",
              nivelPermiso: "bajo",
              permisos: {
                usuarios: false,
                colegiados: true,
                pagos: false,
                contenido: false,
                grupos: false,
                reportes: false,
              },
              ultimoAcceso: "15-05-2025 09:20",
              status: "activo"
            },
            {
              id: 4,
              nombre: "José",
              apellido: "García",
              email: "jose.garcia@cov.org",
              cargo: "Supervisor Financiero",
              nivelPermiso: "medio",
              permisos: {
                usuarios: false,
                colegiados: true,
                pagos: true,
                contenido: false,
                grupos: false,
                reportes: true,
              },
              ultimoAcceso: "14-05-2025 16:10",
              status: "inactivo"
            },
            {
              id: 5,
              nombre: "Ana",
              apellido: "Pérez",
              email: "ana.perez@cov.org",
              cargo: "Administrador de Contenido",
              nivelPermiso: "bajo",
              permisos: {
                usuarios: false,
                colegiados: false,
                pagos: false,
                contenido: true,
                grupos: false,
                reportes: false,
              },
              ultimoAcceso: "13-05-2025 11:30",
              status: "activo"
            }
          ];
          
          setAdminUsers(mockAdmins);
          setFilteredAdmins(mockAdmins);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error al cargar administradores:", error);
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Filtrar administradores según término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAdmins(adminUsers);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = adminUsers.filter(admin => 
        admin.nombre.toLowerCase().includes(term) || 
        admin.apellido.toLowerCase().includes(term) || 
        admin.email.toLowerCase().includes(term) ||
        admin.cargo.toLowerCase().includes(term)
      );
      setFilteredAdmins(filtered);
    }
  }, [searchTerm, adminUsers]);

  // Ver detalles de un administrador
  const handleViewAdmin = (admin) => {
    setSelectedAdmin(admin);
    setShowAdminDetails(true);
  };

  // Cerrar panel de detalles
  const handleCloseDetails = () => {
    setShowAdminDetails(false);
    setSelectedAdmin(null);
  };

  // Actualizar datos de un administrador
  const handleUpdateAdmin = (updatedAdmin) => {
    setAdminUsers(prevAdmins => 
      prevAdmins.map(admin => 
        admin.id === updatedAdmin.id ? updatedAdmin : admin
      )
    );
    // En implementación real, guardar cambios en la API
  };

  // Manejar creación de nuevo administrador
  const handleCreateAdmin = () => {
    alert("Implementar formulario para nuevo administrador");
  };

  // Si la página está cargando
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D7008A]"></div>
      </div>
    );
  }

  // Si el usuario no tiene nivel alto, mostrar mensaje de acceso denegado
  if (adminLevel !== "alto") {
    return (
      <div className="p-6 mt-20">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <EyeOff size={48} className="text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso Denegado</h1>
            <p className="text-gray-600 max-w-md">
              No tienes permiso para acceder a la gestión de grupos administrativos. 
              Esta área está reservada para administradores de nivel alto.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PermissionGuard requiredLevel="alto" userLevel={adminLevel}>
      <div className="p-6 mt-20">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-[#41023B] mb-6 flex items-center">
            <Users className="mr-2" /> Gestión de Grupos Administrativos
          </h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            {/* Cabecera informativa */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-6 flex items-start gap-3">
              <AlertTriangle className="text-amber-500 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <h2 className="font-medium text-amber-800">Área Restringida</h2>
                <p className="text-sm text-amber-700 mt-1">
                  Esta sección te permite gestionar los administradores del sistema y sus niveles de permiso. 
                  Los cambios realizados aquí afectan directamente a quién puede acceder a qué funcionalidades del sistema.
                </p>
              </div>
            </div>
            
            {/* Barra de herramientas */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              {/* Barra de búsqueda */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar administrador por nombre, email o cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              
              {/* Botón para crear nuevo administrador */}
              <button 
                onClick={handleCreateAdmin}
                className="flex items-center gap-2 px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors duration-200"
              >
                <PlusCircle size={18} />
                <span className="hidden md:inline">Nuevo Administrador</span>
                <span className="inline md:hidden">Nuevo</span>
              </button>
            </div>
            
            {/* Tarjetas de administradores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAdmins.map(admin => (
                <div 
                  key={admin.id}
                  className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                    admin.status === "activo" ? "border-gray-200" : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {admin.nombre} {admin.apellido}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{admin.email}</p>
                        <p className="text-xs text-gray-500">{admin.cargo}</p>
                      </div>
                      <div className={`rounded-full p-1 ${
                        admin.nivelPermiso === "alto" 
                          ? "bg-purple-100" 
                          : admin.nivelPermiso === "medio"
                            ? "bg-blue-100"
                            : "bg-gray-100"
                      }`}>
                        <Shield size={20} className={`${
                          admin.nivelPermiso === "alto" 
                            ? "text-purple-600" 
                            : admin.nivelPermiso === "medio"
                              ? "text-blue-600"
                              : "text-gray-600"
                        }`} />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        admin.nivelPermiso === "alto" 
                          ? "bg-purple-100 text-purple-800" 
                          : admin.nivelPermiso === "medio"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}>
                        Nivel {admin.nivelPermiso}
                      </span>
                      
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        admin.status === "activo" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {admin.status === "activo" ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    
                    {/* Módulos con permiso */}
                    <div className="mt-4">
                      <h4 className="text-xs font-medium text-gray-500 mb-2">Permisos</h4>
                      <div className="flex flex-wrap gap-1">
                        {admin.permisos.usuarios && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">
                            <UserCog size={12} className="mr-1" /> Usuarios
                          </span>
                        )}
                        {admin.permisos.colegiados && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">
                            <Users size={12} className="mr-1" /> Colegiados
                          </span>
                        )}
                        {admin.permisos.pagos && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">
                            <Shield size={12} className="mr-1" /> Pagos
                          </span>
                        )}
                        {admin.permisos.grupos && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">
                            <Key size={12} className="mr-1" /> Grupos
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Último acceso: {admin.ultimoAcceso}
                      </span>
                      <button 
                        onClick={() => handleViewAdmin(admin)}
                        className="text-sm text-[#D7008A] hover:text-[#B0006E] font-medium flex items-center"
                      >
                        <Settings size={14} className="mr-1" />
                        Administrar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredAdmins.length === 0 && (
                <div className="col-span-full p-8 text-center text-gray-500">
                  No se encontraron administradores que coincidan con la búsqueda
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Modal de detalles del administrador */}
      {showAdminDetails && selectedAdmin && (
        <AdminPermissionDetails 
          admin={selectedAdmin}
          onClose={handleCloseDetails}
          onSave={handleUpdateAdmin}
        />
      )}
    </PermissionGuard>
  );
}