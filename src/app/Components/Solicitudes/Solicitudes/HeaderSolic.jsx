import {
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    User,
    Calendar,
    Shield
} from "lucide-react"

const SolicitudHeader = ({ solicitud, totales, isAdmin = false, onAprobar, onRechazar }) => {
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
                        {/* Icono según tipo de solicitud */}
                        <div className="bg-[#F8E8F3] p-2 rounded-lg mr-3 hidden sm:block">
                            <FileText className="text-[#C40180] h-7 w-7" />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-gray-800 flex items-center">
                                Solicitud
                                <span className={`ml-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${solicitud.status === 'Pendiente'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : solicitud.estado === 'Aprobada'
                                        ? 'bg-green-100 text-green-800'
                                        : solicitud.estado === 'Exonerada'
                                            ? 'bg-teal-100 text-teal-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                    {solicitud.estado === 'Pendiente' && <Clock size={14} />}
                                    {solicitud.estado === 'Aprobada' && <CheckCircle size={14} />}
                                    {solicitud.estado === 'Exonerada' && <CheckCircle size={14} />}
                                    {solicitud.estado === 'Rechazada' && <XCircle size={14} />}
                                    {solicitud.estado}
                                </span>
                            </h1>
                            <p className="text-sm text-gray-500">Referencia: {solicitud.referencia}</p>

                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <div className="flex items-center">
                                    <User className="text-gray-400 h-4 w-4 mr-1.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Colegiado</p>
                                        <p className="text-sm font-medium">{solicitud.colegiadoNombre}</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Calendar className="text-gray-400 h-4 w-4 mr-1.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Fecha solicitud</p>
                                        <p className="text-sm font-medium">{solicitud.fecha}</p>
                                    </div>
                                </div>

                                {/* Información del creador - AÑADIDO */}
                                {solicitud.creador && isAdmin && (
                                    <div className="flex items-center col-span-2 mt-1">
                                        {solicitud.creador.esAdmin ? (
                                            <Shield className="text-purple-500 h-4 w-4 mr-1.5" />
                                        ) : (
                                            <User className="text-gray-400 h-4 w-4 mr-1.5" />
                                        )}
                                        <div>
                                            <p className="text-xs text-gray-500">Creado por</p>
                                            <p className="text-sm font-medium flex items-center">
                                                {solicitud.creador.nombre || "Usuario"}
                                                {solicitud.creador.esAdmin && (
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

                {/* Columna 2: status de pago */}
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
                                    <span className="font-medium text-teal-700">Solicitud exonerada de pago</span>
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
                    </div>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 md:justify-end">
                {solicitud.estado === 'Pendiente' && isAdmin && (
                    <>
                        <button
                            onClick={onAprobar}
                            disabled={!((!todoExonerado || !todoPagado) && solicitud.isAllDocumentosValidados)}
                            className={`${(!todoExonerado || !todoPagado) && solicitud.isAllDocumentosValidados ? 'bg-green-600' :'bg-gray-400'  } text-white px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-green-700 text-sm transition-colors ${(!todoExonerado || !todoPagado) && !solicitud.isAllDocumentosValidados ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <CheckCircle size={16} />
                            <span>Aprobar</span>
                        </button>

                        <button
                            onClick={onRechazar}
                            className="bg-red-600 text-white px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-red-700 text-sm transition-colors"
                        >
                            <XCircle size={16} />
                            <span>Rechazar</span>
                        </button>
                    </>
                )}
            </div>

            {/* Información adicional basada en el status */}
            {solicitud.status === 'Aprobada' && (
                <div className="bg-green-50 p-3 rounded-md mt-4">
                    <div className="flex items-start">
                        <CheckCircle className="text-green-600 h-5 w-5 mr-2 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-green-800">Solicitud aprobada</p>
                            <p className="text-xs text-gray-700">Aprobada el {solicitud.fechaAprobacion} por {solicitud.aprobadoPor}</p>
                            {solicitud.observaciones && (
                                <p className="text-sm mt-1">{solicitud.observaciones}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {solicitud.status === 'Exonerada' && (
                <div className="bg-teal-50 p-3 rounded-md mt-4">
                    <div className="flex items-start">
                        <CheckCircle className="text-teal-600 h-5 w-5 mr-2 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-teal-800">Solicitud exonerada de pago</p>
                            <p className="text-xs text-gray-700">Registrada el {solicitud.fechaCompletado || solicitud.fecha}</p>
                            {solicitud.observaciones && (
                                <p className="text-sm mt-1">{solicitud.observaciones}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {solicitud.status === 'Rechazada' && (
                <div className="bg-red-50 p-3 rounded-md mt-4">
                    <div className="flex items-start">
                        <XCircle className="text-red-600 h-5 w-5 mr-2 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-red-800">Solicitud rechazada</p>
                            <p className="text-xs text-gray-700">Rechazada el {solicitud.fechaRechazo} por {solicitud.rechazadoPor}</p>
                            <p className="text-sm mt-1">Motivo: {solicitud.motivoRechazo}</p>
                            {solicitud.observaciones && (
                                <p className="text-sm mt-1">Observaciones: {solicitud.observaciones}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SolicitudHeader