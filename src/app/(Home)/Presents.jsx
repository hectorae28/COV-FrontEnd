"use client";

import Image from "next/image";
import { useState } from "react";
import CarruselPresents from "../Components/Home/CarruselPresents";

export default function Presents() {
    const [showWhatsappText, setShowWhatsappText] = useState(false);

    return (
        <div className="rounded-b-4xl bg-gradient-to-t from-[#D7008A] to-[#41023B] flex flex-col justify-center relative">
            {/* Instagram */}
            <div className="absolute top-0 right-18">
                <button className="flex items-center bg-transparent text-white/70 font-bold text-[12px] py-2 rounded-full transition-all duration-200 hover:text-white cursor-pointer">
                    <span className="mr-2">Síguenos en Instagram</span>
                    <Image
                        src="/assets/icons/instagram.png"
                        alt="Instagram"
                        width={24}
                        height={24}
                    />
                </button>
            </div>

            {/* Carrusel */}
            <CarruselPresents />

            {/* WhatsApp mejorado */}
            <div 
                className="fixed bottom-8 right-8 flex items-center cursor-pointer hover:opacity-90 transition-all duration-300 z-50"
                onMouseEnter={() => setShowWhatsappText(true)}
                onMouseLeave={() => setShowWhatsappText(false)}
            >
                {/* Texto del WhatsApp */}
                <div 
                    className={`bg-white text-[#590248] font-medium rounded-full mr-4 py-2 px-4 shadow-md transition-all duration-300 flex items-center ${
                        showWhatsappText ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                    style={{ transitionProperty: 'opacity, visibility' }}
                >
                    <span className="whitespace-nowrap">Contáctanos</span>
                </div>
                
                {/* Icono WhatsApp */}
                <div className="bg-gradient-to-br from-[#C40180] to-[#590248] rounded-full p-3 shadow-md border-2 border-white">
                    <Image
                        src="/assets/icons/whatsapp.png"
                        alt="WhatsApp"
                        width={32}
                        height={32}
                    />
                </div>
            </div>
        </div>
    );
}