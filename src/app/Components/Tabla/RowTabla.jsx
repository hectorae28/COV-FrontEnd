"use client";

import { Calendar, Award, FileText, DollarSign, Files, IdCard } from "lucide-react";
import TableActions from "./AccionesTabla";

export default function TableRow({ solicitud, index, onView, onUpdate, isSolvent }) {
  // Obtener el ícono correspondiente al tipo de solicitud
  const getIcon = (tipo) => {
    switch (tipo.toLowerCase()) {
      case 'solvencia':
        return <DollarSign size={16} className="text-purple-500" />;
      case 'constancia':
        return <FileText size={16} className="text-blue-500" />;
      case 'carnet':
        return <IdCard size={16} className="text-green-500" />;
      case 'especialidad':
        return <Award size={16} className="text-orange-500" />;
      case 'multiple':
        return <Files size={16} className="text-pink-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };
  
  // Obtener la clase de color según el estado
  const getEstadoClass = (estado) => {
    switch (estado.toLowerCase()) {
      case 'aprobada':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'rechazada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className={index % 2 === 0 ? "bg-white" : "bg-[#f8f8f8]"}>
      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">
        {solicitud.id}
      </td>
      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
        <div className="flex items-center justify-center">
          {getIcon(solicitud.tipo)}
          <span className="ml-2">{solicitud.tipo}</span>
        </div>
      </td>
      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">
        <div className="flex items-center justify-center">
          <Calendar size={14} className="mr-1 text-gray-400" />
          {solicitud.fecha}
        </div>
      </td>
      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-center">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClass(solicitud.estado)}`}>
          {solicitud.estado}
        </span>
      </td>
      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-center">
        <TableActions 
          solicitud={solicitud}
          onView={onView}
          onUpdate={onUpdate}
          isSolvent={isSolvent}
        />
      </td>
    </tr>
  );
}