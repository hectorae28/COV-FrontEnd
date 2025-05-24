"use client"

import { AlertCircle, Building, CheckCircle, Clock, XCircle } from "lucide-react";
import { useState } from "react";

export default function SeleccionarInstitucionesModal({
    isOpen,
    onClose,
    instituciones = [],
    tipoConstancia,
    costoBase,
    onConfirm
}) {
    const [institucionesSeleccionadas, setInstitucionesSeleccionadas] = useState([]);
    const [exoneraciones, setExoneraciones] = useState({});

    // Filtrar instituciones que pueden ser seleccionadas (aprobadas o pendientes)
    const institucionesDisponibles = instituciones.filter(
        inst => inst.verification_status !== 'rechazado'
    );

    // Calcular el costo total
    const calcularCostoTotal = () => {
        let total = 0;
        institucionesSeleccionadas.forEach(instId => {
            if (!exoneraciones[instId]) {
                total += costoBase;
            }
        });
        return total;
    };

    // Toggle selección de institución
    const toggleInstitucion = (institucionId) => {
        setInstitucionesSeleccionadas(prev => {
            if (prev.includes(institucionId)) {
                return prev.filter(id => id !== institucionId);
            }
            return [...prev, institucionId];
        });
    };

    // Toggle exoneración
    const toggleExoneracion = (institucionId) => {
        setExoneraciones(prev => ({
            ...prev,
            [institucionId]: !prev[institucionId]
        }));
    };

    // Obtener icono y color según estado
    const getStatusInfo = (status) => {
        switch (status) {
            case 'approved':
                return {
                    icon: <CheckCircle size={16} />,
                    color: 'text-green-600',
                    bgColor: 'bg-green-50',
                    text: 'Aprobada'
                };
            case 'pending':
                return {
                    icon: <Clock size={16} />,
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-50',
                    text: 'Pendiente'
                };
            default:
                return {
                    icon: <XCircle size={16} />,
                    color: 'text-red-600',
                    bgColor: 'bg-red-50',
                    text: 'Rechazada'
                };
        }
    };

    const handleConfirm = () => {
        const itemsParaAgregar = institucionesSeleccionadas.map(instId => {
            const institucion = instituciones.find(i => i.id === instId);
            return {
                institucionId: instId,
                institucionNombre: institucion.nombre,
                institucionDireccion: institucion.direccion.referencia,
                exonerado: exoneraciones[instId] || false,
                verificacionStatus: institucion.verification_status
            };
        });

        onConfirm(itemsParaAgregar);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Seleccionar Instituciones para {tipoConstancia}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Seleccione las instituciones para las cuales desea generar la constancia
                    </p>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-4">
                    {institucionesDisponibles.length === 0 ? (
                        <div className="text-center py-8">
                            <Building size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">
                                No hay instituciones disponibles para seleccionar
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {instituciones.map((institucion) => {
                                const statusInfo = getStatusInfo(institucion.verification_status);
                                const isSelectable = institucion.verification_status !== 'rechazado';
                                const isSelected = institucionesSeleccionadas.includes(institucion.id);
                                const isExonerado = exoneraciones[institucion.id];

                                return (
                                    <div
                                        key={institucion.id}
                                        className={`border rounded-lg p-4 ${!isSelectable
                                            ? 'opacity-50 cursor-not-allowed bg-gray-50'
                                            : isSelected
                                                ? 'border-[#C40180] bg-purple-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleInstitucion(institucion.id)}
                                                        disabled={!isSelectable}
                                                        className="mr-3 h-4 w-4 text-[#C40180] rounded border-gray-300 focus:ring-[#C40180]"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">
                                                            {institucion.nombre}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {institucion.cargo} • {institucion.telefono}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {institucion.direccion.referencia}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Estado de verificación */}
                                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${statusInfo.bgColor} ${statusInfo.color}`}>
                                                    {statusInfo.icon}
                                                    <span className="ml-1">{statusInfo.text}</span>
                                                </div>

                                                {/* Motivo de rechazo si aplica */}
                                                {institucion.verification_status === 'rechazado' && institucion.rejection_reason && (
                                                    <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                                                        <AlertCircle size={14} className="inline mr-1" />
                                                        {institucion.rejection_reason}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Columna de costo y exoneración */}
                                            {isSelected && isSelectable && (
                                                <div className="ml-4 text-right">
                                                    <p className={`font-medium ${isExonerado ? 'line-through text-gray-400' : 'text-[#C40180]'}`}>
                                                        ${costoBase.toFixed(2)}
                                                    </p>
                                                    <label className="inline-flex items-center mt-1 cursor-pointer">
                                                        <span className="text-xs text-gray-600 mr-1">Exonerar</span>
                                                        <input
                                                            type="checkbox"
                                                            checked={isExonerado}
                                                            onChange={() => toggleExoneracion(institucion.id)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="relative w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-600"></div>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer con resumen */}
                {institucionesSeleccionadas.length > 0 && (
                    <div className="border-t border-b p-4 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">
                                    {institucionesSeleccionadas.length} institución(es) seleccionada(s)
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Costo por institución: ${costoBase.toFixed(2)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Total:</p>
                                <p className="text-xl font-bold text-[#C40180]">
                                    ${calcularCostoTotal().toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Botones de acción */}
                <div className="p-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={institucionesSeleccionadas.length === 0}
                        className={`px-4 py-2 bg-[#C40180] text-white rounded-md ${institucionesSeleccionadas.length === 0
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-[#590248]'
                            }`}
                    >
                        Confirmar selección
                    </button>
                </div>
            </div>
        </div>
    );
}