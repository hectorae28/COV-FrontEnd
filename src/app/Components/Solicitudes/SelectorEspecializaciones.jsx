"use client"

import { useState, useEffect } from 'react';
import { Check, X, AlertCircle, GraduationCap, Search } from 'lucide-react';
import {useEspecializaciones} from '@/hooks/useEspecializaciones';

export default function SelectorEspecializaciones({ 
  onSeleccionar, 
  onCerrar, 
  isOpen = false,
  onConfirm,
  onClose,
  isVisible = false,
  especializacionesDisponibles = [],
  especializacionesSeleccionadas = [],
  maxSelecciones = null,
  titulo = "Seleccionar Especializaciones",
  descripcion = "Seleccione las especializaciones que necesita"
}) {
  const { especializaciones, loading, error } = useEspecializaciones();
  const [especializacionesFiltradas, setEspecializacionesFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionadas, setSeleccionadas] = useState([]);

  useEffect(() => {
    const listaEspecializaciones = especializacionesDisponibles.length > 0 ? especializacionesDisponibles : especializaciones;
    if (listaEspecializaciones.length > 0) {
      setEspecializacionesFiltradas(listaEspecializaciones);
    }
  }, [especializacionesDisponibles, especializaciones]);

  useEffect(() => {
    setSeleccionadas([...especializacionesSeleccionadas]);
  }, [especializacionesSeleccionadas]);

  useEffect(() => {
    const listaEspecializaciones = especializacionesDisponibles.length > 0 ? especializacionesDisponibles : especializaciones;
    if (busqueda.trim() === "") {
      setEspecializacionesFiltradas(listaEspecializaciones);
    } else {
      const filtradas = listaEspecializaciones.filter(esp =>
        esp.title?.toLowerCase().includes(busqueda.toLowerCase()) ||
        esp.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        esp.description?.toLowerCase().includes(busqueda.toLowerCase()) ||
        esp.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
      );
      setEspecializacionesFiltradas(filtradas);
    }
  }, [busqueda, especializacionesDisponibles, especializaciones]);

  const handleToggleEspecializacion = (especializacion) => {
    setSeleccionadas(prev => {
      const existe = prev.find(esp => esp.id === especializacion.id);
      if (existe) {
        return prev.filter(esp => esp.id !== especializacion.id);
      } else {
        // Si hay límite máximo de selecciones
        if (maxSelecciones && prev.length >= maxSelecciones) {
          // Si es selección única, reemplazar
          if (maxSelecciones === 1) {
            return [especializacion];
          }
          // Si se alcanzó el máximo, no agregar más
          return prev;
        }
        return [...prev, especializacion];
      }
    });
  };

  const handleConfirmar = () => {
    if (onConfirm) {
      onConfirm(seleccionadas);
    } else if (onSeleccionar) {
      onSeleccionar(seleccionadas);
    }
    
    if (onClose) {
      onClose();
    } else if (onCerrar) {
      onCerrar();
    }
  };

  const handleCerrar = () => {
    if (onClose) {
      onClose();
    } else if (onCerrar) {
      onCerrar();
    }
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <GraduationCap className="mr-3 text-[#C40180]" size={24} />
            <h2 className="text-xl font-bold text-gray-800">
              {titulo}
            </h2>
          </div>
          <button
            onClick={handleCerrar}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Descripción y límites */}
        {(maxSelecciones === 1 || (maxSelecciones && maxSelecciones > 1)) && (
          <div className="mb-4 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
            {maxSelecciones === 1 && (
              <p>{descripcion} <strong>Solo puede seleccionar una especialización.</strong></p>
            )}
            {maxSelecciones && maxSelecciones > 1 && (
              <p>Puede seleccionar hasta <strong>{maxSelecciones}</strong> especializaciones.</p>
            )}
          </div>
        )}


        {/* Lista de especializaciones */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180] mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando especializaciones...</p>
            </div>
          ) : especializacionesFiltradas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="mx-auto mb-2" size={48} />
              <p>No se encontraron especializaciones</p>
              {busqueda && (
                <p className="text-sm mt-1">
                  Intenta con otros términos de búsqueda
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {especializacionesFiltradas.map((especializacion) => {
                const isSelected = seleccionadas.find(esp => esp.id === especializacion.id);
                
                return (
                  <div
                    key={especializacion.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected 
                        ? 'border-[#C40180] bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleToggleEspecializacion(especializacion)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* <div className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-1 ${
                        isSelected 
                          ? 'border-[#C40180] bg-[#C40180]' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <Check size={16} className="text-white" />}
                      </div> */}
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 text-lg">
                              {especializacion.title || especializacion.nombre}
                            </h3>
                            {(especializacion.description || especializacion.descripcion) && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {especializacion.description || especializacion.descripcion}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Resumen de selección */}
        {/* {seleccionadas.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              Especializaciones Seleccionadas ({seleccionadas.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {seleccionadas.map((esp) => (
                <span
                  key={esp.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {esp.title || esp.nombre}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleEspecializacion(esp);
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )} */}

        {/* Botones */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handleCerrar}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            className="px-6 py-2 bg-[#C40180] text-white rounded-lg hover:bg-[#A0016B] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={seleccionadas.length === 0}
          >
            Confirmar Selección ({seleccionadas.length})
          </button>
        </div>
      </div>
    </div>
  );
} 