"use client";

import { gruposData } from "@/Components/GruposUsuarios/GruposUsuariosData";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Info,
  PlusCircle,
  Search,
  Shield,
  Trash2,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";

export default function GruposPage() {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [adminLevel, setAdminLevel] = useState("bajo"); // Simular nivel de admin
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // Simular carga de grupos
  useEffect(() => {
    // En implementación real, obtener nivel de admin del contexto o API
    setAdminLevel("alto"); // Para propósitos de demostración

    const fetchGroups = async () => {
      try {
        setTimeout(() => {
          setGroups(gruposData);
          setFilteredGroups(gruposData);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error al cargar grupos:", error);
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Filtrar grupos según término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredGroups(groups);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = groups.filter(group =>
        group.nombre.toLowerCase().includes(term) ||
        group.descripcion.toLowerCase().includes(term)
      );
      setFilteredGroups(filtered);
    }
  }, [searchTerm, groups]);

  // Eliminar grupo
  const handleDeleteGroup = (groupId, event) => {
    event.stopPropagation(); // Evitar navegación al detalle del grupo

    if (adminLevel !== "alto") {
      alert("No tienes permiso para eliminar grupos. Se requiere nivel alto.");
      return;
    }

    setSelectedGroupId(groupId);
    setShowDeleteConfirmation(true);
  };

  // Confirmar eliminación de grupo
  const confirmDeleteGroup = () => {
    // En implementación real, llamada a API para eliminar grupo
    setGroups(prevGroups => prevGroups.filter(group => group.id !== selectedGroupId));
    setShowDeleteConfirmation(false);
    setSelectedGroupId(null);
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
          <Users size={24} /> Gestión de Grupos
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          {/* Mensaje informativo */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6 flex items-start gap-3">
            <Info className="text-blue-500 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h2 className="font-medium text-blue-800">Grupos y Permisos</h2>
              <p className="text-sm text-blue-700 mt-1">
                Los grupos permiten gestionar permisos de forma colectiva. Al asignar un usuario a un grupo,
                este heredará automáticamente los permisos del grupo. También puedes personalizar permisos
                específicos para cada usuario.
              </p>
            </div>
          </div>

          {/* Barra de herramientas */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            {/* Barra de búsqueda */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar grupo por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>

            {/* Botón para crear nuevo grupo */}
            {adminLevel === "alto" && (
              <button
                onClick={() => setShowAddGroupModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors duration-200"
              >
                <PlusCircle size={18} />
                <span className="hidden md:inline">Nuevo Grupo</span>
                <span className="inline md:hidden">Nuevo</span>
              </button>
            )}
          </div>

          {/* Lista de grupos - Cards mejoradas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: group.id * 0.05 }}
                  className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => window.location.href = `/PanelControl/Grupos/${group.id}`}
                >
                  {/* Banda superior con color según nivel de permiso */}
                  <div className={`h-2 w-full ${group.nivelPermiso === "alto"
                      ? "bg-purple-500"
                      : group.nivelPermiso === "medio"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}></div>

                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {group.nombre}
                      </h3>
                      <div className={`rounded-full p-2 ${group.nivelPermiso === "alto"
                          ? "bg-purple-100"
                          : group.nivelPermiso === "medio"
                            ? "bg-blue-100"
                            : "bg-gray-100"
                        }`}>
                        <Shield size={16} className={`${group.nivelPermiso === "alto"
                            ? "text-purple-600"
                            : group.nivelPermiso === "medio"
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`} />
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
                      {group.descripcion}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${group.nivelPermiso === "alto"
                          ? "bg-purple-100 text-purple-800"
                          : group.nivelPermiso === "medio"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                        Nivel {group.nivelPermiso}
                      </span>

                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Users size={12} className="mr-1" />
                        {group.cantidadUsuarios} {group.cantidadUsuarios === 1 ? "usuario" : "usuarios"}
                      </span>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-auto">
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          Creado: {group.fechaCreacion}
                        </div>

                        {adminLevel === "alto" && (
                          <button
                            onClick={(e) => handleDeleteGroup(group.id, e)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1.5"
                            title="Eliminar grupo"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full p-8 text-center text-gray-500">
                No se encontraron grupos que coincidan con la búsqueda
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal para agregar grupo (solo estructura básica) */}
      {showAddGroupModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Crear Nuevo Grupo</h3>
              <button
                onClick={() => setShowAddGroupModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {/* Formulario para crear grupo */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Grupo
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: Coordinadores de Eventos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                    rows="3"
                    placeholder="Describe el propósito de este grupo"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nivel de Permiso
                  </label>
                  <div className="flex gap-4">
                    {["bajo", "medio", "alto"].map(level => (
                      <label
                        key={level}
                        className="relative flex items-center justify-center px-4 py-2 border rounded-md cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="permissionLevel"
                          value={level}
                          className="sr-only"
                        />
                        <span className="font-medium">
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors mr-2"
                onClick={() => setShowAddGroupModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors"
                onClick={() => {
                  // Aquí iría la lógica para crear el grupo
                  alert("Implementar creación de grupo");
                  setShowAddGroupModal(false);
                }}
              >
                Crear Grupo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar grupo */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Confirmar Eliminación</h3>
            </div>
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">
                    ¿Estás seguro de que deseas eliminar este grupo?
                    Esta acción no se puede deshacer y los usuarios asignados a este grupo quedarán sin grupo.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors mr-2"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                onClick={confirmDeleteGroup}
              >
                Eliminar Grupo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}