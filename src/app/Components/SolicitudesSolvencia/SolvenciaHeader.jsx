import {
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    Shield,
    User,
    XCircle
} from "lucide-react"

const SolvenciaHeader = ({ solvencia, totales, onAprobar, onRechazar }) => {
    const {
        totalExonerado,
        totalPagado,
        totalPendiente,
        totalOriginal,
        todoExonerado,
        todoPagado
    } = totales

    return (
        <div className="select-none cursor-default bg-white rounded-lg shadow-md p-4 mb-5">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Columna 1: Información básica */}
                <div className="md:col-span-3">
                    <div className="flex items-start">
                        {/* Icono según tipo de solvencia */}
                        <div className="bg-[#F8E8F3] p-2 rounded-lg mr-3 hidden sm:block">
                            <FileText className="text-[#C40180] h-7 w-7" />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-gray-800 flex items-center">
                                {solvencia.tipo}
                                <span className={`ml-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${solvencia.estado === 'Revisión'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : solvencia.estado === 'Aprobada'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                    {solvencia.estado === 'Revisión' && <Clock size={14} />}
                                    {solvencia.estado === 'Aprobada' && <CheckCircle size={14} />}
                                    {solvencia.estado === 'Rechazada' && <XCircle size={14} />}
                                    {solvencia.estado}
                                </span>
                            </h1>
                            <p className="text-sm text-gray-500">Referencia: {solvencia.referencia}</p>

                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <div className="flex items-center">
                                    <User className="text-gray-400 h-4 w-4 mr-1.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Colegiado</p>
                                        <p className="text-sm font-medium">{solvencia.colegiadoNombre}</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Calendar className="text-gray-400 h-4 w-4 mr-1.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Fecha solicitud</p>
                                        <p className="text-sm font-medium">{solvencia.fecha}</p>
                                    </div>
                                </div>

                                {/* Información del creador */}
                                {solvencia.creador && (
                                    <div className="flex items-center col-span-2 mt-1">
                                        {solvencia.creador.esAdmin ? (
                                            <Shield className="text-purple-500 h-4 w-4 mr-1.5" />
                                        ) : (
                                            <User className="text-gray-400 h-4 w-4 mr-1.5" />
                                        )}
                                        <div>
                                            <p className="text-xs text-gray-500">Creado por</p>
                                            <p className="text-sm font-medium flex items-center">
                                                {solvencia.creador.nombre || "Usuario"}
                                                {solvencia.creador.esAdmin && (
                                                    <span className="ml-1.5 text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                                                        Admin
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna 2: estado de pago */}
                <div className="md:col-span-2 flex flex-col justify-between">
                    <div className="flex flex-col md:items-end">
                        {!todoExonerado && (
                            <div className="bg-gray-50 p-3 rounded-lg shadow-sm w-full md:w-auto">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-600 mr-4">Total:</span>
                                    <span className="font-bold text-[#C40180]">${(totalOriginal - totalExonerado).toFixed(2)}</span>
                                </div>

                                {totalPagado > 0 && (
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-600 mr-4">Pagado:</span>
                                        <span className="font-medium text-green-600">${totalPagado.toFixed(2)}</span>
                                    </div>
                                )}

                                {totalPendiente > 0 && (
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-600 mr-4">Pendiente:</span>
                                        <span className="font-medium text-orange-600">${totalPendiente.toFixed(2)}</span>
                                    </div>
                                )}

                                {totalExonerado > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 mr-4">Exonerado:</span>
                                        <span className="font-medium text-teal-600">${totalExonerado.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {todoExonerado && (
                            <div className="bg-teal-50 p-3 rounded-lg w-full md:w-auto">
                                <div className="flex items-center">
                                    <CheckCircle className="text-teal-600 h-5 w-5 mr-2" />
                                    <span className="font-medium text-teal-700">Solvencia sin costo</span>
                                </div>
                            </div>
                        )}

                        {todoPagado && !todoExonerado && (
                            <div className="bg-green-50 p-3 rounded-lg mt-2 w-full md:w-auto">
                                <div className="flex items-center">
                                    <CheckCircle className="text-green-600 h-5 w-5 mr-2" />
                                    <span className="font-medium text-green-700">Pagado completamente</span>
                                </div>
                            </div>
                        )}

                        {/* Validez (solo para solvencias aprobadas) */}
                        {solvencia.estado === 'Aprobada' && solvencia.fechaVencimiento && (
                            <div className="bg-blue-50 p-3 rounded-lg mt-2 w-full md:w-auto">
                                <div className="flex items-center">
                                    <Calendar className="text-blue-600 h-5 w-5 mr-2" />
                                    <div>
                                        <span className="font-medium text-blue-700">Válida hasta:</span>
                                        <span className="ml-1 text-blue-700">
                                            {new Date(solvencia.fechaVencimiento).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="mt-4 flex flex-wrap gap-2 md:justify-end">
                        {solvencia.estado === 'Revisión' && (
                            <>
                                <button
                                    onClick={onAprobar}
                                    className="cursor-pointer bg-green-600 text-white px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-green-700 text-sm transition-colors"
                                >
                                    <CheckCircle size={16} />
                                    <span>Aprobar</span>
                                </button>

                                <button
                                    onClick={onRechazar}
                                    className="cursor-pointer bg-red-600 text-white px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-red-700 text-sm transition-colors"
                                >
                                    <XCircle size={16} />
                                    <span>Rechazar</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Información adicional basada en el estado */}
            {solvencia.estado === 'Aprobada' && (
                <div className="bg-green-50 p-3 rounded-md mt-4">
                    <div className="flex items-start">
                        <CheckCircle className="text-green-600 h-5 w-5 mr-2 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-green-800">Solvencia aprobada</p>
                            <p className="text-xs text-gray-700">Aprobada el {solvencia.fechaAprobacion} por {solvencia.aprobadoPor}</p>
                            {solvencia.observaciones && (
                                <p className="text-sm mt-1">{solvencia.observaciones}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {solvencia.estado === 'Rechazada' && (
                <div className="bg-red-50 p-3 rounded-md mt-4">
                    <div className="flex items-start">
                        <XCircle className="text-red-600 h-5 w-5 mr-2 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-red-800">Solvencia rechazada</p>
                            <p className="text-xs text-gray-700">Rechazada el {solvencia.fechaRechazo} por {solvencia.rechazadoPor}</p>
                            <p className="text-sm mt-1">Motivo: {solvencia.motivoRechazo}</p>
                            {solvencia.observaciones && (
                                <p className="text-sm mt-1">Observaciones: {solvencia.observaciones}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SolvenciaHeader