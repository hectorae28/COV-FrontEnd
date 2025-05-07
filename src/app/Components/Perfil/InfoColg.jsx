import { motion } from "framer-motion";
import { GraduationCap, Calendar } from "lucide-react";
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
                <InfoItem label="Instituto de Bachillerato" value={formData.graduateInstitute || "No especificado"} />
                <InfoItem label="Universidad" value={formData.universityTitle} icon={GraduationCap} />
                <InfoItem label="Fecha de Graduación" value={formatDate(formData.titleIssuanceDate)} icon={Calendar} />
                <InfoItem label="Número de Colegiatura" value={`COV-${formData.mainRegistrationNumber}`} />
                <InfoItem label="Fecha de Registro Principal" value={formatDate(formData.mainRegistrationDate)} />
                <InfoItem label="Número de Registro M.P.P.S" value={formData.mppsRegistrationNumber || "No especificado"} />
                <InfoItem label="Fecha de Registro M.P.P.S" value={formatDate(formData.mppsRegistrationDate)} />
            </div>
        </motion.div>
    );
}