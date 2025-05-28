"use client"
import { motion } from "framer-motion";
import { Award, Clock, GraduationCap, MapPin, Phone, Sparkles } from "lucide-react";

export default function InfoSection({ direction, isClosing }) {
    // Social media links
    const socialLinks = {
        whatsapp: "https://wa.me/584149165829",
        instagram: "https://www.instagram.com/elcovorg?igsh=Z2k0cGRjY3V3OTAw",
        facebook: "https://www.facebook.com/elcovorg",
        youtube: "https://www.youtube.com/@elcovorg",
        twitter: "https://x.com/elcovorg"
    };

    return (
        
            <div className="w-full max-w-4xl space-y-6">
                {/* Professional Highlights */}
                <div className=" bg-gradient-to-br from-white to-gray-300 border border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-lg">
                    <div className="flex items-center mb-6">
                        <Award className="text-[#41023B] mr-4" size={28} />
                        <h3 className="text-xl font-bold text-[#41023B]">Desarrollo Profesional</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        {[
                            {
                                icon: <GraduationCap className="text-[#41023B] group-hover:text-white transition-colors" size={32} />,
                                title: "Actualización Continua",
                                description: "Programas de educación especializada para odontólogos."
                            },
                            {
                                icon: <Sparkles className="text-[#41023B] group-hover:text-white transition-colors" size={32} />,
                                title: "Recursos Académicos",
                                description: "Acceso a publicaciones científicas exclusivas."
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="group bg-white/10 rounded-2xl p-2 flex items-center space-x-5 border border-white/10 shadow-xl"
                                whileHover={{
                                    scale: 1.03,
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <div className="group-hover:text-white transition-colors">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-black mb-2 group-hover:text-white transition-colors">{item.title}</h4>
                                    <p className="text-gray-700 group-hover:text-white transition-colors">{item.description}</p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#D7008A] to-[#41023B] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Announcements */}
                <div className=" bg-gradient-to-br from-white to-gray-300 border border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-lg">
                    <div className="flex items-center mb-6">
                        <Sparkles className="text-[#41023B] mr-4" size={28} />
                        <h3 className="text-xl font-bold text-[#41023B]">Próximos Eventos</h3>
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
                                className="group bg-white/10 rounded-2xl p-2 flex justify-between items-center border border-white/10 shadow-xl relative overflow-hidden"
                                whileHover={{
                                    scale: 1.03,
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <div>
                                    <div className="flex items-center mb-2">
                                        <h4 className="text-xl font-semibold text-black mr-4 group-hover:text-white transition-colors">{event.title}</h4>
                                    </div>
                                    <p className="text-gray-700 group-hover:text-white transition-colors">{event.description}</p>
                                </div>
                                <div className="text-gray-700 font-medium group-hover:text-white transition-colors">{event.date}</div>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#D7008A] to-[#41023B] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Contact Information */}
                <div className=" bg-gradient-to-br from-white to-gray-300 border border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-lg">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-[#41023B] mb-6">Contáctanos</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: <Phone className="text-[#41023B]" size={24} />, text: "(0212) 781-22 67" },
                                    {
                                        icon: <MapPin className="text-[#41023B]" size={24} />,
                                        text: <a
                                            href="https://maps.app.goo.gl/sj999zBBXoV4ouV39"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-[#D7008A] transition-all"
                                        >
                                            Direccion en Google Maps
                                        </a>
                                    },
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
                            <h3 className="text-xl font-bold text-[#41023B] mb-6">Síguenos</h3>
                            <div className="flex space-x-4">
                                {Object.entries(socialLinks).map(([platform, url]) => (
                                    <motion.a
                                        key={platform}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-gradient-to-r from-[#D7008A] to-[#41023B] p-3 rounded-full transition-all"
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
        
    )
}
