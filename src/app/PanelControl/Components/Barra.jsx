"use client";

import { fetchMe } from "@/api/endpoints/colegiado";
import ProfileDropdown from "@/app/Colegiado/Components/PerfilDropdown";
import { Notifications } from "@mui/icons-material";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NotificacionesModal } from "../../Components/Comunicaciones/Notificaciones/NotificacionesModal";
import { NotificacionesProvider } from "../../Models/Comunicaciones/Notificaciones/NotificacionesData";

export default function Barra({ onMenuClick, title = "Inicio", icon }) {
  const router = useRouter();
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const notificacionesButtonRef = useRef(null);
  const [userInfo, setUser_info] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      fetchMe(session)
        .then((response) => setUser_info(response.data))
        .catch((error) => console.log(error));
    }
  }, [session, status]);

  return (
    <>
      <div className="bg-white h-20 fixed top-0 right-0 left-0 lg:left-72 shadow-sm z-30 flex items-center justify-between px-6">
        <div className="flex items-center lg:ml-12">
          {/* Botón de menú para móvil */}
          <button
            className="lg:hidden mr-4 text-gray-700 hover:text-[#D7008A] transition-colors"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <Menu size={30} />
          </button>

          {/* Título principal */}
          <div className="flex items-center">
            {icon && <span className="text-[#41023B] mr-2">{icon}</span>}
            <h1 className="text-sm md:text-xl font-bold ml-2 text-[#41023B]">
              {title}
            </h1>
          </div>
        </div>

        {/* Contenedor de solvencia e iconos */}
        <div className="flex items-center space-x-6 lg:mr-12">
          {/* Iconos */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button
                ref={notificacionesButtonRef}
                className="text-[#41023B] cursor-pointer hover:scale-110 transition-transform duration-200 relative"
                aria-label="Notificaciones"
                onClick={() => setShowNotificaciones(!showNotificaciones)}
              >
                <Notifications fontSize="medium" />
                <NotificacionesProvider>
                  <NotificacionesBadge />
                </NotificacionesProvider>
              </button>
            </div>
            <ProfileDropdown userInfo={userInfo} />
          </div>
        </div>
      </div>

      {/* Modal de notificaciones */}
      <NotificacionesProvider>
        <NotificacionesModal
          isOpen={showNotificaciones}
          onClose={() => setShowNotificaciones(false)}
          anchorRef={notificacionesButtonRef}
        />
      </NotificacionesProvider>
    </>
  );
}

function NotificacionesBadge() {
  const { getNotificacionesCounts } = useNotificaciones();
  const counts = getNotificacionesCounts();

  if (counts.noLeidas === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 h-3 w-3 rounded-full"></span>
  );
}

// Importar el hook de notificaciones
import { useNotificaciones } from "../../Models/Comunicaciones/Notificaciones/NotificacionesData";

