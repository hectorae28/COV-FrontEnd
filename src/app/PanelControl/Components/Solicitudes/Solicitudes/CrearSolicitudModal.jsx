"use client"

import { useState, useEffect } from "react"
import { 
  X, 
  AlertCircle, 
  FileText, 
  Upload, 
  CreditCard,
  Search,
  Check,
  User,
  FileCheck
} from "lucide-react"

export default function CrearSolicitudModal({ 
  onClose, 
  onSolicitudCreada, 
  colegiados, 
  colegiadoPreseleccionado = null 
}) {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    tipo: "",
    colegiadoId: colegiadoPreseleccionado ? colegiadoPreseleccionado.id : "",
    urgente: false,
    descripcion: "",
    costo: "",
    documentosRequeridos: []
  })
  
  const [documentosAdjuntos, setDocumentosAdjuntos] = useState({})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showColegiadosList, setShowColegiadosList] = useState(false)

  // Tipos de solicitud predefinidos
  const tiposSolicitud = [
    { id: "constancia", nombre: "Constancia de inscripción", costo: 20, documentosRequeridos: ["Copia de cédula", "Comprobante de pago"] },
    { id: "certificado", nombre: "Certificado de solvencia", costo: 15, documentosRequeridos: ["Comprobante de pago"] },
    { id: "carnet", nombre: "Renovación de carnet", costo: 30, documentosRequeridos: ["Foto tipo carnet", "Comprobante de pago"] },
    { id: "especialidad", nombre: "Registro de especialidad", costo: 50, documentosRequeridos: ["Título de especialidad", "Copia de cédula", "Comprobante de pago"] },
    { id: "cambio", nombre: "Cambio de jurisdicción", costo: 40, documentosRequeridos: ["Constancia de residencia", "Comprobante de pago"] },
    { id: "duplicado", nombre: "Duplicado de título", costo: 25, documentosRequeridos: ["Denuncia de pérdida", "Comprobante de pago"] },
    { id: "actualizacion", nombre: "Actualización de datos", costo: 0, documentosRequeridos: ["Constancia de residencia"] },
    { id: "informacion", nombre: "Solicitud de información", costo: 0, documentosRequeridos: [] },
    { id: "otros", nombre: "Otro tipo de solicitud", costo: 0, documentosRequeridos: [] }
  ]

  // Si hay un colegiado preseleccionado, establecer el ID en el formulario
  useEffect(() => {
    if (colegiadoPreseleccionado) {
      setFormData(prev => ({
        ...prev,
        colegiadoId: colegiadoPreseleccionado.id
      }))
    }
  }, [colegiadoPreseleccionado])

  // Cuando se selecciona un tipo de solicitud, actualizar formulario con valores predeterminados
  useEffect(() => {
    if (formData.tipo) {
      const tipoSeleccionado = tiposSolicitud.find(tipo => tipo.id === formData.tipo)
      if (tipoSeleccionado) {
        setFormData(prev => ({
          ...prev,
          costo: tipoSeleccionado.id === "otros" ? "" : tipoSeleccionado.costo.toString(),
          documentosRequeridos: tipoSeleccionado.documentosRequeridos
        }))
      }
    }
  }, [formData.tipo])

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
    
    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  // Manejar subida de archivos
  const handleFileChange = (e, documentoId) => {
    const file = e.target.files[0]
    if (file) {
      setDocumentosAdjuntos(prev => ({
        ...prev,
        [documentoId]: file
      }))
    }
  }

  // Seleccionar un colegiado de la lista
  const selectColegiado = (colegiado) => {
    setFormData(prev => ({
      ...prev,
      colegiadoId: colegiado.id
    }))
    setShowColegiadosList(false)
    setSearchTerm("")
    
    // Limpiar error si existe
    if (errors.colegiadoId) {
      setErrors(prev => ({
        ...prev,
        colegiadoId: null
      }))
    }
  }

  // Filtrar colegiados por término de búsqueda
  const colegiadosFiltrados = colegiados.filter(colegiado => 
    colegiado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colegiado.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colegiado.numeroRegistro.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Obtener el colegiado seleccionado
  const colegiadoSeleccionado = colegiados.find(c => c.id === formData.colegiadoId)
  
  // Validar el formulario antes de enviar
  const validarFormulario = () => {
    const nuevosErrores = {}
    
    if (!formData.tipo) nuevosErrores.tipo = "Debe seleccionar un tipo de solicitud"
    if (!formData.colegiadoId) nuevosErrores.colegiadoId = "Debe seleccionar un colegiado"
    
    if (formData.tipo === "otros" && !formData.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es requerida para este tipo de solicitud"
    }
    
    // Validar que el costo sea un número válido si es un valor personalizado
    if (formData.tipo === "otros" && formData.costo.trim() !== "") {
      const costoNum = parseFloat(formData.costo)
      if (isNaN(costoNum) || costoNum < 0) {
        nuevosErrores.costo = "El costo debe ser un número válido mayor o igual a cero"
      }
    }
    
    setErrors(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validarFormulario()) return
    
    setIsSubmitting(true)
    
    try {
      // Simular envío a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const tipoSeleccionado = tiposSolicitud.find(tipo => tipo.id === formData.tipo)
      const costoNum = formData.tipo === "otros" && formData.costo.trim() !== "" 
        ? parseFloat(formData.costo) 
        : tipoSeleccionado.costo
        
      // Crear objeto de nueva solicitud
      const nuevaSolicitud = {
        id: `sol-${Date.now()}`,
        tipo: tipoSeleccionado.nombre,
        colegiadoId: formData.colegiadoId,
        colegiadoNombre: colegiadoSeleccionado?.nombre || "Colegiado",
        fecha: new Date().toLocaleDateString(),
        estado: "Pendiente",
        urgente: formData.urgente,
        descripcion: formData.descripcion || tipoSeleccionado.nombre,
        referencia: `REF-${tipoSeleccionado.id.toUpperCase()}-${Date.now().toString().slice(-4)}`,
        costo: costoNum,
        documentosRequeridos: formData.documentosRequeridos,
        documentosAdjuntos: Object.keys(documentosAdjuntos).map(key => documentosAdjuntos[key].name || "documento.pdf")
      }
      
      onSolicitudCreada(nuevaSolicitud)
    } catch (error) {
      console.error("Error al crear solicitud:", error)
      setErrors({
        general: "Ocurrió un error al procesar la solicitud. Inténtelo nuevamente."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Nueva solicitud</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Selección de colegiado */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colegiado <span className="text-red-500">*</span>
              </label>
              
              {errors.colegiadoId && (
                <div className="text-red-500 text-xs mb-2">
                  {errors.colegiadoId}
                </div>
              )}
              
              <div className="relative">
                {colegiadoSeleccionado ? (
                  <div className="flex items-center justify-between border rounded-lg p-3 mb-2">
                    <div className="flex items-center">
                      <User size={20} className="text-gray-400 mr-2" />
                      <div>
                        <p className="font-medium">{colegiadoSeleccionado.nombre}</p>
                        <p className="text-xs text-gray-500">
                          {colegiadoSeleccionado.cedula} · {colegiadoSeleccionado.numeroRegistro}
                        </p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, colegiadoId: "" }));
                        setShowColegiadosList(true);
                      }}
                      className="text-[#C40180] text-sm hover:underline"
                    >
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar colegiado por nombre, cédula o registro..."
                      className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowColegiadosList(true);
                      }}
                      onFocus={() => setShowColegiadosList(true)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                )}
                
                {showColegiadosList && !colegiadoSeleccionado && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {colegiadosFiltrados.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500">No se encontraron colegiados</div>
                    ) : (
                      colegiadosFiltrados.map(colegiado => (
                        <div 
                          key={colegiado.id}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                          onClick={() => selectColegiado(colegiado)}
                        >
                          <p className="font-medium">{colegiado.nombre}</p>
                          <p className="text-xs text-gray-500">
                            {colegiado.cedula} · {colegiado.numeroRegistro}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Tipo de solicitud */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de solicitud <span className="text-red-500">*</span>
              </label>
              
              {errors.tipo && (
                <div className="text-red-500 text-xs mb-2">
                  {errors.tipo}
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tiposSolicitud.map(tipo => (
                  <div 
                    key={tipo.id}
                    className={`
                      border rounded-md p-3 cursor-pointer transition-colors
                      ${formData.tipo === tipo.id 
                        ? 'border-[#C40180] bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => {
                      setFormData(prev => ({...prev, tipo: tipo.id}));
                      if (errors.tipo) {
                        setErrors(prev => ({...prev, tipo: null}));
                      }
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{tipo.nombre}</p>
                        <p className="text-xs text-gray-500">
                          {tipo.costo > 0 ? `Costo: ${tipo.costo.toFixed(2)}` : 'Sin costo'}
                        </p>
                      </div>
                      {formData.tipo === tipo.id && (
                        <div className="bg-[#C40180] text-white rounded-full p-1">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Descripción - Solo para "otros" */}
            {formData.tipo === "otros" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción <span className="text-red-500">*</span>
                </label>
                
                {errors.descripcion && (
                  <div className="text-red-500 text-xs mb-2">
                    {errors.descripcion}
                  </div>
                )}
                
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${
                    errors.descripcion ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describa detalladamente el tipo de solicitud que necesita"
                  rows="3"
                ></textarea>
              </div>
            )}
            
            {/* Costo personalizado - Solo para "otros" */}
            {formData.tipo === "otros" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Costo (USD)
                </label>
                
                {errors.costo && (
                  <div className="text-red-500 text-xs mb-2">
                    {errors.costo}
                  </div>
                )}
                
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                  <input
                    type="text"
                    name="costo"
                    value={formData.costo}
                    onChange={handleChange}
                    className={`w-full pl-8 p-2 border rounded-md ${
                      errors.costo ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Deje en blanco si la solicitud no tiene costo</p>
              </div>
            )}
            
            {/* Documentos requeridos - Si hay documentos que adjuntar */}
            {formData.tipo && formData.documentosRequeridos.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documentos requeridos
                </label>
                
                <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3 mb-4">
                  <AlertCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Información importante</p>
                    <p>
                      Para esta solicitud es necesario adjuntar los siguientes documentos.
                      Los documentos deben estar en formato PDF, JPG o PNG y no deben exceder los 5MB cada uno.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {formData.documentosRequeridos.map((documento, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-4">
                      <div className="flex items-center mb-2">
                        <FileText className="text-gray-400 mr-2" size={18} />
                        <p className="font-medium text-gray-800">{documento}</p>
                      </div>
                      
                      <div className="mt-2">
                        <input
                          type="file"
                          id={`documento-${index}`}
                          onChange={(e) => handleFileChange(e, index)}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <label
                          htmlFor={`documento-${index}`}
                          className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 rounded-md py-2 px-4 w-full cursor-pointer hover:bg-gray-50"
                        >
                          <Upload size={16} />
                          <span>{documentosAdjuntos[index] ? documentosAdjuntos[index].name : "Seleccionar archivo"}</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Opción de urgente */}
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="urgente"
                  name="urgente"
                  checked={formData.urgente}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#C40180] border-gray-300 rounded focus:ring-[#C40180]"
                />
                <label htmlFor="urgente" className="ml-2 block text-sm text-gray-900">
                  Marcar como urgente
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Las solicitudes urgentes tienen prioridad de procesamiento
              </p>
            </div>
            
            {/* Información adicional o notas */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Información adicional (opcional)
              </label>
              
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Agregue cualquier información relevante para esta solicitud..."
                rows="2"
              ></textarea>
            </div>
            
            {/* Mensaje de error general */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                {errors.general}
              </div>
            )}
          </div>
          
          <div className="flex justify-end p-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 mr-3"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-[#C40180] text-white rounded-md ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#590248]'
              }`}
            >
              {isSubmitting ? 'Procesando...' : 'Crear solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}