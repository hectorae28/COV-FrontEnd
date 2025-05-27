"use client"

import { AlertCircle, Building, CheckCircle, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function SeleccionarInstitucionesModal({
    isOpen,
    onClose,
    instituciones = [],
    tipoConstancia,
    costoBase,
    onConfirm,
    institucionesYaSeleccionadas = []
}) {
    const [institucionesSeleccionadas, setInstitucionesSeleccionadas] = useState([]);

    // Inicializar con las instituciones ya seleccionadas cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setInstitucionesSeleccionadas(institucionesYaSeleccionadas);
        }
    }, [isOpen, institucionesYaSeleccionadas]);

    // Solo filtrar instituciones aprobadas para selección
    const institucionesDisponibles = instituciones.filter(
        inst => inst.verificado 
    );

    // Toggle de selección de institución (toda la card)
    const toggleInstitucion = (institucionId) => {
        const institucion = instituciones.find(i => i.id === institucionId);
        if (!institucion?.verificado) {
            return; // No hacer nada si no está aprobada
        }

        setInstitucionesSeleccionadas(prev => {
            if (prev.includes(institucionId)) {
                return prev.filter(id => id !== institucionId);
            }
            return [...prev, institucionId];
        });
    };

    // Función de estado mejorada
    const getStatusInfo = (status) => {
        switch (status) {
            case true:
                return {
                    icon: <CheckCircle size={16} />,
                    color: 'text-green-600',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    text: 'Aprobada'
                };
            case null:
                return {
                    icon: <Clock size={16} />,
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    text: 'En revisión'
                };
            case false:
                return {
                    icon: <XCircle size={16} />,
                    color: 'text-red-600',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    text: 'Rechazada'
                };
            default:
                return {
                    icon: <XCircle size={16} />,
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    text: 'Sin verificar'
                };
        }
    };

    const handleConfirm = () => {
        // Instituciones nuevas
        const institucionesNuevas = institucionesSeleccionadas.filter(
            instId => !institucionesYaSeleccionadas.includes(instId)
        );

        // Instituciones eliminadas (estaban antes pero ya no están seleccionadas)
        const institucionesEliminadas = institucionesYaSeleccionadas.filter(
            instId => !institucionesSeleccionadas.includes(instId)
        );

        // Mapear las instituciones nuevas para agregar
        const itemsParaAgregar = institucionesNuevas.map(instId => {
            const institucion = instituciones.find(i => i.id === instId);
            return {
                institucionId: instId,
                institucionNombre: institucion.nombre,
                institucionDireccion: institucion.direccion.referencia,
                verificacionStatus: institucion.verificado
            };
        });

        // Enviar tanto las nuevas como las eliminadas
        onConfirm({
            nuevas: itemsParaAgregar,
            eliminadas: institucionesEliminadas
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {tipoConstancia}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Haga clic en las instituciones que desea incluir.
                    </p>
                    {/* Información de estado actual */}
                    {institucionesYaSeleccionadas.length > 0 && (
                        <div className="mt-2 flex items-center justify-between text-xs">
                            <span className="text-[#C40180]">
                                {institucionesYaSeleccionadas.length} institución(es) ya incluida(s)
                            </span>
                            <span className={`${institucionesSeleccionadas.length === 0
                                ? 'text-orange-600 font-medium'
                                : 'text-gray-500'
                                }`}>
                                {institucionesSeleccionadas.length === 0
                                    ? "Se eliminarán todas las selecciones"
                                    : `${institucionesSeleccionadas.length} seleccionada(s) actualmente`
                                }
                            </span>
                        </div>
                    )}
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-4">
                    {instituciones.length === 0 ? (
                        <div className="text-center py-8">
                            <Building size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">
                                No hay instituciones registradas para este colegiado
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Lista de instituciones */}
                            {instituciones.map((institucion) => {
                                const statusInfo = getStatusInfo(institucion.verificado);
                                const isSelectable = institucion.verificado;
                                const isSelected = institucionesSeleccionadas.includes(institucion.id);
                                const yaSeleccionadaPreviamente = institucionesYaSeleccionadas.includes(institucion.id);

                                return (
                                    <div
                                        key={institucion.id}
                                        onClick={() => isSelectable && toggleInstitucion(institucion.id)}
                                        className={`border rounded-lg p-4 transition-all ${!isSelectable
                                            ? 'opacity-60 cursor-not-allowed bg-gray-50'
                                            : `cursor-pointer ${isSelected
                                                ? 'border-[#C40180] bg-purple-50 shadow-md ring-2 ring-[#C40180]/20'
                                                : 'border-gray-200 hover:border-[#C40180]/50 hover:shadow-sm hover:bg-purple-25'
                                            }`
                                            } ${statusInfo.borderColor}`}
                                    >
                                        <div className="flex items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    {/* Indicador visual de selección */}
                                                    {isSelected && isSelectable && (
                                                        <div className="bg-[#C40180] text-white rounded-full p-1 mr-3">
                                                            <CheckCircle size={16} />
                                                        </div>
                                                    )}

                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900 flex items-center">
                                                            {institucion.nombre}
                                                            {/* NUEVO: Indicador de ya seleccionada previamente */}
                                                            {yaSeleccionadaPreviamente && (
                                                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                                    Ya incluida
                                                                </span>
                                                            )}
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
                                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color} border ${statusInfo.borderColor}`}>
                                                    {statusInfo.icon}
                                                    <span className="ml-1">{statusInfo.text}</span>
                                                </div>

                                                {/* Motivo de rechazo si aplica */}
                                                {!institucion.verificado && institucion.rejection_reason && (
                                                    <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                                                        <AlertCircle size={14} className="inline mr-1" />
                                                        <strong>Motivo del rechazo:</strong> {institucion.rejection_reason}
                                                    </div>
                                                )}

                                                {/* Mensaje para instituciones no seleccionables */}
                                                {!isSelectable && (
                                                    <div className="mt-2 text-[10px] text-red-500 bg-gray-100 p-2 rounded">
                                                        <AlertCircle size={14} className="inline mr-1" />
                                                        Esta institución no está disponible para selección
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Mensaje cuando no hay instituciones aprobadas */}
                {institucionesDisponibles.length === 0 && (
                    <div className="border-t p-4 bg-yellow-50">
                        <div className="flex items-center text-yellow-800">
                            <AlertCircle size={16} className="mr-2" />
                            <p className="text-sm">
                                No hay instituciones aprobadas disponibles. No puede generar constancias para este tipo hasta que tenga al menos una institución verificada.
                            </p>
                        </div>
                    </div>
                )}

                {/* Botones de acción */}
                <div className="p-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </button>

                    {/* Solo mostrar el botón de confirmar/eliminar si tiene sentido */}
                    {(institucionesSeleccionadas.length > 0 ||
                        (institucionesYaSeleccionadas.length > 0 && institucionesSeleccionadas.length === 0)) && (
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 bg-[#C40180] text-white rounded-md transition-colors hover:bg-[#590248]"
                            >
                                {/* Texto dinámico según la selección */}
                                {institucionesSeleccionadas.length === 0
                                    ? "Eliminar todas las selecciones"
                                    : `Confirmar selección (${institucionesSeleccionadas.length})`
                                }
                            </button>
                        )}
                </div>
            </div>
        </div>
    );
}