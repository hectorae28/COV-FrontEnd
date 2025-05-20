import { FileCheck, Eye, Download } from "lucide-react"

const HistorialPagosSection = ({ comprobantes, onVerDocumento }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-5">
            <h2 className="text-base font-medium text-gray-900 mb-3 flex items-center">
                <FileCheck size={18} className="mr-2 text-green-600" />
                Comprobantes de pago
            </h2>

            <div className="space-y-3">
                {comprobantes.map((comprobante,index) => (
                    <div key={index} className="border rounded-lg p-3 flex justify-between items-center bg-gray-50">
                        <div className="flex items-center">
                            <FileCheck size={18} className="text-green-500 mr-2" />
                            <div>
                                <p className="font-medium">{comprobante.archivo}</p>
                                <div className="grid grid-cols-2 text-xs text-gray-500 gap-x-4">
                                    <p>Fecha: {comprobante?.fecha || 'No especificada'}</p>
                                    <p>Monto: ${parseFloat(comprobante.monto).toFixed(2)}</p>
                                    <p>Método: {comprobante.metodo_de_pago}</p>
                                    <p>Referencia: {comprobante.num_referencia}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => onVerDocumento(comprobante.archivo)}
                                className="text-blue-600 hover:text-blue-800 p-1"
                            >
                                <Eye size={16} />
                            </button>
                            <button className="text-blue-600 hover:text-blue-800 p-1">
                                <Download size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HistorialPagosSection