import { motion } from "framer-motion";
import { User, Calendar, CreditCard } from "lucide-react";
import InfoItem from "./InfoItem";

export default function PersonalSection({ formData }) {
    // Formatear la fecha para mostrar
    const formatDate = (dateString) => {
        if (!dateString) return "No especificada";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Calcular edad (si hay fecha de nacimiento)
    const calculateAge = () => {
        if (!formData.birthDate) return null;
        
        try {
            const birthDate = new Date(formData.birthDate);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            return age;
        } catch (e) {
            return formData.age || null;
        }
    };

    // Obtener texto de género
    const getGenderText = () => {
        if (!formData.gender) return "No especificado";
        switch(formData.gender) {
            case "masculino": return "Masculino";
            case "femenino": return "Femenino";
            case "otro": return "Otro";
            default: return formData.gender;
        }
    };

    // Obtener texto de estado civil
    const getMaritalStatusText = () => {
        if (!formData.maritalStatus) return "No especificado";
        switch(formData.maritalStatus) {
            case "soltero": return "Soltero/a";
            case "casado": return "Casado/a";
            case "divorciado": return "Divorciado/a";
            case "viudo": return "Viudo/a";
            default: return formData.maritalStatus;
        }
    };

    // Obtener texto de nacionalidad
    const getNationalityText = () => {
        if (!formData.nationality) return "No especificada";
        switch(formData.nationality) {
            case "venezolana": return "Venezolana";
            case "extranjera": return "Extranjera";
            default: return formData.nationality;
        }
    };

    const formattedBirthDate = formatDate(formData.birthDate);
    const age = calculateAge();
    const birthDateText = formattedBirthDate + (age ? ` (${age} años)` : "");

    return (
        <motion.div
            key="personal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <h3 className="text-lg font-semibold text-[#41023B] mb-5">Datos Personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InfoItem 
                    label="Nacionalidad"
                    value={getNationalityText()}
                />
                <InfoItem 
                    label="Cédula"
                    value={formData.identityCard ? `${formData.idType || "V"} - ${formData.identityCard}` : "No especificada"}
                    icon={CreditCard}
                />
                <InfoItem 
                    label="Primer nombre"
                    value={formData.firstName || "No especificado"}
                    icon={User}
                />
                <InfoItem 
                    label="Segundo nombre"
                    value={formData.secondName || "No especificado"}
                />
                <InfoItem 
                    label="Primer apellido"
                    value={formData.firstLastName || "No especificado"}
                />
                <InfoItem 
                    label="Segundo apellido"
                    value={formData.secondLastName || "No especificado"}
                />
                <InfoItem 
                    label="Fecha de Nacimiento"
                    value={birthDateText}
                    icon={Calendar}
                />
                <InfoItem 
                    label="Género"
                    value={getGenderText()}
                />
                <InfoItem 
                    label="Estado Civil"
                    value={getMaritalStatusText()}
                />
            </div>
            
            {/* Sección de datos personales para el sidebar - visible solo en móvil */}
            <div className="block md:hidden mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-[#41023B] mb-3">Resumen Personal</h4>
                <div className="space-y-3">
                    <div className="flex items-center text-sm">
                        <User size={16} className="text-[#D7008A] mr-3 flex-shrink-0" />
                        <div>
                            <p className="text-gray-500 text-xs">Nombre</p>
                            <p className="text-gray-800">{formData.firstName || ""} {formData.firstLastName || ""}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center text-sm">
                        <CreditCard size={16} className="text-[#D7008A] mr-3 flex-shrink-0" />
                        <div>
                            <p className="text-gray-500 text-xs">Cédula</p>
                            <p className="text-gray-800">{formData.identityCard ? `${formData.idType || "V"} - ${formData.identityCard}` : "No especificada"}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center text-sm">
                        <Calendar size={16} className="text-[#D7008A] mr-3 flex-shrink-0" />
                        <div>
                            <p className="text-gray-500 text-xs">Fecha de Nacimiento</p>
                            <p className="text-gray-800">{birthDateText}</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
