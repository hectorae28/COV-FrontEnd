"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AppBar from "./Components/AppBar";
import Barra from "./Components/Barra";
import Cards from "./Components/Cards";
import Carnet from "./Components/Carnet";
import Tabla from "./Components/Tabla";
import Chat from "./Components/Chat";
import SolvencyPayment from "@/Components/Cards/SolvencyPayment";
import RequestForm from "@/Components/Cards/RequestForm";
import RequestHistory from "@/Components/Cards/RequestHistory";
import AdminUpdateRequest from "@/Components/Cards/AdminUpodateRequest";
import { fetchMe } from "@/api/endpoints/colegiado";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
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
  // Determinar si mostrar componentes administrativos
  const isAdmin = true; // Esto debería venir de la autenticación real

  // Renderizar contenido según la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
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
          </>
        );

      case "solvency":
        return (
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm">
            <SolvencyPayment />
          </div>
        );

      case "request":
        return (
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm">
            <RequestForm />
          </div>
        );

      case "history":
        return (
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm">
            <RequestHistory />
          </div>
        );

      case "admin":
        return (
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm">
            <AdminUpdateRequest />
          </div>
        );

      default:
        return null;
    }
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

        {/* Pestañas de navegación */}
        <div className="pt-20 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex overflow-x-auto space-x-8 py-4">
              <TabButton
                label="Dashboard"
                active={activeTab === "dashboard"}
                onClick={() => setActiveTab("dashboard")}
              />
              <TabButton
                label="Pagar Solvencia"
                active={activeTab === "solvency"}
                onClick={() => setActiveTab("solvency")}
              />
              <TabButton
                label="Nueva Solicitud"
                active={activeTab === "request"}
                onClick={() => setActiveTab("request")}
              />
              <TabButton
                label="Historial"
                active={activeTab === "history"}
                onClick={() => setActiveTab("history")}
              />
              {isAdmin && (
                <TabButton
                  label="Admin"
                  active={activeTab === "admin"}
                  onClick={() => setActiveTab("admin")}
                />
              )}
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto flex flex-col gap-8 py-10 px-4">
            {renderContent()}
            <Chat />
          </div>
        </main>
      </div>
    </div>
  );
}

// Componente de botón de pestaña
function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        whitespace-nowrap px-3 py-2 font-medium text-sm rounded-md transition-colors
        ${
          active
            ? "text-[#D7008A] border-b-2 border-[#D7008A]"
            : "text-gray-600 hover:text-[#D7008A]"
        }
      `}
    >
      {label}
    </button>
  );
}
