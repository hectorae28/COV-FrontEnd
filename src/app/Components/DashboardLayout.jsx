"use client";
import AppBar from "@/app/(Colegiado)/AppBar";
import Barra from "@/app/(Colegiado)/Barra";
import { useState } from "react";
import useColegiadoUserStore from "@/store/colegiadoUserStore";

export default function DashboardLayout({
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const colegiadoUser = useColegiadoUserStore((state) => state.colegiadoUser);
  const checkSolvencyStatus = () => {
    if (!colegiadoUser) return;
    
    const today = new Date();
    const [year, month, day] = colegiadoUser.solvente.split("-").map(Number);
    const solvencyDate = new Date(year, month - 1, day);

    const warningDate = new Date(solvencyDate);
    warningDate.setDate(warningDate.getDate() - 14);

    return today >= warningDate;
  };


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
        <AppBar/>
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
          isSolvent={colegiadoUser?.solvencia_status}
          userInfo={colegiadoUser}
          showSolvencyWarning={()=>checkSolvencyStatus()}
        />
        <main className="flex-1 overflow-y-auto pt-20">
          <div className="max-w-8xl mx-auto flex flex-col gap-8 px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
