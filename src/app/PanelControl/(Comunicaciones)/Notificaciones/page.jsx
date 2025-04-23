"use client";

import { Suspense } from "react";
import { CheckCircle, Search, Trash2, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { NotificacionDetail } from "@/Components/Comunicaciones/Notificaciones/NotificacionDetail";
import { NotificacionesList } from "@/Components/Comunicaciones/Notificaciones/NotificacionesList";
import { NotificacionesTabs } from "@/Components/Comunicaciones/Notificaciones/NotificacionesTabs";
import {
  NotificacionesProvider,
  useNotificaciones,
} from "../../../Models/Comunicaciones/Notificaciones/NotificacionesData";

function NotificacionesPage() {
  const searchParams = useSearchParams();
  const notificationId = searchParams.get("id");
  const [isMobile, setIsMobile] = useState(false);
  const [shouldProcessNotificationId, setShouldProcessNotificationId] =
    useState(true);

  const {
    selectedNotificacion,
    setSelectedNotificacion,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    getFilteredNotificaciones,
    getNotificacionesCounts,
    toggleLeidaNotificacion,
    eliminarNotificacion,
    restaurarNotificacion,
    eliminarPermanentemente,
    vaciarPapelera,
    marcarTodasComoLeidas,
    selectNotificacionById,
  } = useNotificaciones();

  const filteredNotificaciones = getFilteredNotificaciones();
  const counts = getNotificacionesCounts();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (notificationId && shouldProcessNotificationId) {
      const timer = setTimeout(() => {
        selectNotificacionById(notificationId);
        setShouldProcessNotificationId(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [notificationId, selectNotificacionById, shouldProcessNotificationId]);

  useEffect(() => {
    setShouldProcessNotificationId(true);
  }, [notificationId]);

  const handleBackToList = () => {
    setSelectedNotificacion(null);

    if (notificationId) {
      const newUrl = window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    }
  };

  return (
    <Suspense fallback={<div>Cargando notificaciones...</div>}>
      <div className="flex flex-col h-screen overflow-hidden pt-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 bg-white border-b shadow-sm z-20 flex-shrink-0">
          {/* Navegación de pestañas responsive */}
          <div
            className={`${
              selectedNotificacion && isMobile ? "hidden" : "block"
            } w-full`}
          >
            <NotificacionesTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              counts={counts}
              isMobile={isMobile}
            />
          </div>

          {/* Barra de búsqueda en móvil */}
          {isMobile && !selectedNotificacion && (
            <div className="flex w-full items-center gap-2 mt-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar notificaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D7008A] focus:outline-none"
                  aria-label="Campo de búsqueda"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {activeTab === "papelera" ? (
                <button
                  onClick={vaciarPapelera}
                  className="flex-shrink-0 flex items-center px-2 py-1.5 text-sm text-white rounded-md bg-red-500 hover:bg-red-600"
                  disabled={counts.papelera === 0}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={marcarTodasComoLeidas}
                  className="flex-shrink-0 flex items-center px-2 py-3 text-sm text-white rounded-md bg-[#D7008A] hover:bg-[#41023B]"
                  disabled={counts.noLeidas === 0}
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* Barra de búsqueda en desktop */}
          {!isMobile && (
            <div className="flex w-full items-center gap-3 mt-3 md:mt-0">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar notificaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D7008A] focus:outline-none"
                  aria-label="Campo de búsqueda"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {activeTab === "papelera" ? (
                <button
                  onClick={vaciarPapelera}
                  className="flex items-center px-3 py-1.5 text-sm text-white rounded-md bg-red-500 hover:bg-red-600 whitespace-nowrap"
                  disabled={counts.papelera === 0}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Vaciar papelera
                </button>
              ) : (
                <button
                  onClick={marcarTodasComoLeidas}
                  className="flex items-center px-3 py-1.5 text-sm text-white rounded-md bg-[#D7008A] hover:bg-[#41023B] whitespace-nowrap"
                  disabled={counts.noLeidas === 0}
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Marcar todas leídas
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          {/* Lista de notificaciones */}
          <NotificacionesList
            notificaciones={filteredNotificaciones}
            selectedNotificacionId={selectedNotificacion?.id}
            onSelectNotificacion={setSelectedNotificacion}
            onToggleLeida={toggleLeidaNotificacion}
            onEliminar={eliminarNotificacion}
            onRestaurar={restaurarNotificacion}
            onEliminarPermanente={eliminarPermanentemente}
            activeTab={activeTab}
            isMobile={isMobile}
          />
          {/* Detalle de la notificación con soporte para navegación móvil */}
          <NotificacionDetail
            notificacion={selectedNotificacion}
            onToggleLeida={toggleLeidaNotificacion}
            onEliminar={eliminarNotificacion}
            onRestaurar={restaurarNotificacion}
            onEliminarPermanente={eliminarPermanentemente}
            onBackToList={handleBackToList}
            isMobile={isMobile}
          />
        </div>
      </div>
    </Suspense>
  );
}

export default function NotificacionesPageWithProvider() {
  return (
    <NotificacionesProvider>
      <NotificacionesPage />
    </NotificacionesProvider>
  );
}
