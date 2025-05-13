"use client"

import { motion } from "framer-motion"
import {
  AlignJustify,
  ArrowLeft,
  Film,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  Maximize2,
  Minimize2,
  Pencil,
  PlusCircle,
  Quote,
  Save,
  Trash2,
  Undo,
  X
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import ArticlePreview from "./article-preview"
import ElementEditor from "./element-editor"
import { extractBriefDescription } from "./noticia-converter"
import { organizeElementsIntoRows } from "./utils"

const ArticleEditor = ({ article, onSave, onCancel, fullPreview, toggleFullPreview, handleInputChange }) => {
  const [editedArticle, setEditedArticle] = useState(article)
  const [activeElement, setActiveElement] = useState(null)
  const [activeTab, setActiveTab] = useState("general")
  const [contentElements, setContentElements] = useState([])
  const [elementRows, setElementRows] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [mediaType, setMediaType] = useState("image")
  const [mediaSource, setMediaSource] = useState("local")
  const [historyStack, setHistoryStack] = useState([])
  const [elementInPreparation, setElementInPreparation] = useState(null)
  const [showElementForm, setShowElementForm] = useState(false)
  const fileInputRef = useRef(null)

  // Actualiza el editedArticle cuando cambia el artículo de entrada
  useEffect(() => {
    setEditedArticle(article)
  }, [article])

  // Genera automáticamente la descripción breve a partir del contenido
  useEffect(() => {
    if (contentElements.length > 0 && (!editedArticle.description || editedArticle.description === "")) {
      const briefDescription = extractBriefDescription(contentElements)

      if (briefDescription) {
        setEditedArticle(prev => ({
          ...prev,
          description: briefDescription
        }))
      }
    }
  }, [contentElements, editedArticle.description])

  // Si no hay handleInputChange proporcionado, definimos uno local
  const handleArticleInputChange =
    handleInputChange ||
    ((e) => {
      const { name, value } = e.target
      setEditedArticle({
        ...editedArticle,
        [name]: value,
      })
    })

  useEffect(() => {
    if (!article.contentElements) {
      const initialElements = []

      // NO añadir automáticamente el título como un elemento heading1
      // Solo generar elementos para el contenido del artículo

      const paragraphs = (article.fullContent || article.description || "Contenido del artículo").split("\n\n")
      paragraphs.forEach((para, index) => {
        initialElements.push({
          id: `p${index}`,
          type: "paragraph",
          content: para,
          style: {
            textAlign: "left",
            width: "100%",
            color: "#4b5563",
          },
          rowData: {
            row: index,
            gridPosition: 0,
          },
        })
      })

      setContentElements(initialElements)
    } else {
      // Asegurarse de que todos los elementos tengan rowData
      const elementsWithRowData = article.contentElements.map((element, index) => {
        if (!element.rowData) {
          return {
            ...element,
            rowData: {
              row: index,
              gridPosition: 0,
            },
          }
        }
        return element
      })
      setContentElements(elementsWithRowData)
    }
  }, [article])

  useEffect(() => {
    const rows = organizeElementsIntoRows(contentElements)
    setElementRows(rows)
  }, [contentElements])

  // Guardar estado en historial para deshacer
  const saveToHistory = () => {
    setHistoryStack(prev => [...prev, [...contentElements]])
  }

  // Deshacer último cambio
  const undoLastChange = () => {
    if (historyStack.length > 0) {
      const lastState = historyStack[historyStack.length - 1]
      setContentElements(lastState)
      setHistoryStack(prev => prev.slice(0, -1))
    }
  }

  // Manejar cambios en elementos de contenido
  const handleElementUpdate = (id, updatedData) => {
    saveToHistory()
    const updatedElements = contentElements.map((element) =>
      element.id === id ? { ...element, ...updatedData } : element,
    )
    setContentElements(updatedElements)
  }

  // Preparar nuevo elemento de contenido (no lo añade inmediatamente)
  const prepareContentElement = (type) => {
    const newElement = {
      id: `element-${Date.now()}`,
      type,
      content: "",
      style: {
        textAlign: "left",
        width: "100%",
        color: type.includes("heading") ? "#1f2937" : "#4b5563",
      },
      rowData: {
        row: elementRows.length > 0 ? elementRows.length : 0,
        gridPosition: 0,
      },
    }

    // Configuraciones específicas por tipo
    switch (type) {
      case "image":
        newElement.content = ""
        newElement.sourceType = "local" // o "url"
        break
      case "video":
        newElement.content = ""
        break
      case "quote":
        newElement.content = ""
        newElement.author = ""
        break
      case "list":
      case "orderedList":
        newElement.content = ["", ""]
        break
      case "heading1":
        newElement.content = ""
        break
      case "heading2":
        newElement.content = ""
        break
      case "heading3":
        newElement.content = ""
        break
      case "paragraph":
      default:
        newElement.content = ""
    }

    setElementInPreparation(newElement)
    setShowElementForm(true)
  }

  // Añadir nuevo elemento de contenido después de prepararlo
  const addPreparedElement = () => {
    if (!elementInPreparation) return

    saveToHistory()
    setContentElements([...contentElements, elementInPreparation])
    setShowElementForm(false)
    setElementInPreparation(null)
  }

  // Cancelar la adición del nuevo elemento
  const cancelAddElement = () => {
    setShowElementForm(false)
    setElementInPreparation(null)
  }

  // Actualizar elemento en preparación
  const updateElementInPreparation = (updatedData) => {
    setElementInPreparation(prev => ({
      ...prev,
      ...updatedData
    }))
  }

  // Eliminar elemento de contenido
  const removeContentElement = (id) => {
    saveToHistory()
    setContentElements(contentElements.filter((element) => element.id !== id))
    if (activeElement === id) {
      setActiveElement(null)
    }
  }

  // Mover elemento hacia arriba o abajo (entre filas)
  const moveElement = (id, direction) => {
    saveToHistory()
    const currentIndex = contentElements.findIndex((element) => element.id === id)
    if (currentIndex < 0) return

    const newIndex =
      direction === "up" ? Math.max(0, currentIndex - 1) : Math.min(contentElements.length - 1, currentIndex + 1)

    if (newIndex === currentIndex) return

    const updatedElements = [...contentElements]
    const [movedElement] = updatedElements.splice(currentIndex, 1)
    updatedElements.splice(newIndex, 0, movedElement)

    // Actualizar rowData para reflejar el nuevo orden
    const updatedWithRowData = updatedElements.map((element, index) => {
      if (!element.rowData) {
        return {
          ...element,
          rowData: {
            row: index,
            gridPosition: 0,
          },
        }
      }
      return {
        ...element,
        rowData: {
          ...element.rowData,
          row: index,
        },
      }
    })

    setContentElements(updatedWithRowData)
  }

  // Mover elemento horizontalmente dentro de su fila o a una posición específica
  const moveElementInGrid = (id, direction, position) => {
    saveToHistory()
    const elementIndex = contentElements.findIndex((element) => element.id === id)
    if (elementIndex === -1) return

    const element = contentElements[elementIndex]
    const currentPosition = element.rowData?.gridPosition || 0
    const width = Number.parseInt(element.style?.width || "100%") / 25

    let newPosition

    if (direction === "position" && position !== undefined) {
      // Mover a una posición específica
      newPosition = position
    } else {
      // Mover a la izquierda o derecha
      newPosition = direction === "left" ? Math.max(0, currentPosition - 1) : Math.min(4 - width, currentPosition + 1)
    }

    // Si la posición no cambia, no hacer nada
    if (newPosition === currentPosition) return

    // Verificar si el elemento cabe en la nueva posición
    const row = element.rowData?.row || 0
    if (newPosition + width > 4) return // No cabe en el grid

    // Verificar si hay conflicto con otros elementos
    const rowElements = contentElements.filter((el) => el.id !== id && el.rowData?.row === row)

    const hasConflict = rowElements.some((el) => {
      const elPos = el.rowData?.gridPosition || 0
      const elWidth = Number.parseInt(el.style?.width || "100%") / 25
      return newPosition < elPos + elWidth && newPosition + width > elPos
    })

    if (hasConflict) return // Hay conflicto con otro elemento

    // Actualizar la posición del elemento
    const updatedElements = [...contentElements]
    updatedElements[elementIndex] = {
      ...element,
      rowData: {
        ...element.rowData,
        gridPosition: newPosition,
      },
    }

    setContentElements(updatedElements)
  }

  // Mover elemento a otra fila
  const moveElementToRow = (id, targetRow) => {
    saveToHistory()
    const elementIndex = contentElements.findIndex((element) => element.id === id)
    if (elementIndex === -1) return

    const element = contentElements[elementIndex]
    const currentRow = element.rowData?.row || 0

    // Si la fila no cambia, no hacer nada
    if (targetRow === currentRow) return

    // Buscar la mejor posición disponible en la fila objetivo
    const width = element.style?.width || "100%"
    const widthInGrid = Number.parseInt(width) / 25

    // Verificar si hay espacio en la fila objetivo
    const rowElements = contentElements.filter((el) => el.id !== id && el.rowData?.row === targetRow)

    // Encontrar posiciones disponibles
    const availablePositions = []
    for (let pos = 0; pos <= 4 - widthInGrid; pos++) {
      const hasConflict = rowElements.some((el) => {
        const elPos = el.rowData?.gridPosition || 0
        const elWidth = Number.parseInt(el.style?.width || "100%") / 25
        return pos < elPos + elWidth && pos + widthInGrid > elPos
      })

      if (!hasConflict) {
        availablePositions.push(pos)
      }
    }

    if (availablePositions.length === 0) {
      // No hay espacio disponible en la fila objetivo
      alert("No hay espacio disponible en la fila seleccionada para este elemento.")
      return
    }

    // Usar la primera posición disponible
    const newPosition = availablePositions[0]

    // Actualizar la fila y posición del elemento
    const updatedElements = [...contentElements]
    updatedElements[elementIndex] = {
      ...element,
      rowData: {
        ...element.rowData,
        row: targetRow,
        gridPosition: newPosition,
      },
    }

    setContentElements(updatedElements)
  }

  // Cambiar ancho de elemento
  const changeElementWidth = (id, newWidth) => {
    saveToHistory()
    const elementIndex = contentElements.findIndex((element) => element.id === id)
    if (elementIndex === -1) return

    const element = contentElements[elementIndex]
    const currentPosition = element.rowData?.gridPosition || 0
    const widthInGrid = Number.parseInt(newWidth) / 25

    // Verificar si el nuevo ancho cabe en la posición actual
    if (currentPosition + widthInGrid > 4) {
      alert("El elemento no cabe con este ancho en la posición actual.")
      return
    }

    // Verificar si hay conflicto con otros elementos
    const row = element.rowData?.row || 0
    const rowElements = contentElements.filter((el) => el.id !== id && el.rowData?.row === row)

    const hasConflict = rowElements.some((el) => {
      const elPos = el.rowData?.gridPosition || 0
      const elWidth = Number.parseInt(el.style?.width || "100%") / 25
      return currentPosition < elPos + elWidth && currentPosition + widthInGrid > elPos
    })

    if (hasConflict) {
      alert("No se puede cambiar el ancho porque hay conflicto con otros elementos.")
      return
    }

    // Actualizar el ancho del elemento
    const updatedElements = contentElements.map((element) =>
      element.id === id ? { ...element, style: { ...element.style, width: newWidth } } : element,
    )
    setContentElements(updatedElements)
  }

  // Manejar cambio de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      // Crear URL temporal para la vista previa
      const imageUrl = URL.createObjectURL(file)
      handleArticleInputChange({
        target: {
          name: "imageUrl",
          value: imageUrl,
        },
      })

      // Actualizar mediaType y mediaSource
      setMediaType("image")
      setMediaSource("local")
    }
  }

  /// Función para guardar artículo en el formato requerido - versión actualizada
  const handleSave = () => {
    // Asegurarse de que tengamos una descripción breve
    if (!editedArticle.description || editedArticle.description.trim() === "") {
      const briefDescription = extractBriefDescription(contentElements)
      if (briefDescription) {
        setEditedArticle(prev => ({
          ...prev,
          description: briefDescription
        }))
      }
    }

    // Convertir los elementos de contenido a JSON o texto plano
    const contentJson = JSON.stringify(contentElements, null, 2)

    // Determinar la URL de la imagen o video para imagen_portada_url
    let portadaUrl = editedArticle.imageUrl || ""; // Usar imageUrl como valor predeterminado

    if (mediaType === "video") {
      portadaUrl = editedArticle.videoUrl || "";
    }

    // Crear el objeto NoticiaData con el formato requerido
    const noticiaData = {
      imagen_portada: selectedFile, // El archivo de imagen
      portada_tipo: mediaType, // "image" o "video"
      portada_source: mediaSource, // "local" o "url"
      titulo: editedArticle.title || editedArticle.titulo,
      destacado: true, // Valor fijo como se solicitó
      contenido: contentJson, // El contenido como JSON
      description: editedArticle.description,
      // Asegurar que imagen_portada_url tenga el valor correcto según el tipo de portada
      imagen_portada_url: mediaType === "image" ? portadaUrl : null,
      videoUrl: mediaType === "video" ? portadaUrl : null,
    }

    // Mostrar en consola el objeto NoticiaData
    console.log("NoticiaData a enviar:", noticiaData)

    // Crear un FormData para enviar el archivo si fuera necesario
    const formData = new FormData()
    if (selectedFile) {
      formData.append("imagen_portada", selectedFile)
    }
    formData.append("titulo", editedArticle.title || editedArticle.titulo)
    formData.append("destacado", true)
    formData.append("contenido", contentJson)
    formData.append("description", editedArticle.description)
    formData.append("portada_tipo", mediaType)
    formData.append("portada_source", mediaSource)

    // Asegurar que se envíe la URL correcta según el tipo de medio
    if (mediaType === "image") {
      formData.append("imagen_portada_url", portadaUrl)
    } else if (mediaType === "video") {
      formData.append("videoUrl", portadaUrl)
    }

    console.log("FormData creado para envío con archivo")

    // También guardar en el formato original para mantener compatibilidad
    const finalArticle = {
      ...editedArticle,
      contentElements,
      mediaType,
      mediaSource,
      portada_tipo: mediaType,
      portada_source: mediaSource,
      // Asegurar que los campos de URL se configuren correctamente
      imagen_portada_url: mediaType === "image" ? portadaUrl : null,
      videoUrl: mediaType === "video" ? portadaUrl : null,
      selectedFile: selectedFile, // Incluir el archivo seleccionado
    }

    onSave(finalArticle)
  }

  if (fullPreview) {
    return (
      <div className="relative max-w-7xl mx-auto">
        <div className="fixed top-32 right-6 z-10 flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFullPreview}
            className="cursor-pointer p-3 bg-white rounded-full shadow-lg text-gray-700 hover:text-[#C40180] transition-colors"
            title="Minimizar vista previa"
          >
            <Minimize2 className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="cursor-pointer p-3 bg-white rounded-full shadow-lg text-gray-700 hover:text-emerald-600 transition-colors"
            title="Guardar cambios"
          >
            <Save className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="cursor-pointer p-3 bg-white rounded-full shadow-lg text-gray-700 hover:text-red-600 transition-colors"
            title="Cancelar"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <ArticlePreview article={editedArticle} contentElements={contentElements} elementRows={elementRows} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center transition-colors hover:text-[#590248]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </motion.button>

        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={undoLastChange}
            disabled={historyStack.length === 0}
            className={`cursor-pointer px-4 py-2 ${historyStack.length === 0
              ? "bg-gray-200 text-gray-400"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              } rounded-lg flex items-center transition-colors`}
          >
            <Undo className="w-4 h-4 mr-2" />
            Deshacer
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFullPreview}
            className="cursor-pointer px-4 py-2 bg-blue-50 text-blue-600 rounded-lg flex items-center transition-colors hover:bg-blue-100"
          >
            <Maximize2 className="w-4 h-4 mr-2" />
            Vista Previa Completa
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="cursor-pointer px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-lg flex items-center shadow-md hover:shadow-lg hover:from-[#e20091] hover:to-[#e20091] transition-shadow"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de vista previa */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-240px)] overflow-y-auto">
          <ArticlePreview
            article={editedArticle}
            contentElements={contentElements}
            elementRows={elementRows}
            activeElement={activeElement}
            onSelectElement={(id) => setActiveElement(id)}
          />
        </div>

        {/* Panel de edición */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-240px)] overflow-y-auto">
          <div className="flex border-b border-gray-200">
            <button
              className={`cursor-pointer px-6 py-3 text-sm font-medium ${activeTab === "general" ? "border-b-2 border-[#C40180] text-[#C40180]" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("general")}
            >
              Información General
            </button>
            <button
              className={`cursor-pointer px-6 py-3 text-sm font-medium ${activeTab === "content" ? "border-b-2 border-[#C40180] text-[#C40180]" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("content")}
            >
              Contenido del Artículo
            </button>
          </div>

          <div className="p-6">
            {activeTab === "general" ? (
              <GeneralInfoTab
                editedArticle={editedArticle}
                handleInputChange={handleArticleInputChange}
                handleFileChange={handleFileChange}
                fileInputRef={fileInputRef}
                mediaType={mediaType}
                setMediaType={setMediaType}
                mediaSource={mediaSource}
                setMediaSource={setMediaSource}
              />
            ) : (
              <ContentTab
                contentElements={contentElements}
                elementRows={elementRows}
                activeElement={activeElement}
                setActiveElement={setActiveElement}
                prepareContentElement={prepareContentElement}
                handleElementUpdate={handleElementUpdate}
                removeContentElement={removeContentElement}
                moveElement={moveElement}
                moveElementInGrid={moveElementInGrid}
                changeElementWidth={changeElementWidth}
                moveElementToRow={moveElementToRow}
                showElementForm={showElementForm}
                elementInPreparation={elementInPreparation}
                updateElementInPreparation={updateElementInPreparation}
                addPreparedElement={addPreparedElement}
                cancelAddElement={cancelAddElement}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para la pestaña de información general
const GeneralInfoTab = ({
  editedArticle,
  handleInputChange,
  handleFileChange,
  fileInputRef,
  mediaType,
  setMediaType,
  mediaSource,
  setMediaSource
}) => {
  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Noticia</label>
        <input
          type="text"
          name="title"
          value={editedArticle.title}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180] transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Breve <span className="text-xs text-gray-500">(Generada automáticamente a partir del contenido o personalízala)</span></label>
        <textarea
          name="description"
          value={editedArticle.description}
          onChange={handleInputChange}
          rows="2"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180] transition-colors"
          placeholder="Se generará automáticamente a partir del contenido..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
        <select
          name="category"
          value={editedArticle.category || ""}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180] transition-colors"
        >
          <option value="">Seleccionar categoría</option>
          <option value="Actualización">Actualización</option>
          <option value="Podcast">Podcast</option>
          <option value="Revista">Revista</option>
          <option value="Conferencias">Conferencias</option>
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Portada</label>
          <div className="flex space-x-2 text-sm">
            <button
              onClick={() => setMediaType("image")}
              className={`px-3 py-1 rounded-lg flex items-center ${mediaType === "image" ? "bg-[#C40180] text-white" : "bg-gray-100"}`}
            >
              <ImageIcon className="w-3 h-3 mr-1" />
              Imagen
            </button>
            <button
              onClick={() => setMediaType("video")}
              className={`px-3 py-1 rounded-lg flex items-center ${mediaType === "video" ? "bg-[#C40180] text-white" : "bg-gray-100"}`}
            >
              <Film className="w-3 h-3 mr-1" />
              Video
            </button>
          </div>
        </div>

        {mediaType === "image" && (
          <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-600">Origen de la imagen</label>
              <div className="flex space-x-2 text-sm">
                <button
                  onClick={() => setMediaSource("local")}
                  className={`px-2 py-1 rounded-lg ${mediaSource === "local" ? "bg-[#C40180] text-white" : "bg-white border border-gray-200"}`}
                >
                  Dispositivo
                </button>
                <button
                  onClick={() => setMediaSource("url")}
                  className={`px-2 py-1 rounded-lg ${mediaSource === "url" ? "bg-[#C40180] text-white" : "bg-white border border-gray-200"}`}
                >
                  URL
                </button>
              </div>
            </div>

            {mediaSource === "url" ? (
              <input
                type="text"
                name="imageUrl"
                value={editedArticle.imageUrl || ""}
                onChange={handleInputChange}
                placeholder="URL de imagen"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180] transition-colors"
              />
            ) : (
              <div className="flex flex-col items-center">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <button
                  onClick={triggerFileInput}
                  className="w-full px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-200 flex items-center justify-center transition-colors"
                >
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Seleccionar Imagen
                </button>
                {editedArticle.imageUrl && (
                  <div className="mt-3 max-w-full overflow-hidden rounded-lg">
                    <img
                      src={editedArticle.imageUrl || "/placeholder.svg"}
                      alt="Vista previa"
                      className="max-h-40 object-contain border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">{editedArticle.imageUrl.substring(0, 30)}...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>


      {mediaType === "video" && (
        <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">URL del video</label>
            <input
              type="text"
              name="videoUrl"
              value={editedArticle.videoUrl || ""}
              onChange={handleInputChange}
              placeholder="URL de YouTube, Vimeo u otro servicio de video"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180] transition-colors"
            />
          </div>
          {editedArticle.videoUrl && (
            <div className="mt-3 border rounded-lg p-2 bg-white">
              <p className="text-xs text-gray-500 mb-1">Vista previa del video no disponible</p>
              <div className="flex items-center p-2 bg-gray-100 rounded-lg">
                <Film className="w-8 h-8 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600 truncate">{editedArticle.videoUrl}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Componente para la pestaña de contenido
const ContentTab = ({
  contentElements,
  elementRows,
  activeElement,
  setActiveElement,
  prepareContentElement,
  handleElementUpdate,
  removeContentElement,
  moveElement,
  moveElementInGrid,
  changeElementWidth,
  moveElementToRow,
  showElementForm,
  elementInPreparation,
  updateElementInPreparation,
  addPreparedElement,
  cancelAddElement,
}) => {
  return (
    <div className="space-y-6">
      {/* Botones para preparar nuevos elementos de contenido */}
      <ContentElementButtons prepareContentElement={prepareContentElement} />

      {/* Formulario para nuevo elemento */}
      {showElementForm && elementInPreparation && (
        <NewElementForm
          element={elementInPreparation}
          onUpdate={updateElementInPreparation}
          onAdd={addPreparedElement}
          onCancel={cancelAddElement}
        />
      )}

      {/* Editor para elemento seleccionado */}
      {activeElement && !showElementForm ? (
        <ElementEditor
          element={contentElements.find((e) => e.id === activeElement)}
          onUpdate={(updatedData) => handleElementUpdate(activeElement, updatedData)}
          onRemove={() => removeContentElement(activeElement)}
          onMove={(direction) => moveElement(activeElement, direction)}
          onMoveInGrid={(id, direction, position) => moveElementInGrid(id, direction, position)}
          onChangeWidth={(width) => changeElementWidth(activeElement, width)}
          onMoveToRow={(id, targetRow) => moveElementToRow(id, targetRow)}
        />
      ) : !showElementForm && (
        <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl">
          <p className="text-gray-500 mb-4">Selecciona un elemento en la vista previa para editarlo</p>
          {contentElements.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer px-4 py-2 text-white bg-gradient-to-r from-[#C40180] to-[#590248] rounded-lg flex items-center transition-colors hover:from-[#e20091] hover:to-[#e20091]"
              onClick={() => setActiveElement(contentElements[0]?.id)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar Primer Elemento
            </motion.button>
          )}
        </div>
      )}

      {/* Estructura del contenido */}
      <ContentStructure
        elementRows={elementRows}
        activeElement={activeElement}
        setActiveElement={setActiveElement}
        removeContentElement={removeContentElement}
        moveElementHorizontally={moveElementInGrid}
      />
    </div>
  )
}

// Componente para configurar un nuevo elemento antes de añadirlo
const NewElementForm = ({ element, onUpdate, onAdd, onCancel }) => {
  const [localElement, setLocalElement] = useState(element)
  const [fileInputRef] = useState(useRef(null))
  const [imageSource, setImageSource] = useState("local")

  // Actualizar el elemento localmente
  const handleChange = (field, value) => {
    setLocalElement(prev => ({
      ...prev,
      [field]: value
    }))

    onUpdate({ [field]: value })
  }

  // Manejar cambios en listas
  const handleListItemChange = (index, value) => {
    if (!localElement.content || !Array.isArray(localElement.content)) return

    const newContent = [...localElement.content]
    newContent[index] = value

    handleChange('content', newContent)
  }

  // Añadir elemento a lista
  const addListItem = () => {
    if (!localElement.content || !Array.isArray(localElement.content)) return
    handleChange('content', [...localElement.content, ""])
  }

  // Eliminar elemento de lista
  const removeListItem = (index) => {
    if (!localElement.content || !Array.isArray(localElement.content)) return
    const newContent = [...localElement.content]
    newContent.splice(index, 1)
    handleChange('content', newContent)
  }

  // Manejar selección de archivo de imagen
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      handleChange('content', imageUrl)
    }
  }

  // Triggerear el input de archivo
  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  // Título según el tipo de elemento
  const getElementTitle = () => {
    switch (localElement.type) {
      case "heading1": return "Título"
      case "heading2": return "Subtítulo"
      case "heading3": return "Comentario"
      case "paragraph": return "Párrafo"
      case "image": return "Imagen"
      case "video": return "Video"
      case "quote": return "Cita"
      case "list": return "Lista"
      case "orderedList": return "Lista Numerada"
      default: return "Nuevo Elemento"
    }
  }

  return (
    <div className="border border-[#C40180]/30 rounded-lg p-4 bg-[#C40180]/5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-[#C40180]">
          Añadir Nuevo {getElementTitle()}
        </h3>
      </div>

      {/* Contenido específico según el tipo */}
      {localElement.type === "image" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-600">Origen de la imagen</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setImageSource("local")}
                className={`px-2 py-1 rounded text-sm ${imageSource === "local" ? "bg-[#C40180] text-white" : "bg-gray-100"}`}
              >
                Dispositivo
              </button>
              <button
                onClick={() => setImageSource("url")}
                className={`px-2 py-1 rounded text-sm ${imageSource === "url" ? "bg-[#C40180] text-white" : "bg-gray-100"}`}
              >
                URL
              </button>
            </div>
          </div>

          {imageSource === "url" ? (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">URL de la imagen</label>
              <input
                type="text"
                value={localElement.content || ""}
                onChange={(e) => handleChange("content", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#C40180] focus:border-[#C40180]"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
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
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 flex items-center justify-center"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Seleccionar Imagen
              </button>
              {localElement.content && (
                <div className="mt-3 max-w-full overflow-hidden">
                  <img
                    src={localElement.content}
                    alt="Vista previa"
                    className="max-h-32 object-contain rounded border"
                  />
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Texto alternativo</label>
            <input
              type="text"
              value={localElement.alt || ""}
              onChange={(e) => handleChange("alt", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#C40180] focus:border-[#C40180]"
              placeholder="Descripción de la imagen para accesibilidad"
            />
          </div>
        </div>
      )}

      {localElement.type === "video" && (
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">URL del video</label>
          <input
            type="text"
            value={localElement.content || ""}
            onChange={(e) => handleChange("content", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#C40180] focus:border-[#C40180]"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      )}

      {(localElement.type === "heading1" || localElement.type === "heading2" || localElement.type === "heading3" || localElement.type === "paragraph") && (
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Contenido</label>
          <textarea
            value={localElement.content || ""}
            onChange={(e) => handleChange("content", e.target.value)}
            rows={localElement.type.includes("heading") ? 2 : 4}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#C40180] focus:border-[#C40180]"
            placeholder={`Escribe el contenido del ${getElementTitle().toLowerCase()} aquí...`}
          />
        </div>
      )}

      {localElement.type === "quote" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Texto de la cita</label>
            <textarea
              value={localElement.content || ""}
              onChange={(e) => handleChange("content", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#C40180] focus:border-[#C40180]"
              placeholder="Escribe la cita aquí..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Autor</label>
            <input
              type="text"
              value={localElement.author || ""}
              onChange={(e) => handleChange("author", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#C40180] focus:border-[#C40180]"
              placeholder="Autor de la cita"
            />
          </div>
        </div>
      )}

      {(localElement.type === "list" || localElement.type === "orderedList") && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-600 mb-1">Elementos de la lista</label>
          {localElement.content && Array.isArray(localElement.content) && localElement.content.map((item, index) => (
            <div key={index} className="flex items-center">
              <span className="w-6 text-center text-gray-500">
                {localElement.type === "orderedList" ? index + 1 + "." : "•"}
              </span>
              <input
                type="text"
                value={item || ""}
                onChange={(e) => handleListItemChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#C40180] focus:border-[#C40180]"
                placeholder={`Elemento ${index + 1}`}
              />
              <button
                onClick={() => removeListItem(index)}
                className="ml-2 p-1 text-gray-500 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addListItem}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded flex items-center text-sm hover:bg-gray-200"
          >
            <PlusCircle className="w-3 h-3 mr-1" />
            Añadir Elemento
          </button>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={onCancel}
          className="px-3 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-[#C40180] text-white rounded hover:bg-[#890158] flex items-center"
          disabled={!localElement.content || (Array.isArray(localElement.content) && localElement.content.length === 0)}
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          Añadir al Contenido
        </button>
      </div>
    </div>
  )
}

// Componente para los botones de añadir elementos de contenido
const ContentElementButtons = ({ prepareContentElement }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 rounded-xl">
      <span className="text-sm text-gray-500 w-full mb-2">Añadir nuevo elemento:</span>

      {/* Grupo de Encabezados */}
      <div className="bg-white rounded-lg p-2 border border-gray-200">
        <div className="text-xs text-gray-400 mb-1">Encabezados</div>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => prepareContentElement("heading1")}
            className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
          >
            <Heading1 className="w-4 h-4 mr-1" />
            <span>Título</span>
          </button>
          <button
            onClick={() => prepareContentElement("heading2")}
            className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
          >
            <Heading2 className="w-4 h-4 mr-1" />
            <span>Subtítulo</span>
          </button>
          <button
            onClick={() => prepareContentElement("heading3")}
            className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
          >
            <Heading3 className="w-4 h-4 mr-1" />
            <span>Comentario</span>
          </button>
        </div>
      </div>

      {/* Grupo de Contenido */}
      <div className="bg-white rounded-lg p-2 border border-gray-200">
        <div className="text-xs text-gray-400 mb-1">Contenido</div>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => prepareContentElement("paragraph")}
            className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
          >
            <span>Párrafo</span>
          </button>
          <button
            onClick={() => prepareContentElement("quote")}
            className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
          >
            <Quote className="w-4 h-4 mr-1" />
            <span>Cita</span>
          </button>
        </div>
      </div>

      {/* Grupo de Multimedia */}
      <div className="bg-white rounded-lg p-2 border border-gray-200">
        <div className="text-xs text-gray-400 mb-1">Multimedia</div>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => prepareContentElement("image")}
            className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
          >
            <ImageIcon className="w-4 h-4 mr-1" />
            <span>Imagen</span>
          </button>
          <button
            onClick={() => prepareContentElement("video")}
            className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
          >
            <Film className="w-4 h-4 mr-1" />
            <span>Video</span>
          </button>
        </div>
      </div>

      {/* Grupo de Listas */}
      <div className="bg-white rounded-lg p-2 border border-gray-200">
        <div className="text-xs text-gray-400 mb-1">Listas</div>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => prepareContentElement("list")}
            className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
          >
            <List className="w-4 h-4 mr-1" />
            <span>Lista</span>
          </button>
          <button
            onClick={() => prepareContentElement("orderedList")}
            className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
          >
            <ListOrdered className="w-4 h-4 mr-1" />
            <span>Lista Numerada</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente para mostrar la estructura del contenido
const ContentStructure = ({
  elementRows,
  activeElement,
  setActiveElement,
  moveElementHorizontally,
  removeContentElement,
}) => {
  const getElementTypeText = (type) => {
    switch (type) {
      case "paragraph": return "Párrafo"
      case "heading1": return "Título"
      case "heading2": return "Subtítulo"
      case "heading3": return "Comentario"
      case "image": return "Imagen"
      case "video": return "Video"
      case "quote": return "Cita"
      case "list": return "Lista"
      case "orderedList": return "Lista Numerada"
      default: return type
    }
  }

  return (
    <div className="mt-5">
      <h3 className="text-base font-medium text-gray-700 mb-3">Estructura del Contenido</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
        {elementRows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="mb-2 p-2 bg-white rounded-lg border border-gray-200">
            <div className="text-xs text-gray-400 mb-1 flex justify-between items-center">
              <span>Fila {rowIndex + 1}</span>
              <span>
                Ocupación: {row.reduce((acc, el) => acc + Number.parseInt(el.style?.width || "100%") / 100, 0).toFixed(2) * 100}%
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {row.map((element) => (
                <ContentElementItem
                  key={element.id}
                  element={element}
                  activeElement={activeElement}
                  setActiveElement={setActiveElement}
                  moveElementHorizontally={moveElementHorizontally}
                  removeContentElement={removeContentElement}
                  getElementTypeText={getElementTypeText}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente para cada elemento en la estructura de contenido
const ContentElementItem = ({
  element,
  activeElement,
  setActiveElement,
  moveElementHorizontally,
  removeContentElement,
  getElementTypeText,
}) => {
  return (
    <div
      className={`p-2 rounded border cursor-pointer transition-colors ${activeElement === element.id
        ? "border-[#C40180] bg-[#C40180]/5"
        : "border-gray-200 hover:border-gray-300 bg-white"
        }`}
      style={{
        width: element.style?.width || "100%",
        maxWidth: "100%"
      }}
      onClick={() => setActiveElement(element.id)}
    >
      <div className="flex justify-between items-center">
        <span className="flex items-center">
          <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">{getElementTypeText(element.type)}</span>
          {element.style?.width && (
            <span className="ml-1 text-xs bg-blue-50 px-1.5 py-0.5 rounded text-blue-700">{element.style.width}</span>
          )}
        </span>
        <div className="flex">
          <button
            onClick={(e) => {
              e.stopPropagation()
              removeContentElement(element.id)
            }}
            className="cursor-pointer p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="mt-1 text-xs text-gray-500 truncate">
        {element.type === "image" || element.type === "video"
          ? (element.content ? element.content.substring(0, 15) + "..." : "Sin contenido")
          : typeof element.content === "string"
            ? (element.content.substring(0, 20) + (element.content.length > 20 ? "..." : ""))
            : Array.isArray(element.content)
              ? `${element.content.length} elementos`
              : "Sin contenido"
        }
      </div>
    </div>
  )
}

// Actualización de ElementEditor para incluir alineación justificada
const StyleControls = ({ element, handleStyleChange, onChangeWidth }) => {
  if (!element) return null

  return (
    <div className="mt-6 space-y-3">
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

export default ArticleEditor