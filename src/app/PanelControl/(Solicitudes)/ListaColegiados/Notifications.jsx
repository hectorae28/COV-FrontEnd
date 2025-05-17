import { motion } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

export default function Notifications({
    registroExitoso,
    setRegistroExitoso,
    aprobacionExitosa,
    setAprobacionExitosa
}) {
    return (
        <>
            {registroExitoso && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-100 text-green-800 p-4 rounded-md mb-6 flex items-start justify-between shadow-sm"
                >
                    <div className="flex items-center">
                        <CheckCircle size={20} className="mr-2 flex-shrink-0" />
                        <span>
                            El colegiado ha sido registrado exitosamente y está pendiente de
                            aprobación.
                        </span>
                    </div>
                    <button
                        onClick={() => setRegistroExitoso(false)}
                        className="text-green-700 hover:bg-green-200 p-1 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}

            {aprobacionExitosa && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-100 text-green-800 p-4 rounded-md mb-6 flex items-start justify-between shadow-sm"
                >
                    <div className="flex items-center">
                        <CheckCircle size={20} className="mr-2 flex-shrink-0" />
                        <span>
                            La solicitud ha sido aprobada exitosamente. El colegiado ha sido
                            registrado.
                        </span>
                    </div>
                    <button
                        onClick={() => setAprobacionExitosa(false)}
                        className="text-green-700 hover:bg-green-200 p-1 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}
        </>
    );
}