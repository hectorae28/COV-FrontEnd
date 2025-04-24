"use client"

import Link from "next/link"
import { ChevronRight, Web, OpenInBrowser, Assessment, RequestQuote, AccountCircle } from "@mui/icons-material";

const SectionAccesD = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <OpenInBrowser className="mr-2 h-5 w-5 text-[#590248]" />
        Accesos Rápidos
      </h3>
      <div className="space-y-3">
        <Link href="/Inicio"
          className="bg-gradient-to-r from-[#C40180]/10 to-[#590248]/10 p-3 rounded-lg flex items-center justify-between hover:from-[#C40180]/20 hover:to-[#590248]/20 transition">
          <div className="flex items-center">
            <Web className="h-5 w-5 text-[#590248] mr-3" />
            <div>
              <p className="font-medium text-gray-800">Pagina Web</p>
              <p className="text-xs text-gray-600">Administrar página principal</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#C40180]" />
        </Link>

        <Link href="/Estadisticas"
          className="bg-gradient-to-r from-[#C40180]/10 to-[#590248]/10 p-3 rounded-lg flex items-center justify-between hover:from-[#C40180]/20 hover:to-[#590248]/20 transition">
          <div className="flex items-center">
            <Assessment className="h-5 w-5 text-[#590248] mr-3" />
            <div>
              <p className="font-medium text-gray-800">Estadísticas</p>
              <p className="text-xs text-gray-500">Ver reportes detallados</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#C40180]" />
        </Link>

        <Link href="/Pagos"
          className="bg-gradient-to-r from-[#C40180]/10 to-[#590248]/10 p-3 rounded-lg flex items-center justify-between hover:from-[#C40180]/20 hover:to-[#590248]/20 transition">
          <div className="flex items-center">
            <RequestQuote className="h-5 w-5 text-[#590248] mr-3" />
            <div>
              <p className="font-medium text-gray-800">Pagos</p>
              <p className="text-xs text-gray-500">Verifica las Solicitudes de Pagos</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#C40180]" />
        </Link>

        <Link href="/Usuario"
          className="bg-gradient-to-r from-[#C40180]/10 to-[#590248]/10 p-3 rounded-lg flex items-center justify-between hover:from-[#C40180]/20 hover:to-[#590248]/20 transition">
          <div className="flex items-center">
            <AccountCircle className="h-5 w-5 text-[#590248] mr-3" />
            <div>
              <p className="font-medium text-gray-800">Usuarios</p>
              <p className="text-xs text-gray-500">Configura Usuarios</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#C40180]" />
        </Link>
      </div>
    </div>
  )
}

export default SectionAccesD