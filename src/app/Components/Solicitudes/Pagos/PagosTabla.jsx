"use client"

export default function PagosTabla({
    pagosFiltrados,
    getTipoPago,
    formatearMonto,
    normalizarEstado,
    obtenerClaseEstado,
    verDetallePago
}) {
    if (pagosFiltrados.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No se encontraron pagos con los criterios seleccionados
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            Fecha
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Método de Pago
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monto
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {pagosFiltrados.map((pago) => (
                        <tr
                            key={pago.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => verDetallePago(pago.id)}
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="flex items-center justify-center">
                                    <div className="text-sm font-medium text-gray-900">{getTipoPago(pago)}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell text-center">
                                <div className="text-sm text-gray-500">
                                    {new Date(pago.fecha_pago).toLocaleDateString('es-ES')}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="text-sm text-gray-900">{pago.metodo_de_pago_nombre || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="text-sm font-semibold text-gray-900">
                                    {pago.moneda === 'usd' ? (
                                        formatearMonto(pago)
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <div className="text-sm font-semibold text-gray-800">{formatearMonto(pago).montoUsd}</div>
                                            <div className="text-sm text-gray-400">{formatearMonto(pago).montoBs}</div>
                                            <div className="text-xs text-gray-400">{formatearMonto(pago).tasa}</div>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenerClaseEstado(pago.status)}`}>
                                    {normalizarEstado(pago.status)}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}