import { X, FileCheck, Download, Eye } from "lucide-react"

const HistorialPagosModal = ({ comprobantes, onClose, onVerDocumento }) => {
    return (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">
                        Historial de Pagos
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-4">
                    {comprobantes.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            No se encontraron registros de pagos
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
                                <p className="text-sm text-blue-800">
                                    <span className="font-semibold">Información:</span> A continuación se muestra el historial de pagos realizados para esta solicitud.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {comprobantes.map((comprobante) => (
                                    <div key={comprobante.id} className="border rounded-lg p-3 flex justify-between items-center bg-gray-50">
                                        <div className="flex items-center">
                                            <FileCheck size={18} className="text-green-500 mr-2" />
                                            <div>
                                                <p className="font-medium">{comprobante.archivo}</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 text-xs text-gray-500 gap-x-4">
                                                    <p>Fecha: {comprobante.fecha}</p>
                                                    <p>Monto: ${parseFloat(comprobante.monto).toFixed(2)}</p>
                                                    <p>Método: {comprobante.metodoPago}</p>
                                                    <p>Referencia: {comprobante.referencia}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => onVerDocumento(comprobante.archivo)}
                                                className="text-blue-600 hover:text-blue-800 p-1"
                                                title="Ver documento"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className="text-blue-600 hover:text-blue-800 p-1"
                                                title="Descargar documento"
                                            >
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Resumen de pagos */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <h4 className="font-medium text-gray-800 mb-2">Resumen</h4>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-600">Total pagado:</span>
                                        <span className="font-medium text-green-600">
                                            ${comprobantes.reduce((sum, item) => sum + parseFloat(item.monto), 0).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Cantidad de pagos:</span>
                                        <span className="font-medium">{comprobantes.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t p-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HistorialPagosModal