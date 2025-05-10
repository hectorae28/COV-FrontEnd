"use client"
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Link, Strikethrough, Underline } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const TextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [textColor, setTextColor] = useState("#000000")
  const colorPickerRef = useRef(null)

  // Inicializar con el valor proporcionado
  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value
    }
  }, [])

  // Cerrar el selector de color al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Aplicar formato al texto seleccionado
  const applyFormat = (format, value = null) => {
    if (!editorRef.current) return

    try {
      // Ensure we're using CSS styling
      document.execCommand("styleWithCSS", false, true)

      // Get current selection
      const selection = window.getSelection()

      // If there's no selection and it's a color change, create a span
      if (format === "color" && selection.toString().trim() === "") {
        // Insert a colored span at cursor position
        const span = document.createElement("span")
        span.style.color = value
        span.textContent = " " // Space as placeholder

        const range = selection.getRangeAt(0)
        range.insertNode(span)

        // Position cursor inside the span
        range.selectNodeContents(span)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        // Apply format normally
        switch (format) {
          case "bold":
            document.execCommand("bold", false, null)
            break
          case "italic":
            document.execCommand("italic", false, null)
            break
          case "underline":
            document.execCommand("underline", false, null)
            break
          case "strikethrough":
            document.execCommand("strikeThrough", false, null)
            break
          case "color":
            document.execCommand("foreColor", false, value)
            break
          default:
            break
        }
      }

      // Notify the change
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
    } catch (error) {
      console.error("Error al aplicar formato:", error)
    }
  }

  // Aplicar alineación al párrafo
  const applyAlignment = (alignment) => {
    if (!editorRef.current) return

    try {
      document.execCommand("justifyLeft", false, null) // Restablecer alineación

      switch (alignment) {
        case "left":
          document.execCommand("justifyLeft", false, null)
          break
        case "center":
          document.execCommand("justifyCenter", false, null)
          break
        case "right":
          document.execCommand("justifyRight", false, null)
          break
        default:
          document.execCommand("justifyLeft", false, null)
      }

      // Notificar el cambio
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
    } catch (error) {
      console.error("Error al aplicar alineación:", error)
    }
  }

  // Insertar enlace
  const insertLink = () => {
    if (!linkUrl || !editorRef.current) return

    try {
      // Store the current selection
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)

      // If there's no text selected and linkText is provided, insert it
      if (selection.toString().trim() === "" && linkText) {
        const textNode = document.createTextNode(linkText)
        range.insertNode(textNode)

        // Select the newly inserted text
        range.selectNodeContents(textNode)
        selection.removeAllRanges()
        selection.addRange(range)
      }

      document.execCommand("createLink", false, linkUrl)

      // Update links
      if (editorRef.current) {
        const links = editorRef.current.querySelectorAll("a")
        links.forEach((link) => {
          // Ensure it opens in a new tab
          link.setAttribute("target", "_blank")
          link.setAttribute("rel", "noopener noreferrer")
        })

        // Notify change
        onChange(editorRef.current.innerHTML)
      }

      // Reset state
      setShowLinkInput(false)
      setLinkUrl("")
      setLinkText("")
    } catch (error) {
      console.error("Error al insertar enlace:", error)
    }
  }

  // Manejar la entrada de texto para notificar cambios
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden">
      {/* Barra de herramientas */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-gray-50 border-b border-gray-300">
        <button
          type="button"
          onClick={() => applyFormat("bold")}
          className="p-1 text-gray-700 hover:bg-gray-200 rounded-xl"
          title="Negrita"
        >
          <Bold size={16} />
        </button>

        <button
          type="button"
          onClick={() => applyFormat("italic")}
          className="p-1 text-gray-700 hover:bg-gray-200 rounded-xl"
          title="Cursiva"
        >
          <Italic size={16} />
        </button>

        <button
          type="button"
          onClick={() => applyFormat("underline")}
          className="p-1 text-gray-700 hover:bg-gray-200 rounded-xl"
          title="Subrayado"
        >
          <Underline size={16} />
        </button>

        <button
          type="button"
          onClick={() => applyFormat("strikethrough")}
          className="p-1 text-gray-700 hover:bg-gray-200 rounded-xl"
          title="Tachado"
        >
          <Strikethrough size={16} />
        </button>

        <div className="relative" ref={colorPickerRef}>
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-1 text-gray-700 hover:bg-gray-200 rounded-xl"
            title="Color de texto"
          >
            <span className="flex items-center">
              <span
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: textColor }}
              ></span>
            </span>
          </button>

          {showColorPicker && (
            <div className="absolute z-10 mt-2 p-2 bg-white border border-gray-300 rounded-xl shadow-lg">
              <div className="grid grid-cols-5 gap-2 w-36">
                {[
                  "#000000",
                  "#FF0000",
                  "#00FF00",
                  "#0000FF",
                  "#FFFF00",
                  "#FF00FF",
                  "#00FFFF",
                  "#C40180",
                  "#590248",
                  "#808080",
                  "#1E90FF",
                  "#FF8C00",
                  "#8B4513",
                  "#228B22",
                  "#4B0082",
                ].map((color) => (
                  <div
                    key={color}
                    className="w-6 h-6 rounded-full cursor-pointer border border-gray-300"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setTextColor(color)
                      applyFormat("color", color)
                      setShowColorPicker(false)
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => applyAlignment("left")}
          className="p-1 text-gray-700 hover:bg-gray-200 rounded-xl"
          title="Alinear a la izquierda"
        >
          <AlignLeft size={16} />
        </button>

        <button
          type="button"
          onClick={() => applyAlignment("center")}
          className="p-1 text-gray-700 hover:bg-gray-200 rounded-xl"
          title="Centrar"
        >
          <AlignCenter size={16} />
        </button>

        <button
          type="button"
          onClick={() => applyAlignment("right")}
          className="p-1 text-gray-700 hover:bg-gray-200 rounded-xl"
          title="Alinear a la derecha"
        >
          <AlignRight size={16} />
        </button>

        <div className="h-4 w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => setShowLinkInput(true)}
          className="p-1 text-gray-700 hover:bg-gray-200 rounded-xl"
          title="Insertar enlace"
        >
          <Link size={16} />
        </button>
      </div>

      {/* Entrada de enlace */}
      {showLinkInput && (
        <div className="p-2 bg-gray-50 border-b border-gray-300">
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="URL del enlace"
              className="px-2 py-1 border border-gray-300 rounded-xl text-sm"
            />

            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Texto del enlace (opcional)"
              className="px-2 py-1 border border-gray-300 rounded-xl text-sm"
            />

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowLinkInput(false)}
                className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={insertLink}
                disabled={!linkUrl}
                className="px-2 py-1 text-xs bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50"
              >
                Insertar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Área de texto editable */}
      <div
        ref={editorRef}
        contentEditable="true"
        onInput={handleInput}
        className="w-full px-3 py-2 min-h-[100px] focus:outline-none"
        style={{
          minHeight: "100px",
          direction: "ltr", // Asegurar dirección de escritura de izquierda a derecha
        }}
      ></div>
    </div>
  )
}

export default TextEditor
