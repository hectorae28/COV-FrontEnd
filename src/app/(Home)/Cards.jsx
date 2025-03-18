"use client";

import { motion } from 'framer-motion';
import { User, IdCard, SearchCheck, FileCheck } from 'lucide-react';

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
            scale: 1.06,
            transition: { duration: 0.2 }
        }}
        className="relative p-6 bg-white rounded-2xl hover:shadow-lg shadow-[#590248]/30 transition-all duration-300 border border-[#BFC8D0] cursor-pointer"
    >
        <div className="absolute -top-6 -left-6 w-12 h-12 text-[20px] bg-gradient-to-br from-[#C40180] to-[#590248] rounded-full flex items-center justify-center text-white font-bold shadow-md italic">
            {number}
        </div>

        <div className="mb-4 flex justify-between items-center">
            <h3 className="text-[18px] font-extrabold text-black italic w-full text-center">
                {title}
            </h3>
            <div className="w-18 h-16 bg-gradient-to-br from-[#C40180] to-[#590248] rounded-2xl flex items-center justify-center transform rotate-10">
                <Icon className="w-10 h-10 text-white" />
            </div>
        </div>

        <p className="text-[#646566] font-semibold text-[14px] text-center">
            {description}
        </p>

        <div className="absolute bottom-[-1] left-1/2 w-25/26 h-1 bg-gradient-to-r from-[#C40180] via-white to-[#590248] rounded-b-xl transform -translate-x-1/2" />
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

    const curvedTitleStyle = {
        fontStyle: 'italic',
        transform: 'perspective(500px) rotateX(10deg)',
        textShadow: '0 4px 5px rgba(0,0,0,0.1)',
        paddingBottom: '10px',
        display: 'inline-block'
    };

    return (
        <section className="pt-16">
            <div className="text-center">
                <h2
                    className="text-[48px] font-extrabold text-center bg-gradient-to-br from-blue-400 to-blue-600 text-transparent bg-clip-text italic inline-block"
                    style={curvedTitleStyle}
                >
                    Titulo
                </h2>
            </div>

            <div className="w-full px-26 mx-auto py-20">
                <div className="grid grid-cols-4 gap-14">
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
        </section>
    );
}