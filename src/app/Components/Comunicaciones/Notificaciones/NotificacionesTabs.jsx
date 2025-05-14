"use client"

import { Bell, EyeOff, Trash2 } from "lucide-react"

export function NotificacionesTabs({ activeTab, onTabChange, counts, isMobile }) {
  const tabs = [
    { id: "no-leidas", label: "No leídas", icon: <EyeOff className="h-4 w-4" />, count: counts.noLeidas },
    { id: "todas", label: "Todas", icon: <Bell className="h-4 w-4" />, count: counts.todas },
    { id: "papelera", label: "Papelera", icon: <Trash2 className="h-4 w-4" />, count: counts.papelera },
  ]

  return (
    <div className="w-full relative">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Contenedor de tabs en móvil */}
        <div
          id="tabs-container"
          className="overflow-x-auto scrollbar-hide py-2 px-1 flex-1 w-full sm:w-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="grid grid-flow-col auto-cols-auto sm:grid-cols-3 bg-gray-100 p-1 rounded-lg min-w-max gap-1">
            {tabs.map((tab) => (
              <button
                id={`tab-${tab.id}`}
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center justify-center gap-1 sm:gap-2 py-2 px-3 rounded-md transition-colors ${activeTab === tab.id
                  ? "bg-white text-[#D7008A] shadow-sm"
                  : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
              >
                <div className="flex items-center justify-center">
                  {tab.icon}
                  <span className="hidden xs:inline sm:inline ml-1">{tab.label}</span>
                </div>
                <span
                  className={`ml-1 text-xs px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center ${tab.count > 0 ? "bg-gray-200 text-gray-700" : "bg-gray-100 text-gray-500"
                    }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}