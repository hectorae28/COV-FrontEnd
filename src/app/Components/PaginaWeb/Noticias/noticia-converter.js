// Función auxiliar para parsear el contenido JSON (sin cambios)
export const parseContentJSON = (contentString) => {
  try {
    // Intentar parsear el JSON
    return JSON.parse(contentString)
  } catch (error) {
    console.error("Error al parsear el contenido JSON:", error)
    // Si hay un error, devolver un array con un solo elemento de párrafo con el contenido
    return [
      {
        id: `p-fallback-${Date.now()}`,
        type: "paragraph",
        content: contentString || "No hay contenido disponible",
        style: {
          textAlign: "left",
          width: "100%",
          color: "#4b5563",
        },
        rowData: {
          row: 0,
          gridPosition: 0,
        },
      },
    ]
  }
}

// Función para extrair descripción breve (sin cambios)
export const extractBriefDescription = (contentElements) => {
  if (!contentElements || contentElements.length === 0) return ""

  // Concatenar todo el contenido de texto en este orden:
  // 1. Encabezados (títulos principales primero)
  // 2. Párrafos
  // 3. Citas
  // 4. Otros elementos de texto
  let fullText = ""

  // Función para añadir contenido de texto al texto completo
  const addTextContent = (element) => {
    if (typeof element.content === "string") {
      fullText += element.content + " "
    } else if (Array.isArray(element.content)) {
      element.content.forEach(item => {
        if (typeof item === "string") {
          fullText += item + " "
        }
      })
    }
  }

  // 1. Primero obtener encabezados
  const headings = contentElements.filter(el =>
    ["heading1", "heading2", "heading3"].includes(el.type)
  ).sort((a, b) => {
    // Ordenar por importancia (heading1 > heading2 > heading3)
    const order = { heading1: 1, heading2: 2, heading3: 3 }
    return order[a.type] - order[b.type]
  })

  headings.forEach(addTextContent)

  // 2. Luego obtener párrafos
  const paragraphs = contentElements.filter(el => el.type === "paragraph")
  paragraphs.forEach(addTextContent)

  // 3. Obtener citas
  const quotes = contentElements.filter(el => el.type === "quote")
  quotes.forEach(addTextContent)

  // 4. Otros elementos de texto (listas, etc.)
  const otherTextElements = contentElements.filter(el =>
    !["heading1", "heading2", "heading3", "paragraph", "quote", "image", "video"].includes(el.type)
  )
  otherTextElements.forEach(addTextContent)

  // Tomar los primeros 50 caracteres
  const first50Chars = fullText.trim().substring(0, 50)

  // Asegurarse de que termine con puntos suspensivos si hay contenido y se truncó
  if (first50Chars.length > 0 && fullText.length > 50) {
    return first50Chars + "..."
  }

  return first50Chars
}

// Función actualizada para convertir el formato nuevo al formato que usa la aplicación
export const convertToAppFormat = (noticiaData) => {
  // Si ya tiene el formato de la aplicación, devolverlo tal cual con validación de tags
  if (noticiaData.title && noticiaData.description) {
    // Si ya tiene el formato de la aplicación pero no tiene tags, agregarlo
    if (!noticiaData.tags) {
      // Si tiene categoría, usarla como única etiqueta
      if (noticiaData.category) {
        noticiaData.tags = [noticiaData.category];
      } else {
        noticiaData.tags = [];
      }
    }
    return noticiaData;
  }

  // Procesar etiquetas - pueden venir como array o como string
  let tags = [];
  if (noticiaData.tags) {
    // Si ya es un array, usarlo directamente
    if (Array.isArray(noticiaData.tags)) {
      tags = noticiaData.tags;
    }
    // Si es un string, verificar si tiene formato de lista
    else if (typeof noticiaData.tags === 'string') {
      // Verificar si es un string con formato de lista (ej: "tag1,tag2,tag3")
      if (noticiaData.tags.includes(',')) {
        tags = noticiaData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      } else {
        tags = [noticiaData.tags];
      }
    }
  }
  // Si no tiene tags pero tiene categoría, usar la categoría como etiqueta única
  else if (noticiaData.category) {
    tags = [noticiaData.category];
  }

  // Convertir del formato nuevo al formato de la aplicación
  const appFormat = {
    id: noticiaData.id || Date.now(),
    date: noticiaData.date || new Date().toLocaleDateString(),
    time: noticiaData.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    title: noticiaData.titulo || "Sin título",
    description: noticiaData.description || "Sin descripción",
    imageUrl: noticiaData.imagen_portada_url || "/assets/placeholder-image.jpg",
    videoUrl: noticiaData.videoUrl || null,
    // Mantener compatibilidad con el sistema anterior
    category: noticiaData.category || "",
    // Agregar soporte para etiquetas múltiples
    tags: tags,
    destacado: noticiaData.destacado || false,
    portada_tipo: noticiaData.portada_tipo || "image",
    portada_source: noticiaData.portada_source || "local",
  }

  // Procesar el contenido si existe
  if (noticiaData.contenido) {
    // Intentar parsear el contenido como JSON
    const contentElements = parseContentJSON(noticiaData.contenido)

    // Añadir los elementos de contenido al formato de la aplicación
    appFormat.contentElements = contentElements

    // Extraer una descripción del primer párrafo si no hay descripción
    if (!appFormat.description || appFormat.description === "Sin descripción") {
      appFormat.description = extractBriefDescription(contentElements)
    }
  }

  return appFormat
}