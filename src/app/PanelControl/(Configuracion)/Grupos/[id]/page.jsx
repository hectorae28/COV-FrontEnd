"use client";

import AdminTabs from "@/Components/GruposUsuarios/AdminTabs";
import { getGrupoById, getUsuariosDisponiblesParaGrupo } from "@/Components/GruposUsuarios/GruposUsuariosData";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Edit,
  Info,
  Save,
  Shield,
  UserPlus,
  Users,
  UserX,
  X
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function GroupDetailPage({ params }) {
  const [groupData, setGroupData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [userPermissionLevel, setUserPermissionLevel] = useState("bajo");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Tabs disponibles
  const tabs = [
    { id: "info", label: "Información General", icon: Info },
    { id: "permissions", label: "Permisos", icon: Shield },
    { id: "members", label: "Miembros", icon: Users }
  ];

  // Cargar datos del grupo
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        // En producción, obtendríamos el nivel de permiso del usuario actual
        setUserPermissionLevel("alto");

        // Simular carga de datos
        setTimeout(() => {
          const grupo = getGrupoById(params.id);
          if (grupo) {
            setGroupData(grupo);

            // Cargar usuarios disponibles para añadir al grupo
            const usuariosDisponibles = getUsuariosDisponiblesParaGrupo(params.id);
            setAvailableUsers(usuariosDisponibles);
          } else {
            // Grupo no encontrado
            console.error("Grupo no encontrado");
            // Aquí podrías redirigir a una página de error
          }
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error cargando datos del grupo:", error);
        setIsLoading(false);
      }
    };

    fetchGroupData();
  }, [params?.id]);

  // Guardar cambios en el grupo
  const handleSaveChanges = async (updatedData) => {
    try {
      // Aquí implementar llamada a API para guardar cambios
      console.log("Guardando cambios:", updatedData);

      // Simular guardado
      setGroupData(updatedData);
      setIsEditing(false);
      alert("Cambios guardados correctamente");
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("Error al guardar los cambios");
    }
  };

  // Remover usuario del grupo
  const handleRemoveUser = (userId) => {
    // Verificar permisos
    if (userPermissionLevel !== "alto" && userPermissionLevel !== "medio") {
      alert("No tienes permiso para remover usuarios de grupos");
      return;
    }

    if (window.confirm("¿Estás seguro de remover a este usuario del grupo?")) {
      // En implementación real, llamada a API
      setGroupData(prev => ({
        ...prev,
        miembros: prev.miembros.filter(user => user.id !== userId)
      }));
    }
  };

  // Personalizar permisos de usuario
  const handleCustomizeUserPermissions = (userId) => {
    // Verificar permisos
    if (userPermissionLevel !== "alto") {
      alert("No tienes permiso para personalizar permisos de usuarios");
      return;
    }

    // En implementación real, navegar a página de permisos o mostrar modal
    alert(`Implementar personalización de permisos para usuario ID: ${userId}`);
  };

  // Agregar usuarios seleccionados al grupo
  const handleAddSelectedUsers = () => {
    if (selectedUsers.length === 0) {
      alert("Selecciona al menos un usuario para agregar al grupo");
      return;
    }

    // En implementación real, llamada a API
    const usersToAdd = availableUsers
      .filter(user => selectedUsers.includes(user.id))
      .map(user => ({
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        permiso: groupData.nivelPermiso, // Heredan el permiso del grupo
        permisosPersonalizados: false
      }));

    setGroupData(prev => ({
      ...prev,
      miembros: [...prev.miembros, ...usersToAdd]
    }));

    // Actualizar usuarios disponibles
    setAvailableUsers(prev =>
      prev.filter(user => !selectedUsers.includes(user.id))
    );

    setSelectedUsers([]);
    setShowAddUserModal(false);
  };

  // Cambiar un permiso específico del grupo
  const handleTogglePermission = (moduleId) => {
    if (userPermissionLevel !== "alto") {
      alert("No tienes permiso para modificar permisos de grupos");
      return;
    }

    if (!isEditing) {
      setIsEditing(true);
    }

    setGroupData(prev => ({
      ...prev,
      permisos: {
        ...prev.permisos,
        [moduleId]: !prev.permisos[moduleId]
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D7008A]"></div>
      </div>
    );
  }

  if (!groupData) {
    return (
      <div className="p-6 mt-20">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h1 className="text-2xl font-bold text-[#41023B] mb-4">Grupo no encontrado</h1>
          <p className="mb-4">El grupo que buscas no existe o ha sido eliminado.</p>
          <Link href="/PanelControl/Grupos" className="px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors">
            Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-20">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Cabecera con información básica y acciones */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Link href="/PanelControl/Grupos" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#41023B]">
                {groupData.nombre}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${groupData.nivelPermiso === "alto"
                    ? "bg-purple-100 text-purple-800"
                    : groupData.nivelPermiso === "medio"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                  Nivel de Permiso: {groupData.nivelPermiso}
                </span>
                <span>•</span>
                <span>{groupData.miembros.length} {groupData.miembros.length === 1 ? "miembro" : "miembros"}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            ) : (
              <>
                {userPermissionLevel === "alto" && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors"
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Pestañas */}
        <AdminTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isEditing={isEditing}
          tabs={tabs}
        />

        {/* Contenido de la pestaña activa */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Información general */}
          {activeTab === "info" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-4">Detalles del Grupo</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Grupo
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={groupData.nombre}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                      />
                    ) : (
                      <p className="text-gray-800">{groupData.nombre}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    {isEditing ? (
                      <textarea
                        defaultValue={groupData.descripcion}
                        rows="3"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                      ></textarea>
                    ) : (
                      <p className="text-gray-800">{groupData.descripcion}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nivel de Permiso
                    </label>
                    {isEditing ? (
                      <div className="flex gap-4">
                        {["bajo", "medio", "alto"].map(level => (
                          <label
                            key={level}
                            className={`relative flex items-center justify-center px-4 py-2 border rounded-md cursor-pointer ${groupData.nivelPermiso === level ? "border-[#D7008A] bg-pink-50" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              name="permissionLevel"
                              value={level}
                              defaultChecked={groupData.nivelPermiso === level}
                              className="sr-only"
                            />
                            <span className={`font-medium ${groupData.nivelPermiso === level ? "text-[#D7008A]" : ""
                              }`}>
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-800 capitalize">{groupData.nivelPermiso}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Creación
                    </label>
                    <p className="text-gray-800">{groupData.fechaCreacion}</p>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => handleSaveChanges(groupData)}
                      className="flex items-center gap-1 px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors"
                    >
                      <Save size={16} />
                      Guardar Cambios
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Permisos */}
          {activeTab === "permissions" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-4">Permisos del Grupo</h3>

                <div className="bg-blue-50 p-4 rounded-md mb-6">
                  <p className="text-sm text-blue-800">
                    Los permisos definidos aquí se aplicarán automáticamente a todos los miembros del grupo,
                    a menos que tengan permisos personalizados configurados.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(groupData.permisos).map(([key, value]) => (
                    <div
                      key={key}
                      className={`p-4 border rounded-md ${value ? "border-green-200 bg-green-50" : "border-gray-200"
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className={`p-2 rounded-md mr-3 ${value ? "bg-green-100" : "bg-gray-100"
                            }`}>
                            <Shield size={18} className={value ? "text-green-600" : "text-gray-400"} />
                          </span>
                          <span className="font-medium capitalize">{key}</span>
                        </div>

                        {isEditing ? (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() => handleTogglePermission(key)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D7008A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D7008A]"></div>
                          </label>
                        ) : (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}>
                            {value ? (
                              <><Check size={12} /> Habilitado</>
                            ) : (
                              <><X size={12} /> Deshabilitado</>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => handleSaveChanges(groupData)}
                      className="flex items-center gap-1 px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors"
                    >
                      <Save size={16} />
                      Guardar Cambios
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Miembros */}
          {activeTab === "members" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Miembros del Grupo</h3>

                  {(userPermissionLevel === "alto" || userPermissionLevel === "medio") && (
                    <button
                      onClick={() => setShowAddUserModal(true)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors text-sm"
                    >
                      <UserPlus size={14} />
                      Agregar Miembros
                    </button>
                  )}
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Permisos
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {groupData.miembros.map((miembro) => (
                        <tr key={miembro.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {miembro.nombre} {miembro.apellido}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {miembro.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${miembro.permiso === "alto"
                                  ? "bg-purple-100 text-purple-800"
                                  : miembro.permiso === "medio"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}>
                                Nivel {miembro.permiso}
                              </span>

                              {miembro.permisosPersonalizados && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                  Personalizado
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              {userPermissionLevel === "alto" && (
                                <button
                                  onClick={() => handleCustomizeUserPermissions(miembro.id)}
                                  className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                  title="Personalizar permisos"
                                >
                                  <Shield size={18} />
                                </button>
                              )}

                              {(userPermissionLevel === "alto" || userPermissionLevel === "medio") && (
                                <button
                                  onClick={() => handleRemoveUser(miembro.id)}
                                  className="text-red-600 hover:text-red-900 transition-colors"
                                  title="Remover del grupo"
                                >
                                  <UserX size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {groupData.miembros.length === 0 && (
                        <tr>
                          <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            Este grupo no tiene miembros
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal para agregar usuarios al grupo */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Agregar Miembros</h3>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setSelectedUsers([]);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Selecciona los usuarios que deseas agregar al grupo. Al agregarlos, heredarán automáticamente
                  los permisos del grupo.
                </p>
              </div>

              {availableUsers.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="w-12 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <span className="sr-only">Seleccionar</span>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grupo Actual
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {availableUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => {
                                if (selectedUsers.includes(user.id)) {
                                  setSelectedUsers(prev => prev.filter(id => id !== user.id));
                                } else {
                                  setSelectedUsers(prev => [...prev, user.id]);
                                }
                              }}
                              className="h-4 w-4 text-[#D7008A] focus:ring-[#D7008A] border-gray-300 rounded"
                            />
                          </td>
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
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.grupoActual ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {user.grupoActual}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">Sin grupo</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-6 text-center text-gray-500">
                  No hay usuarios disponibles para agregar
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <p className="text-sm text-gray-500 flex items-center">
                Seleccionados: <span className="ml-1 font-medium">{selectedUsers.length}</span>
              </p>

              <div>
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors mr-2"
                  onClick={() => {
                    setShowAddUserModal(false);
                    setSelectedUsers([]);
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors"
                  onClick={handleAddSelectedUsers}
                  disabled={selectedUsers.length === 0}
                >
                  Agregar Seleccionados
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}