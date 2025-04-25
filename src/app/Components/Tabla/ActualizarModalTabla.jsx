"use client";

import { X, Check, FileText, Paperclip } from "lucide-react";
import ModalPortal from './ModalPortal';

export default function TableUpdateModal({ 
  solicitud, 
  nuevosDatos, 
  handleFileChange, 
  onCancel, 
  onSubmit,
  setNuevosDatos 
}) {
  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0}}>
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-b from-[#41023B] to-[#D7008A] p-4 flex justify-between items-center rounded-t-lg">
          <h3 className="text-white font-semibold">Actualizar Solicitud</h3>
          <button 
            onClick={onCancel}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Solicitud:</span>
              <span className="font-semibold">{solicitud.id} - {solicitud.tipo}</span>
            </div>
            
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Documentación actualizada
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg p-2">
                <input
                  type="file"
                  id="actualizacion-file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="actualizacion-file"
                  className="flex items-center cursor-pointer flex-1"
                >
                  <Paperclip size={16} className="mr-2 text-gray-500" />
                  <span className="text-sm">
                    {nuevosDatos.file ? nuevosDatos.file.name : 'Seleccionar archivo'}
                  </span>
                </label>
                {nuevosDatos.file && (
                  <Check size={16} className="text-green-500" />
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Comentarios (opcional)
              </label>
              <textarea
                value={nuevosDatos.comentario}
                onChange={(e) => setNuevosDatos({...nuevosDatos, comentario: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] outline-none min-h-[100px]"
                placeholder="Añada información adicional que pueda ser útil"
              ></textarea>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={!nuevosDatos.file}
                className={`
                  flex-1 py-2 px-4 rounded-lg font-medium transition-colors
                  ${nuevosDatos.file 
                    ? 'bg-gradient-to-b from-[#41023B] to-[#D7008A] text-white hover:opacity-90' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </ModalPortal>
  );
}