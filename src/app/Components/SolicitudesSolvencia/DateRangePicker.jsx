const DateRangePicker = ({ fechaInicio, fechaFin, setFechaInicio, setFechaFin }) => {
    return (
        <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="w-full sm:w-auto flex-1">
                <label htmlFor="fechaInicio" className="block text-xs font-medium text-gray-700 mb-1">
                    Desde
                </label>
                <input
                    type="date"
                    id="fechaInicio"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
            </div>

            <div className="w-full sm:w-auto flex-1">
                <label htmlFor="fechaFin" className="block text-xs font-medium text-gray-700 mb-1">
                    Hasta
                </label>
                <input
                    type="date"
                    id="fechaFin"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    min={fechaInicio} // No permitir seleccionar fechas anteriores a la fecha de inicio
                />
            </div>
        </div>
    );
};

export default DateRangePicker;