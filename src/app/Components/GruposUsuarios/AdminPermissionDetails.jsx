import { useState } from "react";
import { motion } from "framer-motion";
import { 
  X, 
  Save, 
  UserCog, 
  Users, 
  Shield, 
  Key, 
  FileText, 
  BarChart2, 
  CheckCircle, 
  AlertTriangle 
} from "lucide-react";

export default function AdminPermissionDetails({ admin, onClose, onSave }) {
  const [adminData, setAdminData] = useState(admin);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Manejar cambio de nivel de permiso
  const handleLevelChange = (level) => {
    setAdminData(prev => ({
      ...prev,
      nivelPermiso: level
    }));
  };

  // Manejar cambio de estado (activo/inactivo)
  const handleStatusChange = () => {
    const newStatus = adminData.status === "activo" ? "inactivo" : "activo";
    
    if (newStatus === "inactivo") {
      setShowConfirmation(true);
    } else {
      setAdminData(prev => ({
        ...prev,
        status: newStatus
      }));
    }
  };

  // Confirmar cambio a inactivo
  const confirmStatusChange = () => {
    setAdminData(prev => ({
      ...prev,
      status: "inactivo"
    }));
    setShowConfirmation(false);
  };

  // Manejar cambio en permisos específicos
  const handlePermissionChange = (moduleName) => {
    setAdminData(prev => ({
      ...prev,
      permisos: {
        ...prev.permisos,
        [moduleName]: !prev.permisos[moduleName]
      }
    }));
  };

  // Cambiar dato básico
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar cambios
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // En implementación real, llamar a API para guardar cambios
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(adminData);
      onClose();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("Error al guardar los cambios del administrador");
    } finally {
      setIsSaving(false);
    }
  };

  // Módulos del sistema con sus iconos
  const systemModules = [
    { name: "usuarios", label: "Gestión de Usuarios", icon: UserCog },
    { name: "colegiados", label: "Gestión de Colegiados", icon: Users },
    { name: "pagos", label: "Gestión de Pagos", icon: Shield },
    { name: "contenido", label: "Gestión de Contenido", icon: FileText },
    { name: "grupos", label: "Gestión de Grupos", icon: Key },
    { name: "reportes", label: "Reportes y Estadísticas", icon: BarChart2 }
  ];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose}></div>
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Administrar Permisos</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Contenido */}
        <div className="p-6">
          {/* Datos básicos */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Información del Administrador</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={adminData.nombre}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={adminData.apellido}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={adminData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo
                </label>
                <input
                  type="text"
                  name="cargo"
                  value={adminData.cargo}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                />
              </div>
            </div>
          </div>
          
          {/* Estado */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Estado</h3>
            <div className="flex items-center mt-2">
              <button
                onClick={handleStatusChange}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:ring-offset-2 ${
                  adminData.status === "activo" ? "bg-[#D7008A]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    adminData.status === "activo" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {adminData.status === "activo" ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
          
          {/* Nivel de permiso */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Nivel de Permiso</h3>
            <div className="grid grid-cols-3 gap-4">
              {["bajo", "medio", "alto"].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleLevelChange(level)}
                  className={`flex flex-col items-center justify-center py-3 px-4 border rounded-lg transition-colors ${
                    adminData.nivelPermiso === level
                      ? "border-[#D7008A] bg-pink-50 text-[#D7008A]"
                      : "border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <Shield size={24} className={adminData.nivelPermiso === level ? "text-[#D7008A]" : "text-gray-400"} />
                  <span className="mt-2 font-medium capitalize">{level}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-4 bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Nota:</span> El nivel de permiso determina automáticamente el acceso a ciertas funciones del sistema. 
                Los permisos específicos a continuación pueden usarse para crear excepciones a estas reglas.
              </p>
            </div>
          </div>
          
          {/* Permisos específicos */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Permisos Específicos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {systemModules.map(module => {
                const ModuleIcon = module.icon;
                
                // Si el nivel de permiso ya cubre este módulo, mostrar como activado automáticamente
                const isAutoEnabled = (
                  (adminData.nivelPermiso === "alto") || 
                  (adminData.nivelPermiso === "medio" && module.name !== "grupos")
                );
                
                return (
                  <div 
                    key={module.name}
                    className={`flex items-start p-3 border rounded-md ${
                      isAutoEnabled || adminData.permisos[module.name] 
                        ? "border-green-200 bg-green-50" 
                        : "border-gray-200"
                    }`}
                  >
                    <div className={`p-2 rounded-md ${
                      isAutoEnabled || adminData.permisos[module.name] 
                        ? "bg-green-100" 
                        : "bg-gray-100"
                    }`}>
                      <ModuleIcon size={18} className={
                        isAutoEnabled || adminData.permisos[module.name]
                          ? "text-green-600" 
                          : "text-gray-500"
                      } />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          {module.label}
                        </label>
                        {isAutoEnabled ? (
                          <span className="flex items-center text-xs text-green-600">
                            <CheckCircle size={14} className="mr-1" />
                            Auto
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handlePermissionChange(module.name)}
                            className="relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:ring-offset-1"
                            style={{ backgroundColor: adminData.permisos[module.name] ? '#D7008A' : '#E5E7EB' }}
                          >
                            <span
                              className="inline-block h-3 w-3 transform rounded-full bg-white transition-transform"
                              style={{ transform: adminData.permisos[module.name] ? 'translateX(1.25rem)' : 'translateX(0.25rem)' }}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Aclaración sobre permisos del nivel alto */}
            {adminData.nivelPermiso === "alto" && (
              <div className="mt-4 bg-yellow-50 p-3 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle size={18} className="text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-yellow-700">
                    El nivel <strong>Alto</strong> otorga automáticamente acceso a todas las funcionalidades del sistema. 
                    Los interruptores están desactivados pues no pueden modificarse individualmente en este nivel.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Pie del modal */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors mr-2"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors disabled:opacity-50 flex items-center"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Guardando...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </motion.div>
      
      {/* Modal de confirmación para inactivar administrador */}
      {showConfirmation && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setShowConfirmation(false)}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md p-6">
            <div className="mb-4 flex items-start">
              <AlertTriangle size={24} className="text-amber-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">¿Inactivar administrador?</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Está a punto de inactivar al administrador <strong>{adminData.nombre} {adminData.apellido}</strong>. 
                  Esta acción impedirá que el usuario inicie sesión y acceda al sistema.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmStatusChange}
                className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}