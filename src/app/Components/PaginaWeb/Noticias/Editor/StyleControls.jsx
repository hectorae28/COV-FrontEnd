"use client"

import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Italic, Underline } from "lucide-react"

const StyleControls = ({ element, handleStyleChange, onChangeWidth }) => {
    if (!element) return null

    return (
        <div className="space-y-3">
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
                        onClick={() => onChangeWidth && onChangeWidth("25%")}
                        className={`cursor-pointer py-1 rounded-lg border text-xs ${element.style?.width === "25%" ? "bg-[#C40180] text-white border-[#C40180]" : "bg-white border-gray-200 hover:bg-gray-50"}`}
                    >
                        25%
                    </button>
                    <button
                        onClick={() => onChangeWidth && onChangeWidth("50%")}
                        className={`cursor-pointer py-1 rounded-lg border text-xs ${element.style?.width === "50%" ? "bg-[#C40180] text-white border-[#C40180]" : "bg-white border-gray-200 hover:bg-gray-50"}`}
                    >
                        50%
                    </button>
                    <button
                        onClick={() => onChangeWidth && onChangeWidth("75%")}
                        className={`cursor-pointer py-1 rounded-lg border text-xs ${element.style?.width === "75%" ? "bg-[#C40180] text-white border-[#C40180]" : "bg-white border-gray-200 hover:bg-gray-50"}`}
                    >
                        75%
                    </button>
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

export default StyleControls