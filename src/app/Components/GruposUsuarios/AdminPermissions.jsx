import { motion } from "framer-motion";
import {
    AlertTriangle,
    Check,
    ChevronDown,
    ChevronRight,
    Info,
    Save,
    Shield,
    X
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminPermissions({ admin, isEditing, setIsEditing, onSave, userPermissionLevel }) {
    const [expandedModules, setExpandedModules] = useState({});
    const [formData, setFormData] = useState(admin);
    const [isLoading, setIsLoading] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    // Actualizar el estado cuando cambia el administrador
    useEffect(() => {
        if (admin) {
            setFormData(admin);

            // Expandir todos los módulos
            const modules = {};
            Object.keys(admin.permisos || {}).forEach(key => {
                modules[key] = true;
            });
            setExpandedModules(modules);
        }
    }, [admin]);

    // Manejar la expansión de módulos
    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    // Guardar cambios en los permisos
    const handleSave = async () => {
        // Verificar si el usuario es de nivel alto (solo ellos pueden cambiar permisos)
        if (userPermissionLevel !== "alto") {
            setShowWarning(true);
            return;
        }

        setIsLoading(true);
        try {
            // Aquí implementar llamada a API para guardar cambios
            // await updateAdminPermissions(formData);

            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 1000));

            onSave(formData);
            setIsEditing(false);
        } catch (error) {
            console.error("Error al guardar permisos:", error);
            alert("Error al guardar los permisos");
        } finally {
            setIsLoading(false);
        }
    };

    // Cambiar un permiso específico
    const handleTogglePermission = (moduleId) => {
        if (userPermissionLevel !== "alto") {
            setShowWarning(true);
            return;
        }

        setFormData(prev => ({
            ...prev,
            permisos: {
                ...prev.permisos,
                [moduleId]: !prev.permisos[moduleId]
            }
        }));
    };

    // Verificar si el usuario puede editar permisos
    const canEdit = userPermissionLevel === "alto" && isEditing;

    // Permiso heredado del grupo
    const isGroupInherited = (moduleId) => {
        // En una implementación real, verificaríamos si el permiso viene del grupo
        // Por simplicidad, asumiremos que todos los permisos son directos, excepto algunos ejemplos
        const inheritedModules = ["reportes", "ajustes"];
        return inheritedModules.includes(moduleId);
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
                    <Shield className="text-[#D7008A]" size={24} />
                    <h2 className="text-xl font-semibold">Permisos del Administrador</h2>
                </div>

                {isEditing && (
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors disabled:opacity-50 flex items-center"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                            <Save size={16} className="mr-1" />
                        )}
                        Guardar Permisos
                    </button>
                )}
            </div>

            {/* Información de permisos */}
            <div className="space-y-4">
                {/* Mensaje informativo */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <Info className="text-blue-500 mt-0.5 flex-shrink-0" size={20} />
                    <div>
                        <h3 className="font-medium text-blue-800 mb-1">Permisos de Administrador</h3>
                        <p className="text-sm text-blue-700">
                            Los permisos determinan a qué funcionalidades del sistema puede acceder este administrador.
                            El administrador hereda automáticamente los permisos de su grupo, pero también se pueden
                            configurar permisos específicos.
                        </p>
                        {userPermissionLevel !== "alto" && (
                            <p className="text-sm text-amber-600 mt-2 font-medium">
                                Solo los administradores con nivel alto pueden modificar permisos.
                            </p>
                        )}
                    </div>
                </div>

                {/* Nivel de permiso */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
                    <h3 className="text-lg font-medium mb-4">Nivel de Permiso General</h3>

                    <div className="flex gap-4">
                        {["bajo", "medio", "alto"].map(level => (
                            <div
                                key={level}
                                className={`relative px-4 py-2 border rounded-md ${formData.permiso === level
                                        ? "border-[#D7008A] bg-pink-50 text-[#D7008A]"
                                        : "border-gray-300 text-gray-700"
                                    }`}
                            >
                                <span className="font-medium capitalize">
                                    {level}
                                </span>
                            </div>
                        ))}
                    </div>

                    <p className="mt-3 text-sm text-gray-600">
                        Este administrador tiene un nivel de permiso <strong className="capitalize">{formData.permiso}</strong>.
                        Este nivel determina su acceso base al sistema. Para cambiar este nivel, edita el perfil en la
                        pestaña "Información Personal".
                    </p>
                </div>

                {/* Permisos específicos */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium">Permisos por Módulo</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Permisos específicos para cada módulo del sistema
                        </p>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {Object.entries(formData.permisos).map(([moduleId, isEnabled]) => (
                            <div key={moduleId} className="px-6 py-3">
                                {/* Cabecera del módulo */}
                                <button
                                    onClick={() => toggleModule(moduleId)}
                                    className="w-full flex items-center justify-between py-2 hover:bg-gray-50 transition-colors rounded-md px-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-800 capitalize">
                                            {moduleId}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {moduleId === "usuarios" && "Administración de usuarios"}
                                            {moduleId === "contenido" && "Gestión de contenidos del sitio"}
                                            {moduleId === "finanzas" && "Administración financiera"}
                                            {moduleId === "reportes" && "Generación de informes"}
                                            {moduleId === "ajustes" && "Configuración del sistema"}
                                            {moduleId === "grupos" && "Gestión de grupos y permisos"}
                                        </span>
                                    </div>
                                    {expandedModules[moduleId] ? (
                                        <ChevronDown size={18} className="text-gray-500" />
                                    ) : (
                                        <ChevronRight size={18} className="text-gray-500" />
                                    )}
                                </button>

                                {/* Contenido del módulo */}
                                {expandedModules[moduleId] && (
                                    <div className="mt-2 pl-4 pr-2 pb-2">
                                        <div className="flex justify-between items-center p-3 border rounded-md bg-gray-50">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-2 rounded-md ${isEnabled
                                                        ? "bg-green-100"
                                                        : "bg-gray-100"
                                                    }`}>
                                                    <Shield size={16} className={
                                                        isEnabled
                                                            ? "text-green-600"
                                                            : "text-gray-400"
                                                    } />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {isEnabled ? "Acceso permitido" : "Acceso denegado"}
                                                    </p>
                                                    {isGroupInherited(moduleId) && (
                                                        <p className="text-xs text-gray-500">
                                                            Heredado del grupo: {formData.grupo}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {isEnabled ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-800 text-xs">
                                                        <Check size={12} /> Habilitado
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs">
                                                        <X size={12} /> Deshabilitado
                                                    </span>
                                                )}

                                                {canEdit && !isGroupInherited(moduleId) && (
                                                    <button
                                                        onClick={() => handleTogglePermission(moduleId)}
                                                        className="relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:ring-offset-2"
                                                        style={{ backgroundColor: isEnabled ? '#D7008A' : '#E5E7EB' }}
                                                    >
                                                        <span
                                                            className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                                            style={{ transform: isEnabled ? 'translateX(1.25rem)' : 'translateX(0.25rem)' }}
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Advertencia sobre permisos */}
            {showWarning && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Permisos Insuficientes</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-amber-100 rounded-full p-2">
                                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-gray-500">
                                        No tienes permisos suficientes para modificar los permisos de administradores.
                                        Se requiere nivel de permiso alto para realizar esta acción.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                            <button
                                type="button"
                                className="px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors"
                                onClick={() => setShowWarning(false)}
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}