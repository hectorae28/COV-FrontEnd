"use client";
import { useState } from "react";
import AppBar from "@/app/Colegiado/Components/AppBar";
import Barra from "@/app/Colegiado/Components/Barra";

export default function DashboardLayout({
  children,
  solvencyInfo,
  isSolvent,
  userInfo,
  showSolvencyWarning,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-[#F9F9F9] min-h-screen flex relative">
      {/* Overlay para cerrar sidebar en móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - responsive */}
      <aside
        className={`
        w-72 bg-gradient-to-t from-[#D7008A] to-[#41023B] text-white 
        fixed h-screen overflow-y-auto z-50 shadow-xl transition-all duration-300
        ${sidebarOpen ? "left-0" : "-left-72"} 
        md:left-0
      `}
      >
        <AppBar solvencyInfo={solvencyInfo} />
      </aside>

      {/* Contenido principal - responsive */}
      <div
        className={`
        flex-1 flex flex-col min-h-screen 
        transition-all duration-300
        md:ml-72
      `}
      >
        <Barra
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          solvencyInfo={solvencyInfo}
          isSolvent={isSolvent}
          userInfo={userInfo}
          showSolvencyWarning={showSolvencyWarning}
        />
        <main className="flex-1 overflow-y-auto pt-20">
          <div className="max-w-7xl mx-auto flex flex-col gap-8 py-10 px-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
