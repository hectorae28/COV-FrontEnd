import { FileText, Eye } from "lucide-react"

const DocumentosSection = ({ solicitud, onVerDocumento }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-5">
            <h2 className="text-base font-medium text-gray-900 mb-3 flex items-center">
                <FileText className="mr-2 text-[#C40180] h-5 w-5" />
                Documentos requeridos
            </h2>

            {false ? (
                <div className="text-gray-500 text-sm">No se requieren documentos para esta solicitud</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* {solicitud.documentosRequeridos.map((documento, index) => {
                        const documentoAdjunto = solicitud.documentosAdjuntos.find(doc =>
                            doc.toLowerCase().includes(documento.split(" ")[0].toLowerCase())
                        );

                        return (
                            <div
                                key={index}
                                className={`rounded-lg p-3 flex items-center ${documentoAdjunto ? 'bg-green-50' : 'bg-yellow-50'}`}
                            >
                                <FileText
                                    className={documentoAdjunto ? "text-green-500 mr-2 flex-shrink-0" : "text-yellow-500 mr-2 flex-shrink-0"}
                                    size={18}
                                />
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-medium text-sm text-gray-900 truncate">{documento}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                                        {documentoAdjunto
                                            ? documentoAdjunto
                                            : "Documento pendiente"}
                                    </p>
                                </div>

                                {documentoAdjunto && (
                                    <button
                                        onClick={() => onVerDocumento(documentoAdjunto)}
                                        className="text-blue-600 hover:text-blue-800 p-1 ml-2 flex-shrink-0"
                                    >
                                        <Eye size={16} />
                                    </button>
                                )}
                            </div>
                        )
                    })} */}
                </div>
            )}
        </div>
    )
}

export default DocumentosSection