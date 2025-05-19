import EstadoData from "@/Shared/EstadoData";
import { UniversidadData, estados } from "@/Shared/UniversidadData";
import { Check, ChevronDown, Filter, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DateRangeFilter from './DateRangeFilter';

export default function MultiSelectFilter({
    activeFilters,
    setActiveFilters,
    allFilters,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    edadMin,
    setEdadMin,
    edadMax,
    setEdadMax,
    edadExacta,
    setEdadExacta
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [filterGroups, setFilterGroups] = useState({});
    const [searchText, setSearchText] = useState("");
    const [selectedEstado, setSelectedEstado] = useState(null);
    const [activeGroup, setActiveGroup] = useState(null);
    const dropdownRef = useRef(null);
    const [isDateOpen, setIsDateOpen] = useState(false);

    // Actualizar estado seleccionado basado en filtros activos
    useEffect(() => {
        const activeEstado = activeFilters.find(f => f.group === "Ubicación");
        if (activeEstado && !selectedEstado) {
            setTimeout(() => setSelectedEstado(activeEstado), 0);
        }
    }, [activeFilters, selectedEstado]);

    // Organizar filtros por grupo
    useEffect(() => {
        const groups = {};
        allFilters.forEach((filter) => {
            if (!groups[filter.group]) {
                groups[filter.group] = [];
            }
            groups[filter.group].push(filter);
        });

        // Añadir grupo Universidad si no existe
        if (!groups["Universidad"]) {
            groups["Universidad"] = [];
        }

        // Asegurar que existe el grupo Municipio
        if (!groups["Municipio"]) {
            groups["Municipio"] = [];
        }

        setFilterGroups(groups);

        // Si no hay grupo activo, seleccionar el primero
        if (!activeGroup && Object.keys(groups).length > 0) {
            setActiveGroup(Object.keys(groups)[0]);
        }
    }, [allFilters, activeGroup]);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setIsDateOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Verificar conflictos entre filtros
    const checkFilterConflicts = (filter) => {
        // Define mutually exclusive filter groups
        const exclusiveGroups = {
            "documentos-status": ["documentos-incompletos", "documentos-completos", "documentos-pendientes", "documentos-rechazados"],
            "pagos-status": ["pagos-exonerados", "pagos-pendientes"],
            "estado-laboral": ["laborando", "no-laborando"],
            "genero": ["masculino", "femenino", "otros"]
        };

        // Check each exclusivity group
        for (const groupName in exclusiveGroups) {
            const group = exclusiveGroups[groupName];
            if (group.includes(filter.id)) {
                const selectedFromSameGroup = activeFilters.find((f) =>
                    group.includes(f.id) && f.id !== filter.id
                );

                if (selectedFromSameGroup) {
                    alert(`No se puede seleccionar "${filter.label}" mientras "${selectedFromSameGroup.label}" está seleccionado.`);
                    return true;
                }
            }
        }
        return false;
    };

    // Manejar selección/deselección de filtro
    const toggleFilter = (filter) => {
        const isConflicting = checkFilterConflicts(filter);
        if (isConflicting) return;

        setActiveFilters((prev) => {
            const exists = prev.some((f) => f.id === filter.id);
            if (exists) {
                // Si quitamos un estado
                if (filter.group === "Ubicación") {
                    // Limpiamos el estado seleccionado
                    setTimeout(() => setSelectedEstado(null), 0);
                    // Y eliminamos solo municipios relacionados (no universidades)
                    return prev.filter((f) => f.id !== filter.id && (f.group !== "Municipio" || !f.relatedTo));
                }
                return prev.filter((f) => f.id !== filter.id);
            } else {
                if (filter.group === "Ubicación") {
                    // Si seleccionamos estado
                    const newFilter = { ...filter };
                    // Actualizamos estado seleccionado tras el render
                    setTimeout(() => {
                        setSelectedEstado(newFilter);
                        // Cambiar automáticamente a municipios
                        setActiveGroup("Municipio");
                    }, 0);
                    // Solo eliminamos filtros de Estado previos y municipios relacionados a otros estados
                    return [...prev.filter(f => f.group !== "Ubicación" && !(f.group === "Municipio" && f.relatedTo)), newFilter];
                }
                return [...prev, filter];
            }
        });
    };

    // Eliminar un filtro
    const removeFilter = (filterId) => {
        setActiveFilters((prev) => {
            const filter = prev.find(f => f.id === filterId);
            if (filter?.group === "Ubicación") {
                // Limpiar estado seleccionado tras el render
                setTimeout(() => setSelectedEstado(null), 0);
                // Solo eliminar municipios relacionados, no universidades
                return prev.filter((f) => f.id !== filterId && (f.group !== "Municipio" || !f.relatedTo));
            }
            return prev.filter((f) => f.id !== filterId);
        });
    };

    // Aplicar filtro rápido de fecha
    const applyQuickFilter = (option) => {
        if (option === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            setFromDate(weekAgo.toISOString().split('T')[0]);
            setToDate('');
        } else if (option === 'month') {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            setFromDate(monthAgo.toISOString().split('T')[0]);
            setToDate('');
        }
        setIsDateOpen(false);
    };

    // Limpiar fechas
    const clearDates = () => {
        setFromDate('');
        setToDate('');
    };

    // Obtener municipios del estado seleccionado
    const getMunicipiosByEstado = () => {
        if (!selectedEstado) return [];

        const estadoNombre = selectedEstado.value.toLowerCase();
        const municipios = EstadoData[estadoNombre] || [];

        return municipios.map(municipio => ({
            id: `municipio-${municipio.toLowerCase().replace(/\s+/g, '-')}`,
            group: "Municipio",
            label: municipio,
            value: municipio,
            relatedTo: selectedEstado.id
        }));
    };

    // Obtener todas las universidades (independiente del estado)
    const getUniversidades = () => {
        // Combine all universities from all states
        let allUniversities = [];

        // Iterate through all states to get all universities
        Object.keys(UniversidadData).forEach(estado => {
            const universidades = UniversidadData[estado] || [];

            universidades.forEach(universidad => {
                // Check if this university is already in our list (by acronym)
                if (!allUniversities.some(u => u.acronimo === universidad.acronimo)) {
                    allUniversities.push(universidad);
                }
            });
        });

        // Sort alphabetically by name
        allUniversities.sort((a, b) => a.nombre.localeCompare(b.nombre));

        return allUniversities.map(universidad => ({
            id: `universidad-${universidad.acronimo.toLowerCase()}`,
            group: "Universidad",
            label: `${universidad.nombre} (${universidad.acronimo})`,
            value: universidad.acronimo
            // No relatedTo property - universities are independent
        }));
    };

    const hasDateRange = fromDate || toDate;

    return (
        <div className="mb-6">
            {/* Controles de filtros */}
            <div className="flex gap-2">
                {/* Botón Filtrar por */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => {
                            setIsOpen(!isOpen);
                            setIsDateOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm"
                    >
                        <Filter size={18} />
                        <span>Filtro</span>
                        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 w-full min-w-[700px] max-w-[1200px] max-h-[500px] overflow-auto">
                            {/* Barra de búsqueda */}
                            <div className="sticky top-0 bg-white p-3 border-b border-gray-100 z-10">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar filtros..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180]"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="p-4">
                                {/* Chips de categorías */}
                                <div className="mb-3 flex flex-wrap gap-1">
                                    {Object.keys(filterGroups)
                                        .filter(group => {
                                            // Make sure Municipio is shown when a state is selected
                                            if (group === "Municipio") {
                                                return selectedEstado !== null;
                                            }
                                            return true;
                                        })
                                        .map(group => (
                                            <button
                                                key={group}
                                                className={`px-3 py-1 rounded-full text-sm ${activeGroup === group
                                                    ? "bg-gradient-to-r from-[#C40180] to-[#590248] text-white"
                                                    : "bg-gray-100 text-gray-700"
                                                    }`}
                                                onClick={() => setActiveGroup(group)}
                                            >
                                                {group}
                                                {group === "Municipio" && selectedEstado && (
                                                    <span className="ml-1 opacity-75">({selectedEstado.label})</span>
                                                )}
                                            </button>
                                        ))}
                                </div>

                                {/* Filtros de la categoría activa */}
                                {activeGroup && (
                                    <div className="rounded-lg bg-white shadow-md p-4 border">
                                        <h3 className="font-medium mb-2">
                                            {activeGroup === "Municipio" && selectedEstado?.value.toLowerCase().includes('distrito') 
                                              ? 'Parroquias' 
                                              : activeGroup}
                                            {activeGroup === "Municipio" && selectedEstado && (
                                                <span className="text-sm font-normal text-gray-500 ml-2">
                                                    Ubicación: {selectedEstado.label}
                                                </span>
                                            )}
                                        </h3>

                                        {/* Caso especial para Edad */}
                                        {activeGroup === "Edad" && (
                                            <div className="p-4 col-span-3">
                                              <h3 className="font-medium mb-2">Edad (mínimo 18 años)</h3>
                                              <div className="flex items-center gap-4">
                                                <div>
                                                  <label className="block text-sm text-gray-600 mb-1">Edad exacta</label>
                                                  <input 
                                                    type="number" 
                                                    min="18"
                                                    value={edadExacta || ""}
                                                    onChange={(e) => setEdadExacta(e.target.value)}
                                                    className="w-24 border border-gray-300 rounded px-2 py-1"
                                                    placeholder="Ej: 25"
                                                  />
                                                </div>
                                                <div className="text-gray-500 text-sm">O</div>
                                                <div>
                                                  <label className="block text-sm text-gray-600 mb-1">Desde</label>
                                                  <input 
                                                    type="number" 
                                                    min="18"
                                                    value={edadMin || ""}
                                                    onChange={(e) => setEdadMin(e.target.value)}
                                                    className="w-24 border border-gray-300 rounded px-2 py-1"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="block text-sm text-gray-600 mb-1">Hasta</label>
                                                  <input 
                                                    type="number" 
                                                    min="18"
                                                    value={edadMax || ""}
                                                    onChange={(e) => setEdadMax(e.target.value)}
                                                    className="w-24 border border-gray-300 rounded px-2 py-1"
                                                  />
                                                </div>
                                                <button
                                                  onClick={() => {
                                                    // Validar edad mínima
                                                    if ((edadExacta && edadExacta < 18) || (edadMin && edadMin < 18)) {
                                                      alert("La edad mínima debe ser 18 años");
                                                      return;
                                                    }
                                                    
                                                    // Crea filtro por edad exacta o rango
                                                    let filtroEdad;
                                                    if (edadExacta) {
                                                      filtroEdad = {
                                                        id: `edad-${edadExacta}`,
                                                        group: "Edad",
                                                        label: `${edadExacta} años`,
                                                        value: `${edadExacta}-${edadExacta}`
                                                      };
                                                    } else if (edadMin || edadMax) {
                                                      // Asegurar valores mínimos
                                                      const min = edadMin || '18';
                                                      const max = edadMax || '';
                                                      
                                                      filtroEdad = {
                                                        id: `edad-${min}-${max}`,
                                                        group: "Edad",
                                                        label: max ? `${min} - ${max} años` : `Desde ${min} años`,
                                                        value: `${min}-${max}`
                                                      };
                                                    }
                                                    
                                                    // Remover filtros previos de edad
                                                    setActiveFilters(prev => prev.filter(f => f.group !== "Edad"));
                                                    
                                                    // Añadir el nuevo filtro
                                                    if (filtroEdad) {
                                                      setActiveFilters(prev => [...prev, filtroEdad]);
                                                    }
                                                    
                                                    // Limpiar campos
                                                    setEdadExacta("");
                                                    setEdadMin("");
                                                    setEdadMax("");
                                                  }}
                                                  className="mt-4 px-4 py-1 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-md"
                                                >
                                                  Aplicar
                                                </button>
                                              </div>
                                            </div>
                                        )}

                                        {/* Caso especial para Ubicación */}
                                        {activeGroup === "Ubicación" && (
                                            <div className="grid grid-cols-3 gap-2">
                                                {estados
                                                    .filter(estado => !searchText ||
                                                        estado.toLowerCase().includes(searchText.toLowerCase()))
                                                    .map(estado => {
                                                        const estadoFilter = {
                                                            id: `ubicacion-${estado.toLowerCase().replace(/\s+/g, '-')}`,
                                                            group: "Ubicación",
                                                            label: estado,
                                                            value: estado
                                                        };
                                                        const isSelected = selectedEstado?.id === estadoFilter.id;

                                                        return (
                                                            <div
                                                                key={estadoFilter.id}
                                                                onClick={() => toggleFilter(estadoFilter)}
                                                                className={`flex items-center gap-1 p-2 rounded-md cursor-pointer text-sm ${isSelected
                                                                    ? "bg-gradient-to-r from-[#C40180] to-[#590248] text-white"
                                                                    : "bg-gray-50 hover:bg-gray-100"
                                                                    }`}
                                                            >
                                                                <div className={`h-3.5 w-3.5 border rounded flex-shrink-0 ${isSelected ? "border-white bg-white" : "border-gray-300 bg-white"
                                                                    }`}>
                                                                    {isSelected && <Check size={10} className="text-[#C40180]" />}
                                                                </div>
                                                                <span className="truncate">{estadoFilter.label}</span>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        )}

                                        {/* Caso especial para Municipios/Parroquias */}
                                        {activeGroup === "Municipio" && (
                                            <div className="grid grid-cols-3 gap-2">
                                                {selectedEstado ? (
                                                    <>
                                                        <h3 className="font-medium mb-2 col-span-3">
                                                            {selectedEstado.value.toLowerCase().includes('distrito') ? 'Parroquias' : 'Municipios'}
                                                            <span className="text-sm font-normal text-gray-500 ml-2">
                                                                Ubicación: {selectedEstado.label}
                                                            </span>
                                                        </h3>
                                                        {getMunicipiosByEstado()
                                                            .filter(municipio => !searchText ||
                                                                municipio.label.toLowerCase().includes(searchText.toLowerCase()))
                                                            .map(municipio => {
                                                                const isSelected = activeFilters.some(f => f.id === municipio.id);

                                                                return (
                                                                    <div
                                                                        key={municipio.id}
                                                                        onClick={() => toggleFilter(municipio)}
                                                                        className={`flex items-center gap-1 p-2 rounded-md cursor-pointer text-sm ${isSelected
                                                                            ? "bg-gradient-to-r from-[#C40180] to-[#590248] text-white"
                                                                            : "bg-gray-50 hover:bg-gray-100"
                                                                            }`}
                                                                    >
                                                                        <div className={`h-3.5 w-3.5 border rounded flex-shrink-0 ${isSelected ? "border-white bg-white" : "border-gray-300 bg-white"
                                                                            }`}>
                                                                            {isSelected && <Check size={10} className="text-[#C40180]" />}
                                                                        </div>
                                                                        <span className="truncate">{municipio.label}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                    </>
                                                ) : (
                                                    <div className="text-center py-4 text-sm text-gray-500 col-span-3">
                                                        Seleccione una ubicación primero para ver los 
                                                        {' ' + (selectedEstado?.value.toLowerCase().includes('distrito') ? 'parroquias' : 'municipios')} disponibles
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Caso para Universidades (independiente del estado) */}
                                        {activeGroup === "Universidad" && (
                                            <div className="grid grid-cols-1 gap-2">
                                                {getUniversidades()
                                                    .filter(universidad => !searchText ||
                                                        universidad.label.toLowerCase().includes(searchText.toLowerCase()))
                                                    .map(universidad => {
                                                        const isSelected = activeFilters.some(f => f.id === universidad.id);

                                                        return (
                                                            <div
                                                                key={universidad.id}
                                                                onClick={() => toggleFilter(universidad)}
                                                                className={`flex items-center gap-1 p-2 rounded-md cursor-pointer text-sm ${isSelected
                                                                    ? "bg-gradient-to-r from-[#C40180] to-[#590248] text-white"
                                                                    : "bg-gray-50 hover:bg-gray-100"
                                                                    }`}
                                                            >
                                                                <div className={`h-3.5 w-3.5 border rounded flex-shrink-0 ${isSelected ? "border-white bg-white" : "border-gray-300 bg-white"
                                                                    }`}>
                                                                    {isSelected && <Check size={10} className="text-[#C40180]" />}
                                                                </div>
                                                                <span>{universidad.label}</span>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        )}

                                        {/* Otros filtros */}
                                        {activeGroup !== "Ubicación" && activeGroup !== "Municipio" && activeGroup !== "Universidad" && activeGroup !== "Edad" && (
                                            <div className="grid grid-cols-3 gap-2">
                                                {filterGroups[activeGroup]?.filter(filter =>
                                                    !searchText || filter.label.toLowerCase().includes(searchText.toLowerCase())
                                                ).map(filter => {
                                                    const isSelected = activeFilters.some(f => f.id === filter.id);
                                                    return (
                                                        <div
                                                            key={filter.id}
                                                            onClick={() => toggleFilter(filter)}
                                                            className={`flex items-center gap-1 p-2 rounded-md cursor-pointer text-sm ${isSelected
                                                                ? "bg-gradient-to-r from-[#C40180] to-[#590248] text-white"
                                                                : "bg-gray-50 hover:bg-gray-100"
                                                                }`}
                                                        >
                                                            <div className={`h-3.5 w-3.5 border rounded flex-shrink-0 ${isSelected ? "border-white bg-white" : "border-gray-300 bg-white"
                                                                }`}>
                                                                {isSelected && <Check size={10} className="text-[#C40180]" />}
                                                            </div>
                                                            <span className="truncate">{filter.label}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* DateRangeFilter */}
                <DateRangeFilter
                    fromDate={fromDate}
                    toDate={toDate}
                    setFromDate={setFromDate}
                    setToDate={setToDate}
                />
            </div>
            {/* Filtros seleccionados como burbujas */}
            <div className="flex flex-wrap gap-2 mb-4 mt-4">
                {/* Burbuja de rango de fechas */}
                {hasDateRange && (
                    <div className="bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        {fromDate && toDate
                            ? `${fromDate} - ${toDate}`
                            : fromDate
                                ? `Desde ${fromDate}`
                                : `Hasta ${toDate}`}
                        <button onClick={clearDates} className="ml-1">
                            <X size={16} />
                        </button>
                    </div>
                )}
                
                {activeFilters.map((filter) => (
                    <div
                        key={filter.id}
                        className="bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                        {filter.label}
                        <button onClick={() => removeFilter(filter.id)} className="ml-1">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}