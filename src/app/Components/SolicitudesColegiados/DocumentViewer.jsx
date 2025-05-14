import { FileText, X } from "lucide-react"

const DocumentViewer = ({ documento, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">
                        Documento: {documento}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100">
                    {/* Aquí se mostraría el documento. En este caso usamos un placeholder */}
                    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-200 rounded-lg">
                        <div className="text-center p-6">
                            <FileText size={64} className="mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500">Vista previa no disponible para {documento}</p>
                            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Descargar documento
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DocumentViewer