"use client";

import AdminInfo from "@/Components/GruposUsuarios/AdminInfo";
import AdminPermissions from "@/Components/GruposUsuarios/AdminPermissions";
import AdminStats from "@/Components/GruposUsuarios/AdminStats";
import AdminTabs from "@/Components/GruposUsuarios/AdminTabs";
import { getAdministradorById } from "@/Components/GruposUsuarios/GruposUsuariosData";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  PieChart,
  Save,
  Shield,
  User,
  UserCheck,
  UserX
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDetailPage({ params }) {
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [userPermissionLevel, setUserPermissionLevel] = useState("bajo");
  const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);

  // Tabs disponibles
  const tabs = [
    { id: "info", label: "Información Personal", icon: User },
    { id: "permissions", label: "Permisos", icon: Shield },
    { id: "stats", label: "Estadísticas", icon: PieChart }
  ];

  // Cargar datos del administrador
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // En producción, obtendríamos el nivel de permiso del usuario actual
        setUserPermissionLevel("alto");

        // Simular carga de datos
        setTimeout(() => {
          const admin = getAdministradorById(params.id);
          if (admin) {
            setAdminData(admin);
          } else {
            // Administrador no encontrado
            console.error("Administrador no encontrado");
            // Aquí podrías redirigir a una página de error
          }
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error cargando datos del administrador:", error);
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [params?.id]);

  // Guardar cambios en el administrador
  const handleSaveChanges = async (updatedData) => {
    try {
      // Aquí implementar llamada a API para guardar cambios
      console.log("Guardando cambios:", updatedData);

      // Simular guardado
      setAdminData(updatedData);
      setIsEditing(false);
      alert("Cambios guardados correctamente");
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("Error al guardar los cambios");
    }
  };

  // Cambiar estado del administrador
  const handleToggleStatus = async () => {
    // Verificar si el usuario tiene permisos
    if (userPermissionLevel !== "alto") {
      alert("No tienes permiso para realizar esta acción");
      return;
    }

    setShowStatusConfirmation(true);
  };

  // Confirmar cambio de estado
  const confirmStatusChange = () => {
    const newStatus = adminData.status === "activo" ? "inactivo" : "activo";
    setAdminData(prev => ({
      ...prev,
      status: newStatus
    }));
    setShowStatusConfirmation(false);

    // Aquí podrías implementar una llamada a la API para guardar el cambio
    alert(`El administrador ha sido ${newStatus === "activo" ? "activado" : "bloqueado"} correctamente`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D7008A]"></div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="p-6 mt-20">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h1 className="text-2xl font-bold text-[#41023B] mb-4">Administrador no encontrado</h1>
          <p className="mb-4">El administrador que buscas no existe o ha sido eliminado.</p>
          <Link href="/PanelControl/Usuarios" className="px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors">
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
            <Link href="/PanelControl/Usuarios" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#41023B]">
                {adminData.nombre} {adminData.apellido}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{adminData.email}</span>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${adminData.permiso === "alto"
                    ? "bg-purple-100 text-purple-800"
                    : adminData.permiso === "medio"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                  Permiso: {adminData.permiso}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${adminData.status === "activo"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                  }`}>
                  {adminData.status === "activo" ? "Activo" : "Bloqueado"}
                </span>
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
                {/* Botón para cambiar estado (activo/bloqueado) */}
                {userPermissionLevel === "alto" && (
                  <button
                    onClick={handleToggleStatus}
                    className={`flex items-center gap-1 px-4 py-2 rounded-md transition-colors ${adminData.status === "activo"
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                      }`}
                  >
                    {adminData.status === "activo"
                      ? <><UserX size={16} /> Bloquear</>
                      : <><UserCheck size={16} /> Activar</>
                    }
                  </button>
                )}

                {/* Botón para editar */}
                {(userPermissionLevel === "alto" || (userPermissionLevel === "medio" && activeTab === "info")) && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors"
                  >
                    <Save size={16} />
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
          {activeTab === "info" && (
            <AdminInfo
              adminInfo={adminData}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              onSave={handleSaveChanges}
              userPermissionLevel={userPermissionLevel}
            />
          )}

          {activeTab === "permissions" && (
            <AdminPermissions
              admin={adminData}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              onSave={handleSaveChanges}
              userPermissionLevel={userPermissionLevel}
            />
          )}

          {activeTab === "stats" && (
            <AdminStats
              adminId={adminData.id}
              stats={adminData.estadisticas}
            />
          )}
        </motion.div>
      </div>

      {/* Modal de confirmación para cambiar estado */}
      {showStatusConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Confirmar {adminData.status === "activo" ? "Bloqueo" : "Activación"}
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700">
                {adminData.status === "activo"
                  ? `¿Estás seguro de que deseas bloquear a ${adminData.nombre} ${adminData.apellido}? Este usuario no podrá acceder al sistema hasta que sea activado nuevamente.`
                  : `¿Estás seguro de que deseas activar a ${adminData.nombre} ${adminData.apellido}? Este usuario podrá acceder al sistema nuevamente.`
                }
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowStatusConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={confirmStatusChange}
                className={`px-4 py-2 text-white rounded-md transition-colors ${adminData.status === "activo"
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-green-500 hover:bg-green-600"
                  }`}
              >
                {adminData.status === "activo" ? "Bloquear" : "Activar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}