"use client"

import { motion } from "framer-motion"
import { Phone, MapPin, Clock, Award, GraduationCap, Sparkles } from "lucide-react"

export default function InfoSection({ direction, isClosing }) {
    return (
        <motion.div
            key="info-section"
            initial={{ opacity: 0 }}
            animate={{
                opacity: isClosing ? 0 : 1,
                x: direction === "left"
                    ? (isClosing ? 100 : 0)
                    : (isClosing ? -100 : 0)
            }}
            exit={{
                opacity: 0,
                x: direction === "left" ? 100 : -100
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`absolute ${direction === "left"
                    ? "right-[-200] pr-[5%] md:pr-[10%] lg:pr-[15%]"
                    : "left-[-200] pl-[5%] md:pl-[10%] lg:pl-[15%]"
                } top-0 bottom-0 w-[45%] md:w-[50%] lg:w-[60%] 
                hidden lg:flex flex-col justify-center items-center`}
        >
            <div className="w-full max-w-4xl space-y-6">
                {/* Professional Highlights */}
                <div className=" bg-gradient-to-br from-white to-gray-300 border border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-lg">
                    <div className="flex items-center mb-6">
                        <Award className="text-[#41023B] mr-4" size={28} />
                        <h3 className="text-3xl font-bold text-[#41023B]">Desarrollo Profesional</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        {[
                            {
                                icon: <GraduationCap className="text-[#41023B]" size={32} />,
                                title: "Actualización Continua",
                                description: "Programas de educación especializada para odontólogos."
                            },
                            {
                                icon: <Sparkles className="text-[#41023B]" size={32} />,
                                title: "Recursos Académicos",
                                description: "Acceso a publicaciones científicas exclusivas."
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="bg-white/10 rounded-2xl p-6 flex items-center space-x-5 border border-white/10 shadow-xl"
                                whileHover={{ 
                                    scale: 1.03,
                                    transition: { duration: 0.2 }
                                }}
                            >
                                {item.icon}
                                <div>
                                    <h4 className="text-xl font-semibold text-black mb-2">{item.title}</h4>
                                    <p className="text-gray-700">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Announcements */}
                <div className=" bg-gradient-to-br from-white to-gray-300 border border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-lg">
                    <div className="flex items-center mb-6">
                        <Sparkles className="text-[#41023B] mr-4" size={28} />
                        <h3 className="text-3xl font-bold text-[#41023B]">Próximos Eventos</h3>
                    </div>
                    <div className="space-y-6">
                        {[
                            {
                                title: "Jornada Científica 2024",
                                date: "15 Julio",
                                description: "Actualización en Odontología Estética.",
                            },
                            {
                                title: "Renovación de Credenciales",
                                date: "30 Agosto",
                                description: "Proceso anual de actualización.",
                            }
                        ].map((event, index) => (
                            <motion.div
                                key={index}
                                className="bg-white/10 rounded-2xl p-6 flex justify-between items-center border border-white/10 shadow-xl"
                                whileHover={{ 
                                    scale: 1.03,
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <div>
                                    <div className="flex items-center mb-2">
                                        <h4 className="text-xl font-semibold text-black mr-4">{event.title}</h4>
                                    </div>
                                    <p className="text-gray-700">{event.description}</p>
                                </div>
                                <div className="text-gray-700 font-medium">{event.date}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Contact Information */}
                <div className=" bg-gradient-to-br from-white to-gray-300 border border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-lg">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-3xl font-bold text-[#41023B] mb-6">Contáctanos</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: <Phone className="text-[#41023B]" size={24} />, text: "+58 (212) 555-1234" },
                                    { icon: <MapPin className="text-[#41023B]" size={24} />, text: "Av. Principal, Caracas" },
                                    { icon: <Clock className="text-[#41023B]" size={24} />, text: "Lun-Vie: 8:00 AM - 4:00 PM" }
                                ].map((contact, index) => (
                                    <div key={index} className="flex items-center space-x-4 text-black">
                                        {contact.icon}
                                        <span>{contact.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-[#41023B] mb-6">Síguenos</h3>
                            <div className="flex space-x-4">
                                {["facebook", "instagram", "twitter", "youtube"].map((platform) => (
                                    <motion.a
                                        key={platform}
                                        href="#"
                                        className="bg-[#41023B] p-3 rounded-full hover:bg-[#D7008A] transition-all"
                                        whileHover={{ 
                                            scale: 1.1,
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        <img 
                                            src={`/assets/icons/${platform}.png`} 
                                            alt={platform} 
                                            className="w-4 h-4"
                                        />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}