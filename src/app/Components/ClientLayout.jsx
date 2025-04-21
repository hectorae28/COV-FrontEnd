"use client";

import { Montserrat } from "next/font/google";
import { useState } from "react";
import AppBar from "../PanelControl/Components/AppBar";
import Barra from "../PanelControl/Components/Barra";
import "../globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export default function ClientLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState({
    title: "Inicio",
    icon: null,
  });

  return (
    <div lang="es-ES">
      <div className="antialiased">
        <div className="bg-[#F9F9F9] h-screen flex-1 relative overflow-hidden">
          {/* Overlay para cerrar sidebar en móvil */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          {/* Sidebar - responsive */}
          <aside
            className={`w-72 bg-gradient-to-t from-[#D7008A] to-[#41023B] text-white fixed h-screen overflow-y-auto z-50 shadow-xl transition-all duration-300 ${
              sidebarOpen ? "left-0" : "-left-72"
            } lg:left-0`}
          >
            <AppBar
              setSelectedTitle={setSelectedTitle}
              setSidebarOpen={setSidebarOpen}
            />
          </aside>

          {/* Contenido principal - responsive */}
          <div
            className={`flex-1 flex flex-col h-screen transition-all duration-300 lg:ml-72`}
          >
            <Barra
              onMenuClick={() => setSidebarOpen(!sidebarOpen)}
              title={selectedTitle.title}
              icon={selectedTitle.icon}
              setSelectedTitle={setSelectedTitle}
            />

            {/* Contenedor principal */}
            <main className="overflow-y-auto">
              <div className="">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
