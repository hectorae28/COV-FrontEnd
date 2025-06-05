"use client"

import { useState, useEffect } from 'react';
import { Check, X, AlertCircle, DollarSign } from 'lucide-react';

export default function ExoneracionManager({ 
  solicitud, 
  onExonerarItems, 
  onClose, 
  isVisible = false 
}) {
  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);
  const [motivo, setMotivo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const itemsDisponibles = [];

  // Construir lista de items disponibles para exonerar
  if (solicitud?.detallesSolicitud) {
    if (solicitud.detallesSolicitud.carnet && solicitud.detallesSolicitud.carnet.status !== "exonerado") {
      itemsDisponibles.push({
        tipo: "carnet",
        nombre: "Carnet Profesional",
        monto: solicitud.detallesSolicitud.carnet.monto,
        status: solicitud.detallesSolicitud.carnet.status
      });
    }

    if (solicitud.detallesSolicitud.especializacion && solicitud.detallesSolicitud.especializacion.status !== "exonerado") {
      itemsDisponibles.push({
        tipo: "especializacion",
        nombre: "Especialización",
        monto: solicitud.detallesSolicitud.especializacion.monto,
        status: solicitud.detallesSolicitud.especializacion.status
      });
    }

    if (solicitud.detallesSolicitud.constancias) {
      solicitud.detallesSolicitud.constancias.forEach((constancia, index) => {
        if (constancia.status !== "exonerado") {
          itemsDisponibles.push({
            tipo: "constancia",
            nombre: `Constancia ${constancia.tipo_constancia?.replace(/_/g, ' ') || index + 1}`,
            monto: constancia.monto,
            status: constancia.status,
            id: constancia.id
          });
        }
      });
    }
  }

  const handleToggleItem = (item) => {
    setItemsSeleccionados(prev => {
      const existe = prev.find(i => 
        i.tipo === item.tipo && 
        (item.id ? i.id === item.id : !i.id)
      );
      if (existe) {
        return prev.filter(i => !(
          i.tipo === item.tipo && 
          (item.id ? i.id === item.id : !i.id)
        ));
      } else {
        return [...prev, item];
      }
    });
  };

  const calcularTotalExonerado = () => {
    return itemsSeleccionados.reduce((total, item) => total + (item.monto || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (itemsSeleccionados.length === 0) {
      setError("Debe seleccionar al menos un item para exonerar");
      return;
    }

    if (!motivo.trim()) {
      setError("Debe proporcionar un motivo para la exoneración");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const itemsParaExonerar = itemsSeleccionados.map(item => {
        const itemData = {
          tipo: item.tipo,
          motivo: motivo.trim()
        };
        
        if (item.id) {
          itemData.id = item.id;
        }
        
        return itemData;
      });

      await onExonerarItems(itemsParaExonerar);
      
      // Resetear formulario
      setItemsSeleccionados([]);
      setMotivo("");
      onClose?.();
    } catch (error) {
      console.error("Error al exonerar items:", error);
      setError(error.message || "Error al procesar la exoneración");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Exonerar Items de Solicitud
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Lista de items disponibles */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Items Disponibles para Exoneración</h3>
            
            {itemsDisponibles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="mx-auto mb-2" size={48} />
                <p>No hay items disponibles para exonerar</p>
                <p className="text-sm">Todos los items ya están exonerados o no son elegibles</p>
              </div>
            ) : (
              <div className="space-y-3">
                {itemsDisponibles.map((item, index) => {
                  const isSelected = itemsSeleccionados.find(i => 
                    i.tipo === item.tipo && 
                    (item.id ? i.id === item.id : !i.id)
                  );
                  
                  return (
                    <div
                      key={`${item.tipo}-${item.id || index}`}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        isSelected 
                          ? 'border-[#C40180] bg-pink-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleToggleItem(item)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'border-[#C40180] bg-[#C40180]' 
                              : 'border-gray-300'
                          }`}>
                            {isSelected && <Check size={14} className="text-white" />}
                          </div>
                          <div>
                            <p className="font-medium">{item.nombre}</p>
                            <p className="text-sm text-gray-500">
                              Estado: <span className="capitalize">{item.status}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <DollarSign size={16} />
                          <span className="font-medium">{item.monto?.toFixed(2) || '0.00'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Resumen de exoneración */}
          {itemsSeleccionados.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Resumen de Exoneración</h4>
              <p className="text-blue-700">
                Items seleccionados: {itemsSeleccionados.length}
              </p>
              <p className="text-blue-700">
                Total a exonerar: ${calcularTotalExonerado().toFixed(2)}
              </p>
            </div>
          )}

          {/* Motivo de exoneración */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de Exoneración *
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180]"
              rows={3}
              placeholder="Ingrese el motivo para la exoneración..."
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#C40180] text-white rounded-lg hover:bg-[#A0016B] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || itemsSeleccionados.length === 0}
            >
              {isSubmitting ? 'Exonerando...' : 'Exonerar Items'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 