"use client"

const ArticlePreview = ({ article, contentElements, elementRows, activeElement, onSelectElement }) => {
  // Si no hay filas o elementos, mostrar mensaje de vista previa vacía
  if (!elementRows || elementRows.length === 0 || !contentElements || contentElements.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-gray-500">Sin contenido. Añade elementos usando el panel de edición.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Renderizar cada fila de elementos */}
      {elementRows.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex flex-wrap mb-4 -mx-2">
          {/* Renderizar cada elemento en la fila */}
          {row.map((element) => (
            <div
              key={element.id}
              className={`relative transition-all duration-200 px-2 ${
                activeElement === element.id ? "ring-2 ring-[#C40180] rounded-xl bg-[#C40180]/5" : ""
              }`}
              style={{ width: element.style.width || "100%" }}
              onClick={() => onSelectElement && onSelectElement(element.id)}
            >
              <RenderElement element={element} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Componente para renderizar un elemento específico
const RenderElement = ({ element }) => {
  if (!element) return null

  switch (element.type) {
    case "paragraph":
      return (
        <p
          style={{
            textAlign: element.style.textAlign || "left",
            color: element.style.color || "#4b5563",
            fontWeight: element.style.fontWeight || "normal",
            fontStyle: element.style.fontStyle || "normal",
            textDecoration: element.style.textDecoration || "none",
          }}
          className="cursor-pointer my-4"
        >
          {element.content}
        </p>
      )

    case "heading1":
      return (
        <h1
          style={{
            textAlign: element.style.textAlign || "left",
            color: element.style.color || "#1f2937",
            fontWeight: element.style.fontWeight || "bold",
            fontStyle: element.style.fontStyle || "normal",
            textDecoration: element.style.textDecoration || "none",
          }}
          className="cursor-pointer text-3xl font-bold my-6"
        >
          {element.content}
        </h1>
      )

    case "heading2":
      return (
        <h2
          style={{
            textAlign: element.style.textAlign || "left",
            color: element.style.color || "#1f2937",
            fontWeight: element.style.fontWeight || "bold",
            fontStyle: element.style.fontStyle || "normal",
            textDecoration: element.style.textDecoration || "none",
          }}
          className="cursor-pointer text-2xl font-bold my-5"
        >
          {element.content}
        </h2>
      )

    case "heading3":
      return (
        <h3
          style={{
            textAlign: element.style.textAlign || "left",
            color: element.style.color || "#1f2937",
            fontWeight: element.style.fontWeight || "bold",
            fontStyle: element.style.fontStyle || "normal",
            textDecoration: element.style.textDecoration || "none",
          }}
          className="cursor-pointer text-xl font-semibold my-4"
        >
          {element.content}
        </h3>
      )

    case "image":
      return (
        <div className="cursor-pointer my-6 rounded-xl overflow-hidden">
          <img
            src={element.content || "/placeholder.svg"}
            alt={element.alt || "Imagen del artículo"}
            className="w-full h-auto"
            onError={(e) => {
              e.target.src = "/assets/placeholder-image.jpg"
            }}
          />
        </div>
      )

    case "quote":
      return (
        <blockquote
          style={{
            textAlign: element.style.textAlign || "left",
            color: element.style.color || "#4b5563",
          }}
          className="border-l-4 border-[#C40180] pl-4 my-6 italic"
        >
          <p
            style={{
              fontWeight: element.style.fontWeight || "normal",
              fontStyle: "italic",
              textDecoration: element.style.textDecoration || "none",
            }}
          >
            {element.content}
          </p>
          {element.author && <footer className="mt-2 text-sm">— {element.author}</footer>}
        </blockquote>
      )

    case "list":
      return (
        <ul
          style={{
            textAlign: element.style.textAlign || "left",
            color: element.style.color || "#4b5563",
          }}
          className="cursor-pointer list-disc pl-5 my-4 space-y-2"
        >
          {element.content.map((item, index) => (
            <li
              key={index}
              style={{
                fontWeight: element.style.fontWeight || "normal",
                fontStyle: element.style.fontStyle || "normal",
                textDecoration: element.style.textDecoration || "none",
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )

    case "orderedList":
      return (
        <ol
          style={{
            textAlign: element.style.textAlign || "left",
            color: element.style.color || "#4b5563",
          }}
          className="cursor-pointer list-decimal pl-5 my-4 space-y-2"
        >
          {element.content.map((item, index) => (
            <li
              key={index}
              style={{
                fontWeight: element.style.fontWeight || "normal",
                fontStyle: element.style.fontStyle || "normal",
                textDecoration: element.style.textDecoration || "none",
              }}
            >
              {item}
            </li>
          ))}
        </ol>
      )

    default:
      return null
  }
}

export default ArticlePreview