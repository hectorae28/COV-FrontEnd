import { useState, useRef } from 'react';
import { Mail, Camera, Trash2 } from "lucide-react";

export default function ProfileSidebar({
    formData,
    previewImage,
    userInfo,
    handleImageChange,
    handleDeleteImage
}) {
    const fileInputRef = useRef(null);

    // Obtener las iniciales del nombre para el avatar por defecto
    const getInitials = () => {
        const nombre = formData.firstName?.charAt(0) || "";
        const apellido = formData.firstLastName?.charAt(0) || "";
        return (nombre + apellido).toUpperCase();
    };

    // Manejar clic en la imagen para abrir el selector de archivos
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const hasProfileImage = previewImage || userInfo?.imagenPerfil;

    return (
        <div className="lg:col-span-1 h-full">
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">
                {/* Banner superior */}
                <div className="h-32 bg-gradient-to-r from-[#41023B] to-[#D7008A]"></div>
                
                {/* Contenedor de foto de perfil */}
                <div className="px-6 pb-8 relative flex-grow flex flex-col">
                    {/* Foto de perfil con botón de eliminar */}
                    <div className="relative -mt-20 mb-2 mx-auto w-40 h-40">
                        {/* Contenedor circular para la foto */}
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                            {/* Imagen de perfil o iniciales */}
                            {hasProfileImage ? (
                                <img
                                    src={previewImage || userInfo?.imagenPerfil}
                                    alt="Foto de perfil"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#41023B] to-[#D7008A] text-white text-5xl font-bold">
                                    {getInitials()}
                                </div>
                            )}
                        </div>
                        
                        {/* Botón de eliminar (solo visible si hay foto) */}
                        {hasProfileImage && (
                            <div className="absolute -top-2 -right-2 group">
                                <button 
                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-colors duration-200"
                                    onClick={handleDeleteImage}
                                >
                                    <Trash2 size={14} />
                                </button>
                                <span className="absolute top-0 right-full mr-2 whitespace-nowrap bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    Eliminar foto de perfil
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Botón de cambiar foto */}
                    <div className="flex justify-center mt-2 mb-6">
                        <button 
                            className="bg-[#D7008A] hover:bg-[#41023B] text-white px-3 py-1.5 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-1.5"
                            onClick={handleImageClick}
                            title="Cambiar foto de perfil"
                        >
                            <Camera size={16} />
                            <span className="text-sm">Cambiar foto</span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </button>
                    </div>

                    {/* Datos básicos */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-[#41023B]">
                            {formData.firstName} {formData.firstLastName}
                        </h2>
                        <p className="mt-3 text-gray-600">
                            <span className="inline-flex items-center">
                                <Mail size={18} className="mr-2 text-[#D7008A]" />
                                {formData.email}
                            </span>
                        </p>
                        <div className="mt-5 inline-block bg-[#41023B] text-white font-semibold py-2 px-5 rounded-full text-lg">
                            COV-{formData.mainRegistrationNumber || "0000"}
                        </div>
                    </div>

                    {/* Separador */}
                    <div className="border-t border-gray-100 my-6"></div>

                    {/* Logo institucional - con margin-top auto para empujar al fondo */}
                    <div className="flex justify-center mt-auto">
                        <img
                            src="/assets/escudo.png"
                            alt="Colegio de Odontólogos de Venezuela"
                            className="h-32 object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Ccircle cx='90' cy='90' r='80' fill='%23ffffff' /%3E%3Ctext x='50%' y='50%' fontSize='24' textAnchor='middle' dominantBaseline='middle' fill='%23D7008A'%3ECOV%3C/text%3E%3C/svg%3E";
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
