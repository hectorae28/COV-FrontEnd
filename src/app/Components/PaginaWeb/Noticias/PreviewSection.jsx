"use client"
import { Eye } from "lucide-react"
import { useEffect, useState } from "react"
import CardPreview from "./CardPreview"
import FullPreview from "./FullPreview"

const PreviewSection = ({ news }) => {
    const [showFullPreview, setShowFullPreview] = useState(false)
    const [previewHtml, setPreviewHtml] = useState("")

    // Generar HTML para la vista previa en tiempo real
    useEffect(() => {
        if (!news.layoutElements || news.layoutElements.length === 0) return

        // Generar HTML a partir de los elementos del layout
        const html = generateHtmlFromLayoutElements(news.layoutElements)
        setPreviewHtml(html)
    }, [news.layoutElements])

    // Función para generar HTML a partir de los elementos del layout
    const generateHtmlFromLayoutElements = (elements) => {
        if (!elements || elements.length === 0) return ""

        let html = ""

        // Agrupar por filas
        const rows = {}
        elements.forEach((elem) => {
            if (!rows[elem.row]) {
                rows[elem.row] = []
            }
            rows[elem.row].push(elem)
        })

        // Procesar cada fila
        Object.keys(rows)
            .sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
            .forEach((rowKey) => {
                const rowElements = rows[rowKey]

                // Iniciamos la fila con flexbox explícito (importante para mantener elementos en línea)
                html += `<div style="display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; width: 100%;">`

                // Procesar cada elemento en la fila
                rowElements
                    .sort((a, b) => a.order - b.order)
                    .forEach((element) => {
                        // Determinar el ancho según las columnas que ocupa
                        let widthPercent = "100%";
                        if (element.cols === 1) widthPercent = "23%"; // 1/4
                        else if (element.cols === 2) widthPercent = "48%"; // 2/4
                        else if (element.cols === 3) widthPercent = "72%"; // 3/4

                        // Calcular margen izquierdo para elementos solitarios
                        let marginLeftStyle = '';
                        if (rowElements.length === 1 && element.order > 0) {
                          const marginPercent = element.order === 1 ? '25%' : 
                                               element.order === 2 ? '50%' : 
                                               element.order === 3 ? '75%' : '0%';
                          marginLeftStyle = `margin-left: ${marginPercent};`;
                        }

                        // Determinar la alineación del contenido
                        const alignStyle = 
                            element.align === "center" ? "text-align: center;" :
                            element.align === "right" ? "text-align: right;" : "text-align: left;"

                        // Estilos personalizados con bordes redondeados para todos los elementos
                        const customStyles = `
                            width: ${widthPercent};
                            ${marginLeftStyle}
                            margin-bottom: 1rem;
                            background-color: ${element.backgroundColor || "transparent"};
                            color: ${element.textColor || "inherit"};
                            ${element.fontSize ? `font-size: ${element.fontSize};` : ""}
                            border-radius: 0.5rem;
                            overflow: hidden;
                            ${alignStyle}
                        `

                        // Iniciamos el contenedor del elemento
                        html += `<div style="${customStyles}">`

                        // Agregar el contenido según el tipo
                        switch (element.type) {
                            case "paragraph":
                                html += `<p style="margin-bottom: 1rem; line-height: 1.5; padding: 0.5rem;">${element.content || ""}</p>`
                                break

                            case "heading":
                                const headingSize =
                                    element.fontSize ||
                                    (element.headingLevel === 1 ? "24px" : element.headingLevel === 2 ? "20px" : "16px")

                                html += `
                                    <div style="margin: 1rem 0; font-weight: bold; font-size: ${headingSize}; padding: 0.5rem;">
                                        ${element.content || ""}
                                    </div>
                                `
                                break

                            case "image":
                                html += `
                                    <div style="margin: 1rem 0; border-radius: 0.5rem; overflow: hidden;">
                                        <img src="${element.content || ""}" alt="Imagen" style="max-width: 100%; border-radius: 0.5rem;" />
                                    </div>
                                `
                                break

                            case "video":
                                html += `
                                    <div style="margin: 1rem 0; border-radius: 0.5rem; overflow: hidden;">
                                        <iframe 
                                            width="100%"
                                            height="315"
                                            src="${element.content || ""}"
                                            frameborder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowfullscreen
                                            style="border-radius: 0.5rem;"
                                        ></iframe>
                                    </div>
                                `
                                break

                            case "list":
                                if (element.items && element.items.length > 0) {
                                    const listItems = element.items
                                        .map((item) => `<li style="margin-bottom: 0.5rem;">${item}</li>`)
                                        .join("")
                                    if (element.listType === "ordered") {
                                        html += `<ol style="margin: 1rem 0; padding: 0.5rem 0.5rem 0.5rem 2rem; border-radius: 0.5rem;">${listItems}</ol>`
                                    } else {
                                        html += `<ul style="margin: 1rem 0; padding: 0.5rem 0.5rem 0.5rem 2rem; list-style-type: disc; border-radius: 0.5rem;">${listItems}</ul>`
                                    }
                                }
                                break

                            case "quote":
                                html += `
                                    <blockquote style="margin: 1rem 0; padding: 0.5rem 0.5rem 0.5rem 1rem; border-left: 4px solid #e2e8f0; font-style: italic; border-radius: 0.5rem;">
                                        <p>${element.content || ""}</p>
                                        ${element.author ? `<footer style="margin-top: 0.5rem; font-size: 0.875rem; color: #6b7280;">— ${element.author}</footer>` : ""}
                                    </blockquote>
                                `
                                break

                            case "comment":
                                html += `
                                    <div style="margin: 1rem 0; padding: 1rem; background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 0.5rem;">
                                        <p>${element.content || ""}</p>
                                    </div>
                                `
                                break

                            default:
                                html += element.content || ""
                        }

                        // Cerramos el contenedor del elemento
                        html += `</div>`
                    })

                // Cerramos la fila
                html += `</div>`
            })

        return html
    }

    // Renderizar la vista previa
    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Vista Previa</h2>

            <div className="mb-4">
                <button
                    onClick={() => setShowFullPreview(true)}
                    className="w-full flex items-center justify-center text-[#C40180] text-xs font-medium py-1.5 bg-[#FCE7F3] rounded-xl mb-3 hover:bg-[#FBCFE8] transition-colors"
                >
                    <Eye className="w-3 h-3 mr-1" />
                    Vista detallada a pantalla completa
                </button>
            </div>

            {/* Vista previa de la tarjeta */}
            <CardPreview news={news} />

            {/* Vista previa en pantalla completa */}
            {showFullPreview && (
                <FullPreview
                    news={{
                        ...news,
                        fullContent: previewHtml || news.fullContent,
                    }}
                    onClose={() => setShowFullPreview(false)}
                />
            )}
        </div>
    )
}

export default PreviewSection