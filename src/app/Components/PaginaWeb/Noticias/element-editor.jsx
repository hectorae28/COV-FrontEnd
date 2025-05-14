"use client"

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Bold,
  ChevronLeft,
  ChevronRight,
  Film,
  ImageIcon,
  Italic,
  PlusCircle,
  Trash2,
  Underline,
  X
} from "lucide-react"
import { useRef, useState } from "react"

const ElementEditor = ({ element, onUpdate, onRemove, onMove, onMoveInGrid, onChangeWidth, onMoveToRow }) => {
  const [imageSource, setImageSource] = useState(element?.sourceType || "local")
  const fileInputRef = useRef(null)

  if (!element)
    return (
      <div className="p-4 bg-white border border-gray-200 rounded-xl">
        <p className="text-gray-500 text-center">No hay elemento seleccionado para editar</p>
      </div>
    )

  const handleContentChange = (e) => {
    if (!e || !e.target) return
    onUpdate && onUpdate({ content: e.target.value })
  }

  const handleListItemChange = (index, value) => {
    if (!element.content || !Array.isArray(element.content)) return

    const newContent = [...element.content]
    newContent[index] = value
    onUpdate && onUpdate({ content: newContent })
  }

  const addListItem = () => {
    if (!element.content || !Array.isArray(element.content)) return

    onUpdate && onUpdate({ content: [...element.content, "Nuevo elemento"] })
  }

  const removeListItem = (index) => {
    if (!element.content || !Array.isArray(element.content)) return

    const newContent = [...element.content]
    newContent.splice(index, 1)
    onUpdate && onUpdate({ content: newContent })
  }

  const handleStyleChange = (property, value) => {
    if (!property) return

    onUpdate &&
      onUpdate({
        style: {
          ...(element.style || {}),
          [property]: value,
        },
      })
  }

  // Manejar selección de archivos para imágenes
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      onUpdate && onUpdate({
        content: imageUrl,
        sourceType: "local"
      })
    }
  }

  // Triggerear el input de archivo
  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  // Obtener el título del elemento según su tipo
  const getElementTitle = () => {
    switch (element.type) {
      case "heading1": return "Título"
      case "heading2": return "Subtítulo"
      case "heading3": return "Comentario"
      case "paragraph": return "Párrafo"
      case "image": return "Imagen"
      case "video": return "Video"
      case "quote": return "Cita"
      case "list": return "Lista"
      case "orderedList": return "Lista Numerada"
      default: return element.type
    }
  }

  // Calcular ancho en unidades grid (1-4)
  const widthInGrid = Number.parseInt(element.style?.width || "100%") / 25
  // Obtener posición actual en el grid
  const gridPosition = element.rowData?.gridPosition || 0
  // Obtener fila actual
  const currentRow = element.rowData?.row || 0

  // Verificar si puede moverse a la izquierda o derecha basado en la posición
  const canMoveLeft = gridPosition > 0
  const canMoveRight = gridPosition + widthInGrid < 4

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-gray-700">
          Editar {getElementTitle()}
        </h3>

        <div className="flex space-x-1">
          <button
            onClick={() => onMove && onMove("up")}
            className="cursor-pointer p-1.5 text-gray-500 hover:text-gray-800 transition-colors border border-gray-200 rounded"
            title="Mover arriba"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onMove && onMove("down")}
            className="cursor-pointer p-1.5 text-gray-500 hover:text-gray-800 transition-colors border border-gray-200 rounded"
            title="Mover abajo"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRemove}
            className="cursor-pointer p-1.5 text-gray-500 hover:text-red-600 transition-colors border border-gray-200 rounded"
            title="Eliminar elemento"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Movimiento en el grid */}
      <div className="mb-4 bg-gray-50 p-2 rounded-lg border border-gray-200 text-sm">
        <div className="flex justify-between items-center">
          <label className="text-xs font-medium text-gray-600">Posición</label>
          <div className="flex items-center space-x-1">
            {canMoveLeft && (
              <button
                onClick={() => onMoveInGrid && onMoveInGrid(element.id, "left")}
                className="p-1 border rounded bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
                title="Mover a la izquierda"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
            )}
            <span className="text-xs px-1">Pos: {gridPosition + 1}/4</span>
            {canMoveRight && (
              <button
                onClick={() => onMoveInGrid && onMoveInGrid(element.id, "right")}
                className="p-1 border rounded bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
                title="Mover a la derecha"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Selector de fila compacto */}
        <div className="flex items-center justify-between mt-2">
          <label className="text-xs font-medium text-gray-600">Fila</label>
          <div className="flex items-center space-x-1">
            <select
              className="p-1 border rounded bg-white text-gray-700 text-xs"
              value={currentRow}
              onChange={(e) => {
                const targetRow = Number.parseInt(e.target.value)
                if (targetRow !== currentRow) {
                  onMoveToRow && onMoveToRow(element.id, targetRow)
                }
              }}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i} value={i}>
                  Fila {i + 1}
                </option>
              ))}
            </select>
            <button
              className="p-1 border rounded bg-white text-gray-700 hover:bg-gray-100 cursor-pointer text-xs"
              onClick={() => onMoveToRow && onMoveToRow(element.id, currentRow + 1)}
              title="Nueva fila"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Editor específico según el tipo de elemento */}
      {element.type === "image" && (
        <div className="mb-4 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-600">Origen de la imagen</label>
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    setImageSource("local")
                    onUpdate && onUpdate({ sourceType: "local" })
                  }}
                  className={`px-2 py-0.5 rounded text-xs ${imageSource === "local" ? "bg-[#C40180] text-white" : "bg-gray-100"}`}
                >
                  Dispositivo
                </button>
                <button
                  onClick={() => {
                    setImageSource("url")
                    onUpdate && onUpdate({ sourceType: "url" })
                  }}
                  className={`px-2 py-0.5 rounded text-xs ${imageSource === "url" ? "bg-[#C40180] text-white" : "bg-gray-100"}`}
                >
                  URL
                </button>
              </div>
            </div>

            {imageSource === "url" ? (
              <input
                type="text"
                value={element.content || ""}
                onChange={handleContentChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            ) : (
              <div className="flex flex-col items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={triggerFileInput}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {element.content ? "Cambiar Imagen" : "Seleccionar Imagen"}
                </button>
                {element.content && (
                  <div className="mt-2 max-w-full overflow-hidden">
                    <img
                      src={element.content}
                      alt="Vista previa"
                      className="max-h-32 object-contain border rounded"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Texto alternativo</label>
            <input
              type="text"
              value={element.alt || ""}
              onChange={(e) => onUpdate && onUpdate({ alt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Descripción para accesibilidad"
            />
          </div>
        </div>
      )}

      {element.type === "video" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">URL del video</label>
          <input
            type="text"
            value={element.content || ""}
            onChange={handleContentChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="https://youtube.com/watch?v=..."
          />
          {element.content && (
            <div className="mt-2 border rounded p-2 bg-gray-50">
              <div className="flex items-center">
                <Film className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600 truncate">{element.content}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {element.type === "quote" && (
        <div className="mb-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Texto de la cita</label>
            <textarea
              value={element.content || ""}
              onChange={handleContentChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Autor</label>
            <input
              type="text"
              value={element.author || ""}
              onChange={(e) => onUpdate && onUpdate({ author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      )}

      {(element.type === "list" || element.type === "orderedList") && (
        <div className="mb-4 space-y-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">Elementos de la lista</label>
          {element.content && Array.isArray(element.content) && element.content.map((item, index) => (
            <div key={index} className="flex items-center">
              <span className="w-6 text-center text-gray-500 text-sm">
                {element.type === "orderedList" ? index + 1 + "." : "•"}
              </span>
              <input
                type="text"
                value={item || ""}
                onChange={(e) => handleListItemChange(index, e.target.value)}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={() => removeListItem(index)}
                className="ml-1 p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addListItem}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm flex items-center hover:bg-gray-200 transition-colors"
          >
            <PlusCircle className="w-3 h-3 mr-1" />
            Añadir Elemento
          </button>
        </div>
      )}

      {(element.type === "heading1" || element.type === "heading2" || element.type === "heading3" || element.type === "paragraph") && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Contenido</label>
          <textarea
            value={element.content || ""}
            onChange={handleContentChange}
            rows={element.type.includes("heading") ? 2 : 4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      )}

      {/* Controles de estilo compactos */}
      <StyleControls element={element} handleStyleChange={handleStyleChange} onChangeWidth={onChangeWidth} />
    </div>
  )
}

// Componente para controles de estilo - versión compacta
const StyleControls = ({ element, handleStyleChange, onChangeWidth }) => {
  if (!element) return null

  return (
    <div className="space-y-3">
      <div className="flex flex-col bg-gray-50 p-2 rounded-lg border border-gray-200">
        <label className="block text-xs font-medium text-gray-600 mb-1">Formato</label>
        <div className="flex space-x-1">
          <button
            onClick={() => handleStyleChange("fontWeight", element.style?.fontWeight === "bold" ? "normal" : "bold")}
            className={`cursor-pointer p-1.5 rounded-lg border ${element.style?.fontWeight === "bold" ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200"}`}
            title="Negrita"
          >
            <Bold className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleStyleChange("fontStyle", element.style?.fontStyle === "italic" ? "normal" : "italic")}
            className={`cursor-pointer p-1.5 rounded-lg border ${element.style?.fontStyle === "italic" ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200"}`}
            title="Cursiva"
          >
            <Italic className="w-3 h-3" />
          </button>
          <button
            onClick={() =>
              handleStyleChange("textDecoration", element.style?.textDecoration === "underline" ? "none" : "underline")
            }
            className={`cursor-pointer p-1.5 rounded-lg border ${element.style?.textDecoration === "underline" ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200"}`}
            title="Subrayado"
          >
            <Underline className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex flex-col bg-gray-50 p-2 rounded-lg border border-gray-200">
        <label className="block text-xs font-medium text-gray-600 mb-1">Alineación</label>
        <div className="flex space-x-1">
          <button
            onClick={() => handleStyleChange("textAlign", "left")}
            className={`cursor-pointer p-1.5 rounded-lg border ${element.style?.textAlign === "left" ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200"}`}
            title="Alinear a la izquierda"
          >
            <AlignLeft className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleStyleChange("textAlign", "center")}
            className={`cursor-pointer p-1.5 rounded-lg border ${element.style?.textAlign === "center" ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200"}`}
            title="Centrar"
          >
            <AlignCenter className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleStyleChange("textAlign", "right")}
            className={`cursor-pointer p-1.5 rounded-lg border ${element.style?.textAlign === "right" ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200"}`}
            title="Alinear a la derecha"
          >
            <AlignRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleStyleChange("textAlign", "justify")}
            className={`cursor-pointer p-1.5 rounded-lg border ${element.style?.textAlign === "justify" ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200"}`}
            title="Justificar"
          >
            <AlignJustify className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex flex-col bg-gray-50 p-2 rounded-lg border border-gray-200">
        <label className="block text-xs font-medium text-gray-600 mb-1">Ancho del elemento</label>
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => onChangeWidth && onChangeWidth("25%")}
            className={`cursor-pointer py-1 rounded-lg border text-xs ${element.style?.width === "25%" ? "bg-[#C40180] text-white border-[#C40180]" : "bg-white border-gray-200 hover:bg-gray-50"}`}
          >
            25%
          </button>
          <button
            onClick={() => onChangeWidth && onChangeWidth("50%")}
            className={`cursor-pointer py-1 rounded-lg border text-xs ${element.style?.width === "50%" ? "bg-[#C40180] text-white border-[#C40180]" : "bg-white border-gray-200 hover:bg-gray-50"}`}
          >
            50%
          </button>
          <button
            onClick={() => onChangeWidth && onChangeWidth("75%")}
            className={`cursor-pointer py-1 rounded-lg border text-xs ${element.style?.width === "75%" ? "bg-[#C40180] text-white border-[#C40180]" : "bg-white border-gray-200 hover:bg-gray-50"}`}
          >
            75%
          </button>
          <button
            onClick={() => onChangeWidth && onChangeWidth("100%")}
            className={`cursor-pointer py-1 rounded-lg border text-xs ${element.style?.width === "100%" ? "bg-[#C40180] text-white border-[#C40180]" : "bg-white border-gray-200 hover:bg-gray-50"}`}
          >
            100%
          </button>
        </div>
      </div>

      <div className="flex flex-col bg-gray-50 p-2 rounded-lg border border-gray-200">
        <label className="block text-xs font-medium text-gray-600 mb-1">Color del texto</label>
        <div className="flex flex-wrap gap-1">
          {["#1f2937", "#374151", "#4b5563", "#C40180", "#590248", "#0369a1", "#047857", "#b91c1c"].map((color) => (
            <button
              key={color}
              onClick={() => handleStyleChange("color", color)}
              className={`cursor-pointer w-6 h-6 rounded-full ${element.style?.color === color ? "ring-2 ring-offset-1 ring-gray-400" : ""}`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ElementEditor