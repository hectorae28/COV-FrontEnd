"use client"
import {
    AlertCircle,
    CheckCircle,
    ChevronLeft,
    Download,
    MessageSquare,
    X
} from "lucide-react"
import { useEffect, useState } from "react"

// Componentes importados
import ConfirmacionModal from "./ConfirmacionModal"
import DocumentosSection from "./DocumentosSection"
import DocumentViewer from "./DocumentViewer"
import HistorialPagosSection from "./HistorialPagosSection"
import PagosModalSolv from "./PagosModalSolv"
import RechazoModal from "./RechazoModal"
import SolvenciaHeader from "./SolvenciaHeader"

export default function DetalleSolvencia({ solvenciaId, onVolver, solvencias, actualizarSolvencia }) {
    // Estados principales
    const [solvencia, setSolvencia] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [alertaExito, setAlertaExito] = useState(null)

    // Estados de modales
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
    const [mostrarRechazo, setMostrarRechazo] = useState(false)
    const [mostrarModalPagos, setMostrarModalPagos] = useState(false)
    const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null)

    // Estados para formularios
    const [motivoRechazo, setMotivoRechazo] = useState("")
    const [observaciones, setObservaciones] = useState("")
    const [fechaVencimiento, setFechaVencimiento] = useState("")

    // Obtener datos de la solvencia
    useEffect(() => {
        if (solvencias && solvenciaId) {
            const solvenciaEncontrada = solvencias.find(s => s.id === solvenciaId)

            if (solvenciaEncontrada) {
                setSolvencia(solvenciaEncontrada)
                setObservaciones(solvenciaEncontrada.observaciones || "")

                // Si tiene fecha de vencimiento, establecerla
                if (solvenciaEncontrada.fechaVencimiento) {
                    setFechaVencimiento(solvenciaEncontrada.fechaVencimiento)
                } else {
                    // Por defecto, establecer fecha de vencimiento a 1 año desde la fecha actual
                    const hoy = new Date()
                    const unAnioDelante = new Date(hoy.setFullYear(hoy.getFullYear() + 1))
                    const formato = unAnioDelante.toISOString().split('T')[0] // formato YYYY-MM-DD
                    setFechaVencimiento(formato)
                }
            }

            setIsLoading(false)
        }
    }, [solvenciaId, solvencias])

    // Calcular totales
    const calcularTotales = (solvenciaData) => {
        if (!solvenciaData) {
            return {
                totalOriginal: 0,
                totalExonerado: 0,
                totalPendiente: 0,
                totalPagado: 0,
                todoExonerado: false,
                todoPagado: false
            }
        }

        const costo = solvenciaData.costo || 0
        const exonerado = solvenciaData.exonerado || false
        const pagado = solvenciaData.estado === "Aprobada"

        return {
            totalOriginal: costo,
            totalExonerado: exonerado ? costo : 0,
            totalPendiente: !exonerado && !pagado ? costo : 0,
            totalPagado: pagado && !exonerado ? costo : 0,
            todoExonerado: exonerado,
            todoPagado: pagado && !exonerado
        }
    }

    const totales = calcularTotales(solvencia)

    // Función para aprobar la solvencia
    const handleAprobarSolvencia = async () => {
        try {
            // Validar que la fecha de vencimiento sea válida
            if (!fechaVencimiento) {
                alert("Debe seleccionar una fecha de vencimiento")
                return
            }

            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 800))

            const fechaActual = new Date().toLocaleDateString()
            const solvenciaActualizada = {
                ...solvencia,
                estado: "Aprobada",
                fechaAprobacion: fechaActual,
                fechaVencimiento: fechaVencimiento,
                aprobadoPor: "Admin",
                observaciones: observaciones,
                certificadoUrl: `/solvencias/certificado-${solvencia.id}.pdf` // URL simulada de certificado
            }

            actualizarSolvencia(solvenciaActualizada)
            setSolvencia(solvenciaActualizada)
            setMostrarConfirmacion(false)
            mostrarAlerta("exito", "La solvencia ha sido aprobada correctamente")
        } catch (error) {
            console.error("Error al aprobar solvencia:", error)
        }
    }

    // Función para rechazar la solvencia
    const handleRechazarSolvencia = async () => {
        try {
            if (!motivoRechazo.trim()) {
                alert("Debe ingresar un motivo de rechazo")
                return
            }

            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 800))

            const solvenciaActualizada = {
                ...solvencia,
                estado: "Rechazada",
                fechaRechazo: new Date().toLocaleDateString(),
                rechazadoPor: "Admin",
                motivoRechazo: motivoRechazo,
                observaciones: observaciones
            }

            actualizarSolvencia(solvenciaActualizada)
            setSolvencia(solvenciaActualizada)
            setMostrarRechazo(false)
            mostrarAlerta("alerta", "La solvencia ha sido rechazada")
        } catch (error) {
            console.error("Error al rechazar solvencia:", error)
        }
    }

    // Función para ver un documento
    const handleVerDocumento = (documento) => {
        setDocumentoSeleccionado(documento)
    }

    // Función para iniciar proceso de pago
    const handleIniciarPago = () => {
        if (totales.totalPendiente === 0) {
            alert("No hay montos pendientes por pagar")
            return
        }

        setMostrarModalPagos(true)
    }

    // Función que se ejecuta cuando se completa un pago
    const handlePaymentComplete = (pagoInfo) => {
        // Actualizar solvencia con el pago
        const solvenciaActualizada = {
            ...solvencia,
            estadoPago: "Pagado",
            comprobantesPago: [...(solvencia.comprobantesPago || []), {
                id: `pago_${new Date().getTime()}`,
                archivo: pagoInfo.archivo,
                fecha: pagoInfo.fecha,
                monto: pagoInfo.monto,
                metodoPago: pagoInfo.metodoPago,
                referencia: pagoInfo.referencia
            }]
        }

        actualizarSolvencia(solvenciaActualizada)
        setSolvencia(solvenciaActualizada)
        setMostrarModalPagos(false)
        mostrarAlerta("exito", "El pago se ha registrado correctamente")
    }

    // Función para mostrar alertas temporales
    const mostrarAlerta = (tipo, mensaje) => {
        setAlertaExito({
            tipo: tipo,
            mensaje: mensaje
        })

        // Limpiar alerta después de un tiempo
        setTimeout(() => {
            setAlertaExito(null)
        }, 5000)
    }

    // Renderizar estado de carga
    if (isLoading) {
        return (
            <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
            </div>
        )
    }

    // Renderizar mensaje de error si no se encuentra la solvencia
    if (!solvencia) {
        return (
            <div className="w-full px-4 md:px-10 py-10 md:py-12">
                <div className="bg-red-50 text-red-700 p-4 rounded-md">
                    No se pudo encontrar la información de la solvencia.
                </div>
                <button
                    onClick={onVolver}
                    className="mt-4 inline-flex items-center text-[#C40180] hover:underline"
                >
                    <ChevronLeft size={20} className="mr-1" />
                    Volver a la lista de solvencias
                </button>
            </div>
        )
    }

    return (
        <div className="w-full px-4 md:px-10 py-6 md:py-28">
            {/* Botón de regreso */}
            <div className="mb-4">
                <button
                    onClick={onVolver}
                    className="cursor-pointer text-sm text-[#590248] hover:text-[#C40180] flex items-center"
                >
                    <ChevronLeft size={20} className="mr-1" />
                    Volver a la lista de solvencias
                </button>
            </div>

            {/* Alertas de éxito o información */}
            {alertaExito && (
                <div className={`mb-4 p-3 rounded-md flex items-start justify-between ${alertaExito.tipo === "exito"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                    <div className="flex items-center">
                        {alertaExito.tipo === "exito" ? (
                            <CheckCircle size={18} className="mr-2 flex-shrink-0" />
                        ) : (
                            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                        )}
                        <span>{alertaExito.mensaje}</span>
                    </div>
                    <button
                        onClick={() => setAlertaExito(null)}
                        className={alertaExito.tipo === "exito" ? "text-green-700" : "text-yellow-700"}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Encabezado de solvencia */}
            <SolvenciaHeader
                solvencia={solvencia}
                totales={totales}
                onAprobar={() => setMostrarConfirmacion(true)}
                onRechazar={() => setMostrarRechazo(true)}
            />

            {/* Documentos requeridos */}
            <DocumentosSection
                solvencia={solvencia}
                onVerDocumento={handleVerDocumento}
            />

            {/* Historial de pagos */}
            {solvencia.comprobantesPago && solvencia.comprobantesPago.length > 0 && (
                <HistorialPagosSection
                    comprobantes={solvencia.comprobantesPago}
                    onVerDocumento={handleVerDocumento}
                />
            )}

            {/* Observaciones y configuración - solo en estado revisión */}
            {solvencia.estado === 'Revisión' && (
                <div className="bg-white rounded-lg shadow-md p-4 mb-5">
                    <h2 className="text-base font-medium text-gray-900 mb-3">Observaciones y configuración</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Observaciones</label>
                            <textarea
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md text-sm"
                                placeholder="Agregue observaciones o notas sobre esta solvencia..."
                                rows="3"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Fecha de vencimiento</label>
                            <input
                                type="date"
                                value={fechaVencimiento}
                                onChange={(e) => setFechaVencimiento(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md text-sm"
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                La solvencia será válida hasta esta fecha.
                            </p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center">
                            <input
                                id="exonerar"
                                type="checkbox"
                                checked={solvencia.exonerado || false}
                                onChange={() => {
                                    const solvenciaActualizada = {
                                        ...solvencia,
                                        exonerado: !solvencia.exonerado,
                                        costo: !solvencia.exonerado ? 0 :
                                            solvencia.tipoId === 'profesional' ? 50 :
                                                solvencia.tipoId === 'ejercicio' ? 75 : 100
                                    };
                                    actualizarSolvencia(solvenciaActualizada);
                                    setSolvencia(solvenciaActualizada);
                                }}
                                className="h-4 w-4 text-[#C40180] focus:ring-[#C40180] border-gray-300 rounded"
                            />
                            <label htmlFor="exonerar" className="ml-2 block text-sm text-gray-700">
                                Exonerar de pago
                            </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-6">
                            Al marcar esta opción, se exonerará el costo de la solvencia.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <button
                                onClick={handleIniciarPago}
                                disabled={totales.totalPendiente === 0}
                                className={`cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm ${totales.totalPendiente > 0
                                        ? "bg-[#C40180] text-white hover:bg-[#A00060]"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                <Download size={16} />
                                <span>Registrar pago</span>
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setMostrarRechazo(true)}
                                className="cursor-pointer flex-1 bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
                            >
                                Rechazar
                            </button>
                            <button
                                onClick={() => setMostrarConfirmacion(true)}
                                className="cursor-pointer flex-1 bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600"
                            >
                                Aprobar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Descargar certificado - solo para solvencias aprobadas */}
            {solvencia.estado === 'Aprobada' && (
                <div className="bg-white rounded-lg shadow-md p-4 mb-5">
                    <h2 className="text-base font-medium text-gray-900 mb-3">Certificado de solvencia</h2>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div>
                            <h3 className="font-medium text-green-800">Certificado disponible</h3>
                            <p className="text-sm text-gray-600">
                                El certificado fue generado el {solvencia.fechaAprobacion} y es válido hasta {solvencia.fechaVencimiento}.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Botones adicionales */}
            <div className="flex flex-wrap gap-3">
                <button className="cursor-pointer bg-gradient-to-t from-[#D7008A] to-[#41023B] text-white px-3 py-2 rounded-md flex items-center gap-2 hover:bg-purple-700 transition-colors text-sm">
                    <MessageSquare size={16} />
                    <span>Enviar mensaje al colegiado</span>
                </button>
            </div>

            {/* Modal de confirmación para aprobación */}
            {mostrarConfirmacion && (
                <ConfirmacionModal
                    onCancel={() => setMostrarConfirmacion(false)}
                    onConfirm={handleAprobarSolvencia}
                    titulo="Confirmar aprobación de solvencia"
                    mensaje="¿Está seguro que desea aprobar esta solvencia? Una vez aprobada, se generará el certificado correspondiente."
                />
            )}

            {/* Modal de rechazo */}
            {mostrarRechazo && (
                <RechazoModal
                    motivoRechazo={motivoRechazo}
                    setMotivoRechazo={setMotivoRechazo}
                    onCancel={() => setMostrarRechazo(false)}
                    onConfirm={handleRechazarSolvencia}
                />
            )}

            {/* Modal para ver documento */}
            {documentoSeleccionado && (
                <DocumentViewer
                    documento={documentoSeleccionado}
                    onClose={() => setDocumentoSeleccionado(null)}
                />
            )}

            {/* Modal de pagos */}
            {mostrarModalPagos && (
                <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-medium text-gray-900">
                                Registrar pago de solvencia
                            </h3>
                            <button
                                onClick={() => setMostrarModalPagos(false)}
                                className="cursor-pointer text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-4">
                            <PagosModalSolv
                                onPaymentComplete={handlePaymentComplete}
                                totalPendiente={totales.totalPendiente}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}