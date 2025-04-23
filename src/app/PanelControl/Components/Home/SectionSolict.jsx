"use client"

import Link from "next/link"
import { FileText, ChevronRight, Clock, CheckCircle, XCircle } from "lucide-react"

const SectionSolic = ({ solicitudes }) => {
  // Función para renderizar icono según estado de solicitud
  const renderEstadoIcon = (estado) => {
    switch (estado) {
      case "Pendiente":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Aprobada":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Rechazada":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FileText className="mr-2 h-5 w-5 text-[#41023B]" />
          Últimas Solicitudes
        </h3>
        <Link href="/Solicitudes" className="text-[#41023B] text-sm hover:underline flex items-center">
          Ver todas <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="space-y-3">
        {solicitudes.map((solicitud) => (
          <Link href={`/admin/solicitudes/${solicitud.id}`} key={solicitud.id}
            className="border border-gray-100 p-3 rounded-lg flex items-center justify-between hover:bg-gray-50 transition">
            <div>
              <p className="font-medium">{solicitud.tipo}</p>
              <p className="text-xs text-gray-500">{solicitud.colegiadoNombre} - {solicitud.fecha}</p>
            </div>
            <div className="flex items-center">
              {renderEstadoIcon(solicitud.estado)}
              <span className={`ml-1 text-xs px-2 py-1 rounded-full ${solicitud.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                  solicitud.estado === 'Aprobada' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                }`}>
                {solicitud.estado}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SectionSolic