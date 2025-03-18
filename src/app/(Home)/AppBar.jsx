"use client";

import Image from "next/image";

export default function AppBar() {
  return (
    <header className="bg-[#41023B] w-full">
      <div className="py-4 flex items-center justify-between px-4 w-full">

        {/* Logo  */}
        <div className="flex items-center ml-12 mt-8 cursor-pointer">
          <Image
            src="/assets/logo.png"
            alt="logos"
            width={260}
            height={60}
          />
        </div>

        {/* Títulos */}
        <nav className="flex-grow flex items-center justify-center space-x-14 mt-8">
          {["Inicio", "Sobre COV", "Nueva Ley", "Especialistas", "Eventos", "Trámites", "Contáctenos"].map((item, index) => (
            <span
              key={index}
              className="text-white/70 font-bold text-[16px] cursor-pointer hover:text-white transition-colors duration-200"
            >
              {item}
            </span>
          ))}
        </nav>

        {/* Botón Trámites */}
        <div className="flex items-center px-12 mt-8">
          <div
            className="bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-600 text-white font-bold text-[18px] py-2 px-8 rounded-full cursor-pointer transition-all duration-200"
          >
            Trámites Online
          </div>
        </div>
      </div>
    </header>
  );
}