"use client"
import { useEffect, useState } from "react"

const LivePreview = ({ formData, gridBackground }) => {
  const [html, setHtml] = useState("")

  // Generar HTML a partir de los elementos del layout
  useEffect(() => {
    if (!formData.layoutElements || formData.layoutElements.length === 0) {
      setHtml('<div class="text-center p-8 text-gray-500">No hay elementos para mostrar</div>')
      return
    }

    // Agrupar elementos por filas
    const rows = {}
    formData.layoutElements.forEach((elem) => {
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

    // Generar HTML
    let generatedHtml = ""

    sortedRows.forEach((rowKey) => {
      // Iniciar fila con flexbox explícito para mantener elementos en la misma línea
      generatedHtml += `<div class="flex flex-wrap gap-4 mb-6" style="display: flex; flex-wrap: wrap; background-color: ${rows[rowKey][0]?.rowBackground || "transparent"}">`

      // Procesar elementos en la fila
      rows[rowKey].forEach((element) => {
        // Determinar el ancho según las columnas que ocupa con porcentajes explícitos
        let widthPercent = "100%"
        if (element.cols === 1)
          widthPercent = "23%" // 1/4
        else if (element.cols === 2)
          widthPercent = "48%" // 2/4
        else if (element.cols === 3)
          widthPercent = "72%" // 3/4
        else if (element.cols === 4) widthPercent = "100%" // 4/4

        // Determinar la alineación del contenido
        const alignClass =
          element.align === "center" ? "text-center" : element.align === "right" ? "text-right" : "text-left"

        // Estilos personalizados con bordes redondeados para consistencia visual
        const customStyles = `
                    width: ${widthPercent};
                    margin-bottom: 1rem;
                    background-color: ${element.backgroundColor || "transparent"};
                    color: ${element.textColor || "inherit"};
                    ${element.fontSize ? `font-size: ${element.fontSize};` : ""}
                    border-radius: 0.5rem;
                    overflow: hidden;
                    padding: 0.25rem;
                `

        // Iniciar el contenedor del elemento
        generatedHtml += `<div class="${alignClass}" style="${customStyles}">`

        // Agregar el contenido según el tipo
        switch (element.type) {
          case "paragraph":
            generatedHtml += `<p style="margin-bottom: 1rem; line-height: 1.5; padding: 0.5rem;">${element.content || ""}</p>`
            break

          case "heading":
            const headingSize =
              element.fontSize || (element.headingLevel === 1 ? "24px" : element.headingLevel === 2 ? "20px" : "16px")

            generatedHtml += `
                            <div style="margin: 1rem 0; font-weight: bold; font-size: ${headingSize}; padding: 0.5rem;">
                                ${element.content || ""}
                            </div>
                        `
            break

          case "image":
            generatedHtml += `
                        <div style="margin: 1rem 0; border-radius: 0.5rem; overflow: hidden;">
                            <img src="${element.content || ""}" alt="Imagen" style="max-width: 100%; border-radius: 0.5rem;" />
                        </div>
                    `
            break

          case "video":
            generatedHtml += `
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
              const listItems = element.items.map((item) => `<li style="margin-bottom: 0.5rem;">${item}</li>`).join("")
              if (element.listType === "ordered") {
                generatedHtml += `<ol style="margin: 1rem 0; padding: 0.5rem 0.5rem 0.5rem 2rem; border-radius: 0.5rem;">${listItems}</ol>`
              } else {
                generatedHtml += `<ul style="margin: 1rem 0; padding: 0.5rem 0.5rem 0.5rem 2rem; list-style-type: disc; border-radius: 0.5rem;">${listItems}</ul>`
              }
            }
            break

          case "quote":
            generatedHtml += `
                        <blockquote style="margin: 1rem 0; padding: 0.5rem 0.5rem 0.5rem 1rem; border-left: 4px solid #e2e8f0; font-style: italic; border-radius: 0.5rem;">
                            <p>${element.content || ""}</p>
                            ${element.author ? `<footer style="margin-top: 0.5rem; font-size: 0.875rem; color: #6b7280;">— ${element.author}</footer>` : ""}
                        </blockquote>
                    `
            break

          case "comment":
            generatedHtml += `
                        <div style="margin: 1rem 0; padding: 1rem; background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 0.5rem;">
                            <p>${element.content || ""}</p>
                        </div>
                    `
            break

          default:
            generatedHtml += element.content || ""
        }

        // Cerrar el contenedor del elemento
        generatedHtml += `</div>`
      })

      // Cerrar la fila
      generatedHtml += `</div>`
    })

    setHtml(generatedHtml)
  }, [formData.layoutElements, gridBackground])

  return (
    <div
      className="border border-gray-200 rounded-lg p-6 min-h-[500px] overflow-auto"
      style={{ backgroundColor: gridBackground }}
    >
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export default LivePreview
