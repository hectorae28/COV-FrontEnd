import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, ChevronDown, ChevronRight, Info, Save } from "lucide-react";

export default function UserPermissions({ adminPermissionLevel }) {
  const [permissions, setPermissions] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUsers, setAdminUsers] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Cargar datos de permisos (simulado)
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        // Simulamos la carga de datos
        setTimeout(() => {
          const mockPermissions = [
            {
              id: "usuarios",
              name: "Gestión de Usuarios",
              description: "Administración de usuarios y colegiados",
              actions: [
                { id: "usuarios_ver", name: "Ver usuarios", levels: ["bajo", "intermedio", "total"] },
                { id: "usuarios_editar", name: "Editar usuarios", levels: ["bajo", "intermedio", "total"] },
                { id: "usuarios_bloquear", name: "Bloquear/Desbloquear usuarios", levels: ["intermedio", "total"] },
                { id: "usuarios_eliminar", name: "Eliminar usuarios", levels: ["total"] }
              ]
            },
            {
              id: "permisos",
              name: "Gestión de Permisos",
              description: "Administración de permisos y roles",
              actions: [
                { id: "permisos_ver", name: "Ver permisos", levels: ["intermedio", "total"] },
                { id: "permisos_editar", name: "Editar permisos", levels: ["total"] },
                { id: "permisos_asignar", name: "Asignar permisos", levels: ["total"] }
              ]
            },
            {
              id: "contenido",
              name: "Gestión de Contenido",
              description: "Administración del contenido del sitio",
              actions: [
                { id: "contenido_ver", name: "Ver contenido", levels: ["bajo", "intermedio", "total"] },
                { id: "contenido_crear", name: "Crear contenido", levels: ["bajo", "intermedio", "total"] },
                { id: "contenido_editar", name: "Editar contenido", levels: ["bajo", "intermedio", "total"] },
                { id: "contenido_eliminar", name: "Eliminar contenido", levels: ["intermedio", "total"] },
                { id: "contenido_publicar", name: "Publicar contenido", levels: ["intermedio", "total"] }
              ]
            },
            {
              id: "pagos",
              name: "Gestión de Pagos",
              description: "Administración de pagos y solvencia",
              actions: [
                { id: "pagos_ver", name: "Ver pagos", levels: ["bajo", "intermedio", "total"] },
                { id: "pagos_procesar", name: "Procesar pagos", levels: ["intermedio", "total"] },
                { id: "pagos_anular", name: "Anular pagos", levels: ["total"] },
                { id: "pagos_solvencia", name: "Actualizar solvencia", levels: ["intermedio", "total"] }
              ]
            }
          ];

          const mockAdmins = [
            { id: 1, nombre: "Laura Jiménez", nivelPermiso: "bajo" },
            { id: 2, nombre: "Carlos Martínez", nivelPermiso: "intermedio" },
            { id: 3, nombre: "María González", nivelPermiso: "total" }
          ];

          setPermissions(mockPermissions);
          setAdminUsers(mockAdmins);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error cargando permisos:", error);
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  // Manejar la expansión de módulos
  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Verificar si un nivel tiene un permiso específico
  const hasPermission = (action, level) => {
    return action.levels.includes(level);
  };

  // Guardar cambios en los permisos
  const handleSavePermissions = async () => {
    setIsSaving(true);
    try {
      // Aquí iría la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Permisos actualizados correctamente");
    } catch (error) {
      console.error("Error guardando permisos:", error);
      alert("Error al guardar los permisos");
    } finally {
      setIsSaving(false);
    }
  };

  // Verificar si el usuario tiene permiso para editar
  const canEdit = adminPermissionLevel === "total";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D7008A]"></div>
      </div>
    );
  }

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
          <Shield className="text-[#D7008A]" size={24} />
          <h2 className="text-xl font-semibold">Gestión de Permisos</h2>
        </div>

        {canEdit && (
          <button
            onClick={handleSavePermissions}
            disabled={isSaving || !selectedAdmin}
            className="flex items-center gap-1 px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save size={16} />
            )}
            <span>Guardar Cambios</span>
          </button>
        )}
      </div>

      {/* Información sobre permisos */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Info className="text-blue-500 mt-0.5 flex-shrink-0" size={20} />
        <div>
          <h3 className="font-medium text-blue-800 mb-1">Niveles de Acceso</h3>
          <p className="text-sm text-blue-700">
            El sistema tiene tres niveles de permisos: <strong>Bajo</strong> (acceso básico), 
            <strong> Intermedio</strong> (acceso moderado) y <strong>Total</strong> (acceso completo). 
            Cada nivel incluye automáticamente los permisos de los niveles inferiores.
          </p>
          {!canEdit && (
            <p className="text-sm text-amber-600 mt-2">
              <strong>Nota:</strong> Solo los administradores con nivel de permiso Total pueden modificar estos ajustes.
            </p>
          )}
        </div>
      </div>

      {/* Selector de administrador */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Seleccionar Administrador
        </label>
        <select
          value={selectedAdmin ? selectedAdmin.id : ""}
          onChange={(e) => {
            const adminId = parseInt(e.target.value);
            const admin = adminUsers.find(a => a.id === adminId);
            setSelectedAdmin(admin);
          }}
          disabled={!canEdit}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A] disabled:bg-gray-100"
        >
          <option value="">Selecciona un administrador</option>
          {adminUsers.map(admin => (
            <option key={admin.id} value={admin.id}>
              {admin.nombre} - Nivel {admin.nivelPermiso}
            </option>
          ))}
        </select>
      </div>

      {selectedAdmin ? (
        <div className="space-y-6">
          {/* Nivel de permiso general */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-2">Nivel de Permiso General</h3>
            <p className="text-sm text-gray-600 mb-4">
              Este es el nivel base de permisos para este administrador. Determina el acceso a las funcionalidades del sistema.
            </p>
            
            <div className="flex gap-4">
              {["bajo", "intermedio", "total"].map(level => (
                <label 
                  key={level} 
                  className={`relative flex items-center justify-center px-4 py-2 border rounded-md ${
                    selectedAdmin?.nivelPermiso === level
                      ? "border-[#D7008A] bg-pink-50"
                      : "border-gray-300"
                  } ${canEdit ? "cursor-pointer" : "cursor-default"}`}
                >
                  <input
                    type="radio"
                    name="permissionLevel"
                    value={level}
                    checked={selectedAdmin?.nivelPermiso === level}
                    onChange={() => {
                      if (canEdit) {
                        setSelectedAdmin(prev => ({
                          ...prev,
                          nivelPermiso: level
                        }));
                      }
                    }}
                    disabled={!canEdit}
                    className="sr-only"
                  />
                  <span className={`font-medium ${
                    selectedAdmin?.nivelPermiso === level
                      ? "text-[#D7008A]"
                      : "text-gray-700"
                  }`}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Módulos y permisos */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium">Permisos por Módulo</h3>
              <p className="text-sm text-gray-600">
                Estos permisos se aplican automáticamente según el nivel seleccionado.
              </p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {permissions.map(module => (
                <div key={module.id} className="px-6 py-3">
                  {/* Cabecera del módulo */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between py-2 hover:bg-gray-50 transition-colors rounded-md px-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {module.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {module.description}
                      </span>
                    </div>
                    {expandedModules[module.id] ? (
                      <ChevronDown size={18} className="text-gray-500" />
                    ) : (
                      <ChevronRight size={18} className="text-gray-500" />
                    )}
                  </button>
                  
                  {/* Acciones del módulo */}
                  {expandedModules[module.id] && (
                    <div className="mt-2 pl-4 space-y-2">
                      {module.actions.map(action => (
                        <div key={action.id} className="flex justify-between items-center py-1 border-t border-gray-100">
                          <span className="text-sm text-gray-700">
                            {action.name}
                          </span>
                          
                          <div className="flex gap-2">
                            {["bajo", "intermedio", "total"].map(level => (
                              <span 
                                key={`${action.id}-${level}`}
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
                                  hasPermission(action, level)
                                    ? level === selectedAdmin?.nivelPermiso
                                      ? "bg-[#D7008A] text-white"
                                      : "bg-gray-200 text-gray-700"
                                    : "bg-gray-100 text-gray-400"
                                }`}
                                title={level.charAt(0).toUpperCase() + level.slice(1)}
                              >
                                {level.charAt(0).toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Shield className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Selecciona un Administrador</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Para ver y gestionar los permisos, debes seleccionar un administrador de la lista.
          </p>
        </div>
      )}
    </motion.div>
  );
}