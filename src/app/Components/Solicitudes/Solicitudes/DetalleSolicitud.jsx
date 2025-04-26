"use client"
import { useState, useEffect } from "react"
import { 
  ChevronLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  MessageSquare,
  Download
} from "lucide-react"

// Componentes importados
import PagosColg from "@/app/Components/Solicitudes/Solicitudes/PagosModalSolic"
import SolicitudHeader from "./HeaderSolic"
import DocumentosSection from "./DocumentosSection"
import ServiciosSection from "./ServiciosSection"
import HistorialPagosSection from "./HistorialPagosSection"
import ConfirmacionModal from "./ConfirmacionModal"
import RechazoModal from "./RechazoModal"
import DocumentViewer from "./DocumentViewer"

export default function DetalleSolicitud({ solicitudId, onVolver, solicitudes, actualizarSolicitud }) {
  // Estados principales
  const [solicitud, setSolicitud] = useState(null)
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

  // Obtener datos de la solicitud
  useEffect(() => {
    if (solicitudes && solicitudId) {
      const solicitudEncontrada = solicitudes.find(s => s.id === solicitudId)
      
      if (solicitudEncontrada) {
        setSolicitud(solicitudEncontrada)
        setObservaciones(solicitudEncontrada.observaciones || "")
      }
      
      setIsLoading(false)
    }
  }, [solicitudId, solicitudes])

  // Calcular totales
  const calcularTotales = (solicitudData) => {
    if (!solicitudData?.itemsSolicitud) return { totalOriginal: 0, totalExonerado: 0, totalPendiente: 0, totalPagado: 0 }
    
    const totalOriginal = solicitudData.itemsSolicitud.reduce((sum, item) => sum + item.costo, 0)
    const totalExonerado = solicitudData.itemsSolicitud.reduce((sum, item) => sum + (item.exonerado ? item.costo : 0), 0)
    
    // Cálculo mejorado para pagos parciales
    let totalPendiente = 0
    let totalPagado = 0
    
    solicitudData.itemsSolicitud.forEach(item => {
      if (item.exonerado) {
        // No hacer nada, ya se contabilizó en totalExonerado
      } else if (item.pagado) {
        // Ítems completamente pagados
        totalPagado += item.costo
      } else if (item.pagadoParcialmente) {
        // Ítems parcialmente pagados
        const montoPagado = item.montoPagado || 0
        totalPagado += montoPagado
        totalPendiente += item.costo - montoPagado
      } else {
        // Ítems sin pagar
        totalPendiente += item.costo
      }
    })
    
    const todoExonerado = totalOriginal === totalExonerado || solicitudData?.estado === "Exonerada"
    const todoPagado = totalPendiente === 0 && !todoExonerado
    
    return { totalOriginal, totalExonerado, totalPendiente, totalPagado, todoExonerado, todoPagado }
  }
  
  const totales = calcularTotales(solicitud)
  
  // Función para aprobar la solicitud
  const handleAprobarSolicitud = async () => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const solicitudActualizada = {
        ...solicitud,
        estado: "Aprobada",
        fechaAprobacion: new Date().toLocaleDateString(),
        aprobadoPor: "Admin",
        observaciones: observaciones
      }
      
      actualizarSolicitud(solicitudActualizada)
      setSolicitud(solicitudActualizada)
      setMostrarConfirmacion(false)
      mostrarAlerta("exito", "La solicitud ha sido aprobada correctamente")
    } catch (error) {
      console.error("Error al aprobar solicitud:", error)
    }
  }
  
  // Función para rechazar la solicitud
  const handleRechazarSolicitud = async () => {
    try {
      if (!motivoRechazo.trim()) {
        alert("Debe ingresar un motivo de rechazo")
        return
      }
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const solicitudActualizada = {
        ...solicitud,
        estado: "Rechazada",
        fechaRechazo: new Date().toLocaleDateString(),
        rechazadoPor: "Admin",
        motivoRechazo: motivoRechazo,
        observaciones: observaciones
      }
      
      actualizarSolicitud(solicitudActualizada)
      setSolicitud(solicitudActualizada)
      setMostrarRechazo(false)
      mostrarAlerta("alerta", "La solicitud ha sido rechazada")
    } catch (error) {
      console.error("Error al rechazar solicitud:", error)
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
    // Actualizar los items pagados según el monto pagado
    let montoRestante = parseFloat(pagoInfo.monto)
    const itemsActualizados = [...solicitud.itemsSolicitud]
    
    for (let item of itemsActualizados) {
      if (montoRestante <= 0) break
      if (item.pagado || item.exonerado) continue
      
      if (montoRestante >= item.costo) {
        // Caso: El monto restante cubre completamente este ítem
        item.pagado = true
        montoRestante -= item.costo
      } else {
        // Caso: Pago parcial del ítem - IMPORTANTE: Ahora mantenemos un registro del monto pendiente
        item.pagadoParcialmente = true
        // Registramos cuánto se pagó y cuánto queda pendiente
        item.montoPagado = item.montoPagado ? item.montoPagado + montoRestante : montoRestante
        item.montoPendiente = item.costo - item.montoPagado
        
        // Si el monto pagado cubre el costo total, marcarlo como pagado
        if (item.montoPagado >= item.costo) {
          item.pagado = true
          item.pagadoParcialmente = false
        }
        
        montoRestante = 0
      }
    }
    
    // Actualizar la solicitud
    const solicitudActualizada = {
      ...solicitud,
      itemsSolicitud: itemsActualizados,
      estadoPago: itemsActualizados.every(item => item.pagado || item.exonerado) 
        ? "Pagado" 
        : "Pago parcial",
      comprobantesPago: [...(solicitud.comprobantesPago || []), {
        id: `pago_${new Date().getTime()}`,
        archivo: pagoInfo.archivo,
        fecha: pagoInfo.fecha,
        monto: pagoInfo.monto,
        metodoPago: pagoInfo.metodoPago,
        referencia: pagoInfo.referencia
      }]
    }
    
    actualizarSolicitud(solicitudActualizada)
    setSolicitud(solicitudActualizada)
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
  
  // Renderizar mensaje de error si no se encuentra la solicitud
  if (!solicitud) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          No se pudo encontrar la información de la solicitud.
        </div>
        <button 
          onClick={onVolver}
          className="mt-4 inline-flex items-center text-[#C40180] hover:underline"
        >
          <ChevronLeft size={20} className="mr-1" />
          Volver a la lista de solicitudes
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
          className="text-sm text-[#590248] hover:text-[#C40180] flex items-center"
        >
          <ChevronLeft size={20} className="mr-1" />
          Volver a la lista de solicitudes
        </button>
      </div>
      
      {/* Alertas de éxito o información */}
      {alertaExito && (
        <div className={`mb-4 p-3 rounded-md flex items-start justify-between ${
          alertaExito.tipo === "exito" 
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
      
      {/* Encabezado de solicitud */}
      <SolicitudHeader 
        solicitud={solicitud} 
        totales={totales}
        onAprobar={() => setMostrarConfirmacion(true)}
        onRechazar={() => setMostrarRechazo(true)}
      />
      
      {/* Documentos requeridos */}
      <DocumentosSection 
        solicitud={solicitud}
        onVerDocumento={handleVerDocumento}
      />
      
      {/* Servicios solicitados */}
      <ServiciosSection 
        solicitud={solicitud}
        totales={totales}
        onIniciarPago={handleIniciarPago}
      />
      
      {/* Historial de pagos */}
      {solicitud.comprobantesPago && solicitud.comprobantesPago.length > 0 && (
        <HistorialPagosSection 
          comprobantes={solicitud.comprobantesPago}
          onVerDocumento={handleVerDocumento}
        />
      )}
      
      {/* Observaciones - solo en estado pendiente */}
      {solicitud.estado === 'Pendiente' && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-5">
          <h2 className="text-base font-medium text-gray-900 mb-3">Observaciones</h2>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-sm"
            placeholder="Agregue observaciones o notas sobre esta solicitud..."
            rows="3"
          ></textarea>
        </div>
      )}
      
      {/* Botones adicionales */}
      <div className="flex flex-wrap gap-3">
        {solicitud.estado === 'Aprobada' && solicitud.comprobantePago && (
          <button className="bg-blue-600 text-white px-3 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors text-sm">
            <Download size={16} />
            <span>Descargar comprobante</span>
          </button>
        )}
        
        <button className="bg-gradient-to-t from-[#D7008A] to-[#41023B] text-white px-3 py-2 rounded-md flex items-center gap-2 hover:bg-purple-700 transition-colors text-sm">
          <MessageSquare size={16} />
          <span>Enviar mensaje al colegiado</span>
        </button>
      </div>
      
      {/* Modal de confirmación para aprobación */}
      {mostrarConfirmacion && (
        <ConfirmacionModal 
          onCancel={() => setMostrarConfirmacion(false)}
          onConfirm={handleAprobarSolicitud}
        />
      )}
      
      {/* Modal de rechazo */}
      {mostrarRechazo && (
        <RechazoModal 
          motivoRechazo={motivoRechazo}
          setMotivoRechazo={setMotivoRechazo}
          onCancel={() => setMostrarRechazo(false)}
          onConfirm={handleRechazarSolicitud}
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
                Registrar pago
              </h3>
              <button 
                onClick={() => setMostrarModalPagos(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              <PagosColg 
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