// Componente Modal.jsx actualizado con botón guardar centralizado

import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = "max-w-2xl",
  onSave,  // Nueva prop para manejar el guardado
  isSaveDisabled = false,  // Opcional para deshabilitar el botón
  saveLabel = "Guardar cambios"  // Personalización del texto del botón
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-lg shadow-xl w-full ${maxWidth} overflow-auto max-h-[90vh]`}
            >
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {children}
                </div>

                {/* Botón guardar centralizado - solo aparece si se proporciona onSave */}
                {onSave && (
                    <div className="flex justify-end gap-3 p-4 border-t mt-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onSave}
                            disabled={isSaveDisabled}
                            className={`cursor-pointer flex items-center px-5 py-2.5 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white
                                rounded-xl text-base font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-colors
                                ${isSaveDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {saveLabel}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}