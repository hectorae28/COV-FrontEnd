import { motion } from "framer-motion";

export default function HeaderSection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-8 md:mb-10 mt-16 md:mt-22"
        >
            <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text p-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    delay: 0.2,
                    type: "spring",
                    stiffness: 100,
                }}
            >
                Lista de colegiados
            </motion.h1>
            <motion.p
                className="mt-4 max-w-full mx-auto text-gray-600 text-base md:text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
            >
                Administre los colegiados registrados y apruebe nuevas solicitudes
            </motion.p>
        </motion.div>
    );
}