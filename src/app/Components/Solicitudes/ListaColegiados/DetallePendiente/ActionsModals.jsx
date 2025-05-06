"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, ChevronLeft, ChevronRight, XCircle, AlertOctagon, X } from "lucide-react"

// Modal de Aprobación
export function ApprovalModal({
    nombreCompleto,
    datosRegistro,
    setDatosRegistro,
    pasoModal,
    setPasoModal,
    handleAprobarSolicitud,
    documentosCompletos,
    onClose,
    pendiente,
}) {
    const [errores, setErrores] = useState({})

    // Verificar si puede continuar al paso 2
    const puedeAvanzar = () => {
        // Validar campos del formulario
        const nuevosErrores = {}
        if (!datosRegistro.libro.trim()) nuevosErrores.libro = "El libro es requerido"
        if (!datosRegistro.pagina.trim()) nuevosErrores.pagina = "La página es requerida"
        if (!datosRegistro.num_cov.trim()) nuevosErrores.num_cov = "El número de COV es requerido"

        setErrores(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }

    // Avanzar al siguiente paso
    const avanzarPaso = () => {
        if (puedeAvanzar()) {
            setPasoModal(2)
        }
    }

    // Volver al paso anterior
    const retrocederPaso = () => {
        setPasoModal(1)
    }

    // Manejar cambios en los campos
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setDatosRegistro((prev) => ({
            ...prev,
            [name]: value,
        }))
        // Limpiar error al modificar el campo
        if (errores[name]) {
            setErrores((prev) => {
                const nuevosErrores = { ...prev }
                delete nuevosErrores[name]
                return nuevosErrores
            })
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden"
            >
                {/* Encabezado */}
                <div className="bg-green-50 p-4 border-b border-green-100">
                    <div className="flex items-center justify-center mb-2 text-green-600">
                        <CheckCircle size={40} />
                    </div>
                    <h3 className="text-xl font-semibold text-center text-gray-900">Aprobar solicitud</h3>
                </div>

                {/* Contenido del paso 1 - Datos de registro */}
                {pasoModal === 1 && (
                    <div className="p-6">
                        {!documentosCompletos && (
                            <div className="mb-6 bg-red-50 p-4 rounded-md border border-red-100 flex items-start">
                                <XCircle size={20} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-red-800 font-medium text-sm">Documentación incompleta</h4>
                                    <p className="text-red-700 text-xs mt-1">
                                        La solicitud no puede ser aprobada porque faltan documentos requeridos. Asegúrese de que todos los
                                        documentos estén completos antes de aprobar.
                                    </p>
                                </div>
                            </div>
                        )}
                        {pendiente && pendiente.pagosPendientes && !pendiente.exoneracionPagos?.fecha && (
                            <div className="mb-6 bg-red-50 p-4 rounded-md border border-red-100 flex items-start">
                                <XCircle size={20} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-red-800 font-medium text-sm">Pagos pendientes</h4>
                                    <p className="text-red-700 text-xs mt-1">
                                        La solicitud no puede ser aprobada porque hay pagos pendientes. Complete los pagos o exonere los
                                        pagos antes de aprobar.
                                    </p>
                                </div>
                            </div>
                        )}

                        <p className="text-center text-gray-600 mb-6">
                            Está a punto de aprobar la solicitud de{" "}
                            <span className="font-medium text-gray-900">{nombreCompleto}</span>. Por favor complete los datos de
                            registro.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="libro" className="block text-sm font-medium text-gray-700 mb-1">
                                    Libro <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="libro"
                                    name="libro"
                                    value={datosRegistro.libro}
                                    onChange={handleInputChange}
                                    className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all ${errores.libro ? "border-red-300 bg-red-50" : "border-gray-300"
                                        }`}
                                    placeholder="Ej: A-001"
                                />
                                {errores.libro && <p className="text-red-500 text-xs mt-1">{errores.libro}</p>}
                            </div>

                            <div>
                                <label htmlFor="pagina" className="block text-sm font-medium text-gray-700 mb-1">
                                    Página <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="pagina"
                                    name="pagina"
                                    value={datosRegistro.pagina}
                                    onChange={handleInputChange}
                                    className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all ${errores.pagina ? "border-red-300 bg-red-50" : "border-gray-300"
                                        }`}
                                    placeholder="Ej: 25"
                                />
                                {errores.pagina && <p className="text-red-500 text-xs mt-1">{errores.pagina}</p>}
                            </div>

                            <div>
                                <label htmlFor="num_cov" className="block text-sm font-medium text-gray-700 mb-1">
                                    Número de COV <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="num_cov"
                                    name="num_cov"
                                    value={datosRegistro.num_cov}
                                    onChange={handleInputChange}
                                    className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all ${errores.num_cov ? "border-red-300 bg-red-50" : "border-gray-300"
                                        }`}
                                    placeholder="Ej: 12345"
                                />
                                {errores.num_cov && <p className="text-red-500 text-xs mt-1">{errores.num_cov}</p>}
                            </div>
                        </div>

                        <div className="flex justify-between mt-8">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={avanzarPaso}
                                disabled={
                                    !documentosCompletos || (pendiente && pendiente.pagosPendientes && !pendiente.exoneracionPagos?.fecha)
                                }
                                className={`px-4 py-2 flex items-center ${documentosCompletos && (!pendiente || !pendiente.pagosPendientes || pendiente.exoneracionPagos?.fecha)
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-gray-400 cursor-not-allowed"
                                    } text-white rounded-md transition-colors`}
                            >
                                Continuar
                                <ChevronRight size={16} className="ml-1" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Contenido del paso 2 - Confirmación */}
                {pasoModal === 2 && (
                    <div className="p-6">
                        <div className="mb-6 bg-green-50 border border-green-100 rounded-md p-4">
                            <h4 className="font-medium text-gray-900 mb-3">Resumen de registro</h4>
                            <ul className="space-y-2">
                                <li className="flex justify-between text-sm">
                                    <span className="text-gray-600">Libro:</span>
                                    <span className="font-medium text-gray-800">{datosRegistro.libro}</span>
                                </li>
                                <li className="flex justify-between text-sm">
                                    <span className="text-gray-600">Página:</span>
                                    <span className="font-medium text-gray-800">{datosRegistro.pagina}</span>
                                </li>
                                <li className="flex justify-between text-sm">
                                    <span className="text-gray-600">Número de COV:</span>
                                    <span className="font-medium text-gray-800">{datosRegistro.num_cov}</span>
                                </li>
                            </ul>
                        </div>

                        <p className="text-center text-gray-600 mb-6">
                            ¿Está seguro de que desea aprobar la solicitud de{" "}
                            <span className="font-medium text-gray-900">{nombreCompleto}</span>? Una vez aprobada, el colegiado será
                            registrado oficialmente.
                        </p>

                        <div className="flex justify-between">
                            <button
                                onClick={retrocederPaso}
                                className="px-4 py-2 flex items-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <ChevronLeft size={16} className="mr-1" />
                                Volver
                            </button>
                            <button
                                onClick={handleAprobarSolicitud}
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <CheckCircle size={16} />
                                Aprobar solicitud
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

// Modal de Rechazo/Denegación
export function RejectModal({
    nombreCompleto,
    motivoRechazo,
    setMotivoRechazo,
    handleRechazarSolicitud,
    handleDenegarSolicitud,
    onClose,
}) {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden"
            >
                <div className="bg-red-50 p-4 border-b border-red-100">
                    <div className="flex items-center justify-center mb-2 text-red-600">
                        <XCircle size={40} />
                    </div>
                    <h3 className="text-xl font-semibold text-center text-gray-900">Rechazar solicitud</h3>
                </div>
                <div className="p-6">
                    <p className="text-center text-gray-600 mb-4">
                        Está a punto de rechazar la solicitud de <span className="font-medium text-gray-900">{nombreCompleto}</span>
                        .
                    </p>

                    <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 mb-4">
                        <h4 className="text-sm font-medium text-yellow-800 mb-1 flex items-center">
                            <AlertOctagon size={16} className="mr-1" /> Diferencia entre rechazar y denegar
                        </h4>
                        <p className="text-xs text-yellow-700">
                            • <strong>Rechazar:</strong> Permite correcciones futuras. El solicitante puede volver a intentarlo.
                            <br />• <strong>Denegar:</strong> Rechazo definitivo. No se permitirán más acciones sobre esta solicitud.
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Motivo del rechazo o denegación <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={motivoRechazo}
                            onChange={(e) => setMotivoRechazo(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all"
                            placeholder="Ingrese el motivo del rechazo o denegación"
                            rows="3"
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-1">
                            Este motivo será enviado al solicitante por correo electrónico y quedará registrado en el sistema.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <button
                            onClick={onClose}
                            className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleRechazarSolicitud}
                            className="cursor-pointer px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-md hover:from-[#C40180] hover:to-[#C40180] transition-all shadow-sm font-medium"
                        >
                            Rechazar solicitud
                        </button>
                        <button
                            onClick={handleDenegarSolicitud}
                            className="cursor-pointer px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-600 hover:to-red-600 transition-all shadow-sm font-medium"
                        >
                            Denegar solicitud
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

// Modal de Exoneración
export function ExonerationModal({
    nombreCompleto,
    motivoExoneracion,
    setMotivoExoneracion,
    handleExonerarPagos,
    onClose,
}) {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-xl"
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-medium text-[#41023B]">Exonerar pagos</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-700 mb-4">
                            Está a punto de exonerar los pagos para <strong>{nombreCompleto}</strong>. Esta acción marcará al
                            colegiado como solvente sin necesidad de realizar un pago.
                        </p>

                        <div className="p-4 bg-[#41023B]/20 rounded-xl border border-[#41023B] mb-4">
                            <p className="text-md text-gray-800">
                                <span className="text-[#41023B] font-bold">Importante:</span> La exoneración de pagos es una acción
                                administrativa que debe estar debidamente justificada.
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Motivo de exoneración <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={motivoExoneracion}
                            onChange={(e) => setMotivoExoneracion(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:border-[#D7008A]"
                            rows={4}
                            placeholder="Ingrese el motivo por el cual se exoneran los pagos..."
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleExonerarPagos}
                            disabled={!motivoExoneracion.trim()}
                            className={`px-4 py-2 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-md hover:opacity-90 transition-colors ${!motivoExoneracion.trim() ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            Confirmar exoneración
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
