"use client"
import RegistrationForm from "@/app/(Registro)/Registro/page"
import { X } from "lucide-react"
import { useEffect } from "react"

export default function RegistroModal({ onClose, onRegistroExitoso, isAdmin = true }) {
  console.log("RegistroModal mounted with props:", { onClose: !!onClose, onRegistroExitoso: !!onRegistroExitoso, isAdmin })

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Handler personalizado para el éxito del registro
  const handleRegistroExitoso = () => {
    if (onRegistroExitoso) {
      onRegistroExitoso()
    }
    // Cerrar el modal automáticamente después del registro exitoso
    setTimeout(() => onClose(), 2000)
  }

  // Handler para cerrar el modal
  const handleClose = () => {
    console.log("Cerrando modal")
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay que cierra el modal al hacer clic fuera */}
      <div
        className="absolute inset-0 z-10"
        onClick={handleClose}
      />

      {/* Contenido del modal */}
      <div className="relative z-20 bg-gradient-to-b from-[#41023B] to-[#D7008A] rounded-2xl shadow-xl w-full h-full max-w-none max-h-none overflow-hidden backdrop-blur-sm">
        {/* Botón de cerrar - Posicionado correctamente */}
        <button
          onClick={handleClose}
          className="absolute top-8 right-8 z-30 text-gray-800 hover:text-[#D7008A] transition-colors bg-white rounded-full p-2 shadow-lg hover:shadow-xl border border-gray-200"
          title="Cerrar"
        >
          <X size={20} />
        </button>

        {/* Componente de registro completo */}
        <div className="w-full h-full overflow-auto relative z-20">
          <RegistrationForm
            onRegistroExitoso={handleRegistroExitoso}
            isAdmin={isAdmin}
            isModal={true}
          />
        </div>
      </div>
    </div>
  )
}