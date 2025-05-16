import { FiCalendar, FiClock, FiMapPin, FiSearch, FiTrash2 } from "react-icons/fi";

export default function EventList({
    filteredData,
    searchTerm,
    setSearchTerm,
    tabIndex,
    editingId,
    handleSelect,
    handleDelete
}) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                    Lista de {tabIndex === 0 ? "Eventos" : "Cursos"}
                </h2>
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={`Buscar ${tabIndex === 0 ? "eventos" : "cursos"}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#C40180] focus:border-[#C40180] outline-none w-full md:w-64"
                    />
                </div>
            </div>

            {filteredData.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    {searchTerm ?
                        `No se encontraron ${tabIndex === 0 ? "eventos" : "cursos"} que coincidan con "${searchTerm}"` :
                        `No hay ${tabIndex === 0 ? "eventos" : "cursos"} disponibles`
                    }
                </div>
            ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredData.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            className={`border rounded-lg p-3 transition-all duration-200 hover:shadow-md cursor-pointer ${editingId === item.id ? 'border-[#C40180] bg-[#C40180]/5' : 'border-gray-200'
                                }`}
                        >
                            <div className="flex items-center">
                                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 mr-4 bg-gray-100">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.title || "Imagen"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#C40180] to-[#590248] text-white text-xs">
                                            Sin imagen
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-800 line-clamp-1">{item.title || "Sin título"}</h3>
                                    <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1">
                                        <div className="flex items-center mr-4">
                                            <FiCalendar className="mr-1 text-[#C40180]" size={14} />
                                            <span>{item.date || "Fecha no definida"}</span>
                                        </div>
                                        {item.hora_inicio && (
                                            <div className="flex items-center mr-4">
                                                <FiClock className="mr-1 text-[#C40180]" size={14} />
                                                <span>{item.hora_inicio}</span>
                                            </div>
                                        )}
                                        {item.location && (
                                            <div className="flex items-center">
                                                <FiMapPin className="mr-1 text-[#C40180]" size={14} />
                                                <span className="line-clamp-1">{item.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item.id, tabIndex === 0 ? "evento" : "curso");
                                    }}
                                    className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors ml-2"
                                    title="Eliminar"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
