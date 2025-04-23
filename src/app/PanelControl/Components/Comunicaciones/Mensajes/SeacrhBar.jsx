"use client"

import { Search, X } from "lucide-react"

export function SearchBar({ searchQuery, onSearchChange, showSearchBar, setShowSearchBar, isMobile }) {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder="Buscar mensajes..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D7008A] focus:outline-none"
        aria-label="Campo de búsqueda"
      />
      {isMobile && showSearchBar && (
        <button
          onClick={() => setShowSearchBar(false)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          aria-label="Cerrar búsqueda"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}