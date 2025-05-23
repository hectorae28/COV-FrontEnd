// ArticleEditor/index.jsx - Versión corregida
"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Maximize2, Minimize2, Save, Undo, X } from "lucide-react"
import { useRef } from "react"
import ArticlePreview from "./article-preview"
import ContentTab from "./Editor/ContentTab"
import GeneralInfoTab from "./Editor/GeneralInfoTab"
import { useArticleEditorState } from "./Editor/useArticleEditorState"

const ArticleEditor = ({ article, onSave, onCancel, fullPreview, toggleFullPreview, handleInputChange }) => {
  // Ya no necesitamos inicializar tags aquí, lo hacemos en el hook
  const {
    editedArticle,
    activeElement,
    activeTab,
    contentElements,
    elementRows,
    selectedFile,
    mediaType,
    mediaSource,
    historyStack,
    
    setActiveTab,
    setActiveElement,
    setSelectedFile,
    setMediaType,
    setMediaSource,
    
    handleArticleInputChange,
    undoLastChange,
    handleElementUpdate,
    prepareContentElement,
    removeContentElement,
    moveElement,
    moveElementInGrid,
    changeElementWidth,
    moveElementToRow,
    setContentElements,
    handleSave
  } = useArticleEditorState(article, onSave, handleInputChange)
  
  const fileInputRef = useRef(null)

  // Si está en modo vista previa a pantalla completa
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
                handleFileChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    setSelectedFile(file)
                    const imageUrl = URL.createObjectURL(file)
                    handleArticleInputChange({
                      target: {
                        name: "imageUrl",
                        value: imageUrl,
                      },
                    })
                    setMediaType("image")
                    setMediaSource("local")
                  }
                }}
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
                setContentElements={setContentElements}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleEditor