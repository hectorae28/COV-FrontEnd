"use client";

import { useBarraContext } from "@/app/(Colegiado)/BarraContext";
import useColegiadoUserStore from "@/store/colegiadoUserStore";
import { CheckCircle, Info, Notifications, Warning } from "@mui/icons-material";
import { Menu } from "lucide-react";
import PerfilDropdown from "../Components/PerfilDropdown";

export default function Barra({
  onMenuClick,
  userInfo,
  showSolvencyWarning,
}) {
  const colegiadoUser = useColegiadoUserStore((store) => store.colegiadoUser)
  // Manejo seguro del contexto con valores por defecto
  let currentSection = "Panel de Solicitudes";
  try {
    const context = useBarraContext();
    if (context) {
      currentSection = context.currentSection;
    }
  } catch (error) {
    console.warn("BarraContext no está disponible. Usando título por defecto.");
    // Continuar con el valor por defecto
  }

  // Componente para el badge de solvencia
  const SolvencyBadge = () => {
    if (!colegiadoUser?.solvencia_status) {
      return (
        <div className="flex items-center bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 shadow-sm">
          <div className="flex items-center justify-center w-7 h-7 bg-red-100 rounded-full mr-3">
            <Info className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-red-700">No Solvente</span>
          </div>
        </div>
      );
    }

    if (showSolvencyWarning) {
      return (
        <div className="flex items-center bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 shadow-sm">
          <div className="flex items-center justify-center w-7 h-7 bg-amber-100 rounded-full mr-3">
            <Warning className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-amber-800 uppercase tracking-wide">Por Vencer</span>
            <span className="text-sm font-bold text-amber-700">
              Hasta: {colegiadoUser?.solvente}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 shadow-sm">
        <div className="flex items-center justify-center w-7 h-7 bg-green-100 rounded-full mr-3">
          <CheckCircle className="w-4 h-4 text-green-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-green-800 uppercase tracking-wide">Solvente</span>
          <span className="text-sm font-bold text-green-700">
            Hasta: {colegiadoUser?.solvente}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="select-none cursor-default bg-white h-20 fixed top-0 right-0 left-0 md:left-72 shadow-sm z-30 flex items-center justify-between px-4 md:px-18">
      <div className="flex items-center">
        {/* Botón de menú para móvil */}
        <button
          className="md:hidden mr-4 text-gray-700 hover:text-[#D7008A] transition-colors"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu size={30} />
        </button>

        {/* Título principal */}
        <h1 className="text-xl font-bold text-[#41023B]">
          {currentSection}
        </h1>
      </div>

      {/* Contenedor de solvencia e iconos */}
      <div className="flex items-center space-x-6">
        {/* Información de solvencia mejorada (oculta en móviles) */}
        <div className="hidden md:block">
          <SolvencyBadge />
        </div>

        {/* Iconos (siempre visibles) */}
        <div className="flex items-center space-x-4">
          <button
            className="text-[#41023B] cursor-pointer hover:scale-110 transition-transform duration-200"
            aria-label="Notificaciones"
          >
            <Notifications fontSize="medium" />
          </button>

          <PerfilDropdown userInfo={userInfo} />
        </div>
      </div>
    </div>
  );
}