"use client"
import { useState, useRef, useEffect } from "react"
import {
  FileImage,
  Image as ImageIcon,
  YoutubeIcon,
  Link2,
  X,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Square,
  Type,
  Palette
} from "lucide-react"

const BasicEditor = ({ content, setContent }) => {
  // Estados para modales
  const [showImageModal, setShowImageModal] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showColorModal, setShowColorModal] = useState(false)
  const [showButtonModal, setShowButtonModal] = useState(false)
  const [showBoxModal, setShowBoxModal] = useState(false)

  // Estados para inputs
  const [imageUrl, setImageUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [textColor, setTextColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("")
  const [fontSize, setFontSize] = useState("16px")
  
  // Estados para botón personalizado
  const [buttonText, setButtonText] = useState("Botón")
  const [buttonUrl, setButtonUrl] = useState("")
  const [buttonColor, setButtonColor] = useState("#C40180")
  const [buttonTextColor, setButtonTextColor] = useState("#FFFFFF")
  
  // Estados para caja personalizada
  const [boxContent, setBoxContent] = useState("")
  const [boxBgColor, setBoxBgColor] = useState("#f8f9fa")
  const [boxBorderColor, setBoxBorderColor] = useState("#dee2e6")

  // Referencias
  const fileInputRef = useRef(null)
  const editorRef = useRef(null)

  // Función para manejar cambios en el editor
  const handleEditorChange = (e) => {
    setContent(e.target.innerHTML)
  }

  // Cargar contenido inicial
  useEffect(() => {
    if (editorRef.current && content) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  // Ejecutar comandos de formato
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML)
      editorRef.current.focus()
    }
  }

  // Manejar subida de archivo local
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido.')
        return
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. El tamaño máximo es de 5MB.')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (event) => {
        insertImageToEditor(event.target.result)
        setShowImageModal(false)
      }
      reader.readAsDataURL(file)
    }
  }

  // Insertar imagen al editor
  const insertImageToEditor = (url) => {
    if (!url) return
    
    const imgHtml = `
      <div style="margin: 1rem 0;">
        <img src="${url}" alt="Imagen" style="max-width: 100%; border-radius: 0.5rem;" />
      </div>
    `
    
    insertHtmlAtCursor(imgHtml)
  }

  // Insertar video al editor
  const insertVideoToEditor = () => {
    if (!videoUrl) return
    
    // Extraer el ID del video de YouTube si es una URL completa
    let videoId = videoUrl
    const youtubeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = videoUrl.match(youtubeRegex)
    
    if (match && match[2].length === 11) {
      videoId = match[2]
    }
    
    const videoHtml = `
      <div style="margin: 1rem 0;">
        <iframe 
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/${videoId}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          style="border-radius: 0.5rem;"
        ></iframe>
      </div>
    `
    
    insertHtmlAtCursor(videoHtml)
    setVideoUrl("")
    setShowVideoModal(false)
  }

  // Insertar enlace
  const insertLink = () => {
    if (!linkUrl) return
    
    const text = linkText || linkUrl
    const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`
    
    insertHtmlAtCursor(linkHtml)
    setLinkUrl("")
    setLinkText("")
    setShowLinkModal(false)
  }

  // Insertar botón personalizado
  const insertButton = () => {
    if (!buttonText) return
    
    const buttonHtml = `
      <div style="margin: 1rem 0;">
        <a href="${buttonUrl}" 
           target="_blank" 
           rel="noopener noreferrer" 
           style="display: inline-block; padding: 0.5rem 1rem; background-color: ${buttonColor}; color: ${buttonTextColor}; 
                  text-decoration: none; border-radius: 0.375rem; font-weight: 500; text-align: center;">
          ${buttonText}
        </a>
      </div>
    `
    
    insertHtmlAtCursor(buttonHtml)
    setShowButtonModal(false)
  }

  // Insertar caja personalizada
  const insertBox = () => {
    if (!boxContent) return
    
    const boxHtml = `
      <div style="margin: 1rem 0; padding: 1rem; background-color: ${boxBgColor}; 
                  border: 1px solid ${boxBorderColor}; border-radius: 0.5rem;">
        ${boxContent}
      </div>
    `
    
    insertHtmlAtCursor(boxHtml)
    setBoxContent("")
    setShowBoxModal(false)
  }

  // Aplicar color de texto
  const applyTextColor = () => {
    execCommand('foreColor', textColor)
    setShowColorModal(false)
  }

  // Aplicar color de fondo
  const applyBackgroundColor = () => {
    execCommand('hiliteColor', bgColor)
    setShowColorModal(false)
  }

  // Aplicar tamaño de fuente
  const applyFontSize = () => {
    // Convertir px a tamaño relativo para execCommand
    const size = parseInt(fontSize) / 16
    execCommand('fontSize', size)
    setShowColorModal(false)
  }

  // Utilidad para insertar HTML en la posición del cursor
  const insertHtmlAtCursor = (html) => {
    if (!editorRef.current) return
    
    // Obtener selección actual
    const selection = window.getSelection()
    
    // Si hay selección y está dentro del editor
    if (selection.rangeCount > 0 && editorRef.current.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0)
      
      // Crear elemento temporal para insertar HTML
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      
      // Extraer nodos e insertarlos
      range.deleteContents()
      
      const fragment = document.createDocumentFragment()
      let node, lastNode
      
      while ((node = tempDiv.firstChild)) {
        lastNode = fragment.appendChild(node)
      }
      
      range.insertNode(fragment)
      
      // Mover el cursor al final del contenido insertado
      if (lastNode) {
        range.setStartAfter(lastNode)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    } else {
      // Si no hay selección, añadir al final
      editorRef.current.innerHTML += html
    }
    
    // Actualizar el contenido
    setContent(editorRef.current.innerHTML)
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* Barra de herramientas completa */}
      <div className="bg-white border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center">
        {/* Formato de texto */}
        <button
          onClick={() => execCommand('bold')}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
          title="Negrita"
        >
          <Bold size={16} />
        </button>
        
        <button
          onClick={() => execCommand('italic')}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
          title="Cursiva"
        >
          <Italic size={16} />
        </button>
        
        <button
          onClick={() => execCommand('underline')}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
          title="Subrayado"
        >
          <Underline size={16} />
        </button>
        
        <div className="h-4 w-px bg-gray-300 mx-1"></div>
        
        {/* Encabezados */}
        <button
          onClick={() => execCommand('formatBlock', '<h2>')}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
          title="Título"
        >
          <Heading1 size={16} />
        </button>
        
        <button
          onClick={() => execCommand('formatBlock', '<h3>')}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
          title="Subtítulo"
        >
          <Heading2 size={16} />
        </button>
        
        <button
          onClick={() => execCommand('formatBlock', '<p>')}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
          title="Párrafo"
        >
          <Type size={16} />
        </button>
        
        <div className="h-4 w-px bg-gray-300 mx-1"></div>
        
        {/* Listas */}
        <button
          onClick={() => execCommand('insertUnorderedList')}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
          title="Lista con viñetas"
        >
          <List size={16} />
        </button>
        
        <button
          onClick={() => execCommand('insertOrderedList')}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
          title="Lista numerada"
        >
          <ListOrdered size={16} />
        </button>
        
        <div className="h-4 w-px bg-gray-300 mx-1"></div>
        
        {/* Alineación */}
        <button
          onClick={() => execCommand('justifyLeft')}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
          title="Alinear a la izquierda"
        >
          <AlignLeft size={16} />
        </button>
        
        <button
          onClick={() => execCommand('justifyCenter')}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
          title="Centrar"
        >
          <AlignCenter size={16} />
        </button>
        
        <button
          onClick={() => execCommand('justifyRight')}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
          title="Alinear a la derecha"
        >
          <AlignRight size={16} />
        </button>
        
        <div className="h-4 w-px bg-gray-300 mx-1"></div>
        
        {/* Color y estilo */}
        <button
          onClick={() => setShowColorModal(true)}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
          title="Color y tamaño de texto"
        >
          <Palette size={16} />
        </button>
        
        <div className="h-4 w-px bg-gray-300 mx-1"></div>
        
        {/* Elementos multimedia */}
        <button
          onClick={() => setShowImageModal(true)}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
          title="Insertar imagen"
        >
          <ImageIcon size={16} />
        </button>
        
        <button
          onClick={() => setShowVideoModal(true)}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
          title="Insertar video"
        >
          <YoutubeIcon size={16} />
        </button>
        
        <button
          onClick={() => setShowLinkModal(true)}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
          title="Insertar enlace"
        >
          <Link2 size={16} />
        </button>
        
        <div className="h-4 w-px bg-gray-300 mx-1"></div>
        
        {/* Elementos avanzados */}
        <button
          onClick={() => setShowButtonModal(true)}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700 flex items-center"
          title="Insertar botón"
        >
          <span className="text-xs font-medium">Botón</span>
        </button>
        
        <button
                   onClick={() => setShowBoxModal(true)}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700 flex items-center"
          title="Insertar caja"
        >
          <Square size={16} />
        </button>
      </div>
      
      {/* Área de edición */}
      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[300px] focus:outline-none bg-white"
        onInput={handleEditorChange}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      {/* Modal de imagen */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Insertar imagen</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-center h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg mb-4 relative">
                  {imageUrl ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imageUrl}
                        alt="Vista previa"
                        className="h-full mx-auto object-contain"
                      />
                      <button
                        onClick={() => setImageUrl("")}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      >
                        <X size={16} className="text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
                      <div className="mt-2">
                        <button
                          onClick={() => fileInputRef.current.click()}
                          className="px-4 py-2 bg-[#C40180] text-white rounded-md text-sm hover:bg-[#590248] transition-colors"
                        >
                          Seleccionar archivo
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF hasta 5MB</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">O ingresa una URL de imagen</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                    />
                    <button
                      onClick={() => insertImageToEditor(imageUrl)}
                      disabled={!imageUrl}
                      className={`px-4 py-2 rounded-r-md text-sm ${imageUrl ? "bg-[#C40180] text-white hover:bg-[#590248]" : "bg-gray-200 text-gray-500"} transition-colors`}
                    >
                      Usar
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm transition-colors mr-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => insertImageToEditor(imageUrl)}
                  disabled={!imageUrl}
                  className={`px-4 py-2 rounded-md text-sm ${imageUrl ? "bg-[#C40180] text-white hover:bg-[#590248]" : "bg-gray-200 text-gray-500"} transition-colors`}
                >
                  Insertar imagen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de video */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Insertar video de YouTube</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL o ID del video de YouTube</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX o XXXXXXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                />
                <p className="mt-1 text-xs text-gray-500">Puedes usar una URL completa o solo el ID del video</p>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm transition-colors mr-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={insertVideoToEditor}
                  disabled={!videoUrl}
                  className={`px-4 py-2 rounded-md text-sm ${videoUrl ? "bg-[#C40180] text-white hover:bg-[#590248]" : "bg-gray-200 text-gray-500"} transition-colors`}
                >
                  Insertar video
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de enlace */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Insertar enlace</h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL del enlace</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://ejemplo.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Texto del enlace (opcional)</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Texto a mostrar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                />
                <p className="mt-1 text-xs text-gray-500">Si no se especifica, se usará la URL como texto</p>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm transition-colors mr-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={insertLink}
                  disabled={!linkUrl}
                  className={`px-4 py-2 rounded-md text-sm ${linkUrl ? "bg-[#C40180] text-white hover:bg-[#590248]" : "bg-gray-200 text-gray-500"} transition-colors`}
                >
                  Insertar enlace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de color y tamaño */}
      {showColorModal && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Formato de texto</h3>
              <button
                onClick={() => setShowColorModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color de texto</label>
                  <div className="flex">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="h-10 w-10 border border-gray-300 rounded-l-md"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                    />
                  </div>
                  <button
                    onClick={applyTextColor}
                    className="mt-2 w-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                  >
                    Aplicar color de texto
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color de fondo</label>
                  <div className="flex">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-10 w-10 border border-gray-300 rounded-l-md"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                    />
                  </div>
                  <button
                    onClick={applyBackgroundColor}
                    className="mt-2 w-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                  >
                    Aplicar color de fondo
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño de texto</label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="10"
                    max="36"
                    value={parseInt(fontSize)}
                    onChange={(e) => setFontSize(`${e.target.value}px`)}
                    className="flex-1 mr-3"
                  />
                  <input
                    type="text"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                  />
                </div>
                <button
                  onClick={applyFontSize}
                  className="mt-2 w-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  Aplicar tamaño
                </button>
              </div>
              
              <div className="flex justify-end">
                <button
                                   onClick={() => setShowColorModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de botón personalizado */}
      {showButtonModal && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Insertar botón</h3>
              <button
                onClick={() => setShowButtonModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Texto del botón</label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="Texto del botón"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL del botón (opcional)</label>
                <input
                  type="text"
                  value={buttonUrl}
                  onChange={(e) => setButtonUrl(e.target.value)}
                  placeholder="https://ejemplo.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color de fondo</label>
                  <div className="flex">
                    <input
                      type="color"
                      value={buttonColor}
                      onChange={(e) => setButtonColor(e.target.value)}
                      className="h-10 w-10 border border-gray-300 rounded-l-md"
                    />
                    <input
                      type="text"
                      value={buttonColor}
                      onChange={(e) => setButtonColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color de texto</label>
                  <div className="flex">
                    <input
                      type="color"
                      value={buttonTextColor}
                      onChange={(e) => setButtonTextColor(e.target.value)}
                      className="h-10 w-10 border border-gray-300 rounded-l-md"
                    />
                    <input
                      type="text"
                      value={buttonTextColor}
                      onChange={(e) => setButtonTextColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Vista previa</label>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md flex justify-center">
                  <a 
                    href="#" 
                    className="inline-block px-4 py-2 rounded-md text-center"
                    style={{ backgroundColor: buttonColor, color: buttonTextColor }}
                  >
                    {buttonText || "Botón"}
                  </a>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowButtonModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm transition-colors mr-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={insertButton}
                  disabled={!buttonText}
                  className={`px-4 py-2 rounded-md text-sm ${buttonText ? "bg-[#C40180] text-white hover:bg-[#590248]" : "bg-gray-200 text-gray-500"} transition-colors`}
                >
                  Insertar botón
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de caja personalizada */}
      {showBoxModal && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Insertar caja de contenido</h3>
              <button
                onClick={() => setShowBoxModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido de la caja</label>
                <textarea
                  value={boxContent}
                  onChange={(e) => setBoxContent(e.target.value)}
                  placeholder="Escribe el contenido que irá dentro de la caja..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180] min-h-[100px]"
                />
                <p className="mt-1 text-xs text-gray-500">Puedes incluir texto simple o HTML</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color de fondo</label>
                  <div className="flex">
                    <input
                      type="color"
                      value={boxBgColor}
                      onChange={(e) => setBoxBgColor(e.target.value)}
                      className="h-10 w-10 border border-gray-300 rounded-l-md"
                    />
                    <input
                      type="text"
                      value={boxBgColor}
                      onChange={(e) => setBoxBgColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color de borde</label>
                  <div className="flex">
                    <input
                      type="color"
                      value={boxBorderColor}
                      onChange={(e) => setBoxBorderColor(e.target.value)}
                      className="h-10 w-10 border border-gray-300 rounded-l-md"
                    />
                    <input
                      type="text"
                      value={boxBorderColor}
                      onChange={(e) => setBoxBorderColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Vista previa</label>
                <div 
                  className="p-4 rounded-md border"
                  style={{ backgroundColor: boxBgColor, borderColor: boxBorderColor }}
                >
                  {boxContent || "Vista previa de la caja de contenido"}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowBoxModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm transition-colors mr-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={insertBox}
                  disabled={!boxContent}
                  className={`px-4 py-2 rounded-md text-sm ${boxContent ? "bg-[#C40180] text-white hover:bg-[#590248]" : "bg-gray-200 text-gray-500"} transition-colors`}
                >
                  Insertar caja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BasicEditor
