"use client"
import {
  ArrowUp,
  ArrowDown,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  X,
  PlusCircle,
} from "lucide-react"

const ElementEditor = ({ element, onUpdate, onRemove, onMove, onChangeWidth }) => {
  if (!element) return null

  const handleContentChange = (e) => {
    onUpdate({ content: e.target.value })
  }

  const handleListItemChange = (index, value) => {
    const newContent = [...element.content]
    newContent[index] = value
    onUpdate({ content: newContent })
  }

  const addListItem = () => {
    onUpdate({ content: [...element.content, "Nuevo elemento"] })
  }

  const removeListItem = (index) => {
    const newContent = [...element.content]
    newContent.splice(index, 1)
    onUpdate({ content: newContent })
  }

  const handleStyleChange = (property, value) => {
    onUpdate({
      style: {
        ...element.style,
        [property]: value,
      },
    })
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-700">
          {element.type === "paragraph" && "Editar Párrafo"}
          {element.type === "heading1" && "Editar Título H1"}
          {element.type === "heading2" && "Editar Título H2"}
          {element.type === "heading3" && "Editar Título H3"}
          {element.type === "image" && "Editar Imagen"}
          {element.type === "quote" && "Editar Cita"}
          {(element.type === "list" || element.type === "orderedList") && "Editar Lista"}
        </h3>

        <div className="flex space-x-2">
          <button
            onClick={() => onMove("up")}
            className="cursor-pointer p-2 text-gray-500 hover:text-gray-800 transition-colors"
            title="Mover arriba"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMove("down")}
            className="cursor-pointer p-2 text-gray-500 hover:text-gray-800 transition-colors"
            title="Mover abajo"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={onRemove}
            className="cursor-pointer p-2 text-gray-500 hover:text-red-600 transition-colors"
            title="Eliminar elemento"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor específico según el tipo de elemento */}
      {element.type === "image" ? (
        <ImageEditor element={element} handleContentChange={handleContentChange} onUpdate={onUpdate} />
      ) : element.type === "quote" ? (
        <QuoteEditor element={element} handleContentChange={handleContentChange} onUpdate={onUpdate} />
      ) : element.type === "list" || element.type === "orderedList" ? (
        <ListEditor
          element={element}
          handleListItemChange={handleListItemChange}
          addListItem={addListItem}
          removeListItem={removeListItem}
        />
      ) : (
        <TextEditor element={element} handleContentChange={handleContentChange} />
      )}

      {/* Controles de estilo comunes */}
      <StyleControls element={element} handleStyleChange={handleStyleChange} onChangeWidth={onChangeWidth} />
    </div>
  )
}

// Componente para editar imágenes
const ImageEditor = ({ element, handleContentChange, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL de la imagen</label>
        <input
          type="text"
          value={element.content}
          onChange={handleContentChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Texto alternativo</label>
        <input
          type="text"
          value={element.alt || ""}
          onChange={(e) => onUpdate({ alt: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Descripción para accesibilidad"
        />
      </div>
    </div>
  )
}

// Componente para editar citas
const QuoteEditor = ({ element, handleContentChange, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Texto de la cita</label>
        <textarea
          value={element.content}
          onChange={handleContentChange}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
        <input
          type="text"
          value={element.author || ""}
          onChange={(e) => onUpdate({ author: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    </div>
  )
}

// Componente para editar listas
const ListEditor = ({ element, handleListItemChange, addListItem, removeListItem }) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Elementos de la lista</label>
      {element.content.map((item, index) => (
        <div key={index} className="flex items-center">
          <span className="w-6 text-center text-gray-500">
            {element.type === "orderedList" ? index + 1 + "." : "•"}
          </span>
          <input
            type="text"
            value={item}
            onChange={(e) => handleListItemChange(index, e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={() => removeListItem(index)}
            className="ml-2 p-2 text-gray-500 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addListItem}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center hover:bg-gray-200 transition-colors"
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        Añadir Elemento
      </button>
    </div>
  )
}

// Componente para editar texto (párrafos y encabezados)
const TextEditor = ({ element, handleContentChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
      <textarea
        value={element.content}
        onChange={handleContentChange}
        rows={element.type.includes("heading") ? 2 : 5}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      />
    </div>
  )
}

// Componente para controles de estilo
const StyleControls = ({ element, handleStyleChange, onChangeWidth }) => {
  return (
    <div className="mt-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
        <div className="flex space-x-2">
          <button
            onClick={() => handleStyleChange("fontWeight", element.style.fontWeight === "bold" ? "normal" : "bold")}
            className={`cursor-pointer p-2 rounded-lg border ${element.style.fontWeight === "bold" ? "bg-gray-100" : "bg-white"}`}
            title="Negrita"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleStyleChange("fontStyle", element.style.fontStyle === "italic" ? "normal" : "italic")}
            className={`cursor-pointer p-2 rounded-lg border ${element.style.fontStyle === "italic" ? "bg-gray-100" : "bg-white"}`}
            title="Cursiva"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              handleStyleChange("textDecoration", element.style.textDecoration === "underline" ? "none" : "underline")
            }
            className={`cursor-pointer p-2 rounded-lg border ${element.style.textDecoration === "underline" ? "bg-gray-100" : "bg-white"}`}
            title="Subrayado"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Alineación</label>
        <div className="flex space-x-2">
          <button
            onClick={() => handleStyleChange("textAlign", "left")}
            className={`cursor-pointer p-2 rounded-lg border ${element.style.textAlign === "left" ? "bg-gray-100" : "bg-white"}`}
            title="Alinear a la izquierda"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleStyleChange("textAlign", "center")}
            className={`cursor-pointer p-2 rounded-lg border ${element.style.textAlign === "center" ? "bg-gray-100" : "bg-white"}`}
            title="Centrar"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleStyleChange("textAlign", "right")}
            className={`cursor-pointer p-2 rounded-lg border ${element.style.textAlign === "right" ? "bg-gray-100" : "bg-white"}`}
            title="Alinear a la derecha"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color del texto</label>
        <div className="flex flex-wrap gap-2">
          {["#1f2937", "#374151", "#4b5563", "#C40180", "#590248", "#0369a1", "#047857", "#b91c1c"].map((color) => (
            <button
              key={color}
              onClick={() => handleStyleChange("color", color)}
              className={`cursor-pointer w-8 h-8 rounded-full ${element.style.color === color ? "ring-2 ring-offset-2 ring-gray-400" : ""}`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Ancho del elemento</label>
  <div className="flex space-x-2">
    <button
      onClick={() => onChangeWidth("25%")}
      className={`cursor-pointer px-3 py-1 rounded-lg border ${element.style.width === "25%" ? "bg-gray-100" : "bg-white"}`}
    >
      25%
    </button>
    <button
      onClick={() => onChangeWidth("50%")}
      className={`cursor-pointer px-3 py-1 rounded-lg border ${element.style.width === "50%" ? "bg-gray-100" : "bg-white"}`}
    >
      50%
    </button>
    <button
      onClick={() => onChangeWidth("75%")}
      className={`cursor-pointer px-3 py-1 rounded-lg border ${element.style.width === "75%" ? "bg-gray-100" : "bg-white"}`}
    >
      75%
    </button>
    <button
      onClick={() => onChangeWidth("100%")}
      className={`cursor-pointer px-3 py-1 rounded-lg border ${element.style.width === "100%" ? "bg-gray-100" : "bg-white"}`}
    >
      100%
    </button>
  </div>
</div>
    </div>
  )
}

export default ElementEditor