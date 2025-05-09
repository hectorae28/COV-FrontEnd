"use client"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Info, X } from "lucide-react"

const Notification = ({ message, type = "success", onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, 3000)

        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 right-4 z-50 shadow-lg rounded-lg px-4 py-3 flex items-center max-w-md ${type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : type === "error"
                        ? "bg-red-50 text-red-800 border border-red-200"
                        : "bg-blue-50 text-blue-800 border border-blue-200"
                }`}
        >
            {type === "success" && <Check className="w-5 h-5 mr-3 text-green-500" />}
            {type === "error" && <X className="w-5 h-5 mr-3 text-red-500" />}
            {type === "info" && <Info className="w-5 h-5 mr-3 text-blue-500" />}

            <p className="text-sm">{message}</p>

            <button onClick={onClose} className="ml-3 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    )
}

export default Notification
