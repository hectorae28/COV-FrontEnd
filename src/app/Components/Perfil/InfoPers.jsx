import { motion } from "framer-motion";
import { User, Calendar } from "lucide-react";
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
                <InfoItem label="Nombre completo" value={`${formData.firstName} ${formData.secondName || ""} ${formData.firstLastName} ${formData.secondLastName || ""}`} icon={User} />
                <InfoItem label="Cédula" value={`${formData.idType}-${formData.identityCard}`} />
                <InfoItem label="Fecha de Nacimiento" value={formatDate(formData.birthDate)} icon={Calendar} />
                <InfoItem label="Género" value={formData.gender === "masculino" ? "Masculino" : formData.gender === "femenino" ? "Femenino" : formData.gender || "No especificado"} />
                <InfoItem label="Estado Civil" value={formData.maritalStatus === "soltero" ? "Soltero/a" : formData.maritalStatus === "casado" ? "Casado/a" : formData.maritalStatus === "divorciado" ? "Divorciado/a" : formData.maritalStatus === "viudo" ? "Viudo/a" : "No especificado"} />
                <InfoItem label="Nacionalidad" value={formData.nationality === "venezolana" ? "Venezolana" : formData.nationality === "extranjera" ? "Extranjera" : "No especificada"} />
            </div>
        </motion.div>
    );
}