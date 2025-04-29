"use client"

import { useState } from "react"
import { X, AlertCircle, FileText, CreditCard, Award, FileCheck } from "lucide-react"

export default function NuevaSolicitudModal({ colegiado, onClose, onSolicitudCreada }) {
  const [tipoSolicitud, setTipoSolicitud] = useState("")
  const [formData, setFormData] = useState({
    descripcion: "",
    monto: "",
    urgente: false
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tiposSolicitud = [
    { id: "constancia", nombre: "Constancia de inscripción", icon: FileText, costo: 20, color: "blue" },
    { id: "carnet", nombre: "Carnet nuevo o renovación", icon: CreditCard, costo: 30, color: "purple" },
    { id: "especialidad", nombre: "Registro de especialidad", icon: Award, costo: 50, color: "green" },
    { id: "otros", nombre: "Otro tipo de solicitud", icon: FileCheck, costo: 0, color: "gray" }
  ]

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validación
    const nuevosErrores = {}
    
    if (!tipoSolicitud) nuevosErrores.tipoSolicitud = "Debe seleccionar un tipo de solicitud"
    if (tipoSolicitud === "otros" && !formData.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es requerida para este tipo de solicitud"
    }
    
    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simular envío a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const tipoSeleccionado = tiposSolicitud.find(tipo => tipo.id === tipoSolicitud)
      
      const nuevaSolicitud = {
        id: `sol-${Date.now()}`,
        tipo: tipoSeleccionado.nombre,
        fecha: new Date().toLocaleDateString(),
        estado: "Pendiente",
        descripcion: formData.descripcion || tipoSeleccionado.nombre,
        urgente: formData.urgente,
        monto: tipoSeleccionado.costo,
        colegiadoId: colegiado.id
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
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
            <div className="mb-6">
              <p className="font-medium text-gray-800 mb-1">Colegiado</p>
              <p className="text-gray-700">{colegiado.nombre}</p>
              <p className="text-sm text-gray-500">{colegiado.numeroRegistro} · {colegiado.cedula}</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de solicitud</label>
              
              {errors.tipoSolicitud && (
                <div className="text-red-500 text-xs mb-2">
                  {errors.tipoSolicitud}
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tiposSolicitud.map(tipo => (
                  <div 
                    key={tipo.id}
                    className={`
                      border rounded-md p-3 cursor-pointer transition-colors
                      ${tipoSolicitud === tipo.id 
                        ? `border-${tipo.color}-500 bg-${tipo.color}-50` 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => {
                      setTipoSolicitud(tipo.id)
                      if (errors.tipoSolicitud) {
                        setErrors(prev => ({
                          ...prev,
                          tipoSolicitud: null
                        }))
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full bg-${tipo.color}-100 mr-3`}>
                        <tipo.icon size={18} className={`text-${tipo.color}-700`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{tipo.nombre}</p>
                        {tipo.costo > 0 && (
                          <p className="text-xs text-gray-500">Costo: ${tipo.costo.toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {tipoSolicitud === "otros" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción de la solicitud
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.descripcion ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Describa el tipo de solicitud que desea realizar"
                  rows="3"
                ></textarea>
                {errors.descripcion && (
                  <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
                )}
              </div>
            )}
            
            {tipoSolicitud === "otros" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto a cobrar (opcional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                  <input
                    type="number"
                    name="monto"
                    value={formData.monto}
                    onChange={handleChange}
                    className="w-full pl-8 p-2 border border-gray-300 rounded-md"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="urgente"
                id="urgente"
                checked={formData.urgente}
                onChange={handleChange}
                className="h-4 w-4 text-[#C40180] border-gray-300 rounded focus:ring-[#C40180]"
              />
              <label htmlFor="urgente" className="ml-2 block text-sm text-gray-700">
                Marcar como urgente
              </label>
            </div>
            
            {tipoSolicitud && (
              <div className="bg-blue-50 p-3 rounded-md flex items-start mt-4">
                <AlertCircle className="text-blue-600 mt-0.5 flex-shrink-0 mr-2" size={18} />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Información importante</p>
                  <p>
                    {tipoSolicitud === "constancia" && "Las constancias se generan en formato PDF y pueden ser descargadas desde el sistema."}
                    {tipoSolicitud === "carnet" && "El carnet nuevo estará disponible para retiro en las instalaciones del COV en 5 días hábiles."}
                    {tipoSolicitud === "especialidad" && "Para el registro de especialidad se requerirán documentos adicionales que podrá cargar después de crear esta solicitud."}
                    {tipoSolicitud === "otros" && "Su solicitud será procesada y evaluada por el personal administrativo."}
                  </p>
                </div>
              </div>
            )}
            
            {errors.general && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
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
              disabled={isSubmitting || !tipoSolicitud}
              className={`px-6 py-2 bg-[#C40180] text-white rounded-md ${
                isSubmitting || !tipoSolicitud 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:bg-[#590248]'
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