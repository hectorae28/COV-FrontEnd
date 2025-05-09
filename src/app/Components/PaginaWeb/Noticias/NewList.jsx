"use client"
import { useState } from "react"
import { Edit2, Search, Trash2 } from "lucide-react"

const NewsList = ({ news, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("Todas")
    const categories = ["Todas", "Actualización", "Podcast", "Revista", "Conferencias"]

    // Filtrar noticias por búsqueda y categoría
    const filteredNews = news.filter((item) => {
        const matchesSearch =
            (item.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description || "").toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory = categoryFilter === "Todas" || item.category === categoryFilter

        return matchesSearch && matchesCategory
    })

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Listado de Noticias</h2>

                {/* Filtros */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Buscar noticias..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                onClick={() => setCategoryFilter(category)}
                                className={`px-4 py-1 rounded-full text-sm ${categoryFilter === category
                                        ? "bg-[#C40180] text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                    } transition-all`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tabla de noticias */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Título
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Fecha
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Categoría
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredNews.length > 0 ? (
                                filteredNews.map((item, index) => (
                                    <tr key={item.id || index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 mr-3">
                                                    <img
                                                        className="h-10 w-10 rounded-md object-cover"
                                                        src={item.imageUrl || "/assets/placeholder-image.jpg"}
                                                        alt=""
                                                        onError={(e) => {
                                                            e.target.src = "/assets/placeholder-image.jpg"
                                                        }}
                                                    />
                                                </div>
                                                <div className="text-sm font-medium text-gray-900 line-clamp-1 max-w-xs">{item.title}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1 rounded-full"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(item.id)}
                                                    className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded-full"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No se encontraron noticias
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default NewsList
