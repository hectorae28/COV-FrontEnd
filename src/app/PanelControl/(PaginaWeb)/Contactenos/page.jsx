"use client";

import { motion } from "framer-motion";
import ContactenosDashboard from "../../../Components/Contactenos/ContactenosDashboard";

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
          transition={{
            duration: 0.8,
            delay: 0.2,
            type: "spring",
            stiffness: 100,
          }}
        >
          Sección Contactanos
        </motion.h1>
        <motion.p
          className="mt-4 max-w-full mx-auto text-gray-600 text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Gestión de contenidos de la sección{" "}
          <span className="font-bold text-[#C40180]">Contactanos</span> del
          sitio web del Colegio Odontológico de Venezuela
        </motion.p>
      </motion.div>

      {/* Dashboard Content */}
      <ContactenosDashboard />
    </div>
  );
}
