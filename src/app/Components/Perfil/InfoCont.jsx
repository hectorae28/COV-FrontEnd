import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import InfoItem from "./InfoItem";

export default function ContactSection({ formData }) {
    // Formatear el estado y ciudad con la primera letra en mayúscula
    const formatLocation = (text) => {
        if (!text) return "No especificado";
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    return (
        <motion.div
            key="contacto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <h3 className="text-lg font-semibold text-[#41023B] mb-5">Información de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InfoItem 
                    label="Correo Electrónico" 
                    value={formData.email} 
                    icon={Mail} 
                />
                <InfoItem 
                    label="Teléfono Móvil" 
                    value={`${formData.countryCode || "+58"} ${formData.phoneNumber || "No especificado"}`} 
                    icon={Phone} 
                />
                <InfoItem 
                    label="Teléfono de Habitación" 
                    value={formData.homePhone || "No especificado"} 
                />
                <InfoItem 
                    label="Estado" 
                    value={formatLocation(formData.state)} 
                />
                <InfoItem 
                    label="Ciudad" 
                    value={formatLocation(formData.city)} 
                />
                <InfoItem 
                    label="Dirección" 
                    value={formData.address || "No especificada"} 
                    icon={MapPin} 
                    fullWidth 
                />
            </div>
            
            {/* Sección de contacto para el sidebar - solo en móviles */}
            <div className="block md:hidden mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-[#41023B] mb-3">Resumen de Contacto</h4>
                <div className="space-y-3">
                    <div className="flex items-center text-sm">
                        <Phone size={16} className="text-[#D7008A] mr-3 flex-shrink-0" />
                        <div>
                            <p className="text-gray-500 text-xs">Teléfono</p>
                            <p className="text-gray-800">{formData.countryCode} {formData.phoneNumber || "No especificado"}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start text-sm">
                        <MapPin size={16} className="text-[#D7008A] mr-3 mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-gray-500 text-xs">Dirección</p>
                            <p className="text-gray-800">{formData.address || "No especificada"}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center text-sm">
                        <Mail size={16} className="text-[#D7008A] mr-3 flex-shrink-0" />
                        <div>
                            <p className="text-gray-500 text-xs">Correo</p>
                            <p className="text-gray-800">{formData.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}