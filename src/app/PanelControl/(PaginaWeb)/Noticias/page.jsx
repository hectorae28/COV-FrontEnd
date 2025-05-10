"use client"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  LayoutGrid,
  Plus
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Importar componentes del editor avanzado
import DeleteConfirmation from "@/app/Components/PaginaWeb/Noticias/DeleteConfirmation"
import FormEdit from "@/app/Components/PaginaWeb/Noticias/FormEdit"
import Notification from "@/app/Components/PaginaWeb/Noticias/Notification"
import PreviewSection from "@/app/Components/PaginaWeb/Noticias/PreviewSection"
import FullPreview from "@/app/Components/PaginaWeb/Noticias/FullPreview"
// Importar datos iniciales (provisional)
import newsItems from "@/app/Models/PanelControl/PaginaWeb/Inicio/NoticiasData"

const NoticiasDasboard = () => {
  const router = useRouter()
  const [news, setNews] = useState([])
  const [currentView, setCurrentView] = useState("list") // list, edit, create
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    date: new Date().toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    time: new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    imageUrl: "",
    description: "",
    category: "Actualización",
    fullContent: "",
    layoutElements: [],
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [newsToDelete, setNewsToDelete] = useState(null)
  const [notification, setNotification] = useState(null)
  const [previewItem, setPreviewItem] = useState(null)

  // Cargar datos de noticias
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Simulación de carga para mostrar progreso real
        setNews([]) // Inicialmente vacío
        await new Promise((resolve) => setTimeout(resolve, 500))
        // Asegurar que todas las noticias tengan una categoría válida
        const newsWithCategories = newsItems.map(item => ({
          ...item,
          category: item.category || "Actualización",
          // Aseguramos que haya contenido detallado para edición consistente
          fullContent: item.fullContent || item.description || "",
          layoutElements: item.layoutElements || []
        }))
        setNews(newsWithCategories)
      } catch (error) {
        console.error("Error al cargar noticias:", error)
        showNotification("Error al cargar las noticias", "error")
      }
    }

    fetchNews()
  }, [])

  // Mostrar notificación
  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
  }

  // Ocultar notificación
  const hideNotification = () => {
    setNotification(null)
  }

  // Manejar edición de noticia
  const handleEditNews = (item) => {
    setFormData({
      id: item.id,
      title: item.title || "",
      date: item.date || "",
      time: item.time || "",
      imageUrl: item.imageUrl || "",
      description: item.description || "",
      category: item.category || "Actualización",
      fullContent: item.fullContent || item.description || "",
      layoutElements: item.layoutElements || [],
    })
    setCurrentView("edit")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Manejar creación de nueva noticia
  const handleCreateNews = () => {
    setFormData({
      id: Date.now(), // ID temporal
      title: "",
      date: new Date().toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      imageUrl: "",
      description: "",
      category: "Actualización",
      fullContent: "",
      layoutElements: [],
    })
    setCurrentView("create")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Confirmar eliminación
  const handleDeleteConfirm = (id) => {
    setNewsToDelete(id)
    setShowDeleteConfirm(true)
  }

  // Procesar eliminación
  const handleDeleteNews = () => {
    setNews((prevNews) => prevNews.filter((item) => item.id !== newsToDelete))
    setShowDeleteConfirm(false)
    setNewsToDelete(null)
    showNotification("Noticia eliminada correctamente", "success")
  }

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
    setNewsToDelete(null)
  }

  // Mostrar vista previa de la noticia
  const handlePreviewNews = (item) => {
    setPreviewItem(item)
  }

  // Cerrar vista previa
  const handleClosePreview = () => {
    setPreviewItem(null)
  }

  // Validar formulario
  const validateForm = () => {
    if (!formData.title.trim()) {
      showNotification("El título es obligatorio", "error")
      return false
    }

    if (!formData.description.trim()) {
      showNotification("La descripción es obligatoria", "error")
      return false
    }

    if (!formData.category.trim()) {
      showNotification("La categoría es obligatoria", "error")
      return false
    }

    return true
  }

  // Guardar cambios
  const handleSaveNews = () => {
    if (!validateForm()) return

    setIsSaving(true)

    // Simular llamada a API con un pequeño retraso
    setTimeout(() => {
      // Procesamos el fullContent a partir de los elementos del layout
      const processedFormData = {
        ...formData,
        fullContent: generateHtmlFromLayoutElements(formData.layoutElements)
      }

      if (currentView === "create") {
        // Agregar nueva noticia
        setNews((prevNews) => [processedFormData, ...prevNews])
        showNotification("Noticia creada correctamente", "success")
      } else {
        // Actualizar noticia existente
        setNews((prevNews) => prevNews.map((item) => (item.id === processedFormData.id ? processedFormData : item)))
        showNotification("Noticia actualizada correctamente", "success")
      }

      setIsSaving(false)
      setCurrentView("list")
    }, 800)
  }

  // Generar HTML a partir de los elementos del layout
  const generateHtmlFromLayoutElements = (elements) => {
    if (!elements || elements.length === 0) return ''

    let html = '';

    // Agrupamos por filas
    const rows = {};
    elements.forEach(elem => {
      if (!rows[elem.row]) {
        rows[elem.row] = [];
      }
      rows[elem.row].push(elem);
    });

    // Procesamos cada fila
    Object.keys(rows).sort((a, b) => parseInt(a) - parseInt(b)).forEach(rowIndex => {
      const rowElements = rows[rowIndex];

      // Iniciamos la fila con flexbox explícito
      html += `<div class="flex flex-wrap gap-4 mb-6" style="display: flex; flex-wrap: wrap;">`;

      // Procesamos cada elemento en la fila
      rowElements.sort((a, b) => a.order - b.order).forEach(element => {
        // Determinamos el ancho según las columnas que ocupa
        const widthPercent = element.cols === 12 ? '100%' :
          element.cols === 6 ? '48%' :
            element.cols === 4 ? '31%' :
              element.cols === 3 ? '23%' : '100%';

        // Calculamos el margen izquierdo basado en la posición de orden para elementos solitarios
        // Esto permite posicionar un elemento solitario en diferentes columnas
        let marginLeftStyle = '';
        if (rowElements.length === 1 && element.order > 0) {
          // Si es un elemento solitario con order > 0, aplicamos margen para posicionarlo
          const marginPercent = element.order === 1 ? '25%' : 
                               element.order === 2 ? '50%' : 
                               element.order === 3 ? '75%' : '0%';
          marginLeftStyle = `margin-left: ${marginPercent};`;
        }

        // Determinamos la alineación del contenido
        const alignClass = element.align === 'center' ? 'text-center' :
          element.align === 'right' ? 'text-right' : 'text-left';

        // Iniciamos el contenedor del elemento con estilos explícitos
        html += `<div class="${alignClass}" style="width: ${widthPercent}; ${marginLeftStyle} margin-bottom: 1rem; border-radius: 0.5rem; overflow: hidden;">`;

        // Agregamos el contenido según el tipo
        switch (element.type) {
          case 'paragraph':
            html += `<p style="margin-bottom: 1rem; line-height: 1.5; padding: 0.5rem; background-color: ${element.backgroundColor || 'transparent'}; color: ${element.textColor || 'inherit'}; border-radius: 0.5rem;">${element.content || ''}</p>`;
            break;
          case 'image':
            html += `
              <div style="margin: 1rem 0; border-radius: 0.5rem; overflow: hidden;">
                <img src="${element.content || ''}" alt="Imagen" style="max-width: 100%; border-radius: 0.5rem;" />
              </div>
            `;
            break;
          case 'video':
            html += `
              <div style="margin: 1rem 0; border-radius: 0.5rem; overflow: hidden;">
                <iframe 
                    width="100%"
                    height="315"
                    src="${element.content || ''}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    style="border-radius: 0.5rem;"
                ></iframe>
              </div>
            `;
            break;
          case 'button':
            const btnAlign = element.buttonAlign === 'center' ? 'text-center' :
              element.buttonAlign === 'right' ? 'text-right' : 'text-left';

            html += `
              <div style="margin: 1rem 0;" class="${btnAlign}">
                <a href="${element.url || '#'}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style="display: inline-block; padding: 0.75rem 1.5rem; background-color: ${element.backgroundColor || '#C40180'}; color: ${element.textColor || '#FFFFFF'}; 
                        text-decoration: none; border-radius: 0.375rem; font-weight: 500;">
                  ${element.content || ''}
                </a>
              </div>
            `;
            break;
          case 'list':
            if (element.items && element.items.length > 0) {
              const listItems = element.items.map(item => `<li style="margin-bottom: 0.5rem;">${item}</li>`).join('');
              if (element.listType === 'ordered') {
                html += `<ol style="margin: 1rem 0; padding: 0.5rem 0.5rem 0.5rem 2rem; border-radius: 0.5rem; background-color: ${element.backgroundColor || 'transparent'}; color: ${element.textColor || 'inherit'};">${listItems}</ol>`;
              } else {
                html += `<ul style="margin: 1rem 0; padding: 0.5rem 0.5rem 0.5rem 2rem; list-style-type: disc; border-radius: 0.5rem; background-color: ${element.backgroundColor || 'transparent'}; color: ${element.textColor || 'inherit'};">${listItems}</ul>`;
              }
            }
            break;
          case 'heading':
            const headingLevel = element.headingLevel || 2;
            html += `<h${headingLevel} style="margin: 1.5rem 0 1rem; font-weight: bold; padding: 0.5rem; background-color: ${element.backgroundColor || 'transparent'}; color: ${element.textColor || 'inherit'}; border-radius: 0.5rem;">${element.content || ''}</h${headingLevel}>`;
            break;
          default:
            html += element.content || '';
        }

        // Cerramos el contenedor del elemento
        html += `</div>`;
      });

      // Cerramos la fila
      html += `</div>`;
    });

    return html;
  }

  // Cancelar y volver a la lista
  const handleCancel = () => {
    if (formData.title || formData.description || formData.layoutElements.length > 0) {
      if (window.confirm("¿Estás seguro que deseas cancelar? Los cambios no se guardarán.")) {
        setCurrentView("list")
      }
    } else {
      setCurrentView("list")
    }
  }

  // Renderizar resultados con listado o editor
  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado de la página */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
          >
            Editor Avanzado de Noticias
          </motion.h1>
          <motion.p
            className="mt-4 max-w-full mx-auto text-gray-600 text-base md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Crea y edita noticias con un diseño personalizado para el <span className="font-bold text-[#C40180]">Colegio Odontológico de Venezuela</span>
          </motion.p>
        </motion.div>

        {/* Contenido principal */}
        {currentView === "list" ? (
          // Lista de noticias
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-6 flex justify-end">
              <button
                onClick={handleCreateNews}
                className="px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-md flex items-center shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Crear Noticia
              </button>
            </div>

            {/* Componente de lista de noticias */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {news.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Título
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoría
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {news.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 mr-3">
                                <img
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={item.imageUrl || "/assets/placeholder-image.jpg"}
                                  alt=""
                                  onError={(e) => {
                                    e.target.src = "/assets/placeholder-image.jpg"
                                  }}
                                />
                              </div>
                              <div className="text-sm font-medium text-gray-900 line-clamp-1 max-w-xs">{item.title}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handlePreviewNews(item)}
                                className="p-1.5 text-purple-600 hover:text-purple-900 bg-purple-50 rounded-full"
                                title="Ver noticia"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleEditNews(item)}
                                className="p-1.5 text-indigo-600 hover:text-indigo-900 bg-indigo-50 rounded-full"
                                title="Editar"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteConfirm(item.id)}
                                className="p-1.5 text-red-600 hover:text-red-900 bg-red-50 rounded-full"
                                title="Eliminar"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <LayoutGrid className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No hay noticias</h3>
                  <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva noticia con el botón de arriba.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          // Editor avanzado de noticias
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Botón de volver */}
            <button
              onClick={handleCancel}
              className="mb-6 flex items-center text-gray-600 hover:text-[#C40180] transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver al listado
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Formulario avanzado */}
              <div className="lg:col-span-2 space-y-6">
                <FormEdit
                  formData={formData}
                  setFormData={setFormData}
                  onSave={handleSaveNews}
                  onCancel={handleCancel}
                  isSaving={isSaving}
                />
              </div>

              {/* Vista previa */}
              <div className="space-y-6">
                <PreviewSection news={formData} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Notificación */}
        {notification && (
          <Notification message={notification.message} type={notification.type} onClose={hideNotification} />
        )}

       {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && <DeleteConfirmation onDelete={handleDeleteNews} onCancel={handleCancelDelete} />}
        
        {/* Vista previa de noticia completa */}
        {previewItem && <FullPreview news={previewItem} onClose={handleClosePreview} />}
      </div>
    </div>
  )
}

export default NoticiasDasboard