import { useState } from "react";
import { motion } from "framer-motion";
import { User, Edit, Save, X } from "lucide-react";

export default function AdminInfo({ adminInfo, isEditing, setIsEditing }) {
    const [formData, setFormData] = useState(adminInfo || {});
    const [isLoading, setIsLoading] = useState(false);

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Manejar guardado de cambios
    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Aquí implementar llamada a API para guardar cambios
            // await updateAdminProfile(formData);
            
            // Simulamos una llamada a API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setIsEditing(false);
            // Mostrar notificación de éxito
            alert("Perfil actualizado correctamente");
        } catch (error) {
            console.error("Error al guardar perfil:", error);
            // Mostrar notificación de error
            alert("Error al actualizar el perfil");
        } finally {
            setIsLoading(false);
        }
    };

    // Cancelar edición
    const handleCancel = () => {
        setFormData(adminInfo);
        setIsEditing(false);
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
                    <User className="text-[#D7008A]" size={24} />
                    <h2 className="text-xl font-semibold">Perfil de Administrador</h2>
                </div>
                
                <div>
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                <X size={16} className="mr-1 inline" />
                                Cancelar
                            </button>
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
                                Guardar
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <Edit size={16} className="mr-1 inline" />
                            Editar Perfil
                        </button>
                    )}
                </div>
            </div>
            
            {/* Contenido del perfil */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                value={formData.nombre || ""}
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
                                value={formData.apellido || ""}
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
                                value={formData.email || ""}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A] disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                name="telefono"
                                value={formData.telefono || ""}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A] disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>
                    </div>
                </div>
                
                {/* Información administrativa */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Información Administrativa</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cargo
                            </label>
                            <input
                                type="text"
                                name="cargo"
                                value={formData.cargo || ""}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A] disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Departamento
                            </label>
                            <input
                                type="text"
                                name="departamento"
                                value={formData.departamento || ""}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A] disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nivel de Permiso
                            </label>
                            <input
                                type="text"
                                value={formData.nivelPermiso || ""}
                                disabled={true}
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                El nivel de permiso solo puede ser modificado por un administrador de nivel superior.
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Foto de perfil (opcional) */}
                <div className="md:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Foto de Perfil</h3>
                    
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {formData.fotoPerfil ? (
                                <img 
                                    src={formData.fotoPerfil} 
                                    alt="Foto de perfil" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User size={48} className="text-gray-400" />
                            )}
                        </div>
                        
                        {isEditing && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cambiar foto
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Formatos permitidos: JPG, PNG. Tamaño máximo: 2MB
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}