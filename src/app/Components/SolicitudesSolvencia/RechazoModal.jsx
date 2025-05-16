import { XCircle } from "lucide-react"

const RechazoModal = ({ motivoRechazo, setMotivoRechazo, onCancel, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-center justify-center mb-4 text-red-600">
                        <XCircle size={40} />
                    </div>
                    <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
                        Rechazar solvencia
                    </h3>
                    <p className="text-center text-gray-600 mb-4">
                        Está a punto de rechazar esta solvencia. Por favor, indique el motivo.
                    </p>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Motivo del rechazo <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={motivoRechazo}
                            onChange={(e) => setMotivoRechazo(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Ingrese el motivo del rechazo"
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onCancel}
                            className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Rechazar solvencia
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RechazoModal