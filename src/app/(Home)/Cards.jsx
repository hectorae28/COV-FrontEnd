"use client";

import { motion } from 'framer-motion';
import { User, SearchCheck, FileCheck, ChevronRight, ArrowRight } from 'lucide-react';

const StepCard = ({ icon: Icon, number, title, description, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: index * 0.1
            }
        }}
        viewport={{ once: true, amount: 0.3 }}
        whileHover={{
            scale: 1.03,
            transition: { duration: 0.2 }
        }}
        className="relative py-10 px-6 sm:px-8 md:px-12 bg-white rounded-xl shadow-md hover:shadow-xl shadow-[#590248]/30 transition-all duration-300 border-t-4 border-b-2 border-[#C40180] overflow-hidden group"
        >
        <div className="absolute text-[20px] top-4 left-4 w-10 h-10 bg-gradient-to-br from-[#C40180] to-[#590248] rounded-full flex items-center justify-center text-white font-bold shadow-md">
            {number}
        </div>

        <div className="mb-6 mt-4 flex justify-center items-center">
            <h3 className="text-xl font-bold text-[#590248] text-center mr-8">
                {title}
            </h3>
            <div className="w-18 h-14 bg-gradient-to-br from-[#C40180] to-[#590248] rounded-lg flex items-center justify-center transform rotate-10 shadow-lg">
                <Icon className="w-10 h-10 text-white" />
            </div>
        </div>

        <div className="text-[#646566] text-sm pl-2 min-h-[100px] font-semibold text-center">
            {description}
        </div>

        {/* Botón Ver más */}
        <motion.div
            className="flex items-center justify-end cursor-pointer text-[#C40180] font-medium text-sm mt-4"
            whileHover={{ x: 5 }}
        >
            Ver más <ChevronRight className="w-4 h-4 ml-1 inline" />
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C40180] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
);

export default function StepsSection() {
    const steps = [
        {
            icon: User,
            title: "Sistema Solicitudes",
            description: (
                <>
                    <br />
                    Inscripción de Odontólogos <br /> (Nuevos Colegiados)
                </>
            )
        },
        {
            icon: SearchCheck,
            title: "Sistema Buscador",
            description: (
                <>
                    <br />
                    Buscar colegiados agremiado por CI y N°COV (Sólo Odontólogos)
                </>
            )
        },
        {
            icon: FileCheck,
            title: "Verificar Documentos",
            description: (
                <>
                    <br />
                    Verificación de documentos digitales del COV
                </>
            )
        }
    ];

    return (
        <section className="py-10 bg-gradient-to-b from-white to-gray-50">
            <div className="text-center mb-12">
                <motion.span
                    className="text-sm font-medium text-[#C40180] uppercase tracking-wider"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    Servicios Digitales
                </motion.span>

                <motion.h2
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text px-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    Tu Carrera Profesional Comienza Aquí
                </motion.h2>

                <motion.p
                    className="mt-6 sm:mt-8 md:mt-10 max-w-2xl mx-auto text-gray-600 px-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    Forma parte del Colegio de Odontólogos de Venezuela y accede a todos nuestros
                    servicios digitales diseñados para impulsar tu desarrollo profesional.
                </motion.p>
            </div>

            <div className="max-w-6xl mx-auto px-10 sm:px-20 md:px-30 lg:px-22">
                {/* Responsive grid - 3 columns on lg+, 1 column on smaller screens */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
                    {steps.map((step, index) => (
                        <StepCard
                            key={index}
                            icon={step.icon}
                            number={index + 1}
                            title={step.title}
                            description={step.description}
                            index={index}
                        />
                    ))}
                </div>
            </div>

            <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
            >
                <button className="px-6 py-3 sm:px-8 cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 flex items-center mx-auto">
                    Ingresa Ahora
                    <ArrowRight className="w-5 h-5 ml-2" />
                </button>
            </motion.div>
        </section>
    );
}