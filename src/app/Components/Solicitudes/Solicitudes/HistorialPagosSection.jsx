import { FileCheck, Eye, Download, Clock, CheckCircle, XCircle } from "lucide-react"

const HistorialPagosSection = ({ comprobantes, onVerDocumento }) => {
    // Función para obtener el color y texto según el estado
    const getStatusInfo = (status) => {
        switch(status) {
            case 'aprobado':
                return {
                    bgColor: 'bg-green-50',
                    textColor: 'text-green-700',
                    icon: <CheckCircle size={14} className="mr-1" />,
                    text: 'Aprobado'
                };
            case 'rechazado':
                return {
                    bgColor: 'bg-red-50',
                    textColor: 'text-red-700',
                    icon: <XCircle size={14} className="mr-1" />,
                    text: 'Rechazado'
                };
            default: // 'revisando' u otros estados
                return {
                    bgColor: 'bg-yellow-50',
                    textColor: 'text-yellow-700',
                    icon: <Clock size={14} className="mr-1" />,
                    text: 'En revisión'
                };
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-5">
            <h2 className="text-base font-medium text-gray-900 mb-3 flex items-center">
                <FileCheck size={18} className="mr-2 text-green-600" />
                Comprobantes de pago
            </h2>

            <div className="space-y-3">
                {comprobantes.map((comprobante, index) => {
                    const statusInfo = getStatusInfo(comprobante.status);
                    const hasComprobante = comprobante.comprobante_url !== null && comprobante.comprobante_url !== undefined;
                    const comprobanteName = hasComprobante ? 
                        (typeof comprobante.comprobante_url === 'object' ? comprobante.comprobante_url.nombre : 'Comprobante') : 
                        'Sin comprobante';
                    
                    return (
                        <div key={index} className={`border rounded-lg p-3 flex justify-between items-center ${statusInfo.bgColor} bg-opacity-30`}>
                            <div className="flex items-center">
                                <FileCheck size={18} className="text-green-500 mr-2" />
                                <div>
                                    <div className="flex items-center">
                                        <p className="font-medium">{comprobanteName}</p>
                                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs flex items-center ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                                            {statusInfo.icon}
                                            {statusInfo.text}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 text-xs text-gray-500 gap-x-4 mt-1">
                                        <p>Método: {comprobante.metodo_de_pago?.nombre || comprobante.metodo_de_pago}</p>
                                        <p>Monto: {comprobante.moneda === 'usd' ? '$' : 'Bs.'}{parseFloat(comprobante.monto).toFixed(2)}</p>
                                        <p>Referencia: {comprobante.num_referencia}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                {hasComprobante ? (
                                    <button
                                        onClick={() => onVerDocumento(comprobante.comprobante_url.url || comprobante.comprobante_url)}
                                        className="text-blue-600 hover:text-blue-800 p-1"
                                        title="Ver comprobante"
                                    >
                                        <Eye size={16} />
                                    </button>
                                ) : (
                                    <button
                                        className="text-gray-400 cursor-not-allowed p-1"
                                        title="No hay comprobante disponible"
                                        disabled
                                    >
                                        <Eye size={16} />
                                    </button>
                                )}
                                {hasComprobante && (
                                    <button 
                                        onClick={() => window.open(`${process.env.NEXT_PUBLIC_BACK_HOST}${comprobante.comprobante_url.url || comprobante.comprobante_url}`, '_blank')}
                                        className="text-blue-600 hover:text-blue-800 p-1"
                                        title="Descargar comprobante"
                                    >
                                        <Download size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default HistorialPagosSection