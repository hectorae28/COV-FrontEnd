import { Calendar, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

export default function DateRangeFilter({
    fromDate,
    toDate,
    setFromDate,
    setToDate
}) {
    const [isOpen, setIsOpen] = useState(false);
    const hasDateRange = fromDate || toDate;

    const handleClear = () => {
        setFromDate('');
        setToDate('');
    };

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
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {/* Reemplazar el botón exterior por un div */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border shadow-sm cursor-pointer ${hasDateRange
                ? "bg-gradient-to-r from-[#C40180] to-[#590248] text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}>
                {/* Botón principal para abrir el selector */}
                <div 
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 flex-grow cursor-pointer"
                >
                    <Calendar size={18} />
                    <span>
                        {hasDateRange
                            ? fromDate && toDate
                                ? `${fromDate} - ${toDate}`
                                : fromDate
                                    ? `Desde ${fromDate}`
                                    : `Hasta ${toDate}`
                            : "Fecha"}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>

                {/* Botón separado para limpiar */}
                {hasDateRange && (
                    <button
                        onClick={handleClear}
                        className="ml-2 text-white hover:text-gray-200"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-lg border border-gray-200 shadow-xl z-50 w-80">
                    <div className="mb-4">
                        <div className="flex gap-2 mb-3">
                            <button
                                onClick={() => applyQuickFilter('week')}
                                className="px-3 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            >
                                Última semana
                            </button>
                            <button
                                onClick={() => applyQuickFilter('month')}
                                className="px-3 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            >
                                Último mes
                            </button>
                        </div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#C40180] focus:border-[#C40180]"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#C40180] focus:border-[#C40180]"
                        />
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={handleClear}
                            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                        >
                            Limpiar
                        </button>
                        <button
                            onClick={() => {
                                console.log("Fechas aplicadas:", fromDate, toDate); // Para depuración
                                setIsOpen(false);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white text-sm font-medium rounded-md hover:opacity-90"
                        >
                            Aplicar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}