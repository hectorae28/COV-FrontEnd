"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Save,
  Maximize2,
  Minimize2,
  X,
  Pencil,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Quote,
  List,
  ListOrdered,
  ArrowRight,
  Trash2,
} from "lucide-react"
import ElementEditor from "./element-editor"
import ArticlePreview from "./article-preview.jsx"
import { organizeElementsIntoRows, preserveElementsInRows } from "./utils"

const ArticleEditor = ({ article, onSave, onCancel, fullPreview, toggleFullPreview, handleInputChange }) => {
  const [editedArticle, setEditedArticle] = useState(article);
  const [activeElement, setActiveElement] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [contentElements, setContentElements] = useState([]);
  const [elementRows, setElementRows] = useState([]);
  
  // Actualiza el editedArticle cuando cambia el artículo de entrada
  useEffect(() => {
    setEditedArticle(article);
  }, [article]);

  // Si no hay handleInputChange proporcionado, definimos uno local
  const handleArticleInputChange = handleInputChange || ((e) => {
    const { name, value } = e.target;
    setEditedArticle({
      ...editedArticle,
      [name]: value,
    });
  });

  // Inicializar los elementos de contenido
  useEffect(() => {
    if (!article.contentElements) {
      const initialElements = [];
      
      // Elemento de título
      initialElements.push({
        id: "title",
        type: "heading1",
        content: article.title || "Nuevo Título",
        style: {
          textAlign: "center",
          width: "100%",
          color: "#1f2937",
        },
        rowData: { row: 0, order: 0 }
      });

      // Elementos de párrafo
      const paragraphs = (article.fullContent || article.description || "Contenido del artículo").split("\n\n");
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
          rowData: { row: index + 1, order: 0 }
        });
      });

      setContentElements(initialElements);
    } else {
      // Asegurarnos que todos los elementos tienen rowData
      const elementsWithRowData = preserveElementsInRows(article.contentElements);
      setContentElements(elementsWithRowData);
    }
  }, [article]);

  // Organizar elementos en filas
  useEffect(() => {
    const rows = organizeElementsIntoRows(contentElements);
    setElementRows(rows);
  }, [contentElements]);

  // Manejar cambios en elementos de contenido
  const handleElementUpdate = (id, updatedData) => {
    const updatedElements = contentElements.map((element) =>
      element.id === id ? { ...element, ...updatedData } : element,
    )
    setContentElements(updatedElements)
  }

  // Añadir nuevo elemento de contenido
  const addContentElement = (type) => {
    // Encontrar el número más alto de fila
    const maxRowIndex = contentElements.reduce(
      (max, el) => Math.max(max, el.rowData?.row || 0), 
      0
    );
    
    // Crear un nuevo elemento en su propia fila
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
        row: maxRowIndex + 1,  // Nueva fila
        order: 0               // Primer elemento en la fila
      }
    }

    // Configuraciones específicas por tipo
    switch (type) {
      case "image":
        newElement.content = "/assets/placeholder-image.jpg"
        break
      case "quote":
        newElement.content = "Añade una cita importante aquí"
        newElement.author = "Autor de la cita"
        break
      case "list":
      case "orderedList":
        newElement.content = ["Primer elemento", "Segundo elemento"]
        break
      case "heading1":
        newElement.content = "Encabezado principal"
        break
      case "heading2":
        newElement.content = "Encabezado secundario"
        break
      case "heading3":
        newElement.content = "Encabezado terciario"
        break
      case "paragraph":
      default:
        newElement.content = "Nuevo párrafo de contenido..."
    }

    setContentElements([...contentElements, newElement])
  }

  // Eliminar elemento de contenido
  const removeContentElement = (id) => {
    // Eliminar el elemento pero mantener las filas intactas
    setContentElements(contentElements.filter((element) => element.id !== id))
    if (activeElement === id) {
      setActiveElement(null)
    }
  }

  // Mover elemento hacia arriba o abajo (entre filas)
  const moveElement = (id, direction) => {
    const element = contentElements.find(el => el.id === id);
    if (!element || !element.rowData) return;
    
    const currentRow = element.rowData.row;
    const newRow = direction === "up" ? currentRow - 1 : currentRow + 1;
    
    // No permitir índices de fila negativos
    if (newRow < 0) return;
    
    const updatedElements = contentElements.map(el => 
      el.id === id 
        ? { ...el, rowData: { ...el.rowData, row: newRow } } 
        : el
    );
    
    setContentElements(updatedElements);
  };

  // Cambiar ancho de elemento
  const changeElementWidth = (id, newWidth) => {
    const updatedElements = contentElements.map((element) =>
      element.id === id ? { ...element, style: { ...element.style, width: newWidth } } : element,
    )
    setContentElements(updatedElements)
  }

  // Guardar artículo
  const handleSave = () => {
    const finalArticle = {
      ...editedArticle,
      contentElements
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
              />
            ) : (
              <ContentTab
                contentElements={contentElements}
                elementRows={elementRows}
                activeElement={activeElement}
                setActiveElement={setActiveElement}
                addContentElement={addContentElement}
                handleElementUpdate={handleElementUpdate}
                removeContentElement={removeContentElement}
                moveElement={moveElement}
                changeElementWidth={changeElementWidth}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para la pestaña de información general
const GeneralInfoTab = ({ editedArticle, handleInputChange }) => {
  return (
    <div className="space-y-6">
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Breve</label>
        <textarea
          name="description"
          value={editedArticle.description}
          onChange={handleInputChange}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180] transition-colors"
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
        <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
        <input
          type="text"
          name="imageUrl"
          value={editedArticle.imageUrl}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180] transition-colors"
        />
      </div>
    </div>
  )
}

