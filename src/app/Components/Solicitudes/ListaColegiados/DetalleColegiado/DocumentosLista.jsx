import { FileText, Eye } from "lucide-react"

export default function DocumentosLista({ documentos, handleVerDocumento }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Documentos</h3>
                    <p className="text-sm text-gray-500 mt-1">Documentación del colegiado</p>
                </div>
            </div>

            {documentos && documentos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Aquí es donde necesitas filtrar los documentos */}
                    {documentos
                        .filter(doc => !doc.id.includes('comprobante_pago') && !doc.nombre.toLowerCase().includes('comprobante'))
                        .map((documento) => (
                            <div
                                key={documento.id}
                                className="border rounded-lg border-gray-200 hover:border-[#C40180] hover:shadow-md transition-all duration-200"
                            >
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <div className="bg-[#F9E6F3] p-2 rounded-md mr-3">
                                                    <FileText
                                                        className="text-[#C40180]"
                                                        size={20}
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900 flex items-center">
                                                        {documento.nombre}
                                                        {documento.requerido && <span className="text-red-500 ml-1">*</span>}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">{documento.descripcion}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleVerDocumento(documento)}
                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                                            title="Ver documento"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <div className="bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center">
                    <FileText size={40} className="text-gray-300 mb-3" />
                    <p className="text-gray-500 text-center">No hay documentos disponibles</p>
                </div>
            )}
        </div>
    )
}