"use client"

import { useState, useEffect } from "react"
import { 
  User, 
  ChevronLeft, 
  Calendar, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Upload,
  Eye,
  MessageSquare,
  X,
  CreditCard
} from "lucide-react"

export default function DetalleSolicitud({ solicitudId, onVolver, solicitudes, actualizarSolicitud }) {
  const [solicitud, setSolicitud] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [mostrarRechazo, setMostrarRechazo] = useState(false)
  const [motivoRechazo, setMotivoRechazo] = useState("")
  const [observaciones, setObservaciones] = useState("")
  const [alertaExito, setAlertaExito] = useState(null)
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null)

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
      setAlertaExito({
        tipo: "exito",
        mensaje: "La solicitud ha sido aprobada correctamente"
      })
      
      // Limpiar alerta después de un tiempo
      setTimeout(() => {
        setAlertaExito(null)
      }, 5000)
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
      setAlertaExito({
        tipo: "alerta",
        mensaje: "La solicitud ha sido rechazada"
      })
      
      // Limpiar alerta después de un tiempo
      setTimeout(() => {
        setAlertaExito(null)
      }, 5000)
    } catch (error) {
      console.error("Error al rechazar solicitud:", error)
    }
  }

  // Función para ver un documento
  const handleVerDocumento = (documento) => {
    setDocumentoSeleccionado(documento)
  }

  // Función para cerrar visor de documento
  const handleCerrarVistaDocumento = () => {
    setDocumentoSeleccionado(null)
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
          <ChevronLeft size={16} className="mr-1" />
          Volver a la lista de solicitudes
        </button>
      </div>
    )
  }

  return (
    <div className="w-full px-4 md:px-10 py-10 md:py-12">
      {/* Botón de regreso */}
      <div className="mb-6">
        <button 
          onClick={onVolver}
          className="text-sm text-gray-600 hover:text-[#C40180] flex items-center"
        >
          <ChevronLeft size={16} className="mr-1" />
          Volver a la lista de solicitudes
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
      
      {/* Encabezado de solicitud */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{solicitud.tipo}</h1>
            <p className="text-sm text-gray-500">Referencia: {solicitud.referencia}</p>
          </div>
          
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-2 md:mt-0 ${
            solicitud.estado === 'Pendiente' 
              ? 'bg-yellow-100 text-yellow-800' 
              : solicitud.estado === 'Aprobada'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
          }`}>
            {solicitud.estado === 'Pendiente' && <Clock size={16} />}
            {solicitud.estado === 'Aprobada' && <CheckCircle size={16} />}
            {solicitud.estado === 'Rechazada' && <XCircle size={16} />}
            {solicitud.estado}
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <User className="text-gray-400 h-5 w-5 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Colegiado</p>
              <p className="text-sm font-medium">{solicitud.colegiadoNombre}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="text-gray-400 h-5 w-5 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Fecha solicitud</p>
              <p className="text-sm font-medium">{solicitud.fecha}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <CreditCard className="text-gray-400 h-5 w-5 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Costo</p>
              <p className="text-sm font-medium">{solicitud.costo > 0 ? `${solicitud.costo.toFixed(2)}` : 'Sin costo'}</p>
            </div>
          </div>
          
          {solicitud.urgente && (
            <div className="flex items-center">
              <AlertCircle className="text-red-500 h-5 w-5 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Prioridad</p>
                <p className="text-sm font-medium text-red-600">Urgente</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <p className="text-sm text-gray-500 mb-1">Descripción</p>
          <p className="text-sm">{solicitud.descripcion}</p>
        </div>
        
        {/* Información adicional basada en el estado */}
        {solicitud.estado === 'Aprobada' && (
          <div className="bg-green-50 p-4 rounded-md mb-4">
            <div className="flex items-start">
              <CheckCircle className="text-green-600 h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Solicitud aprobada</p>
                <p className="text-xs text-gray-700">Aprobada el {solicitud.fechaAprobacion} por {solicitud.aprobadoPor}</p>
                {solicitud.observaciones && (
                  <p className="text-sm mt-2">{solicitud.observaciones}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {solicitud.estado === 'Rechazada' && (
          <div className="bg-red-50 p-4 rounded-md mb-4">
            <div className="flex items-start">
              <XCircle className="text-red-600 h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Solicitud rechazada</p>
                <p className="text-xs text-gray-700">Rechazada el {solicitud.fechaRechazo} por {solicitud.rechazadoPor}</p>
                <p className="text-sm mt-2">Motivo: {solicitud.motivoRechazo}</p>
                {solicitud.observaciones && (
                  <p className="text-sm mt-2">Observaciones: {solicitud.observaciones}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {solicitud.estado === 'Pendiente' && (
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setMostrarConfirmacion(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
            >
              <CheckCircle size={18} />
              <span>Aprobar solicitud</span>
            </button>
            
            <button
              onClick={() => setMostrarRechazo(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
            >
              <XCircle size={18} />
              <span>Rechazar solicitud</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Documentos requeridos */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Documentos requeridos</h2>
        
        {solicitud.documentosRequeridos.length === 0 ? (
          <div className="text-gray-500 text-sm">No se requieren documentos para esta solicitud</div>
        ) : (
          <div className="space-y-4">
            {solicitud.documentosRequeridos.map((documento, index) => {
              const documentoAdjunto = solicitud.documentosAdjuntos.find(doc => 
                doc.toLowerCase().includes(documento.split(" ")[0].toLowerCase())
              );
              
              return (
                <div 
                  key={index} 
                  className={`border rounded-lg p-4 ${documentoAdjunto ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <FileText 
                        className={documentoAdjunto ? "text-green-500 mr-2" : "text-yellow-500 mr-2"} 
                        size={20} 
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{documento}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {documentoAdjunto 
                            ? `Archivo adjunto: ${documentoAdjunto}` 
                            : "Documento pendiente"}
                        </p>
                      </div>
                    </div>
                    
                    {documentoAdjunto && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleVerDocumento(documentoAdjunto)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {/* Opción para agregar un documento si es necesario */}
        {solicitud.estado === 'Pendiente' && solicitud.documentosRequeridos.length > 0 && (
          <div className="mt-4">
            <button className="text-[#C40180] hover:text-[#590248] flex items-center gap-1">
              <Upload size={16} />
              <span className="text-sm">Adjuntar documento adicional</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Observaciones - solo en estado pendiente */}
      {solicitud.estado === 'Pendiente' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Observaciones</h2>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Agregue observaciones o notas sobre esta solicitud..."
            rows="3"
          ></textarea>
        </div>
      )}
      
      {/* Botones adicionales */}
      <div className="flex flex-wrap gap-3">
        {solicitud.estado === 'Aprobada' && solicitud.costo > 0 && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Download size={18} />
            <span>Descargar comprobante</span>
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
                Confirmar aprobación
              </h3>
              <p className="text-center text-gray-600 mb-6">
                ¿Está seguro que desea aprobar esta solicitud? Una vez aprobada, no podrá revertir esta acción.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setMostrarConfirmacion(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAprobarSolicitud}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Confirmar aprobación
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
                Rechazar solicitud
              </h3>
              <p className="text-center text-gray-600 mb-4">
                Está a punto de rechazar esta solicitud.
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
                  onClick={handleRechazarSolicitud}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Rechazar solicitud
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para ver documento */}
      {documentoSeleccionado && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Documento: {documentoSeleccionado}
              </h3>
              <button 
                onClick={handleCerrarVistaDocumento}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100">
              {/* Aquí se mostraría el documento. En este caso usamos un placeholder */}
              <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-200 rounded-lg">
                <div className="text-center p-6">
                  <FileText size={64} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Vista previa no disponible para {documentoSeleccionado}</p>
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Descargar documento
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}