export default function PaypalPayment({ formData, onChange }) {
    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email de PayPal *
                </label>
                <input
                    type="email"
                    name="datos_adicionales.email_pago"
                    value={formData.datos_adicionales.email_pago || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: pagos@elcov.org"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de pago directo (opcional)
                </label>
                <input
                    type="url"
                    name="datos_adicionales.url_pago"
                    value={formData.datos_adicionales.url_pago || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: https://www.paypal.com/paypalme/elcov"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Comisión fija ($)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="datos_adicionales.comision_fija"
                        value={formData.datos_adicionales.comision_fija || ""}
                        onChange={onChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                        placeholder="0.30"
                    />
                </div>

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
                        placeholder="5.4"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Información de PayPal
                </label>
                <textarea
                    name="datos_adicionales.datos_cuenta"
                    value={formData.datos_adicionales.datos_cuenta || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Información adicional sobre PayPal"
                    rows="3"
                />
            </div>

            <div className="flex items-center bg-blue-50 p-3 rounded-lg border border-blue-200">
                <input
                    type="checkbox"
                    id="incluye-comision"
                    name="datos_adicionales.incluye_comision"
                    checked={formData.datos_adicionales.incluye_comision}
                    onChange={onChange}
                    className="cursor-pointer h-5 w-5 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                />
                <label htmlFor="incluye-comision" className="ml-3 text-sm font-medium text-blue-800">
                    La comisión está incluida en el monto mostrado
                </label>
            </div>

            <div className="flex items-center bg-blue-50 p-3 rounded-lg border border-blue-200">
                <input
                    type="checkbox"
                    id="api-paypal"
                    name="datos_adicionales.api"
                    checked={formData.datos_adicionales.api}
                    onChange={onChange}
                    className="cursor-pointer h-5 w-5 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                />
                <label htmlFor="api-paypal" className="ml-3 text-sm font-medium text-blue-800">
                    Integración con API de PayPal
                </label>
            </div>
        </>
    );
}