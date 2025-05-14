import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import InfoItem from "./InfoItem";

// Componente para mostrar la bandera según el código de país
function BanderaComponent({ countryCode }) {
    // Convierte el código ISO (e.g. "VE") a sus puntos de código regionales
    const base = 0x1F1E6; // punto de código de 'A'
    const [first, second] = countryCode
        .toUpperCase()
        .split('')
        .map(ch => base + (ch.charCodeAt(0) - 65));
    return String.fromCodePoint(first, second); // e.g. "🇻🇪"
}

export default function ContactSection({ formData }) {
    // Formatear el estado y ciudad con la primera letra en mayúscula
    const formatLocation = (text) => {
        if (!text) return "No especificado";
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    // Obtener el código de país para la bandera
    const getCountryCode = (countryCode) => {
        // Extraer el código de país del código telefónico (asumiendo formatos como +58 para Venezuela)
        // Esta es una implementación simple que podría necesitar ajustes según tus códigos de país
        const codeMap = {
            "+58": "VE", // Venezuela
            "+57": "CO", // Colombia
            "+1": "US",  // Estados Unidos
            "+34": "ES", // España
            // Añadir más según sea necesario
        };

        // Devuelve el código de país si está mapeado, o un valor predeterminado
        return codeMap[countryCode] || "VE"; // VE como valor predeterminado para Venezuela
    };

    // Formatea el teléfono móvil para incluir la bandera
    const formatMobilePhone = () => {
        if (!formData.phoneNumber) return "No especificado";
        const countryCode = formData.countryCode || "+58";
        const countryISOCode = getCountryCode(countryCode);
        return (
            <span className="flex items-center">
                <span className="mr-2">{BanderaComponent({ countryCode: countryISOCode })}</span>
                {countryCode} {formData.phoneNumber}
            </span>
        );
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
                {/* Correo Electrónico en una línea completa */}
                <InfoItem
                    label="Correo Electrónico"
                    value={formData.email || "No especificado"}
                    icon={Mail}
                    fullWidth
                />

                {/* Teléfono Móvil con bandera */}
                <InfoItem
                    label="Teléfono Móvil"
                    value={formatMobilePhone()}
                    icon={Phone}
                />

                {/* Teléfono de Habitación */}
                <InfoItem
                    label="Teléfono de Habitación"
                    value={formData.homePhone || "No especificado"}
                    icon={Phone}
                />

                {/* Estado */}
                <InfoItem
                    label="Estado"
                    value={formatLocation(formData.state)}
                    icon={MapPin}
                />

                {/* Ciudad */}
                <InfoItem
                    label="Ciudad"
                    value={formatLocation(formData.city)}
                />

                {/* Dirección en línea completa */}
                <InfoItem
                    label="Dirección"
                    value={formData.address || "No especificada"}
                    icon={MapPin}
                    fullWidth
                />
            </div>
        </motion.div>
    );
}