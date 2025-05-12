"use client"
import { useState, useEffect } from "react"
import ElementGrid from "./ElementGrid"
import ElementToolbar from "./ElementToolbar"

const EditorLayout = ({ formData, setFormData }) => {
  const [selectedElement, setSelectedElement] = useState(null)
  const [activeTab, setActiveTab] = useState("edit")
  const [gridBackground, setGridBackground] = useState("#ffffff")

  // Ensure the grid is properly positioned on full-screen view
  useEffect(() => {
    // Reset selected element when form data changes
    setSelectedElement(null)
  }, [formData.id])

  // Actualizar elemento seleccionado
  const handleSelectElement = (elementIndex) => {
    setSelectedElement(elementIndex)

    // No need to do anything else here - just set the selected element
    // The rest will be handled by the component rendering
  }

  // Actualizar elemento
  const handleUpdateElement = (updatedElement) => {
    if (selectedElement === null) return

    setFormData((prev) => ({
      ...prev,
      layoutElements: prev.layoutElements.map((elem, i) => (i === selectedElement ? updatedElement : elem)),
    }))
  }

  // Añadir nuevo elemento
  const handleAddElement = (element) => {
    setFormData((prev) => ({
      ...prev,
      layoutElements: [...prev.layoutElements, element].sort((a, b) => {
        if (a.row !== b.row) return a.row - b.row
        return a.order - b.order
      }),
    }))
  }

  // Eliminar elemento
  const handleDeleteElement = (index) => {
    setFormData((prev) => ({
      ...prev,
      layoutElements: prev.layoutElements.filter((_, i) => i !== index),
    }))
    setSelectedElement(null)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "edit"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Editar Elementos
          </button>

          <button
            onClick={() => setActiveTab("add")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "add" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Añadir Elementos
          </button>
        </div>

        <ElementToolbar
          activeTab={activeTab}
          selectedElement={selectedElement !== null ? formData.layoutElements[selectedElement] : null}
          onUpdateElement={handleUpdateElement}
          onAddElement={handleAddElement}
          gridBackground={gridBackground}
          elements={formData.layoutElements}
        />
      </div>

      <ElementGrid
        elements={formData.layoutElements}
        selectedElement={selectedElement}
        onSelectElement={handleSelectElement}
        onUpdateElement={handleUpdateElement}
        onDeleteElement={handleDeleteElement}
        gridBackground={gridBackground}
      />
    </div>
  )
}

export default EditorLayout
