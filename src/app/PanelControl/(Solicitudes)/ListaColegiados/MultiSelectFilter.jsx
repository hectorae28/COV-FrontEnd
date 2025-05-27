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
    const [activeGroup, setActiveGroup] = useState(null);
    const dropdownRef = useRef(null);
    const [isDateOpen, setIsDateOpen] = useState(false);

    // Obtener estados seleccionados actualmente
    const selectedEstados = activeFilters.filter(f => f.group === "Ubicación");

    // Determinar si debe mostrar municipios (solo si hay exactamente 1 estado seleccionado)
    const shouldShowMunicipios = selectedEstados.length === 1;
    const singleSelectedEstado = shouldShowMunicipios ? selectedEstados[0] : null;

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

        // Asegurar que existe el grupo Municipio solo si debe mostrarse
        if (!groups["Municipio"] && shouldShowMunicipios) {
            groups["Municipio"] = [];
        }

        setFilterGroups(groups);

        // Si no hay grupo activo, seleccionar el primero
        if (!activeGroup && Object.keys(groups).length > 0) {
            setActiveGroup(Object.keys(groups)[0]);
        }
    }, [allFilters, activeGroup, shouldShowMunicipios]);

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
        const exclusiveGroups = {
            "documentos-status": ["documentos-incompletos", "documentos-completos", "documentos-pendientes", "documentos-rechazados"],
            "pagos-status": ["pagos-exonerados", "pagos-pendientes"],
            "estado-laboral": ["laborando", "no-laborando"],
            "genero": ["masculino", "femenino", "otros"]
        };

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

    // Manejar selección/deselección de filtro - MEJORADO
    const toggleFilter = (filter) => {
        const isConflicting = checkFilterConflicts(filter);
        if (isConflicting) return;

        let newFilters;
        const exists = activeFilters.some((f) => f.id === filter.id);

        if (exists) {
            if (filter.group === "Ubicación") {
                // Al quitar un estado, también quitar sus municipios relacionados
                newFilters = activeFilters.filter((f) =>
                    f.id !== filter.id && !(f.group === "Municipio" && f.relatedTo === filter.id)
                );
            } else {
                newFilters = activeFilters.filter((f) => f.id !== filter.id);
            }
        } else {
            if (filter.group === "Ubicación") {
                // Al agregar un estado, NO cambiar automáticamente al grupo Municipio
                // Solo limpiar municipios de otros estados si es necesario
                const otherMunicipios = activeFilters.filter(f =>
                    f.group === "Municipio" && f.relatedTo && f.relatedTo !== filter.id
                );

                // Si vamos a tener más de 1 estado, eliminar todos los municipios
                const currentEstados = activeFilters.filter(f => f.group === "Ubicación");
                if (currentEstados.length >= 1) {
                    newFilters = [
                        ...activeFilters.filter(f => f.group !== "Municipio"),
                        filter
                    ];
                } else {
                    newFilters = [...activeFilters, filter];
                }
            } else {
                newFilters = [...activeFilters, filter];
            }
        }

        setActiveFilters(newFilters);
    };

    // Eliminar un filtro - MEJORADO
    const removeFilter = (filterId) => {
        setActiveFilters((prev) => {
            const filter = prev.find(f => f.id === filterId);
            if (filter?.group === "Ubicación") {
                // Al eliminar un estado, también eliminar sus municipios relacionados
                return prev.filter((f) =>
                    f.id !== filterId && !(f.group === "Municipio" && f.relatedTo === filter.id)
                );
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

    // Obtener municipios del estado seleccionado - MEJORADO
    const getMunicipiosByEstado = () => {
        if (!singleSelectedEstado) return [];

        const estadoNombre = singleSelectedEstado.value.toLowerCase();
        const municipios = EstadoData[estadoNombre] || [];

        return municipios.map(municipio => ({
            id: `municipio-${municipio.toLowerCase().replace(/\s+/g, '-')}-${singleSelectedEstado.id}`,
            group: "Municipio",
            label: municipio,
            value: municipio,
            relatedTo: singleSelectedEstado.id
        }));
    };

    // Obtener todas las universidades
    const getUniversidades = () => {
        let allUniversities = [];
        Object.keys(UniversidadData).forEach(estado => {
            const universidades = UniversidadData[estado] || [];
            universidades.forEach(universidad => {
                if (!allUniversities.some(u => u.acronimo === universidad.acronimo)) {
                    allUniversities.push(universidad);
                }
            });
        });

        allUniversities.sort((a, b) => a.nombre.localeCompare(b.nombre));

        return allUniversities.map(universidad => ({
            id: `universidad-${universidad.acronimo.toLowerCase()}`,
            group: "Universidad",
            label: `${universidad.nombre} (${universidad.acronimo})`,
            value: universidad.acronimo
        }));
    };

    // Obtener lista de estados como strings - CORREGIDO
    const getEstadosAsStrings = () => {
        // Asegurar que estados sea un array de strings
        if (Array.isArray(estados) && estados.length > 0) {
            if (typeof estados[0] === 'string') {
                return estados;
            } else if (typeof estados[0] === 'object' && estados[0].label) {
                return estados.map(e => e.label);
            }
        }
        // Fallback: extraer desde EstadoData
        return Object.keys(EstadoData).map(key =>
            key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()
        );
    };

    const hasDateRange = fromDate || toDate;
    const isDistritoCapital = singleSelectedEstado &&
        singleSelectedEstado.value.toLowerCase().includes('distrito');

    return (
        <div className="mb-6">
            {/* Controles de filtros */}
            <div className="flex flex-wrap items-center gap-2">
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
                        <span>Filtros</span>
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
                                {/* Chips de categorías - MEJORADO */}
                                <div className="mb-3 flex flex-wrap gap-1">
                                    {Object.keys(filterGroups)
                                        .filter(group => {
                                            if (group === "Municipio") {
                                                return shouldShowMunicipios; // Solo mostrar si hay exactamente 1 estado
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
                                                {group === "Municipio"
                                                    ? (isDistritoCapital ? 'Parroquias' : 'Municipios')
                                                    : group}
                                                {group === "Municipio" && singleSelectedEstado && (
                                                    <span className="ml-1 opacity-75">({singleSelectedEstado.label})</span>
                                                )}
                                                {group === "Ubicación" && selectedEstados.length > 0 && (
                                                    <span className="ml-1 opacity-75">({selectedEstados.length})</span>
                                                )}
                                            </button>
                                        ))}
                                </div>

                                {/* Filtros de la categoría activa */}
                                {activeGroup && (
                                    <div className="rounded-lg bg-white shadow-md p-4 border">
                                        <h3 className="font-medium mb-2">
                                            {activeGroup === "Municipio" && isDistritoCapital
                                                ? 'Parroquias'
                                                : activeGroup}
                                            {activeGroup === "Municipio" && singleSelectedEstado && (
                                                <span className="text-sm font-normal text-gray-500 ml-2">
                                                    Ubicación: {singleSelectedEstado.label}
                                                </span>
                                            )}
                                            {activeGroup === "Ubicación" && selectedEstados.length > 0 && (
                                                <span className="text-sm font-normal text-gray-500 ml-2">
                                                    ({selectedEstados.length} seleccionado{selectedEstados.length > 1 ? 's' : ''})
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
                                                            if ((edadExacta && edadExacta < 18) || (edadMin && edadMin < 18)) {
                                                                alert("La edad mínima debe ser 18 años");
                                                                return;
                                                            }

                                                            let filtroEdad;
                                                            if (edadExacta) {
                                                                filtroEdad = {
                                                                    id: `edad-${edadExacta}`,
                                                                    group: "Edad",
                                                                    label: `${edadExacta} años`,
                                                                    value: `${edadExacta}-${edadExacta}`
                                                                };
                                                            } else if (edadMin || edadMax) {
                                                                const min = edadMin || '18';
                                                                const max = edadMax || '';

                                                                filtroEdad = {
                                                                    id: `edad-${min}-${max}`,
                                                                    group: "Edad",
                                                                    label: max ? `${min} - ${max} años` : `Desde ${min} años`,
                                                                    value: `${min}-${max}`
                                                                };
                                                            }

                                                            setActiveFilters(prev => prev.filter(f => f.group !== "Edad"));

                                                            if (filtroEdad) {
                                                                setActiveFilters(prev => [...prev, filtroEdad]);
                                                            }

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

                                        {/* Caso especial para Ubicación - MEJORADO */}
                                        {activeGroup === "Ubicación" && (
                                            <div className="space-y-3">
                                                {/* Información sobre selección múltiple */}
                                                <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                                                    💡 Puedes seleccionar múltiples estados.
                                                    {selectedEstados.length === 0 && ""}
                                                    {selectedEstados.length === 1 && " Municipios/Parroquias Disponibles."}
                                                    {selectedEstados.length > 1 && " Con múltiples estados, los Municipios/Parroquias no están disponibles."}
                                                </div>

                                                <div className="grid grid-cols-3 gap-2">
                                                    {getEstadosAsStrings()
                                                        .filter(estado => !searchText ||
                                                            estado.toLowerCase().includes(searchText.toLowerCase()))
                                                        .map(estado => {
                                                            const estadoFilter = {
                                                                id: `ubicacion-${estado.toLowerCase().replace(/\s+/g, '-')}`,
                                                                group: "Ubicación",
                                                                label: estado,
                                                                value: estado
                                                            };
                                                            const isSelected = selectedEstados.some(e => e.id === estadoFilter.id);

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
                                            </div>
                                        )}

                                        {/* Caso especial para Municipios/Parroquias - MEJORADO */}
                                        {activeGroup === "Municipio" && (
                                            <div className="grid grid-cols-3 gap-2">
                                                {shouldShowMunicipios ? (
                                                    getMunicipiosByEstado()
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
                                                        })
                                                ) : (
                                                    <div className="text-center py-4 text-sm text-gray-500 col-span-3">
                                                        <div className="bg-gray-50 p-4 rounded-lg">
                                                            <p className="font-medium mb-2">Municipios no disponibles</p>
                                                            {selectedEstados.length === 0 && (
                                                                <p>Selecciona exactamente 1 estado para ver los municipios disponibles.</p>
                                                            )}
                                                            {selectedEstados.length > 1 && (
                                                                <p>Tienes {selectedEstados.length} estados seleccionados.
                                                                    Deja solo 1 estado para poder seleccionar municipios.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Caso para Universidades */}
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

                {/* Filtros seleccionados como burbujas */}
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