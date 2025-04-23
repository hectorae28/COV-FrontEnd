"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  User, Phone, Mail, Calendar, FileText, 
  CheckCircle, AlertCircle, XCircle,
  ChevronLeft, X, Upload
} from "lucide-react"

export default function DetallePendiente({ params, onVolver }) {
  // Obtenemos el ID desde los parámetros de la URL
  const pendienteId = params?.id || "p1"
  
  const [pendiente, setPendiente] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [mostrarRechazo, setMostrarRechazo] = useState(false)
  const [motivoRechazo, setMotivoRechazo] = useState("")
  const [documentosRequeridos, setDocumentosRequeridos] = useState([])
  const [documentosAprobados, setDocumentosAprobados] = useState({})
  const [confirmacionExitosa, setConfirmacionExitosa] = useState(false)
  const [rechazoExitoso, setRechazoExitoso] = useState(false)
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null)

  // Simulación de obtención de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // En un caso real, aquí se haría la llamada a la API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Datos de ejemplo
        setPendiente({
          id: pendienteId,
          nombre: "Carlos Ramírez",
          cedula: "V-34567890",
          email: "carlos.ramirez@mail.com",
          telefono: "+58 416-7777777",
          fechaNacimiento: "12/05/1988",
          direccion: "Av. Francisco de Miranda, Edificio Torre Europa, Piso 8, Caracas",
          fechaSolicitud: "10/04/2024",
          documentosCompletos: true,
          universidad: "Universidad Central de Venezuela",
          anoGraduacion: "2015",
          especialidad: "Endodoncia",
          fotoPerfil: "/api/placeholder/200/200",
          observaciones: "Solicita inscripción en el Colegio de Odontólogos de Venezuela"
        })
        
        setDocumentosRequeridos([
          {
            id: "titulo",
            nombre: "Título universitario",
            descripcion: "Título de Odontólogo expedido por Universidad Central de Venezuela",
            archivo: "titulo_carlos_ramirez.pdf",
            tipo: "PDF",
            tamano: "2.8 MB",
            fechaCarga: "10/04/2024",
            requerido: true,
            status: "pendiente" // pendiente, aprobado, rechazado
          },
          {
            id: "cedula",
            nombre: "Cédula de identidad",
            descripcion: "Copia escaneada por ambos lados",
            archivo: "cedula_carlos_ramirez.jpg",
            tipo: "JPG",
            tamano: "1.2 MB",
            fechaCarga: "10/04/2024",
            requerido: true,
            status: "pendiente"
          },
          {
            id: "foto",
            nombre: "Foto tipo carnet",
            descripcion: "Foto tamaño carnet con fondo blanco",
            archivo: "foto_carlos_ramirez.jpg",
            tipo: "JPG",
            tamano: "0.8 MB",
            fechaCarga: "10/04/2024",
            requerido: true,
            status: "pendiente"
          },
          {
            id: "comprobante",
            nombre: "Comprobante de pago",
            descripcion: "Comprobante de pago de inscripción",
            archivo: "pago_carlos_ramirez.pdf",
            tipo: "PDF",
            tamano: "0.6 MB",
            fechaCarga: "10/04/2024",
            requerido: true,
            status: "pendiente"
          },
          {
            id: "certificado_especialidad",
            nombre: "Certificado de especialidad",
            descripcion: "Certificado de especialidad en Endodoncia",
            archivo: "especialidad_carlos_ramirez.pdf",
            tipo: "PDF",
            tamano: "1.5 MB",
            fechaCarga: "10/04/2024",
            requerido: false,
            status: "pendiente"
          }
        ])
        
        // Inicializar el estado de documentos aprobados
        const inicialDocumentosAprobados = {}
        documentosRequeridos.forEach(doc => {
          inicialDocumentosAprobados[doc.id] = doc.status === "aprobado"
        })
        setDocumentosAprobados(inicialDocumentosAprobados)
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching pending data:", error)
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [pendienteId])

  const handleVerDocumento = (documento) => {
    setDocumentoSeleccionado(documento)
  }

  const handleCerrarVistaDocumento = () => {
    setDocumentoSeleccionado(null)
  }

  const handleAprobarDocumento = (documentoId) => {
    setDocumentosAprobados(prev => ({
      ...prev,
      [documentoId]: !prev[documentoId]
    }))
    
    // Actualizar la lista de documentos requeridos
    setDocumentosRequeridos(prev => 
      prev.map(doc => {
        if (doc.id === documentoId) {
          return {
            ...doc,
            status: !documentosAprobados[documentoId] ? "aprobado" : "pendiente"
          }
        }
        return doc
      })
    )
  }

  const handleAprobarTodo = () => {
    const todosAprobados = {}
    documentosRequeridos.forEach(doc => {
      todosAprobados[doc.id] = true
    })
    
    setDocumentosAprobados(todosAprobados)
    
    // Actualizar la lista de documentos requeridos
    setDocumentosRequeridos(prev => 
      prev.map(doc => ({
        ...doc,
        status: "aprobado"
      }))
    )
  }

  const handleRechazarTodo = () => {
    const todosRechazados = {}
    documentosRequeridos.forEach(doc => {
      todosRechazados[doc.id] = false
    })
    
    setDocumentosAprobados(todosRechazados)
    
    // Actualizar la lista de documentos requeridos
    setDocumentosRequeridos(prev => 
      prev.map(doc => ({
        ...doc,
        status: "rechazado"
      }))
    )
  }

  const handleAprobarSolicitud = async () => {
    try {
      // Simular llamada a API para aprobar solicitud
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mostrar mensaje de confirmación exitosa
      setConfirmacionExitosa(true)
      setMostrarConfirmacion(false)
      
      // Volver a la lista después de un tiempo
      setTimeout(() => {
        onVolver()
      }, 3000)
    } catch (error) {
      console.error("Error al aprobar solicitud:", error)
    }
  }

  const handleRechazarSolicitud = async () => {
    try {
      if (!motivoRechazo.trim()) {
        alert("Debe ingresar un motivo de rechazo")
        return
      }
      
      // Simular llamada a API para rechazar solicitud
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mostrar mensaje de rechazo exitoso
      setRechazoExitoso(true)
      setMostrarRechazo(false)
      
      // Volver a la lista después de un tiempo
      setTimeout(() => {
        onVolver()
      }, 3000)
    } catch (error) {
      console.error("Error al rechazar solicitud:", error)
    }
  }
  
  if (isLoading) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
      </div>
    )
  }

  if (!pendiente) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          No se pudo encontrar la información de la solicitud pendiente.
        </div>
        <button 
          onClick={onVolver}
          className="mt-4 inline-flex items-center text-[#C40180] hover:underline cursor-pointer"
        >
          <ChevronLeft size={16} className="mr-1" />
          Volver a la lista de colegiados
        </button>
      </div>
    )
  }
  
  return (
    <div className="w-full px-4 md:px-10 py-10 md:py-12">
      {/* Breadcrumbs - Usa onVolver en lugar de Link */}
      <div className="mb-6">
        <button 
          onClick={onVolver}
          className="text-sm text-gray-600 hover:text-[#C40180] flex items-center cursor-pointer"
        >
          <ChevronLeft size={16} className="mr-1" />
          Volver a la lista de colegiados
        </button>
      </div>
      
      {/* Notificaciones de éxito */}
      {confirmacionExitosa && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6 flex items-start justify-between">
          <div className="flex items-center">
            <CheckCircle size={20} className="mr-2 flex-shrink-0" />
            <span>Se ha aprobado la solicitud correctamente. Redirigiendo a la lista de colegiados...</span>
          </div>
          <button 
            onClick={() => setConfirmacionExitosa(false)}
            className="text-green-700"
          >
            <X size={18} />
          </button>
        </div>
      )}
      
      {rechazoExitoso && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-6 flex items-start justify-between">
          <div className="flex items-center">
            <AlertCircle size={20} className="mr-2 flex-shrink-0" />
            <span>Se ha rechazado la solicitud correctamente. Redirigiendo a la lista de colegiados...</span>
          </div>
          <button 
            onClick={() => setRechazoExitoso(false)}
            className="text-yellow-700"
          >
            <X size={18} />
          </button>
        </div>
      )}
      
      {/* Header con información básica */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img 
                src={pendiente.fotoPerfil} 
                alt={pendiente.nombre} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-3/4">
            <div className="flex flex-col md:flex-row md:justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{pendiente.nombre}</h1>
                <p className="text-sm text-gray-500">Solicitud pendiente</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pendiente de aprobación
                </span>
                
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  pendiente.documentosCompletos ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {pendiente.documentosCompletos ? 'Documentación completa' : 'Documentación incompleta'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Mail className="text-gray-400 h-5 w-5 mr-2" />
                <span className="text-gray-700">{pendiente.email}</span>
              </div>
              
              <div className="flex items-center">
                <Phone className="text-gray-400 h-5 w-5 mr-2" />
                <span className="text-gray-700">{pendiente.telefono}</span>
              </div>
              
              <div className="flex items-center">
                <User className="text-gray-400 h-5 w-5 mr-2" />
                <span className="text-gray-700">{pendiente.cedula}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="text-gray-400 h-5 w-5 mr-2" />
                <span className="text-gray-700">Solicitado: {pendiente.fechaSolicitud}</span>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
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
          </div>
        </div>
      </div>
      
      {/* Secciones de información */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Información personal */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Información personal</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Nombre completo</p>
              <p className="font-medium">{pendiente.nombre}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Cédula de identidad</p>
              <p className="font-medium">{pendiente.cedula}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Fecha de nacimiento</p>
              <p className="font-medium">{pendiente.fechaNacimiento}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Dirección</p>
              <p className="font-medium">{pendiente.direccion}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Teléfono</p>
              <p className="font-medium">{pendiente.telefono}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Correo electrónico</p>
              <p className="font-medium">{pendiente.email}</p>
            </div>
          </div>
        </div>
        
        {/* Información académica */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Información académica</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Universidad</p>
              <p className="font-medium">{pendiente.universidad}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Año de graduación</p>
              <p className="font-medium">{pendiente.anoGraduacion}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Especialidad</p>
              <p className="font-medium">{pendiente.especialidad || "No especificada"}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Observaciones</p>
              <p className="font-medium">{pendiente.observaciones || "Ninguna"}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Documentos */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Documentos requeridos</h2>
            <p className="text-sm text-gray-500">Revisión de documentación cargada por el solicitante</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <button
              onClick={handleAprobarTodo}
              className="bg-green-600 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-green-700 transition-colors text-sm"
            >
              <CheckCircle size={14} />
              <span>Aprobar todos</span>
            </button>
            
            <button
              onClick={handleRechazarTodo}
              className="bg-red-600 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-red-700 transition-colors text-sm"
            >
              <XCircle size={14} />
              <span>Rechazar todos</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {documentosRequeridos.map((documento) => (
            <div 
              key={documento.id} 
              className={`border rounded-lg p-4 ${
                documento.status === "aprobado" 
                  ? "border-green-200 bg-green-50" 
                  : documento.status === "rechazado"
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <FileText 
                      className={`mr-2 ${
                        documento.status === "aprobado" 
                          ? "text-green-500" 
                          : documento.status === "rechazado"
                            ? "text-red-500"
                            : "text-gray-500"
                      }`} 
                      size={20} 
                    />
                    <h3 className="font-medium text-gray-900">
                      {documento.nombre}
                      {documento.requerido && <span className="text-red-500 ml-1">*</span>}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-2">{documento.descripcion}</p>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-3">Tipo: {documento.tipo}</span>
                    <span className="mr-3">Tamaño: {documento.tamano}</span>
                    <span>Subido: {documento.fechaCarga}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVerDocumento(documento)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <FileText size={18} />
                  </button>
                  
                  <button
                    onClick={() => handleAprobarDocumento(documento.id)}
                    className={`p-1 rounded-full ${
                      documentosAprobados[documento.id]
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    <CheckCircle size={18} />
                  </button>
                </div>
              </div>
              
              {documento.status === "aprobado" && (
                <div className="mt-2 text-sm text-green-600 flex items-center">
                  <CheckCircle size={14} className="mr-1" />
                  <span>Documento aprobado</span>
                </div>
              )}
              
              {documento.status === "rechazado" && (
                <div className="mt-2 text-sm text-red-600 flex items-center">
                  <XCircle size={14} className="mr-1" />
                  <span>Documento rechazado</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Modal de confirmación para aprobación */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4 text-green-600">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
                Confirmar aprobación
              </h3>
              <p className="text-center text-gray-600 mb-6">
                ¿Está seguro que desea aprobar la solicitud de <span className="font-medium">{pendiente.nombre}</span>? Se generará un nuevo registro de colegiado en el sistema.
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4 text-red-600">
                <XCircle size={40} />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
                Rechazar solicitud
              </h3>
              <p className="text-center text-gray-600 mb-4">
                Está a punto de rechazar la solicitud de <span className="font-medium">{pendiente.nombre}</span>.
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {documentoSeleccionado.nombre}
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
                  <p className="text-gray-500">Vista previa no disponible para {documentoSeleccionado.nombre}</p>
                  <p className="text-sm text-gray-400 mt-2">Archivo: {documentoSeleccionado.archivo}</p>
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Descargar documento
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-between items-center bg-gray-50">
              <div className="text-sm text-gray-500">
                {documentoSeleccionado.tipo} • {documentoSeleccionado.tamano}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleAprobarDocumento(documentoSeleccionado.id)
                    handleCerrarVistaDocumento()
                  }}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                >
                  <CheckCircle size={16} />
                  <span>{documentosAprobados[documentoSeleccionado.id] ? 'Aprobado' : 'Aprobar'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}