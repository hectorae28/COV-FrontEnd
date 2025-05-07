import { AlertCircle } from "lucide-react";

export default function ValidationAlert() {
    return (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <div className="flex items-center">
                <AlertCircle className="text-red-500 mr-2" size={20} />
                <h4 className="text-sm font-medium text-red-800">
                    Por favor corrige los campos obligatorios en todas las secciones
                </h4>
            </div>
            <p className="mt-1 text-xs text-red-600">
                Revisa todas las pestañas para asegurarte de que todos los campos requeridos estén completados.
            </p>
        </div>
    );
}