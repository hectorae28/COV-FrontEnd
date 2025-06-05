"use client"

import { Search } from "lucide-react"

export default function PagosNavegacion({
    tabActivo,
    setTabActivo,
    contarPagosPorEstado,
    searchTerm,
    setSearchTerm
}) {
    const tabs = [
        { key: "todas", label: "Todas", count: contarPagosPorEstado.todas },
        { key: "pendientes", label: "Pendientes", count: contarPagosPorEstado.pendientes },
        { key: "aprobados", label: "Aprobados", count: contarPagosPorEstado.aprobados },
        { key: "rechazados", label: "Rechazados", count: contarPagosPorEstado.rechazados }
    ]

    return (
        <div className="mb-6">
            <div className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                    {/* Tabs */}
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setTabActivo(tab.key)}
                                className={`whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium ${tabActivo === tab.key
                                        ? "border-[#C40180] text-[#C40180]"
                                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                    }`}
                            >
                                {tab.label}
                                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${tabActivo === tab.key
                                        ? "bg-[#C40180] text-white"
                                        : "bg-gray-200 text-gray-600"
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </nav>

                    {/* Barra de búsqueda */}
                    <div className="w-80">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar pagos..."
                                className="pl-10 pr-4 py-2 border border-gray-400 mb-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#C40180] text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-800" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}