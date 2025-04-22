"use client";
import { X, FileText, Download, Calendar, DollarSign, AlertCircle } from "lucide-react";
import ModalPortal from './ModalPortal';

export default function TableDetailsModal({ solicitud, isSolvent, onClose, onUpdate }) {
  // Función para determinar el color de estado
  const getStatusColor = (estado) => {
    switch (estado) {
      case "Aprobada":
        return "bg-green-100 text-green-800";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "Rechazada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0}}>
        {/* Modal */}
      <div 
        className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-lg"
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-headline"
      >
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-[#41023B] to-[#D7008A] px-4 py-3 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-white" id="modal-headline">
            Detalles de Solicitud
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="space-y-4">
            {/* ID y Tipo */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center">
                <FileText className="text-[#D7008A] mr-2" size={20} />
                <div>
                  <p className="text-sm text-gray-500">ID de Solicitud</p>
                  <p className="font-semibold">{solicitud.id}</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#F8E4F0] text-[#D7008A] font-medium text-sm">
                {solicitud.tipo}
              </div>
            </div>

            {/* Fecha y Costo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Calendar className="text-gray-400 mr-2" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Fecha de Solicitud</p>
                  <p className="font-medium">{solicitud.fecha}</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="text-gray-400 mr-2" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Costo</p>
                  <p className="font-medium">{solicitud.costo}</p>
                </div>
              </div>
            </div>

            {/* Estado */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Estado</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(solicitud.estado)}`}>
                {solicitud.estado}
              </span>
            </div>

            {/* Comentario */}
            {solicitud.comentario && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-1">Comentario</p>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  {solicitud.comentario}
                </div>
              </div>
            )}

            {/* Alerta si está rechazada y es actualizable */}
            {solicitud.estado === "Rechazada" && solicitud.actualizable && (
              <div className="flex items-start p-3 bg-yellow-50 rounded-lg mt-4">
                <AlertCircle className="text-yellow-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium">Esta solicitud fue rechazada</p>
                  <p>Puede actualizar la documentación para volver a enviarla.</p>
                </div>
              </div>
            )}

            {/* Alerta si no está solvente */}
            {!isSolvent && solicitud.actualizable && (
              <div className="flex items-start p-3 bg-red-50 rounded-lg mt-4">
                <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                <div className="text-sm text-red-700">
                  <p className="font-medium">No puede actualizar esta solicitud</p>
                  <p>Debe estar solvente para realizar esta acción.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          {solicitud.estado === "Aprobada" && (
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#41023B] text-base font-medium text-white hover:bg-[#D7008A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D7008A] sm:ml-3 sm:w-auto sm:text-sm"
            >
              <Download size={16} className="mr-2" />
              Descargar
            </button>
          )}
          {solicitud.estado === "Rechazada" && solicitud.actualizable && (
            <button
              type="button"
              onClick={onUpdate}
              disabled={!isSolvent}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                isSolvent 
                  ? "bg-[#41023B] hover:bg-[#D7008A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D7008A]" 
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Actualizar
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
      </div>
    </ModalPortal>
  );
}