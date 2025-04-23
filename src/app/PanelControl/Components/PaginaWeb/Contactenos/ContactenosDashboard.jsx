"use client"
import { useState } from "react"
import { useContactStore } from "@/app/Models/PanelControl/Contactenos/ContactenosData"
import { Save, Plus, Trash2, RefreshCw } from "lucide-react"

export default function ContactenosDashboard() {
  const contactData = useContactStore((state) => state.contactData);
  const {
    updateTitle,
    updateSubtitle,
    updateEmail,
    addEmail,
    removeEmail,
    updateBusinessHours,
    updatePhone,
    addPhone,
    removePhone,
    updateLocation,
    resetData
  } = useContactStore();

  // Save status notification
  const [saveStatus, setSaveStatus] = useState("");
  
  // Handle form submission (simulated save operation)
  const handleSave = () => {
    setSaveStatus("Guardando cambios...");
    
    // Simulate saving data to backend
    setTimeout(() => {
      setSaveStatus("¡Cambios guardados correctamente!");
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveStatus("");
      }, 3000);
    }, 1000);
  };

  // Handle form reset
  const handleReset = () => {
    if (confirm("¿Está seguro que desea restaurar todos los datos originales? Esta acción no se puede deshacer.")) {
      resetData();
      setSaveStatus("Datos restaurados a valores predeterminados.");
      
      setTimeout(() => {
        setSaveStatus("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Contactos</h1>
          <p className="text-gray-600">Administre la información de la página de contacto</p>
        </div>

        {/* Save status notification */}
        {saveStatus && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
            {saveStatus}
          </div>
        )}

        {/* Admin Controls */}
        <div className="flex justify-between mb-8">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Save className="w-5 h-5 mr-2" />
            Guardar Cambios
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Restaurar Datos Originales
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Information Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Información General</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={contactData.title}
                  onChange={(e) => updateTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C40180] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                <textarea
                  value={contactData.subtitle}
                  onChange={(e) => updateSubtitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C40180] focus:border-transparent"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Business Hours Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Horario de Atención</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Días</label>
                <input
                  type="text"
                  value={contactData.businessHours.days}
                  onChange={(e) => updateBusinessHours(e.target.value, contactData.businessHours.hours)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C40180] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horario</label>
                <input
                  type="text"
                  value={contactData.businessHours.hours}
                  onChange={(e) => updateBusinessHours(contactData.businessHours.days, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C40180] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Emails Section */}
          <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-900">Correos Electrónicos</h2>
              
              <button
                onClick={() => addEmail("nuevo@elcov.org", "Nueva Descripción")}
                className="flex items-center px-3 py-1 bg-[#C40180] text-white rounded-md hover:bg-[#590248] transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Agregar
              </button>
            </div>
            
            <div className="space-y-4">
              {contactData.emails.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 p-4 border border-gray-100 rounded-md bg-gray-50">
                  <div className="col-span-5">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateEmail(index, item.email, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C40180] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="col-span-6">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={item.email}
                      onChange={(e) => updateEmail(index, e.target.value, item.description)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C40180] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="col-span-1 flex items-end justify-end">
                    <button
                      onClick={() => removeEmail(index)}
                      className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phones Section */}
          <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-900">Teléfonos</h2>
              
              <button
                onClick={() => addPhone("(0212) XXX-XX XX", "NUEVA SECCIÓN")}
                className="flex items-center px-3 py-1 bg-[#C40180] text-white rounded-md hover:bg-[#590248] transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Agregar
              </button>
            </div>
            
            <div className="space-y-4">
              {contactData.phones.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 p-4 border border-gray-100 rounded-md bg-gray-50">
                  <div className="col-span-5">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updatePhone(index, item.number, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C40180] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="col-span-6">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Número de Teléfono</label>
                    <input
                      type="text"
                      value={item.number}
                      onChange={(e) => updatePhone(index, e.target.value, item.description)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C40180] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="col-span-1 flex items-end justify-end">
                    <button
                      onClick={() => removePhone(index)}
                      className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Ubicación</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <textarea
                  value={contactData.location.address}
                  onChange={(e) => updateLocation(e.target.value, contactData.location.latitude, contactData.location.longitude)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C40180] focus:border-transparent"
                  rows="3"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
                  <input
                    type="text"
                    value={contactData.location.latitude}
                    onChange={(e) => updateLocation(contactData.location.address, e.target.value, contactData.location.longitude)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C40180] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
                  <input
                    type="text"
                    value={contactData.location.longitude}
                    onChange={(e) => updateLocation(contactData.location.address, contactData.location.latitude, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C40180] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Vista previa del mapa:</p>
                <div className="rounded-lg overflow-hidden h-64 bg-gray-200">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.0064611371!2d${contactData.location.longitude}!3d${contactData.location.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDMwJzI3LjYiTiA2NsKwNTInNTcuMyJX!5e0!3m2!1ses!2sve!4v1620000000000!5m2!1ses!2sve`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación del Colegio de Odontólogos"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button (Bottom) */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Save className="w-5 h-5 mr-2" />
            Guardar Todos los Cambios
          </button>
        </div>
      </div>
    </div>
  )
}