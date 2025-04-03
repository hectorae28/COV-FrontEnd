"use client"
import { motion } from "framer-motion"
import { Clock, Phone, Mail, MapPin } from "lucide-react"

/**
 * EmailSection Component
 * Displays a list of contact email addresses with descriptions
 */
const EmailSection = () => {
  const emails = [
    { email: "secretariapresidencia@elcov.org", description: "Secretaría de Presidencia" },
    { email: "secretariafinanzas@elcov.org", description: "Secretaría de Finanzas" },
    { email: "secretariaorganizacion@elcov.org", description: "Secretaría de Organización" },
    { email: "soporteweb@elcov.org", description: "Soporte de Sistemas COV Web" }
  ];
  
  return (
    <div className="rounded-lg shadow-md overflow-hidden h-full">
      <div className="p-4 bg-white">
        <div className="flex items-center mb-4">
          <motion.div
            className="flex items-center justify-center p-2 rounded-lg text-white bg-gradient-to-br from-[#C40180] to-[#590248] shadow-md w-10 h-10 mr-3 flex-shrink-0"
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <Mail className="w-5 h-5" />
          </motion.div>
          <h3 className="text-lg font-bold text-black">Correos Electrónicos</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {emails.map((item, index) => (
            <div key={index} className="flex items-center bg-gradient-to-r from-[#C40180]/5 to-[#590248]/5 p-3 rounded-lg">
              <div>
                <p className="text-xs font-semibold text-gray-800">{item.description}</p>
                <a
                  href={`mailto:${item.email}`}
                  className="text-[#C40180] hover:text-[#590248] transition-colors duration-300 text-sm break-all"
                >
                  {item.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Gradient border */}
      <div className="h-1 bg-gradient-to-r from-[#C40180] to-[#590248]"></div>
    </div>
  );
};

/**
 * HoursAndPhonesSection Component
 * Displays business hours and contact phone numbers
 */
const HoursAndPhonesSection = () => {
  return (
    <div className="rounded-lg shadow-md overflow-hidden h-full">
      <div className="p-4 bg-white">
        <div className="flex items-center mb-4">
          <motion.div
            className="flex items-center justify-center p-2 rounded-lg text-white bg-gradient-to-br from-[#C40180] to-[#590248] shadow-md w-10 h-10 mr-3 flex-shrink-0"
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <Clock className="w-5 h-5" />
          </motion.div>
          <h3 className="text-lg font-bold text-black">Información de Contacto</h3>
        </div>
        
        {/* Business Hours */}
        <div className="mb-6 bg-gradient-to-r from-[#C40180]/5 to-[#590248]/5 p-3 rounded-lg">
          <p className="text-sm font-semibold text-black mb-1">Horario de Atención:</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="font-medium">Lunes a Viernes</span>
            <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold shadow-sm inline-block">
              09:00 AM - 03:00 PM
            </span>
          </div>
        </div>
        
        {/* Phone Numbers */}
        <div>
          <p className="text-sm font-semibold text-black mb-2">Teléfonos:</p>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center bg-gradient-to-r from-[#C40180]/5 to-[#590248]/5 p-3 rounded-lg">
              <Phone className="w-5 h-5 text-[#C40180] mr-3 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-800">FINANZAS</p>
                <p className="font-medium text-black">(0212) 793-56 87</p>
              </div>
            </div>
            <div className="flex items-center bg-gradient-to-r from-[#C40180]/5 to-[#590248]/5 p-3 rounded-lg">
              <Phone className="w-5 h-5 text-[#C40180] mr-3 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-800">PRESIDENCIA</p>
                <p className="font-medium text-black">(0212) 781-22 67</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Gradient border */}
      <div className="h-1 bg-gradient-to-r from-[#C40180] to-[#590248] md:mt-6"></div>
    </div>
  );
};

/**
 * LocationSection Component
 * Displays the organization's address and location map
 */
const LocationSection = () => {
  // Google Maps coordinates
  const latitude = "10.50767";
  const longitude = "-66.88259";
  
  return (
    <div className="rounded-lg shadow-md overflow-hidden h-full">
      <div className="p-4 bg-white">
        <div className="flex items-center mb-4">
          <motion.div
            className="flex items-center justify-center p-2 rounded-lg text-white bg-gradient-to-br from-[#C40180] to-[#590248] shadow-md transition-all duration-300 ease-out w-10 h-10 mr-3 flex-shrink-0"
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <MapPin className="w-5 h-5" />
          </motion.div>
          <h3 className="text-lg font-bold text-black">Dirección</h3>
        </div>
        
        <p className="text-gray-800 mb-4">
          Urb. Las Palmas, Calle el Pasaje, Edif. Colegio de Odontólogos. Caracas, Venezuela
        </p>
        
        {/* Map container */}
        <div className="rounded-lg overflow-hidden h-[300px] md:h-[400px] bg-gray-200">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.0064611371!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDMwJzI3LjYiTiA2NsKwNTInNTcuMyJX!5e0!3m2!1ses!2sve!4v1620000000000!5m2!1ses!2sve`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación del Colegio de Odontólogos"
          ></iframe>
        </div>
      </div>
      {/* Gradient border */}
      <div className="h-1 bg-gradient-to-r from-[#C40180] to-[#590248]"></div>
    </div>
  );
};

/**
 * Contactenos Page Component
 * Main contact page with information, email addresses, and location map
 */
export default function Contactenos() {
  return (
    <div className="flex flex-col mt-12 lg:mt-20">
      <main className="container mx-auto px-4 py-12 md:py-20 flex-grow">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-16 relative z-20"
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-4xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          >
            Contáctenos
          </motion.h1>
          <motion.p
            className="mt-4 md:mt-6 max-w-7xl mx-auto text-gray-800 text-base md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Estamos aquí para atenderle. No dude en comunicarse con nosotros a través de cualquiera de nuestros canales de contacto.
          </motion.p>
        </motion.div>

        {/* Contact Information Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto"
        >
          {/* Consistent 2-column grid layout for all cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-1"
            >
              <HoursAndPhonesSection />
            </motion.div>
            
            {/* Email Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-1"
            >
              <EmailSection />
            </motion.div>
            
            {/* Location Card - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="col-span-1 md:col-span-2"
            >
              <LocationSection />
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
