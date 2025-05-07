import { motion } from "framer-motion";
import { GraduationCap, Calendar, Hash } from "lucide-react";
import InfoItem from "./InfoItem";

export default function ColegiadoSection({ formData }) {
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

    return (
        <motion.div
            key="colegiado"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <h3 className="text-lg font-semibold text-[#41023B] mb-5">Información Profesional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InfoItem 
                    label="Instituto de Bachillerato" 
                    value={formData.graduateInstitute || "No especificado"} 
                />
                <InfoItem 
                    label="Universidad" 
                    value={formData.universityTitle || "No especificada"} 
                    icon={GraduationCap} 
                />
                <InfoItem 
                    label="Fecha de Graduación" 
                    value={formatDate(formData.titleIssuanceDate)} 
                    icon={Calendar} 
                />
                <InfoItem 
                    label="Número de Colegiatura" 
                    value={formData.mainRegistrationNumber ? `COV-${formData.mainRegistrationNumber}` : "No especificado"} 
                    icon={Hash}
                />
                <InfoItem 
                    label="Fecha de Registro Principal" 
                    value={formatDate(formData.mainRegistrationDate)} 
                    icon={Calendar}
                />
                <InfoItem 
                    label="Número de Registro M.P.P.S" 
                    value={formData.mppsRegistrationNumber || "No especificado"} 
                    icon={Hash}
                />
                <InfoItem 
                    label="Fecha de Registro M.P.P.S" 
                    value={formatDate(formData.mppsRegistrationDate)} 
                    icon={Calendar}
                />
            </div>
            
            {/* Sección de información profesional para el sidebar - visible solo en móvil */}
            <div className="block md:hidden mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-[#41023B] mb-3">Resumen Profesional</h4>
                <div className="space-y-3">
                    <div className="flex items-center text-sm">
                        <GraduationCap size={16} className="text-[#D7008A] mr-3 flex-shrink-0" />
                        <div>
                            <p className="text-gray-500 text-xs">Universidad</p>
                            <p className="text-gray-800">{formData.universityTitle || "No especificada"}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center text-sm">
                        <Calendar size={16} className="text-[#D7008A] mr-3 flex-shrink-0" />
                        <div>
                            <p className="text-gray-500 text-xs">Graduación</p>
                            <p className="text-gray-800">{formatDate(formData.titleIssuanceDate)}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center text-sm">
                        <Hash size={16} className="text-[#D7008A] mr-3 flex-shrink-0" />
                        <div>
                            <p className="text-gray-500 text-xs">Colegiatura</p>
                            <p className="text-gray-800">
                                {formData.mainRegistrationNumber ? `COV-${formData.mainRegistrationNumber}` : "No especificado"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}