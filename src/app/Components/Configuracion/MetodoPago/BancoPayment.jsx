export default function BancoPayment({ formData, onChange }) {
    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de cuenta *
                </label>
                <input
                    type="text"
                    name="datos_adicionales.numero_cuenta"
                    value={formData.datos_adicionales.numero_cuenta || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: 0102-0127-63-0000007511"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titular de la cuenta *
                </label>
                <input
                    type="text"
                    name="datos_adicionales.titular"
                    value={formData.datos_adicionales.titular || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: Colegio de Odontólogos de Venezuela"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    RIF / Identificación fiscal *
                </label>
                <input
                    type="text"
                    name="datos_adicionales.rif"
                    value={formData.datos_adicionales.rif || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: J-00041277-4"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Datos de la cuenta
                </label>
                <textarea
                    name="datos_adicionales.datos_cuenta"
                    value={formData.datos_adicionales.datos_cuenta || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Información adicional de la cuenta bancaria"
                    rows="3"
                />
            </div>
        </>
    );
}