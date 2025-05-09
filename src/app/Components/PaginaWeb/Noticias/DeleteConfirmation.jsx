"use client"
import { motion } from "framer-motion"
import { Trash2 } from "lucide-react"

const DeleteConfirmation = ({ onDelete, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg p-6 max-w-lg mx-auto"
            >
                <div className="text-center mb-4">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">¿Eliminar esta oticia?</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        Esta acción no se puede deshacer. ¿Estás seguro de que deseas continuar?
                    </p>
                </div>
                <div className="flex justify-center gap-3 mt-5">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        Sí, Eliminar
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default DeleteConfirmation
