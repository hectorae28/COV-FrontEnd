"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Description,
  EventNote,
  School,
  Forum,
  Inbox,
} from "@mui/icons-material";

export default function AppBar({ solvencyInfo }) {
  const [selectedItem, setSelectedItem] = useState("Solicitudes");
  const fechaExpiracion = new Date(solvencyInfo);
  const isSolvente = fechaExpiracion >= new Date();

  return (
    <div className="h-full w-full">
      {/* Logo */}
      <div className="p-4 sm:p-8">
        <Image
          src="/assets/logo.png"
          alt="Colegio de Odontólogos de Venezuela"
          width={220}
          height={80}
          className="mx-auto"
        />
      </div>

      {/* Separador */}
      <div className="border-t border-gray-300/40 w-11/12 mx-auto"></div>

      {/* Menú */}
      <nav className="mt-6 space-y-6">
        <SidebarItem
          icon={<Description className="h-5 w-5" />}
          text="Solicitudes"
          active={selectedItem === "Solicitudes"}
          onClick={() => setSelectedItem("Solicitudes")}
        />
        <Divider />
        <SidebarItem
          icon={<EventNote className="h-5 w-5" />}
          text="Eventos"
          active={selectedItem === "Eventos"}
          onClick={() => setSelectedItem("Eventos")}
        />
        <Divider />
        <SidebarItem
          icon={<School className="h-5 w-5" />}
          text="Cursos"
          active={selectedItem === "Cursos"}
          onClick={() => setSelectedItem("Cursos")}
        />
        <Divider />
        <SidebarItem
          icon={<Forum className="h-5 w-5" />}
          text="Notificaciones"
          active={selectedItem === "Notificaciones"}
          onClick={() => setSelectedItem("Notificaciones")}
        />
        <Divider />
        <SidebarItem
          icon={<Inbox className="h-5 w-5" />}
          text="Bandeja"
          active={selectedItem === "Bandeja"}
          onClick={() => setSelectedItem("Bandeja")}
        />
        <Divider />

        {/* Ítem de Solvencia (solo visible en md, sm y móviles) */}
        <div className="my-4 w-5/6 mx-auto px-4 py-3 bg-white/5 rounded-lg md:block md:hidden lg:hidden">
          <div className="flex items-center">
            <div className="flex flex-col">
              <span className="text-md text-gray-300 mb-2">Estado:</span>
              <span className="text-[16px] font-semibold text-white">
                <span
                  className={isSolvente ? "text-green-400" : "text-red-400"}
                >
                  {isSolvente ? "Solvente" : "No Solvente"}
                </span>{" "}
                hasta: {solvencyInfo}
              </span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

function SidebarItem({ icon, text, active, onClick }) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center px-4 py-2 rounded-lg mx-auto transition-colors w-4/5 ${
        active
          ? "bg-gray-200 text-[#41023B] font-bold"
          : "bg-transparent text-white/60 hover:bg-[#41023B] hover:text-white"
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span className="whitespace-nowrap">{text}</span>
    </a>
  );
}

function Divider() {
  return <div className="border-t border-gray-300/40 w-4/5 mx-auto"></div>;
}
