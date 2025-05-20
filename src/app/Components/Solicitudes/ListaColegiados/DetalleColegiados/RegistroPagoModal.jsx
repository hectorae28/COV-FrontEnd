import { X } from "lucide-react"

export default function RegistroPagoModal({
    onClose,
    onRegistrarPago,
    nuevoPago,
    setNuevoPago,
    nombreColegiado,
    numeroRegistro,
    cedula
}) {
    const handleSubmit = (e) => {
        e.preventDefault()
        onRegistrarPago()
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Registrar nuevo pago</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Colegiado</label>
                        <p className="text-gray-700 font-medium">{nombreColegiado}</p>
                        <p className="text-sm text-gray-500">
                            {numeroRegistro} · {cedula}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Concepto <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={nuevoPago.concepto}
                            onChange={(e) => setNuevoPago({ ...nuevoPago, concepto: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Ej: Cuota anual 2024"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Referencia <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={nuevoPago.referencia}
                            onChange={(e) => setNuevoPago({ ...nuevoPago, referencia: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Ej: REF-12345"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monto (USD) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={nuevoPago.monto}
                                onChange={(e) => setNuevoPago({ ...nuevoPago, monto: e.target.value })}
                                className="w-full pl-8 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Método de pago
                        </label>
                        <select
                            value={nuevoPago.metodoPago}
                            onChange={(e) => setNuevoPago({ ...nuevoPago, metodoPago: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="Transferencia bancaria">Transferencia bancaria</option>
                            <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                            <option value="Zelle">Zelle</option>
                            <option value="Efectivo">Efectivo</option>
                            <option value="Pago móvil">Pago móvil</option>
                        </select>
                    </div>

                    <div className="flex justify-end pt-4 border-t mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 mr-3"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#C40180] text-white rounded-md hover:bg-[#590248] transition-colors"
                        >
                            Registrar pago
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}