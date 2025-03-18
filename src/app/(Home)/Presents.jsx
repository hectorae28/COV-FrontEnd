import Image from "next/image";
import CarruselPresents from "../Components/Home/CarruselPresents";

export default function Presents() {
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

            {/* WhatsApp */}
            <div className="fixed bottom-8 right-8 cursor-pointer hover:opacity-90 transition-opacity">
                <div className="block">
                    <Image
                        src="/assets/icons/whatsapp.png"
                        alt="WhatsApp"
                        width={48}
                        height={48}
                    />
                </div>
            </div>
        </div>
    );
}