// Componente para la pestaña de contenido
const ContentTab = ({
  contentElements,
  elementRows,
  activeElement,
  setActiveElement,
  addContentElement,
  handleElementUpdate,
  removeContentElement,
  moveElement,
  changeElementWidth,
}) => {
  return (
    <div className="space-y-6">
      <ContentElementButtons addContentElement={addContentElement} />

      {activeElement ? (
        <ElementEditor
          element={contentElements.find((e) => e.id === activeElement)}
          onUpdate={(updatedData) => handleElementUpdate(activeElement, updatedData)}
          onRemove={() => removeContentElement(activeElement)}
          onMove={(direction) => moveElement(activeElement, direction)}
          onChangeWidth={(width) => changeElementWidth(activeElement, width)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl">
          <p className="text-gray-500 mb-4">Selecciona un elemento en la vista previa para editarlo</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer px-4 py-2 text-white bg-gradient-to-r from-[#C40180] to-[#590248] rounded-lg flex items-center transition-colors hover:from-[#e20091] hover:to-[#e20091]"
            onClick={() => setActiveElement(contentElements[0]?.id)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Editar Primer Elemento
          </motion.button>
        </div>
      )}

      <ContentStructure
        elementRows={elementRows}
        activeElement={activeElement}
        setActiveElement={setActiveElement}
        removeContentElement={removeContentElement}
      />
    </div>
  )
}

// Componente para los botones de añadir elementos de contenido
const ContentElementButtons = ({ addContentElement }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 rounded-xl">
      <span className="text-sm text-gray-500 w-full mb-2">Añadir nuevo elemento:</span>
      <button
        onClick={() => addContentElement("paragraph")}
        className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
      >
        <span>Párrafo</span>
      </button>
      <button
        onClick={() => addContentElement("heading1")}
        className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
      >
        <Heading1 className="w-4 h-4 mr-1" />
        <span>H1</span>
      </button>
      <button
        onClick={() => addContentElement("heading2")}
        className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
      >
        <Heading2 className="w-4 h-4 mr-1" />
        <span>H2</span>
      </button>
      <button
        onClick={() => addContentElement("heading3")}
        className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
      >
        <Heading3 className="w-4 h-4 mr-1" />
        <span>H3</span>
      </button>
      <button
        onClick={() => addContentElement("image")}
        className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
      >
        <ImageIcon className="w-4 h-4 mr-1" />
        <span>Imagen</span>
      </button>
      <button
        onClick={() => addContentElement("quote")}
        className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
      >
        <Quote className="w-4 h-4 mr-1" />
        <span>Cita</span>
      </button>
      <button
        onClick={() => addContentElement("list")}
        className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
      >
        <List className="w-4 h-4 mr-1" />
        <span>Lista</span>
      </button>
      <button
        onClick={() => addContentElement("orderedList")}
        className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
      >
        <ListOrdered className="w-4 h-4 mr-1" />
        <span>Lista Ordenada</span>
      </button>
    </div>
  )
}

// Componente para mostrar la estructura del contenido
const ContentStructure = ({
  elementRows,
  activeElement,
  setActiveElement,
  removeContentElement,
}) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Estructura del Contenido</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto p-2">
        {elementRows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="mb-4 p-2 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-400 mb-2">
              Fila {rowIndex + 1}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {row.map((element) => (
                <ContentElementItem
                  key={element.id}
                  element={element}
                  activeElement={activeElement}
                  setActiveElement={setActiveElement}
                  removeContentElement={removeContentElement}
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
  removeContentElement,
}) => {
  return (
    <div
      className={`p-3 rounded-lg border cursor-pointer transition-colors flex-grow ${
        activeElement === element.id
          ? "border-[#C40180] bg-[#C40180]/5"
          : "border-gray-200 hover:border-gray-300 bg-white"
      }`}
      style={{ flexBasis: element.style.width || "100%" }}
      onClick={() => setActiveElement(element.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {element.type === "paragraph" && <span className="text-gray-500 text-sm">Párrafo</span>}
          {element.type === "heading1" && <span className="text-gray-500 text-sm">Título H1</span>}
          {element.type === "heading2" && <span className="text-gray-500 text-sm">Título H2</span>}
          {element.type === "heading3" && <span className="text-gray-500 text-sm">Título H3</span>}
          {element.type === "image" && <span className="text-gray-500 text-sm">Imagen</span>}
          {element.type === "quote" && <span className="text-gray-500 text-sm">Cita</span>}
          {element.type === "list" && <span className="text-gray-500 text-sm">Lista</span>}
          {element.type === "orderedList" && <span className="text-gray-500 text-sm">Lista Ordenada</span>}
          <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">{element.style.width || "100%"}</span>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              removeContentElement(element.id)
            }}
            className="cursor-pointer p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="mt-1 text-sm text-gray-500 truncate">
        {element.type === "image"
          ? "URL: " + element.content
          : typeof element.content === "string"
            ? element.content.substring(0, 60) + (element.content.length > 60 ? "..." : "")
            : "Elementos: " + element.content.length}
      </div>
    </div>
  )
}

export default ArticleEditor