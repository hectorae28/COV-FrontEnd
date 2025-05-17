// Modificación a EventList.jsx - agregando botón de formulario
import { FiCalendar, FiClock, FiMapPin, FiSearch, FiTrash2, FiFileText } from "react-icons/fi";

export default function EventList({
    filteredData,
    searchTerm,
    setSearchTerm,
    tabIndex,
    editingId,
    handleSelect,
    handleDelete,
    handleFormBuilder // Nuevo prop para manejar el formulario
}) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-md">
            {/* Código existente */}
            
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
                            className={`border rounded-lg p-3 transition-all duration-200 hover:shadow-md cursor-pointer ${editingId === item.id ? 'border-[#C40180] bg-[#C40180]/5' : 'border-gray-200'}`}
                        >
                            <div className="flex items-center">
                                {/* Contenido existente */}
                                <div 
                                    className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 mr-4 bg-gray-100"
                                    onClick={() => handleSelect(item)}
                                >
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

                                <div 
                                    className="flex-1"
                                    onClick={() => handleSelect(item)}
                                >
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

                                <div className="flex">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleFormBuilder(item);
                                        }}
                                        className="p-1.5 rounded-md text-[#C40180] hover:bg-[#C40180]/10 transition-colors mr-2"
                                        title={item.formulario ? "Editar formulario" : "Crear formulario"}
                                    >
                                        <FiFileText size={18} />
                                    </button>
                                    
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(item.id, tabIndex === 0 ? "evento" : "curso");
                                        }}
                                        className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                                        title="Eliminar"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}