"use client"

import { AlertCircle, MessageCircle, Star, Trash2 } from "lucide-react"
import { useEffect } from "react"

export function MessageTabs({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  isMobile,
  counts = {
    recibidos: 0,
    favoritos: 0,
    importantes: 0,
    eliminados: 0,
    archivados: 0,
  },
  selectedMessage,
}) {

  useEffect(() => {
  }, [selectedMessage, isMobile])

  const tabs = [
    { id: "recibidos", label: "Recibidos", icon: <MessageCircle className="h-4 w-4" />, count: counts.recibidos },
    { id: "favoritos", label: "Favoritos", icon: <Star className="h-4 w-4" />, count: counts.favoritos },
    { id: "importantes", label: "Importantes", icon: <AlertCircle className="h-4 w-4" />, count: counts.importantes },
    { id: "eliminados", label: "Eliminados", icon: <Trash2 className="h-4 w-4" />, count: counts.eliminados },
  ]

  const handleTabChange = (tabId) => {
    onTabChange(tabId)

    const container = document.getElementById("tabs-container")
    const tabElement = document.getElementById(`tab-${tabId}`)

    if (container && tabElement) {
      const containerRect = container.getBoundingClientRect()
      const tabRect = tabElement.getBoundingClientRect()

      if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
        tabElement.scrollIntoView({ behavior: "smooth", inline: "center" })
      }
    }
  }

  return (
    <div className="w-full relative">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Contenedor de tabs con scroll horizontal en móvil */}
        <div
          id="tabs-container"
          className="overflow-x-auto scrollbar-hide py-2 px-1 flex-1 w-full sm:w-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="grid grid-flow-col auto-cols-auto sm:grid-cols-4 bg-gray-100 p-1 rounded-lg min-w-max gap-1">
            {tabs.map((tab) => (
              <button
                id={`tab-${tab.id}`}
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center justify-center gap-1 sm:gap-2 py-2 px-3 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-[#D7008A] shadow-sm"
                    : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center justify-center">
                  {tab.icon}
                  <span className="hidden xs:inline sm:inline ml-1">{tab.label}</span>
                </div>
                <span
                  className={`ml-1 text-xs px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center ${
                    tab.count > 0 ? "bg-gray-200 text-gray-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
        {/* Barra de búsqueda solo en desktop */}
        {!isMobile && (
          <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-md">
            <input
              type="text"
              placeholder="Buscar mensajes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D7008A] focus:outline-none"
              aria-label="Campo de búsqueda"
            />
          </div>
        )}
      </div>
    </div>
  )
}