import { X } from "lucide-react";
export default function FilterSection({
    tabActivo,
    filtroFecha,
    setFiltroFecha,
    filtrosEstado,
    setFiltrosEstado,
    filtrosEspecialidad,
    setFiltrosEspecialidad,
    filtroEtiqueta,
    setFiltroEtiqueta,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta
}) {
    // Función para manejar filtros múltiples (toggle)
    const toggleFiltroEstado = (estado) => {
        setFiltrosEstado(prev =>
            prev.includes(estado)
                ? prev.filter(item => item !== estado)
                : [...prev, estado]
        );
    };

    const toggleFiltroEspecialidad = (especialidad) => {
        setFiltrosEspecialidad(prev =>
            prev.includes(especialidad)
                ? prev.filter(item => item !== especialidad)
                : [...prev, especialidad]
        );
    };

    // Lista de especialidades ordenadas alfabéticamente
    const especialidades = [
        "Armonización facial",
        "Cirugía bucal",
        "Cirugía bucomaxilofacial",
        "Endodoncia",
        "Ortodoncia"
    ];

    // Renderizar filtros basados en el tab activo
    if (tabActivo === "registrados") {
        return (
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Filtros:</h3>
                <div className="flex flex-wrap gap-3">
                    {/* Filtro de estado de solvencia - selección múltiple */}
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Estado de solvencia</p>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${filtrosEstado.length === 0
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                onClick={() => setFiltrosEstado([])}
                            >
                                Todos
                            </button>
                            <button
                                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${filtrosEstado.includes("solventes")
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                onClick={() => toggleFiltroEstado("solventes")}
                            >
                                Solventes
                            </button>
                            <button
                                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${filtrosEstado.includes("noSolventes")
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                onClick={() => toggleFiltroEstado("noSolventes")}
                            >
                                No Solventes
                            </button>
                            <button
                                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${filtrosEstado.includes("solicitudes")
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                onClick={() => toggleFiltroEstado("solicitudes")}
                            >
                                Con Solicitudes
                            </button>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mb-1">Profesión/Ocupación</p>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${filtrosEspecialidad.length === 0
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                onClick={() => setFiltrosEspecialidad([])}
                            >
                                Todas
                            </button>
                            {especialidades.map(esp => (
                                <button
                                    key={esp}
                                    className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${filtrosEspecialidad.includes(esp)
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    onClick={() => toggleFiltroEspecialidad(esp)}
                                >
                                    {esp}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (["pendientes", "rechazados", "anulados"].includes(tabActivo)) {
        return (
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Filtros:</h3>
                <div className="flex flex-wrap gap-5">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Fecha de Solicitud</p>
                        <div className="flex gap-2">
                            <button
                                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${filtroFecha === "todas"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                onClick={() => setFiltroFecha("todas")}
                            >
                                Todas
                            </button>
                            <button
                                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${filtroFecha === "semana"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                onClick={() => setFiltroFecha("semana")}
                            >
                                Última Semana
                            </button>
                            <button
                                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${filtroFecha === "mes"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                onClick={() => setFiltroFecha("mes")}
                            >
                                Último Mes
                            </button>
                        </div>
                    </div>

                    {/* Nuevo filtro de rango de fechas */}
                    <div>
                        <div className="flex gap-2 items-center">
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">
                                    Desde
                                </label>
                                <input
                                    type="date"
                                    value={fechaDesde}
                                    onChange={(e) => setFechaDesde(e.target.value)}
                                    className="px-2 py-1 border rounded text-sm w-full"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">
                                    Hasta
                                </label>
                                <input
                                    type="date"
                                    value={fechaHasta}
                                    onChange={(e) => setFechaHasta(e.target.value)}
                                    className="px-2 py-1 border rounded text-sm w-full"
                                />
                            </div>
                            {(fechaDesde || fechaHasta) && (
                                <button
                                    onClick={() => {
                                        setFechaDesde("");
                                        setFechaHasta("");
                                    }}
                                    className="cursor-pointer mt-4 text-gray-500 hover:text-red-500"
                                    title="Limpiar fechas"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mb-1">Etiquetas</p>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${filtroEtiqueta === "todos"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                onClick={() => setFiltroEtiqueta("todos")}
                            >
                                Todos
                            </button>
                            <button
                                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${filtroEtiqueta === "documentosIncompletos"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                onClick={() => setFiltroEtiqueta("documentosIncompletos")}
                            >
                                Documentos Incompletos
                            </button>
                            <button
                                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${filtroEtiqueta === "pagosPendientes"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                onClick={() => setFiltroEtiqueta("pagosPendientes")}
                            >
                                Pagos Pendientes
                            </button>
                            <button
                                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${filtroEtiqueta === "pagosExonerados"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                onClick={() => setFiltroEtiqueta("pagosExonerados")}
                            >
                                Pagos Exonerados
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}