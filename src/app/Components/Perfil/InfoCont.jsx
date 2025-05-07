import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import InfoItem from "./InfoItem";

export default function ContactSection({ formData }) {
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
                <InfoItem label="Correo Electrónico" value={formData.email} icon={Mail} />
                <InfoItem label="Teléfono Móvil" value={`${formData.countryCode} ${formData.phoneNumber}`} icon={Phone} />
                <InfoItem label="Teléfono de Habitación" value={formData.homePhone || "No especificado"} />
                <InfoItem label="Estado" value={formData.state || "No especificado"} />
                <InfoItem label="Ciudad" value={formData.city || "No especificado"} />
                <InfoItem label="Dirección" value={formData.address} icon={MapPin} fullWidth />
            </div>
        </motion.div>
    );
}