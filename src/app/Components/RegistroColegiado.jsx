"use client"

import { useState } from "react"
import { X, ArrowLeft, ArrowRight, CheckCircle, UserPlus } from "lucide-react"
import React from 'react';

// Importaciones de componentes 
import InfoPersonal from "@/app/(Registro)/InfoPers"
import InfoContacto from "@/app/(Registro)/InfoCont"
import InfoColegiado from "@/app/(Registro)/InfoColg"
import InfoLaboral from "@/app/(Registro)/InfoLab"
import DocsRequirements from "@/app/(Registro)/DocsRequirements"
import PagosColg from "@/app/(Registro)/PagosColg"

export default function RegistroColegiados({ isAdmin = true, onClose, onRegistroExitoso }) {
  // Estado para seguimiento de pasos
  const [pasoActual, setPasoActual] = useState(1)
  const [completedSteps, setCompletedSteps] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [exonerarPagos, setExonerarPagos] = useState(false)
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    // Datos personales
    firstName: "",
    lastName: "",
    identityCard: "",
    nationality: "venezolana",
    birthDate: "",
    birthPlace: "",
    age: "",
    maritalStatus: "",
    
    // Datos de contacto
    email: "",
    phoneNumber: "",
    homePhone: "",
    address: "",
    state: "",
    city: "",
    
    // Datos de colegiado
    graduateInstitute: "",
    universityTitle: "",
    mainRegistrationNumber: "",
    mainRegistrationDate: "",
    mppsRegistrationNumber: "",
    mppsRegistrationDate: "",
    titleIssuanceDate: "",
    
    // Información laboral
    institutionName: "",
    institutionAddress: "",
    institutionPhone: "",
    clinicName: "",
    clinicAddress: "",
    clinicPhone: "",
    
    // Para mantener compatibilidad con el sistema existente
    especialidad: "",
    
    // Documentos
    documentos: {
      ci: null,
      rif: null,
      titulo: null,
      mpps: null
    }
  })
  
  // Función para actualizar datos del formulario
  const handleInputChange = (data) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }))
  }
  
  // Función para manejar cambios en documentos
  const handleDocumentosChange = (docs) => {
    setFormData(prev => ({
      ...prev,
      documentos: {
        ...prev.documentos,
        ...docs
      }
    }))
  }
  
  // Marcamos un paso como completado
  const marcarPasoCompletado = (paso) => {
    if (!completedSteps.includes(paso)) {
      setCompletedSteps(prev => [...prev, paso])
    }
  }
  
  // Función para avanzar al siguiente paso sin validaciones
  const avanzarPaso = () => {
    // Marcamos el paso actual como completado
    marcarPasoCompletado(pasoActual)
    
    // Si estamos en el paso 5 (documentos), pasamos directamente a pagos (paso 6)
    if (pasoActual === 5) {
      setPasoActual(6)
    } else if (pasoActual < 5) {
      // Para los pasos 1-4, avanzamos normalmente
      setPasoActual(pasoActual + 1)
    }
  }
  
  // Función para retroceder al paso anterior
  const retrocederPaso = () => {
    setPasoActual(Math.max(1, pasoActual - 1))
  }
  
  // Función para reiniciar el formulario y comenzar un nuevo registro
  const iniciarNuevoRegistro = () => {
    // Reiniciamos todos los estados
    setPasoActual(1)
    setCompletedSteps([])
    setExonerarPagos(false)
    setFormData({
      firstName: "",
      lastName: "",
      identityCard: "",
      nationality: "venezolana",
      birthDate: "",
      birthPlace: "",
      age: "",
      maritalStatus: "",
      email: "",
      phoneNumber: "",
      homePhone: "",
      address: "",
      state: "",
      city: "",
      graduateInstitute: "",
      universityTitle: "",
      mainRegistrationNumber: "",
      mainRegistrationDate: "",
      mppsRegistrationNumber: "",
      mppsRegistrationDate: "",
      titleIssuanceDate: "",
      institutionName: "",
      institutionAddress: "",
      institutionPhone: "",
      clinicName: "",
      clinicAddress: "",
      clinicPhone: "",
      especialidad: "",
      documentos: {
        ci: null,
        rif: null,
        titulo: null,
        mpps: null
      }
    })
  }
  
  // Función para manejar la finalización del registro
  const handleRegistroFinalizado = async () => {
    setIsSubmitting(true)
    
    try {
      // Simulando envío de datos al servidor
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const nombre = `${formData.firstName} ${formData.lastName}`
      
      // Creamos objeto con los datos necesarios para el listado
      const nuevoColegiado = {
        id: `COL-${Date.now()}`,
        nombre: nombre,
        cedula: formData.identityCard,
        numeroRegistro: formData.mainRegistrationNumber || `ODV-${Math.floor(1000 + Math.random() * 9000)}`,
        email: formData.email,
        telefono: formData.phoneNumber,
        fechaRegistro: new Date().toLocaleDateString(),
        estado: "Activo",
        solvente: exonerarPagos, // Solvente si está exonerado
        especialidad: formData.especialidad || "Odontología general",
        exoneradoPagos: exonerarPagos
      }
      
      // Avanzamos al paso de confirmación
      setPasoActual(7)
      
      // Llamamos a la función de registro exitoso (esto no ocurre hasta el paso final)
      if (pasoActual === 7) {
        onRegistroExitoso(nuevoColegiado)
      }
    } catch (error) {
      console.error("Error al registrar:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Renderizar paso actual
  const renderPasoActual = () => {
    switch (pasoActual) {
      case 1:
        return <InfoPersonal formData={formData} onInputChange={handleInputChange} />
      case 2:
        return <InfoContacto formData={formData} onInputChange={handleInputChange} />
      case 3:
        return <InfoColegiado formData={formData} onInputChange={handleInputChange} />
      case 4:
        return <InfoLaboral formData={formData} onInputChange={handleInputChange} />
      case 5:
        return <DocsRequirements formData={formData} onInputChange={handleDocumentosChange} />
      case 6:
        return (
          <div className="space-y-6">
            {isAdmin && (
              <div className="mb-6 p-4 bg-[#41023B]/20 rounded-xl border border-[#41023B]">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exonerarPagos}
                    onChange={(e) => setExonerarPagos(e.target.checked)}
                    className="h-5 w-5 text-[#D7008A] focus:ring-[#41023B] focus:bg-[#D7008A] rounded"
                  />
                  <p className="text-md text-gray-800">
                  <span className="text-[#41023B] font-bold text-lg">Exonerar pagos:</span> Al habilitar esta opción, el colegiado quedará  registrado como solvente sin necesidad de realizar un pago.
                </p>
                </label>
              </div>
            )}
            
            {!exonerarPagos && <PagosColg onPaymentComplete={handleRegistroFinalizado} />}
          </div>
        )
      case 7:
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-r from-[#D7008A] to-[#41023B] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#41023B] mb-4">¡Registro Completado!</h2>
            <p className="text-gray-800 mb-8">
              El colegiado ha sido registrado exitosamente en el sistema.
            </p>
            <button
              onClick={iniciarNuevoRegistro}
              className="px-8 py-3 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
            >
              <UserPlus size={20} />
            ¿Quieres Registrar otro colegiado?
            </button>
          </div>
        )
      default:
        return null
    }
  }
  
  // Títulos de los pasos (completos)
  const titulosPasos = [
    "Información Personal",
    "Información de Contacto",
    "Información Profesional",
    "Información Laboral",
    "Documentos Requeridos",
    "Pagos",
    "Confirmación"
  ]
  
  // Títulos para mostrar en el indicador de pasos (divididos en dos líneas excepto para documentos)
  const getTituloIndicador = (paso) => {
    switch (paso) {
      case 1:
        return (
          <div className="flex flex-col items-center text-center">
            <span className="text-xs leading-tight">Información</span>
            <span className="text-xs leading-tight">Personal</span>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center text-center">
            <span className="text-xs leading-tight">Información</span>
            <span className="text-xs leading-tight">Contacto</span>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center text-center">
            <span className="text-xs leading-tight">Información</span>
            <span className="text-xs leading-tight">Profesional</span>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center text-center">
            <span className="text-xs leading-tight">Información</span>
            <span className="text-xs leading-tight">Laboral</span>
          </div>
        );
      case 5:
        return <span className="text-xs">Documentos</span>;
      default:
        return null;
    }
  };
  
  // Determinar si mostrar el encabezado con los pasos (no se muestra en la pantalla de pagos o confirmación)
  const mostrarEncabezadoPasos = pasoActual <= 5;
  
  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        {/* Header con Título y Botón de Cerrar */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold text-[#41023B]">
            Registrar nuevo colegiado
            {pasoActual <= 6 && (
              <span className="ml-2 text-sm text-gray-500">
                {pasoActual && `• Paso ${pasoActual}: ${titulosPasos[pasoActual - 1]}`}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-[#41023B] transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Indicador de pasos - Solo visible hasta el paso 5 */}
        {mostrarEncabezadoPasos && (
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-6">
              {/* Pasos de 1 a 5 */}
              {[1, 2, 3, 4, 5].map((paso, index) => (
                <React.Fragment key={paso}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full 
                    ${completedSteps.includes(paso) 
                      ? 'bg-[#41023B] text-white' 
                      : pasoActual === paso 
                        ? 'bg-[#D7008A] text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {completedSteps.includes(paso) ? <CheckCircle size={18} /> : paso}
                    </div>
                    {/* Aquí usamos la función para mostrar el título dividido */}
                    <div className="mt-1 min-h-10">
                      {getTituloIndicador(paso)}
                    </div>
                  </div>
                  
                  {index < 4 && (
                    <div className={`h-1 flex-1 mx-1 ${completedSteps.includes(paso) ? 'bg-[#41023B]' : 'bg-gray-200'}`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
        
        {/* Contenido del paso actual */}
        <div className="p-6">
          {renderPasoActual()}
        </div>
        
        {/* Botones de navegación */}
        {pasoActual !== 7 && pasoActual !== 6 && (
          <div className="flex justify-between p-6 border-t bg-gray-50">
            {pasoActual > 1 ? (
              <button
                type="button"
                onClick={retrocederPaso}
                className="flex items-center gap-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={16} />
                Anterior
              </button>
            ) : (
              <div></div>
            )}
            
            {pasoActual < 5 ? (
              <button
                type="button"
                onClick={avanzarPaso}
                className="flex items-center gap-1 px-4 py-2 bg-[#D7008A] text-white rounded-lg hover:bg-[#590248] transition-colors"
              >
                Siguiente
                <ArrowRight size={16} />
              </button>
            ) : pasoActual === 5 && (
              <button
                type="button"
                onClick={avanzarPaso}
                className="flex items-center gap-1 px-4 py-2 bg-[#D7008A] text-white rounded-lg hover:bg-[#590248] transition-colors"
              >
                Completar Registro
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}
        
        {/* Botón para la sección de pagos cuando hay exoneración */}
        {pasoActual === 6 && exonerarPagos && (
          <div className="flex justify-center p-6 border-t bg-gray-100">
            <button
              type="button"
              onClick={handleRegistroFinalizado}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                "Completar Registro"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}