import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Key, LogOut, Bell, Eye, EyeOff, Save } from "lucide-react";

export default function AdminSettings({ adminInfo, session }) {
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        loginAlerts: true,
        systemUpdates: false,
        userActivity: true
    });

    // Manejar cambio en campos de contraseña
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Manejar cambio en configuración de notificaciones
    const handleNotificationChange = (setting) => {
        setNotificationSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    // Validar y guardar nueva contraseña
    const handleSavePassword = async () => {
        // Validar que las contraseñas coinciden
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        // Validar longitud mínima
        if (passwordData.newPassword.length < 8) {
            alert("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        setIsLoading(true);
        try {
            // Aquí implementar llamada a API para cambiar contraseña
            // await changePassword(passwordData, session);
            
            // Simulamos una llamada a API
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setIsChangingPassword(false);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            
            // Mostrar notificación de éxito
            alert("Contraseña actualizada correctamente");
        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            // Mostrar notificación de error
            alert("Error al actualizar la contraseña");
        } finally {
            setIsLoading(false);
        }
    };

    // Guardar configuración de notificaciones
    const handleSaveNotifications = async () => {
        setIsLoading(true);
        try {
            // Aquí implementar llamada a API para guardar configuración
            // await saveNotificationSettings(notificationSettings, session);
            
            // Simulamos una llamada a API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mostrar notificación de éxito
            alert("Configuración de notificaciones actualizada");
        } catch (error) {
            console.error("Error al guardar configuración:", error);
            // Mostrar notificación de error
            alert("Error al guardar la configuración");
        } finally {
            setIsLoading(false);
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
            <div className="flex items-center gap-2 mb-6">
                <Settings className="text-[#D7008A]" size={24} />
                <h2 className="text-xl font-semibold">Configuración de Cuenta</h2>
            </div>
            
            {/* Contenido de configuración */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Seguridad */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <Key size={18} />
                        Seguridad
                    </h3>
                    
                    {isChangingPassword ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contraseña Actual
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nueva Contraseña
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirmar Nueva Contraseña
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                                />
                            </div>
                            
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => {
                                        setIsChangingPassword(false);
                                        setPasswordData({
                                            currentPassword: "",
                                            newPassword: "",
                                            confirmPassword: ""
                                        });
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSavePassword}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors disabled:opacity-50 flex items-center"
                                >
                                    {isLoading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    ) : (
                                        <Save size={16} className="mr-1" />
                                    )}
                                    Guardar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-gray-600 mb-4">
                                Tu contraseña fue actualizada por última vez el {adminInfo.lastPasswordChange || "01-01-2024"}.
                            </p>
                            <button
                                onClick={() => setIsChangingPassword(true)}
                                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Cambiar Contraseña
                            </button>
                        </div>
                    )}
                    
                    <div className="mt-8">
                        <h4 className="font-medium text-gray-700 mb-3">Sesiones Activas</h4>
                        <div className="bg-gray-50 p-3 rounded-md">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-sm">Sesión Actual</p>
                                    <p className="text-xs text-gray-500">
                                        {adminInfo.dispositivo || "Navegador Web"} · {adminInfo.location || "Caracas, Venezuela"}
                                    </p>
                                </div>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Activa
                                </span>
                            </div>
                        </div>
                        
                        <button
                            className="mt-3 flex items-center text-red-600 hover:text-red-800 transition-colors text-sm"
                        >
                            <LogOut size={14} className="mr-1" />
                            Cerrar todas las sesiones
                        </button>
                    </div>
                </div>
                
                {/* Notificaciones */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <Bell size={18} />
                        Notificaciones
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-gray-800">Notificaciones por Email</p>
                                <p className="text-sm text-gray-500">Recibir notificaciones importantes en tu correo</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.emailNotifications}
                                    onChange={() => handleNotificationChange("emailNotifications")}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D7008A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D7008A]"></div>
                            </label>
                        </div>
                        
                        <div className="flex items-center justify-between py-2 border-t border-gray-100">
                            <div>
                                <p className="font-medium text-gray-800">Alertas de Inicio de Sesión</p>
                                <p className="text-sm text-gray-500">Recibir alertas cuando alguien inicie sesión en tu cuenta</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.loginAlerts}
                                    onChange={() => handleNotificationChange("loginAlerts")}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D7008A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D7008A]"></div>
                            </label>
                        </div>
                        
                        <div className="flex items-center justify-between py-2 border-t border-gray-100">
                            <div>
                                <p className="font-medium text-gray-800">Actualizaciones del Sistema</p>
                                <p className="text-sm text-gray-500">Recibir notificaciones sobre actualizaciones y cambios</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.systemUpdates}
                                    onChange={() => handleNotificationChange("systemUpdates")}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D7008A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D7008A]"></div>
                            </label>
                        </div>
                        
                        <div className="flex items-center justify-between py-2 border-t border-gray-100">
                            <div>
                                <p className="font-medium text-gray-800">Actividad de Usuarios</p>
                                <p className="text-sm text-gray-500">Recibir notificaciones sobre actividades relevantes de usuarios</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.userActivity}
                                    onChange={() => handleNotificationChange("userActivity")}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D7008A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D7008A]"></div>
                            </label>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSaveNotifications}
                            disabled={isLoading}
                            className="px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors disabled:opacity-50 flex items-center"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            ) : (
                                <Save size={16} className="mr-1" />
                            )}
                            Guardar Configuración
                        </button>
                    </div>
                </div>
                
                {/* Información de cuenta */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Información de Cuenta</h3>
                    
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <p className="text-gray-600">Correo Electrónico</p>
                            <p className="font-medium">{adminInfo.email || "admin@ejemplo.com"}</p>
                        </div>
                        
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <p className="text-gray-600">Rol</p>
                            <p className="font-medium">Administrador ({adminInfo.nivelPermiso || "total"})</p>
                        </div>
                        
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <p className="text-gray-600">Última Conexión</p>
                            <p className="font-medium">{adminInfo.lastLogin || "Hoy, 10:30 AM"}</p>
                        </div>
                        
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <p className="text-gray-600">Cuenta Creada</p>
                            <p className="font-medium">{adminInfo.createdAt || "01-01-2023"}</p>
                        </div>
                    </div>
                    
                    <div className="pt-2">
                        <p className="text-sm text-gray-500">
                            Para modificar tu nivel de permiso, debes contactar a un administrador de nivel superior.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}