import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, UserX, UserCheck, Shield, AlertTriangle } from "lucide-react";
import PermissionGuard from "../AdminComponents/PermissionGuard";

export default function UserDetail({ user, onBack, adminPermissionLevel }) {
  const [userData, setUserData] = useState(user || {});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);

  // Actualizar el estado cuando cambia el usuario
  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar cambios
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Aquí implementar la llamada a la API
      // await updateUserData(userData);
      
      // Simulamos una llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      // Notification success
      alert("Usuario actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      // Notification error
      alert("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  // Mostrar confirmación para acciones críticas
  const showActionConfirmation = (action) => {
    setConfirmationAction(action);
    setShowConfirmation(true);
  };

  // Ejecutar acción después de confirmación
  const executeAction = async () => {
    setIsSaving(true);
    try {
      switch (confirmationAction) {
        case "block":
          // Implementar bloqueo
          // await blockUser(userData.id);
          setUserData(prev => ({ ...prev, status: "bloqueado" }));
          break;
        case "unblock":
          // Implementar desbloqueo
          // await unblockUser(userData.id);
          setUserData(prev => ({ ...prev, status: "activo" }));
          break;
        default:
          break;
      }
      
      // Simulamos una llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Notification success
      alert("Acción ejecutada correctamente");
    } catch (error) {
      console.error("Error al ejecutar acción:", error);
      // Notification error
      alert("Error al ejecutar la acción");
    } finally {
      setIsSaving(false);
      setShowConfirmation(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold">
            {userData.nombre} {userData.apellido}
          </h2>
          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            userData.role === "admin" 
              ? "bg-purple-100 text-purple-800" 
              : "bg-blue-100 text-blue-800"
          }`}>
            {userData.role === "admin" 
              ? `Admin (${userData.nivelPermiso})` 
              : "Colegiado"
            }
          </span>
          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            userData.status === "activo" 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {userData.status === "activo" ? "Activo" : "Bloqueado"}
          </span>
        </div>
        
        <div className="flex gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1 px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={16} />
              )}
              <span>Guardar</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Editar
              </button>
              
              {/* Acciones de bloqueo/desbloqueo (solo para nivel intermedio o superior) */}
              <PermissionGuard 
                minPermissionLevel="intermedio"
                adminPermissionLevel={adminPermissionLevel}
              >
                {userData.status === "activo" ? (
                  <button
                    onClick={() => showActionConfirmation("block")}
                    className="flex items-center gap-1 px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors"
                  >
                    <UserX size={16} />
                    <span>Bloquear</span>
                  </button>
                ) : (
                  <button
                    onClick={() => showActionConfirmation("unblock")}
                    className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                  >
                    <UserCheck size={16} />
                    <span>Desbloquear</span>
                  </button>
                )}
              </PermissionGuard>
              
              {/* Botón de permisos (solo para admins y nivel total) */}
              {userData.role === "admin" && (
                <PermissionGuard 
                  minPermissionLevel="total"
                  adminPermissionLevel={adminPermissionLevel}
                >
                  <button
                    onClick={() => alert("Redirigir a página de permisos")}
                    className="flex items-center gap-1 px-4 py-2 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors"
                  >
                    <Shield size={16} />
                    <span>Permisos</span>
                  </button>
                </PermissionGuard>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Formulario de datos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Información personal */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Información Personal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={userData.nombre || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A] disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                name="apellido"
                value={userData.apellido || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A] disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={userData.email || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A] disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
            
            {userData.role === "colegiado" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Solvencia
                </label>
                <input
                  type="text"
                  name="solvente"
                  value={userData.solvente || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A] disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Información adicional (según rol) */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">
            {userData.role === "admin" ? "Información Administrativa" : "Información Profesional"}
          </h3>
          
          {userData.role === "admin" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel de Permiso
                </label>
                <select
                  name="nivelPermiso"
                  value={userData.nivelPermiso || "bajo"}
                  onChange={handleInputChange}
                  disabled={!isEditing || adminPermissionLevel !== "total"}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A] disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="bajo">Bajo</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="total">Total</option>
                </select>
                
                {isEditing && adminPermissionLevel !== "total" && (
                  <p className="mt-1 text-sm text-amber-600 flex items-center gap-1">
                    <AlertTriangle size={14} />
                    Solo administradores de nivel total pueden modificar permisos
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  name="role"
                  value={userData.role || "admin"}
                  onChange={handleInputChange}
                  disabled={!isEditing || adminPermissionLevel !== "total"}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A] disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="admin">Administrador</option>
                  <option value="colegiado">Colegiado</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Colegiado
                </label>
                <input
                  type="text"
                  name="numeroColegiado"
                  value={userData.numeroColegiado || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A] disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidad
                </label>
                <input
                  type="text"
                  name="especialidad"
                  value={userData.especialidad || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A] disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de confirmación */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-2">Confirmar acción</h3>
            <p className="text-gray-600 mb-4">
              {confirmationAction === "block" 
                ? "¿Estás seguro de que deseas bloquear a este usuario? No podrá acceder al sistema hasta que sea desbloqueado."
                : "¿Estás seguro de que deseas desbloquear a este usuario? Podrá volver a acceder al sistema."
              }
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={executeAction}
                disabled={isSaving}
                className={`px-4 py-2 text-white rounded-md transition-colors ${
                  confirmationAction === "block"
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-green-500 hover:bg-green-600"
                } disabled:opacity-50`}
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  "Confirmar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}