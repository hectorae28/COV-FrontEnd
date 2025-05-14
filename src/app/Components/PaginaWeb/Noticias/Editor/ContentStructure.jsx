"use client"

import ContentElementItem from "./ContentElementItem"

const ContentStructure = ({
    elementRows,
    activeElement,
    setActiveElement,
    removeContentElement,
    moveElementHorizontally,
}) => {
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
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ContentStructure