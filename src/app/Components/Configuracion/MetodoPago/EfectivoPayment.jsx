export default function EfectivoPayment({ formData, onChange }) {
    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección completa *
                </label>
                <textarea
                    name="datos_adicionales.direccion"
                    value={formData.datos_adicionales.direccion || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: Av. Principal, Edificio Torre Plaza, Piso 5, Oficina 501"
                    rows="2"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horarios de atención *
                </label>
                <textarea
                    name="datos_adicionales.horarios"
                    value={formData.datos_adicionales.horarios || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: Lunes a Viernes: 8:00 AM - 4:00 PM"
                    rows="2"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contacto responsable
                </label>
                <input
                    type="text"
                    name="datos_adicionales.contacto_responsable"
                    value={formData.datos_adicionales.contacto_responsable || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: María González - Tesorería"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referencias de ubicación
                </label>
                <textarea
                    name="datos_adicionales.referencias_ubicacion"
                    value={formData.datos_adicionales.referencias_ubicacion || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: Frente al Metro Los Leones, al lado del Banco Provincial"
                    rows="2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Información adicional
                </label>
                <textarea
                    name="datos_adicionales.datos_cuenta"
                    value={formData.datos_adicionales.datos_cuenta || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Información adicional sobre el pago en efectivo"
                    rows="2"
                />
            </div>
        </>
    );
}