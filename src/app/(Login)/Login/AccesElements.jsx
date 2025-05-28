"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Clock } from "lucide-react";

export default function AccesElements() {
  return (
    <div className="relative z-10 h-full flex flex-col justify-between p-8 lg:p-12">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-[#D7008A]/20 to-[#41023B]/10 blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-gradient-to-tl from-[#41023B]/20 to-[#D7008A]/10 blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-center h-full">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Bienvenido al Portal COV
          </h2>
          <p className="text-xl text-white/90 leading-relaxed">
            Plataforma oficial del Colegio de Odontólogos de Venezuela para 
            la gestión de servicios profesionales y administrativos.
          </p>
        </motion.div>

        {/* Information Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6 mb-12"
        >
          {/* Card 1 - Servicios */}
          <motion.div
            className="relative overflow-hidden rounded-xl group cursor-pointer"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/30 rounded-xl"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-[#D7008A]/30 to-[#41023B]/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            
            <div className="relative p-6 z-10">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#D7008A] to-[#41023B] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Servicios Profesionales</h3>
                  <p className="text-white/80 text-sm">
                    Accede a certificaciones, constancias y documentos oficiales del COV.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2 - Actualización */}
          <motion.div
            className="relative overflow-hidden rounded-xl group cursor-pointer"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/30 rounded-xl"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-[#41023B]/30 to-[#D7008A]/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            
            <div className="relative p-6 z-10">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#41023B] to-[#D7008A] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Actualización de Datos</h3>
                  <p className="text-white/80 text-sm">
                    Mantén tu información profesional actualizada en nuestros registros.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3 - Comunicación */}
          <motion.div
            className="relative overflow-hidden rounded-xl group cursor-pointer"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/30 rounded-xl"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-[#D7008A]/30 to-[#41023B]/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            
            <div className="relative p-6 z-10">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#D7008A] to-[#41023B] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Comunicación Directa</h3>
                  <p className="text-white/80 text-sm">
                    Recibe notificaciones importantes y mantente conectado con el COV.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">Información de Contacto</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-white">
              <Phone className="text-[#D7008A]" size={20} />
              
              <a  href="tel:+582127812267"
                className="hover:text-[#D7008A] transition-all"
              >
                (0212) 781-22 67
              </a>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <MapPin className="text-[#D7008A]" size={20} />
              
              <a  href="https://maps.app.goo.gl/sj999zBBXoV4ouV39"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D7008A] transition-all"
              >
                Dirección en Google Maps
              </a>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <Clock className="text-[#D7008A]" size={20} />
              <span>Lun-Vie: 8:00 AM - 4:00 PM</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative z-10 mt-8"
      >
        {/* Social Media */}
        <div className="flex justify-center items-center space-x-6 mb-6">
          
          <a  href="https://wa.me/584149165829"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            <Image
              src="/assets/icons/whatsapp.png"
              alt="WhatsApp"
              width={24}
              height={24}
            />
          </a>
          
          <a  href="https://www.instagram.com/elcovorg?igsh=Z2k0cGRjY3V3OTAw"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            <Image
              src="/assets/icons/instagram.png"
              alt="Instagram"
              width={24}
              height={24}
            />
          </a>
          
           <a href="https://www.facebook.com/elcovorg"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            <Image
              src="/assets/icons/facebook.png"
              alt="Facebook"
              width={24}
              height={24}
            />
          </a>
          
          <a  href="https://www.youtube.com/@elcovorg"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            <Image
              src="/assets/icons/youtube.png"
              alt="Youtube"
              width={28}
              height={24}
            />
          </a>
          
          <a  href="https://x.com/elcovorg"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            <Image
              src="/assets/icons/twitter.png"
              alt="Twitter"
              width={24}
              height={24}
            />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-center text-white/80 text-sm">
          © {new Date().getFullYear()} Colegio de Odontólogos de Venezuela J-00041277-4
        </p>
      </motion.div>
    </div>
  );
}