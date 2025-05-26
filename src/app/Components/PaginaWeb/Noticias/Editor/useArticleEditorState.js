"use client"

import { useEffect, useState } from "react"
import { extractBriefDescription } from "../noticia-converter"
import { organizeElementsIntoRows } from "../utils"

export const useArticleEditorState = (article, onSave, handleInputChangeFromProps) => {
    // Inicializar editedArticle con tags ya configurados para evitar actualizaciones en ciclo
    const initialArticle = {
        ...article,
        tags: Array.isArray(article.tags) ? article.tags :
            (article.category ? [article.category] : [])
    }

    const [editedArticle, setEditedArticle] = useState(initialArticle)
    const [activeElement, setActiveElement] = useState(null)
    const [activeTab, setActiveTab] = useState("general")
    const [contentElements, setContentElements] = useState([])
    const [elementRows, setElementRows] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)
    const [mediaType, setMediaType] = useState("image")
    const [mediaSource, setMediaSource] = useState("local")
    const [historyStack, setHistoryStack] = useState([])
    const [elementInPreparation, setElementInPreparation] = useState(null)

    // Actualizar el editedArticle cuando cambia el artículo de entrada
    // Pero solo para cambios reales, no para inicialización de tags
    useEffect(() => {
        // Comprobar si hay cambios significativos para evitar ciclos
        if (article.id !== editedArticle.id ||
            article.title !== editedArticle.title ||
            article.description !== editedArticle.description) {

            setEditedArticle({
                ...article,
                tags: Array.isArray(article.tags) ? article.tags :
                    (article.category ? [article.category] : [])
            })
        }
    }, [article, editedArticle.id, editedArticle.title, editedArticle.description])

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
        handleInputChangeFromProps ||
        ((e) => {
            const { name, value } = e.target
            setEditedArticle({
                ...editedArticle,
                [name]: value,
            })
        })

    // Inicializar elementos de contenido
    useEffect(() => {
        // Evitar la reinicialización si ya existen elementos
        if (contentElements.length > 0) return;

        if (!article.contentElements) {
            const initialElements = []
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
    }, [article, contentElements.length])

    // Organizar elementos en filas
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

    // Preparar nuevo elemento de contenido
    const prepareContentElement = (typeOrElement) => {
        let newElement;

        // Si se pasa un elemento completo, usarlo
        if (typeof typeOrElement === 'object' && typeOrElement.type) {
            newElement = {
                ...typeOrElement,
                id: typeOrElement.id || `element-${Date.now()}`,
                rowData: typeOrElement.rowData || {
                    row: elementRows.length > 0 ? elementRows.length : 0,
                    gridPosition: 0,
                }
            }
        }
        // Si se pasa solo el tipo, crear el elemento desde cero
        else {
            const type = typeOrElement;
            newElement = {
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
                    newElement.sourceType = "local"
                    break
                case "quote":
                    newElement.author = ""
                    break
                case "list":
                case "orderedList":
                    newElement.content = ["", ""]
                    break
            }
        }

        // Añadir el elemento a la lista
        setContentElements(prev => [...prev, newElement])
        setActiveElement(newElement.id)

        return newElement
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

    // Función para guardar artículo
    const handleSave = () => {
        // Asegurar que tengamos una descripción breve
        if (!editedArticle.description || editedArticle.description.trim() === "") {
            const briefDescription = extractBriefDescription(contentElements)
            if (briefDescription) {
                setEditedArticle(prev => ({
                    ...prev,
                    description: briefDescription
                }))
            }
        }

        // Convertir los elementos de contenido a JSON
        const contentJson = JSON.stringify(contentElements, null, 2)

        // Determinar la URL de la imagen o video para imagen_portada_url
        let portadaUrl = editedArticle.imageUrl || ""

        if (mediaType === "video") {
            portadaUrl = editedArticle.videoUrl || ""
        }

        // Asegurar compatibilidad con el formato antiguo (category)
        // Tomamos la primera categoría como category para mantener compatibilidad
        const primaryCategory = Array.isArray(editedArticle.tags) && editedArticle.tags.length > 0
            ? editedArticle.tags[0]
            : editedArticle.category || ""

        // Crear el objeto de datos formateado
        const articleData = {
            imagen_portada: selectedFile, // El archivo de imagen
            portada_tipo: mediaType, // "image" o "video"
            portada_source: mediaSource, // "local" o "url"
            titulo: editedArticle.title || editedArticle.titulo,
            destacado: true,
            contenido: contentJson,
            description: editedArticle.description,
            imagen_portada_url: mediaType === "image" ? portadaUrl : null,
            videoUrl: mediaType === "video" ? portadaUrl : null,
            tags: editedArticle.tags || [], // Asegurar que enviamos el array de tags
            category: primaryCategory, // Mantener compatibilidad con sistemas antiguos
            ...editedArticle,
            contentElements
        }

        onSave(articleData)
    }

    return {
        editedArticle,
        activeElement,
        activeTab,
        contentElements,
        elementRows,
        selectedFile,
        mediaType,
        mediaSource,
        historyStack,
        elementInPreparation,

        setEditedArticle,
        setActiveElement,
        setActiveTab,
        setContentElements,
        setSelectedFile,
        setMediaType,
        setMediaSource,
        setElementInPreparation,

        handleArticleInputChange,
        saveToHistory,
        undoLastChange,
        handleElementUpdate,
        prepareContentElement,
        removeContentElement,
        moveElement,
        moveElementInGrid,
        moveElementToRow,
        changeElementWidth,
        handleSave
    }
}