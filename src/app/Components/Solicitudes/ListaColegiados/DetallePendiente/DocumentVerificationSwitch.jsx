import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function DocumentVerificationSwitch({
    documento,
    onChange,
    readOnly = false,
    status = 'pending' // pending, approved, rejected
}) {
    const [isRejectionOpen, setIsRejectionOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState(documento.rejectionReason || '');

    const handleStatusChange = (newStatus) => {
        if (readOnly) return;

        if (newStatus === 'rejected') {
            setIsRejectionOpen(true);
        } else {
            onChange({
                ...documento,
                status: newStatus,
                rejectionReason: ''
            });
        }
    };

    const submitRejection = () => {
        onChange({
            ...documento,
            status: 'rejected',
            rejectionReason
        });
        setIsRejectionOpen(false);
    };

    return (
        <div className="relative">
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => handleStatusChange('approved')}
                    disabled={readOnly}
                    className={`p-2 rounded-md transition-all ${status === 'approved'
                            ? 'bg-green-100 text-green-700 ring-2 ring-green-500'
                            : 'bg-gray-100 text-gray-500 hover:bg-green-50'
                        } ${readOnly && status !== 'approved' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={readOnly ? "No se puede modificar un documento aprobado" : "Aprobar documento"}
                >
                    <CheckCircle size={20} />
                </button>

                <button
                    onClick={() => handleStatusChange('rejected')}
                    disabled={readOnly}
                    className={`p-2 rounded-md transition-all ${status === 'rejected'
                            ? 'bg-red-100 text-red-700 ring-2 ring-red-500'
                            : 'bg-gray-100 text-gray-500 hover:bg-red-50'
                        } ${readOnly && status !== 'rejected' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={readOnly ? "No se puede modificar un documento aprobado" : "Rechazar documento"}
                >
                    <XCircle size={20} />
                </button>

                <span className="text-sm font-medium">
                    {status === 'approved' && 'Aprobado'}
                    {status === 'rejected' && 'Rechazado'}
                    {status === 'pending' && 'Pendiente'}
                </span>
            </div>

            {/* Modal de razón de rechazo */}
            {isRejectionOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                            <AlertTriangle className="text-red-500 mr-2" size={20} />
                            Motivo de rechazo
                        </h3>

                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:border-red-400"
                            placeholder="Explique por qué rechaza este documento..."
                            rows={4}
                        />

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setIsRejectionOpen(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={submitRejection}
                                disabled={!rejectionReason.trim()}
                                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${!rejectionReason.trim() ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                Confirmar rechazo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mostrar motivo del rechazo si existe */}
            {status === 'rejected' && documento.rejectionReason && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-md">
                    <span className="font-medium">Motivo de rechazo:</span> {documento.rejectionReason}
                </div>
            )}
        </div>
    );
}