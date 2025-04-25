"use client"

import { motion } from "framer-motion"

export default function ContactPage() {
  return (
    <div className="w-full px-4 md:px-10 py-10 md:py-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-8 md:mb-10 mt-16 md:mt-22"
      >
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
        >
          Sección Noticias
        </motion.h1>
        <motion.p
          className="mt-4 max-w-full mx-auto text-gray-600 text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Gestión de contenidos de la sección <span className="font-bold text-[#C40180]">Noticias</span> del sitio web del Colegio Odontológico de Venezuela
        </motion.p>
      </motion.div>

      {/* Basic Content Section */}
      <div className="w-full bg-white rounded-xl shadow-xl overflow-hidden p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Información de Contacto</h2>
        <div className="space-y-4 text-gray-600">
          <p>Aquí puedes encontrar toda la información de contacto del Colegio Odontológico de Venezuela.</p>
          <p>Para cualquier consulta, por favor utiliza los siguientes canales:</p>
          
          <div className="mt-6 space-y-3">
            <div>
              <h3 className="font-semibold text-gray-700">Teléfono:</h3>
              <p>+58 212-555-1234</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Email:</h3>
              <p>contacto@odontologico.org</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Dirección:</h3>
              <p>Av. Principal, Edificio Colegio Odontológico, Caracas, Venezuela</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}