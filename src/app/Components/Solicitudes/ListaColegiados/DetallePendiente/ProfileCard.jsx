"use client"

import SessionInfo from "@/Components/SessionInfo";
import { motion } from "framer-motion";
import {
    AlertCircle,
    AlertTriangle,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    GraduationCap,
    Mail,
    Phone,
    User,
    UserX,
    XCircle,
} from "lucide-react";

export default function ProfileCard({ props }) {
    const {
        pendiente,
        obtenerIniciales,
        nombreCompleto,
        fechaSolicitud,
        documentosCompletos,
        pagosPendientes,
        setMostrarConfirmacion,
        setMostrarRechazo,
        setMostrarExoneracion,
        isRechazada,
        isDenegada,
        isAdmin,
        setShowReportModal,
        docsApproved
    } = props;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
        >
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/5 flex justify-center items-center mb-8 md:mb-0">
                    {/* Iniciales en lugar de foto de perfil */}
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg shadow-black/40 bg-gradient-to-br from-[#C40180] to-[#7D0053] flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">{obtenerIniciales()}</span>
                    </div>
                </div>
                <div className="md:w-3/4">
                    <div className="flex flex-col md:flex-row md:justify-between mb-4">
                        <div className="md:ml-2">
                            <h1 className="text-2xl font-bold text-gray-800 mb-1">{nombreCompleto}</h1>
                            <div className="flex items-center text-sm text-gray-500">
                                <Clock size={14} className="mr-1" />
                                <span>Solicitud pendiente desde {fechaSolicitud}</span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                            {/* Estados de la solicitud */}

                            {isRechazada && isAdmin ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                    <AlertTriangle size={12} className="mr-1" />
                                    Rechazada
                                </span>
                            ) : isDenegada && isAdmin ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                    <UserX size={12} className="mr-1" />
                                    Anulada
                                </span>
                            ) : isAdmin && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                    <Clock size={12} className="mr-1" />
                                    Pendiente de aprobación
                                </span>
                            )}

                            {/* Estado de pagos pendientes */}
                            {pagosPendientes && isAdmin && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                    <XCircle size={12} className="mr-1" />
                                    Pagos pendientes
                                </span>
                            )}

                            {/* Estado de documentos - solo si no están completos */}
                            {!documentosCompletos && isAdmin && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                    <AlertCircle size={12} className="mr-1" />
                                    Documentación incompleta
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mt-4 w-full">
                        <div className="flex items-center bg-gray-50 p-3 rounded-md sm:w-[45%]">
                            <Mail className="text-[#C40180] h-5 w-5 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Correo electrónico</p>
                                <p className="text-sm text-gray-700 max-w-[45%]">{pendiente.persona.correo}</p>
                            </div>
                        </div>
                        <div className="flex items-center bg-gray-50 p-3 rounded-md sm:w-[45%]">
                            <Phone className="text-[#C40180] h-5 w-5 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Teléfono</p>
                                <p className="text-sm text-gray-700">{pendiente.persona.telefono_movil}</p>
                            </div>
                        </div>
                        <div className="flex items-center bg-gray-50 p-3 rounded-md sm:w-[45%]">
                            <User className="text-[#C40180] h-5 w-5 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Identificación</p>
                                <p className="text-sm text-gray-700">
                                    {pendiente.persona.identificacion}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center bg-gray-50 p-3 rounded-md sm:w-[45%]">
                            <Calendar className="text-[#C40180] h-5 w-5 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Fecha de solicitud</p>
                                <p className="text-sm text-gray-700">{fechaSolicitud}</p>
                            </div>
                        </div>
                        <div className="flex items-center bg-gray-50 p-3 rounded-md sm:w-[45%]">
                            <GraduationCap className="text-[#C40180] h-5 w-5 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Profesión/Ocupación</p>
                                <p className="text-sm text-gray-700">{pendiente.tipo_profesion_display}</p>
                            </div>
                        </div>

                        {/* Información del creador del registro */}
                        {pendiente.user_admin_create_username && isAdmin && (
                            <div className="bg-gray-50 p-2 rounded-md col-span-2 mt-4 w-full">
                                <SessionInfo creador={{ username: pendiente.user_admin_create_username, fecha: pendiente.created_at }} variant="compact" />

                            </div>
                        )}

                        {/* Información sobre el rechazo si aplica */}
                        {isRechazada && pendiente.user_admin_update_username && isAdmin && (
                            <div className="bg-yellow-50 p-2 rounded-md col-span-2 mt-4 border border-yellow-100">
                                <div className="flex items-start">
                                    <AlertTriangle size={18} className="text-yellow-600 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-800">
                                            Rechazada por: {pendiente.user_admin_update_username}
                                        </p>
                                        <p className="text-xs text-yellow-700">Fecha: {pendiente.updated_at}</p>
                                        <p className="text-xs text-yellow-700 mt-1">Motivo: {pendiente.motivoRechazo}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Información sobre la denegación si aplica */}
                        {isDenegada && pendiente.user_admin_update_username && isAdmin && (
                            <div className="bg-red-50 p-2 rounded-md col-span-2 mt-4 border border-red-100">
                                <div className="flex items-start">
                                    <UserX size={18} className="text-red-600 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-red-800">Anulada por: {pendiente.user_admin_update_username}</p>
                                        <p className="text-xs text-red-700">Fecha: {pendiente.updated_at}</p>
                                        <p className="text-xs text-red-700 mt-1">Motivo: {pendiente.motivo_rechazo}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Solo mostrar botones si NO está denegada */}
                    {!isDenegada && isAdmin && (
                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            {/* Botón de aprobación con condición actualizada */}
                            <button
                                onClick={() => setMostrarConfirmacion(true)}
                                disabled={!docsApproved || (pagosPendientes && !pendiente?.exoneracionPagos?.fecha)}
                                className={`cursor-pointer bg-gradient-to-r ${!docsApproved || (pagosPendientes && !pendiente?.exoneracionPagos?.fecha)
                                    ? "from-gray-400 to-gray-500 cursor-not-allowed"
                                    : "from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                    } text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-sm font-medium`}
                                title={
                                    !docsApproved
                                        ? "Debe aprobar todos los documentos para continuar"
                                        : pagosPendientes && !pendiente?.exoneracionPagos?.fecha
                                            ? "Complete el pago o exonere el pago para aprobar"
                                            : "Aprobar Solicitud"
                                }
                            >
                                <CheckCircle size={18} />
                                <span>Aprobar Solicitud</span>
                            </button>

                            {/* Para rechazadas, mostrar botón de denegar; para pendientes, mostrar botón de rechazar */}
                            <button
                                onClick={() => setMostrarRechazo(true)}
                                className={`cursor-pointer bg-gradient-to-r ${isRechazada ? "from-red-600 to-red-700" : "from-yellow-600 to-yellow-700"
                                    } text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 shadow-sm font-medium`}
                            >
                                <XCircle size={18} />
                                <span>{isRechazada ? "Anular Solicitud" : "Rechazar Solicitud"}</span>
                            </button>

                            {/* Botón para exonerar pagos (solo si hay pagos pendientes) */}
                            {pagosPendientes && (
                                <button
                                    onClick={() => setMostrarExoneracion(true)}
                                    className="cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 shadow-sm font-medium"
                                >
                                    <CreditCard size={18} />
                                    <span>Exonerar pagos</span>
                                </button>
                            )}

                            <button
                                onClick={() => setShowReportModal(true)}
                                className="cursor-pointer bg-gradient-to-r from-red-700 to-red-800 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 shadow-sm font-medium"
                            >
                                <AlertTriangle size={18} />
                                <span>Reportar Irregulidad</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
