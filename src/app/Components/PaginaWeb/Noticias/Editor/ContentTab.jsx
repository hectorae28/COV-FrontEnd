"use client"

import { motion } from "framer-motion"
import { Pencil } from "lucide-react"
import { useState } from "react"
import ElementEditor from "../element-editor"
import ContentElementButtons from "./ContentElementButtons"
import ContentStructure from "./ContentStructure"
import NewElementForm from "./NewElementForm"

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
    setContentElements,
}) => {
    const [showElementForm, setShowElementForm] = useState(false)
    const [elementInPreparation, setElementInPreparation] = useState(null)

    // Preparar nuevo elemento
    const handlePrepareElement = (type) => {
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
                newElement.sourceType = "local"
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
            case "heading2":
            case "heading3":
            case "paragraph":
            default:
                newElement.content = ""
        }

        setElementInPreparation(newElement)
        setShowElementForm(true)
    }

    // Añadir elemento preparado - AQUÍ ESTÁ LA CORRECCIÓN
    const addPreparedElement = () => {
        if (!elementInPreparation) return

        // Pasar el elemento completo
        prepareContentElement(elementInPreparation)

        setShowElementForm(false)
        setElementInPreparation(null)
    }

    // Cancelar adición
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

    return (
        <div className="space-y-6">
            {/* Botones para preparar nuevos elementos de contenido */}
            <ContentElementButtons prepareContentElement={handlePrepareElement} />

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

export default ContentTab