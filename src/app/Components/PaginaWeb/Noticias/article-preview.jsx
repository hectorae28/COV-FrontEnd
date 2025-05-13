"use client"
import { Film, Play } from "lucide-react"
import { useEffect, useState } from "react"

// Función para extraer el ID de un video de YouTube
const extractYoutubeVideoId = (url) => {
  if (!url) return null
  
  // Patrón para diferentes formatos de URL de YouTube
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  
  return (match && match[2].length === 11) ? match[2] : null
}

// Función para extraer el ID de un video de Vimeo
const extractVimeoVideoId = (url) => {
  if (!url) return null
  
  // Patrón para diferentes formatos de URL de Vimeo
  const regExp = /vimeo\.com\/(?:video\/)?([0-9]+)/
  const match = url.match(regExp)
  
  return match ? match[1] : null
}

// Modificación del componente EmbeddedVideo en article-preview.jsx

const EmbeddedVideo = ({ url }) => {
  const [videoType, setVideoType] = useState('unknown')
  const [videoId, setVideoId] = useState(null)
  
  useEffect(() => {
    if (!url) return;
    
    // Detectar el tipo de video y extraer su ID
    const youtubeId = extractYoutubeVideoId(url)
    const vimeoId = extractVimeoVideoId(url)
    
    if (youtubeId) {
      setVideoType('youtube')
      setVideoId(youtubeId)
    } else if (vimeoId) {
      setVideoType('vimeo')
      setVideoId(vimeoId)
    } else {
      setVideoType('generic')
    }
  }, [url])
  
  // Si no hay URL, mostrar un placeholder
  if (!url) {
    return (
      <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <Film className="h-8 w-8 text-gray-400" />
      </div>
    );
  }
  
  if (videoType === 'youtube' && videoId) {
    return (
      <div className="w-full aspect-video rounded-lg overflow-hidden">
        <iframe 
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-full"
          title="Video de YouTube"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }
  
  if (videoType === 'vimeo' && videoId) {
    return (
      <div className="w-full aspect-video rounded-lg overflow-hidden">
        <iframe 
          src={`https://player.vimeo.com/video/${videoId}`}
          className="w-full h-full"
          title="Video de Vimeo"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }
  
  // Vista genérica para otros tipos de video
  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
          <Play className="h-8 w-8 text-white fill-white" />
        </div>
        <p className="text-white text-sm max-w-lg mx-auto px-4">
          <span className="font-medium block mb-1">Vista previa no disponible</span>
          <span className="text-xs opacity-80 break-all">{url}</span>
        </p>
      </div>
    </div>
  )
}

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
      {elementRows.map((row, rowIndex) => {
        // Verificar si la fila está vacía
        if (!row || row.length === 0) return null;
        
        return (
          <div key={`row-${rowIndex}`} className="relative grid grid-cols-4 gap-2 mb-6">
            {/* Renderizar cada elemento en la fila según su posición en el grid */}
            {row.map((element) => {
              // Verificación defensiva para propiedades que pueden ser indefinidas
              if (!element) return null;
              
              const gridPosition = element.rowData?.gridPosition || 0;
              const width = parseInt(element.style?.width || "100%") / 25; // Ancho en unidades grid (1-4)
              
              // Calcular estilos de grid de manera segura
              let gridStyles = {};
              
              // Para elementos que ocupan toda la fila (100%)
              if (width === 4) {
                gridStyles = {
                  gridColumn: "1 / span 4" // De columna 1 a 5 (exclusivo)
                };
              } else {
                // Para elementos más pequeños, calcular inicio y fin
                const startColumn = gridPosition + 1; // +1 porque CSS grid empieza en 1
                const colSpan = width;
                gridStyles = {
                  gridColumn: `${startColumn} / span ${colSpan}`
                };
              }
              
              return (
                <div
                  key={element.id}
                  className={`relative transition-all duration-200 ${
                    activeElement === element.id ? "ring-2 ring-[#C40180] rounded-xl bg-[#C40180]/5" : ""
                  }`}
                  style={gridStyles}
                  onClick={() => onSelectElement && onSelectElement(element.id)}
                >
                  <RenderElement element={element} />
                </div>
              );
            })}
          </div>
        );
      })}
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
            textAlign: element.style?.textAlign || "left",
            color: element.style?.color || "#4b5563",
            fontWeight: element.style?.fontWeight || "normal",
            fontStyle: element.style?.fontStyle || "normal",
            textDecoration: element.style?.textDecoration || "none",
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
            textAlign: element.style?.textAlign || "left",
            color: element.style?.color || "#1f2937",
            fontWeight: element.style?.fontWeight || "bold",
            fontStyle: element.style?.fontStyle || "normal",
            textDecoration: element.style?.textDecoration || "none",
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
            textAlign: element.style?.textAlign || "left",
            color: element.style?.color || "#1f2937",
            fontWeight: element.style?.fontWeight || "bold",
            fontStyle: element.style?.fontStyle || "normal",
            textDecoration: element.style?.textDecoration || "none",
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
            textAlign: element.style?.textAlign || "left",
            color: element.style?.color || "#1f2937",
            fontWeight: element.style?.fontWeight || "bold",
            fontStyle: element.style?.fontStyle || "normal",
            textDecoration: element.style?.textDecoration || "none",
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
          {element.alt && <p className="text-sm text-gray-500 mt-1 italic">{element.alt}</p>}
        </div>
      )
    
    case "video":
      return (
        <div className="cursor-pointer my-6">
          {element.content ? (
            <EmbeddedVideo url={element.content} />
          ) : (
            <div className="aspect-video w-full bg-gray-100 flex items-center justify-center rounded-lg">
              <Film className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
      )

    case "quote":
      return (
        <blockquote
          style={{
            textAlign: element.style?.textAlign || "left",
            color: element.style?.color || "#4b5563",
          }}
          className="border-l-4 border-[#C40180] pl-4 my-6 italic"
        >
          <p
            style={{
              fontWeight: element.style?.fontWeight || "normal",
              fontStyle: "italic",
              textDecoration: element.style?.textDecoration || "none",
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
            textAlign: element.style?.textAlign || "left",
            color: element.style?.color || "#4b5563",
          }}
          className="cursor-pointer list-disc pl-5 my-4 space-y-2"
        >
          {element.content && Array.isArray(element.content) && element.content.map((item, index) => (
            <li
              key={index}
              style={{
                fontWeight: element.style?.fontWeight || "normal",
                fontStyle: element.style?.fontStyle || "normal",
                textDecoration: element.style?.textDecoration || "none",
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
            textAlign: element.style?.textAlign || "left",
            color: element.style?.color || "#4b5563",
          }}
          className="cursor-pointer list-decimal pl-5 my-4 space-y-2"
        >
          {element.content && Array.isArray(element.content) && element.content.map((item, index) => (
            <li
              key={index}
              style={{
                fontWeight: element.style?.fontWeight || "normal",
                fontStyle: element.style?.fontStyle || "normal",
                textDecoration: element.style?.textDecoration || "none",
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