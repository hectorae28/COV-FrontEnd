"use client";

import { Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { Warning } from "@mui/icons-material";
import useColegiadoUserStore from "@/store/colegiadoUserStore";

export default function SolvencyStatus({solvencyAmount, onPayClick, isExpiringSoon }) {
  const colegiadoUser = useColegiadoUserStore((state) => state.colegiadoUser)

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <div className="bg-gradient-to-b from-[#41023B] to-[#D7008A] p-4">
        <h2 className="text-white font-semibold text-lg">Estado de Solvencia</h2>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {colegiadoUser.solvencia_status ? (
              <>
                {isExpiringSoon ? (
                  <div className="flex items-center text-amber-600 mb-2">
                    <Warning fontSize="small" className="mr-2" />
                    <span className="font-semibold text-lg">Solvencia próxima a vencer</span>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600 mb-2">
                    <CheckCircle size={20} className="mr-2" />
                    <span className="font-semibold text-lg">Solvente</span>
                  </div>
                )}
                <div className="flex items-center text-gray-700">
                  <Calendar size={16} className="mr-2" />
                  <span>Válido hasta: <span className="font-semibold">{colegiadoUser.solvente}</span></span>
                </div>
                {isExpiringSoon && (
                  <div className="text-amber-600 text-sm mt-2">
                    <span>Se recomienda renovar su solvencia antes de la fecha de vencimiento</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center text-red-600 mb-2">
                  <AlertCircle size={20} className="mr-2" />
                  <span className="font-semibold text-lg">No Solvente</span>
                </div>
                <div className="text-gray-700">
                  <span>Debe regularizar su situación para acceder a todos los servicios</span>
                </div>
              </>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-gray-700 mb-2">
              <span>Monto: <span className="font-semibold text-lg">${solvencyAmount}</span></span>
            </div>
            <button
              onClick={onPayClick}
              className="bg-gradient-to-b from-[#41023B] to-[#D7008A] text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-colors"
            >
              {colegiadoUser.solvencia_status ? "Renovar Solvencia" : "Realizar Pago"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}