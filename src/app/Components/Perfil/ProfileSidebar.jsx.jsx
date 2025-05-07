import { User, Phone, MapPin, GraduationCap, Camera } from "lucide-react";

export default function ProfileSidebar({ 
    formData, 
    previewImage, 
    userInfo, 
    isEditing, 
    handleImageClick, 
    handleImageChange, 
    fileInputRef 
}) {
    // Obtener las iniciales del nombre para el avatar por defecto
    const getInitials = () => {
        const nombre = formData.firstName.charAt(0) || "";
        const apellido = formData.firstLastName.charAt(0) || "";
        return (nombre + apellido).toUpperCase();
    };

    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center sticky top-6">
                {/* Foto de perfil */}
                <div className="relative mb-4 w-32 h-32 rounded-full overflow-hidden shadow-lg">
                    {previewImage || userInfo?.imagenPerfil ? (
                        <img
                            src={previewImage || userInfo?.imagenPerfil}
                            alt="Foto de perfil"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#41023B] to-[#D7008A] text-white text-3xl font-bold">
                            {getInitials()}
                        </div>
                    )}

                    {/* Botón de cambio de foto (solo en modo edición) */}
                    {isEditing && (
                        <button
                            onClick={handleImageClick}
                            className="absolute bottom-0 right-0 bg-[#D7008A] hover:bg-[#41023B] text-white p-2 rounded-full shadow-md transition-colors duration-300"
                        >
                            <Camera size={20} />
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </button>
                    )}
                </div>

                {/* Datos de identidad */}
                <div className="w-full text-center mb-6">
                    <h2 className="text-xl font-bold text-[#41023B]">
                        {formData.firstName} {formData.firstLastName}
                    </h2>
                    <p className="mt-1 text-gray-600">{formData.email}</p>
                    <div className="mt-4 inline-block bg-[#41023B] text-white text-sm font-semibold py-1 px-3 rounded-full">
                        COV-{formData.mainRegistrationNumber || "0000"}
                    </div>
                </div>

                {/* Datos de contacto */}
                <div className="w-full space-y-3 border-t border-gray-100 pt-4">
                    <div className="flex items-center text-sm">
                        <Phone size={16} className="text-[#D7008A] mr-2" />
                        <span className="text-gray-700">{formData.countryCode} {formData.phoneNumber || "No especificado"}</span>
                    </div>
                    <div className="flex items-start text-sm">
                        <MapPin size={16} className="text-[#D7008A] mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{formData.address || "No especificada"}</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <GraduationCap size={16} className="text-[#D7008A] mr-2" />
                        <span className="text-gray-700">{formData.universityTitle || "No especificada"}</span>
                    </div>
                </div>

                {/* Logo institucional */}
                <div className="mt-auto pt-6 border-t border-gray-100 w-full flex justify-center">
                    <img
                        src="/assets/escudo.png"
                        alt="Colegio de Odontólogos de Venezuela"
                        className="h-16 object-contain"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Ccircle cx='90' cy='90' r='80' fill='%23ffffff' /%3E%3Ctext x='50%' y='50%' fontSize='24' textAnchor='middle' dominantBaseline='middle' fill='%23D7008A'%3ECOV%3C/text%3E%3C/svg%3E";
                        }}
                    />
                </div>
            </div>
        </div>
    );
}