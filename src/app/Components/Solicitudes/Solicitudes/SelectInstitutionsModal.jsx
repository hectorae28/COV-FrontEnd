"use client"

import { AlertCircle, Building, CheckCircle, Clock, Eye, FileText, Upload, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import VerificationSwitch from "../ListaColegiados/VerificationSwitch";

export default function SeleccionarInstitucionesModal({
    isOpen,
    onClose,
    instituciones = [],
    tipoConstancia,
    costoBase,
    onConfirm,
    institucionesYaSeleccionadas = [],
    isAdmin = false,
    onUpdateInstitution = null // Nueva función para actualizar instituciones
}) {
    const [institucionesSeleccionadas, setInstitucionesSeleccionadas] = useState([]);
    const [institucionesConArchivos, setInstitucionesConArchivos] = useState([]);

    // Inicializar con las instituciones ya seleccionadas cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setInstitucionesSeleccionadas(institucionesYaSeleccionadas);
            // Inicializar el estado local de instituciones con archivos
            setInstitucionesConArchivos(instituciones.map(inst => ({
                ...inst,
                constancia_trabajo: inst.constancia_trabajo || null,
                verificado: inst.verificado !== undefined ? inst.verificado : null,
                motivo_rechazo: inst.motivo_rechazo || inst.rejection_reason || ""
            })));
        }
    }, [isOpen, institucionesYaSeleccionadas, instituciones]);

    // Función para manejar la subida de archivos
    const handleFileUpload = (institucionId, file) => {
        if (file) {
            // Validar tamaño del archivo (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("El archivo no puede ser mayor a 5MB");
                return;
            }

            // Validar tipo de archivo
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert("Solo se permiten archivos JPG, PNG o PDF");
                return;
            }

            // Actualizar el estado local
            setInstitucionesConArchivos(prev => 
                prev.map(inst => 
                    inst.id === institucionId 
                        ? { ...inst, constancia_trabajo: file, verificado: null } // Resetear verificación al subir nuevo archivo
                        : inst
                )
            );

            // Si hay callback para actualizar, llamarlo
            if (onUpdateInstitution) {
                onUpdateInstitution(institucionId, { constancia_trabajo: file });
            }
        }
    };

    // Función para abrir archivo en nueva pestaña
    const openFilePreview = (file) => {
        if (file) {
            if (typeof file === 'string') {
                // Si es una URL (archivo ya subido)
                window.open(file, '_blank');
            } else {
                // Si es un objeto File
                const url = URL.createObjectURL(file);
                window.open(url, '_blank');
                // Limpiar la URL después de un tiempo para liberar memoria
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            }
        }
    };

    // Función para manejar cambios de verificación
    const handleVerificationChange = (updatedInstitution, index) => {
        const institucion = institucionesConArchivos[index];
        
        setInstitucionesConArchivos(prev => 
            prev.map((inst, idx) => 
                idx === index 
                    ? { 
                        ...inst, 
                        verificado: updatedInstitution.verificado,
                        motivo_rechazo: updatedInstitution.motivo_rechazo || ""
                    }
                    : inst
            )
        );

        // Si hay callback para actualizar, llamarlo
        if (onUpdateInstitution) {
            onUpdateInstitution(institucion.id, {
                verificado: updatedInstitution.verificado,
                motivo_rechazo: updatedInstitution.motivo_rechazo || ""
            });
        }
    };

    // Solo instituciones aprobadas pueden ser seleccionadas
    const institucionesDisponibles = institucionesConArchivos.filter(
        inst => inst.verificado === true
    );

    // Toggle de selección de institución (solo las aprobadas)
    const toggleInstitucion = (institucionId) => {
        const institucion = institucionesConArchivos.find(i => i.id === institucionId);
        if (institucion?.verificado !== true) {
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
                    icon: <Clock size={16} />,
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    text: 'Sin verificar'
                };
        }
    };

    const handleConfirm = () => {
        // Solo instituciones aprobadas pueden ser confirmadas
        const institucionesAprobadas = institucionesSeleccionadas.filter(instId => {
            const inst = institucionesConArchivos.find(i => i.id === instId);
            return inst?.verificado === true;
        });

        // Instituciones nuevas
        const institucionesNuevas = institucionesAprobadas.filter(
            instId => !institucionesYaSeleccionadas.includes(instId)
        );

        // Instituciones eliminadas (estaban antes pero ya no están seleccionadas)
        const institucionesEliminadas = institucionesYaSeleccionadas.filter(
            instId => !institucionesAprobadas.includes(instId)
        );

        // Mapear las instituciones nuevas para agregar
        const itemsParaAgregar = institucionesNuevas.map(instId => {
            const institucion = institucionesConArchivos.find(i => i.id === instId);
            return {
                institucionId: instId,
                institucionNombre: institucion.nombre,
                institucionDireccion: institucion.direccion?.referencia || '',
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {tipoConstancia}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Suba la constancia de trabajo para cada institución y espere la aprobación para poder seleccionarlas.
                    </p>
                    
                    {/* Información de estado actual */}
                    <div className="mt-3 flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                            <span className="text-green-700">
                                {institucionesDisponibles.length} aprobada(s)
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                            <span className="text-yellow-700">
                                {institucionesConArchivos.filter(i => i.verificado === null).length} en revisión
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                            <span className="text-red-700">
                                {institucionesConArchivos.filter(i => i.verificado === false).length} rechazada(s)
                            </span>
                        </div>
                        {institucionesYaSeleccionadas.length > 0 && (
                            <div className="ml-auto">
                                <span className="text-[#C40180] font-medium">
                                    {institucionesSeleccionadas.length} seleccionada(s)
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-4">
                    {institucionesConArchivos.length === 0 ? (
                        <div className="text-center py-8">
                            <Building size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">
                                No hay instituciones registradas para este colegiado
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Lista de instituciones */}
                            {institucionesConArchivos.map((institucion, index) => {
                                const statusInfo = getStatusInfo(institucion.verificado);
                                const isSelectable = institucion.verificado === true;
                                const isSelected = institucionesSeleccionadas.includes(institucion.id);
                                const yaSeleccionadaPreviamente = institucionesYaSeleccionadas.includes(institucion.id);
                                const tieneArchivo = !!institucion.constancia_trabajo;

                                return (
                                    <div
                                        key={institucion.id}
                                        className={`border rounded-lg p-4 transition-all ${
                                            isSelectable
                                                ? `cursor-pointer ${isSelected
                                                    ? 'border-[#C40180] bg-purple-50 shadow-md ring-2 ring-[#C40180]/20'
                                                    : 'border-gray-200 hover:border-[#C40180]/50 hover:shadow-sm'
                                                }`
                                                : 'border-gray-200 bg-gray-50'
                                        } ${statusInfo.borderColor}`}
                                    >
                                        {/* Header clickeable para selección (solo si está aprobada) */}
                                        <div 
                                            onClick={() => isSelectable && toggleInstitucion(institucion.id)}
                                            className={isSelectable ? "cursor-pointer" : ""}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center flex-1">
                                                    {/* Indicador visual de selección */}
                                                    {isSelected && isSelectable && (
                                                        <div className="bg-[#C40180] text-white rounded-full p-1 mr-3">
                                                            <CheckCircle size={16} />
                                                        </div>
                                                    )}

                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900 flex items-center">
                                                            {institucion.nombre}
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
                                                            {institucion.direccion?.referencia || 'Sin dirección'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Estado de verificación */}
                                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color} border ${statusInfo.borderColor}`}>
                                                    {statusInfo.icon}
                                                    <span className="ml-1">{statusInfo.text}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sección de constancia de trabajo */}
                                        <div className="bg-white border border-gray-100 rounded-md p-3 mb-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Constancia de Trabajo
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <label className={`cursor-pointer flex-1 px-3 py-2 border-2 border-dashed ${
                                                        tieneArchivo
                                                            ? "border-green-500 bg-green-50"
                                                            : "border-gray-300 bg-gray-50"
                                                    } rounded-lg hover:bg-gray-100 transition-colors`}>
                                                        <input
                                                            type="file"
                                                            accept=".jpg,.jpeg,.png,.pdf"
                                                            onChange={(e) => handleFileUpload(institucion.id, e.target.files[0])}
                                                            className="hidden"
                                                        />
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Upload size={16} className={
                                                                tieneArchivo ? "text-green-600" : "text-gray-400"
                                                            } />
                                                            <span className={`text-sm font-medium ${
                                                                tieneArchivo ? "text-green-700" : "text-gray-600"
                                                            }`}>
                                                                {tieneArchivo
                                                                    ? (typeof institucion.constancia_trabajo === 'string'
                                                                        ? "Constancia subida"
                                                                        : institucion.constancia_trabajo.name)
                                                                    : "Subir constancia de trabajo"
                                                                }
                                                            </span>
                                                        </div>
                                                    </label>

                                                    {tieneArchivo && (
                                                        <button
                                                            type="button"
                                                            onClick={() => openFilePreview(institucion.constancia_trabajo)}
                                                            className="px-3 py-2 bg-[#D7008A] text-white rounded-lg hover:bg-[#B8006F] transition-colors flex items-center gap-1"
                                                            title="Ver documento"
                                                        >
                                                            <Eye size={14} />
                                                        </button>
                                                    )}
                                                </div>

                                                {tieneArchivo && (
                                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                                        <FileText size={14} />
                                                        <span>
                                                            {typeof institucion.constancia_trabajo === 'string'
                                                                ? "Documento cargado correctamente"
                                                                : `${institucion.constancia_trabajo.name} (${(institucion.constancia_trabajo.size / 1024 / 1024).toFixed(2)} MB)`
                                                            }
                                                        </span>
                                                    </div>
                                                )}

                                                <p className="text-xs text-gray-500">
                                                    Formatos permitidos: JPG, PNG, PDF (máx. 5MB)
                                                </p>
                                            </div>
                                        </div>

                                        {/* Sección de verificación para admin */}
                                        {isAdmin && tieneArchivo && (
                                            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mb-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        Verificación administrativa:
                                                    </span>
                                                    <VerificationSwitch
                                                        item={institucion}
                                                        type="institucion"
                                                        onChange={handleVerificationChange}
                                                        index={index}
                                                        labels={{
                                                            aprobado: "Aprobada",
                                                            pendiente: "Pendiente",
                                                            rechazado: "Rechazada"
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Motivo de rechazo si aplica */}
                                        {institucion.verificado === false && institucion.motivo_rechazo && (
                                            <div className="text-xs text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                                                <AlertCircle size={14} className="inline mr-1" />
                                                <strong>Motivo del rechazo:</strong> {institucion.motivo_rechazo}
                                            </div>
                                        )}

                                        {/* Mensaje para instituciones no seleccionables */}
                                        {!isSelectable && tieneArchivo && (
                                            <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200">
                                                <Clock size={14} className="inline mr-1" />
                                                {institucion.verificado === null 
                                                    ? "Pendiente de verificación administrativa"
                                                    : "Esta institución no está disponible para selección"
                                                }
                                            </div>
                                        )}

                                        {/* Mensaje si no tiene archivo */}
                                        {!tieneArchivo && (
                                            <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded-md">
                                                <AlertCircle size={14} className="inline mr-1" />
                                                Debe subir la constancia de trabajo para poder verificar esta institución
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Información adicional */}
                <div className="border-t p-4 bg-gray-50">
                    <div className="flex items-start gap-2 text-xs text-gray-600">
                        <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="mb-1">
                                <strong>Instrucciones:</strong>
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>Suba la constancia de trabajo para cada institución</li>
                                <li>Espere la verificación administrativa</li>
                                <li>Solo las instituciones aprobadas pueden ser seleccionadas</li>
                                <li>Haga clic en las instituciones aprobadas para incluirlas en su solicitud</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="p-4 flex justify-end gap-3 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </button>

                    {/* Solo mostrar el botón de confirmar si hay instituciones seleccionadas o cambios */}
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