"use client";

import { Eye, FileText, RefreshCcw } from "lucide-react";

export default function TableActions({ solicitud, onView, onUpdate, isSolvent }) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={() => onView(solicitud)}
        className="text-[#41023B] hover:text-[#D7008A] transition-colors p-1 rounded-full hover:bg-gray-100 w-full flex justify-center"
        title="Ver detalles"
      >
        <Eye size={18} />
      </button>
      
      {solicitud.actualizable && (
        <button
          onClick={() => onUpdate(solicitud)}
          disabled={!isSolvent}
          className={`
            flex items-center space-x-1 py-1 px-2 rounded-lg text-xs font-medium w-full justify-center
            ${isSolvent 
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70'}
          `}
          title={isSolvent ? "Actualizar solicitud" : "Requiere solvencia para actualizar"}
        >
          <RefreshCcw size={14} />
          <span>Actualizar</span>
        </button>
      )}
    </div>
  );
}