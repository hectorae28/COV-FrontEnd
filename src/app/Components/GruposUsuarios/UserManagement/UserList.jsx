import { motion } from "framer-motion";
import { AlertCircle, Filter, PlusCircle, Search, Shield, Trash2, UserCog, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import PermissionGuard from "../AdminComponents/PermissionGuard";

export default function UserList({ onUserSelect, adminPermissionLevel }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    status: "todos", // 'todos', 'activos', 'bloqueados'
    role: "todos"    // 'todos', 'colegiado', 'admin'
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Simular carga de usuarios (reemplazar con llamada API real)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Datos de ejemplo
        setTimeout(() => {
          const mockUsers = [
            { 
              id: 1, 
              nombre: "Ana María", 
              apellido: "Rodríguez", 
              email: "ana.rodriguez@ejemplo.com", 
              role: "colegiado",
              status: "activo",
              solvente: "17-12-2025"
            },
            { 
              id: 2, 
              nombre: "Carlos", 
              apellido: "Méndez", 
              email: "carlos.mendez@ejemplo.com", 
              role: "colegiado",
              status: "bloqueado",
              solvente: "10-08-2024"
            },
            { 
              id: 3, 
              nombre: "Laura", 
              apellido: "Jiménez", 
              email: "laura.jimenez@ejemplo.com", 
              role: "admin",
              nivelPermiso: "bajo",
              status: "activo" 
            },
            { 
              id: 4, 
              nombre: "José", 
              apellido: "García", 
              email: "jose.garcia@ejemplo.com", 
              role: "admin",
              nivelPermiso: "intermedio",
              status: "activo" 
            }
          ];
          setUsers(mockUsers);
          setFilteredUsers(mockUsers);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Efecto para filtrar usuarios según los criterios
  useEffect(() => {
    let result = users;
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.nombre.toLowerCase().includes(term) || 
        user.apellido.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por estado
    if (filterOptions.status !== "todos") {
      result = result.filter(user => user.status === filterOptions.status);
    }
    
    // Filtrar por rol
    if (filterOptions.role !== "todos") {
      result = result.filter(user => user.role === filterOptions.role);
    }
    
    setFilteredUsers(result);
  }, [searchTerm, filterOptions, users]);

  // Manejar cambio de filtros
  const handleFilterChange = (filterName, value) => {
    setFilterOptions(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Manejar bloqueo/desbloqueo de usuario
  const handleToggleUserStatus = (userId) => {
    // En producción, implementar llamada a API
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === "activo" ? "bloqueado" : "activo" } 
          : user
      )
    );
  };

  // Manejar eliminación de usuario
  const handleDeleteUser = (userId) => {
    const confirm = window.confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.");
    if (confirm) {
      // En producción, implementar llamada a API
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    }
  };

  // Verificar si un usuario tiene solvencia vencida
  const isSolvencyExpired = (solvencyDate) => {
    if (!solvencyDate) return false;
    
    const today = new Date();
    const [day, month, year] = solvencyDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    
    return today > date;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D7008A]"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
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
              placeholder="Buscar usuario por nombre o email..."
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
            
            {/* Botón para añadir usuario */}
            <PermissionGuard 
              minPermissionLevel="intermedio"
              adminPermissionLevel={adminPermissionLevel}
            >
              <button 
                onClick={() => alert("Funcionalidad para añadir usuario")}
                className="flex items-center gap-2 px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors duration-200"
              >
                <PlusCircle size={18} />
                <span>Nuevo Usuario</span>
              </button>
            </PermissionGuard>
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
                  <option value="bloqueado">Bloqueados</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  value={filterOptions.role}
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                >
                  <option value="todos">Todos</option>
                  <option value="colegiado">Colegiados</option>
                  <option value="admin">Administradores</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Tabla de usuarios */}
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.nombre} {user.apellido}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                        {user.role === "colegiado" && isSolvencyExpired(user.solvente) && (
                          <div className="ml-2">
                            <AlertCircle className="text-amber-500" size={16} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin" 
                          ? "bg-purple-100 text-purple-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {user.role === "admin" 
                          ? `Admin (${user.nivelPermiso})` 
                          : "Colegiado"
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "activo" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {user.status === "activo" ? "Activo" : "Bloqueado"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {/* Botón editar */}
                        <button 
                          onClick={() => onUserSelect(user)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          title="Editar usuario"
                        >
                          <UserCog size={18} />
                        </button>
                        
                        {/* Botón bloquear/desbloquear (solo para nivel intermedio o superior) */}
                        <PermissionGuard 
                          minPermissionLevel="intermedio"
                          adminPermissionLevel={adminPermissionLevel}
                        >
                          <button 
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`${
                              user.status === "activo" 
                                ? "text-amber-600 hover:text-amber-900" 
                                : "text-green-600 hover:text-green-900"
                            } transition-colors`}
                            title={user.status === "activo" ? "Bloquear usuario" : "Desbloquear usuario"}
                          >
                            <UserX size={18} />
                          </button>
                        </PermissionGuard>
                        
                        {/* Botón eliminar (solo para nivel total) */}
                        <PermissionGuard 
                          minPermissionLevel="total"
                          adminPermissionLevel={adminPermissionLevel}
                        >
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Eliminar usuario"
                          >
                            <Trash2 size={18} />
                          </button>
                        </PermissionGuard>
                        
                        {/* Botón gestionar permisos (solo para admins y nivel total) */}
                        {user.role === "admin" && (
                          <PermissionGuard 
                            minPermissionLevel="total"
                            adminPermissionLevel={adminPermissionLevel}
                          >
                            <button 
                              onClick={() => onUserSelect(user)}
                              className="text-purple-600 hover:text-purple-900 transition-colors"
                              title="Gestionar permisos"
                            >
                              <Shield size={18} />
                            </button>
                          </PermissionGuard>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No se encontraron usuarios con los filtros aplicados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}