import { Smartphone } from "lucide-react";

const metodosPago = [
    {
        id: "zelle",
        nombre: "Zelle",
        descripcion: "Transferencias rápidas con Zelle",
        icon: Smartphone,
    },
    {
        id: "zinli",
        nombre: "Zinli",
        descripcion: "Pagos digitales con Zinli",
        icon: Smartphone,
    }
];

export default function OtrosPayment({ formData, onChange }) {
    const renderCamposZelle = () => (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email de Zelle *
                </label>
                <input
                    type="email"
                    name="datos_adicionales.email_pago"
                    value={formData.datos_adicionales.email_pago || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: zelle@elcov.org"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono de Zelle (opcional)
                </label>
                <input
                    type="tel"
                    name="datos_adicionales.telefono_pago"
                    value={formData.datos_adicionales.telefono_pago || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: +1 555 123 4567"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del beneficiario *
                </label>
                <input
                    type="text"
                    name="datos_adicionales.nombre_beneficiario"
                    value={formData.datos_adicionales.nombre_beneficiario || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: John Doe"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monto mínimo ($)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="datos_adicionales.monto_minimo"
                        value={formData.datos_adicionales.monto_minimo || ""}
                        onChange={onChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                        placeholder="1.00"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monto máximo ($)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="datos_adicionales.monto_maximo"
                        value={formData.datos_adicionales.monto_maximo || ""}
                        onChange={onChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                        placeholder="2500.00"
                    />
                </div>
            </div>
        </>
    );

    const renderCamposZinli = () => (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email de Zinli *
                </label>
                <input
                    type="email"
                    name="datos_adicionales.email_pago"
                    value={formData.datos_adicionales.email_pago || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: zinli@elcov.org"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono de Zinli *
                </label>
                <input
                    type="tel"
                    name="datos_adicionales.telefono_pago"
                    value={formData.datos_adicionales.telefono_pago || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: +58 412 123 4567"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del beneficiario *
                </label>
                <input
                    type="text"
                    name="datos_adicionales.nombre_beneficiario"
                    value={formData.datos_adicionales.nombre_beneficiario || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: María González"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monto mínimo ($)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="datos_adicionales.monto_minimo"
                        value={formData.datos_adicionales.monto_minimo || ""}
                        onChange={onChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                        placeholder="5.00"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monto máximo ($)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="datos_adicionales.monto_maximo"
                        value={formData.datos_adicionales.monto_maximo || ""}
                        onChange={onChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                        placeholder="1000.00"
                    />
                </div>
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
                    placeholder="2.5"
                />
            </div>
        </>
    );

    return (
        <>
            {/* Selector de subtipo para métodos "otros" */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar método de pago *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {metodosPago.map((metodo) => {
                        const IconComponent = metodo.icon;
                        return (
                            <div
                                key={metodo.id}
                                className={`border rounded-lg p-3 cursor-pointer transition-all ${formData.subtipo_metodo === metodo.id
                                    ? "border-[#D7008A] bg-[#D7008A]/5"
                                    : "border-gray-200 hover:border-gray-300"
                                    }`}
                                onClick={() => onChange({
                                    target: { name: "subtipo_metodo", value: metodo.id }
                                })}
                            >
                                <div className="flex items-center">
                                    <IconComponent className={`w-5 h-5 mr-3 ${formData.subtipo_metodo === metodo.id ? "text-[#D7008A]" : "text-gray-400"
                                        }`} />
                                    <div>
                                        <div className="font-medium text-sm">{metodo.nombre}</div>
                                        <div className="text-xs text-gray-500">{metodo.descripcion}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Campos específicos según el subtipo seleccionado */}
            {formData.subtipo_metodo === "zelle" && renderCamposZelle()}
            {formData.subtipo_metodo === "zinli" && renderCamposZinli()}

            {formData.subtipo_metodo && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Información adicional
                    </label>
                    <textarea
                        name="datos_adicionales.datos_cuenta"
                        value={formData.datos_adicionales.datos_cuenta || ""}
                        onChange={onChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                        placeholder={`Información adicional sobre ${formData.subtipo_metodo}`}
                        rows="2"
                    />
                </div>
            )}

            {!formData.subtipo_metodo && (
                <div className="text-center py-8 text-gray-500">
                    <p>Selecciona un método de pago para configurar sus detalles</p>
                </div>
            )}
        </>
    );
}