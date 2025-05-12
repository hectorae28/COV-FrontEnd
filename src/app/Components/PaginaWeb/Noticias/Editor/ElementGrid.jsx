"use client"

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Trash2 } from "lucide-react"
import ElementPreview from "./ElementPreview"

const ElementGrid = ({
  elements,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  gridBackground,
}) => {
  // Agrupar elementos por filas
  const rows = {}
  elements.forEach((elem) => {
    if (!rows[elem.row]) {
      rows[elem.row] = []
    }
    rows[elem.row].push(elem)
  })

  // Ordenar filas y elementos dentro de cada fila
  const sortedRows = Object.keys(rows).sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
  sortedRows.forEach((rowKey) => {
    rows[rowKey].sort((a, b) => a.order - b.order)
  })

  // Mover elemento en la cuadrícula
  const handleMoveElement = (index, direction) => {
    const element = elements[index]
    const updatedElement = { ...element }

    // Calcular nueva posición basada en la dirección
    switch (direction) {
      case "up":
        if (element.row > 1) {
          updatedElement.row = element.row - 1
        }
        break
      case "down":
        updatedElement.row = element.row + 1
        break
      case "left":
        // Si hay otros elementos en la fila, mover el orden
        const elementsInSameRow = elements.filter((e) => e.row === element.row)
        if (elementsInSameRow.length > 1) {
          // Múltiples elementos en la fila - intercambiar posiciones
          if (element.order > 1) {
            updatedElement.order = element.order - 1

            // Encontrar el elemento que está a la izquierda y moverlo a la derecha
            const leftElement = elements.find((e) => e.row === element.row && e.order === element.order - 1)
            if (leftElement) {
              const leftElementIndex = elements.findIndex((e) => e.id === leftElement.id)
              if (leftElementIndex !== -1) {
                const updatedLeftElement = { ...leftElement, order: leftElement.order + 1 }
                onUpdateElement(updatedLeftElement)
              }
            }
          }
        } else {
          // Solo un elemento en la fila - mover a la izquierda en la cuadrícula
          // Implementamos una "posición virtual" usando el campo order
          // Asumimos que la cuadrícula tiene 4 columnas (0-3)
          if (updatedElement.order > 0) {
            updatedElement.order = Math.max(0, updatedElement.order - 1)
          }
        }
        break
      case "right":
        // Si hay otros elementos en la fila, intercambiar posiciones
        const elementsInRow = elements.filter((e) => e.row === element.row)
        if (elementsInRow.length > 1) {
          // Múltiples elementos en la fila - intercambiar posiciones
          updatedElement.order = element.order + 1

          // Encontrar el elemento que está a la derecha y moverlo a la izquierda
          const rightElement = elements.find((e) => e.row === element.row && e.order === element.order + 1)
          if (rightElement) {
            const rightElementIndex = elements.findIndex((e) => e.id === rightElement.id)
            if (rightElementIndex !== -1) {
              const updatedRightElement = { ...rightElement, order: rightElement.order - 1 }
              onUpdateElement(updatedRightElement)
            }
          }
        } else {
          // Solo un elemento en la fila - mover a la derecha en la cuadrícula
          // La posición máxima depende del tamaño del elemento y del ancho de la cuadrícula
          const maxPosition = Math.max(0, 4 - updatedElement.cols)
          updatedElement.order = Math.min(maxPosition, updatedElement.order + 1)
        }
        break
    }

    // Actualizar elemento
    onUpdateElement(updatedElement)
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 min-h-[500px]" style={{ backgroundColor: gridBackground }}>
      {sortedRows.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-center">No hay elementos. Añade elementos desde el panel derecho.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedRows.map((rowKey) => (
            <div key={`row-${rowKey}`} className="border-b border-dashed border-gray-200 pb-4 mb-4 last:border-b-0">
              <div className="text-xs text-gray-500 mb-2">Fila {rowKey}</div>
              <div className="grid grid-cols-4 gap-2">
                {rows[rowKey].map((element, elementIndex) => {
                  // Calcular el índice global del elemento
                  const globalIndex = elements.findIndex((e) => e.id === element.id)

                  // Calcular cuántas columnas ocupa (de 4 columnas totales)
                  let colSpan = 4
                  if (element.cols === 1)
                    colSpan = 1 // 1/4
                  else if (element.cols === 2)
                    colSpan = 2 // 2/4
                  else if (element.cols === 3) colSpan = 3 // 3/4

                  return (
                    <div
                      key={`element-${element.id}-${globalIndex}`}
                      className={`${colSpan === 1 ? "col-span-1" : colSpan === 2 ? "col-span-2" : colSpan === 3 ? "col-span-3" : "col-span-4"} relative border ${
                        selectedElement === globalIndex ? "border-purple-500 ring-2 ring-purple-200" : "border-gray-200"
                      } rounded-xl p-2 bg-white hover:border-purple-300 transition-colors cursor-pointer`}
                      onClick={() => {
                        // Usar el callback para actualizar el elemento seleccionado
                        onSelectElement(globalIndex)
                        // Solo actualizamos si el elemento existe
                        if (elements && elements[globalIndex]) {
                          // Actualizar en tiempo real si hay cambios de estilo
                          onUpdateElement(elements[globalIndex])
                        }
                      }}
                    >
                      <ElementPreview element={element} />

                      {selectedElement === globalIndex && (
                        <div className="absolute -top-3 -right-3 flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteElement(globalIndex)
                            }}
                            className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}

                      {selectedElement === globalIndex && (
                        <div className="absolute flex space-x-1 left-1/2 transform -translate-x-1/2 -bottom-4 bg-white border border-gray-200 rounded-full shadow-md p-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMoveElement(globalIndex, "left")
                            }}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 hover:text-purple-600 rounded-full"
                            title="Mover a la izquierda"
                          >
                            <ArrowLeft size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMoveElement(globalIndex, "up")
                            }}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 hover:text-purple-600 rounded-full"
                            title="Mover arriba"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMoveElement(globalIndex, "down")
                            }}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 hover:text-purple-600 rounded-full"
                            title="Mover abajo"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMoveElement(globalIndex, "right")
                            }}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 hover:text-purple-600 rounded-full"
                            title="Mover a la derecha"
                          >
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default ElementGrid
