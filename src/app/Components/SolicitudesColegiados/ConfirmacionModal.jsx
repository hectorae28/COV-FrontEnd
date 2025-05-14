import { CheckCircle } from "lucide-react"

const ConfirmacionModal = ({ onCancel, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-center justify-center mb-4 text-green-600">
                        <CheckCircle size={40} />
                    </div>
                    <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
                        Confirmar aprobación
                    </h3>
                    <p className="text-center text-gray-600 mb-6">
                        ¿Está seguro que desea aprobar esta solicitud? Una vez aprobada, no podrá revertir esta acción.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onCancel}
                            className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Confirmar aprobación
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmacionModal