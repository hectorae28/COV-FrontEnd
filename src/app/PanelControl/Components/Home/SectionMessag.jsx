"use client"

import Link from "next/link"
import { MessageCircle, ChevronRight } from "lucide-react"

const SectionMessag = ({ mensajes }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <MessageCircle className="mr-2 h-5 w-5 text-[#41023B]" />
          Últimos Mensajes
        </h3>
        <Link href="/Mensajes" className="text-[#41023B] text-sm hover:underline flex items-center">
          Ver todos <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="space-y-3">
        {mensajes.map((mensaje) => (
          <Link href={`/admin/mensajes/${mensaje.id}`} key={mensaje.id}
            className="border border-gray-100 p-3 rounded-lg flex items-center justify-between hover:bg-gray-50 transition">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-gray-300 text-[#41023B] flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0">
                {mensaje.remitente.charAt(0)}
              </div>
              <div>
                <div className="flex items-center">
                  <p className="font-medium">{mensaje.remitente}</p>
                  {!mensaje.leido && (
                    <span className="ml-2 bg-[#D7008A] text-white text-xs px-1.5 py-0.5 rounded-full">Nuevo</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-1">{mensaje.contenido}</p>
                <p className="text-xs text-gray-500 mt-1">{mensaje.fecha}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-[#C40180]" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SectionMessag