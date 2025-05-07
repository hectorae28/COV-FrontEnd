import { motion } from "framer-motion";
import { Briefcase, MapPin, Phone } from "lucide-react";
import InfoItem from "./InfoItem";

export default function LaboralSection({ formData }) {
    return (
        <motion.div
            key="laboral"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <h3 className="text-lg font-semibold text-[#41023B] mb-5">Situación Laboral</h3>
            
            {formData.workStatus === "noLabora" ? (
                <div className="p-4 bg-gray-50 rounded-xl text-center text-gray-600">
                    No se encuentra laborando actualmente.
                </div>
            ) : (
                <div className="space-y-6">
                    {(formData.laboralRegistros && formData.laboralRegistros.length > 0) ? (
                        formData.laboralRegistros.map((registro, index) => (
                            <div key={registro.id || index} className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                                <h4 className="font-medium text-[#41023B] mb-3">Institución {index + 1}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                    <InfoItem label="Nombre de Institución" value={registro.institutionName} icon={Briefcase} />
                                    <InfoItem label="Cargo" value={registro.cargo} />
                                    <InfoItem label="Dirección" value={registro.institutionAddress} icon={MapPin} fullWidth />
                                    <InfoItem label="Teléfono" value={registro.institutionPhone} icon={Phone} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <InfoItem label="Nombre de Institución" value={formData.institutionName} icon={Briefcase} />
                            <InfoItem label="Cargo" value={formData.cargo} />
                            <InfoItem label="Dirección" value={formData.institutionAddress} icon={MapPin} fullWidth />
                            <InfoItem label="Teléfono" value={formData.institutionPhone} icon={Phone} />
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}