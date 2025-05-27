export default function PuntoVentaPayment({ formData, onChange }) {
    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID del Terminal / POS
                </label>
                <input
                    type="text"
                    name="datos_adicionales.terminal_id"
                    value={formData.datos_adicionales.terminal_id || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: T001234567"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del comercio *
                </label>
                <input
                    type="text"
                    name="datos_adicionales.comercio"
                    value={formData.datos_adicionales.comercio || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: Colegio Odontólogos Venezuela"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Comisión (%)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        name="datos_adicionales.comision_porcentaje"
                        value={formData.datos_adicionales.comision_porcentaje || ""}
                        onChange={onChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                        placeholder="3.5"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monto mínimo
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="datos_adicionales.monto_minimo"
                        value={formData.datos_adicionales.monto_minimo || ""}
                        onChange={onChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                        placeholder="10.00"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monto máximo
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="datos_adicionales.monto_maximo"
                        value={formData.datos_adicionales.monto_maximo || ""}
                        onChange={onChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                        placeholder="5000.00"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Información del terminal
                </label>
                <textarea
                    name="datos_adicionales.datos_cuenta"
                    value={formData.datos_adicionales.datos_cuenta || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Información adicional del punto de venta"
                    rows="2"
                />
            </div>

            <div className="flex items-center bg-blue-50 p-3 rounded-lg border border-blue-200">
                <input
                    type="checkbox"
                    id="api-pos"
                    name="datos_adicionales.api"
                    checked={formData.datos_adicionales.api}
                    onChange={onChange}
                    className="cursor-pointer h-5 w-5 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                />
                <label htmlFor="api-pos" className="ml-3 text-sm font-medium text-blue-800">
                    Integración con API del punto de venta
                </label>
            </div>
        </>
    );
}