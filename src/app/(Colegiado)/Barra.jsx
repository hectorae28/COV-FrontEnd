"use client";

import { Info, Notifications, Warning } from "@mui/icons-material";
import { Menu } from "lucide-react";
import PerfilDropdown from "../Components/PerfilDropdown";
import useColegiadoUserStore from "@/utils/colegiadoUserStore";
import { useBarraContext } from "@/app/(Colegiado)/BarraContext";

export default function Barra({
  onMenuClick,
  isSolvent,
  userInfo,
  showSolvencyWarning,
  session
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
        {/* Información de solvencia (oculta en móviles) */}
        <div className="hidden md:block min-w-0 whitespace-nowrap">
          <h2 className="text-lg font-semibold cursor-default">
            {colegiadoUser.solvencia_status ? (
              <>
                {showSolvencyWarning ? (
                  <span className="text-amber-600 flex items-center">
                    <Warning fontSize="small" className="mr-1" />
                    Solvencia por vencer:{" "}
                    <span className="text-black font-semibold ml-1">
                      {colegiadoUser.solvente}
                    </span>
                  </span>
                ) : (
                  <>
                    <span className="text-green-600">Solvente</span> hasta:{" "}
                    <span className="text-black font-semibold">
                      {colegiadoUser.solvente}
                    </span>
                  </>
                )}
              </>
            ) : (
              <span className="text-red-600 flex items-center">
                <Info fontSize="small" className="mr-1" />
                No Solvente
              </span>
            )}
          </h2>
        </div>

        {/* Iconos (siempre visibles) */}
        <div className="flex items-center space-x-4">
          <button
            className="text-[#41023B] cursor-pointer hover:scale-110 transition-transform duration-200"
            aria-label="Notificaciones"
          >
            <Notifications fontSize="medium" />
          </button>

          <PerfilDropdown userInfo={userInfo} session={session} />
        </div>
      </div>
    </div>
  );
}