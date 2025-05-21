import { Calendar, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function DateRangeFilter({
    fromDate,
    toDate,
    setFromDate,
    setToDate
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [tempFromDate, setTempFromDate] = useState(fromDate);
    const [tempToDate, setTempToDate] = useState(toDate);
    const hasDateRange = fromDate || toDate;
    const dropdownRef = useRef(null);

    // Update local state when props change
    useEffect(() => {
        setTempFromDate(fromDate);
        setTempToDate(toDate);
    }, [fromDate, toDate]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClear = () => {
        setFromDate('');
        setToDate('');
        setTempFromDate('');
        setTempToDate('');
    };

    const handleApply = () => {
        setFromDate(tempFromDate);
        setToDate(tempToDate);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Always keep the button white/neutral */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border shadow-sm cursor-pointer bg-white text-gray-700 border-gray-300 hover:bg-gray-50">
                {/* Botón principal para abrir el selector */}
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 flex-grow cursor-pointer"
                >
                    <Calendar size={18} />
                    <span>Fecha</span>
                    <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-lg border border-gray-200 shadow-xl z-50 w-80">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                        <input
                            type="date"
                            value={tempFromDate}
                            onChange={(e) => setTempFromDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#C40180] focus:border-[#C40180]"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                        <input
                            type="date"
                            value={tempToDate}
                            onChange={(e) => setTempToDate(e.target.value)}
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
                            onClick={handleApply}
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