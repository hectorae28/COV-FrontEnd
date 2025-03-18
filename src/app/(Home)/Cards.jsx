"use client";

import { motion } from 'framer-motion';
import { User, IdCard, SearchCheck, FileCheck, ChevronRight } from 'lucide-react';

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
        className="relative p-6 bg-white rounded-xl hover:shadow-xl shadow-[#590248]/20 transition-all duration-300 border-t-4 border-[#C40180] overflow-hidden group"
    >        
        <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-[#C40180] to-[#590248] rounded-full flex items-center justify-center text-white font-bold shadow-md">
            {number}
        </div>

        <div className="mb-6 mt-2 flex justify-between items-start">
            <h3 className="text-xl font-bold text-[#590248] pl-10">
                {title}
            </h3>
            <div className="w-14 h-14 bg-gradient-to-br from-[#C40180] to-[#590248] rounded-lg flex items-center justify-center transform rotate-3 shadow-lg">
                <Icon className="w-8 h-8 text-white" />
            </div>
        </div>

        <div className="text-[#646566] text-sm pl-2 min-h-[100px]">
            {description}
        </div>

        <motion.div 
            className="mt-4 flex items-center justify-end text-[#C40180] font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ x: 5 }}
        >
            Ver más <ChevronRight className="w-4 h-4 ml-1" />
        </motion.div>
        
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C40180] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
);

export default function StepsSection() {
    const steps = [
        {
            icon: User,
            title: "Sistema de Solicitudes",
            description: (
                <>
                    <br />
                    Inscripción de Odontólogos <br /> (Nuevos Colegiados)
                </>
            )
        },
        {
            icon: IdCard,
            title: "Sistema de Colegiados",
            description: (
                <>
                    <span className="font-normal">Para Odontólogos inscritos COV</span>
                    <ul className="list-disc list-inside">
                        <li>Actualización datos – Regístrate</li>
                        <li>Solicitudes Solvencia</li>
                        <li>Renovación Carnet Digital</li>
                        <li>Solicitudes, Documentos o Cartas Digital</li>
                    </ul>
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
        <section className="py-14 bg-gradient-to-b from-white to-gray-50">
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
                    className="text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    Tu Carrera Profesional Comienza Aquí
                </motion.h2>
                
                <motion.p 
                    className="mt-10 max-w-2xl mx-auto text-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    Forma parte del Colegio de Odontólogos de Venezuela y accede a todos nuestros 
                    servicios digitales diseñados para impulsar tu desarrollo profesional.
                </motion.p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
                className="mt-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
            >
                <button className="px-8 py-3 bg-gradient-to-r from-[#C40180] to-[#590248] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300">
                    Inscríbete Ahora
                </button>
            </motion.div>
        </section>
    );
}