"use client"
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Heading1,
    ImageIcon,
    ListIcon,
    MessageCircle,
    MessageSquareQuote,
    Type,
    YoutubeIcon,
} from "lucide-react"
import { useState } from "react"
import TextEditor from "./TextEditor"

const ElementToolbar = ({ activeTab, selectedElement, onUpdateElement, onAddElement, elements }) => {
    const [newElementType, setNewElementType] = useState(null)

    // Estados para el nuevo elemento
    const [newElementContent, setNewElementContent] = useState("")
    const [newElementHeadingLevel, setNewElementHeadingLevel] = useState(2)
    const [newElementImageUrl, setNewElementImageUrl] = useState("")
    const [newElementVideoUrl, setNewElementVideoUrl] = useState("")
    const [newElementListType, setNewElementListType] = useState("unordered")
    const [newElementListItems, setNewElementListItems] = useState([""])
    const [newElementQuoteAuthor, setNewElementQuoteAuthor] = useState("")
    const [newElementBackground, setNewElementBackground] = useState("#ffffff")
    const [newElementTextColor, setNewElementTextColor] = useState("#000000")
    const [newElementFontSize, setNewElementFontSize] = useState("16px")
    const [newElementAlign, setNewElementAlign] = useState("left")


    // Añadir nuevo elemento
    const handleAddNewElement = () => {
        if (!newElementType) return

        // Calcular la siguiente posición disponible
        const lastRow = elements.length > 0 ? Math.max(...elements.map((elem) => elem.row)) : 0

        const elementsInLastRow = elements.filter((elem) => elem.row === lastRow)
        const lastOrder = elementsInLastRow.length > 0 ? Math.max(...elementsInLastRow.map((elem) => elem.order)) : 0

        // Crear nuevo elemento base
        const newElement = {
            id: Date.now(),
            type: newElementType,
            row: lastRow > 0 ? lastRow : 1,
            order: lastOrder + 1,
            cols: 2, // Por defecto ocupa la mitad (2 de 4 columnas)
            align: newElementAlign,
            backgroundColor: newElementBackground,
            textColor: newElementTextColor,
            fontSize: newElementFontSize,
        }

        // Añadir propiedades específicas según el tipo
        switch (newElementType) {
            case "paragraph":
                newElement.content = newElementContent
                break
            case "heading":
                newElement.content = newElementContent
                newElement.headingLevel = newElementHeadingLevel
                break
            case "image":
                newElement.content = newElementImageUrl
                break
            case "video":
                newElement.content = newElementVideoUrl
                break
            case "list":
                newElement.items = newElementListItems.filter((item) => item.trim() !== "")
                newElement.listType = newElementListType
                break
            case "quote":
                newElement.content = newElementContent
                newElement.author = newElementQuoteAuthor
                break
            case "comment":
                newElement.content = newElementContent
                break
        }

        // Añadir el elemento
        onAddElement(newElement)

        // Resetear estados
        setNewElementType(null)
        setNewElementContent("")
        setNewElementHeadingLevel(2)
        setNewElementImageUrl("")
        setNewElementVideoUrl("")
        setNewElementListType("unordered")
        setNewElementListItems([""])
        setNewElementQuoteAuthor("")
        setNewElementBackground("#ffffff")
        setNewElementTextColor("#000000")
        setNewElementFontSize("16px")
        setNewElementAlign("left")
    }

    // Función para actualizar el elemento seleccionado
    const handleUpdateSelectedElement = (property, value) => {
        if (!selectedElement) return

        onUpdateElement({
            ...selectedElement,
            [property]: value,
        })
    }

    // Función para actualizar el tamaño del elemento
    const handleUpdateElementSize = (size) => {
        if (!selectedElement) return

        onUpdateElement({
            ...selectedElement,
            cols: size,
        })
    }

    // Renderizar panel según la pestaña activa
    const renderPanel = () => {
        if (activeTab === "add") {
            return renderAddPanel()
        } else if (activeTab === "edit" && selectedElement) {
            return renderEditPanel()
        } else {
            return (
                <div className="p-4 text-center text-gray-500">
                    {activeTab === "edit" ? "Selecciona un elemento para editarlo" : "Selecciona una opción en las pestañas"}
                </div>
            )
        }
    }

    // Panel para añadir elementos
    const renderAddPanel = () => {
        return (
            <div className="p-4">
                {!newElementType ? (
                    <>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Añadir nuevo elemento</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setNewElementType("paragraph")}
                                className="p-3 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors flex flex-col items-center"
                            >
                                <Type size={20} className="mb-1 text-purple-600" />
                                <span className="text-xs">Párrafo</span>
                            </button>

                            <button
                                onClick={() => setNewElementType("heading")}
                                className="p-3 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors flex flex-col items-center"
                            >
                                <Heading1 size={20} className="mb-1 text-purple-600" />
                                <span className="text-xs">Título</span>
                            </button>

                            <button
                                onClick={() => setNewElementType("image")}
                                className="p-3 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors flex flex-col items-center"
                            >
                                <ImageIcon size={20} className="mb-1 text-purple-600" />
                                <span className="text-xs">Imagen</span>
                            </button>

                            <button
                                onClick={() => setNewElementType("video")}
                                className="p-3 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors flex flex-col items-center"
                            >
                                <YoutubeIcon size={20} className="mb-1 text-purple-600" />
                                <span className="text-xs">Video</span>
                            </button>

                            <button
                                onClick={() => setNewElementType("list")}
                                className="p-3 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors flex flex-col items-center"
                            >
                                <ListIcon size={20} className="mb-1 text-purple-600" />
                                <span className="text-xs">Lista</span>
                            </button>

                            <button
                                onClick={() => setNewElementType("quote")}
                                className="p-3 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors flex flex-col items-center"
                            >
                                <MessageSquareQuote size={20} className="mb-1 text-purple-600" />
                                <span className="text-xs">Cita</span>
                            </button>

                            <button
                                onClick={() => setNewElementType("comment")}
                                className="p-3 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors flex flex-col items-center"
                            >
                                <MessageCircle size={20} className="mb-1 text-purple-600" />
                                <span className="text-xs">Comentario</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-medium text-gray-700">
                                Nuevo{" "}
                                {newElementType === "paragraph"
                                    ? "párrafo"
                                    : newElementType === "heading"
                                        ? "título"
                                        : newElementType === "image"
                                            ? "imagen"
                                            : newElementType === "video"
                                                ? "video"
                                                : newElementType === "list"
                                                    ? "lista"
                                                    : newElementType === "quote"
                                                        ? "cita"
                                                        : newElementType === "comment"
                                                            ? "comentario"
                                                            : "elemento"}
                            </h3>
                            <button onClick={() => setNewElementType(null)} className="text-xs text-gray-500 hover:text-gray-700">
                                Cancelar
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Campos específicos según el tipo de elemento */}
                            {(newElementType === "paragraph" || newElementType === "quote" || newElementType === "comment") && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        {newElementType === "quote" ? "Texto de la cita" : "Contenido"}
                                    </label>
                                    <TextEditor
                                        value={newElementContent}
                                        onChange={setNewElementContent}
                                        placeholder={
                                            newElementType === "quote"
                                                ? "Escribe la cita aquí..."
                                                : newElementType === "comment"
                                                    ? "Escribe el comentario aquí..."
                                                    : "Escribe el contenido aquí..."
                                        }
                                    />
                                </div>
                            )}

                            {newElementType === "quote" && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Autor de la cita</label>
                                    <input
                                        type="text"
                                        value={newElementQuoteAuthor}
                                        onChange={(e) => setNewElementQuoteAuthor(e.target.value)}
                                        placeholder="Nombre del autor"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                                    />
                                </div>
                            )}

                            {newElementType === "heading" && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Texto del título</label>
                                        <input
                                            type="text"
                                            value={newElementContent}
                                            onChange={(e) => setNewElementContent(e.target.value)}
                                            placeholder="Escribe el título aquí..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Tamaño del título</label>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => setNewElementFontSize("24px")}
                                                className={`flex-1 py-2 border rounded-xl text-center ${newElementFontSize === "24px"
                                                        ? "border-purple-500 bg-purple-50 text-purple-700"
                                                        : "border-gray-300 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <span className="text-base font-bold">Grande</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setNewElementFontSize("20px")}
                                                className={`flex-1 py-2 border rounded-xl text-center ${newElementFontSize === "20px"
                                                        ? "border-purple-500 bg-purple-50 text-purple-700"
                                                        : "border-gray-300 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <span className="text-sm font-bold">Mediano</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setNewElementFontSize("16px")}
                                                className={`flex-1 py-2 border rounded-xl text-center ${newElementFontSize === "16px"
                                                        ? "border-purple-500 bg-purple-50 text-purple-700"
                                                        : "border-gray-300 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <span className="text-xs font-bold">Pequeño</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {newElementType === "image" && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">URL de la imagen</label>
                                    <input
                                        type="text"
                                        value={newElementImageUrl}
                                        onChange={(e) => setNewElementImageUrl(e.target.value)}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                                    />
                                    {newElementImageUrl && (
                                        <div className="mt-2 h-24 bg-gray-100 rounded-xl overflow-hidden">
                                            <img
                                                src={newElementImageUrl || "/placeholder.svg"}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = "/assets/placeholder-image.jpg"
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {newElementType === "video" && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">URL del video (YouTube)</label>
                                    <input
                                        type="text"
                                        value={newElementVideoUrl}
                                        onChange={(e) => setNewElementVideoUrl(e.target.value)}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                                    />
                                </div>
                            )}

                            {newElementType === "list" && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de lista</label>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => setNewElementListType("unordered")}
                                                className={`flex-1 py-2 border rounded-xl text-center flex items-center justify-center ${newElementListType === "unordered"
                                                        ? "border-purple-500 bg-purple-50 text-purple-700"
                                                        : "border-gray-300 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <ListIcon size={16} className="mr-1" />
                                                <span>Con viñetas</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setNewElementListType("ordered")}
                                                className={`flex-1 py-2 border rounded-xl text-center flex items-center justify-center ${newElementListType === "ordered"
                                                        ? "border-purple-500 bg-purple-50 text-purple-700"
                                                        : "border-gray-300 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <span className="mr-1">1.</span>
                                                <span>Numerada</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Elementos de la lista</label>
                                        <div className="space-y-2">
                                            {newElementListItems.map((item, index) => (
                                                <div key={index} className="flex items-center">
                                                    <span className="mr-2 text-xs">
                                                        {newElementListType === "ordered" ? `${index + 1}.` : "•"}
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={item}
                                                        onChange={(e) => {
                                                            const newItems = [...newElementListItems]
                                                            newItems[index] = e.target.value
                                                            setNewElementListItems(newItems)
                                                        }}
                                                        placeholder={`Elemento ${index + 1}`}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (newElementListItems.length > 1) {
                                                                const newItems = [...newElementListItems]
                                                                newItems.splice(index, 1)
                                                                setNewElementListItems(newItems)
                                                            }
                                                        }}
                                                        className="ml-1 p-1 text-red-500 hover:bg-red-50 rounded-xl"
                                                        disabled={newElementListItems.length <= 1}
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={() => setNewElementListItems([...newElementListItems, ""])}
                                                className="w-full py-1 border border-dashed border-gray-300 rounded-xl text-xs text-gray-500 hover:bg-gray-50"
                                            >
                                                + Añadir elemento
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Opciones comunes para todos los tipos */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Ancho del elemento</label>
                                <div className="grid grid-cols-4 gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setNewElementAlign("left")}
                                        className={`p-2 border rounded-xl flex items-center justify-center ${newElementAlign === "left"
                                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                                : "border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <AlignLeft size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewElementAlign("center")}
                                        className={`p-2 border rounded-xl flex items-center justify-center ${newElementAlign === "center"
                                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                                : "border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <AlignCenter size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewElementAlign("right")}
                                        className={`p-2 border rounded-xl flex items-center justify-center ${newElementAlign === "right"
                                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                                : "border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <AlignRight size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Color de fondo</label>
                                    <div className="grid grid-cols-8 gap-1">
                                        {["#ffffff", "#f8f9fa", "#e9ecef", "#dee2e6", "#ced4da", "#C40180", "#590248", "#a00167"].map(
                                            (color) => (
                                                <div
                                                    key={color}
                                                    className={`w-6 h-6 rounded-sm cursor-pointer border ${newElementBackground === color ? "border-purple-500 ring-2 ring-purple-200" : "border-gray-200"}`}
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => setNewElementBackground(color)}
                                                ></div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Color de texto</label>
                                    <div className="grid grid-cols-8 gap-1">
                                        {["#000000", "#212529", "#495057", "#6c757d", "#adb5bd", "#ffffff", "#C40180", "#590248"].map(
                                            (color) => (
                                                <div
                                                    key={color}
                                                    className={`w-6 h-6 rounded-sm cursor-pointer border ${newElementTextColor === color ? "border-purple-500 ring-2 ring-purple-200" : "border-gray-200"}`}
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => setNewElementTextColor(color)}
                                                ></div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddNewElement}
                                disabled={
                                    (newElementType === "paragraph" && !newElementContent) ||
                                    (newElementType === "heading" && !newElementContent) ||
                                    (newElementType === "image" && !newElementImageUrl) ||
                                    (newElementType === "video" && !newElementVideoUrl) ||
                                    (newElementType === "list" && !newElementListItems.some((item) => item.trim())) ||
                                    (newElementType === "quote" && !newElementContent) ||
                                    (newElementType === "comment" && !newElementContent)
                                }
                                className="w-full py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Añadir elemento
                            </button>
                        </div>
                    </>
                )}
            </div>
        )
    }

    // Panel para editar elementos
    const renderEditPanel = () => {
        if (!selectedElement) return null

        return (
            <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Editar{" "}
                    {selectedElement.type === "paragraph"
                        ? "párrafo"
                        : selectedElement.type === "heading"
                            ? "título"
                            : selectedElement.type === "image"
                                ? "imagen"
                                : selectedElement.type === "video"
                                    ? "video"
                                    : selectedElement.type === "list"
                                        ? "lista"
                                        : selectedElement.type === "quote"
                                            ? "cita"
                                            : selectedElement.type === "comment"
                                                ? "comentario"
                                                : "elemento"}
                </h3>

                <div className="space-y-4">
                    {/* Campos específicos según el tipo de elemento */}
                    {(selectedElement.type === "paragraph" ||
                        selectedElement.type === "quote" ||
                        selectedElement.type === "comment") && (
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    {selectedElement.type === "quote" ? "Texto de la cita" : "Contenido"}
                                </label>
                                <TextEditor
                                    value={selectedElement.content || ""}
                                    onChange={(value) => handleUpdateSelectedElement("content", value)}
                                    placeholder={
                                        selectedElement.type === "quote"
                                            ? "Escribe la cita aquí..."
                                            : selectedElement.type === "comment"
                                                ? "Escribe el comentario aquí..."
                                                : "Escribe el contenido aquí..."
                                    }
                                />
                            </div>
                        )}

                    {selectedElement.type === "quote" && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Autor de la cita</label>
                            <input
                                type="text"
                                value={selectedElement.author || ""}
                                onChange={(e) => handleUpdateSelectedElement("author", e.target.value)}
                                placeholder="Nombre del autor"
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                            />
                        </div>
                    )}

                    {selectedElement.type === "heading" && (
                        <>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Texto del título</label>
                                <input
                                    type="text"
                                    value={selectedElement.content || ""}
                                    onChange={(e) => handleUpdateSelectedElement("content", e.target.value)}
                                    placeholder="Escribe el título aquí..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Tamaño del título</label>
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateSelectedElement("fontSize", "24px")}
                                        className={`flex-1 py-2 border rounded-xl text-center ${selectedElement.fontSize === "24px"
                                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                                : "border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span className="text-base font-bold">Grande</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateSelectedElement("fontSize", "20px")}
                                        className={`flex-1 py-2 border rounded-xl text-center ${selectedElement.fontSize === "20px"
                                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                                : "border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span className="text-sm font-bold">Mediano</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateSelectedElement("fontSize", "16px")}
                                        className={`flex-1 py-2 border rounded-xl text-center ${selectedElement.fontSize === "16px"
                                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                                : "border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span className="text-xs font-bold">Pequeño</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {selectedElement.type === "image" && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">URL de la imagen</label>
                            <input
                                type="text"
                                value={selectedElement.content || ""}
                                onChange={(e) => handleUpdateSelectedElement("content", e.target.value)}
                                placeholder="https://ejemplo.com/imagen.jpg"
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                            />
                            {selectedElement.content && (
                                <div className="mt-2 h-24 bg-gray-100 rounded-xl overflow-hidden">
                                    <img
                                        src={selectedElement.content || "/placeholder.svg"}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "/assets/placeholder-image.jpg"
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {selectedElement.type === "video" && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">URL del video (YouTube)</label>
                            <input
                                type="text"
                                value={selectedElement.content || ""}
                                onChange={(e) => handleUpdateSelectedElement("content", e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                            />
                        </div>
                    )}

                    {selectedElement.type === "list" &&
                        (
                            <>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de lista</label>
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateSelectedElement("listType", "unordered")}
                                            className={`flex-1 py-2 border rounded-xl text-center flex items-center justify-center ${selectedElement.listType === "unordered"
                                                    ? "border-purple-500 bg-purple-50 text-purple-700"
                                                    : "border-gray-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            <ListIcon size={16} className="mr-1" />
                                            <span>Con viñetas</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateSelectedElement("listType", "ordered")}
                                            className={`flex-1 py-2 border rounded-xl text-center flex items-center justify-center ${selectedElement.listType === "ordered"
                                                    ? "border-purple-500 bg-purple-50 text-purple-700"
                                                    : "border-gray-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            <span className="mr-1">1.</span>
                                            <span>Numerada</span>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Elementos de la lista</label>
                                    <div className="space-y-2">
                                        {(selectedElement.items || []).map((item, index) => (
                                            <div key={index} className="flex items-center">
                                                <span className="mr-2 text-xs">
                                                    {selectedElement.listType === "ordered" ? `${index + 1}.` : "•"}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => {
                                                        const newItems = [...(selectedElement.items || [])]
                                                        newItems[index] = e.target.value
                                                        handleUpdateSelectedElement("items", newItems)
                                                    }}
                                                    placeholder={`Elemento ${index + 1}`}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if ((selectedElement.items || []).length > 1) {
                                                            const newItems = [...(selectedElement.items || [])]
                                                            newItems.splice(index, 1)
                                                            handleUpdateSelectedElement("items", newItems)
                                                        }
                                                    }}
                                                    className="ml-1 p-1 text-red-500 hover:bg-red-50 rounded-xl"
                                                    disabled={(selectedElement.items || []).length <= 1}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newItems = [...(selectedElement.items || []), ""]
                                                handleUpdateSelectedElement("items", newItems)
                                            }}
                                            className="w-full py-1 border border-dashed border-gray-300 rounded-xl text-xs text-gray-500 hover:bg-gray-50"
                                        >
                                            + Añadir elemento
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                    {/* Opciones comunes para todos los tipos */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Tamaño del elemento</label>
                        <div className="grid grid-cols-4 gap-1">
                            <button
                                type="button"
                                onClick={() => handleUpdateElementSize(1)}
                                className={`p-2 border rounded-xl text-center text-xs ${selectedElement.cols === 1
                                        ? "border-purple-500 bg-purple-50 text-purple-700"
                                        : "border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                1/4
                            </button>
                            <button
                                type="button"
                                onClick={() => handleUpdateElementSize(2)}
                                className={`p-2 border rounded-xl text-center text-xs ${selectedElement.cols === 2
                                        ? "border-purple-500 bg-purple-50 text-purple-700"
                                        : "border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                2/4
                            </button>
                            <button
                                type="button"
                                onClick={() => handleUpdateElementSize(3)}
                                className={`p-2 border rounded-xl text-center text-xs ${selectedElement.cols === 3
                                        ? "border-purple-500 bg-purple-50 text-purple-700"
                                        : "border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                3/4
                            </button>
                            <button
                                type="button"
                                onClick={() => handleUpdateElementSize(4)}
                                className={`p-2 border rounded-xl text-center text-xs ${selectedElement.cols === 4
                                        ? "border-purple-500 bg-purple-50 text-purple-700"
                                        : "border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                4/4
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Alineación</label>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={() => handleUpdateSelectedElement("align", "left")}
                                className={`flex-1 py-2 border rounded-xl flex items-center justify-center ${selectedElement.align === "left"
                                        ? "border-purple-500 bg-purple-50 text-purple-700"
                                        : "border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                <AlignLeft size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleUpdateSelectedElement("align", "center")}
                                className={`flex-1 py-2 border rounded-xl flex items-center justify-center ${selectedElement.align === "center"
                                        ? "border-purple-500 bg-purple-50 text-purple-700"
                                        : "border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                <AlignCenter size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleUpdateSelectedElement("align", "right")}
                                className={`flex-1 py-2 border rounded-xl flex items-center justify-center ${selectedElement.align === "right"
                                        ? "border-purple-500 bg-purple-50 text-purple-700"
                                        : "border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                <AlignRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Color de fondo</label>
                            <div className="grid grid-cols-8 gap-1">
                                {["#ffffff", "#f8f9fa", "#e9ecef", "#dee2e6", "#ced4da", "#C40180", "#590248", "#a00167"].map(
                                    (color) => (
                                        <div
                                            key={color}
                                            className={`w-6 h-6 rounded-sm cursor-pointer border ${selectedElement.backgroundColor === color ? "border-purple-500 ring-2 ring-purple-200" : "border-gray-200"}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => handleUpdateSelectedElement("backgroundColor", color)}
                                        ></div>
                                    ),
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Color de texto</label>
                            <div className="grid grid-cols-8 gap-1">
                                {["#000000", "#212529", "#495057", "#6c757d", "#adb5bd", "#ffffff", "#C40180", "#590248"].map(
                                    (color) => (
                                        <div
                                            key={color}
                                            className={`w-6 h-6 rounded-sm cursor-pointer border ${selectedElement.textColor === color ? "border-purple-500 ring-2 ring-purple-200" : "border-gray-200"}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => handleUpdateSelectedElement("textColor", color)}
                                        ></div>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
            {/* Contenido del panel */}
            {renderPanel()}
        </div>
    )
}

export default ElementToolbar
