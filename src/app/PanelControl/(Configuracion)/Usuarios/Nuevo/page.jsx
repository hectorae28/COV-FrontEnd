"use client";

import { gruposData } from "@/Components/GruposUsuarios/GruposUsuariosData";
import { motion } from "framer-motion";
import {
    AlertTriangle,
    ArrowLeft,
    Check,
    Eye,
    EyeOff,
    Save,
    Shield,
    User,
    UserPlus
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NewAdminPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [groups, setGroups] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [userPermissionLevel, setUserPermissionLevel] = useState("bajo");
    const [formErrors, setFormErrors] = useState({});
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        direccion: "",
        grupo: "",
        permiso: "bajo",
        password: "",
        confirmPassword: "",
        enviarCredenciales: true
    });

    // Cargar datos necesarios
    useEffect(() => {
        const fetchData = async () => {
            try {
                // En producción, obtendríamos el nivel de permiso del usuario actual
                setUserPermissionLevel("alto");

                // Cargar grupos
                setTimeout(() => {
                    setGroups(gruposData);
                }, 500);
            } catch (error) {
                console.error("Error al cargar datos iniciales:", error);
            }
        };

        fetchData();
    }, []);

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === "checkbox" ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: val
        }));

        // Limpiar error del campo cuando cambia
        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Validar formulario
    const validateForm = () => {
        const errors = {};

        // Validar campos obligatorios
        if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio";
        if (!formData.apellido.trim()) errors.apellido = "El apellido es obligatorio";

        // Validar email
        if (!formData.email.trim()) {
            errors.email = "El email es obligatorio";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "El formato del email no es válido";
        }

        // Validar grupo
        if (!formData.grupo) errors.grupo = "Debe seleccionar un grupo";

        // Validar contraseña
        if (!formData.password) {
            errors.password = "La contraseña es obligatoria";
        } else if (formData.password.length < 8) {
            errors.password = "La contraseña debe tener al menos 8 caracteres";
        }

        // Validar confirmación de contraseña
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Las contraseñas no coinciden";
        }

        return errors;
    };

    // Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar nivel de permiso
        if (userPermissionLevel !== "alto") {
            alert("No tienes permiso para crear administradores. Se requiere nivel alto.");
            return;
        }

        // Validar formulario
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsLoading(true);
        try {
            // Aquí implementar llamada a API para crear administrador
            // const response = await createAdministrator(formData);

            // Simulamos una llamada a API
            await new Promise(resolve => setTimeout(resolve, 1500));

            setFormSubmitted(true);
            // En una implementación real, redireccionar a la página del admin creado
            // window.location.href = `/PanelControl/Usuarios/${response.id}`;
        } catch (error) {
            console.error("Error al crear administrador:", error);
            alert("Error al crear el administrador");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 mt-28">
            <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Cabecera */}
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/PanelControl/Usuarios" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-[#41023B] flex items-center gap-2">
                        <UserPlus size={24} /> Crear Nuevo Administrador
                    </h1>
                </div>

                {/* Mensaje de éxito después de enviar el formulario */}
                {formSubmitted ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center justify-center text-center py-12"
                    >
                        <div className="bg-green-100 rounded-full p-4 mb-4">
                            <Check size={32} className="text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-green-800 mb-2">
                            Administrador Creado Correctamente
                        </h2>
                        <p className="text-green-700 mb-6 max-w-md">
                            El nuevo administrador ha sido creado con éxito. {formData.enviarCredenciales && "Se ha enviado un correo electrónico con las credenciales de acceso."}
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="/PanelControl/Usuarios"
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Volver a la Lista
                            </Link>
                            <Link
                                href="#"
                                className="px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors"
                            >
                                Ver Administrador
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Mensaje informativo */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                            <AlertTriangle className="text-blue-500 mt-0.5 flex-shrink-0" size={20} />
                            <div>
                                <h3 className="font-medium text-blue-800 mb-1">Creación de Administrador</h3>
                                <p className="text-sm text-blue-700">
                                    Al crear un nuevo administrador, se le asignarán automáticamente los permisos correspondientes a su nivel y grupo.
                                    Opcionalmente, puedes enviar un correo con las credenciales de acceso.
                                </p>
                            </div>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Información personal */}
                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                                        <User size={18} className="text-[#D7008A]" />
                                        Información Personal
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nombre <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleInputChange}
                                                className={`w-full p-2 border ${formErrors.nombre ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]`}
                                            />
                                            {formErrors.nombre && (
                                                <p className="mt-1 text-xs text-red-500">{formErrors.nombre}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Apellido <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="apellido"
                                                value={formData.apellido}
                                                onChange={handleInputChange}
                                                className={`w-full p-2 border ${formErrors.apellido ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]`}
                                            />
                                            {formErrors.apellido && (
                                                <p className="mt-1 text-xs text-red-500">{formErrors.apellido}</p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Correo Electrónico <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full p-2 border ${formErrors.email ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]`}
                                            />
                                            {formErrors.email && (
                                                <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                name="telefono"
                                                value={formData.telefono}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Dirección
                                            </label>
                                            <input
                                                type="text"
                                                name="direccion"
                                                value={formData.direccion}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Información administrativa */}
                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                                        <Shield size={18} className="text-[#D7008A]" />
                                        Información Administrativa
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Grupo <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="grupo"
                                                value={formData.grupo}
                                                onChange={handleInputChange}
                                                className={`w-full p-2 border ${formErrors.grupo ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]`}
                                            >
                                                <option value="">Seleccionar grupo</option>
                                                {groups.map(group => (
                                                    <option key={group.id} value={group.nombre}>
                                                        {group.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            {formErrors.grupo && (
                                                <p className="mt-1 text-xs text-red-500">{formErrors.grupo}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nivel de Permiso <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex gap-4">
                                                {["bajo", "medio", "alto"].map(level => (
                                                    <label
                                                        key={level}
                                                        className={`relative flex items-center justify-center px-4 py-2 border rounded-md cursor-pointer ${formData.permiso === level ? "border-[#D7008A] bg-pink-50" : "border-gray-300"
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="permiso"
                                                            value={level}
                                                            checked={formData.permiso === level}
                                                            onChange={handleInputChange}
                                                            className="sr-only"
                                                        />
                                                        <span className={`font-medium ${formData.permiso === level ? "text-[#D7008A]" : "text-gray-700"
                                                            }`}>
                                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contraseña */}
                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                                        <Lock size={18} className="text-[#D7008A]" />
                                        Contraseña
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Contraseña <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    className={`w-full p-2 pr-10 border ${formErrors.password ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {formErrors.password && (
                                                <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Confirmar Contraseña <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    className={`w-full p-2 pr-10 border ${formErrors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {formErrors.confirmPassword && (
                                                <p className="mt-1 text-xs text-red-500">{formErrors.confirmPassword}</p>
                                            )}
                                        </div>

                                        <div className="pt-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="enviarCredenciales"
                                                    checked={formData.enviarCredenciales}
                                                    onChange={handleInputChange}
                                                    className="h-4 w-4 text-[#D7008A] border-gray-300 rounded focus:ring-[#D7008A]"
                                                />
                                                <span className="text-sm text-gray-700">
                                                    Enviar credenciales por correo electrónico
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="md:col-span-2 flex justify-end gap-2 pt-4 border-t border-gray-200">
                                    <Link
                                        href="/PanelControl/Usuarios"
                                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors disabled:opacity-50 flex items-center gap-1"
                                    >
                                        {isLoading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Save size={16} />
                                        )}
                                        <span>Crear Administrador</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// Componente Lock (simulando el icono)
function Lock({ size = 24, className = "" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
    );
}