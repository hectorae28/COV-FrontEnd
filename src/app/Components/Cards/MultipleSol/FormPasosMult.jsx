"use client";

import { 
  Check, X, Paperclip, FileText, CreditCard, Award
} from 'lucide-react';

export default function SolicitudesFormSteps({ 
  activeStep,
  solicitudTipo,
  setSolicitudTipo,
  solicitudes,
  toggleSolicitud,
  haySolicitudSeleccionada,
  formData,
  handleInputChange,
  errors,
  archivos,
  handleFileUpload,
  calcularTotal,
  nextStep,
  prevStep,
  handleSubmit,
  isSubmitting,
  onCancel
}) {
  // Paso 1: Selección de tipo de solicitud
  if (activeStep === 1) {
    return (
      <div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Tipo de Solicitud
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setSolicitudTipo('individual')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                solicitudTipo === 'individual'
                  ? 'bg-[#41023B] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Individual
            </button>
            <button
              type="button"
              onClick={() => setSolicitudTipo('multiple')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                solicitudTipo === 'multiple'
                  ? 'bg-[#41023B] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Múltiple
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Seleccione las solicitudes
          </label>
          <div className="space-y-2">
            {solicitudes.map((solicitud, index) => (
              <div 
                key={solicitud.tipo}
                onClick={() => toggleSolicitud(index)}
                className={`
                  flex justify-between items-center p-3 rounded-lg cursor-pointer border
                  ${solicitud.seleccionada 
                    ? 'border-[#D7008A] bg-pink-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center">
                  <div className={`
                    w-5 h-5 rounded-full flex items-center justify-center mr-3
                    ${solicitud.seleccionada 
                      ? 'bg-[#D7008A] text-white' 
                      : 'border border-gray-300'
                    }
                  `}>
                    {solicitud.seleccionada && <Check size={12} />}
                  </div>
                  <div>
                    <p className="font-medium">{solicitud.tipo.charAt(0).toUpperCase() + solicitud.tipo.slice(1)}</p>
                    <p className="text-gray-500 text-sm">${solicitud.precio}.00</p>
                  </div>
                </div>
                {solicitudTipo === 'individual' && solicitud.seleccionada &&
                  solicitudes.filter(s => s.seleccionada).length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSolicitud(index);
                    }}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {!haySolicitudSeleccionada() && (
            <p className="text-red-500 text-sm mt-2">Debe seleccionar al menos una solicitud</p>
          )}
        </div>

        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Cédula
              </label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleInputChange}
                placeholder="Ej: V-12345678"
                className={`w-full p-2 border ${errors.cedula ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] outline-none`}
              />
              {errors.cedula && <p className="text-red-500 text-xs mt-1">{errors.cedula}</p>}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Juan Pérez"
                className={`w-full p-2 border ${errors.nombre ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] outline-none`}
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                placeholder="ejemplo@correo.com"
                className={`w-full p-2 border ${errors.correo ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] outline-none`}
              />
              {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="Ej: +58 412-1234567"
                className={`w-full p-2 border ${errors.telefono ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] outline-none`}
              />
              {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={nextStep}
            disabled={!haySolicitudSeleccionada()}
            className={`
              flex-1 py-2 px-4 rounded-lg font-medium transition-colors
              ${haySolicitudSeleccionada() 
                ? 'bg-gradient-to-b from-[#41023B] to-[#D7008A] text-white hover:opacity-90' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  // Paso 2: Documentos requeridos
  if (activeStep === 2) {
    return (
      <div>
        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-3">Documentos Requeridos</h3>
          
          {/* Requisitos para especialidad */}
          {solicitudes.find(s => s.seleccionada && s.tipo === 'especialidad') && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium flex items-center mb-2">
                <Award size={16} className="mr-2 text-[#D7008A]" />
                Especialidad
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Título de Especialidad (PDF)
                  </label>
                  <div className={`flex items-center border ${errors.titulo ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2`}>
                    <input
                      type="file"
                      id="titulo"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'titulo')}
                    />
                    <label
                      htmlFor="titulo"
                      className="flex items-center cursor-pointer flex-1"
                    >
                      <Paperclip size={16} className="mr-2 text-gray-500" />
                      <span className="text-sm">
                        {archivos['titulo'] ? archivos['titulo'].name : 'Seleccionar archivo'}
                      </span>
                    </label>
                    {archivos['titulo'] && (
                      <Check size={16} className="text-green-500" />
                    )}
                  </div>
                  {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>}
                </div>
              </div>
            </div>
          )}
          
          {/* Requisitos para carnet */}
          {solicitudes.find(s => s.seleccionada && s.tipo === 'carnet') && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium flex items-center mb-2">
                <CreditCard size={16} className="mr-2 text-[#D7008A]" />
                Carnet
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Foto tipo carnet (JPG, PNG)
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg p-2">
                    <input
                      type="file"
                      id="foto"
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'foto')}
                    />
                    <label
                      htmlFor="foto"
                      className="flex items-center cursor-pointer flex-1"
                    >
                      <Paperclip size={16} className="mr-2 text-gray-500" />
                      <span className="text-sm">
                        {archivos['foto'] ? archivos['foto'].name : 'Seleccionar archivo'}
                      </span>
                    </label>
                    {archivos['foto'] && (
                      <Check size={16} className="text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Requisitos para constancia */}
          {solicitudes.find(s => s.seleccionada && s.tipo === 'constancia') && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium flex items-center mb-2">
                <FileText size={16} className="mr-2 text-[#D7008A]" />
                Constancia
              </h4>
              <div className="text-sm text-gray-600">
                <p>Para solicitar constancias no se requieren documentos adicionales.</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Volver
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="flex-1 py-2 px-4 bg-gradient-to-b from-[#41023B] to-[#D7008A] text-white rounded-lg font-medium hover:opacity-90 transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  // Paso 3: Información de Pago
  if (activeStep === 3) {
    return (
      <div>
        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-3">Información de Pago</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-sm text-gray-800 mb-2">Resumen de la Solicitud</h4>
            
            <div className="space-y-2 mb-3">
              {solicitudes.filter(s => s.seleccionada).map(sol => (
                <div key={sol.tipo} className="flex justify-between text-sm">
                  <span>{sol.tipo.charAt(0).toUpperCase() + sol.tipo.slice(1)}</span>
                  <span className="font-medium">${sol.precio}.00</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>${calcularTotal()}.00</span>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Método de Pago
            </label>
            <select
              name="metodo"
              value={formData.metodo}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] outline-none"
            >
              <option value="transferencia">Transferencia Bancaria</option>
              <option value="pago_movil">Pago Móvil</option>
              <option value="zelle">Zelle</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Número de Referencia
            </label>
            <input
              type="text"
              name="referencia"
              value={formData.referencia}
              onChange={handleInputChange}
              placeholder="Ej: 123456789"
              className={`w-full p-2 border ${errors.referencia ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] outline-none`}
            />
            {errors.referencia && <p className="text-red-500 text-xs mt-1">{errors.referencia}</p>}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Volver
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="flex-1 py-2 px-4 bg-gradient-to-b from-[#41023B] to-[#D7008A] text-white rounded-lg font-medium hover:opacity-90 transition-colors flex justify-center items-center"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Enviar Solicitud"
            )}
          </button>
        </div>
      </div>
    );
  }

  // Default return (should not reach here)
  return null;
}