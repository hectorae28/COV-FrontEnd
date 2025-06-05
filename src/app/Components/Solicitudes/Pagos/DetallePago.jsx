"use client"

import { useState, useEffect } from "react"
import { 
  User, 
  ChevronLeft, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  FileText,
  FileCheck,
  Clock,
  Printer,
  MessageSquare,
  X,
  Eye
} from "lucide-react"

export default function DetallePago({ pagoId, onVolver, pagos, actualizarPago }) {
  const [pago, setPago] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [mostrarRechazo, setMostrarRechazo] = useState(false)
  const [motivoRechazo, setMotivoRechazo] = useState("")
  const [observaciones, setObservaciones] = useState("")
  const [alertaExito, setAlertaExito] = useState(null)
  const [mostrarComprobante, setMostrarComprobante] = useState(false)
  const [mostrarFactura, setMostrarFactura] = useState(false)

  // Obtener datos del pago
  useEffect(() => {
    if (pagos && pagoId) {
      const pagoEncontrado = pagos.find(p => p.id === pagoId)
      
      if (pagoEncontrado) {
        setPago(pagoEncontrado)
        setObservaciones(pagoEncontrado.notaAdmin || "")
      }
      
      setIsLoading(false)
    }
  }, [pagoId, pagos])

  // Función para aprobar el pago
  const handleAprobarPago = async () => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const fechaActual = new Date().toLocaleDateString()
      const facturaId = `FACT-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-2025`
      
      const pagoActualizado = {
        ...pago,
        estado: "Procesado",
        fechaProcesamiento: fechaActual,
        procesadoPor: "Admin",
        notaAdmin: observaciones,
        facturaGenerada: true,
        facturaId: facturaId
      }
      
      actualizarPago(pagoActualizado)
      setPago(pagoActualizado)
      setMostrarConfirmacion(false)
      setAlertaExito({
        tipo: "exito",
        mensaje: "El pago ha sido procesado correctamente"
      })
      
      // Limpiar alerta después de un tiempo
      setTimeout(() => {
        setAlertaExito(null)
      }, 5000)
    } catch (error) {
      console.error("Error al procesar pago:", error)
    }
  }

  // Función para rechazar el pago
  const handleRechazarPago = async () => {
    try {
      if (!motivoRechazo.trim()) {
        alert("Debe ingresar un motivo de rechazo")
        return
      }
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const pagoActualizado = {
        ...pago,
        estado: "Rechazado",
        fechaRechazo: new Date().toLocaleDateString(),
        rechazadoPor: "Admin",
        motivoRechazo: motivoRechazo,
        notaAdmin: observaciones
      }
      
      actualizarPago(pagoActualizado)
      setPago(pagoActualizado)
      setMostrarRechazo(false)
      setAlertaExito({
        tipo: "alerta",
        mensaje: "El pago ha sido rechazado"
      })
      
      // Limpiar alerta después de un tiempo
      setTimeout(() => {
        setAlertaExito(null)
      }, 5000)
    } catch (error) {
      console.error("Error al rechazar pago:", error)
    }
  }

  // Renderizar estado de carga
  if (isLoading) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
      </div>
    )
  }

  // Renderizar mensaje de error si no se encuentra el pago
  if (!pago) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          No se pudo encontrar la información del pago.
        </div>
        <button 
          onClick={onVolver}
          className="mt-4 inline-flex items-center text-[#C40180] hover:underline"
        >
          <ChevronLeft size={16} className="mr-1" />
          Volver a la lista de pagos
        </button>
      </div>
    )
  }

  return (
    <div className="w-full px-4 md:px-10 py-10 md:py-12 mt-18">
      {/* Botón de regreso */}
      <div className="mb-6">
        <button 
          onClick={onVolver}
          className="text-sm text-gray-600 hover:text-[#C40180] flex items-center"
        >
          <ChevronLeft size={16} className="mr-1" />
          Volver a la lista de pagos
        </button>
      </div>
      
      {/* Alertas de éxito o información */}
      {alertaExito && (
        <div className={`mb-6 p-4 rounded-md flex items-start justify-between ${
          alertaExito.tipo === "exito" 
            ? "bg-green-100 text-green-800" 
            : "bg-yellow-100 text-yellow-800"
        }`}>
          <div className="flex items-center">
            {alertaExito.tipo === "exito" ? (
              <CheckCircle size={20} className="mr-2 flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="mr-2 flex-shrink-0" />
            )}
            <span>{alertaExito.mensaje}</span>
          </div>
          <button 
            onClick={() => setAlertaExito(null)}
            className={alertaExito.tipo === "exito" ? "text-green-700" : "text-yellow-700"}
          >
            <X size={18} />
          </button>
        </div>
      )}
      
      {/* Encabezado de pago */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pago: {pago.referencia}</h1>
            <p className="text-sm text-gray-500">{pago.descripcion}</p>
          </div>
          
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-2 md:mt-0 ${
            pago.estado === 'Pendiente' 
              ? 'bg-yellow-100 text-yellow-800' 
              : pago.estado === 'Procesado'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
          }`}>
            {pago.estado === 'Pendiente' && <Clock size={16} />}
            {pago.estado === 'Procesado' && <CheckCircle size={16} />}
            {pago.estado === 'Rechazado' && <XCircle size={16} />}
            {pago.estado}
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center">
            <CreditCard className="text-gray-400 h-5 w-5 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Monto</p>
              <p className="text-lg font-semibold">${pago.monto.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="text-gray-400 h-5 w-5 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Fecha pago</p>
              <p className="text-sm font-medium">{pago.fecha}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <User className="text-gray-400 h-5 w-5 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Colegiado</p>
              <p className="text-sm font-medium">{pago.colegiadoNombre}</p>
              <p className="text-xs text-gray-500">{pago.colegiadoNumero}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <FileText className="text-gray-400 h-5 w-5 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Método de pago</p>
              <p className="text-sm font-medium">{pago.metodoPago}</p>
            </div>
          </div>
        </div>
        
        {/* Información adicional basada en el estado */}
        {pago.estado === 'Procesado' && (
          <div className="bg-green-50 p-4 rounded-md mb-4">
            <div className="flex items-start">
              <CheckCircle className="text-green-600 h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Pago procesado</p>
                <p className="text-xs text-gray-700">Procesado el {pago.fechaProcesamiento} por {pago.procesadoPor}</p>
                {pago.facturaGenerada && (
                  <div className="mt-2 flex items-center text-sm text-green-700">
                    <FileCheck size={16} className="mr-1" />
                    Factura generada: {pago.facturaId}
                    <button 
                      onClick={() => setMostrarFactura(true)}
                      className="ml-2 text-blue-600 hover:text-blue-800 text-xs underline"
                    >
                      Ver factura
                    </button>
                  </div>
                )}
                {pago.notaAdmin && (
                  <p className="text-sm mt-2">Nota: {pago.notaAdmin}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {pago.estado === 'Rechazado' && (
          <div className="bg-red-50 p-4 rounded-md mb-4">
            <div className="flex items-start">
              <XCircle className="text-red-600 h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Pago rechazado</p>
                <p className="text-xs text-gray-700">Rechazado el {pago.fechaRechazo} por {pago.rechazadoPor}</p>
                <p className="text-sm mt-2">Motivo: {pago.motivoRechazo}</p>
                {pago.notaAdmin && (
                  <p className="text-sm mt-2">Nota adicional: {pago.notaAdmin}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Comprobante de pago */}
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="text-gray-500 h-5 w-5 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-800">Comprobante de pago</p>
                <p className="text-xs text-gray-500">Archivo: {pago.comprobante}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setMostrarComprobante(true)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
              >
                <Eye size={16} />
                Ver
              </button>
              <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
                <Download size={16} />
                Descargar
              </button>
            </div>
          </div>
        </div>
        
        {/* Botones de acción para pago pendiente */}
        {pago.estado === 'Pendiente' && (
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setMostrarConfirmacion(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
            >
              <CheckCircle size={18} />
              <span>Procesar pago</span>
            </button>
            
            <button
              onClick={() => setMostrarRechazo(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
            >
              <XCircle size={18} />
              <span>Rechazar pago</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Detalles adicionales */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Detalles del pago</h2>
        
        <div className="border-t border-gray-200 pt-4">
          <dl className="divide-y divide-gray-200">
            <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Tipo de pago</dt>
              <dd className="text-sm text-gray-900 sm:col-span-2">{pago.tipo}</dd>
            </div>
            <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Descripción</dt>
              <dd className="text-sm text-gray-900 sm:col-span-2">{pago.descripcion}</dd>
            </div>
            <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Fecha de creación</dt>
              <dd className="text-sm text-gray-900 sm:col-span-2">{new Date(pago.fechaCreacion).toLocaleString()}</dd>
            </div>
            <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Colegiado</dt>
              <dd className="text-sm text-gray-900 sm:col-span-2">
                {pago.colegiadoNombre} ({pago.colegiadoNumero})
              </dd>
            </div>
            <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Método de pago</dt>
              <dd className="text-sm text-gray-900 sm:col-span-2">{pago.metodoPago}</dd>
            </div>
            <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Monto</dt>
              <dd className="text-sm text-gray-900 font-semibold sm:col-span-2">${pago.monto.toFixed(2)}</dd>
            </div>
            {pago.estado === 'Procesado' && (
              <>
                <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Fecha de procesamiento</dt>
                  <dd className="text-sm text-gray-900 sm:col-span-2">{pago.fechaProcesamiento}</dd>
                </div>
                <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Procesado por</dt>
                  <dd className="text-sm text-gray-900 sm:col-span-2">{pago.procesadoPor}</dd>
                </div>
                {pago.facturaGenerada && (
                  <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Factura</dt>
                    <dd className="text-sm text-gray-900 sm:col-span-2 flex items-center">
                      {pago.facturaId}
                      <button className="ml-2 text-blue-600 hover:text-blue-800">
                        <Printer size={16} />
                      </button>
                    </dd>
                  </div>
                )}
              </>
            )}
            {pago.estado === 'Rechazado' && (
              <>
                <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Fecha de rechazo</dt>
                  <dd className="text-sm text-gray-900 sm:col-span-2">{pago.fechaRechazo}</dd>
                </div>
                <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Rechazado por</dt>
                  <dd className="text-sm text-gray-900 sm:col-span-2">{pago.rechazadoPor}</dd>
                </div>
                <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Motivo de rechazo</dt>
                  <dd className="text-sm text-gray-900 sm:col-span-2">{pago.motivoRechazo}</dd>
                </div>
              </>
            )}
          </dl>
        </div>
      </div>
      
      {/* Observaciones - solo en estado pendiente */}
      {pago.estado === 'Pendiente' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Observaciones</h2>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Agregue observaciones o notas sobre este pago..."
            rows="3"
          ></textarea>
        </div>
      )}
      
      {/* Botones adicionales */}
      <div className="flex flex-wrap gap-3">
        {pago.estado === 'Procesado' && pago.facturaGenerada && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Printer size={18} />
            <span>Imprimir factura</span>
          </button>
        )}
        
        <button className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-purple-700 transition-colors">
          <MessageSquare size={18} />
          <span>Enviar mensaje al colegiado</span>
        </button>
      </div>
      
      {/* Modal de confirmación para aprobación */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4 text-green-600">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
                Confirmar procesamiento
              </h3>
              <p className="text-center text-gray-600 mb-6">
                ¿Está seguro que desea procesar este pago? Se generará una factura automáticamente.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setMostrarConfirmacion(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAprobarPago}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Confirmar procesamiento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de rechazo */}
      {mostrarRechazo && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4 text-red-600">
                <XCircle size={40} />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
                Rechazar pago
              </h3>
              <p className="text-center text-gray-600 mb-4">
                Está a punto de rechazar este pago.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo del rechazo <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Ingrese el motivo del rechazo"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setMostrarRechazo(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRechazarPago}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Rechazar pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para ver comprobante */}
      {mostrarComprobante && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Comprobante: {pago.comprobante}
              </h3>
              <button 
                onClick={() => setMostrarComprobante(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100">
              {/* Aquí se mostraría el comprobante. Usamos un placeholder */}
              <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-200 rounded-lg">
                <div className="text-center p-6">
                  <FileText size={64} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Vista previa no disponible para {pago.comprobante}</p>
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Descargar comprobante
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para ver factura */}
      {mostrarFactura && pago.facturaGenerada && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Factura: {pago.facturaId}
              </h3>
              <button 
                onClick={() => setMostrarFactura(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100">
              {/* Aquí se mostraría la factura. Usamos un placeholder */}
              <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-200 rounded-lg">
                <div className="text-center p-6">
                  <FileText size={64} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Vista previa de factura {pago.facturaId}</p>
                  <div className="mt-4 flex justify-center gap-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-1">
                      <Download size={16} />
                      Descargar
                    </button>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-1">
                      <Printer size={16} />
                      Imprimir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}