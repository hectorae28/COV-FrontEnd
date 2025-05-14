import { motion } from "framer-motion";
import { Briefcase, MapPin, Phone } from "lucide-react";
import InfoItem from "./InfoItem";

export default function LaboralSection({ formData }) {
    // Determinar si tiene registros laborales o solo un trabajo
    const tieneRegistrosLaborales = formData.laboralRegistros && formData.laboralRegistros.length > 0;
    
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
                    {tieneRegistrosLaborales ? (
                        // Mostrar múltiples registros laborales
                        formData.laboralRegistros.map((registro, index) => (
                            <div key={registro.id || index} className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                                <h4 className="font-medium text-[#41023B] mb-3">Institución {index + 1}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                    <InfoItem 
                                        label="Nombre de Institución" 
                                        value={registro.institutionName || "No especificada"} 
                                        icon={Briefcase} 
                                    />
                                    <InfoItem 
                                        label="Cargo" 
                                        value={registro.cargo || "No especificado"} 
                                    />
                                    <InfoItem 
                                        label="Dirección" 
                                        value={registro.institutionAddress || "No especificada"} 
                                        icon={MapPin} 
                                        fullWidth 
                                    />
                                    <InfoItem 
                                        label="Teléfono" 
                                        value={registro.institutionPhone || "No especificado"} 
                                        icon={Phone} 
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        // Mostrar un único registro laboral
                        <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                            <h4 className="font-medium text-[#41023B] mb-3">Institución actual</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <InfoItem 
                                    label="Nombre de Institución" 
                                    value={formData.institutionName || "No especificada"} 
                                    icon={Briefcase} 
                                />
                                <InfoItem 
                                    label="Cargo" 
                                    value={formData.cargo || "No especificado"} 
                                />
                                <InfoItem 
                                    label="Dirección" 
                                    value={formData.institutionAddress || "No especificada"} 
                                    icon={MapPin} 
                                    fullWidth 
                                />
                                <InfoItem 
                                    label="Teléfono" 
                                    value={formData.institutionPhone || "No especificado"} 
                                    icon={Phone} 
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {/* Sección de información laboral para el sidebar - visible solo en móvil */}
            {formData.workStatus !== "noLabora" && (
                <div className="block md:hidden mt-8 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-[#41023B] mb-3">Resumen Laboral</h4>
                    <div className="space-y-3">
                        <div className="flex items-center text-sm">
                            <Briefcase size={16} className="text-[#D7008A] mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-gray-500 text-xs">Institución</p>
                                <p className="text-gray-800">
                                    {tieneRegistrosLaborales
                                        ? formData.laboralRegistros[0].institutionName || "No especificada"
                                        : formData.institutionName || "No especificada"}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center text-sm">
                            <div className="h-4 w-4 bg-[#D7008A] rounded-full flex items-center justify-center text-white text-xs mr-3 flex-shrink-0">
                                C
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Cargo</p>
                                <p className="text-gray-800">
                                    {tieneRegistrosLaborales
                                        ? formData.laboralRegistros[0].cargo || "No especificado"
                                        : formData.cargo || "No especificado"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}