"use client"
import { useState } from "react"

const ColorPicker = ({ color, onChange }) => {
    const [isOpen, setIsOpen] = useState(false)

    // Colores predefinidos
    const presetColors = [
        "#ffffff",
        "#f8f9fa",
        "#e9ecef",
        "#dee2e6",
        "#ced4da",
        "#adb5bd",
        "#6c757d",
        "#495057",
        "#343a40",
        "#212529",
        "#f8d7da",
        "#f1aeb5",
        "#ea868f",
        "#dc3545",
        "#b02a37",
        "#d1e7dd",
        "#a3cfbb",
        "#75c294",
        "#198754",
        "#0f5132",
        "#cff4fc",
        "#9eeaf9",
        "#6edff6",
        "#0dcaf0",
        "#087990",
        "#fff3cd",
        "#ffe69c",
        "#ffda6a",
        "#ffc107",
        "#997404",
        "#e0cffc",
        "#c29ffa",
        "#a370f7",
        "#6f42c1",
        "#432874",
        "#C40180",
        "#590248",
        "#a00167",
        "#7a0150",
        "#3d0028",
    ]

    return (
        <div className="relative">
            <div className="flex">
                <div
                    className="w-10 h-10 border border-gray-300 rounded-l-md cursor-pointer"
                    style={{ backgroundColor: color }}
                    onClick={() => setIsOpen(!isOpen)}
                ></div>
                <input
                    type="text"
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-sm focus:outline-none"
                />
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 p-2 bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="grid grid-cols-8 gap-1">
                        {presetColors.map((presetColor, index) => (
                            <div
                                key={index}
                                className="w-6 h-6 rounded-sm cursor-pointer border border-gray-200"
                                style={{ backgroundColor: presetColor }}
                                onClick={() => {
                                    onChange(presetColor)
                                    setIsOpen(false)
                                }}
                            ></div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ColorPicker
