"use client";

import { Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MessageList } from "../../../Components/Comunicaciones/Mensajes/MensagesLista";
import { MessageDetail } from "../../../Components/Comunicaciones/Mensajes/MensajesDetalles";
import { MessageTabs } from "../../../Components/Comunicaciones/Mensajes/MensajesTabs";
import { ComposeModal } from "../../../Components/Comunicaciones/Mensajes/ModalCompose";
import { useMessages } from "../../../Models/Comunicaciones/Mensajes/MensajesData";

export default function MessagingPage() {
  const [activeTab, setActiveTab] = useState("recibidos");
  const [searchQuery, setSearchQuery] = useState("");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    selectedMessage,
    setSelectedMessage,
    filteredMessages,
    messageCounts,
    handleToggleFavorite,
    handleToggleImportant,
    handleDeleteMessage,
    handleRestoreMessage,
    handlePermanentDelete,
    handleSendReply,
    handleSendNewMessage,
    markMessageAsRead,
  } = useMessages(activeTab, searchQuery);

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

  const handleBackToList = () => {
    setSelectedMessage(null);
  };

  useEffect(() => {
    if (selectedMessage && !selectedMessage.leido) {
      markMessageAsRead(selectedMessage.id);
    }
  }, [selectedMessage]);

  return (
    <div className="flex flex-col h-screen overflow-hidden pt-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 bg-white border-b shadow-sm z-20 flex-shrink-0">
        {/* Navegación de pestañas con opciones de visibilidad responsive */}
        <div
          className={`${
            selectedMessage && isMobile ? "hidden" : "block"
          } w-full`}
        >
          <MessageTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isMobile={isMobile}
            counts={messageCounts}
            selectedMessage={selectedMessage}
          />
        </div>

        {/* Barra de búsqueda en móvil */}
        {isMobile && !selectedMessage && (
          <div className="relative w-full mt-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar mensajes..."
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
        )}

        {/* Botón de nuevo mensaje en desktop */}
        <div
          className={`${
            selectedMessage && isMobile ? "hidden" : "flex"
          } md:w-auto mt-3 md:mt-0 md:ml-3`}
        >
          <button
            onClick={() => setShowComposeModal(true)}
            className="items-center px-4 py-2 text-white rounded-md bg-gradient-to-r from-[#D7008A] to-[#41023B] hover:opacity-90 md:flex hidden"
            aria-label="Nuevo mensaje"
          >
            <Plus className="mr-2 h-4 w-4" /> Nuevo
          </button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden relative">
        {/* Lista de mensajes */}
        <MessageList
          messages={filteredMessages}
          selectedMessageId={selectedMessage?.id}
          onSelectMessage={setSelectedMessage}
          onToggleFavorite={handleToggleFavorite}
          onToggleImportant={handleToggleImportant}
          onDeleteMessage={handleDeleteMessage}
          onRestoreMessage={handleRestoreMessage}
          onPermanentDelete={handlePermanentDelete}
          activeTab={activeTab}
        />
        {/* Detalle del mensaje con soporte para navegación móvil */}
        <MessageDetail
          message={selectedMessage}
          onToggleFavorite={handleToggleFavorite}
          onToggleImportant={handleToggleImportant}
          onDeleteMessage={handleDeleteMessage}
          onRestoreMessage={handleRestoreMessage}
          onPermanentDelete={handlePermanentDelete}
          onSendReply={handleSendReply}
          onComposeNew={() => setShowComposeModal(true)}
          onBackToList={handleBackToList}
        />

        {/* Botón flotante de nuevo mensaje en móvil */}
        {isMobile && !selectedMessage && (
          <button
            onClick={() => setShowComposeModal(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white shadow-lg flex items-center justify-center z-30"
            aria-label="Nuevo mensaje"
          >
            <Plus className="h-6 w-6" />
          </button>
        )}
      </div>
      {/* Modal de composición de mensaje */}
      {showComposeModal && (
        <ComposeModal
          onClose={() => setShowComposeModal(false)}
          onSendMessage={handleSendNewMessage}
        />
      )}
    </div>
  );
}
