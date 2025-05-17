// Archivo corregido: Usuarios/page.jsx
"use client";

import { administradoresData } from "@/Components/GruposUsuarios/GruposUsuariosData";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Filter,
  PlusCircle,
  Search,
  Shield,
  Users
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UsuariosPage() {
  const [administrators, setAdministrators] = useState([]);
  const [filteredAdministrators, setFilteredAdministrators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    status: "todos",
    group: "todos"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [adminLevel, setAdminLevel] = useState("bajo");

  useEffect(() => {
    setAdminLevel("alto");
    const fetchAdministrators = async () => {
      try {
        setTimeout(() => {
          setAdministrators(administradoresData);
          setFilteredAdministrators(administradoresData);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error al cargar administradores:", error);
        setIsLoading(false);
      }
    };
    fetchAdministrators();
  }, []);

  useEffect(() => {
    let result = administrators;
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(admin =>
        admin.nombre.toLowerCase().includes(term) ||
        admin.apellido.toLowerCase().includes(term) ||
        admin.email.toLowerCase().includes(term)
      );
    }
    if (filterOptions.status !== "todos") {
      result = result.filter(admin => admin.status === filterOptions.status);
    }
    if (filterOptions.group !== "todos") {
      result = result.filter(admin =>
        admin.grupo.toLowerCase() === filterOptions.group.toLowerCase()
      );
    }
    setFilteredAdministrators(result);
  }, [searchTerm, filterOptions, administrators]);

  const handleFilterChange = (filterName, value) => {
    setFilterOptions(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleAddAdmin = () => {
    if (adminLevel !== "alto") {
      alert("No tienes permiso para realizar esta acción");
      return;
    }
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
        <h1 className="text-2xl font-bold text-[#41023B] mb-6 flex items-center gap-2">
          <Users size={24} /> Gestión de Administradores
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                <Filter size={18} />
                <span>Filtros</span>
              </button>
              {adminLevel === "alto" && (
                <Link
                  href="/PanelControl/Usuarios/nuevo"
                  className="flex items-center gap-2 px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors duration-200"
                >
                  <PlusCircle size={18} />
                  <span className="hidden md:inline">Nuevo Administrador</span>
                  <span className="inline md:hidden">Nuevo</span>
                </Link>
              )}
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 p-4 rounded-md mb-4"
            >
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={filterOptions.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                  >
                    <option value="todos">Todos</option>
                    <option value="activo">Activos</option>
                    <option value="inactivo">Inactivos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
                  <select
                    value={filterOptions.group}
                    onChange={(e) => handleFilterChange("group", e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                  >
                    <option value="todos">Todos</option>
                    <option value="Personal Administrativo">Personal Administrativo</option>
                    <option value="Protocolo">Protocolo</option>
                    <option value="Secretario de Finanzas">Secretario de Finanzas</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {adminLevel !== "alto" && (
            <div className="bg-blue-50 p-4 rounded-md mb-4 text-sm text-blue-700 flex items-center gap-2">
              <AlertCircle size={16} className="text-blue-500" />
              <p>Tu nivel de permiso no es <strong>alto</strong>. Algunas acciones estarán limitadas.</p>
            </div>
          )}

          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administrador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permiso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdministrators.length > 0 ? (
                  filteredAdministrators.map((admin) => (
                    <tr
                      key={admin.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => window.location.href = `/PanelControl/Usuarios/${admin.id}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{admin.nombre} {admin.apellido}</div>
                        <div className="text-xs text-gray-500">{admin.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{admin.grupo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.permiso === "alto" ? "bg-purple-100 text-purple-800" : admin.permiso === "medio" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                          <Shield size={12} className="mr-1" />
                          {admin.permiso.charAt(0).toUpperCase() + admin.permiso.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.status === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {admin.status === "activo" ? "Activo" : "Bloqueado"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-sm text-gray-500 text-center">
                      No se encontraron administradores con los filtros aplicados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Mostrando {filteredAdministrators.length} de {administrators.length} administradores
          </div>
        </motion.div>
      </div>
    </div>
  );
}
