import { motion } from "framer-motion";
import { AlertTriangle, Info, CheckCircle, XCircle, X } from "lucide-react";

// Tipos de modal: 'warning', 'info', 'success', 'danger'
export default function ModalConfirmation({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar", 
    cancelText = "Cancelar",
    type = "warning",     
    isLoading = false
}) {
    if (!isOpen) return null;
    
    // Detener propagación en el contenedor del modal
    const handleContainerClick = (e) => {
        e.stopPropagation();
    };
    
    // Mapeo de tipos a colores y iconos
    const modalConfig = {
        warning: {
            icon: AlertTriangle,
            bgColor: "bg-amber-50",
            iconColor: "text-amber-500",
            buttonColor: "bg-amber-500 hover:bg-amber-600",
        },
        info: {
            icon: Info,
            bgColor: "bg-blue-50",
            iconColor: "text-blue-500",
            buttonColor: "bg-blue-500 hover:bg-blue-600",
        },
        success: {
            icon: CheckCircle,
            bgColor: "bg-green-50",
            iconColor: "text-green-500",
            buttonColor: "bg-green-500 hover:bg-green-600",
        },
        danger: {
            icon: XCircle,
            bgColor: "bg-red-50",
            iconColor: "text-red-500",
            buttonColor: "bg-red-500 hover:bg-red-600",
        }
    };
    
    const { icon: ModalIcon, bgColor, iconColor, buttonColor } = modalConfig[type] || modalConfig.warning;
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
                onClick={handleContainerClick}
            >
                {/* Cabecera */}
                <div className={`${bgColor} px-6 py-4 flex items-start gap-4`}>
                    <div className={`${iconColor} flex-shrink-0`}>
                        <ModalIcon size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                        <p className="mt-2 text-sm text-gray-600">{message}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
                
                {/* Acciones */}
                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-sm"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 text-white rounded-md transition-colors text-sm ${buttonColor} disabled:opacity-50 flex items-center gap-2`}
                    >
                        {isLoading && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {confirmText}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}