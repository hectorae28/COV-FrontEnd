"use client";

import { useEffect, useState } from "react";
import "../globals.css";
import AppBar from "./Components/AppBar";
import Barra from "./Components/Barra";
import Cards from "./Components/Cards";
import Carnet from "./Components/Carnet";
import Tabla from "./Components/Tabla";
import Chat from "./Components/Chat";
import { useSession } from "next-auth/react";
import { fetchMe } from "@/api/endpoints/colegiado";

export default function Colegiado() {
  // useRoleGuard(["Colegiados"]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInfo, setUser_info] = useState(null);
  const { data: session, status } = useSession();
  const solvencyInfo = "12/12/2025"; // Fecha de solvencia
  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      fetchMe(session)
        .then((response) => setUser_info(response.data))
        .catch((error) => console.log(error));
    }
  }, [session, status]);
  if (status === "loading") {
    return <div>Loading...</div>;
  }
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
          userInfo={userInfo}
        />

        <main className="flex-1 overflow-y-auto pt-20">
          <div className="max-w-7xl mx-auto flex flex-col gap-8 py-10 px-4">
            {/* Sección principal con Cards y Carnet - responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12 gap-8">
              {/* Sección de tarjetas (8/12 del ancho en xl, distribución variable en otros tamaños) */}
              <div className="md:col-span-2 lg:col-span-2 xl:col-span-8 flex items-center">
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm h-full w-full">
                  <Cards />
                </div>
              </div>

              {/* Sección de carnet (4/12 del ancho en xl) */}
              <div className="md:col-span-2 lg:col-span-1 xl:col-span-4">
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm h-full">
                  <Carnet />
                </div>
              </div>
            </div>

            {/* Sección de tabla (12/12 del ancho total) */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm">
              <Tabla />
            </div>
            <Chat />
          </div>
        </main>
      </div>
    </div>
  );
}
