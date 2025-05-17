"use client"

import { ChevronRight, Clock, FileText } from "lucide-react"
import Link from "next/link"

const SectionPendientes = () => {
    const pendientesAprobacion = [
        {
            id: "101",
            colegiadoNombre: "María González",
            fecha: "18/04/2025",
            tipo: "Solicitud de inscripción"
        },
        {
            id: "102",
            colegiadoNombre: "Juan Pérez",
            fecha: "17/04/2025",
            tipo: "Renovación de licencia"
        },
        {
            id: "103",
            colegiadoNombre: "Carlos Ramírez",
            fecha: "15/04/2025",
            tipo: "Certificado de ejercicio"
        },
        {
            id: "104",
            colegiadoNombre: "Alberto Rodriguez",
            fecha: "13/04/2025",
            tipo: "Cambio de jurisdicción"
        }
    ]

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-[#41023B]" />
                    Pendientes por Aprobación
                </h3>
                <Link href="PanelControl/ListaColegiados" className="text-[#41023B] text-sm hover:underline flex items-center">
                    Ver todos <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
            <div className="space-y-3">
                {pendientesAprobacion.map((pendiente) => (
                    <Link href={`/admin/solicitudes/${pendiente.id}`} key={pendiente.id}
                        className="border border-gray-100 p-3 rounded-lg flex items-center justify-between hover:bg-gray-50 transition">
                        <div>
                            <p className="font-medium">{pendiente.colegiadoNombre}</p>
                            <p className="text-xs text-gray-500">{pendiente.fecha} - {pendiente.tipo}</p>
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span className="ml-1 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                                Pendiente
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SectionPendientes