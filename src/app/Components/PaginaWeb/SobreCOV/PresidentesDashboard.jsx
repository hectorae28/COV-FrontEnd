"use client"
import React, { useState } from "react"
import { motion } from "framer-motion"
import { 
  ArrowDown, 
  ArrowUp, 
  ChevronDown, 
  ChevronUp, 
  PlusCircle, 
  Save, 
  Trash2, 
  Upload
} from "lucide-react"
import LineaTPresi from "@/app/Models/PanelControl/PaginaWeb/SobreCOV/PresidentesData"

// Definimos valores predeterminados para moduleInfo
const defaultModuleInfo = {
  title: "Presidentes del COV",
  color: "#C40180" // Color principal del COV
}

export default function PresidentesDashboard({ moduleInfo = defaultModuleInfo }) {
  // Aseguramos que moduleInfo tenga todas las propiedades necesarias
  const safeModuleInfo = {
    ...defaultModuleInfo,
    ...moduleInfo
  }
  
  // State for presidents data
  const [presidents, setPresidents] = useState(LineaTPresi.map((president, index) => ({
    ...president,
    id: index + 1,
  })))
  
  // UI state
  const [expandedPanel, setExpandedPanel] = useState(null)
  const [previewSection, setPreviewSection] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Function to add a new president
  const addNewPresident = () => {
    const newPresident = {
      id: Date.now(),
      year: "Nuevo período",
      title: "Nuevo presidente",
      description: "",
      image: "/assets/presidente.webp"
    }
    setPresidents([...presidents, newPresident])
    setExpandedPanel(newPresident.id)
  }
  
  // Function to delete a president
  const deletePresident = (id) => {
    setPresidents(presidents.filter((president) => president.id !== id))
    if (expandedPanel === id) {
      setExpandedPanel(null)
    }
    // Update preview if needed
    if (previewSection >= presidents.length - 1) {
      setPreviewSection(Math.max(0, presidents.length - 2))
    }
  }
  
  // Function to update a president
  const updatePresident = (id, field, value) => {
    setPresidents(presidents.map((president) => 
      president.id === id ? { ...president, [field]: value } : president
    ))
  }
  
  // Function to move presidents up or down
  const movePresident = (id, direction) => {
    const index = presidents.findIndex((president) => president.id === id)
    if ((direction === "up" && index === 0) || 
        (direction === "down" && index === presidents.length - 1)) {
      return
    }
    
    const newPresidents = [...presidents]
    const newIndex = direction === "up" ? index - 1 : index + 1
    ;[newPresidents[index], newPresidents[newIndex]] = [newPresidents[newIndex], newPresidents[index]]
    
    setPresidents(newPresidents)
    
    // Update preview if needed
    if (previewSection === index) {
      setPreviewSection(newIndex)
    } else if (previewSection === newIndex) {
      setPreviewSection(index)
    }
  }
  
  // Function to save changes
  const saveChanges = () => {
    alert("Cambios guardados correctamente")
    console.log("Presidentes guardados:", presidents)
  }
  
  // Filter presidents based on search term
  const filteredPresidents = presidents.filter(president => 
    president.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    president.year.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4" style={{ color: moduleInfo.color }}>
          {moduleInfo.title}
        </h2>
        <p className="text-gray-600 mb-6">
          Aquí se edita la sección de Presidentes de la página web
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Preview Panel - LEFT (1/3 width) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-4"
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Vista Previa</h3>
            </div>
            <div className="p-4">
              {presidents.length > 0 ? (
                <div className="flex flex-col items-center">
                  {/* President Card */}
                  <div className="w-full max-w-md bg-white rounded-lg overflow-hidden shadow-md">
                    <div className="relative pb-[75%] bg-gray-100">
                      <img 
                        src={presidents[previewSection].image} 
                        alt={presidents[previewSection].title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded mb-2">
                        {presidents[previewSection].year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{presidents[previewSection].title}</h3>
                      {presidents[previewSection].description && (
                        <p className="mt-2 text-gray-600">{presidents[previewSection].description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No hay presidentes en la lista. Agrega uno para ver la vista previa.
                </div>
              )}
              {/* Preview Navigation */}
              <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between mt-4">
                <button
                  onClick={() => setPreviewSection((prev) => (prev === 0 ? presidents.length - 1 : prev - 1))}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  disabled={presidents.length === 0}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="text-sm text-gray-500">
                  {presidents.length > 0 ? `${previewSection + 1} / ${presidents.length}` : "No hay presidentes"}
                </div>
                <button
                  onClick={() => setPreviewSection((prev) => (prev === presidents.length - 1 ? 0 : prev + 1))}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  disabled={presidents.length === 0}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Editor Panel - RIGHT (2/3 width) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Lista de Presidentes</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addNewPresident}
                className="px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-medium"
                style={{ backgroundColor: safeModuleInfo.color, color: "white" }}
              >
                <PlusCircle size={14} />
                <span>Agregar</span>
              </motion.button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar presidente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:border-gray-300"
                style={{
                  "--tw-ring-color": safeModuleInfo.color,
                  borderColor: "var(--tw-ring-color)",
                }}
              />
            </div>

            {/* Presidents List */}
            <div className="space-y-3 max-h-[calc(100vh-480px)] overflow-y-auto pr-1">
              {filteredPresidents.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  {searchTerm ? "No se encontraron resultados para tu búsqueda." : "No hay presidentes en la lista. Haz clic en \"Agregar\" para crear el primero."}
                </div>
              ) : (
                filteredPresidents.map((president, index) => (
                  <motion.div
                    key={president.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* President Header */}
                    <div
                      className={`flex justify-between items-center p-3 cursor-pointer ${
                        expandedPanel === president.id ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-50 transition-colors duration-200`}
                      onClick={() => setExpandedPanel(expandedPanel === president.id ? null : president.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                          <img 
                            src={president.image} 
                            alt={president.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                            {president.title || "Sin nombre"}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-1">{president.year || "Sin período"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: previewSection === index ? `${safeModuleInfo.color}20` : "rgb(243 244 246)",
                            color: previewSection === index ? safeModuleInfo.color : "rgb(75 85 99)",
                          }}
                        >
                          #{index + 1}
                        </span>
                        {expandedPanel === president.id ? (
                          <ChevronUp size={18} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={18} className="text-gray-500" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedPanel === president.id && (
                      <div className="p-3 border-t border-gray-200 bg-white">
                        <div className="grid grid-cols-1 gap-3">
                          {/* Image Upload */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Imagen</label>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-16 rounded bg-gray-200 overflow-hidden">
                                <img 
                                  src={president.image} 
                                  alt={president.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded shadow-sm hover:bg-gray-50"
                              >
                                <Upload size={14} />
                                <span>Cambiar imagen</span>
                              </button>
                            </div>
                          </div>

                          {/* Text Fields */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Período</label>
                            <input
                              type="text"
                              value={president.year}
                              onChange={(e) => updatePresident(president.id, "year", e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:border-gray-300"
                              style={{
                                "--tw-ring-color": safeModuleInfo.color,
                                borderColor: "var(--tw-ring-color)",
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
                            <input
                              type="text"
                              value={president.title}
                              onChange={(e) => updatePresident(president.id, "title", e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:border-gray-300"
                              style={{
                                "--tw-ring-color": safeModuleInfo.color,
                                borderColor: "var(--tw-ring-color)",
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Descripción (opcional)</label>
                            <textarea
                              value={president.description}
                              onChange={(e) => updatePresident(president.id, "description", e.target.value)}
                              rows={3}
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:border-gray-300"
                              style={{
                                "--tw-ring-color": safeModuleInfo.color,
                                borderColor: "var(--tw-ring-color)",
                              }}
                            />
                          </div>

                          {/* Actions */}
                          <div className="flex justify-between pt-2 border-t border-gray-100">
                            <div className="flex gap-1">
                              <button
                                onClick={() => movePresident(president.id, "up")}
                                disabled={index === 0}
                                className={`p-1.5 rounded ${
                                  index === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                                }`}
                                title="Mover hacia arriba"
                              >
                                <ArrowUp size={16} />
                              </button>
                              <button
                                onClick={() => movePresident(president.id, "down")}
                                disabled={index === presidents.length - 1}
                                className={`p-1.5 rounded ${
                                  index === presidents.length - 1
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                                title="Mover hacia abajo"
                              >
                                <ArrowDown size={16} />
                              </button>
                              <button
                                onClick={() => setPreviewSection(index)}
                                className={`p-1.5 rounded ${
                                  previewSection === index
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                                title="Ver en la vista previa"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </button>
                            </div>
                            <button
                              onClick={() => deletePresident(president.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveChanges}
            className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-white font-medium shadow-sm"
            style={{ backgroundColor: safeModuleInfo.color }}
          >
            <Save size={16} />
            <span>Guardar Cambios</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
