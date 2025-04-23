import { fetchDatosAdicionales } from "@/api/endpoints/landingPage";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

const WhatsApp = () => {
  const [showWhatsappText, setShowWhatsappText] = useState(false);
  const [showInstagramText, setShowInstagramText] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("https://www.instagram.com/elcovorg");

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDatosAdicionales("?search=link_whatsapp");
      setWhatsappLink(data.data[0]);
    };
    loadData();
  }, []);

  const handleWhatsAppClick = () => {
    window.open(whatsappLink, "_blank");
  };

  const handleInstagramClick = () => {
    window.open(instagramLink, "_blank");
  };

  return (
    <>
      {/* Instagram Button - Desktop */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1.5,
        }}
        className="hidden lg:flex fixed bottom-24 right-8 items-center cursor-pointer hover:opacity-100 transition-all duration-300 z-50"
        onMouseEnter={() => setShowInstagramText(true)}
        onMouseLeave={() => setShowInstagramText(false)}
      >
        <AnimatePresence>
          {showInstagramText && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="bg-white text-black font-medium rounded-full mr-4 py-2 px-6 shadow-lg flex items-center"
            >
              <span className="whitespace-nowrap text-sm">
                Síguenos en Instagram
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <div
          onClick={handleInstagramClick}
          className="bg-gradient-to-br from-[#833AB4] to-[#C13584] rounded-full p-3 shadow-lg"
        >
          <Image
            src="/assets/icons/instagram.png"
            alt="Instagram"
            width={32}
            height={32}
            className="w-8 h-8 transition-transform duration-300 hover:rotate-12"
          />
        </div>
      </motion.div>

      {/* Instagram Button - Mobile */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1.5,
        }}
        className="lg:hidden fixed bottom-20 right-6 flex items-center cursor-pointer hover:opacity-100 transition-all duration-300 z-50"
      >
        <div
          onClick={handleInstagramClick}
          className="bg-gradient-to-br from-[#833AB4] to-[#C13584] rounded-full p-2.5 shadow-lg"
        >
          <Image
            src="/assets/icons/instagram.png"
            alt="Instagram"
            width={28}
            height={28}
            className="w-7 h-7 transition-transform duration-300 hover:rotate-12"
          />
        </div>
      </motion.div>

      {/* WhatsApp Button - Desktop */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1.5,
        }}
        className="hidden lg:flex fixed bottom-8 right-8 items-center cursor-pointer hover:opacity-100 transition-all duration-300 z-50"
        onMouseEnter={() => setShowWhatsappText(true)}
        onMouseLeave={() => setShowWhatsappText(false)}
      >
        <AnimatePresence>
          {showWhatsappText && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="bg-white text-black font-medium rounded-full mr-4 py-2 px-6 shadow-lg flex items-center"
            >
              <span className="whitespace-nowrap text-sm">
                ¿Necesitas ayuda?
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <div
          onClick={handleWhatsAppClick}
          className="bg-gradient-to-br from-[#0dbf43ff] to-[#008068ff] rounded-full p-3 shadow-lg"
        >
          <Image
            src="/assets/icons/whatsapp.png"
            alt="WhatsApp"
            width={32}
            height={32}
            className="w-8 h-8 transition-transform duration-300 hover:rotate-12"
          />
        </div>
      </motion.div>

      {/* WhatsApp Button - Mobile */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1.5,
        }}
        className="lg:hidden fixed bottom-6 right-6 flex items-center cursor-pointer hover:opacity-100 transition-all duration-300 z-50"
      >
        <div
          onClick={handleWhatsAppClick}
          className="bg-gradient-to-br from-[#0dbf43ff] to-[#008068ff] rounded-full p-2.5 shadow-lg"
        >
          <Image
            src="/assets/icons/whatsapp.png"
            alt="WhatsApp"
            width={28}
            height={28}
            className="w-7 h-7 transition-transform duration-300 hover:rotate-12"
          />
        </div>
      </motion.div>
    </>
  );
};

export default WhatsApp;