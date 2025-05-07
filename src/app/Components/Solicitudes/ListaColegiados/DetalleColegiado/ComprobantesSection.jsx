import { CreditCard, CheckCircle, Eye } from "lucide-react"

export default function ComprobantesSection({ documentos, handleVerDocumento }) {
    // Filtrar solo comprobantes de pago
    const comprobantes = documentos?.filter(
        doc => doc.id.includes('comprobante_pago') || doc.nombre.toLowerCase().includes('comprobante')
    ) || [];

    // Función para determinar si un comprobante es de exoneración
    const isExonerado = (documento) => {
        return documento && documento.archivo && documento.archivo.toLowerCase().includes('exonerado');
    };

    if (comprobantes.length === 0) {
        return (
            <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Comprobantes de pago</h3>
                <div className="bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center">
                    <CreditCard size={40} className="text-gray-300 mb-3" />
                    <p className="text-gray-500 text-center">No hay comprobantes de pago registrados</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Comprobantes de pago</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comprobantes.map((comprobante) => (
                    <div
                        key={comprobante.id}
                        className={`border rounded-lg ${isExonerado(comprobante)
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 hover:shadow-md"
                            } transition-all duration-200`}
                    >
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <div className={`${isExonerado(comprobante)
                                            ? "bg-green-100"
                                            : "bg-purple-100"
                                            } p-2 rounded-md mr-3`}>
                                            {isExonerado(comprobante) ? (
                                                <CheckCircle className="text-green-500" size={20} />
                                            ) : (
                                                <CreditCard className="text-purple-600" size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{comprobante.nombre}</h3>
                                            <p className="text-xs text-gray-500">{comprobante.descripcion}</p>
                                        </div>
                                    </div>

                                    {/* Mensaje para exonerados */}
                                    {isExonerado(comprobante) && (
                                        <div className="mt-2 flex items-start bg-green-100 p-2 rounded text-xs text-green-600">
                                            <CheckCircle size={14} className="mr-1 flex-shrink-0 mt-0.5" />
                                            <span>Exonerado por administración</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleVerDocumento(comprobante)}
                                    className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                                    title="Ver comprobante"
                                >
                                    <Eye size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}